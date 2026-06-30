/* ============================================================
   AnyPhone app - System Overview · V2 (exports to window)
   Phone-system HEALTH + QUICK ACTIONS. Not a dashboard, no
   analytics. Answers: is it healthy? does anything need
   attention? how do I make a quick temporary change?
   ============================================================ */
const { Icon } = window;

function ovSms2(sms){
  if(sms==='approved') return { cls:'ok', label:'SMS approved' };
  if(sms==='pending')  return { cls:'pending', label:'SMS pending' };
  return { cls:'muted', label:'Receive-only' };
}
const VN = { 0:{e:2,s:false}, 1:{e:2,s:true}, 2:{e:1,s:false}, 3:{e:1,s:false} };
function notifStatus(num){ const v=VN[num]||{e:0,s:false}; if(!v.e && !v.s) return 'No alerts'; const p=[]; if(v.e) p.push('Email'); if(v.s) p.push('Slack'); return p.join(' + '); }

const QUICK_MODES = [
  { id:'open',      icon:'check',    label:'Open normally',     desc:'Standard hours and routing.' },
  { id:'away',      icon:'clock',    label:'Away today',        desc:'Send today’s calls straight to voicemail.' },
  { id:'vacation',  icon:'calendar', label:'Vacation mode',     desc:'Play your after-hours greeting until you turn it off.' },
  { id:'closure',   icon:'ban',      label:'Temporary closure', desc:'Tell callers you’re closed for now.' },
  { id:'emergency', icon:'shield',   label:'Emergency only',    desc:'Ring only your on-call destination.' },
];

function SystemOverviewV2({ numbers, extensions, onGo, onOpenExt }){
  const [mode,setMode]=React.useState('open');

  // ---- health / attention ----
  const warnings=[];
  numbers.forEach(n=>{ if(n.sms==='pending') warnings.push({ t:`SMS registration pending on ${n.label} · ${n.num}`, go:'numbers' }); });
  extensions.forEach(e=>{ if(e.status==='disabled') warnings.push({ t:`${e.name} extension is disabled - calls won’t route here`, open:e }); });
  const healthy = warnings.length===0;

  const activeExts = extensions.filter(e=>e.status!=='disabled');
  const disabled = extensions.filter(e=>e.status==='disabled');
  const smsPending = numbers.filter(n=>n.sms==='pending').length;
  const smsApproved = numbers.filter(n=>n.sms==='approved').length;
  const stats = [
    { n:numbers.length, label:`Active number${numbers.length!==1?'s':''}`, tone:'' },
    { n:activeExts.length, label:`Active extension${activeExts.length!==1?'s':''}`, tone:'' },
    disabled.length ? { n:disabled.length, label:`Disabled extension${disabled.length!==1?'s':''}`, tone:'warn' } : null,
    smsApproved ? { n:smsApproved, label:'SMS approved', tone:'ok' } : null,
    smsPending ? { n:smsPending, label:'SMS pending', tone:'pending' } : null,
  ].filter(Boolean);

  const curMode = QUICK_MODES.find(m=>m.id===mode);

  return (
    <div className="sysov v2">
      <div className="sysov-head">
        <h1>System overview</h1>
        <p>Your phone system at a glance - what’s healthy, what needs attention, and quick changes.</p>
      </div>

      {/* status banner */}
      <div className={`ov-status ${healthy?'ok':'attn'}`}>
        <span className="ov-status-ic"><Icon name={healthy?'check':'info'}/></span>
        <div className="ov-status-t">
          <b>{healthy ? 'Everything’s working' : `${warnings.length} thing${warnings.length>1?'s'  :''} need${warnings.length>1?'':'s'} attention`}</b>
          <span>{healthy ? 'Numbers, extensions, and routing all look good.' : 'Resolve the items below to keep callers reaching you.'}</span>
        </div>
        {mode!=='open' && <span className="ov-modeflag"><Icon name={curMode.icon}/> {curMode.label}</span>}
      </div>

      {/* health stat pills */}
      <div className="ov-stats">
        {stats.map((s,i)=>(<div className={`ov-stat ${s.tone}`} key={i}><b>{s.n}</b><span>{s.label}</span></div>))}
        <div className="ov-stat ok"><b><Icon name="check"/></b><span>Destinations configured</span></div>
      </div>

      {/* NEEDS ATTENTION */}
      {warnings.length>0 && (
        <section className="sysov-sec">
          <div className="sysov-sec-h"><span className="sysov-sec-ic warn"><Icon name="info"/></span><h2>Needs attention</h2></div>
          <div className="ov-card flush">
            {warnings.map((w,i)=>(
              <div className="ov-attn" key={i}>
                <span className="ov-attn-dot"/>
                <span className="ov-attn-t">{w.t}</span>
                <button className="ov-resolve" onClick={()=>w.open?onOpenExt(w.open):onGo(w.go)}>Resolve</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* QUICK CHANGES */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="sliders"/></span>
          <h2>Quick changes</h2>
          {mode!=='open' && <button className="ov-act" onClick={()=>setMode('open')}>Reset to normal</button>}
        </div>
        <p className="sysov-sec-note">Temporarily change what callers experience - no digging through settings.</p>
        <div className="ov-modes">
          {QUICK_MODES.map(m=>(
            <button key={m.id} className={`ov-mode${mode===m.id?' on':''}`} onClick={()=>setMode(m.id)}>
              <span className="ov-mode-ic"><Icon name={m.icon}/></span>
              <span className="ov-mode-t"><b>{m.label}</b><span>{m.desc}</span></span>
              <span className={`ov-mode-radio${mode===m.id?' on':''}`}>{mode===m.id && <Icon name="check"/>}</span>
            </button>
          ))}
        </div>
      </section>

      {/* NUMBERS SUMMARY (compact, read-only) */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="hashnum"/></span>
          <h2>Numbers</h2>
          <button className="ov-act" onClick={()=>onGo('numbers')}>Manage <Icon name="chevright"/></button>
        </div>
        <div className="ov-card flush">
          {numbers.map(n=>{ const b=ovSms2(n.sms); const route = n.routesTo==='main' ? 'Main greeting' : `Extension ${n.routesTo}`;
            return (
              <div className="ov-sumrow" key={n.num}>
                <span className="ov-sum-dot on" title="Active"/>
                <span className="ov-sum-main"><b>{n.num}</b><span>{n.label} · {n.type}</span></span>
                <span className={`ov-chip sms ${b.cls}`}>{b.label}</span>
                <span className="ov-sum-route">{route}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXTENSIONS SUMMARY (compact, read-only) */}
      <section className="sysov-sec">
        <div className="sysov-sec-h">
          <span className="sysov-sec-ic"><Icon name="route"/></span>
          <h2>Extensions</h2>
          <button className="ov-act" onClick={()=>onGo('extensions')}>Manage <Icon name="chevright"/></button>
        </div>
        <div className="ov-card flush">
          {extensions.map(e=>(
            <div className="ov-sumrow" key={e.id}>
              <span className={`ov-sum-dot ${e.status==='disabled'?'off':'on'}`}/>
              <span className="ov-extnum sm">{e.number}</span>
              <span className="ov-sum-main"><b>{e.name}{e.number===0?' · Operator':''}</b><span>{e.status==='disabled' ? 'Disabled' : `${e.forwards} destination${e.forwards!==1?'s':''}`}</span></span>
              <span className="ov-notif"><Icon name="bell"/> {notifStatus(e.number)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SystemOverviewV2 });
