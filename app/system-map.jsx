/* ============================================================
   AnyPhone app - System Map (exports to window as SystemMap)
   A visual, at-a-glance tree of the whole phone system:
   your numbers → main greeting → extensions → the phones each rings.
   A number that points straight at an extension draws a line to it,
   skipping the greeting. Connector lines are drawn live from real
   DOM positions, so the tree re-wires itself on any reflow.
   ============================================================ */
const { Icon } = window;
const SM_useState = React.useState, SM_useRef = React.useRef, SM_useLayoutEffect = React.useLayoutEffect, SM_useCallback = React.useCallback;

/* parse a destination seed string ("Jane Cho - mobile app", "(617) 555-1141 - cell") into icon + label + kind */
function smDest(str){
  const base = String(str);
  const main = base.replace(/\s*-.*/, '').trim();
  const tail = base.includes('-') ? base.replace(/.*-\s*/, '').trim() : '';
  if(/mobile app/i.test(base)) return { icon:'smartphone', label:main, kind:'AnyPhone app' };
  if(/\d{3}.*\d{3}|\d{3}-\d{4}|\(\d{3}\)/.test(main)) return { icon:'phone', label:main, kind: tail || 'Phone' };
  if(/cell|mobile/i.test(base)) return { icon:'smartphone', label:main, kind: tail || 'Cell' };
  return { icon:'monitor', label:main, kind: tail || 'Desk phone' };
}

/* short human phrase for how an extension rings its destinations */
const SM_ROUTING = {
  order:  'in order',
  all:    'all at once',
  single: '',
};

function SystemMap({ businessName, numbers, extensions, greeting, hours, onGo, onOpenExt }){
  const wrapRef = SM_useRef(null);
  const nodeRefs = SM_useRef({});
  const [paths, setPaths] = SM_useState([]);
  const [dims, setDims] = SM_useState({ w:0, h:0 });
  const [hot, setHot] = SM_useState(null); // hovered extension number → highlight its branch

  const nums = numbers || [];
  const exts = extensions || [];

  // which extensions are reached directly by a number (skipping the greeting)
  const directTargets = {};
  nums.forEach(n => { if(n.routesTo && n.routesTo !== 'main') directTargets[String(n.routesTo)] = true; });

  const setNode = (id) => (el) => { if(el) nodeRefs.current[id] = el; else delete nodeRefs.current[id]; };

  const recompute = SM_useCallback(() => {
    const wrap = wrapRef.current;
    if(!wrap) return;
    const cr = wrap.getBoundingClientRect();
    const sx = wrap.scrollLeft, sy = wrap.scrollTop;
    const anchor = (id) => {
      const el = nodeRefs.current[id];
      if(!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left:  r.left - cr.left + sx,
        right: r.right - cr.left + sx,
        cy:    r.top - cr.top + sy + r.height/2,
      };
    };
    const link = (fromId, toId, kind, ext) => {
      const a = anchor(fromId), b = anchor(toId);
      if(!a || !b) return null;
      const x1 = a.right, y1 = a.cy, x2 = b.left, y2 = b.cy;
      if(kind === 'direct'){
        // bow the line downward so it visibly travels *under* the greeting hub
        const lowY = Math.max(y1, y2) + 64;
        const d = `M ${x1} ${y1} C ${x1+80} ${lowY}, ${x2-80} ${lowY}, ${x2} ${y2}`;
        return { d, kind, ext };
      }
      const dx = Math.max(28, (x2 - x1) * 0.5);
      const d = `M ${x1} ${y1} C ${x1+dx} ${y1}, ${x2-dx} ${y2}, ${x2} ${y2}`;
      return { d, kind, ext };
    };

    const out = [];
    // 1 - numbers → greeting  (or → extension directly)
    nums.forEach((n, i) => {
      if(n.routesTo && n.routesTo !== 'main'){
        const l = link(`num-${i}`, `ext-${n.routesTo}`, 'direct', String(n.routesTo));
        if(l) out.push(l);
      } else {
        const l = link(`num-${i}`, 'greet', 'main');
        if(l) out.push(l);
      }
    });
    // 2 - greeting → every extension on the menu
    exts.forEach(e => {
      const l = link('greet', `ext-${e.number}`, e.status === 'disabled' ? 'menu-off' : 'menu', String(e.number));
      if(l) out.push(l);
    });
    // greeting → dial-by-name node
    out.push(...[link('greet', 'ext-9', 'menu')].filter(Boolean));
    // 3 - each extension → the phones it rings
    exts.forEach(e => {
      const off = e.status === 'disabled';
      (e.dests || []).forEach((_, di) => {
        const l = link(`ext-${e.number}`, `dest-${e.number}-${di}`, off ? 'leaf-off' : 'leaf', String(e.number));
        if(l) out.push(l);
      });
    });

    setPaths(out);
    setDims({ w: wrap.scrollWidth, h: wrap.scrollHeight });
  }, [numbers, extensions]);

  SM_useLayoutEffect(() => {
    recompute();
    const wrap = wrapRef.current;
    const ro = new ResizeObserver(() => recompute());
    if(wrap) ro.observe(wrap);
    Object.values(nodeRefs.current).forEach(el => el && ro.observe(el));
    window.addEventListener('resize', recompute);
    const t1 = setTimeout(recompute, 120);
    const t2 = setTimeout(recompute, 400); // after webfont settles
    return () => { ro.disconnect(); window.removeEventListener('resize', recompute); clearTimeout(t1); clearTimeout(t2); };
  }, [recompute]);

  const smsLabel = (sms) => sms === 'approved' ? 'Calls + texts' : sms === 'pending' ? 'Calls · texts pending' : 'Calls only';

  return (
    <div className="smap">
      <div className="lv-head">
        <div>
          <h1 className="lv-title">System map</h1>
          <p className="lv-sub">A live picture of how a call travels - from the numbers you own, through your greeting, out to each extension and the phones it rings.</p>
        </div>
        <div className="smap-legend">
          <span className="smap-leg"><i className="smap-leg-line main"/> Reaches greeting</span>
          <span className="smap-leg"><i className="smap-leg-line direct"/> Skips to extension</span>
          <span className="smap-leg"><i className="smap-leg-line leaf"/> Rings a phone</span>
        </div>
      </div>

      <div className="smap-scroll" ref={wrapRef}>
        <svg className="smap-wires" width={dims.w} height={dims.h} aria-hidden="true">
          <defs>
            <marker id="sm-arrow-main" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="var(--blue)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="sm-arrow-menu" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="#9aa6f5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="sm-arrow-direct" markerWidth="9" markerHeight="9" refX="6" refY="4.5" orient="auto"><path d="M1 1 L7 4.5 L1 8" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></marker>
            <marker id="sm-dot-leaf" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5"><circle cx="3.5" cy="3.5" r="2.4" fill="var(--muted)"/></marker>
          </defs>
          {paths.map((p, i) => {
            const dim = hot && p.ext && p.ext !== hot;
            const lit = hot && p.ext === hot;
            return (
              <path key={i} d={p.d} className={`smap-wire ${p.kind}${dim ? ' is-dim' : ''}${lit ? ' is-lit' : ''}`}
                markerEnd={p.kind === 'direct' ? 'url(#sm-arrow-direct)' : p.kind === 'main' ? 'url(#sm-arrow-main)' : p.kind === 'menu' ? 'url(#sm-arrow-menu)' : (p.kind === 'leaf' ? 'url(#sm-dot-leaf)' : undefined)}/>
            );
          })}
        </svg>

        <div className="smap-grid">
          {/* TIER 1 - NUMBERS */}
          <div className="smap-col">
            <div className="smap-colhead"><span className="smap-colic n"><Icon name="hashnum"/></span> Your numbers</div>
            <div className="smap-colbody">
              {nums.map((n, i) => {
                const direct = n.routesTo && n.routesTo !== 'main';
                const target = direct ? exts.find(e => String(e.number) === String(n.routesTo)) : null;
                return (
                  <div className={`smap-node num${direct ? ' direct' : ''}`} ref={setNode(`num-${i}`)} key={n.num}
                    onMouseEnter={() => direct && setHot(String(n.routesTo))} onMouseLeave={() => setHot(null)}>
                    <div className="smap-numrow">
                      <span className="smap-numdot"/>
                      <span className="smap-num">{n.num}</span>
                    </div>
                    <div className="smap-nummeta">{n.label}{n.label.toLowerCase() !== n.type.toLowerCase() ? ` · ${n.type}` : ''} · {smsLabel(n.sms)}</div>
                    {direct && <div className="smap-numroute"><Icon name="forward"/> Rings Ext {target ? target.number : n.routesTo}{target ? ` · ${target.name}` : ''} directly</div>}
                  </div>
                );
              })}
              <button className="smap-add" onClick={() => onGo && onGo('numbers')}><Icon name="plus"/> Add a number</button>
            </div>
          </div>

          {/* TIER 2 - GREETING */}
          <div className="smap-col mid">
            <div className="smap-colhead"><span className="smap-colic g"><Icon name="audiolines"/></span> Main greeting</div>
            <div className="smap-colbody">
              <div className="smap-greet" ref={setNode('greet')}>
                <div className="smap-greet-badge"><Icon name="audiolines"/> AI voice · {businessName}</div>
                <p className="smap-greet-text">“{greeting}”</p>
                <div className="smap-greet-foot">
                  <span className="smap-greet-hours"><Icon name="clock"/> {hours}</span>
                  <button className="smap-greet-edit" onClick={() => onGo && onGo('greetings')}>Edit</button>
                </div>
                <div className="smap-greet-route">
                  <Icon name="route"/> Caller dials an extension or says a name
                </div>
              </div>
            </div>
          </div>

          {/* TIER 3 + 4 - EXTENSIONS branching to the phones they ring */}
          <div className="smap-col branches">
            <div className="smap-colhead"><span className="smap-colic e"><Icon name="route"/></span> Extensions <span className="smap-colhead-2">→ phones they ring</span></div>
            <div className="smap-colbody">
              {exts.map(e => {
                const off = e.status === 'disabled';
                const dests = (e.dests || []).map(smDest);
                const isDirect = directTargets[String(e.number)];
                const ring = SM_ROUTING[e.routing] || '';
                return (
                  <div className={`smap-branch${hot && hot !== String(e.number) ? ' is-dim' : ''}${hot === String(e.number) ? ' is-lit' : ''}`} key={e.id}
                    onMouseEnter={() => setHot(String(e.number))} onMouseLeave={() => setHot(null)}>
                    <button className={`smap-node ext${off ? ' off' : ''}${isDirect ? ' direct' : ''}`} ref={setNode(`ext-${e.number}`)}
                      onClick={() => onOpenExt && onOpenExt(e)}>
                      <span className={`smap-extnum${off ? ' off' : ''}`}>{e.number}</span>
                      <span className="smap-ext-name">
                        <b>{e.name}</b>
                        <span>{off ? 'Forwarding off' : `Rings ${dests.length} phone${dests.length !== 1 ? 's' : ''}${ring ? ` ${ring}` : ''}`}</span>
                      </span>
                      {isDirect && <span className="smap-ext-flag" title="A number rings this extension directly"><Icon name="forward"/></span>}
                      <span className={`smap-dot ${off ? 'off' : 'on'}`}/>
                    </button>

                    <div className="smap-leaves">
                      {dests.length === 0 ? (
                        <div className="smap-leaf empty" ref={setNode(`dest-${e.number}-0`)}><Icon name="voicemail"/> Voicemail only</div>
                      ) : dests.map((d, di) => (
                        <div className={`smap-leaf${off ? ' off' : ''}`} ref={setNode(`dest-${e.number}-${di}`)} key={di}>
                          <span className="smap-leaf-ic"><Icon name={d.icon}/></span>
                          <span className="smap-leaf-tx">
                            <b>{d.label}</b>
                            <span>{d.kind}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* dial-by-name - built automatically, no phones to ring */}
              <div className="smap-branch dir">
                <div className="smap-node ext dirnode" ref={setNode('ext-9')}>
                  <span className="smap-extnum dir">9</span>
                  <span className="smap-ext-name">
                    <b>Dial by name</b>
                    <span>Built from your extension names</span>
                  </span>
                  <span className="smap-ext-auto"><Icon name="sparkle"/></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SystemMap });
