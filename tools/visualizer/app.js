"use strict";
(function () {
  const DATA = (window.BENCH_DATA && window.BENCH_DATA.runs) || [];
  const PALETTE = ["#5aa9ff","#ff6b6b","#ffd166","#06d6a0","#c792ea","#f78c6c",
    "#80cbc4","#ff8fa3","#a9d18e","#7aa2f7","#e0af68","#bb9af7","#7dcfff","#9ece6a"];
  const LS_KEY = "strata_viz_v1";
  const PRESET = [4096, 16384, 65536, 131072, 256000];
  const $ = (id) => document.getElementById(id);
  const ALL_TARGETS = [...new Set(DATA.flatMap(r => (r.points || []).map(p => p.target)).filter(Boolean))].sort((a, b) => a - b);

  const state = { metric: "prompt_tps", xscale: "log",
    ctx: new Set(), gpu: new Set(), model: new Set(), slots: new Set(), streams: new Set(),
    sel: new Set(DATA.map(r => r.id)), cols: new Set(PRESET), showChat: true, showAgent: true };

  function color(i){ return PALETTE[i % PALETTE.length]; }
  function gpuCount(r){ return r.gpus_used || (r.gpu||[]).length || 1; }
  function gpuTag(r){
    const host = r.gpus_host || (r.gpu||[]).length || 1, used = gpuCount(r);
    return used < host ? `${host}×${used}× ${r.gpu_label||"?"}` : `${used}× ${r.gpu_label||"?"}`;
  }
  function ctxK(c){ return c ? Math.round(c/1024)+"K" : "?"; }
  function modelTag(r){
    const m = r.model || "";
    return m.replace(/-iq\d[^ ]*$/i, "").replace(/-ud$/, "-ud") || "?";
  }
  function runLabel(r){
    return `${gpuTag(r)} · ${modelTag(r)} · ctx ${ctxK(r.context)} · `+
      `${r.layout||((r.parallel||1)+" slots")}`+
      `${r.kind==="slots"&&r.expert_slots!=null? " · ec "+r.expert_slots : ""}`+
      `${r.note? " · "+r.note:""}${r.tag? " · #"+r.tag:""}`;
  }
  function layoutShort(r){ return `${r.parallel||1}s×${r.streams||1}str`; }
  function fmt(v){ return v==null ? "—" : (v>=100? Math.round(v) : (Math.round(v*100)/100)); }
  function kLabel(t){ return Math.round(t/1024)+"K"; }

  // ---- persistence ----
  function saveState(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify({
      metric:state.metric, xscale:state.xscale,
      ctx:[...state.ctx], gpu:[...state.gpu], model:[...state.model],
      slots:[...state.slots], streams:[...state.streams],
      sel:[...state.sel], known:DATA.map(r=>r.id), cols:[...state.cols], showChat:state.showChat, showAgent:state.showAgent
    })); }catch(e){}
  }
  function loadState(){
    try{
      const s = JSON.parse(localStorage.getItem(LS_KEY)||"null");
      if(!s) return;
      if(s.metric) state.metric=s.metric;
      if(s.xscale) state.xscale=s.xscale;
      const toSet = (v) => Array.isArray(v) ? new Set(v.map(String))
        : (typeof v==="string" && v!=="all" ? new Set([v]) : new Set());
      state.ctx=toSet(s.ctx); state.gpu=toSet(s.gpu); state.model=toSet(s.model);
      state.slots=toSet(s.slots); state.streams=toSet(s.streams);
      if(Array.isArray(s.sel)){
        state.sel=new Set(s.sel);
        const known = Array.isArray(s.known) ? new Set(s.known) : null;
        DATA.forEach(r=>{ if(!known || !known.has(r.id)) state.sel.add(r.id); });
      }
      if(Array.isArray(s.cols)) state.cols=new Set(s.cols);
      if(typeof s.showChat==="boolean") state.showChat=s.showChat;
      if(typeof s.showAgent==="boolean") state.showAgent=s.showAgent;
    }catch(e){}
  }

  // ---- controls ----
  function buildMulti(id, key, title, values, fmtv){
    const box=$(id);
    const det=document.createElement("details"); det.className="msel";
    const sum=document.createElement("summary");
    const upd=()=>{ const s=state[key];
      sum.textContent = s.size ? `${title}: ${[...s].map(fmtv).join(", ")}` : `${title}: все`; };
    const panel=document.createElement("div"); panel.className="msel-opts";
    values.forEach(v=>{
      const lab=document.createElement("label");
      const cb=document.createElement("input"); cb.type="checkbox"; cb.checked=state[key].has(String(v));
      cb.addEventListener("change",()=>{
        if(cb.checked) state[key].add(String(v)); else state[key].delete(String(v));
        upd(); saveState(); applyFilter(); render();
      });
      lab.appendChild(cb); lab.appendChild(document.createTextNode(" "+fmtv(v)));
      panel.appendChild(lab);
    });
    det.appendChild(sum); det.appendChild(panel); box.appendChild(det); upd();
  }

  function buildControls(){
    $("metric").value = state.metric;
    $("xscale").value = state.xscale;

    const uniq = (fn) => [...new Set(DATA.map(fn))].sort();
    const ctxs = [...new Set(DATA.map(r=>r.context).filter(Boolean))].sort((a,b)=>a-b).map(String);
    buildMulti("ctxFilter", "ctx", "Контекст", ctxs, v=>ctxK(Number(v)));
    buildMulti("gpuFilter", "gpu", "Карты", uniq(r=>gpuTag(r)), v=>v);
    buildMulti("modelFilter", "model", "Модель", uniq(r=>modelTag(r)), v=>v);
    buildMulti("slotFilter", "slots", "Слоты", uniq(r=>String(r.parallel||1)), v=>v+" слот.");
    buildMulti("streamFilter", "streams", "Стримы", uniq(r=>String(r.streams||1)), v=>v+" стрим.");

    const box = $("runs");
    DATA.forEach((r,i)=>{
      const lab = document.createElement("label");
      lab.className = "run"; lab.dataset.id = r.id;
      const on = state.sel.has(r.id);
      lab.innerHTML = `<input type="checkbox" ${on?"checked":""}><span class="sw" style="background:${color(i)}"></span>`+
        `<span>${runLabel(r)}</span> <span class="meta">${r.kind}</span>`;
      lab.classList.toggle("off", !on);
      lab.querySelector("input").addEventListener("change", e=>{
        if(e.target.checked) state.sel.add(r.id); else state.sel.delete(r.id);
        lab.classList.toggle("off", !e.target.checked);
        saveState(); render();
      });
      box.appendChild(lab);
    });
    $("metric").addEventListener("change", e=>{ state.metric=e.target.value; saveState(); render(); });
    $("xscale").addEventListener("change", e=>{ state.xscale=e.target.value; saveState(); render(); });
    $("allOn").addEventListener("click", ()=>setAll(true));
    $("allOff").addEventListener("click", ()=>setAll(false));
  }
  function setAll(on){
    document.querySelectorAll("#runs .run").forEach(lab=>{
      const cb=lab.querySelector("input"); cb.checked=on;
      const id=lab.dataset.id; if(on) state.sel.add(id); else state.sel.delete(id);
      lab.classList.toggle("off", !on);
    });
    saveState(); render();
  }
  function matchesFilters(r){
    const inSet=(set,v)=>!set.size||set.has(v);
    return inSet(state.ctx, String(r.context)) &&
      inSet(state.gpu, gpuTag(r)) &&
      inSet(state.model, modelTag(r)) &&
      inSet(state.slots, String(r.parallel||1)) &&
      inSet(state.streams, String(r.streams||1));
  }
  function applyFilter(){
    document.querySelectorAll("#runs .run").forEach(lab=>{
      const r = DATA.find(x=>x.id===lab.dataset.id);
      lab.style.display = matchesFilters(r) ? "" : "none";
    });
  }
  function visibleRuns(){
    return DATA.filter(r=>state.sel.has(r.id) && matchesFilters(r));
  }

  // ---- column config ----
  function buildCols(){
    const box = $("cols"); box.innerHTML="";
    ALL_TARGETS.forEach(t=>{
      const lab=document.createElement("label"); lab.className="col";
      const on=state.cols.has(t);
      lab.innerHTML=`<input type="checkbox" ${on?"checked":""}> ${kLabel(t)}`;
      lab.querySelector("input").addEventListener("change", e=>{
        if(e.target.checked) state.cols.add(t); else state.cols.delete(t);
        saveState(); buildTable();
      });
      box.appendChild(lab);
    });
    $("colChat").checked=state.showChat; $("colAgent").checked=state.showAgent;
    $("colChat").addEventListener("change", e=>{ state.showChat=e.target.checked; saveState(); buildTable(); });
    $("colAgent").addEventListener("change", e=>{ state.showAgent=e.target.checked; saveState(); buildTable(); });
    $("colsPreset").addEventListener("click", ()=>applyCols(PRESET));
    $("colsAll").addEventListener("click", ()=>applyCols(ALL_TARGETS));
  }
  function applyCols(list){
    state.cols=new Set(list.filter(t=>ALL_TARGETS.includes(t)));
    document.querySelectorAll("#cols .col").forEach((lab,i)=>{ lab.querySelector("input").checked=state.cols.has(ALL_TARGETS[i]); });
    saveState(); buildTable();
  }

  // ---- line chart ----
  const lineCanvas = $("lineChart");
  const tooltip = $("tooltip");
  let linePoints = [];

  function drawLineChart(){
    const cv=lineCanvas, ctx=cv.getContext("2d");
    const W=cv.width, H=cv.height, padL=64, padR=20, padT=20, padB=46;
    ctx.clearRect(0,0,W,H);
    const runs = visibleRuns().filter(r=>r.kind!=="slots");
    const metric = state.metric;
    const data = runs.map((r)=>{
      const pts = (r.points||[]).filter(p=>p[metric] && p[metric].median!=null && p.target)
        .map(p=>({x:p.target, y:p[metric].median, min:p[metric].min, max:p[metric].max,
                  label:p.label, color:color(DATA.indexOf(r)), run:r}));
      return {run:r, pts};
    }).filter(d=>d.pts.length);
    $("chartTitle").textContent = metricTitle(metric);
    if(!data.length){ ctx.fillStyle="#9aa4b2"; ctx.fillText("нет данных для этой метрики", padL, H/2); linePoints=[]; return; }

    const xs = data.flatMap(d=>d.pts.map(p=>p.x));
    const ys = data.flatMap(d=>d.pts.map(p=>p.y));
    const xMin=Math.min(...xs), xMax=Math.max(...xs);
    const yMax=Math.max(...ys)*1.08, yMin=0;
    const log = state.xscale==="log";
    const sx = x => log
      ? padL + (Math.log10(x)-Math.log10(xMin))/(Math.log10(xMax)-Math.log10(xMin))*(W-padL-padR)
      : padL + (x-xMin)/(xMax-xMin)*(W-padL-padR);
    const sy = y => H-padB - (y-yMin)/(yMax-yMin)*(H-padT-padB);

    ctx.strokeStyle="#2b313c"; ctx.fillStyle="#9aa4b2"; ctx.font="11px system-ui"; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const yv=yMin+(yMax-yMin)*i/5, yy=sy(yv);
      ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(W-padR,yy); ctx.stroke();
      ctx.textAlign="right"; ctx.fillText(fmt(yv), padL-8, yy+4);
    }
    const uniqX=[...new Set(xs)].sort((a,b)=>a-b);
    ctx.textAlign="center";
    uniqX.forEach(x=>{ const xx=sx(x); ctx.strokeStyle="#22262f";
      ctx.beginPath(); ctx.moveTo(xx,padT); ctx.lineTo(xx,H-padB); ctx.stroke();
      ctx.fillStyle="#9aa4b2"; ctx.fillText(kLabel(x), xx, H-padB+16); });

    linePoints=[];
    data.forEach(d=>{
      ctx.strokeStyle=d.pts[0].color; ctx.lineWidth=2; ctx.beginPath();
      d.pts.slice().sort((a,b)=>a.x-b.x).forEach((p,i)=>{
        const xx=sx(p.x), yy=sy(p.y); if(i===0) ctx.moveTo(xx,yy); else ctx.lineTo(xx,yy);
      });
      ctx.stroke();
      d.pts.forEach(p=>{
        const xx=sx(p.x), yy=sy(p.y);
        if(p.min!=null&&p.max!=null){ ctx.strokeStyle=p.color; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(xx,sy(p.min)); ctx.lineTo(xx,sy(p.max)); ctx.stroke(); }
        ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(xx,yy,3.5,0,7); ctx.fill();
        linePoints.push({xx,yy,p});
      });
    });
    ctx.fillStyle="#9aa4b2"; ctx.textAlign="center";
    ctx.fillText("размер промпта (токены)", (padL+W-padR)/2, H-6);
  }

  lineCanvas.addEventListener("mousemove", e=>{
    const rect=lineCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(lineCanvas.width/rect.width);
    const my=(e.clientY-rect.top)*(lineCanvas.height/rect.height);
    let best=null, bd=1e9;
    linePoints.forEach(pt=>{ const d=(pt.xx-mx)**2+(pt.yy-my)**2; if(d<bd){bd=d;best=pt;} });
    if(best && bd<400){
      const p=best.p;
      tooltip.style.display="block";
      tooltip.style.left=(best.xx*(rect.width/lineCanvas.width)+12)+"px";
      tooltip.style.top=(best.yy*(rect.height/lineCanvas.height)+12)+"px";
      tooltip.innerHTML=`<b style="color:${p.color}">${p.run.gpu_label} p${p.run.parallel||"?"}</b><br>`+
        `${p.label}: ${fmt(p.y)}<br>диапазон ${fmt(p.min)}–${fmt(p.max)}`;
    } else tooltip.style.display="none";
  });
  lineCanvas.addEventListener("mouseleave", ()=>tooltip.style.display="none");

  function metricTitle(m){
    return {prompt_tps:"Prompt tok/s (выше = лучше)",
      ttft_s:"TTFT, сек (ниже = лучше)",
      decode_tps:"Decode tok/s (выше = лучше)"}[m]||m;
  }

  // ---- bar chart ----
  function drawBarChart(){
    const cv=$("barChart"), ctx=cv.getContext("2d");
    const W=cv.width, H=cv.height, padL=64, padR=20, padT=20, padB=40;
    ctx.clearRect(0,0,W,H);
    const runs=visibleRuns();
    const cats=[{k:"chat",t:"Short chat"},{k:"agent",t:"Agent"}];
    const vals=[];
    runs.forEach(r=>cats.forEach(c=>{ const v=r[c]&&r[c].decode_tps&&r[c].decode_tps.median; if(v!=null) vals.push(v); }));
    if(!vals.length){ ctx.fillStyle="#9aa4b2"; ctx.fillText("нет данных", padL, H/2); return; }
    const yMax=Math.max(...vals)*1.1;
    const sy=y=>H-padB-(y/yMax)*(H-padT-padB);
    ctx.strokeStyle="#2b313c"; ctx.fillStyle="#9aa4b2"; ctx.font="11px system-ui";
    for(let i=0;i<=5;i++){ const yv=yMax*i/5, yy=sy(yv);
      ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(W-padR,yy); ctx.stroke();
      ctx.textAlign="right"; ctx.fillText(fmt(yv), padL-8, yy+4); }
    const groupW=(W-padL-padR)/cats.length;
    cats.forEach((c,ci)=>{
      const gx=padL+ci*groupW;
      const bars=runs.filter(r=>r[c]&&r[c].decode_tps&&r[c].decode_tps.median!=null);
      const bw=Math.min(46,(groupW-30)/Math.max(bars.length,1));
      bars.forEach((r,bi)=>{
        const v=r[c].decode_tps.median, col=color(DATA.indexOf(r));
        const x=gx+groupW/2-(bars.length*bw)/2+bi*bw;
        const y=sy(v);
        ctx.fillStyle=col; ctx.fillRect(x+1,y,bw-2,H-padB-y);
        ctx.fillStyle="#e6e9ef"; ctx.textAlign="center"; ctx.fillText(fmt(v), x+bw/2, y-4);
      });
      ctx.fillStyle="#9aa4b2"; ctx.textAlign="center"; ctx.fillText(c.t, gx+groupW/2, H-padB+18);
    });
  }

  // ---- combo chart: prefill (left axis) + decode (right axis) ----
  const comboCanvas = $("comboChart");
  const comboTooltip = $("comboTooltip");
  let comboPoints = [];

  function drawComboChart(){
    const cv=comboCanvas, ctx=cv.getContext("2d");
    const W=cv.width, H=cv.height, padL=64, padR=64, padT=20, padB=46;
    ctx.clearRect(0,0,W,H);
    const runs=visibleRuns().filter(r=>r.kind!=="slots");
    const series=runs.map(r=>{
      const pp=(r.points||[]).filter(p=>p.prompt_tps&&p.prompt_tps.median!=null&&p.target)
        .map(p=>({x:p.target,y:p.prompt_tps.median,min:p.prompt_tps.min,max:p.prompt_tps.max,label:p.label}));
      const dp=(r.points||[]).filter(p=>p.decode_tps&&p.decode_tps.median!=null&&p.target)
        .map(p=>({x:p.target,y:p.decode_tps.median,min:p.decode_tps.min,max:p.decode_tps.max,label:p.label}));
      return {r, pp, dp, color:color(DATA.indexOf(r))};
    }).filter(s=>s.pp.length||s.dp.length);
    const legend=$("comboLegend");
    legend.innerHTML = series.map(s=>`<span class="li" style="color:${s.color}">`+
      `<span class="sw" style="background:${s.color}"></span>`+
      `<span class="dash" style="color:${s.color}"></span>`+
      `<span style="color:var(--text)">${s.r.gpu_label} · ${layoutShort(s.r)}${s.r.tag?" #"+s.r.tag:""}</span></span>`).join("");
    if(!series.length){ ctx.fillStyle="#9aa4b2"; ctx.fillText("нет данных", padL, H/2); comboPoints=[]; return; }

    const xs=series.flatMap(s=>[...s.pp,...s.dp].map(p=>p.x));
    const xMin=Math.min(...xs), xMax=Math.max(...xs);
    const pMax=Math.max(1,...series.flatMap(s=>s.pp.map(p=>p.y)))*1.08;
    const dMax=Math.max(1,...series.flatMap(s=>s.dp.map(p=>p.y)))*1.08;
    const log=state.xscale==="log";
    const sx=x=>log
      ? padL+(Math.log10(x)-Math.log10(xMin))/(Math.log10(xMax)-Math.log10(xMin))*(W-padL-padR)
      : padL+(x-xMin)/(xMax-xMin)*(W-padL-padR);
    const syP=y=>H-padB-(y/pMax)*(H-padT-padB);
    const syD=y=>H-padB-(y/dMax)*(H-padT-padB);

    ctx.strokeStyle="#2b313c"; ctx.fillStyle="#9aa4b2"; ctx.font="11px system-ui"; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const yy=padT+(H-padT-padB)*i/5;
      ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(W-padR,yy); ctx.stroke();
      ctx.textAlign="right"; ctx.fillStyle="#5aa9ff"; ctx.fillText(fmt(pMax*(1-i/5)), padL-8, yy+4);
      ctx.textAlign="left"; ctx.fillStyle="#06d6a0"; ctx.fillText(fmt(dMax*(1-i/5)), W-padR+8, yy+4);
    }
    const uniqX=[...new Set(xs)].sort((a,b)=>a-b);
    ctx.textAlign="center";
    uniqX.forEach(x=>{ const xx=sx(x); ctx.strokeStyle="#22262f";
      ctx.beginPath(); ctx.moveTo(xx,padT); ctx.lineTo(xx,H-padB); ctx.stroke();
      ctx.fillStyle="#9aa4b2"; ctx.fillText(kLabel(x), xx, H-padB+16); });

    comboPoints=[];
    series.forEach(s=>{
      // prefill solid
      ctx.strokeStyle=s.color; ctx.lineWidth=2; ctx.setLineDash([]); ctx.beginPath();
      s.pp.slice().sort((a,b)=>a.x-b.x).forEach((p,i)=>{ const xx=sx(p.x),yy=syP(p.y); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); });
      ctx.stroke();
      // decode dashed
      ctx.strokeStyle=s.color; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.beginPath();
      s.dp.slice().sort((a,b)=>a.x-b.x).forEach((p,i)=>{ const xx=sx(p.x),yy=syD(p.y); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); });
      ctx.stroke(); ctx.setLineDash([]);
      s.pp.forEach(p=>{ const xx=sx(p.x),yy=syP(p.y);
        ctx.fillStyle=s.color; ctx.beginPath(); ctx.arc(xx,yy,3.2,0,7); ctx.fill();
        comboPoints.push({xx,yy,p,kind:"prefill",color:s.color,run:s.r}); });
      s.dp.forEach(p=>{ const xx=sx(p.x),yy=syD(p.y);
        ctx.fillStyle=s.color; ctx.fillRect(xx-2.5,yy-2.5,5,5);
        comboPoints.push({xx,yy,p,kind:"decode",color:s.color,run:s.r}); });
    });
    ctx.fillStyle="#5aa9ff"; ctx.textAlign="left"; ctx.fillText("Prompt tok/s", padL, 12);
    ctx.fillStyle="#06d6a0"; ctx.textAlign="right"; ctx.fillText("Decode tok/s", W-padR, 12);
    ctx.fillStyle="#9aa4b2"; ctx.textAlign="center"; ctx.fillText("размер промпта (токены)", (padL+W-padR)/2, H-6);
  }

  comboCanvas.addEventListener("mousemove", e=>{
    const rect=comboCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(comboCanvas.width/rect.width);
    const my=(e.clientY-rect.top)*(comboCanvas.height/rect.height);
    let best=null, bd=1e9;
    comboPoints.forEach(pt=>{ const d=(pt.xx-mx)**2+(pt.yy-my)**2; if(d<bd){bd=d;best=pt;} });
    if(best && bd<400){
      const p=best.p;
      comboTooltip.style.display="block";
      comboTooltip.style.left=(best.xx*(rect.width/comboCanvas.width)+12)+"px";
      comboTooltip.style.top=(best.yy*(rect.height/comboCanvas.height)+12)+"px";
      comboTooltip.innerHTML=`<b style="color:${best.color}">${best.run.gpu_label} p${best.run.parallel||"?"}</b><br>`+
        `${best.kind==="prefill"?"Prefill":"Decode"} ${p.label}: ${fmt(p.y)}<br>диапазон ${fmt(p.min)}–${fmt(p.max)}`;
    } else comboTooltip.style.display="none";
  });
  comboCanvas.addEventListener("mouseleave", ()=>comboTooltip.style.display="none");

  // ---- slots chart: multi-stream load (total vs per-stream) ----
  const slotsCanvas = $("slotsChart");
  const slotsTooltip = $("slotsTooltip");
  let slotsPoints = [];

  function drawSlotsChart(){
    const cv=slotsCanvas, ctx=cv.getContext("2d");
    const W=cv.width, H=cv.height, padL=64, padR=20, padT=20, padB=46;
    ctx.clearRect(0,0,W,H);
    const runs=visibleRuns().filter(r=>r.kind==="slots");
    const series=runs.map(r=>{
      const pts=(r.points||[]).filter(p=>p.target&&(p.total_prompt_tps||p.prompt_tps))
        .map(p=>({x:p.target, label:p.label,
          total:p.total_prompt_tps&&p.total_prompt_tps.median,
          tmin:p.total_prompt_tps&&p.total_prompt_tps.min,
          tmax:p.total_prompt_tps&&p.total_prompt_tps.max,
          per:p.prompt_tps&&p.prompt_tps.median,
          scaling:p.scaling, ttft50:p.ttft_s&&p.ttft_s.median, ttft95:p.ttft_s&&p.ttft_s.max}));
      return {r, pts, color:color(DATA.indexOf(r))};
    }).filter(s=>s.pts.length);
    const legend=$("slotsLegend");
    legend.innerHTML = series.length
      ? `<div class="legend-note"><span class="li"><span class="sw solid"></span><b>сплошная линия</b> — суммарный префил всех стримов (сумма по GPU)</span>`+
        `<span class="li"><span class="sw dashline"></span><b>пунктирная линия</b> — префил одного стрима (на каждый запрос)</span></div>`+
        series.map(s=>`<span class="li"><span class="sw" style="background:${s.color}"></span>`+
        `<span style="color:var(--text)">${s.r.layout||layoutShort(s.r)}`+
        `${s.r.expert_slots!=null?" · ec "+s.r.expert_slots:""} · #${s.r.tag||s.r.id.replace(/^2026-10-19-slots-/,"")}</span></span>`).join("")
      : "";
    if(!series.length){ ctx.fillStyle="#9aa4b2"; ctx.fillText("нет многослотовых прогонов (slots)", padL, H/2); slotsPoints=[]; return; }

    const xs=series.flatMap(s=>s.pts.map(p=>p.x));
    const ys=series.flatMap(s=>s.pts.flatMap(p=>[p.total,p.per].filter(v=>v!=null)));
    const xMin=Math.min(...xs), xMax=Math.max(...xs), yMax=Math.max(...ys)*1.08;
    const log=state.xscale==="log";
    const sx=x=>log
      ? padL+(Math.log10(x)-Math.log10(xMin))/(Math.log10(xMax)-Math.log10(xMin))*(W-padL-padR)
      : padL+(x-xMin)/(xMax-xMin)*(W-padL-padR);
    const sy=y=>H-padB-(y/yMax)*(H-padT-padB);

    ctx.strokeStyle="#2b313c"; ctx.fillStyle="#9aa4b2"; ctx.font="11px system-ui"; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const yv=yMax*i/5, yy=sy(yv);
      ctx.beginPath(); ctx.moveTo(padL,yy); ctx.lineTo(W-padR,yy); ctx.stroke();
      ctx.textAlign="right"; ctx.fillText(fmt(yv), padL-8, yy+4);
    }
    const uniqX=[...new Set(xs)].sort((a,b)=>a-b);
    ctx.textAlign="center";
    uniqX.forEach(x=>{ const xx=sx(x); ctx.strokeStyle="#22262f";
      ctx.beginPath(); ctx.moveTo(xx,padT); ctx.lineTo(xx,H-padB); ctx.stroke();
      ctx.fillStyle="#9aa4b2"; ctx.fillText(kLabel(x), xx, H-padB+16); });

    slotsPoints=[];
    series.forEach(s=>{
      ctx.strokeStyle=s.color; ctx.lineWidth=2; ctx.setLineDash([]); ctx.beginPath();
      s.pts.filter(p=>p.total!=null).sort((a,b)=>a.x-b.x).forEach((p,i)=>{ const xx=sx(p.x),yy=sy(p.total); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); });
      ctx.stroke();
      ctx.setLineDash([6,4]); ctx.beginPath();
      s.pts.filter(p=>p.per!=null).sort((a,b)=>a.x-b.x).forEach((p,i)=>{ const xx=sx(p.x),yy=sy(p.per); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); });
      ctx.stroke(); ctx.setLineDash([]);
      s.pts.forEach(p=>{
        if(p.total!=null){ const xx=sx(p.x),yy=sy(p.total);
          ctx.fillStyle=s.color; ctx.beginPath(); ctx.arc(xx,yy,3.2,0,7); ctx.fill();
          slotsPoints.push({xx,yy,p,color:s.color,run:s.r}); }
      });
    });
    ctx.fillStyle="#9aa4b2"; ctx.textAlign="center";
    ctx.fillText("размер промпта на стрим (токены)", (padL+W-padR)/2, H-6);
  }

  slotsCanvas.addEventListener("mousemove", e=>{
    const rect=slotsCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(slotsCanvas.width/rect.width);
    const my=(e.clientY-rect.top)*(slotsCanvas.height/rect.height);
    let best=null, bd=1e9;
    slotsPoints.forEach(pt=>{ const d=(pt.xx-mx)**2+(pt.yy-my)**2; if(d<bd){bd=d;best=pt;} });
    if(best && bd<400){
      const p=best.p;
      slotsTooltip.style.display="block";
      slotsTooltip.style.left=(best.xx*(rect.width/slotsCanvas.width)+12)+"px";
      slotsTooltip.style.top=(best.yy*(rect.height/slotsCanvas.height)+12)+"px";
      slotsTooltip.innerHTML=`<b style="color:${best.color}">${best.run.layout||layoutShort(best.run)}</b><br>`+
        `${p.label}: суммарно ${fmt(p.total)}, на стрим ${fmt(p.per)}<br>`+
        `scaling ${p.scaling!=null?p.scaling:"—"}× · TTFT p50 ${fmt(p.ttft50)} / p95 ${fmt(p.ttft95)} с`;
    } else slotsTooltip.style.display="none";
  });
  slotsCanvas.addEventListener("mouseleave", ()=>slotsTooltip.style.display="none");

  // ---- table (transposed: rows = runs, cols = context depths) ----
  function buildTable(){
    const runs=visibleRuns();
    const metric=state.metric;
    const cols=ALL_TARGETS.filter(t=>state.cols.has(t));
    let html='<div class="scroll"><table><thead><tr><th>Прогон</th>';
    cols.forEach(t=>{ html+=`<th>${kLabel(t)}</th>`; });
    if(metric==="decode_tps"){
      if(state.showChat) html+='<th>Short chat</th>';
      if(state.showAgent) html+='<th>Agent</th>';
    }
    html+='</tr></thead><tbody>';
    runs.forEach(r=>{
      html+=`<tr><td><span style="color:${color(DATA.indexOf(r))}">●</span> ${runLabel(r)}</td>`;
      cols.forEach(t=>{ const p=(r.points||[]).find(x=>x.target===t);
        html+=`<td>${p&&p[metric]?fmt(p[metric].median):"—"}</td>`; });
      if(metric==="decode_tps"){
        if(state.showChat){ const v=r.chat&&r.chat.decode_tps&&r.chat.decode_tps.median; html+=`<td>${fmt(v)}</td>`; }
        if(state.showAgent){ const v=r.agent&&r.agent.decode_tps&&r.agent.decode_tps.median; html+=`<td>${fmt(v)}</td>`; }
      }
      html+='</tr>';
    });
    html+='</tbody></table></div>';
    $("table").innerHTML=html;
  }

  function render(){ drawLineChart(); drawComboChart(); drawSlotsChart(); drawBarChart(); buildTable(); }

  loadState();
  buildControls();
  buildCols();
  applyFilter();
  render();
  $("footer").textContent = `Загружено прогонов: ${DATA.length}. Источник: ${window.BENCH_DATA.generated_from}. `+
    `Настройки (метрика, прогоны, столбцы) сохраняются в localStorage. Новый бенч: results.json в папку + build_data.py.`;
})();
