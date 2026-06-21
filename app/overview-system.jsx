/* ============================================================
   JOEL app - System Overview (exports to window)
   A calm setup/management summary of the phone system.
   NOT a dashboard: no analytics, no reporting. Summarizes the
   core objects (numbers, greeting, extensions, voicemail) and
   links out to the advanced screens for deeper edits.
   ============================================================ */
const { Icon } = window;

function ovSms(sms){
  if(sms==='approved') return { cls:'ok', label:'SMS approved' };
  if(sms==='pending')  return { cls:'pending', label:'SMS pending' };
  return { cls:'muted', label:'Receive-only texts' };
}

/* compact voicemail-notification summary per extension (overview level) */
const VM_NOTIFY = {
  0:{ emails:['team@smilebar.co','bob@smilebar.co'], slack:null },
  1:{ emails:['team@smilebar.co','bob@smilebar.co'], slack:'#sales-team' },
  2:{ emails:['support@smilebar.co'], slack:null },
  3:{ emails:['billing@smilebar.co'], slack:null },
};
function notifyLine(num){
  const n = VM_NOTIFY[num] || { emails:[], slack:null };
  const parts=[];
  if(n.slack) parts.push(`Slack ${n.slack}`);
  if(n.emails.length) parts.push(`${n.emails.length} email recipient${n.emails.length>1?'s':''}`);
  return parts.length ? parts.join(' + ') : 'No recipients set';
}

function GreetingPreview({ label }){
  const [playing,setPlaying]=React.useState(false);
  React.useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),1800); return ()=>clearTimeout(t); },[playing]);
  return (
    <button className={`ov-preview${playing?' on':''}`} onClick={()=>setPlaying(p=>!p)}>
      <Icon name={playing?'pause':'play'}/> {playing?'Playing…':(label||'Preview')}
    </button>
  );
}

function SystemOverviewScreen({ numbers, extensions, greeting, hours, afterHoursOn, businessName, onGo, onOpenExt }){
  const realExts = extensions.filter(e=>e.number!==0 && e.status!=='disabled');
  const simple = realExts.length===0;
  const operator = extensions.find(e=>e.number===0);

  // health / setup warnings - only render when something needs attention
  const warnings=[];
  numbers.forEach(n=>{ if(n.sms==='pending') warnings.push({ t:`SMS registration is pending on your ${n.label} number (${n.num}). Finish A2P registration to send texts.`, go:'numbers' }); });

  const shown = numbers.slice(0,3);
  const more = numbers.length>3;

  return (
    <div className="sysov">
      <div className="sysov-head">
        <h1>System overview</h1>
        <p>See how callers reach your business and make quick changes.</p>
      </div>

      {warnings.length>0 && (
        <div className="sysov-warns">
          {warnings.map((w,i)=>(
            <div className="sysov-warn" key={i}>
              <span className="sysov-warn-ic"><Icon name="info"/></span>
              <span className="sysov-warn-t">{w.t}</span>
              <button className="sysov-warn-go" onClick={()=>onGo(w.go)}>Resolve</button>
            </div>
          ))}
        </div>
      )}

      {/* 1 · NUMBERS */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="hashnum"/></span>
          <h2>Numbers</h2>
          <button className="ov-act" onClick={()=>onGo('numbers')}><Icon name="plus"/> Add number</button>
        </div>
        <div className="ov-numgrid">
          {shown.map(n=>{ const b=ovSms(n.sms); const route = n.routesTo==='main' ? 'Main greeting' : `Extension ${n.routesTo}`;
            return (
              <div className="ov-numcard" key={n.num}>
                <div className="ov-numcard-h">
                  <b className="ov-num">{n.num}</b>
                  <button className="ov-edit" onClick={()=>onGo('numbers')}>Edit</button>
                </div>
                <div className="ov-numlabel">{n.label}</div>
                <div className="ov-chips">
                  <span className="ov-chip">{n.type}</span>
                  <span className={`ov-chip sms ${b.cls}`}>{b.label}</span>
                </div>
                <div className="ov-route"><span className="ov-k">Routes to</span><span className="ov-route-v"><Icon name="chevright"/> {route}</span></div>
              </div>
            );
          })}
        </div>
        {more && <button className="ov-viewall" onClick={()=>onGo('numbers')}>View all {numbers.length} numbers <Icon name="chevright"/></button>}
      </section>

      {/* 2 · MAIN GREETING */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="audiolines"/></span>
          <h2>Main greeting</h2>
          <button className="ov-act" onClick={()=>onGo('greetings')}><Icon name="pencil"/> Edit greeting</button>
        </div>
        <div className="ov-card">
          <div className="ov-greetrow">
            <GreetingPreview/>
            <p className="ov-greettext">“{greeting}”</p>
          </div>
          <div className="ov-divider"/>
          <div className="ov-afterhours">
            <div className="ov-ah-main">
              <div className="ov-ah-top">
                <span className="ov-ah-label">After-hours greeting</span>
                <span className={`ov-state ${afterHoursOn?'on':'off'}`}>{afterHoursOn?'On':'Off'}</span>
              </div>
              {afterHoursOn && <div className="ov-ah-sub"><Icon name="clock"/> Business hours: {hours}</div>}
            </div>
            {afterHoursOn && <button className="ov-link" onClick={()=>onGo('greetings')}>Edit after-hours</button>}
          </div>
        </div>
      </section>

      {/* 3 · EXTENSIONS (multi) or CALL FORWARDING (simple) */}
      {simple ? (
        <section className="sysov-sec">
          <div className="sysov-sec-h">
            <span className="sysov-sec-ic"><Icon name="route"/></span>
            <h2>Call forwarding</h2>
            <button className="ov-act" onClick={()=>onOpenExt(operator)}><Icon name="plus"/> Add destination</button>
          </div>
          <div className="ov-card flush">
            <div className="ov-fwd-lead">Calls ring:</div>
            {(operator&&operator.dests||[]).map((d,i)=>(
              <div className="ov-fwd" key={i}>
                <span className="ov-fwd-ic"><Icon name="phone"/></span>
                <div className="ov-fwd-t"><b>{d}</b><span>Always</span></div>
                <span className="ov-state on">On</span>
              </div>
            ))}
            <button className="ov-rowlink" onClick={()=>onOpenExt(operator)}>Advanced extension settings <Icon name="chevright"/></button>
          </div>
        </section>
      ) : (
        <section className="sysov-sec">
          <div className="sysov-sec-h">
            <span className="sysov-sec-ic"><Icon name="route"/></span>
            <h2>Extensions</h2>
            <button className="ov-act" onClick={()=>onGo('extensions')}><Icon name="plus"/> Add extension</button>
          </div>
          <div className="ov-card flush">
            {extensions.map(e=>(
              <button className="ov-extrow" key={e.id} onClick={()=>onOpenExt(e)}>
                <span className="ov-extnum">{e.number}</span>
                <span className="ov-ext-main">
                  <b>{e.name}{e.number===0 && e.name!=='Operator'?' · Operator':''}</b>
                  <span className="ov-ext-sub">{e.status==='disabled' ? 'Forwarding off' : `Forwards to ${e.forwards} destination${e.forwards>1?'s':''} · ${notifyLine(e.number)}`}</span>
                </span>
                <span className={`ov-state ${e.status==='disabled'?'off':'on'}`}>{e.status==='disabled'?'Disabled':'Active'}</span>
                <Icon name="chevright"/>
              </button>
            ))}
          </div>
          <button className="ov-viewall" onClick={()=>onGo('extensions')}>View all extensions <Icon name="chevright"/></button>
        </section>
      )}

      {/* 4 · VOICEMAIL NOTIFICATIONS */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="voicemail"/></span>
          <h2>Voicemail notifications</h2>
          <button className="ov-act" onClick={()=>simple?onOpenExt(operator):onGo('extensions')}><Icon name="bell"/> Manage</button>
        </div>
        <div className="ov-card flush">
          {simple ? (
            <div className="ov-vm-simple">
              <div className="ov-vm-k">Voicemails email</div>
              {(VM_NOTIFY[0].emails).map(em=>(
                <div className="ov-vm-em" key={em}><span className="ov-fwd-ic"><Icon name="mail"/></span>{em}</div>
              ))}
              <div className="ov-vm-attach"><Icon name="check"/> MP3 attachment included</div>
            </div>
          ) : (
            extensions.filter(e=>e.status!=='disabled').map(e=>(
              <div className="ov-vmrow" key={e.id}>
                <span className="ov-extnum sm">{e.number}</span>
                <span className="ov-ext-main"><b>{e.name}</b><span className="ov-ext-sub">{notifyLine(e.number)}</span></span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SystemOverviewScreen });
