/* ============================================================
   JOEL app - System Map VERTICAL (exports window.SystemMapVertical)
   Same tree as SystemMap but flowing top → bottom so the page
   scrolls down rather than sideways:
     numbers (top row) → main greeting → extensions → phones each rings.
   A number that points straight at an extension draws a gold line
   down the side, skipping the greeting. Connector lines are drawn
   live from real DOM positions with orthogonal (flowchart) elbows.
   ============================================================ */
const { Icon: V_Icon } = window;
const V_useState = React.useState, V_useRef = React.useRef, V_useLayoutEffect = React.useLayoutEffect, V_useCallback = React.useCallback;

function vDest(str){
  const base = String(str);
  const main = base.replace(/\s*-.*/, '').trim();
  const tail = base.includes('-') ? base.replace(/.*-\s*/, '').trim() : '';
  if(/mobile app/i.test(base)) return { icon:'smartphone', label:main, kind:'JOEL app' };
  if(/\d{3}.*\d{3}|\d{3}-\d{4}|\(\d{3}\)/.test(main)) return { icon:'phone', label:main, kind: tail || 'Phone' };
  if(/cell|mobile/i.test(base)) return { icon:'smartphone', label:main, kind: tail || 'Cell' };
  return { icon:'monitor', label:main, kind: tail || 'Desk phone' };
}
const V_ROUTING = { order:'in order', all:'all at once', single:'' };

function SystemMapVertical({ businessName, numbers, extensions, greeting, hours, onGo, onOpenExt, selected }){
  const wrapRef = V_useRef(null);
  const nodeRefs = V_useRef({});
  const [paths, setPaths] = V_useState([]);
  const [dims, setDims] = V_useState({ w:0, h:0 });
  const [hot, setHot] = V_useState(null);

  const nums = numbers || [];
  const exts = extensions || [];
  const directTargets = {};
  nums.forEach(n => { if(n.routesTo && n.routesTo !== 'main') directTargets[String(n.routesTo)] = true; });

  const setNode = (id) => (el) => { if(el) nodeRefs.current[id] = el; else delete nodeRefs.current[id]; };

  const recompute = V_useCallback(() => {
    const wrap = wrapRef.current;
    if(!wrap) return;
    const cr = wrap.getBoundingClientRect();
    const sx = wrap.scrollLeft, sy = wrap.scrollTop;
    const A = (id) => {
      const el = nodeRefs.current[id];
      if(!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left:r.left-cr.left+sx, right:r.right-cr.left+sx, top:r.top-cr.top+sy, bottom:r.bottom-cr.top+sy,
        cx:r.left-cr.left+sx+r.width/2, cy:r.top-cr.top+sy+r.height/2,
      };
    };
    const R = 12; // corner radius for elbows
    // vertical-first elbow: from a (going down) to b, turning at midY
    const vElbow = (a, b, kind, ext) => {
      const x1=a.cx, y1=a.bottom, x2=b.cx, y2=b.top;
      const my=(y1+y2)/2;
      const dir = x2>=x1?1:-1;
      const d = `M ${x1} ${y1} L ${x1} ${my-R} Q ${x1} ${my} ${x1+dir*R} ${my} L ${x2-dir*R} ${my} Q ${x2} ${my} ${x2} ${my+R} L ${x2} ${y2}`;
      return { d, kind, ext };
    };
    const out = [];

    // greeting anchors
    const greet = A('greet');

    // 1 - numbers → greeting (or → ext directly)
    nums.forEach((n, i) => {
      const a = A(`num-${i}`); if(!a) return;
      if(n.routesTo && n.routesTo !== 'main'){
        const b = A(`ext-${n.routesTo}`); if(!b) return;
        // gold route down the RIGHT channel, skipping the greeting
        const ch = b.right + 30;
        const y1=a.bottom, x1=a.cx, yT=b.cy;
        const d = `M ${x1} ${y1} L ${x1} ${y1+22} L ${ch} ${y1+22} L ${ch} ${yT} L ${b.right} ${yT}`;
        out.push({ d, kind:'direct', ext:String(n.routesTo) });
      } else if(greet){
        out.push(vElbow(a, greet, 'main'));
      }
    });

    // 2 - greeting → each extension, via a left spine bracket
    const extAnchors = exts.map(e => ({ e, a:A(`ext-${e.number}`) })).filter(o=>o.a);
    const dirA = A('ext-9');
    const allExt = extAnchors.map(o=>o.a).concat(dirA?[dirA]:[]);
    if(greet && allExt.length){
      const xSpine = Math.min(...allExt.map(a=>a.left)) - 30;
      const topY = greet.bottom + 16;
      const botY = Math.max(...allExt.map(a=>a.cy));
      // greeting down to spine top
      out.push({ d:`M ${greet.cx} ${greet.bottom} L ${greet.cx} ${topY-R} Q ${greet.cx} ${topY} ${greet.cx-R} ${topY} L ${xSpine+R} ${topY} Q ${xSpine} ${topY} ${xSpine} ${topY+R}`, kind:'main' });
      // the vertical spine
      out.push({ d:`M ${xSpine} ${topY} L ${xSpine} ${botY}`, kind:'main' });
      // stubs into each extension
      extAnchors.forEach(({e,a})=>{
        out.push({ d:`M ${xSpine} ${a.cy} L ${a.left} ${a.cy}`, kind: e.status==='disabled'?'menu-off':'menu', ext:String(e.number) });
      });
      if(dirA) out.push({ d:`M ${xSpine} ${dirA.cy} L ${dirA.left} ${dirA.cy}`, kind:'menu' });
    }

    // 3 - each extension → its phones (horizontal curves)
    exts.forEach(e => {
      const a = A(`ext-${e.number}`); if(!a) return;
      const off = e.status==='disabled';
      (e.dests||[]).forEach((_, di) => {
        const b = A(`dest-${e.number}-${di}`); if(!b) return;
        const x1=a.right, y1=a.cy, x2=b.left, y2=b.cy, dx=Math.max(24,(x2-x1)*0.5);
        out.push({ d:`M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`, kind: off?'leaf-off':'leaf', ext:String(e.number) });
      });
      if((e.dests||[]).length===0){
        const b = A(`dest-${e.number}-0`); if(b){ const x1=a.right,y1=a.cy,x2=b.left,y2=b.cy,dx=Math.max(24,(x2-x1)*0.5);
          out.push({ d:`M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`, kind:'leaf-off', ext:String(e.number) }); }
      }
    });

    setPaths(out);
    setDims({ w: wrap.scrollWidth, h: wrap.scrollHeight });
  }, [numbers, extensions]);

  V_useLayoutEffect(() => {
    recompute();
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(() => recompute());
    if(wrap) ro.observe(wrap);
    Object.values(nodeRefs.current).forEach(el => el && ro.observe(el));
    window.addEventListener('resize', recompute);
    const t1 = setTimeout(recompute, 120);
    const t2 = setTimeout(recompute, 420);
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); clearTimeout(t1); clearTimeout(t2); };
  }, [recompute]);

  const smsLabel = (sms) => sms==='approved'?'Calls + texts':sms==='pending'?'Calls · texts pending':'Calls only';

  return (
    <div className="vmap">
      <div className="lv-head">
        <div>
          <h1 className="lv-title">System map</h1>
          <p className="lv-sub">The same tree, top to bottom - scroll down to follow a call from your numbers, through the greeting, out to each extension and the phones it rings.</p>
        </div>
        <div className="vmap-legend">
          <span className="vmap-leg"><i className="vmap-leg-line main"/> Reaches greeting</span>
          <span className="vmap-leg"><i className="vmap-leg-line direct"/> Skips to extension</span>
          <span className="vmap-leg"><i className="vmap-leg-line leaf"/> Rings a phone</span>
        </div>
      </div>

      <div className="vmap-stage" ref={wrapRef}>
        <svg className="vmap-wires" width={dims.w} height={dims.h} aria-hidden="true">
          <defs>
            <marker id="vm-arrow-main" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="vm-arrow-menu" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="#9aa6f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="vm-arrow-direct" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="vm-dot-leaf" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5"><circle cx="3.5" cy="3.5" r="2.4" fill="var(--muted)"/></marker>
          </defs>
          {paths.map((p, i) => {
            const dim = hot && p.ext && p.ext !== hot;
            const lit = hot && p.ext === hot;
            return (
              <path key={i} d={p.d} className={`vmap-wire ${p.kind}${dim?' is-dim':''}${lit?' is-lit':''}`}
                markerEnd={p.kind==='direct'?'url(#vm-arrow-direct)':p.kind==='menu'?'url(#vm-arrow-menu)':p.kind==='leaf'?'url(#vm-dot-leaf)':undefined}/>
            );
          })}
        </svg>

        <div className="vmap-flow">
          {/* TIER 1 - NUMBERS */}
          <div className="vmap-tier"><span className="ic n"><V_Icon name="hashnum"/></span> Your numbers</div>
          <div className="vmap-nums">
            {nums.map((n, i) => {
              const direct = n.routesTo && n.routesTo !== 'main';
              const target = direct ? exts.find(e => String(e.number)===String(n.routesTo)) : null;
              return (
                <div className={`vmap-node num${direct?' direct':''}`} ref={setNode(`num-${i}`)} key={n.num}
                  onMouseEnter={()=>direct&&setHot(String(n.routesTo))} onMouseLeave={()=>setHot(null)}>
                  <div className="vmap-numrow"><span className="vmap-numdot"/><span className="vmap-num">{n.num}</span></div>
                  <div className="vmap-nummeta">{n.label}{n.label.toLowerCase()!==n.type.toLowerCase()?` · ${n.type}`:''} · {smsLabel(n.sms)}</div>
                  {direct && <div className="vmap-numroute"><V_Icon name="forward"/> Rings Ext {target?target.number:n.routesTo}{target?` · ${target.name}`:''} directly</div>}
                </div>
              );
            })}
          </div>

          <div className="vmap-gap-a"/>

          {/* TIER 2 - GREETING */}
          <div className="vmap-greetwrap">
            <div className={`vmap-greet${selected&&selected.kind==='greeting'?' is-sel':''}`} ref={setNode('greet')}>
              <div className="vmap-greet-badge"><V_Icon name="audiolines"/> AI voice · {businessName}</div>
              <p className="vmap-greet-text">“{greeting}”</p>
              <div className="vmap-greet-foot">
                <span className="vmap-greet-hours"><V_Icon name="clock"/> {hours}</span>
                <button className="vmap-greet-edit" onClick={()=>onGo&&onGo('greetings')}>Edit</button>
              </div>
              <div className="vmap-greet-route"><V_Icon name="route"/> Caller dials an extension or says a name</div>
            </div>
          </div>

          <div className="vmap-gap-b"/>

          {/* TIER 3 + 4 - EXTENSIONS down a spine, each branching to its phones */}
          <div className="vmap-tier"><span className="ic e"><V_Icon name="route"/></span> Extensions <span className="vmap-tier-2">→ phones they ring</span></div>
          <div className="vmap-exts">
            {exts.map(e => {
              const off = e.status==='disabled';
              const dests = (e.dests||[]).map(vDest);
              const isDirect = directTargets[String(e.number)];
              const ring = V_ROUTING[e.routing] || '';
              return (
                <div className={`vmap-branch${hot&&hot!==String(e.number)?' is-dim':''}${hot===String(e.number)?' is-lit':''}`} key={e.id}
                  onMouseEnter={()=>setHot(String(e.number))} onMouseLeave={()=>setHot(null)}>
                  <button className={`vmap-node ext${off?' off':''}${isDirect?' direct':''}${selected&&selected.kind==='ext'&&selected.num===String(e.number)?' is-sel':''}`} ref={setNode(`ext-${e.number}`)}
                    onClick={()=>onOpenExt&&onOpenExt(e)}>
                    <span className={`vmap-extnum${off?' off':''}`}>{e.number}</span>
                    <span className="vmap-ext-name">
                      <b>{e.name}</b>
                      <span>{off?'Forwarding off':`Rings ${dests.length} phone${dests.length!==1?'s':''}${ring?` ${ring}`:''}`}</span>
                    </span>
                    {isDirect && <span className="vmap-ext-flag" title="A number rings this extension directly"><V_Icon name="forward"/></span>}
                    <span className={`vmap-dot ${off?'off':'on'}`}/>
                  </button>
                  <div className="vmap-leaves">
                    {dests.length===0 ? (
                      <div className="vmap-leaf empty" ref={setNode(`dest-${e.number}-0`)}><V_Icon name="voicemail"/> Voicemail only</div>
                    ) : dests.map((d, di) => (
                      <div className={`vmap-leaf${off?' off':''}`} ref={setNode(`dest-${e.number}-${di}`)} key={di}>
                        <span className="vmap-leaf-ic"><V_Icon name={d.icon}/></span>
                        <span className="vmap-leaf-tx"><b>{d.label}</b><span>{d.kind}</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* dial-by-name */}
            <div className="vmap-branch dir">
              <div className="vmap-node ext dirnode" ref={setNode('ext-9')}>
                <span className="vmap-extnum dir">9</span>
                <span className="vmap-ext-name"><b>Dial by name</b><span>Built from your extension names</span></span>
                <span className="vmap-ext-auto"><V_Icon name="sparkle"/></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SystemMapVertical });
