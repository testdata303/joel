/* ============================================================
   JOEL app — Extension Detail panels  (exports to window)
   ============================================================ */
const { Icon, Toggle, Segmented, Choice, Field, Avatar, Card, Wave, Modal } = window;

const TIMES = (()=>{ const out=[]; for(let h=0;h<24;h++){ for(const m of [0,30]){ const ap=h<12?'AM':'PM'; let hh=h%12; if(hh===0)hh=12; out.push(`${hh}:${m===0?'00':'30'} ${ap}`);} } return out; })();

/* ---------------- GENERAL ---------------- */
function TtsPreview({ text }){
  const [playing,setPlaying]=useState(false);
  const [generated,setGenerated]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),1800); return ()=>clearTimeout(t); },[playing]);
  if(!generated){
    return (
      <button className="btn btn-secondary sm" style={{marginTop:12}} disabled={!text} onClick={()=>{setGenerated(true);setPlaying(true);}}>
        <Icon name="sparkle"/> Generate &amp; preview audio
      </button>
    );
  }
  return (
    <div className="tts-preview">
      <button className="tts-play" onClick={()=>setPlaying(p=>!p)} aria-label="Play spoken name">
        <Icon name={playing?'pause':'play'}/>
      </button>
      <div className="tts-wave"><Wave n={26} playing={playing}/></div>
      <span className="tts-meta">“{text}”</span>
      <button className="btn btn-ghost sm" onClick={()=>{setGenerated(false);}}><Icon name="sparkle"/> Regenerate</button>
    </div>
  );
}

function GeneralPanel({ ext, patch }){
  const taken = (ext.otherExtensions||[]).map(o=>String(o.number));
  const numPool = [1,2,3,4,5,6,7,8,100,101,102,103,104,105];
  const available = numPool.filter(nu=>String(nu)===String(ext.number) || !taken.includes(String(nu)));
  return (
    <div className="panel">
      <Card icon="sliders" title="Basics">
        <Field label="Extension number"
          help="Numbers 0 (Operator) and 9 (Directory) are reserved. Standard extensions are 1–8, and additional ones start at 100.">
          <div style={{maxWidth:130}}>
            <select className="select" value={ext.number} onChange={e=>patch({number:Number(e.target.value)})} aria-label="Extension number">
              {available.map(nu=><option key={nu} value={nu}>{nu}</option>)}
            </select>
          </div>
        </Field>
        <Field label="Extension name" help="The internal name your team sees across calls, voicemails, and forwarding.">
          <div style={{maxWidth:340}}>
            <input className="input" value={ext.name} onChange={e=>patch({name:e.target.value})} placeholder="e.g. Sales"/>
          </div>
        </Field>
      </Card>
    </div>
  );
}

/* ---------------- ROUTING ---------------- */
const DEST_META = {
  phone:{ icon:'phone', kind:'Phone number' },
  sip:{ icon:'monitor', kind:'Desk phone' },
  app:{ icon:'smartphone', kind:'Mobile app' },
};
function destLabel(d){
  if(d.type==='phone') return d.number;
  if(d.type==='sip') return d.device;
  return d.user;
}
function schedText(s){
  if(!s) return '';
  if(typeof s==='string') return s;
  const order=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const sorted=order.filter(d=>(s.days||[]).includes(d));
  let days = sorted.length===7?'Every day':sorted.join(', ');
  if(sorted.length>2){ let run=true; for(let i=1;i<sorted.length;i++){ if(order.indexOf(sorted[i])!==order.indexOf(sorted[i-1])+1){ run=false; break; } } if(run) days=`${sorted[0]}–${sorted[sorted.length-1]}`; }
  const tz=(String(s.tz||'').match(/\(([^)]+)\)/)||[])[1]||'';
  return `${days}, ${s.from}–${s.to}${tz?' '+tz:''}`;
}

function DestRow({ d, index, total, ordered, onToggle, onScreening, onMove, onEdit, onRemove }){
  const [menu, setMenu] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    if(!menu) return;
    const h=e=>{ if(ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[menu]);
  const m = DEST_META[d.type];
  return (
    <div className={`drow${ordered?' ordered':''}${d.enabled?'':' disabled'}`}>
      {ordered && <span className="grip"><Icon name="grip" sw={2}/></span>}
      {ordered && <span className="order-n">{index+1}</span>}
      <span className="d-icon"><Icon name={m.icon}/></span>
      <div className="d-main">
        <div className="dn">{d.label || destLabel(d)}{!d.enabled && <span className="pill off">Off</span>}</div>
        <div className="dm">
          <span className="d-kind">{m.kind}{d.label?` · ${destLabel(d)}`:''}</span>
          {d.screening && <span className="tag screen"><Icon name="shield"/> Call announce</span>}
          {d.schedule && <span className="tag"><Icon name="calendar"/> {schedText(d.schedule)}</span>}
        </div>
      </div>
      <div className="d-actions" ref={ref} style={{position:'relative'}}>
        <Toggle on={d.enabled} onChange={()=>onToggle(d.id)} sm/>
        <button className="kebab" onClick={()=>setMenu(v=>!v)} aria-label="More options"><Icon name="kebab"/></button>
        {menu && (
          <div style={{position:'absolute',top:38,right:0,background:'#fff',border:'1px solid var(--line)',
            borderRadius:12,boxShadow:'var(--shadow-pop)',padding:6,width:220,zIndex:20}}>
            <button className="menu-it" style={menuItem} onClick={()=>{onScreening(d.id);}}>
              <Icon name="shield" style={ic}/> Call announce
              <span style={{marginLeft:'auto'}}><Toggle on={d.screening} onChange={()=>onScreening(d.id)} sm/></span>
            </button>
            {ordered && index>0 && <button style={menuItem} onClick={()=>{onMove(d.id,-1);setMenu(false);}}><Icon name="chevdown" style={{...ic,transform:'rotate(180deg)'}}/> Move up</button>}
            {ordered && index<total-1 && <button style={menuItem} onClick={()=>{onMove(d.id,1);setMenu(false);}}><Icon name="chevdown" style={ic}/> Move down</button>}
            <button style={menuItem} onClick={()=>{onEdit(d);setMenu(false);}}><Icon name="pencil" style={ic}/> Edit destination</button>
            <div style={{height:1,background:'var(--line)',margin:'5px 4px'}}/>
            <button style={{...menuItem,color:'var(--red)'}} onClick={()=>{onRemove(d.id);setMenu(false);}}><Icon name="trash" style={{...ic,color:'var(--red)'}}/> Remove</button>
          </div>
        )}
      </div>
    </div>
  );
}
const menuItem={display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:8,fontSize:'.88rem',fontWeight:600,color:'var(--ink)',textAlign:'left'};
const ic={width:16,height:16,color:'var(--muted)',flexShrink:0};

/* transfer-experience option with a Listen preview */
function TransferOption({ on, onSelect, title, desc, children }){
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2400); return ()=>clearTimeout(t); },[playing]);
  return (
    <div className={`tx-opt${on?' on':''}`}>
      <button className="tx-opt-main" onClick={onSelect} role="radio" aria-checked={on}>
        <span className={`radio${on?' on':''}`}/>
        <span className="tx-opt-t"><b>{title}</b><span>{desc}</span></span>
      </button>
      <button className={`tx-listen${playing?' on':''}`} onClick={()=>setPlaying(p=>!p)} aria-label={`Listen to ${title}`}>
        <Icon name={playing?'pause':'play'}/> {playing?'Playing…':'Listen'}
      </button>
      {on && children}
    </div>
  );
}

/* extension office hours — gates whether this extension routes calls */
const OH_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const OH_TZS=['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','Alaska (AKT)','Hawaii (HT)'];
const OH_MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function ohFmt(d){ if(!d) return ''; const dt=new Date(d+'T00:00:00'); if(isNaN(dt)) return d; return `${OH_MO[dt.getMonth()]} ${dt.getDate()}`; }
const OH_WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function ohFmtLong(d){ if(!d) return ''; const dt=new Date(d+'T00:00:00'); if(isNaN(dt)) return d; return `${OH_WD[dt.getDay()]}, ${OH_MO[dt.getMonth()]} ${dt.getDate()}`; }
const OH_NOW=new Date(2026,5,6); // fixed "now" for the mock
function ohDateIn(days){ const d=new Date(OH_NOW); d.setDate(d.getDate()+days); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

/* "Away now" — close the extension immediately, with a quick duration prompt */
function AwayNow({ away, onSetAway }){
  const [open,setOpen]=useState(false);
  const [custom,setCustom]=useState(false);
  const [cd,setCd]=useState('');
  const ref=useRef(null);
  useEffect(()=>{ if(!open) return; const h=e=>{ if(ref.current && !ref.current.contains(e.target)){ setOpen(false); setCustom(false); setCd(''); } }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[open]);
  const a = away;
  const goAway=(until)=>{ onSetAway({since:OH_NOW.toISOString(),until}); setOpen(false); setCustom(false); setCd(''); };
  const turnOn=()=>onSetAway(null);
  if(a){
    return (
      <div className="awaynow-active">
        <span className="awaynow-dot"/>
        <div className="awaynow-active-t">
          <b>This extension is away right now</b>
          <span>Callers hear the away greeting and can leave a voicemail.</span>
          <span className="awaynow-until">
            {a.until==='open'
              ? <React.Fragment><Icon name="info"/> Stays closed until you turn it back on — no end date.</React.Fragment>
              : <React.Fragment><Icon name="clock"/> Turns back on automatically on <strong>{ohFmtLong(a.until)}</strong>.</React.Fragment>}
          </span>
        </div>
        <button className="btn btn-primary sm" onClick={turnOn}>Turn back on</button>
      </div>
    );
  }
  return (
    <div className="awaynow" ref={ref}>
      <div className="gaway-h"><b>Away now</b><span>Step away immediately, without setting a date. Calls go straight to the away greeting until you’re back.</span></div>
      <button className={`btn btn-secondary sm awaynow-btn${open?' on':''}`} onClick={()=>{ setOpen(o=>!o); setCustom(false); }}>
        Set away now <Icon name="chevdown" style={{width:15,height:15,transform:open?'rotate(180deg)':'none',transition:'transform .15s'}}/>
      </button>
      {open && (
        <div className="awaynow-panel">
          {!custom ? (
            <div className="awaynow-opts">
              <button className="awaynow-opt" onClick={()=>goAway('open')}><b>Until I turn it back on</b><span>No end date — stays closed</span></button>
              <button className="awaynow-opt" onClick={()=>goAway(ohDateIn(1))}><b>For 1 day</b><span>Back on {ohFmt(ohDateIn(1))}</span></button>
              <button className="awaynow-opt" onClick={()=>goAway(ohDateIn(2))}><b>For 2 days</b><span>Back on {ohFmt(ohDateIn(2))}</span></button>
              <button className="awaynow-opt" onClick={()=>setCustom(true)}><b>Custom…</b><span>Away until a date you pick</span></button>
            </div>
          ) : (
            <div className="awaynow-custom">
              <label className="away-date"><span>Back on</span><input className="input" type="date" autoFocus value={cd} min={ohDateIn(1)} onChange={e=>setCd(e.target.value)}/></label>
              <div className="awaynow-custom-acts">
                <button className="btn btn-ghost sm" onClick={()=>{ setCustom(false); setCd(''); }}>Back</button>
                <button className="btn btn-primary sm" disabled={!cd} onClick={()=>goAway(cd)}>Set away</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function OfficeHoursCard({ oh, onChange, away, onSetAway }){
  const [adding,setAdding]=useState(false);
  const [rz,setRz]=useState(''); const [df,setDf]=useState(''); const [dt,setDt]=useState('');
  const set=(p)=>onChange({...oh,...p});
  const addAway=()=>{ if(!df||!dt) return; set({away:[...(oh.away||[]),{id:'a'+Date.now(),label:rz.trim()||'Away',from:df,to:dt}]}); setRz(''); setDf(''); setDt(''); setAdding(false); };
  const removeAway=(id)=>set({away:(oh.away||[]).filter(x=>x.id!==id)});
  const mode=oh.mode||'247';
  return (
    <Card icon="clock" title="Extension office hours"
      desc="Set the hours this extension routes calls. Outside these hours, callers hear the away greeting and can leave a voicemail.">
      <div className="fwd-mode">
        <span className="fwd-label">Schedule</span>
        <Segmented full value={mode} onChange={v=>set({mode:v})} options={[
          {value:'247', label:'Open 24/7', icon:'clock'},
          {value:'custom', label:'Custom hours', icon:'calendar'},
        ]}/>
        <p className="fwd-hint">{mode==='247'?'This extension routes calls around the clock.':'Calls route only on the days and times below — otherwise callers reach the away greeting.'}</p>
      </div>
      {mode==='custom' && (
        <div className="gsched" style={{marginTop:6}}>
          <div className="gsched-row">
            <span className="gsched-lbl">Open days</span>
            <div className="day-chips">{OH_DAYS.map(d=>{ const o=(oh.days||[]).includes(d); return <button key={d} className={`day-chip${o?' on':''}`} onClick={()=>set({days:o?oh.days.filter(x=>x!==d):[...(oh.days||[]),d]})}>{d}</button>; })}</div>
          </div>
          <div className="gsched-row">
            <span className="gsched-lbl">Open hours</span>
            <div className="gsched-times">
              <select className="select" value={oh.from} onChange={e=>set({from:e.target.value})}>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
              <span className="gsched-to">to</span>
              <select className="select" value={oh.to} onChange={e=>set({to:e.target.value})}>{TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
            </div>
          </div>
          <div className="gsched-row">
            <span className="gsched-lbl">Time zone</span>
            <select className="select gsched-tz" value={oh.tz} onChange={e=>set({tz:e.target.value})}>{OH_TZS.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </div>
        </div>
      )}
      <div className="gsched-away">
        <AwayNow away={away} onSetAway={onSetAway}/>
        <div className="gaway-h" style={{marginTop:24}}><b>Scheduled away dates</b><span>Plan ahead — close this extension for a vacation or any reason. On these dates callers hear the away greeting and can leave a voicemail.</span></div>
        {(oh.away&&oh.away.length>0) && (
          <div className="hol-list" style={{marginTop:12}}>
            {oh.away.map(a=>(
              <div className="hol-row" key={a.id}>
                <span className="hol-ic"><Icon name="calendar"/></span>
                <div className="hol-main"><b>{a.label}</b><span>{ohFmt(a.from)} – {ohFmt(a.to)}</span></div>
                <button className="hol-x" onClick={()=>removeAway(a.id)} aria-label="Remove"><Icon name="x"/></button>
              </div>
            ))}
          </div>
        )}
        {adding ? (
          <div className="hol-add">
            <input className="input" autoFocus value={rz} onChange={e=>setRz(e.target.value)} placeholder="Reason — e.g. Vacation"/>
            <label className="away-date"><span>From</span><input className="input" type="date" value={df} onChange={e=>setDf(e.target.value)}/></label>
            <label className="away-date"><span>To</span><input className="input" type="date" value={dt} onChange={e=>setDt(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addAway(); }}/></label>
            <button className="btn btn-ghost sm" onClick={()=>{ setAdding(false); setRz(''); setDf(''); setDt(''); }}>Cancel</button>
            <button className="btn btn-primary sm" disabled={!df||!dt} onClick={addAway}>Add</button>
          </div>
        ) : (
          <button className="add-row" onClick={()=>setAdding(true)} style={{marginTop:12}}><span className="plus"><Icon name="plus"/></span> Set away dates</button>
        )}
      </div>
    </Card>
  );
}

/* preview the greeting callers hear when the extension is closed */
function ClosedGreetingPreview({ ext }){
  const which = (ext.officeHours && ext.officeHours.afterHours==='away') ? 'away' : 'vm';
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2600); return ()=>clearTimeout(t); },[playing]);
  useEffect(()=>{ setPlaying(false); },[which]);
  const vm = ext.voicemail||{};
  const voice = vm.voice || 'Aria';
  const text = which==='away'
    ? `You’ve reached ${ext.name} at Smilebar. We’re away from the phones right now — please leave a message and we’ll call you back.`
    : (vm.greeting || `You’ve reached ${ext.name} at Smilebar. Please leave your name, number, and a message after the tone.`);
  return (
    <div className="closed-preview">
      <div className="greeting">
        <button className="play" onClick={()=>setPlaying(p=>!p)} aria-label="Preview greeting"><Icon name={playing?'pause':'play'}/></button>
        <Wave n={40} playing={playing}/>
        <div className="gmeta"><span>0:06</span></div>
      </div>
      <span className="closed-preview-voice"><Icon name="sparkle"/> {voice} voice</span>
      <p className="closed-preview-text">“{text}”</p>
    </div>
  );
}

function SchedulePanel({ ext, patch, away, onSetAway }){
  const oh = ext.officeHours||{mode:'247'};
  const set=(p)=>patch({officeHours:{...oh,...p}});
  return (
    <div className="panel">
      <OfficeHoursCard oh={oh} onChange={(v)=>patch({officeHours:v})} away={away} onSetAway={onSetAway}/>
      <Card icon="voicemail" title="When this extension is closed"
          desc="What callers hear after hours, on away dates, and while you’re away — once forwarding stops.">
          <div className="closed-seg">
          <Segmented value={oh.afterHours||'forward-off'} onChange={v=>set({afterHours:v})} options={[
            {value:'forward-off', label:'Play voicemail greeting'},
            {value:'away', label:'Play away greeting'},
          ]}/>
          </div>
          <p className="fwd-hint">{(oh.afterHours||'forward-off')==='away'
            ? 'Callers hear this extension’s away greeting, then can leave a voicemail.'
            : 'Callers hear the voicemail greeting and can leave a message — no separate away greeting plays.'}</p>
          <ClosedGreetingPreview ext={ext}/>
        </Card>
    </div>
  );
}

function RoutingPanel({ ext, patch, onToggle, onScreening, onMove, onEdit, onRemove, openAddDest }){
  const [showUpsell,setShowUpsell]=useState(false);
  const [showRecUpsell,setShowRecUpsell]=useState(false);
  const [tePlay,setTePlay]=useState(false);
  useEffect(()=>{ if(!tePlay) return; const t=setTimeout(()=>setTePlay(false),2000); return ()=>clearTimeout(t); },[tePlay]);
  const isMax = false; // not on the Max plan
  const ordered = ext.routing==='one';
  const dests = ext.destinations;
  const enabled = dests.filter(d=>d.enabled);
  // schedule conflict: there are enabled destinations but every one is schedule-restricted (none always-on)
  const scheduleGap = enabled.length>0 && enabled.every(d=>d.schedule);
  return (
    <div className="panel">

      {scheduleGap && ext.fallback==='voicemail' && (
        <div className="note warn" style={{marginBottom:18}}>
          <Icon name="info"/>
          <span>No active destinations are available outside their set schedules. During those times, calls route to voicemail.</span>
        </div>
      )}

      <Card>
        {dests.length===0 ? (
          <div className="empty" style={{paddingTop:24,paddingBottom:14}}>
            <span className="ei"><Icon name="phoneoff"/></span>
            <h4>This extension isn't ringing anywhere yet</h4>
            <p>Add a destination so calls to {ext.name} can reach a phone, desk phone, or the mobile app.</p>
            <button className="btn btn-primary" onClick={()=>openAddDest()}><Icon name="plus"/> Add destination</button>
          </div>
        ) : (
          <div className="dlist bordered">
            {dests.map((d,i)=>(
              <DestRow key={d.id} d={d} index={i} total={dests.length} ordered={ordered}
                onToggle={onToggle} onScreening={onScreening} onMove={onMove} onEdit={onEdit} onRemove={onRemove}/>
            ))}
            <button className="add-row" onClick={()=>openAddDest()}>
              <span className="plus"><Icon name="plus"/></span> Add a destination
            </button>
          </div>
        )}
      </Card>

      <Card icon="settings" title="Advanced" desc="Fine-tune how this extension rings and what callers experience.">
        {dests.length>1 && (
          <div className="advrow">
            <div className="advrow-h"><b>When a call comes in</b><span>How destinations ring</span></div>
            <div className="adv-ringseg">
              <div className="segmented">
                <button className={`seg${ext.routing!=='all'?' on':''}`} onClick={()=>{ setShowUpsell(false); patch({routing:'one'}); }}>One at a time</button>
                <button className={`seg${ext.routing==='all'?' on':''}`} onClick={()=>{ if(isMax){ patch({routing:'all'}); } else { setShowUpsell(true); } }}>Everyone at once</button>
              </div>
              {!isMax && <span className="pill max"><Icon name="sparkle" style={{width:12,height:12}}/> Max</span>}
            </div>
            {showUpsell && !isMax && <div className="adv-maxrow"><div className="adv-upsell"><span className="upsell-ic"><Icon name="sparkle"/></span><div className="adv-upsell-t"><b>Ring everyone at once is a Max feature</b><span>Upgrade to ring all your destinations together.</span></div><button className="btn btn-primary sm">Upgrade to Max</button></div></div>}
          </div>
        )}
        <div className="advrow">
          <div className="advrow-h"><b>Transfer experience</b><span>What callers hear while connecting</span></div>
          <div className="advseg te-seg">
            <Segmented value={ext.transferExp||'ring'} onChange={v=>patch({transferExp:v})} options={[
              {value:'ring',label:'Ringing'},{value:'greeting',label:'Transfer greeting'},{value:'music',label:'Music on hold'}]}/>
            <button className="te-listen" onClick={()=>setTePlay(p=>!p)}><Icon name={tePlay?'pause':'play'}/> {tePlay?'Playing…':'Listen'}</button>
          </div>
        </div>
        <div className="advrow">
          <div className="advrow-h"><b>Caller ID on forwarded calls</b><span>What shows on your phone</span></div>
          <div className="advseg"><Segmented value={ext.fwdCallerId||'business'} onChange={v=>patch({fwdCallerId:v})} options={[
            {value:'business',label:'Business number'},{value:'caller',label:'Caller’s number'}]}/></div>
        </div>
        <div className="advrow">
          <div className="advrow-h"><b>If no one answers</b><span>When every destination is missed</span></div>
          <div className="advseg"><Segmented value={ext.fallback||'voicemail'} onChange={v=>patch({fallback:v})} options={[
            {value:'voicemail',label:'Voicemail'},{value:'forward',label:'Forward'},{value:'disconnect',label:'End call'}]}/></div>
          {(ext.fallback||'voicemail')==='voicemail' && <div className="adv-maxrow"><span className="advnote"><Icon name="info"/> Manage the voicemail greeting under <b>Greetings</b>.</span></div>}
          {ext.fallback==='forward' && (
            <div className="advfwd-box">
              <span className="advfwd-ic"><Icon name="route"/></span>
              <div className="advfwd-main">
                <label>Forward to extension</label>
                <select className="select" value={ext.forwardTo} onChange={e=>patch({forwardTo:e.target.value})}>{ext.otherExtensions.map(o=><option key={o.number} value={o.number}>Ext {o.number} · {o.name}</option>)}</select>
              </div>
            </div>
          )}
        </div>
        <div className="advrow">
          <div className="advrow-h"><b>Call recording</b><span>Keep an audio copy, transcript &amp; summary</span></div>
          <div className="advseg adv-recseg">
            {!ext.recordingOn && <span className="pill max"><Icon name="sparkle" style={{width:12,height:12}}/> Max</span>}
            <Toggle on={ext.recordingOn} onChange={v=>{
              if(v){ if(isMax){ patch({recordingOn:true}); } else { setShowRecUpsell(true); } }
              else { setShowRecUpsell(false); patch({recordingOn:false}); }
            }}/>
          </div>
          {ext.recordingOn
            ? <p className="advhint" style={{fontStyle:'normal'}}><Icon name="info"/> Callers hear “Your call may be recorded.” Recording laws vary by location.</p>
            : <p className="advhint" style={{fontStyle:'normal'}}>Record, transcribe, and summarize every call on this extension — available on the Max plan.</p>}
          {showRecUpsell && !isMax && <div className="adv-maxrow"><div className="adv-upsell"><span className="upsell-ic"><Icon name="sparkle"/></span><div className="adv-upsell-t"><b>Call recording is a Max feature</b><span>Upgrade to record, transcribe, and summarize every call on this extension.</span></div><button className="btn btn-primary sm">Upgrade to Max</button></div></div>}
        </div>
      </Card>
    </div>
  );
}
function GreetingRow({ title, badge, text, voice, suggestions }){
  const [source,setSource]=useState('default'); // default | ai | rec — system default first
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2200); return ()=>clearTimeout(t); },[playing]);
  // edit-text flow (AI voice)
  const [val,setVal]=useState(text);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState(text);
  const [sugIdx,setSugIdx]=useState(0);
  useEffect(()=>{ setVal(text); },[text]);
  const openEdit=()=>{ setDraft(val); setEditing(true); };
  const saveEdit=()=>{ setVal((draft.trim()||val)); setEditing(false); };
  const cancelEdit=()=>{ setEditing(false); };
  const sugList = (suggestions&&suggestions.length) ? suggestions : [];
  const suggestGreeting=()=>{ if(!sugList.length) return; setDraft(sugList[sugIdx%sugList.length]); setSugIdx(i=>(i+1)%sugList.length); };
  // record-your-own flow
  const [recState,setRecState]=useState('idle'); // idle | recording | done
  const [recSecs,setRecSecs]=useState(0);
  const [recPlaying,setRecPlaying]=useState(false);
  useEffect(()=>{ if(recState!=='recording') return; const iv=setInterval(()=>setRecSecs(s=>s+1),1000); return ()=>clearInterval(iv); },[recState]);
  useEffect(()=>{ if(!recPlaying) return; const t=setTimeout(()=>setRecPlaying(false),2200); return ()=>clearTimeout(t); },[recPlaying]);
  const fmtSecs=(s)=>`0:${String(s).padStart(2,'0')}`;
  const startRec=()=>{ setRecSecs(0); setRecState('recording'); };
  const stopRec=()=>setRecState('done');
  const resetRec=()=>{ setRecState('idle'); setRecSecs(0); setRecPlaying(false); };
  return (
    <div className="field">
      {title && <label>{title}</label>}
      <div className="greet-source greet-source-3" role="tablist">
        <button role="tab" aria-selected={source==='default'} className={`greet-srcopt${source==='default'?' on':''}`} onClick={()=>setSource('default')}>
          <Icon name="audiolines"/><span><b>System default</b><small>Ready to use</small></span>
        </button>
        <button role="tab" aria-selected={source==='ai'} className={`greet-srcopt${source==='ai'?' on':''}`} onClick={()=>setSource('ai')}>
          <Icon name="sparkle"/><span><b>AI voice</b><small>Generated for you</small></span>
        </button>
        <button role="tab" aria-selected={source==='rec'} className={`greet-srcopt${source==='rec'?' on':''}`} onClick={()=>setSource('rec')}>
          <Icon name="mic"/><span><b>Record</b><small>Use your mic</small></span>
        </button>
      </div>
      {source==='default' ? (
        <div className="greet-body">
          <div className="greeting">
            <button className="play" onClick={()=>setPlaying(p=>!p)} aria-label="Preview greeting"><Icon name={playing?'pause':'play'}/></button>
            <Wave n={40} playing={playing}/>
            <div className="gmeta"><span>0:06</span></div>
          </div>
          <p className="greet-defnote"><Icon name="info"/> JOEL’s ready-made greeting — works out of the box. Switch to AI or a recording to personalize it.</p>
        </div>
      ) : source==='ai' ? (
        <div className="greet-body">
          {editing ? (
            <React.Fragment>
              <textarea className="greet-edit" autoFocus value={draft} onChange={e=>setDraft(e.target.value)} rows={3} placeholder="Write what callers should hear…"/>
              {sugList.length>0 && (
                <div className="greet-sug">
                  <button className="greet-sug-btn" onClick={suggestGreeting}><Icon name="sparkle"/> Suggest a greeting</button>
                  <span className="greet-sug-note">Based on your business setup — tap again for another.</span>
                </div>
              )}
              <div className="greet-acts">
                <button className="btn btn-primary sm" onClick={saveEdit}><Icon name="check"/> Save</button>
                <button className="btn btn-secondary sm" onClick={cancelEdit}>Cancel</button>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="greeting">
                <button className="play" onClick={()=>setPlaying(p=>!p)} aria-label="Preview greeting"><Icon name={playing?'pause':'play'}/></button>
                <Wave n={40} playing={playing}/>
                <div className="gmeta"><span>0:06</span></div>
              </div>
              <span className="ai-tag"><Icon name="sparkle"/> {voice} voice</span>
              <p className="greet-script">“{val}”</p>
              <div className="greet-acts">
                <button className="btn btn-secondary sm" onClick={openEdit}><Icon name="pencil"/> Edit text</button>
                <button className="btn btn-secondary sm"><Icon name="sparkle"/> Change voice</button>
              </div>
            </React.Fragment>
          )}
        </div>
      ) : (
        <div className="greet-body">
          {recState==='idle' && (
            <div className="greet-rec">
              <button className="rec-btn" onClick={startRec} aria-label="Start recording"><Icon name="mic"/></button>
              <div className="greet-rec-t"><b>Record your greeting</b><span>Click to start, then read your message aloud. Your recording plays instead of the AI voice.</span></div>
            </div>
          )}
          {recState==='recording' && (
            <div className="greet-rec live">
              <button className="rec-btn stop" onClick={stopRec} aria-label="Stop recording"><span className="rec-stopdot"/></button>
              <div className="greet-rec-t"><b><span className="rec-live-dot"/> Recording… {fmtSecs(recSecs)}</b><span>Speak now — click stop when you’re done.</span></div>
            </div>
          )}
          {recState==='done' && (
            <React.Fragment>
              <div className="greeting">
                <button className="play" onClick={()=>setRecPlaying(p=>!p)} aria-label="Play recording"><Icon name={recPlaying?'pause':'play'}/></button>
                <Wave n={40} playing={recPlaying}/>
                <div className="gmeta"><span>{fmtSecs(recSecs||6)}</span></div>
              </div>
              <span className="greet-rec-tag"><Icon name="mic"/> Your recording</span>
              <div className="greet-acts">
                <button className="btn btn-secondary sm" onClick={startRec}><Icon name="mic"/> Re-record</button>
                <button className="btn btn-danger sm" onClick={resetRec}><Icon name="trash"/> Delete</button>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

function VoicemailPanel({ ext, patch, goForwarding, goHours }){
  const v = ext.voicemail;
  const reachesVm = ext.fallback==='voicemail';
  const fallbackLabel = ext.fallback==='forward'
    ? `forwarded to another extension`
    : `ended after the greeting`;
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Greeting</h2>
        <p>What callers hear when they reach {ext.name}'s voicemail. JOEL writes a transcript and summary of every message automatically.</p>
      </div>

      {!reachesVm && (
        <div className="note warn" style={{marginBottom:18}}>
          <Icon name="info"/>
          <span><b>Callers don't reach this voicemail right now.</b> Unanswered calls to {ext.name} are currently {fallbackLabel}. To send them here instead, change <button className="inline-link" onClick={goForwarding}>Forwarding → If no one answers</button>.</span>
        </div>
      )}

      <Card icon="voicemail" title="Voicemail greeting"
        desc="What plays when a caller reaches voicemail. Generated for you — preview and edit anytime.">
        <GreetingRow text={v.greeting} voice={v.voice}/>
      </Card>

      <Card icon="clock" title="After-hours greeting"
        desc="Play a different greeting outside your set hours.">
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{flex:1}}>
            <b style={{fontWeight:700,fontSize:'.94rem'}}>Use a separate after-hours greeting</b>
            <p style={{color:'var(--body)',fontSize:'.86rem',marginTop:2}}>{v.afterHoursOn
              ? 'On — callers hear this outside your set hours.'
              : 'Off — your voicemail greeting plays at all hours.'}</p>
          </div>
          <Toggle on={v.afterHoursOn} onChange={on=>patch({voicemail:{...v,afterHoursOn:on}})}/>
        </div>
        {v.afterHoursOn && (
          <React.Fragment>
            <div className="sched">
              <div className="sched-head">
                <span className="sched-title">This extension's hours</span>
                <span className="help" style={{margin:0}}>Set just for {ext.name} — independent of any other extension.</span>
              </div>
              <div className="day-chips">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>{
                  const on = v.schedule.days.includes(d);
                  return <button key={d} className={`day-chip${on?' on':''}`}
                    onClick={()=>{ const days = on ? v.schedule.days.filter(x=>x!==d) : [...v.schedule.days,d];
                      patch({voicemail:{...v,schedule:{...v.schedule,days}}}); }}>{d}</button>;
                })}
              </div>
              <div className="time-range">
                <select className="select" value={v.schedule.from} onChange={e=>patch({voicemail:{...v,schedule:{...v.schedule,from:e.target.value}}})}>
                  {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                <span className="to">to</span>
                <select className="select" value={v.schedule.to} onChange={e=>patch({voicemail:{...v,schedule:{...v.schedule,to:e.target.value}}})}>
                  {TIMES.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <p className="help" style={{marginTop:12}}>Outside these hours, callers hear the after-hours greeting below.</p>
            </div>
            <GreetingRow text={v.afterHours} voice={v.voice}/>
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */
// Compact preference row: stable height, one-line summary, Configure opens a modal.
function ChannelRow({ icon, title, on, onToggle, summary, onConfigure }){
  return (
    <div className={`nrow2${on?' on':''}`}>
      <span className={`nrow2-ic${on?' on':''}`}><Icon name={icon}/></span>
      <div className="nrow2-main">
        <div className="nrow2-top">
          <b>{title}</b>
          <span className={`nrow2-state${on?' on':''}`}>{on?'On':'Off'}</span>
        </div>
        {on && summary && summary.filter(Boolean).length>0 && (
          <div className="nrow2-sum">{summary.filter(Boolean).map((s,i)=><span key={i}>{s}</span>)}</div>
        )}
      </div>
      {on && onConfigure && <button className="nrow2-cfg" onClick={onConfigure}><Icon name="settings"/> Configure</button>}
      <Toggle on={on} onChange={onToggle}/>
    </div>
  );
}

function WebhookFields({ ev, data, setNotif }){
  return (
    <div className="webhook-fields">
      <div className="nsub-field">
        <label>Webhook URL</label>
        <div className="input-affix">
          <span className="pre">POST</span>
          <input value={data.webhookUrl} onChange={e=>setNotif(ev,'webhookUrl',e.target.value)} placeholder="https://example.com/hooks/joel"/>
        </div>
      </div>
      <div className="nsub-field" style={{marginTop:14}}>
        <label>Message body</label>
        <textarea className="input mono" rows={6} value={data.webhookMsg} onChange={e=>setNotif(ev,'webhookMsg',e.target.value)} spellCheck={false}/>
        <div className="help">We send this as the request body. Drop in variables and we'll fill them at send time:</div>
        <div className="var-chips">
          <code>{'{{extension}}'}</code>
          <code>{'{{caller_number}}'}</code>
          <code>{'{{caller_name}}'}</code>
          <code>{'{{time}}'}</code>
          {ev==='voicemail' && <code>{'{{summary}}'}</code>}
          {ev==='voicemail' && <code>{'{{transcript}}'}</code>}
          {ev==='voicemail' && <code>{'{{recording_url}}'}</code>}
        </div>
      </div>
    </div>
  );
}

function RecipientEditor({ ev, field, items, setNotif, kind, max, attachable }){
  const [val,setVal]=useState('');
  const norm = (items||[]).map(it=> typeof it==='string' ? {addr:it, attach:false} : it);
  const atCap = max && norm.length>=max;
  const add=()=>{ const v=val.trim(); if(!v||norm.some(x=>x.addr===v)||atCap){ setVal(''); return; } setNotif(ev,field,[...norm,{addr:v, attach:false}]); setVal(''); };
  const remove=(a)=>setNotif(ev,field,norm.filter(x=>x.addr!==a));
  const toggleAttach=(a)=>setNotif(ev,field,norm.map(x=>x.addr===a?{...x,attach:!x.attach}:x));
  return (
    <div className="nsub-field">
      <label>{kind==='email'?'Send to these email addresses':'Text these phone numbers'}{max?` (up to ${max})`:''}</label>
      <div className="recip-list col">
        {norm.length===0 && <span className="recip-empty">No {kind==='email'?'addresses':'numbers'} added yet.</span>}
        {norm.map(r=>(
          <div className="recip-row" key={r.addr}>
            <span className="recip-chip">
              <Icon name={kind==='email'?'mail':'smartphone'}/>{r.addr}
              <button onClick={()=>remove(r.addr)} aria-label={`Remove ${r.addr}`}><Icon name="x"/></button>
            </span>
            {attachable && (
              <label className="recip-attach" title="Attach the voicemail recording to this email">
                <Toggle on={r.attach} onChange={()=>toggleAttach(r.addr)} sm/>
                <span>Attach recording</span>
              </label>
            )}
          </div>
        ))}
      </div>
      {!atCap ? (
        <div className="recip-add">
          <input className="input" type={kind==='email'?'email':'tel'} value={val}
            placeholder={kind==='email'?'name@company.com':'+1 (555) 000-0000'}
            onChange={e=>setVal(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); add(); } }}/>
          <button className="btn btn-secondary sm" onClick={add}><Icon name="plus"/> Add</button>
        </div>
      ) : (
        <div className="help">Maximum {max} {kind==='email'?'email addresses':'numbers'}. Remove one to add another.</div>
      )}
    </div>
  );
}

function NEvent({ tone, icon, title, desc, children }){
  return (
    <section className="card nevent">
      <div className={`nevent-h ${tone}`}>
        <span className={`nevent-ic ${tone}`}><Icon name={icon}/></span>
        <div className="nevent-t"><h3>{title}</h3><p>{desc}</p></div>
      </div>
      <div className="card-b"><div className="nlist">{children}</div></div>
    </section>
  );
}

function NotificationsPanel({ ext, setNotif, setSlackChannel }){
  const n = ext.notifications;
  const channelOpts = ['#sales-team','#front-desk','#general'];
  const [cfg,setCfg]=useState(null); // { ev, ch, title, icon }

  const hostOf=(url)=>{ if(!url) return 'No URL set'; try{ return new URL(url).host; }catch(e){ return 'Custom endpoint'; } };
  const cnt=(arr)=>(arr||[]).length;
  const recips=(arr)=>`${cnt(arr)} recipient${cnt(arr)===1?'':'s'}`;

  const SLACK_FIELDS = (ev)=>(
    <React.Fragment>
      <div className="nsub-field">
        <label>Post to this channel</label>
        <select className="select" value={n.slackChannel} onChange={e=>setSlackChannel(e.target.value)} style={{maxWidth:260}}>
          {channelOpts.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <div className="help">Channels come from <button className="inline-link" onClick={()=>alert('Opens Settings → Integrations')}>Settings → Integrations</button>.</div>
      </div>
      {ev==='voicemail' && (
        <label className="nsub-toggle" style={{marginTop:16}}>
          <Toggle on={n.voicemail.slackAttach} onChange={v=>setNotif('voicemail','slackAttach',v)} sm/>
          <span><b>Include the recording as an attachment</b><small>Attach the voicemail audio file to the Slack message.</small></span>
        </label>
      )}
    </React.Fragment>
  );

  const renderCfg=()=>{
    if(!cfg) return null;
    const { ev, ch } = cfg;
    if(ch==='email') return <RecipientEditor ev={ev} field="emailTo" items={n[ev].emailTo} setNotif={setNotif} kind="email" max={5}/>;
    if(ch==='text')  return <RecipientEditor ev={ev} field="textTo" items={n[ev].textTo} setNotif={setNotif} kind="phone"/>;
    if(ch==='webhook') return <WebhookFields ev={ev} data={n[ev]} setNotif={setNotif}/>;
    if(ch==='slack') return SLACK_FIELDS(ev);
    return null;
  };

  return (
    <div className="panel">

      <NEvent tone="voicemail" icon="voicemail" title="Voicemails"
        desc="When a caller leaves a message. Every notification includes the MP3 recording, transcript, AI summary, and caller info.">
        <ChannelRow icon="mail" title="Email" on={n.voicemail.email} onToggle={v=>setNotif('voicemail','email',v)}
          summary={[recips(n.voicemail.emailTo), 'MP3 attachment included']}
          onConfigure={()=>setCfg({ ev:'voicemail', ch:'email', title:'Email recipients', icon:'mail' })}/>
        <ChannelRow icon="slack" title="Slack" on={n.voicemail.slack} onToggle={v=>setNotif('voicemail','slack',v)}
          summary={[n.slackChannel, `Recording attachment: ${n.voicemail.slackAttach?'On':'Off'}`]}
          onConfigure={()=>setCfg({ ev:'voicemail', ch:'slack', title:'Slack', icon:'slack' })}/>
        <ChannelRow icon="webhook" title="Webhook" on={n.voicemail.webhook} onToggle={v=>setNotif('voicemail','webhook',v)}
          summary={[hostOf(n.voicemail.webhookUrl)]}
          onConfigure={()=>setCfg({ ev:'voicemail', ch:'webhook', title:'Webhook', icon:'webhook' })}/>
      </NEvent>

      <NEvent tone="missed" icon="phoneoff" title="Missed calls"
        desc="When nobody answers and the caller hangs up without leaving a message.">
        <ChannelRow icon="mail" title="Email" on={n.missed.email} onToggle={v=>setNotif('missed','email',v)}
          summary={[recips(n.missed.emailTo)]}
          onConfigure={()=>setCfg({ ev:'missed', ch:'email', title:'Email recipients', icon:'mail' })}/>
        <ChannelRow icon="smartphone" title="Text message" on={n.missed.text} onToggle={v=>setNotif('missed','text',v)}
          summary={[`${cnt(n.missed.textTo)} number${cnt(n.missed.textTo)===1?'':'s'}`]}
          onConfigure={()=>setCfg({ ev:'missed', ch:'text', title:'Text recipients', icon:'smartphone' })}/>
        <ChannelRow icon="slack" title="Slack" on={n.missed.slack} onToggle={v=>setNotif('missed','slack',v)}
          summary={[n.slackChannel]}
          onConfigure={()=>setCfg({ ev:'missed', ch:'slack', title:'Slack', icon:'slack' })}/>
        <ChannelRow icon="webhook" title="Webhook" on={n.missed.webhook} onToggle={v=>setNotif('missed','webhook',v)}
          summary={[hostOf(n.missed.webhookUrl)]}
          onConfigure={()=>setCfg({ ev:'missed', ch:'webhook', title:'Webhook', icon:'webhook' })}/>
      </NEvent>

      <div className="note info">
        <Icon name="appbell"/>
        <span><b>In-app alerts are always on.</b> Anyone with access to {ext.name} sees missed calls and voicemails in the app's notification bell — no setup needed.</span>
      </div>

      {cfg && (
        <Modal title={cfg.title} icon={cfg.icon} desc={cfg.ev==='voicemail'?'Voicemails':'Missed calls'} onClose={()=>setCfg(null)}
          footer={<button className="btn btn-primary sm" onClick={()=>setCfg(null)}>Done</button>}>
          {renderCfg()}
        </Modal>
      )}
    </div>
  );
}

/* ---------------- RECORDING ---------------- */
function AnnouncementPlayer({ text }){
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),1900); return ()=>clearTimeout(t); },[playing]);
  return (
    <React.Fragment>
      <div className="greeting">
        <button className="play" onClick={()=>setPlaying(p=>!p)} aria-label="Play announcement"><Icon name={playing?'pause':'play'}/></button>
        <Wave n={40} playing={playing}/>
        <div className="gmeta"><b>Announcement</b><span>0:03</span></div>
      </div>
      <p style={{margin:'10px 0 0',color:'var(--body)',fontSize:'.88rem',fontStyle:'italic'}}>“{text}”</p>
    </React.Fragment>
  );
}

function RecordingPanel({ ext, patch, goBilling }){
  const on = ext.recordingOn;
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>Call recording</h2>
        <p>Record calls on {ext.name} to keep an audio copy, transcript, and summary.</p>
      </div>

      <Card icon="disc" title="Call recording">
        <div className="rec-row">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <b style={{fontWeight:700,fontSize:'.94rem'}}>Record calls on this extension</b>
              <span className="pill pro"><Icon name="sparkle" style={{width:12,height:12}}/> Pro</span>
            </div>
            <p style={{color:'var(--body)',fontSize:'.86rem',marginTop:3}}>{on
              ? 'On — inbound and outbound calls are recorded, transcribed, and summarized.'
              : 'Keep an audio copy, transcript, and summary of every call.'}</p>
          </div>
          <Toggle on={on} onChange={v=>patch({recordingOn:v})}/>
        </div>

        {!on && (
          <div className="upsell">
            <span className="upsell-ic"><Icon name="sparkle"/></span>
            <div className="upsell-t">
              <b>Call recording is on the Pro plan</b>
              <span>Upgrade to record, transcribe, and summarize calls on this extension.</span>
            </div>
            <button className="btn btn-primary sm" onClick={goBilling}>Upgrade plan</button>
          </div>
        )}

        {on && (
          <React.Fragment>
            <div className="note warn" style={{margin:'16px 0'}}>
              <Icon name="info"/>
              <span>Recording laws vary by location. Make sure you're allowed to record before turning this on.</span>
            </div>
            <div className="field" style={{marginBottom:0}}>
              <label>What callers hear</label>
              <p style={{color:'var(--body)',fontSize:'.86rem',margin:'0 0 12px'}}>Before the call is transferred to a destination, every caller is automatically played this message:</p>
              <AnnouncementPlayer text="Your call may be recorded."/>
            </div>
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}

/* ---------------- PERMISSIONS ---------------- */
function PermRow({ p, updatePerm, reinvitePerm, removePerm }){
  const [menu,setMenu]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ if(!menu) return; const h=e=>{ if(ref.current&&!ref.current.contains(e.target)) setMenu(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[menu]);
  const isOwner = p.role==='Owner';
  return (
    <div className="prow">
      <Avatar name={p.name}/>
      <div className="pmain">
        <b>{p.name}</b>
        <span className="pmeta-line">
          {p.pending && <span className="pend-pill"><Icon name="clock" sw={2.4}/> Invite pending</span>}
          <span className="pmeta-email">{p.email}{p.pending && (p.resent ? ' · Invite resent' : ' · Hasn’t accepted yet')}</span>
        </span>
      </div>
      {p.pending && (
        <button className="btn btn-secondary sm" onClick={()=>reinvitePerm(p.id)} disabled={p.resent} style={p.resent?{opacity:.6,pointerEvents:'none'}:null}>
          <Icon name={p.resent?'check':'mail'}/> {p.resent?'Sent':'Resend invite'}
        </button>
      )}
      {isOwner ? (
        <span className="role-chip owner">Owner</span>
      ) : (
        <div className="role-sel">
          <select value={p.role} onChange={e=>updatePerm(p.id,{role:e.target.value})} aria-label={`Role for ${p.name}`}>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <Icon name="chevdown"/>
        </div>
      )}
      <div className="d-actions" ref={ref} style={{position:'relative'}}>
        <button className="kebab" onClick={()=>setMenu(v=>!v)} aria-label="More options" disabled={isOwner} style={isOwner?{opacity:.3,pointerEvents:'none'}:null}><Icon name="kebab"/></button>
        {menu && (
          <div style={{position:'absolute',top:38,right:0,background:'#fff',border:'1px solid var(--line)',borderRadius:12,boxShadow:'var(--shadow-pop)',padding:6,width:200,zIndex:20}}>
            {p.pending && <button style={menuItem} onClick={()=>{reinvitePerm(p.id);setMenu(false);}}><Icon name="mail" style={ic}/> Resend invite</button>}
            <button style={{...menuItem,color:'var(--red)'}} onClick={()=>{removePerm(p.id);setMenu(false);}}><Icon name="trash" style={{...ic,color:'var(--red)'}}/> {p.pending?'Cancel invite':'Remove'}</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PermissionsPanel({ ext, removePerm, updatePerm, reinvitePerm, openAddPeople }){
  const people = ext.permissions;
  return (
    <div className="panel">
      <Card title="People with access" icon="users"
        action={people.length>0 && <button className="btn btn-secondary sm" onClick={openAddPeople}><Icon name="plus"/> Add</button>}
        flush>
        {people.length===0 ? (
          <div className="empty">
            <span className="ei"><Icon name="users"/></span>
            <h4>Just Owners and Admins, for now</h4>
            <p>Add a teammate to give them access to {ext.name}'s calls, voicemails, and more.</p>
            <button className="btn btn-primary" onClick={openAddPeople}><Icon name="plus"/> Add people</button>
          </div>
        ) : (
          <div className="plist">
            {people.map(p=>(
              <PermRow key={p.id} p={p} updatePerm={updatePerm} reinvitePerm={reinvitePerm} removePerm={removePerm}/>
            ))}
            <button className="add-row" onClick={openAddPeople}>
              <span className="plus"><Icon name="plus"/></span> Add people
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* Settings → danger zone: delete the extension, small, with warnings */
function DangerZone({ ext }){
  const [confirm,setConfirm]=useState(false);
  const [txt,setTxt]=useState('');
  const isOperator = String(ext.number)==='0';
  return (
    <Card icon="shield" title="Delete extension" desc="Permanently remove this extension and everything it owns.">
      {isOperator ? (
        <div className="dz-note"><Icon name="info"/><span><b>Extension 0 (Operator) can’t be deleted.</b> Every account keeps an Operator extension as the fallback callers reach when they press 0 or a menu has no match.</span></div>
      ) : !confirm ? (
        <div className="dz-row">
          <div className="dz-note"><Icon name="info"/><span>Deleting <b>Ext {ext.number} · {ext.name}</b> removes its call history, voicemails, and recordings, and unlinks anyone who only had access here. Number routes and menu keys pointing to it will need repointing. This can’t be undone.</span></div>
          <button className="btn btn-danger sm" onClick={()=>setConfirm(true)}><Icon name="trash"/> Delete extension</button>
        </div>
      ) : (
        <div className="dz-confirm">
          <label>Type <b>{ext.name}</b> to confirm deletion</label>
          <div className="dz-confirm-row">
            <input className="input" autoFocus value={txt} onChange={e=>setTxt(e.target.value)} placeholder={ext.name}/>
            <button className="btn btn-ghost sm" onClick={()=>{ setConfirm(false); setTxt(''); }}>Cancel</button>
            <button className="btn btn-danger sm" disabled={txt.trim()!==ext.name} style={txt.trim()!==ext.name?{opacity:.5,pointerEvents:'none'}:null}>Delete forever</button>
          </div>
        </div>
      )}
    </Card>
  );
}

Object.assign(window, {
  GeneralPanel, RoutingPanel, SchedulePanel, VoicemailPanel, NotificationsPanel, RecordingPanel, PermissionsPanel, DangerZone, DEST_META, destLabel,
});
