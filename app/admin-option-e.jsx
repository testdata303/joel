/* Option E - Call Tree: the whole phone system as a node graph on a blank
   canvas. Incoming → greeting → menu fans into the keys; each key branches
   to who it rings. Wires are SVG beziers measured from the live layout. */

const E_STROKE = { ext: '#9fb0f5', vm: '#c3a9f4', menu: '#cfd3db', dim: '#d6dae1' };

function pathH(a, b) {
  const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2;
  const dx = Math.max(34, (x2 - x1) * 0.5);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}
function pathV(a, b) {
  const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = b.x + b.w / 2, y2 = b.y;
  const dy = Math.max(18, (y2 - y1) * 0.5);
  return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
}

function OptionE() {
  const boardRef = React.useRef(null);
  const nodes = React.useRef({});
  const [wires, setWires] = React.useState([]);
  const setRef = (id) => (el) => { if (el) nodes.current[id] = el; };

  React.useLayoutEffect(() => {
    let raf = 0, pending = false;
    const measure = () => {
      pending = false;
      const board = boardRef.current;
      if (!board) return;
      const b = board.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const s = board.offsetWidth / b.width; // unscale (canvas zoom)
      if (!isFinite(s) || s <= 0) return;
      const pos = {};
      for (const id in nodes.current) {
        const el = nodes.current[id];
        if (!el || !el.isConnected) continue;
        const r = el.getBoundingClientRect();
        pos[id] = { x: (r.left - b.left) * s, y: (r.top - b.top) * s, w: r.width * s, h: r.height * s };
      }
      const W = [];
      const add = (from, to, o = {}) => {
        if (!pos[from] || !pos[to]) return;
        W.push({ d: (o.v ? pathV : pathH)(pos[from], pos[to]), stroke: o.stroke || E_STROKE.dim, dash: o.dash, dot: pos[to], v: !!o.v });
      };
      add('in', 'greet', { v: true });
      add('greet', 'menu', { v: true });
      OPTIONS.forEach((o) => {
        const st = E_STROKE[o.type] || E_STROKE.dim;
        add('menu', 'k' + o.key, { stroke: st });
        if (o.type === 'ext') o.dests.forEach((d, i) => add('k' + o.key, `d${o.key}-${i}`, { stroke: st }));
        else if (o.type === 'vm') add('k' + o.key, `d${o.key}-0`, { stroke: st });
        else if (o.type === 'menu') o.sub.forEach((sx, i) => add('k' + o.key, `d${o.key}-${i}`, { stroke: st }));
      });
      add('menu', 'fallback', { stroke: E_STROKE.dim, dash: true });
      setWires((prev) => {
        const a = JSON.stringify(prev.map((w) => w.d));
        const c = JSON.stringify(W.map((w) => w.d));
        return a === c ? prev : W;
      });
    };
    const schedule = () => { if (pending) return; pending = true; raf = requestAnimationFrame(measure); };
    schedule();
    const t = setTimeout(schedule, 350);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    if (boardRef.current) ro.observe(boardRef.current);
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); ro.disconnect(); window.removeEventListener('resize', schedule); };
  }, []);

  return (
    <div className="cf-board">
      <header className="cf-head">
        <span className="cf-bizmark"><Icon name="route" /></span>
        <div className="cf-headmain">
          <h1>{BIZ.name} <span className="cf-live"><i />Live</span></h1>
          <p>The whole call flow as one map · {BIZ.number}</p>
        </div>
        <div className="cf-headact">
          <button className="btn btn-secondary sm"><Icon name="phone" />Test call</button>
          <button className="btn btn-primary sm"><Icon name="check" />Saved</button>
        </div>
      </header>

      <div className="cf-body">
        <div className="e-board" ref={boardRef}>
          <svg className="e-wires" preserveAspectRatio="none">
            {wires.map((w, i) => (
              <React.Fragment key={i}>
                <path d={w.d} fill="none" stroke={w.stroke} strokeWidth="2"
                  strokeDasharray={w.dash ? '5 5' : undefined} strokeLinecap="round" />
                <circle cx={w.v ? w.dot.x + w.dot.w / 2 : w.dot.x} cy={w.v ? w.dot.y : w.dot.y + w.dot.h / 2}
                  r="3" fill={w.stroke} />
              </React.Fragment>
            ))}
          </svg>

          <div className="e-flow">
            {/* spine: incoming → greeting → menu */}
            <div className="e-spine">
              <div className="e-node dark" ref={setRef('in')}>
                <span className="e-et"><Icon name="phone" /></span>
                <span className="nt"><b>{BIZ.number}</b><span>Incoming call</span></span>
              </div>
              <div className="e-node" ref={setRef('greet')}>
                <span className="e-et is-ext"><Icon name="audiolines" /></span>
                <span className="nt"><b>Main greeting</b><span>AI voice · {GREETING.dur}</span></span>
              </div>
              <div className="e-node" ref={setRef('menu')}>
                <span className="e-et is-menu"><Icon name="route" /></span>
                <span className="nt"><b>Press a key</b><span>{OPTIONS.length} options</span></span>
              </div>
            </div>

            {/* branch: one row per key */}
            <div className="e-branch">
              {OPTIONS.map((o) => {
                const tt = typeTag(o.type);
                return (
                  <React.Fragment key={o.key}>
                    <div className={`e-node e-key ${tt.cls}`} ref={setRef('k' + o.key)}>
                      <span className="cf-keybadge">{o.key}</span>
                      <span className="nt"><b>{o.name}</b><span>{strategyLabel(o)}</span></span>
                      <span className={`e-tag ${tt.cls}`}>{tt.label}</span>
                    </div>
                    <div className="e-destcell">
                      {o.type === 'ext' && o.dests.map((d, i) => (
                        <div className="e-dnode" ref={setRef(`d${o.key}-${i}`)} key={i}>
                          <span className="ddi"><Icon name={destIcon(d.kind)} /></span>
                          <span className="nt"><b>{d.name}</b><span>{d.sub}</span></span>
                          <span className="ering">{o.ringSec}s</span>
                        </div>
                      ))}
                      {o.type === 'vm' && (
                        <div className="e-dnode" ref={setRef(`d${o.key}-0`)}>
                          <span className="ddi"><Icon name="mic" /></span>
                          <span className="nt"><b>Takes a message</b><span>→ {o.notify[0].to}</span></span>
                        </div>
                      )}
                      {o.type === 'menu' && o.sub.map((s, i) => (
                        <div className="e-dnode" ref={setRef(`d${o.key}-${i}`)} key={i}>
                          <span className="ddi"><Icon name={s.icon} /></span>
                          <span className="nt"><b>{s.label}</b></span>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                );
              })}

              {/* fallback row */}
              <div className="e-node dashed" ref={setRef('fallback')} style={{ width: 248 }}>
                <span className="e-et is-vm"><Icon name="voicemailbox" /></span>
                <span className="nt"><b>No key pressed</b><span>→ Billing voicemail</span></span>
              </div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OptionE });
