/* ============================================================
   Call Flow concept - the node canvas
   Auto-layout tidy tree: x from subtree widths, y from measured
   node heights per depth row. Edges drawn in a single SVG.
   ============================================================ */
const { Icon } = window;

const CF_W = 236;            // node card width
const CF_GAP_X = 36;         // horizontal gap between sibling subtrees
const CF_GAP_Y = 64;         // vertical gap between depth rows
const CF_PAD = 60;           // world padding

/* deterministic pseudo-random bars for mini waveforms */
function cfBars(seed, n){
  let s = 0; for(const ch of String(seed)) s = (s*31 + ch.charCodeAt(0)) >>> 0;
  const out = [];
  for(let i=0;i<n;i++){ s = (s*1103515245 + 12345) >>> 0; out.push(5 + (s % 13)); }
  return out;
}
function CfWave({ seed, n=26 }){
  const bars = React.useMemo(()=>cfBars(seed,n),[seed,n]);
  return <span className="wave">{bars.map((h,i)=><i key={i} style={{height:h}}></i>)}</span>;
}

/* ---------- layout ---------- */
function cfLayout(root, heights){
  const H = (n)=>heights[n.id] || 120;
  // subtree width
  const wMap = {};
  (function width(n){
    const kids = n.children||[];
    const kw = kids.reduce((s,c)=>s+width(c),0) + Math.max(0,kids.length-1)*CF_GAP_X;
    wMap[n.id] = Math.max(CF_W, kw);
    return wMap[n.id];
  })(root);
  // row heights per depth
  const rowH = [];
  (function depth(n,d){
    rowH[d] = Math.max(rowH[d]||0, H(n));
    (n.children||[]).forEach(c=>depth(c,d+1));
  })(root,0);
  const rowY = [CF_PAD];
  for(let d=1;d<rowH.length;d++) rowY[d] = rowY[d-1] + rowH[d-1] + CF_GAP_Y;
  // x positions: center node over its children block
  const nodes = [], edges = [];
  (function place2(n,d,x0){
    const w = wMap[n.id];
    const kids = n.children||[];
    const kw = kids.reduce((s,c)=>s+wMap[c.id],0) + Math.max(0,kids.length-1)*CF_GAP_X;
    const x = x0 + w/2 - CF_W/2;
    const y = rowY[d];
    nodes.push({ n, d, x, y });
    let cx = x0 + (w - kw)/2;
    kids.forEach(c=>{
      edges.push({ from:n, to:c, x1:x + CF_W/2, y1:y + H(n), x2: cx + wMap[c.id]/2, y2: rowY[d+1] });
      place2(c, d+1, cx);
      cx += wMap[c.id] + CF_GAP_X;
    });
  })(root,0,CF_PAD);
  const worldW = wMap[root.id] + CF_PAD*2;
  const worldH = rowY[rowY.length-1] + rowH[rowH.length-1] + CF_PAD + 40;
  return { nodes, edges, worldW, worldH };
}

function cfEdgePath(e, style){
  const { x1,y1,x2,y2 } = e;
  if(Math.abs(x1-x2) < 2) return `M ${x1} ${y1} L ${x2} ${y2}`;
  if(style==='curved'){
    const dy = (y2-y1)*0.55;
    return `M ${x1} ${y1} C ${x1} ${y1+dy}, ${x2} ${y2-dy}, ${x2} ${y2}`;
  }
  const midY = y1 + (y2-y1)/2;
  const r = Math.min(10, Math.abs(x2-x1)/2);
  const s = x2 > x1 ? 1 : -1;
  return `M ${x1} ${y1} L ${x1} ${midY-r} Q ${x1} ${midY} ${x1+s*r} ${midY} L ${x2-s*r} ${midY} Q ${x2} ${midY} ${x2} ${midY+r} L ${x2} ${y2}`;
}

/* ---------- node card ---------- */
function CfDestRow({ d }){
  const ic = d.kind==='app' ? 'smartphone' : d.kind==='cell' ? 'smartphone' : d.kind==='desk' ? 'monitor' : 'phone';
  return (
    <div className="cf-row">
      <span className="cf-ric"><Icon name={ic}/></span>
      <span className="cf-rtxt"><b>{d.label}</b><span>{d.sub}</span></span>
    </div>
  );
}

function CfNodeCard({ n, isRoot, sel, onSelect, onKebab, compact }){
  const kids = n.children||[];
  const body = [];
  if(n.type==='menu'){
    body.push(
      <div className="cf-row" key="wave">
        <span className="cf-playbtn"><Icon name="play"/></span>
        <span className="cf-wave-mini"><CfWave seed={n.id}/></span>
        <span className="cf-dur">{n.greeting && n.greeting.kind==='audio' ? n.greeting.dur : 'AI'}</span>
      </div>
    );
    if(!compact && n.greeting && n.greeting.text) body.push(<p className="cf-quote" key="q">“{n.greeting.text}”</p>);
    body.push(<span className="cf-ft" key="ft"><Icon name="audiolines"/>{kids.length ? `Menu · ${kids.length} option${kids.length>1?'s':''}` : 'Greeting · no options yet'}</span>);
  } else if(n.type==='ext'){
    (n.dests||[]).slice(0,2).forEach((d,i)=>body.push(<CfDestRow d={d} key={'d'+i}/>));
    if((n.dests||[]).length>2) body.push(<span className="cf-ft" key="more" style={{color:'var(--muted)'}}>+{n.dests.length-2} more</span>);
    if(!(n.dests||[]).length) body.push(<p className="cf-quote" key="q" style={{color:'var(--muted)'}}>No destinations yet - add who should ring.</p>);
    body.push(<span className="cf-ft" key="ft"><Icon name="phone"/>{(n.dests||[]).length>1 ? `Rings ${n.dests.length} ${n.ring==='all'?'at once':'in order'}` : 'Call'}</span>);
  } else if(n.type==='vm'){
    body.push(
      <div className="cf-row" key="vm">
        <span className="cf-ric"><Icon name="voicemail"/></span>
        <span className="cf-rtxt"><b>Takes a message</b><span>{(n.emails||[]).length ? `Sends to ${(n.emails||[]).length} email${(n.emails||[]).length>1?'s':''}` : 'No email alerts'}</span></span>
      </div>
    );
    body.push(<span className="cf-ft" key="ft"><Icon name="voicemail"/>Voicemail</span>);
  } else if(n.type==='text'){
    if(!compact) body.push(<p className="cf-quote" key="q">“{n.message}”</p>);
    body.push(<span className="cf-ft" key="ft"><Icon name="message"/>Auto-text</span>);
  } else {
    body.push(<span className="cf-ft" key="ft"><Icon name="route"/>Back to {n.target||'Main Greeting'}</span>);
  }
  return (
    <React.Fragment>
      <div className="cf-node-h">
        {isRoot ? <span className="cf-tic"><Icon name="phone"/></span> : <span className="cf-key">{n.key}</span>}
        <span className="cf-name">{n.name}</span>
        <button className="cf-kebab" onClick={(e)=>{ e.stopPropagation(); onKebab(n, e); }} aria-label="Node options"><Icon name="more"/></button>
      </div>
      <div className="cf-node-b">{body}</div>
    </React.Fragment>
  );
}

/* ---------- canvas ---------- */
function FlowCanvas({ root, sel, onSelect, onOpenAdd, onKebab, edgeStyle='square', dots=true, compact=false, tinted=false }){
  const wrapRef = React.useRef(null);
  const [heights, setHeights] = React.useState({});
  const [view, setView] = React.useState({ x:0, y:0, k:1 });
  const [panning, setPanning] = React.useState(false);
  const nodeRefs = React.useRef({});
  const fitted = React.useRef(false);

  const lay = React.useMemo(()=>cfLayout(root, heights), [root, heights, compact]);

  // measure node heights after render
  React.useLayoutEffect(()=>{
    const next = {};
    let changed = false;
    lay.nodes.forEach(({n})=>{
      const el = nodeRefs.current[n.id];
      if(el){ next[n.id] = el.offsetHeight; if(Math.abs((heights[n.id]||0)-el.offsetHeight)>1) changed = true; }
    });
    if(changed) setHeights(h=>({...h, ...next}));
  });

  const fit = React.useCallback(()=>{
    const el = wrapRef.current; if(!el) return;
    const vw = el.clientWidth, vh = el.clientHeight;
    const k = Math.min(1, (vw-40)/lay.worldW, (vh-40)/lay.worldH);
    setView({ k, x:(vw - lay.worldW*k)/2, y: Math.max(10,(vh - lay.worldH*k)/2) });
  },[lay.worldW, lay.worldH]);

  // first fit once heights are measured
  React.useEffect(()=>{
    if(!fitted.current && Object.keys(heights).length){ fitted.current = true; fit(); }
  },[heights, fit]);

  // pan by dragging the background
  const onDown = (e)=>{
    if(e.target.closest('.cf-node') || e.target.closest('.cf-port') || e.target.closest('.cf-rail') || e.target.closest('.cf-menu')) return;
    const sx = e.clientX, sy = e.clientY, v0 = view;
    setPanning(true);
    const move = (ev)=>setView({ ...v0, x: v0.x + ev.clientX - sx, y: v0.y + ev.clientY - sy });
    const up = ()=>{ setPanning(false); window.removeEventListener('mousemove',move); window.removeEventListener('mouseup',up); };
    window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
    onSelect(null);
  };
  const zoom = (dir)=>setView(v=>{
    const k = Math.min(1.6, Math.max(0.35, v.k * (dir>0?1.18:1/1.18)));
    const el = wrapRef.current; const cx = el.clientWidth/2, cy = el.clientHeight/2;
    return { k, x: cx-(cx-v.x)*(k/v.k), y: cy-(cy-v.y)*(k/v.k) };
  });
  const onWheel = (e)=>{
    e.preventDefault();
    if(e.ctrlKey || e.metaKey){
      const k = Math.min(1.6, Math.max(0.35, view.k * (e.deltaY<0?1.08:1/1.08)));
      const r = wrapRef.current.getBoundingClientRect();
      const cx = e.clientX-r.left, cy = e.clientY-r.top;
      setView(v=>({ k, x: cx-(cx-v.x)*(k/v.k), y: cy-(cy-v.y)*(k/v.k) }));
    } else {
      setView(v=>({ ...v, x:v.x-e.deltaX, y:v.y-e.deltaY }));
    }
  };

  const H = (id)=>heights[id]||120;

  return (
    <div ref={wrapRef} className={`cf-canvas${dots?' dots':''}${panning?' panning':''}${compact?' compact':''}${tinted?' tinted':''}`} onMouseDown={onDown} onWheel={onWheel}>
      <div className="cf-rail">
        <button onClick={()=>zoom(1)} title="Zoom in"><Icon name="plus"/></button>
        <span className="cf-zoom-pct">{Math.round(view.k*100)}%</span>
        <button onClick={()=>zoom(-1)} title="Zoom out"><Icon name="minus"/></button>
        <button onClick={fit} title="Fit to view"><Icon name="disc"/></button>
      </div>

      <div className="cf-world" style={{ transform:`translate(${view.x}px,${view.y}px) scale(${view.k})`, width:lay.worldW, height:lay.worldH }}>
        <svg className="cf-edges" width={lay.worldW} height={lay.worldH}>
          {lay.edges.map((e,i)=><path key={i} d={cfEdgePath(e, edgeStyle)}/>)}
        </svg>
        {lay.nodes.map(({n,d,x,y})=>(
          <div key={n.id}
            ref={el=>{ nodeRefs.current[n.id]=el; }}
            role="button" tabIndex={0}
            className={`cf-node${sel===n.id?' sel':''}`} data-t={n.type} data-root={n.id==='root'?'1':undefined}
            style={{ left:x, top:y, width:CF_W }}
            onClick={(e)=>{ e.stopPropagation(); onSelect(n.id); }}
            onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); onSelect(n.id); } }}>
            <CfNodeCard n={n} isRoot={n.id==='root'} compact={compact} onKebab={onKebab}/>
          </div>
        ))}
        {/* + ports under menu nodes */}
        {lay.nodes.filter(({n})=>n.type==='menu').map(({n,x,y})=>(
          <button key={'p'+n.id} className="cf-port"
            style={{ left:x + CF_W/2 - 13, top:y + H(n.id) - 1 }}
            title="Add an option"
            onClick={(e)=>{ e.stopPropagation(); onOpenAdd(n.id, e); }}>
            <Icon name="plus"/>
          </button>
        ))}
        {/* empty-state hint next to a lone root */}
        {(root.children||[]).length===0 && lay.nodes.length===1 && (
          <div className="cf-hint" style={{ left: lay.nodes[0].x + CF_W + 28, top: lay.nodes[0].y + 18 }}>
            <Icon name="info"/>
            <span>Right now every caller hears your greeting and the call ends. Press <b>+</b> below the greeting to add your first option.</span>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FlowCanvas, CfWave, CF_W });
