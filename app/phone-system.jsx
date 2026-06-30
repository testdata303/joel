/* ============================================================
   AnyPhone app - Phone System (exports window.PhoneSystem)
   The calm, Apple-style answer to "show me my phone system."
   One quiet vertical story, top to bottom:
     ① a call comes in on a number
     ② your greeting answers
     ③ the caller reaches a person
   Forwarding is managed right here: each extension row has an
   on/off switch and expands in place to show the numbers it
   rings, each with its own toggle. No separate forwarding screen.
   ============================================================ */
const { Icon: PS_Icon, Toggle: PS_Toggle, Wave: PS_Wave } = window;
const PS_useState = React.useState;
const PS_useEffect = React.useEffect;

function psName(str){ return String(str).replace(/\s*-.*/, '').trim(); }

/* forwarding detail per extension - label · value · kind, each independently on/off */
const PS_FWD_SEED = {
  '0':   [{ id:'o1',  label:'Front Desk',   value:'(617) 555-2200', kind:'monitor',    on:true }],
  '1':   [{ id:'s1',  label:'Jane Cho',     value:'AnyPhone app',       kind:'smartphone', on:true },
          { id:'s2',  label:'My cell',      value:'(617) 555-1141', kind:'phone',      on:true },
          { id:'s3',  label:'Front Desk',   value:'(617) 555-2200', kind:'monitor',    on:true }],
  '2':   [{ id:'su1', label:'Front Desk',   value:'(617) 555-2200', kind:'monitor',    on:true },
          { id:'su2', label:'Support line', value:'(617) 555-2201', kind:'monitor',    on:false }],
  '3':   [{ id:'b1',  label:'Susan',        value:'(617) 555-3300', kind:'phone',      on:true }],
  '101': [{ id:'bs1', label:'Bob’s Mobile', value:'(617) 555-0142', kind:'phone',      on:true }],
};

function PhoneSystem({ businessName, numbers, extensions, greeting, hours, onGo, onOpenExt }){
  const nums = numbers || [];
  const exts = extensions || [];
  const extByNum = {};
  exts.forEach(e => { extByNum[String(e.number)] = e; });

  // forwarding state lives here: which extensions are on, which numbers ring
  const [extOn, setExtOn] = PS_useState(() => {
    const m = {}; exts.forEach(e => { m[String(e.number)] = e.status !== 'disabled'; }); return m;
  });
  const [fwd, setFwd] = PS_useState(PS_FWD_SEED);
  const [open, setOpen] = PS_useState(null); // extension number expanded, one at a time
  const [playing, setPlaying] = PS_useState(false); // main greeting preview (saved greetings are static audio)
  PS_useEffect(() => { if(!playing) return; const t = setTimeout(() => setPlaying(false), 2400); return () => clearTimeout(t); }, [playing]);

  // inline "add a number" inside an extension's forwarding list
  const [adding, setAdding] = PS_useState(null); // extension number showing the add form
  const [addNum, setAddNum] = PS_useState('');
  const [addLabel, setAddLabel] = PS_useState('');
  const startAdd = (num) => { setAdding(num); setAddNum(''); setAddLabel(''); };
  const saveAdd = (num) => {
    const v = addNum.trim(); if(!v) return;
    const row = { id:'n'+Date.now(), label: addLabel.trim() || 'Phone', value: v, kind:'phone', on:true };
    setFwd(f => ({ ...f, [num]: [ ...(f[num]||[]), row ] }));
    setAdding(null);
  };

  const toggleExt = (num) => setExtOn(m => ({ ...m, [num]: !m[num] }));
  const toggleDest = (num, id) => setFwd(f => ({ ...f, [num]: (f[num]||[]).map(d => d.id === id ? { ...d, on:!d.on } : d) }));

  return (
    <div className="psys">
      <div className="psys-head">
        <h1 className="psys-title">Your phone system</h1>
        <p className="psys-sub">How a call travels - from the numbers you own, to the people who answer.</p>
      </div>

      <div className="psys-flow">

        {/* ① NUMBERS */}
        <section className="psys-card">
          <header className="psys-cardhead">
            <span className="psys-step">1</span>
            <div className="psys-cardtitle">
              <h2>A call comes in</h2>
              <p>On any number you own</p>
            </div>
          </header>
          <div className="psys-nums">
            {nums.map(n => {
              const direct = n.routesTo && n.routesTo !== 'main';
              const target = direct ? extByNum[String(n.routesTo)] : null;
              return (
                <div className="psys-numrow" key={n.num}>
                  <span className="psys-num">{n.num}</span>
                  <span className="psys-numlabel">{n.label}</span>
                  {direct && (
                    <span className="psys-direct" title="This number skips the greeting">
                      <PS_Icon name="forward"/> Straight to {target ? target.name : `Ext ${n.routesTo}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="psys-join" aria-hidden="true"><span/></div>

        {/* ② GREETING - just hear it; editing lives on the Main Greeting screen */}
        <section className="psys-card greet">
          <header className="psys-cardhead">
            <span className="psys-step">2</span>
            <div className="psys-cardtitle">
              <h2>Your greeting answers</h2>
              <p>What callers hear first</p>
            </div>
          </header>
          <div className="psys-greetplay">
            <button className={`psys-play${playing ? ' on' : ''}`} onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Stop greeting' : 'Play main greeting'}>
              <PS_Icon name={playing ? 'pause' : 'play'}/>
            </button>
            <div className="psys-greetmeta">
              <b>Main greeting</b>
              <span>{playing ? 'Playing…' : '0:06'}</span>
            </div>
            <PS_Wave n={30} playing={playing}/>
          </div>
          <div className="psys-greetfoot">
            <span className="psys-hours"><PS_Icon name="clock"/> {hours}</span>
            <button className="psys-textbtn" onClick={() => onGo && onGo('greetings')}>Edit greeting</button>
          </div>
        </section>

        <div className="psys-join" aria-hidden="true"><span/></div>

        {/* ③ EXTENSIONS → PEOPLE, with forwarding managed in place */}
        <section className="psys-card">
          <header className="psys-cardhead">
            <span className="psys-step">3</span>
            <div className="psys-cardtitle">
              <h2>The caller reaches a person</h2>
              <p>By dialing an extension - or just saying a name</p>
            </div>
          </header>
          <div className="psys-exts">
            {exts.map(e => {
              const num = String(e.number);
              const on = extOn[num];
              const dests = fwd[num] || [];
              const live = dests.filter(d => d.on);
              const isOpen = open === num;
              return (
                <div className={`psys-extwrap${isOpen ? ' open' : ''}`} key={e.id}>
                  <div className={`psys-ext${on ? '' : ' off'}`} role="button" tabIndex={0}
                    onClick={() => setOpen(isOpen ? null : num)}
                    onKeyDown={(ev) => { if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); setOpen(isOpen ? null : num); } }}>
                    <span className="psys-digit">{e.number}</span>
                    <span className="psys-extname">{e.name}</span>
                    <span className="psys-extdest">
                      {!on ? 'Off - callers go to voicemail'
                        : live.length === 0 ? 'Voicemail only'
                        : <>{live[0].label}{live.length > 1 && <em> +{live.length - 1}</em>}</>}
                    </span>
                    <span className="psys-extctrl" onClick={(ev) => ev.stopPropagation()}>
                      <PS_Toggle on={on} onChange={() => toggleExt(num)} sm/>
                    </span>
                    <span className={`psys-chev${isOpen ? ' open' : ''}`}><PS_Icon name="chevdown"/></span>
                  </div>

                  {isOpen && (
                    <div className="psys-fwd">
                      {!on ? (
                        <p className="psys-fwd-off">Forwarding is off. Callers who pick {e.name} go straight to voicemail. Flip the switch to start ringing these again.</p>
                      ) : null}
                      {dests.map(d => (
                        <div className={`psys-fwdrow${on && d.on ? '' : ' off'}`} key={d.id}>
                          <span className="psys-fwdic"><PS_Icon name={d.kind}/></span>
                          <span className="psys-fwdname">{d.label}</span>
                          <span className="psys-fwdval">{d.value}</span>
                          <PS_Toggle on={d.on} onChange={() => toggleDest(num, d.id)} sm/>
                        </div>
                      ))}
                      {adding === num ? (
                        <div className="psys-addrow">
                          <span className="psys-fwdic"><PS_Icon name="phone"/></span>
                          <input className="psys-addinput num" autoFocus placeholder="(617) 555-0000" value={addNum}
                            onChange={(ev) => setAddNum(ev.target.value)}
                            onKeyDown={(ev) => { if(ev.key === 'Enter') saveAdd(num); if(ev.key === 'Escape') setAdding(null); }}/>
                          <input className="psys-addinput" placeholder="Label (optional)" value={addLabel}
                            onChange={(ev) => setAddLabel(ev.target.value)}
                            onKeyDown={(ev) => { if(ev.key === 'Enter') saveAdd(num); if(ev.key === 'Escape') setAdding(null); }}/>
                          <button className="psys-textbtn" disabled={!addNum.trim()} style={!addNum.trim() ? {opacity:.45} : null} onClick={() => saveAdd(num)}>Add</button>
                          <button className="psys-textbtn quiet" onClick={() => setAdding(null)}>Cancel</button>
                        </div>
                      ) : (
                        <div className="psys-fwdfoot">
                          <button className="psys-textbtn" onClick={() => startAdd(num)}><PS_Icon name="plus"/> Add a number</button>
                          <button className="psys-textbtn" onClick={() => onOpenExt && onOpenExt(e)}>All settings</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

Object.assign(window, { PhoneSystem });
