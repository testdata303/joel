/* ============================================================
   JOEL app - System page (exports to window)
   One page that reads top-to-bottom as a call travels:
   Number → how it's answered → where it rings → if no one answers.
   Progressive disclosure: a single-path system never says
   "extension"; turning on a menu reveals branches (= extensions).
   ============================================================ */
const { Icon, Toggle, Modal, Segmented, Card, Choice } = window;

const GREET_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const GREET_TZS = ['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','Alaska (AKT)','Hawaii (HT)'];
const GREET_TIMES = (()=>{ const out=[]; for(let h=0;h<24;h++){ for(const m of [0,30]){ const ap=h<12?'AM':'PM'; let hh=h%12; if(hh===0)hh=12; out.push(`${hh}:${m===0?'00':'30'} ${ap}`);} } return out; })();
const tzAbbr=(t)=>{ const m=String(t).match(/\(([^)]+)\)/); return m?m[1]:t; };
const AWAY_MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtAwayDate(d){ if(!d) return ''; const dt=new Date(d+'T00:00:00'); if(isNaN(dt)) return d; return `${AWAY_MO[dt.getMonth()]} ${dt.getDate()}`; }
function buildLocalGreeting(businessName, extensions, kind){
  if(kind==='closed') return `Thanks for calling ${businessName}. You’ve reached us outside our normal business hours.`;
  if(kind==='holiday') return `Thanks for calling ${businessName}. We’re closed for the holiday today.`;
  const depts=(extensions||[]).filter(e=>e.number!==0 && e.number!==9);
  const menu = depts.map(e=>`For ${e.name}, press ${e.number}.`).join(' ');
  return `Thank you for calling ${businessName}.${menu?' '+menu:''}`;
}

function SysArrow(){
  return <div className="sys-arrow" aria-hidden="true"><span className="sys-arrow-line"/><span className="sys-arrow-head"><Icon name="chevdown"/></span></div>;
}

const ANSWER_MODES = [
  { id:'phones', t:'Send straight to my phones', d:'No greeting, no menu - calls ring your phones right away.' },
  { id:'greet',  t:'Play a greeting, then ring',  d:'Callers hear a short message, then your phones ring.' },
  { id:'menu',   t:'Greet callers and offer a menu', d:'“Press 1 for Sales…”. Each option rings a different team.' },
];

function SystemScreen({ numbers, mode, setMode, greeting, setGreeting, mainPath, branches, hasExtensions, onEditPath, onEditBranch, onAddNumber, onAddOption }){
  const isMenu = mode==='menu';
  const hasGreeting = mode==='greet' || mode==='menu';
  const routeName = (n)=>{
    if(hasExtensions && n.routesTo && n.routesTo!=='main'){ const b=(branches||[]).find(x=>String(x.number)===String(n.routesTo)); return b?`${b.name} · skips greeting`:'an extension'; }
    return isMenu ? 'Main greeting' : 'Your phones';
  };
  return (
    <div className="sys-screen">
      <div className="sys-head">
        <h1 className="lv-title">System</h1>
        <p className="lv-sub">How calls to your number get answered and routed. Read it top to bottom - that’s the path a call takes.</p>
      </div>

      <div className="sys-flow">
        {/* 1 - Numbers */}
        <div className="sys-node">
          <div className="sys-node-h">
            <span className="sys-ic phone"><Icon name="phone"/></span>
            <div className="sys-node-t"><b>Your number{numbers.length>1?'s':''}</b><span>{numbers.length>1?'Different numbers, same system - handy for tracking where calls come from.':'The number people call.'}</span></div>
            <button className="btn btn-secondary sm" onClick={onAddNumber}><Icon name="plus"/> Add number</button>
          </div>
          <div className="sys-numlist">
            {numbers.map(n=>(
              <div className="sys-numrow" key={n.num}>
                <span className="sys-numval">{n.num}</span>
                <span className="sys-numlabel">{n.label}</span>
                <span className="sys-numroute"><Icon name="chevright"/> {routeName(n)}</span>
              </div>
            ))}
          </div>
        </div>

        <SysArrow/>

        {/* 2 - How it's answered */}
        <div className="sys-node">
          <div className="sys-node-h">
            <span className="sys-ic blue"><Icon name="route"/></span>
            <div className="sys-node-t"><b>When someone calls…</b><span>Choose how the call is answered.</span></div>
          </div>
          <div className="sys-modes">
            {ANSWER_MODES.map(o=>(
              <button key={o.id} className={`sys-mode${mode===o.id?' on':''}`} onClick={()=>setMode(o.id)}>
                <span className={`radio${mode===o.id?' on':''}`}/>
                <span className="sys-mode-t"><b>{o.t}</b><span>{o.d}</span></span>
              </button>
            ))}
          </div>
        </div>

        {hasGreeting && (
          <React.Fragment>
            <SysArrow/>
            <div className="sys-node">
              <div className="sys-node-h">
                <span className="sys-ic ai"><Icon name="message"/></span>
                <div className="sys-node-t"><b>Greeting</b><span>Played before the call is routed.</span></div>
              </div>
              <textarea className="sys-greeting" value={greeting} onChange={e=>setGreeting(e.target.value)} placeholder="e.g. Thank you for calling Smilebar. Please hold while we connect your call."/>
            </div>
          </React.Fragment>
        )}

        <SysArrow/>

        {isMenu ? (
          /* 3b - Menu branches (= extensions) */
          <div className="sys-node">
            <div className="sys-node-h">
              <span className="sys-ic blue"><Icon name="layers"/></span>
              <div className="sys-node-t"><b>Menu options</b><span>Each key sends the caller to its own call path.</span></div>
              <button className="btn btn-secondary sm" onClick={onAddOption}><Icon name="plus"/> Add option</button>
            </div>
            <div className="sys-branches">
              {branches.map(b=>(
                <button className="sys-branch" key={b.number} onClick={()=>onEditBranch(b)}>
                  <span className="sys-key">{b.number}</span>
                  <span className="sys-branch-t"><b>{b.name}</b><span>{b.summary}</span></span>
                  <Icon name="chevright"/>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 3a - Single call path (no "extension" anywhere) */
          <React.Fragment>
            <div className="sys-node">
              <div className="sys-node-h">
                <span className="sys-ic green"><Icon name="phone"/></span>
                <div className="sys-node-t"><b>Rings</b><span>Where your calls ring. Add as many as you like - ring together or in order.</span></div>
                <button className="btn btn-secondary sm" onClick={onEditPath}><Icon name="settings"/> Edit forwarding</button>
              </div>
              <div className="sys-dests">
                {mainPath.dests.map((d,i)=>(<span className="sys-destchip" key={i}><Icon name={d.icon||'phone'}/>{d.label}</span>))}
              </div>
            </div>
            <SysArrow/>
            <div className="sys-node">
              <div className="sys-node-h">
                <span className="sys-ic violet"><Icon name="voicemail"/></span>
                <div className="sys-node-t"><b>If no one answers</b><span>{mainPath.fallback}</span></div>
                <button className="btn btn-secondary sm" onClick={onEditPath}><Icon name="pencil"/> Edit</button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

/* ---------- Numbers screen ---------- */
/* NOTE: must stay uniquely named - settings-sections-2.jsx also declares a
   global `SMS_STATUS` (Babel turns const→var, last loaded wins). Sharing the
   name let the settings map clobber this one, dropping the green/amber pills. */
const NUM_SMS_STATUS = {
  approved:{ label:'SMS approved', cls:'ok', icon:'check' },
  pending: { label:'SMS pending',  cls:'pending', icon:'clock' },
  failed:  { label:'SMS failed',   cls:'fail', icon:'x' },
};

function NumberCard({ n, extensions, businessName, onRouting, onDelete, onGoGreetings, onGoExtensions }){
  const [menu,setMenu]=React.useState(false);
  const ref=React.useRef(null);
  React.useEffect(()=>{ if(!menu) return; const h=e=>{ if(ref.current && !ref.current.contains(e.target)) setMenu(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[menu]);
  const isMenu = n.routing==='menu';
  const ext = isMenu ? null : (extensions||[]).find(x=>String(x.number)===String(n.routing.slice(4)));
  const sms = n.sms ? (NUM_SMS_STATUS[n.sms] || NUM_SMS_STATUS.approved) : null;
  const TE = (ext&&ext.transferExp)||'ring';
  const callerExp = isMenu ? 'Main greeting' : (TE==='greeting'?'Transfer greeting':TE==='music'?'Music on hold':'Ringing');
  const [playing,setPlaying]=React.useState(false);
  React.useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2000); return ()=>clearTimeout(t); },[playing]);
  const tip = isMenu ? 'Callers hear your main greeting, then the phone menu.'
    : TE==='greeting' ? `“Please wait while we transfer you to ${ext?ext.name:''}.”`
    : TE==='music' ? 'Hold music plays while JOEL rings your destinations.'
    : 'Standard ringing plays while JOEL rings your destinations.';
  const [showTip,setShowTip]=React.useState(false);
  const qref=React.useRef(null);
  React.useEffect(()=>{ if(!showTip) return; const h=e=>{ if(qref.current && !qref.current.contains(e.target)) setShowTip(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[showTip]);
  return (
    <div className="nrow">
      <span className="nrow-ic"><Icon name="phone"/></span>
      <div className="nrow-id">
        <div className="nrow-top">
          <b className="nrow-num">{n.num}</b>
          <span className="nrow-dot" title="Active"/>
        </div>
        <div className="nrow-meta">
          {n.label && <span className="nrow-label">{n.label}</span>}
          {sms && <span className={`sms-badge ${sms.cls}`}><Icon name={sms.icon} sw={sms.icon==='check'?3:2}/> {sms.label}</span>}
        </div>
      </div>
      <div className="nrow-route">
        <span className="nrow-k">Routes to</span>
        <select className="select nrow-sel" value={n.routing} onChange={e=>onRouting(e.target.value)}>
          <option value="menu">Main greeting</option>
          {(extensions||[]).map(e=><option key={e.id} value={'ext:'+e.number}>{e.name} extension</option>)}
        </select>
      </div>
      <div className="nrow-exp">
        <span className="nrow-k">Callers hear</span>
        <span className="nrow-expv">
          <button className={`nrow-play${playing?' on':''}`} onClick={()=>setPlaying(p=>!p)} aria-label="Hear it"><Icon name={playing?'pause':'play'}/></button>
          <span className="nrow-expt">{callerExp}</span>
          <span className="nrow-qwrap" ref={qref}>
            <button className="nrow-q" onClick={()=>setShowTip(t=>!t)} aria-label="What callers hear"><Icon name="info"/></button>
            {showTip && <div className="nrow-tip">{tip}</div>}
          </span>
        </span>
      </div>
      <div className="nrow-menu" ref={ref}>
        <button className="kebab" onClick={()=>setMenu(v=>!v)} aria-label="Number options"><Icon name="kebab"/></button>
        {menu && (
          <div className="num-menu">
            <button onClick={()=>setMenu(false)}><Icon name="pencil"/> Edit number</button>
            {isMenu
              ? <button onClick={()=>{ setMenu(false); onGoGreetings(); }}><Icon name="message"/> Edit greeting</button>
              : <button onClick={()=>{ setMenu(false); onGoExtensions(); }}><Icon name="route"/> Edit extension</button>}
            <button onClick={()=>setMenu(false)}><Icon name="forward"/> Port status</button>
            <div className="num-menu-sep"/>
            <button className="danger" onClick={()=>{ setMenu(false); onDelete(); }}><Icon name="trash"/> Delete number</button>
          </div>
        )}
      </div>
    </div>
  );
}

function NumbersScreen({ numbers, extensions, businessName, onGoGreetings, onGoExtensions }){
  const [rows,setRows]=React.useState(()=>numbers.map(n=>({ ...n, routing: n.routesTo && n.routesTo!=='main' ? ('ext:'+n.routesTo) : 'menu' })));
  const setRow=(i,patch)=>setRows(r=>r.map((x,idx)=>idx===i?{...x,...patch}:x));
  const del=(i)=>setRows(r=>r.filter((_,idx)=>idx!==i));
  return (
    <div className="ext-listview">
      <div className="lv-head">
        <div>
          <h1 className="lv-title">Numbers</h1>
          <p className="lv-sub">Every number and where it routes. Edit a number, greeting, or extension from its menu.</p>
        </div>
        <button className="btn btn-primary"><Icon name="plus"/> Add number</button>
      </div>
      <div className="num-list">
        {rows.map((n,i)=>(
          <NumberCard key={n.num} n={n} extensions={extensions} businessName={businessName||'Smilebar'}
            onRouting={v=>setRow(i,{routing:v})} onDelete={()=>del(i)}
            onGoGreetings={onGoGreetings} onGoExtensions={onGoExtensions}/>
        ))}
      </div>
    </div>
  );
}

/* ---------- Greetings screen ---------- */
function GreetEditor({ value, onChange, businessName, extensions, kind }){
  const [playing,setPlaying]=React.useState(false);
  const [voice,setVoice]=React.useState('Aria');
  React.useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2600); return ()=>clearTimeout(t); },[playing]);
  return (
    <React.Fragment>
      <div className="greet-edit-h">
        <b>Greeting text</b>
        <button className="greet-suggest" onClick={()=>onChange(buildLocalGreeting(businessName, extensions, kind))}><Icon name="sparkle"/> Generate default</button>
      </div>
      <textarea className="greet-ta" value={value} onChange={e=>onChange(e.target.value)} rows={4} autoFocus placeholder="What should callers hear?"/>
      <div className="greet-voicebar">
        <button className={`greet-playbtn${playing?' on':''}`} disabled={!value.trim()} style={!value.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>setPlaying(p=>!p)}>
          <Icon name={playing?'pause':'play'}/> {playing?`Playing in ${voice}…`:'Hear it'}
        </button>
        <label className="greet-voice">
          <Icon name="audiolines"/>
          <span>AI voice</span>
          <select value={voice} onChange={e=>setVoice(e.target.value)}>
            {['Aria','Atlas','Nova','Sage','River','Orion'].map(v=><option key={v} value={v}>{v}</option>)}
          </select>
        </label>
      </div>
    </React.Fragment>
  );
}

function PreviewBtn({ disabled }){
  const [p,setP]=React.useState(false);
  React.useEffect(()=>{ if(!p) return; const t=setTimeout(()=>setP(false),2000); return ()=>clearTimeout(t); },[p]);
  return <button className="btn btn-secondary sm" disabled={disabled} style={disabled?{opacity:.45,pointerEvents:'none'}:null} onClick={()=>setP(v=>!v)}><Icon name={p?'pause':'play'}/> {p?'Playing…':'Preview'}</button>;
}

function GCard({ icon, iconCls, title, status, preview, previewMuted, actions }){
  return (
    <div className="gcard">
      <span className={`greet-icbox ${iconCls}`}><Icon name={icon}/></span>
      <div className="gcard-main">
        <div className="gcard-top"><b>{title}</b>{status && <span className={`gpill ${status.cls}`}>{status.label}</span>}</div>
        <p className={`gcard-preview${previewMuted?' muted':''}`}>{preview}</p>
      </div>
      <div className="gcard-acts">{actions}</div>
    </div>
  );
}

function daysSummary(days){
  const order=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const sorted=order.filter(d=>days.includes(d));
  if(sorted.length===0) return 'No days set';
  if(sorted.length===7) return 'Every day';
  const idx=sorted.map(d=>order.indexOf(d));
  let contiguous=true; for(let i=1;i<idx.length;i++){ if(idx[i]!==idx[i-1]+1){ contiguous=false; break; } }
  if(contiguous && sorted.length>2) return `${sorted[0]}–${sorted[sorted.length-1]}`;
  return sorted.join(', ');
}

function MainGreetingModal({ initial, businessName, extensions, onClose, onSave }){
  const [v,setV]=React.useState(initial);
  return (
    <Modal icon="message" title="Main greeting" desc="What callers hear before they’re routed. Numbers using the main greeting all share this." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!v.trim()} style={!v.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onSave(v.trim())}>Save greeting</button>
      </React.Fragment>}>
      <GreetEditor value={v} onChange={setV} businessName={businessName} extensions={extensions} kind="main"/>
    </Modal>
  );
}

function AfterHoursModal({ text, businessName, extensions, onClose, onSave }){
  const [v,setV]=React.useState(text);
  return (
    <Modal icon="clock" title="After-hours greeting" desc="Plays when you’re closed, before callers are routed." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!v.trim()} style={!v.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onSave(v.trim())}>Save</button>
      </React.Fragment>}>
      <GreetEditor value={v} onChange={setV} businessName={businessName} extensions={extensions} kind="closed"/>
      <div className="greet-tip" style={{marginTop:14}}>
        <span className="greet-tip-ic"><Icon name="sparkle"/></span>
        <div className="greet-tip-b">
          <span className="greet-tip-k">Tip</span>
          <p>Handy when you’re closed but still want callers to reach an emergency extension or on-call teammate - e.g. “…if this is an emergency, press 8.” Extension 8 can route anywhere you choose.</p>
        </div>
      </div>
    </Modal>
  );
}

function BusinessHoursModal({ sched, onClose, onSave }){
  const [s,setS]=React.useState({ away:[], ...sched });
  const [adding,setAdding]=React.useState(false);
  const [rz,setRz]=React.useState(''); const [df,setDf]=React.useState(''); const [dt2,setDt2]=React.useState('');
  const addAway=()=>{ if(!df.trim()||!dt2.trim()) return; setS(p=>({...p, away:[...(p.away||[]), {id:'a'+Date.now(), label:rz.trim()||'Away', from:df.trim(), to:dt2.trim()}]})); setRz(''); setDf(''); setDt2(''); setAdding(false); };
  const removeAway=(id)=>setS(p=>({...p, away:(p.away||[]).filter(x=>x.id!==id)}));
  return (
    <Modal icon="clock" title="Business hours" desc="The days and hours you’re open. Outside these, your after-hours greeting plays." onClose={onClose} wide
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>onSave(s)}>Save hours</button>
      </React.Fragment>}>
      <div className="gsched" style={{paddingTop:4}}>
        <div className="gsched-row">
          <span className="gsched-lbl">Open days</span>
          <div className="day-chips">
            {GREET_DAYS.map(d=>{ const o=s.days.includes(d); return (
              <button key={d} className={`day-chip${o?' on':''}`} onClick={()=>setS({...s, days: o?s.days.filter(x=>x!==d):[...s.days,d]})}>{d}</button>
            ); })}
          </div>
        </div>
        <div className="gsched-row">
          <span className="gsched-lbl">Open hours</span>
          <div className="gsched-times">
            <select className="select" value={s.from} onChange={e=>setS({...s,from:e.target.value})}>{GREET_TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
            <span className="gsched-to">to</span>
            <select className="select" value={s.to} onChange={e=>setS({...s,to:e.target.value})}>{GREET_TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </div>
        </div>
        <div className="gsched-row">
          <span className="gsched-lbl">Time zone</span>
          <select className="select gsched-tz" value={s.tz} onChange={e=>setS({...s,tz:e.target.value})}>{GREET_TZS.map(t=><option key={t} value={t}>{t}</option>)}</select>
        </div>
      </div>

      <div className="gsched-away">
        <div className="gaway-h"><b>Time away</b><span>Close for a vacation, conference, or any reason. Callers hear your after-hours greeting on these dates - in addition to your weekly hours.</span></div>
        {(s.away&&s.away.length>0) && (
          <div className="hol-list" style={{marginTop:12}}>
            {s.away.map(a=>(
              <div className="hol-row" key={a.id}>
                <span className="hol-ic"><Icon name="calendar"/></span>
                <div className="hol-main"><b>{a.label}</b><span>{fmtAwayDate(a.from)} – {fmtAwayDate(a.to)}</span></div>
                <button className="hol-x" onClick={()=>removeAway(a.id)} aria-label="Remove"><Icon name="x"/></button>
              </div>
            ))}
          </div>
        )}
        {adding ? (
          <div className="hol-add">
            <input className="input" autoFocus value={rz} onChange={e=>setRz(e.target.value)} placeholder="Reason - e.g. Vacation"/>
            <label className="away-date"><span>From</span><input className="input" type="date" value={df} onChange={e=>setDf(e.target.value)}/></label>
            <label className="away-date"><span>To</span><input className="input" type="date" value={dt2} onChange={e=>setDt2(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addAway(); }}/></label>
            <button className="btn btn-ghost sm" onClick={()=>{ setAdding(false); setRz(''); setDf(''); setDt2(''); }}>Cancel</button>
            <button className="btn btn-primary sm" disabled={!df||!dt2} onClick={addAway}>Add</button>
          </div>
        ) : (
          <button className="add-row" onClick={()=>setAdding(true)} style={{marginTop:12}}><span className="plus"><Icon name="plus"/></span> Add time away</button>
        )}
      </div>
    </Modal>
  );
}

function HolidayModal({ text, businessName, extensions, onClose, onSave }){
  const [v,setV]=React.useState(text);
  return (
    <Modal icon="calendar" title="Holiday greeting" desc="What callers hear on the closure dates in your holiday calendar." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!v.trim()} style={!v.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onSave(v.trim())}>Save</button>
      </React.Fragment>}>
      <GreetEditor value={v} onChange={setV} businessName={businessName} extensions={extensions} kind="holiday"/>
    </Modal>
  );
}

const DEFAULT_HOLIDAYS = [
  { id:'h1', name:"New Year’s Day",     date:'Jan 1',        observed:true },
  { id:'h2', name:'Memorial Day',       date:'May 25',       observed:true },
  { id:'h3', name:'Independence Day',   date:'Jul 4',        observed:true },
  { id:'h4', name:'Labor Day',          date:'Sep 7',        observed:true },
  { id:'h5', name:'Thanksgiving',       date:'Nov 26',       observed:true },
  { id:'h6', name:'Christmas Day',      date:'Dec 25',       observed:true },
  { id:'h7', name:'Office Retreat',     date:'Aug 14 – 15',  observed:true, custom:true },
];

function CalendarModal({ holidays, onClose, onSave }){
  const [items,setItems]=React.useState(holidays);
  const [adding,setAdding]=React.useState(false);
  const [nm,setNm]=React.useState(''); const [dt,setDt]=React.useState('');
  const toggle=(id)=>setItems(a=>a.map(x=>x.id===id?{...x,observed:!x.observed}:x));
  const remove=(id)=>setItems(a=>a.filter(x=>x.id!==id));
  const add=()=>{ if(!nm.trim()||!dt.trim()) return; setItems(a=>[...a,{id:'h'+Date.now(),name:nm.trim(),date:dt.trim(),observed:true,custom:true}]); setNm(''); setDt(''); setAdding(false); };
  return (
    <Modal icon="calendar" title="Holiday calendar" desc="Days you’re closed. Major US holidays are included - add your own closures or date ranges." onClose={onClose} wide
      footer={<button className="btn btn-primary" onClick={()=>onSave(items)}>Done</button>}>
      <div className="hol-list" style={{marginTop:0}}>
        {items.map(h=>(
          <div className={`hol-row${h.observed?'':' off'}`} key={h.id}>
            <span className="hol-ic"><Icon name="calendar"/></span>
            <div className="hol-main"><b>{h.name}</b><span>{h.date}{h.custom?<span className="hol-tag">Custom</span>:''}</span></div>
            {h.custom
              ? <button className="hol-x" onClick={()=>remove(h.id)} aria-label="Remove closure"><Icon name="x"/></button>
              : <Toggle on={h.observed} onChange={()=>toggle(h.id)} sm/>}
          </div>
        ))}
      </div>
      {adding ? (
        <div className="hol-add">
          <input className="input" autoFocus value={nm} onChange={e=>setNm(e.target.value)} placeholder="Closure name - e.g. Company Offsite"/>
          <input className="input" value={dt} onChange={e=>setDt(e.target.value)} placeholder="Date - e.g. Dec 31 or Aug 14 – 15" onKeyDown={e=>{ if(e.key==='Enter') add(); }}/>
          <button className="btn btn-ghost sm" onClick={()=>{ setAdding(false); setNm(''); setDt(''); }}>Cancel</button>
          <button className="btn btn-primary sm" disabled={!nm.trim()||!dt.trim()} onClick={add}>Add</button>
        </div>
      ) : (
        <button className="add-row" onClick={()=>setAdding(true)} style={{marginTop:10}}><span className="plus"><Icon name="plus"/></span> Add a closure</button>
      )}
    </Modal>
  );
}

function GreetingsScreen({ onGoExtensions, extensions, businessName }){
  const name = businessName || 'Smilebar';
  const [mainText,setMainText]=React.useState(`Thank you for calling ${name}.`);
  const [useClosed,setUseClosed]=React.useState(false);
  const [hours,setHours]=React.useState({ days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM', tz:'Eastern (ET)', away:[] });
  const [closedText,setClosedText]=React.useState(`Thanks for calling ${name}. Our office is currently closed.`);
  const [holOn,setHolOn]=React.useState(false);
  const [holText,setHolText]=React.useState(`Thanks for calling ${name}. We’re closed for the holiday today.`);
  const [holSameAsAH,setHolSameAsAH]=React.useState(true); // default: reuse after-hours greeting
  const [holidays,setHolidays]=React.useState(DEFAULT_HOLIDAYS);
  const [modal,setModal]=React.useState(null);
  const [gtab,setGtab]=React.useState('main');
  const [flow,setFlow]=React.useState('operator'); // operator | require
  const [repeatStar,setRepeatStar]=React.useState(true);
  const GreetingRow = window.GreetingRow;
  const voice = 'Aria';
  const hoursLabel = `${daysSummary(hours.days)} · ${hours.from}–${hours.to} ${tzAbbr(hours.tz)}`;
  // the menu is built from extensions: 0 = Operator, 1–8 = standard, 9 = Directory
  const op = (extensions||[]).find(e=>Number(e.number)===0);
  const opName = (op&&op.name) || 'Operator';
  const menuExts = (extensions||[]).filter(e=>Number(e.number)>=1 && Number(e.number)<=8 && e.enabled && e.status!=='disabled').sort((a,b)=>a.number-b.number);
  const menuKeys = [ {n:0,label:opName}, ...menuExts.map(e=>({n:e.number,label:e.name})), {n:9,label:'Directory'} ];
  const cap = s=> s ? s.charAt(0).toUpperCase()+s.slice(1) : s;
  const listPhrase = menuExts.map(e=>`for ${e.name} press ${e.number}`).join(', ');
  const mainSug = flow==='require'
    ? [
        `Thank you for calling ${name}. ${listPhrase?cap(listPhrase)+', ':''}for our directory press 9.`,
        `Thanks for calling ${name}! ${listPhrase?cap(listPhrase)+'. ':''}Press 9 for our directory.`,
        `You’ve reached ${name}. ${listPhrase?cap(listPhrase)+', ':''}or press 9 for the directory.`,
      ]
    : [
        `Thank you for calling ${name}. Please stay on the line and we’ll connect you, or press 0 for the operator.`,
        listPhrase ? `Thanks for calling ${name}! ${cap(listPhrase)}, or just hold and we’ll connect you.` : `Thanks for calling ${name}! Stay on the line and we’ll be right with you.`,
        `You’ve reached ${name}. One moment while we connect you - or press 0 for the operator.`,
      ];
  const closedSug = [
    `Thanks for calling ${name}. We’re currently closed. Please leave a message and we’ll call you back.`,
    `You’ve reached ${name} after hours. Leave your name and number, and we’ll reach out the next business day.`,
    `Thank you for calling ${name}. Our office is closed right now - please leave a message after the tone.`,
  ];
  const activeHol=holidays.filter(h=>h.observed).length;
  const customHol=holidays.filter(h=>h.custom).length;
  return (
    <div className="ext-listview">
      <div className="lv-head">
        <div>
          <h1 className="lv-title">Greetings</h1>
          <p className="lv-sub">What callers hear when they reach you. Your numbers share these greetings.</p>
        </div>
      </div>

      <div className="eg-subnav">
        <Segmented value={gtab} onChange={setGtab} full options={[
          { value:'main', label:'Main greeting', icon:'message' },
          { value:'closed', label:'After-hours', icon:'clock' },
        ]}/>
      </div>

      {gtab==='main' && (
        <React.Fragment>
          <Card icon="message" title="Main greeting"
            desc={`What every caller hears first, before they’re routed to a person or menu. Plays on all of ${name}’s numbers.`}>
            <GreetingRow text={mainText} voice={voice} suggestions={mainSug}/>
          </Card>
          <Card icon="route" title="After the greeting" desc="What callers can do once they’ve heard it.">
            <div className="choices">
              <Choice on={flow==='operator'} onClick={()=>setFlow('operator')}
                title="Hold or press 0 for the operator"
                desc={`Callers can press a key, or just stay on the line - JOEL connects them to ${opName} (Ext 0). The simplest, most forgiving setup, and the default.`}/>
              <Choice on={flow==='require'} onClick={()=>setFlow('require')}
                title="Require callers to choose"
                desc="Callers must press a key. If they stay silent, JOEL replays the greeting once, then connects them to the operator so no one is stranded."/>
            </div>
            <div className="sched-row" style={{marginTop:16}}>
              <span className="sched-ic"><Icon name="copy"/></span>
              <div className="sched-row-t"><b>Let callers press * to hear the greeting again</b><span>Useful when you read out several options.</span></div>
              <Toggle on={repeatStar} onChange={setRepeatStar}/>
            </div>
            <div className="greet-keys">
              <div className="greet-keys-h">What callers can press</div>
              <div className="greet-keys-row">
                {menuKeys.map(k=>(<span key={k.n} className={`gkey${k.n===9?' dir':''}`}><b>{k.n}</b>{k.label}</span>))}
              </div>
              <p className="greet-keys-note">Built automatically from your extensions - <button className="inline-link" onClick={onGoExtensions}>add or rename one</button> and the menu and greeting update together. Your greeting above should name these options; tap <b>Suggest a greeting</b> to match the wording.</p>
            </div>
          </Card>
        </React.Fragment>
      )}

      {gtab==='closed' && (
        <Card icon="clock" title="After-hours greeting"
          desc="A separate greeting for callers who reach you outside business hours or on a holiday. After it plays, callers are routed as usual."
          action={<Toggle on={useClosed} onChange={setUseClosed}/>}>
          {useClosed ? (
            <React.Fragment>
              <div className="note info" style={{marginBottom:16}}><Icon name="info"/><span>Plays automatically outside <b>{hoursLabel}</b>, on the <b>{activeHol} holiday{activeHol!==1?'s':''}</b> you observe{customHol?` and ${customHol} custom closure${customHol!==1?'s':''}`:''}{(hours.away&&hours.away.length)?`, and on ${hours.away.length} scheduled time away`:''}.</span></div>
              <GreetingRow text={closedText} voice={voice} suggestions={closedSug}/>
              <div className="sched-row" style={{marginTop:18}}>
                <span className="sched-ic"><Icon name="clock"/></span>
                <div className="sched-row-t"><b>Business hours</b><span>{`${hoursLabel}` + ((hours.away&&hours.away.length)?` · ${hours.away.length} time away`:'')}</span></div>
                <button className="btn btn-secondary sm" onClick={()=>setModal('hours')}><Icon name="pencil"/> Edit hours</button>
              </div>
              <div className="sched-row">
                <span className="sched-ic"><Icon name="calendar"/></span>
                <div className="sched-row-t"><b>Holiday closures</b><span>{`${activeHol} holiday${activeHol!==1?'s':''} observed · ${customHol} custom closure${customHol!==1?'s':''}`}</span></div>
                <button className="btn btn-secondary sm" onClick={()=>setModal('calendar')}><Icon name="sliders"/> Manage</button>
              </div>
            </React.Fragment>
          ) : (
            <div className="note warn"><Icon name="info"/><span><b>Off.</b> Your main greeting plays for every call, day or night. Turn this on to greet callers differently after hours and on holidays.</span></div>
          )}
        </Card>
      )}

      <button className="greet-extlink" onClick={onGoExtensions} style={{marginTop:16}}>
        <span className="greet-extlink-ic"><Icon name="route"/></span>
        <span className="greet-extlink-t"><b>Extension voicemail greetings</b><span>Each extension has its own - manage them on the extension.</span></span>
        <Icon name="chevright"/>
      </button>

      {modal==='main' && <MainGreetingModal initial={mainText} businessName={name} extensions={extensions} onClose={()=>setModal(null)} onSave={(t)=>{ setMainText(t); setModal(null); }}/>}
      {modal==='closed' && <AfterHoursModal text={closedText} businessName={name} extensions={extensions} onClose={()=>setModal(null)} onSave={(t)=>{ setClosedText(t); setModal(null); }}/>}
      {modal==='hours' && <BusinessHoursModal sched={hours} onClose={()=>setModal(null)} onSave={(s)=>{ setHours(s); setModal(null); }}/>}
      {modal==='holiday' && <HolidayModal text={holText} businessName={name} extensions={extensions} onClose={()=>setModal(null)} onSave={(t)=>{ setHolText(t); setModal(null); }}/>}
      {modal==='calendar' && <CalendarModal holidays={holidays} onClose={()=>setModal(null)} onSave={(items)=>{ setHolidays(items); setModal(null); }}/>}
    </div>
  );
}

Object.assign(window, { SystemScreen, NumbersScreen, GreetingsScreen });
