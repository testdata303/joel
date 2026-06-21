/* ============================================================
   JOEL app - Quick Setup (brand-new guided onboarding)
   A 6-step wizard that gets a new customer taking calls fast.
   Hides extensions / routing / SIP / telecom jargon entirely.
   ============================================================ */
const { Icon: QSIcon, Wave: QSWave } = window;
const QS_use = React.useState;
const QS_useEffect = React.useEffect;

const QS_LABELS = { welcome:'Welcome', type:'System', greeting:'Greeting', extensions:'Departments', forward:'Forwarding', voicemail:'Voicemail', texts:'Texts', ready:'Ready' };

const QS_VOICES = [
  { id:'Aria',  desc:'Warm · friendly' },
  { id:'Jasper',desc:'Calm · professional' },
  { id:'Naomi', desc:'Bright · upbeat' },
  { id:'Leo',   desc:'Deep · steady' },
];
const QS_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const QS_TIMES = (()=>{ const out=[]; for(let h=0;h<24;h++){ const ap=h<12?'AM':'PM'; const hh=h%12===0?12:h%12; out.push(`${hh}:00 ${ap}`); out.push(`${hh}:30 ${ap}`);} return out; })();

/* tiny greeting player reused on the greeting + ready steps */
function QSPlayer({ label }){
  const [playing,setPlaying]=QS_use(false);
  QS_useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2400); return ()=>clearTimeout(t); },[playing]);
  return (
    <div className="qs-player">
      <button className="qs-play" onClick={()=>setPlaying(p=>!p)} aria-label="Preview greeting"><QSIcon name={playing?'pause':'play'}/></button>
      <QSWave n={44} playing={playing}/>
      <span className="qs-player-dur">{label||'0:06'}</span>
    </div>
  );
}

function QuickSetup({ businessNumber, businessName, ownerEmail, onDone }){
  const biz = businessName || 'Smilebar';
  const number = businessNumber || '(617) 555-0100';
  const owner = ownerEmail || 'bob@smilebar.co';

  const [step,setStep]=QS_use(0);
  const [systemType,setSystemType]=QS_use('simple'); // simple | extensions
  const [exts,setExts]=QS_use([
    { id:'operator',name:'Operator', num:0,   desc:'The main line - callers reach this first', on:true, locked:true, fwdOn:true },
    { id:'sales',   name:'Sales',    num:1,   desc:'New customers, quotes & questions', on:true, fwdOn:true },
    { id:'support', name:'Support',  num:2,   desc:'Help for existing customers',       on:true, fwdOn:true },
    { id:'personal',name:'Personal', num:101, desc:'Your own direct line',              on:true, fwdOn:true },
  ]);
  const [dests,setDests]=QS_use([{ id:'d1', label:'Bob’s Mobile', value:'(617) 555-0142' }]);
  const [sched,setSched]=QS_use('247'); // 247 | custom
  const [schedDays,setSchedDays]=QS_use(['Mon','Tue','Wed','Thu','Fri']);
  const [schedFrom,setSchedFrom]=QS_use('9:00 AM');
  const [schedTo,setSchedTo]=QS_use('5:00 PM');
  const [emails,setEmails]=QS_use([owner]);
  const [greet,setGreet]=QS_use(`Thank you for calling ${biz}. Please hold while we connect your call.`);
  const [menuGreetOverride,setMenuGreetOverride]=QS_use(null);
  const [editGreet,setEditGreet]=QS_use(false);
  const [voice,setVoice]=QS_use('Aria');
  const [pickVoice,setPickVoice]=QS_use(false);
  const [smsStatus,setSmsStatus]=QS_use('pending'); // pending | submitted

  const addPhone=()=>setDests(d=>[...d,{ id:'d'+Date.now(), label:'', value:'' }]);
  const patchDest=(id,p)=>setDests(d=>d.map(x=>x.id===id?{...x,...p}:x));
  const removeDest=(id)=>setDests(d=>d.filter(x=>x.id!==id));
  const patchEmail=(i,v)=>setEmails(e=>e.map((x,j)=>j===i?v:x));
  const addEmail=()=>setEmails(e=>[...e,'']);
  const removeEmail=(i)=>setEmails(e=>e.filter((_,j)=>j!==i));
  const toggleExt=(id)=>setExts(a=>a.map(x=>(x.id===id&&!x.locked)?{...x,on:!x.on}:x));
  const patchExtFwd=(id,v)=>setExts(a=>a.map(x=>x.id===id?{...x,fwdOn:v}:x));
  const toggleDay=(d)=>setSchedDays(a=>a.includes(d)?a.filter(x=>x!==d):[...a,d]);

  const flow = systemType==='extensions'
    ? ['welcome','type','extensions','greeting','forward','voicemail','ready','texts']
    : ['welcome','type','greeting','forward','voicemail','ready','texts'];
  const stepKey = flow[step];
  const last = flow.length-1;
  const next=()=>setStep(s=>Math.min(s+1,last));
  const back=()=>setStep(s=>Math.max(s-1,0));

  const callsSummary = dests.length ? dests.map(d=>d.label||d.value).filter(Boolean).join(', ') : 'Not set yet';
  const chosenExts = exts.filter(e=>e.on);
  // auto-generated phone-menu greeting, built from the chosen departments
  const menuExts = chosenExts.filter(e=>e.id!=='operator' && e.num<100).sort((a,b)=>a.num-b.num);
  const menuParts = menuExts.map(e=>`For ${e.name}, press ${e.num}.`);
  const autoMenuGreet = `Thank you for calling ${biz}. If you know your party’s extension, please dial it now. `
    + (menuParts.length ? menuParts.join(' ') + ' ' : '')
    + `Or press zero, or stay on the line, for the operator.`;
  const isExtPath = systemType==='extensions';
  const shownGreet = isExtPath ? (menuGreetOverride!=null ? menuGreetOverride : autoMenuGreet) : greet;
  const setShownGreet = isExtPath ? setMenuGreetOverride : setGreet;
  const forwardTitle = 'Where should we forward calls?';
  const forwardSub = systemType==='extensions'
    ? `When someone calls ${number}, we’ll ring this phone. Pick which departments forward here - the rest go to voicemail for now.`
    : `When someone calls ${number}, we’ll ring this phone. Choose whether calls forward around the clock or only on a schedule.`;
  const schedSummary = sched==='247'
    ? 'Around the clock'
    : `${schedDays.length===0?'No days':schedDays.join(', ')}, ${schedFrom}–${schedTo}`;

  return (
    <div className="qs">
      <div className="qs-head">
        <div className="qs-brand"><span className="qs-spark"><QSIcon name="sparkle"/></span> Quick Setup</div>
        <button className="qs-skip" onClick={onDone}>Skip for now</button>
      </div>

      <div className="qs-progress" role="progressbar" aria-valuenow={step+1} aria-valuemin={1} aria-valuemax={flow.length}>
        {flow.map((s,i)=><span key={i} className={`qs-seg${i<=step?' on':''}${i===step?' cur':''}`}/>)}
      </div>

      <div className="qs-card">
        <span className="qs-eyebrow">Step {step+1} of {flow.length} · {QS_LABELS[stepKey]}</span>

        {/* ---------- Welcome ---------- */}
        {stepKey==='welcome' && (
          <React.Fragment>
            <h1 className="qs-title">Let’s get your phone system ready.</h1>
            <p className="qs-sub">We’ll have you taking calls in under two minutes. A few quick choices - no setup jargon.</p>
            <div className="qs-numcard">
              <span className="qs-numic"><QSIcon name="phone"/></span>
              <div className="qs-numt">
                <span className="qs-numlabel">Your business number</span>
                <b className="qs-num">{number}</b>
              </div>
              <span className="qs-numtag"><span className="qs-dot"/> Active</span>
            </div>
            <p className="qs-fineprint">This is the number your customers will call. You can add more numbers later.</p>
          </React.Fragment>
        )}

        {/* ---------- System type ---------- */}
        {stepKey==='type' && (
          <React.Fragment>
            <h1 className="qs-title">How should callers reach you?</h1>
            <p className="qs-sub">Pick the setup that fits your business. You can change this later.</p>
            <div className="qs-pathgrid">
              <button className={`qs-path${systemType==='simple'?' on':''}`} onClick={()=>setSystemType('simple')}>
                <span className="qs-path-ic"><QSIcon name="phone"/></span>
                <span className="qs-path-radio"/>
                <b>Ring my phone</b>
                <span className="qs-path-desc">Callers hear a short welcome, then we connect them straight to you.</span>
              </button>
              <button className={`qs-path${systemType==='extensions'?' on':''}`} onClick={()=>setSystemType('extensions')}>
                <span className="qs-path-ic"><QSIcon name="route"/></span>
                <span className="qs-path-radio"/>
                <b>Departments &amp; extensions</b>
                <span className="qs-path-desc">Callers pick a department like Sales or Support and reach the right person.</span>
              </button>
            </div>
          </React.Fragment>
        )}

        {/* ---------- Departments (extensions path) ---------- */}
        {stepKey==='extensions' && (
          <React.Fragment>
            <h1 className="qs-title">Which departments do you need?</h1>
            <p className="qs-sub">We’ll create one for each. We picked some common ones - turn off any you don’t need, or keep it simple.</p>
            <div className="qs-extlist">
              {exts.map(e=>(
                <button key={e.id} className={`qs-extopt${e.on?' on':''}${e.locked?' locked':''}`} onClick={()=>toggleExt(e.id)} role="checkbox" aria-checked={e.on} aria-disabled={e.locked||undefined}>
                  <span className="qs-ext-check"><QSIcon name={e.locked?'lock':'check'}/></span>
                  <span className="qs-ext-t">
                    <span className="qs-ext-head"><b>{e.name}</b><span className="qs-ext-numtag">Ext {e.num}</span>{e.locked && <span className="qs-ext-default">Default</span>}</span>
                    {e.locked && <span className="qs-ext-note">This is your default extension and can’t be removed.</span>}
                  </span>
                </button>
              ))}
            </div>
            <p className="qs-fineprint">You can add, rename, or remove departments anytime after setup.</p>
          </React.Fragment>
        )}

        {/* ---------- Greeting (both paths) ---------- */}
        {stepKey==='greeting' && (
          <React.Fragment>
            <h1 className="qs-title">What callers hear first.</h1>
            <p className="qs-sub">{isExtPath
              ? 'We built a phone menu from your departments. Preview it, tweak the words, or pick a different voice.'
              : 'We wrote a greeting for you. Preview it, tweak the words, or pick a different voice.'}</p>
            <div className="qs-greetcard">
              {editGreet
                ? <textarea className="qs-textarea" autoFocus value={shownGreet} onChange={e=>setShownGreet(e.target.value)} rows={isExtPath?4:3}/>
                : <p className="qs-greettext">“{shownGreet}”</p>}
              <div className="qs-greetfoot">
                <QSPlayer/>
                <span className="qs-voicetag"><QSIcon name="sparkle"/> {voice} voice</span>
              </div>
            </div>
            <div className="qs-greetacts">
              <button className="qs-btn ghost" onClick={()=>setEditGreet(v=>!v)}><QSIcon name="pencil"/> {editGreet?'Done editing':'Edit text'}</button>
              <button className="qs-btn ghost" onClick={()=>setPickVoice(v=>!v)}><QSIcon name="sparkle"/> Choose voice</button>
              {isExtPath && menuGreetOverride!=null && <button className="qs-btn ghost" onClick={()=>{ setMenuGreetOverride(null); setEditGreet(false); }}><QSIcon name="sparkle"/> Reset to auto</button>}
            </div>
            {pickVoice && (
              <div className="qs-voicegrid">
                {QS_VOICES.map(v=>(
                  <button key={v.id} className={`qs-voice${voice===v.id?' on':''}`} onClick={()=>{ setVoice(v.id); }}>
                    <span className="qs-voice-radio"/>
                    <span className="qs-voice-t"><b>{v.id}</b><span>{v.desc}</span></span>
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        )}

        {/* ---------- Where calls forward ---------- */}
        {stepKey==='forward' && (
          <React.Fragment>
            <h1 className="qs-title">{forwardTitle}</h1>
            <p className="qs-sub">{forwardSub}</p>

            <div className="qs-dest solo">
              <span className="qs-dest-ic"><QSIcon name="phone"/></span>
              <div className="qs-dest-fields">
                <input className="qs-input num" value={dests[0].value} onChange={e=>patchDest(dests[0].id,{value:e.target.value})} placeholder="(617) 555-0000"/>
                <div className="qs-labelwrap"><QSIcon name="tag"/><input className="qs-input lbl" value={dests[0].label} onChange={e=>patchDest(dests[0].id,{label:e.target.value})} placeholder="Label - e.g. Bob’s Mobile"/></div>
              </div>
            </div>

            <label className="qs-flabel">When should calls forward?</label>
            <div className="qs-schedchoice">
              <button className={`qs-schedopt${sched==='247'?' on':''}`} onClick={()=>setSched('247')}>
                <span className="qs-sched-radio"/>
                <span className="qs-sched-t"><b>Around the clock</b><span>Forward every call, any time of day</span></span>
              </button>
              <button className={`qs-schedopt${sched==='custom'?' on':''}`} onClick={()=>setSched('custom')}>
                <span className="qs-sched-radio"/>
                <span className="qs-sched-t"><b>On a schedule</b><span>Only forward during set hours - otherwise straight to voicemail</span></span>
              </button>
            </div>

            {sched==='custom' && (
              <div className="qs-schedpanel">
                <div className="qs-scheddays">
                  {QS_DAYS.map(d=>(
                    <button key={d} className={`qs-day${schedDays.includes(d)?' on':''}`} onClick={()=>toggleDay(d)}>{d}</button>
                  ))}
                </div>
                <div className="qs-schedtimes">
                  <label className="qs-time"><span>From</span><select className="qs-input" value={schedFrom} onChange={e=>setSchedFrom(e.target.value)}>{QS_TIMES.map(t=><option key={t}>{t}</option>)}</select></label>
                  <span className="qs-time-dash">–</span>
                  <label className="qs-time"><span>To</span><select className="qs-input" value={schedTo} onChange={e=>setSchedTo(e.target.value)}>{QS_TIMES.map(t=><option key={t}>{t}</option>)}</select></label>
                </div>
              </div>
            )}

            {systemType==='extensions' && (
              <React.Fragment>
                <label className="qs-flabel">Which departments should ring this phone?</label>
                <p className="qs-flabel-sub">Turn a department off and its calls go straight to voicemail for now - you can give it its own number later.</p>
                <div className="qs-routelist">
                  {chosenExts.map(e=>(
                    <div className={`qs-route${e.fwdOn?' on':''}`} key={e.id}>
                      <span className="qs-route-num">{e.num}</span>
                      <span className="qs-route-t"><b>{e.name}{e.locked && <span className="qs-ext-default">Default</span>}</b><span>{e.fwdOn?`Rings ${dests[0].label||'your phone'}`:'Goes to voicemail'}</span></span>
                      <button className={`qs-switch${e.fwdOn?' on':''}`} role="switch" aria-checked={e.fwdOn} onClick={()=>patchExtFwd(e.id,!e.fwdOn)}><span className="qs-switch-knob"/></button>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {/* ---------- Voicemail ---------- */}
        {stepKey==='voicemail' && (
          <React.Fragment>
            <h1 className="qs-title">Where should we send voicemails?</h1>
            <p className="qs-sub">If someone leaves a voicemail, we’ll email you a notification with the recording, a transcript, and an AI summary.</p>
            <label className="qs-flabel">Email notifications to</label>
            <div className="qs-destlist">
              {emails.map((e,i)=>(
                <div className="qs-dest" key={i}>
                  <span className="qs-dest-ic"><QSIcon name="mail"/></span>
                  <input className="qs-input" type="email" value={e} onChange={ev=>patchEmail(i,ev.target.value)} placeholder="you@business.com"/>
                  {emails.length>1 && <button className="qs-dest-x" onClick={()=>removeEmail(i)} aria-label="Remove"><QSIcon name="x"/></button>}
                </div>
              ))}
            </div>
            <button className="qs-btn ghost qs-add" onClick={addEmail}><QSIcon name="plus"/> Add another email</button>
          </React.Fragment>
        )}

        {/* ---------- Text messaging ---------- */}
        {stepKey==='texts' && (
          <React.Fragment>
            <h1 className="qs-title">Want texting on your number?</h1>
            <p className="qs-sub">Your phone system is ready to take calls. Texting is optional - set it up now, or anytime later.</p>
            <div className={`qs-smscard${smsStatus==='submitted'?' ok':' pending'}`}>
              <span className="qs-sms-ic"><QSIcon name={smsStatus==='submitted'?'check':'message'}/></span>
              <div className="qs-sms-t">
                <b>{smsStatus==='submitted'?'Registration submitted':'Pending registration'}</b>
                <span>{smsStatus==='submitted'
                  ? 'We’ll email you when sending is approved - usually within a day. You can already receive texts.'
                  : 'You can receive texts right now. Sending texts needs a quick one-time registration.'}</span>
              </div>
            </div>
            <div className="qs-smsrows">
              <div className="qs-smsrow"><span className="qs-smsrow-ic ok"><QSIcon name="check"/></span> Receiving texts <b>Active now</b></div>
              <div className="qs-smsrow"><span className={`qs-smsrow-ic${smsStatus==='submitted'?' wait':' off'}`}><QSIcon name={smsStatus==='submitted'?'clock':'x'}/></span> Sending texts <b>{smsStatus==='submitted'?'In review':'Needs registration'}</b></div>
            </div>
            {smsStatus==='pending' && <button className="qs-btn primary wide" onClick={()=>setSmsStatus('submitted')}>Complete registration</button>}
            {smsStatus==='pending' && <p className="qs-skipnote"><QSIcon name="info"/><span>No rush - you can skip this for now and set up texting anytime in the <b>Numbers</b> section.</span></p>}
          </React.Fragment>
        )}

        {/* ---------- Ready ---------- */}
        {stepKey==='ready' && (
          <React.Fragment>
            <span className="qs-readycheck"><QSIcon name="check"/></span>
            <h1 className="qs-title">You’re all set to take calls.</h1>
            <p className="qs-sub">Here’s your phone system at a glance. Change anything anytime - next, you can set up texting.</p>
            <div className="qs-summary">
              <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="phone"/> Your number</span><span className="qs-srow-v">{number}</span></div>
              {systemType==='extensions' && <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="route"/> Departments</span><span className="qs-srow-v">{chosenExts.map(e=>e.name).join(', ')||'None'}</span></div>}
              <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="phone"/> {systemType==='extensions'?'Ring this phone':'Calls ring'}</span><span className="qs-srow-v">{systemType==='extensions' ? (chosenExts.filter(e=>e.fwdOn).map(e=>e.name).join(', ')||'None - all to voicemail') : callsSummary}</span></div>
              {systemType==='simple' && <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="clock"/> Forwarding</span><span className="qs-srow-v">{schedSummary}</span></div>}
              <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="mail"/> Voicemails go to</span><span className="qs-srow-v">{emails.filter(Boolean).join(', ')}</span></div>
              {systemType==='simple' && <div className="qs-srow"><span className="qs-srow-k"><QSIcon name="audiolines"/> Greeting</span><span className="qs-srow-v"><QSPlayer label="0:06"/></span></div>}
            </div>
          </React.Fragment>
        )}

        <div className="qs-foot">
          {step>0 ? <button className="qs-btn ghost" onClick={back}><QSIcon name="arrowleft"/> Back</button> : <span/>}
          {step<last
            ? <button className="qs-btn primary" onClick={next}>{step===0?'Get started':'Continue'} <QSIcon name="chevright"/></button>
            : (stepKey==='texts'&&smsStatus==='pending')
              ? <button className="qs-btn ghost" onClick={onDone}>Skip for now <QSIcon name="chevright"/></button>
              : <button className="qs-btn primary" onClick={onDone}>Go to phone system <QSIcon name="chevright"/></button>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QuickSetup });
