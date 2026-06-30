/* ============================================================
   AnyPhone app - Phone System (exports to window as SystemOverviewV3)
   THE primary management surface. Numbers, greeting, after-hours,
   holidays, call forwarding, voicemail delivery, missed-call &
   Slack notifications - all managed inline. No trips to Numbers /
   Greetings / Extensions for routine work.
   ============================================================ */
const { Icon, Modal } = window;
const { GreetingEditor, GreetingSummary, HolidayDrawer } = window;
const PS_useState = React.useState, PS_useEffect = React.useEffect;

function ovSms3(sms){
  if(sms==='approved') return { cls:'ok', label:'SMS approved' };
  if(sms==='pending')  return { cls:'pending', label:'SMS pending' };
  return { cls:'muted', label:'Receive-only' };
}
const QA = [
  { id:'away',      icon:'clock',    label:'Away today',        desc:'Send today’s calls straight to voicemail until tomorrow.' },
  { id:'vacation',  icon:'calendar', label:'Vacation mode',     desc:'Play your after-hours greeting and take messages until you turn it off.' },
  { id:'closure',   icon:'ban',      label:'Temporary closure', desc:'Tell callers you’re closed for now and route them to voicemail.' },
  { id:'emergency', icon:'shield',   label:'Emergency only',    desc:'Ring only your on-call destination and skip everything else.' },
];
const RING_OPTS = [['order','In order'],['all','All at once'],['single','One phone']];
const DUR_OPTS = ['20s','30s','45s'];

function Recips({ items, onChange, kind='email' }){
  const [v,setV]=PS_useState('');
  const ok = kind==='email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) : v.replace(/[^\d]/g,'').length>=10;
  const add=()=>{ if(!ok || items.includes(v.trim())){ setV(''); return; } onChange([...items,v.trim()]); setV(''); };
  return (
    <div className="recip-list col">
      {items.length===0 && <span className="recip-empty">No recipients yet.</span>}
      {items.map(r=>(<div className="recip-row" key={r}><span className="recip-chip"><Icon name={kind==='email'?'mail':'phone'}/>{r}<button onClick={()=>onChange(items.filter(x=>x!==r))} aria-label="Remove"><Icon name="x"/></button></span></div>))}
      <div className="recip-add"><input className="input" value={v} placeholder={kind==='email'?'name@company.com':'(555) 000-0000'} onChange={e=>setV(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); add(); } }}/><button className="btn btn-secondary sm" onClick={add}><Icon name="plus"/> Add</button></div>
    </div>
  );
}

function DestList({ dests, onChange, ordered }){
  const [adding,setAdding]=PS_useState(false);
  const [nt,setNt]=PS_useState('phone');
  const [nv,setNv]=PS_useState('');
  const upd=(id,patch)=>onChange(dests.map(d=>d.id===id?{...d,...patch}:d));
  const TYPES=[['phone','Phone number'],['mobile','Mobile app'],['desk','Desk phone']];
  const add=()=>{ const v=nv.trim(); if(!v) return; const sfx=nt==='mobile'?' - mobile app':nt==='desk'?' - desk phone':''; onChange([...dests,{id:'d'+Date.now(),label:v+sfx,type:nt,on:true,sched:'always',dur:'30s',announce:nt==='phone'}]); setNv(''); setAdding(false); };
  return (
    <div className="ps-dests">
      {dests.map((d,i)=>(
        <div className={`ps-dest${d.on?'':' off'}`} key={d.id}>
          <span className="ps-destnum">{ordered? i+1 : <Icon name="phone"/>}</span>
          <div className="ov-fwd-t">
            <b>{d.label}</b>
            <div className="ps-destpills">
              <label className="ps-selpill"><Icon name="calendar"/><select value={d.sched||'always'} onChange={e=>upd(d.id,{sched:e.target.value})}><option value="always">Always</option><option value="weekdays">Mon–Fri, 9–5</option><option value="weekends">Weekends</option><option value="nights">Nights & weekends</option><option value="custom">Custom…</option></select></label>
              <label className="ps-selpill"><Icon name="clock"/><select value={d.dur||'30s'} onChange={e=>upd(d.id,{dur:e.target.value})}>{['15s','20s','30s','45s','60s'].map(x=><option key={x} value={x}>Rings {x}</option>)}</select></label>
              <button className={`ps-pill${d.announce?' on':''}`} title="Call announce asks the person to press 1 before connecting, so a personal voicemail can’t answer and drop the call." onClick={()=>upd(d.id,{announce:!d.announce})}><Icon name="bell"/> Announce {d.announce?'on':'off'}</button>
            </div>
          </div>
          <button className="ps-x" onClick={()=>onChange(dests.filter(x=>x.id!==d.id))} aria-label="Remove"><Icon name="trash"/></button>
          <button role="switch" aria-checked={d.on} className={`toggle sm${d.on?' on':''}`} onClick={()=>upd(d.id,{on:!d.on})}/>
        </div>
      ))}
      {adding ? (
        <div className="ps-destadd">
          <select className="input" value={nt} onChange={e=>setNt(e.target.value)}>{TYPES.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
          <input className="input" autoFocus value={nv} placeholder={nt==='phone'?'(555) 000-0000':nt==='mobile'?'Teammate name':'Desk phone name'} onChange={e=>setNv(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') add(); }}/>
          <button className="btn btn-primary sm" onClick={add}>Add</button>
          <button className="btn btn-ghost sm" onClick={()=>{setAdding(false);setNv('');}}>Cancel</button>
        </div>
      ) : (
        <button className="ps-addrow" onClick={()=>setAdding(true)}><Icon name="plus"/> Add destination</button>
      )}
    </div>
  );
}

/* full expanded extension panel - status, destinations, ring strategy,
   transfer experience, voicemail greeting */
function FwdEditor({ d, patch, name, maxPlan=false, notif, patchNotif, slackConnected, slackChannel, onConnectSlack }){
  const [tePlay,setTePlay]=PS_useState(false);
  PS_useEffect(()=>{ if(!tePlay) return; const t=setTimeout(()=>setTePlay(false),1500); return ()=>clearTimeout(t); },[tePlay]);
  const TE = [['ring','Ringing'],['greeting','Transfer greeting'],['music','Music on hold']];
  return (
    <React.Fragment>
      <label className="ps-toggle ps-fwdtoggle"><span><b>Call forwarding</b><small>{d.fwdOn===false?'Off - calls go straight to voicemail.':'On - calls ring the destinations below.'}</small></span><button role="switch" aria-checked={d.fwdOn!==false} className={`toggle${d.fwdOn!==false?' on':''}`} onClick={()=>patch({fwdOn:d.fwdOn===false})}/></label>
      <div className="ps-field"><label>Calls ring</label><DestList dests={d.dests} ordered={d.ring==='order'} onChange={v=>patch({dests:v})}/></div>
      <div className="ps-field"><label>Ring strategy</label>
        <div className="ps-seg">
          <button className={d.ring==='order'?'on':''} onClick={()=>patch({ring:'order'})}>One by one</button>
          <button className={`${d.ring==='all'?'on':''}${maxPlan?'':' locked'}`} onClick={()=>maxPlan?patch({ring:'all'}):null}>All at once{maxPlan?'':' · Max'}</button>
          <button className={d.ring==='single'?'on':''} onClick={()=>patch({ring:'single'})}>One phone only</button>
        </div>
      </div>
      <div className="ps-field"><label>Transfer experience<span className="ps-fieldnote">What callers hear while connecting</span></label>
        <div className="ps-teRow">
          <div className="ps-seg">{TE.map(([id,l])=><button key={id} className={d.transferExp===id?'on':''} onClick={()=>patch({transferExp:id})}>{l}</button>)}</div>
          <button className="ge-btn" onClick={()=>setTePlay(true)}><Icon name={tePlay?'pause':'play'}/> {tePlay?'Playing…':'Preview'}</button>
        </div>
        {d.transferExp==='greeting' && <div className="ps-hint">Callers hear: “Please wait while we transfer you to {name||'this team'}.”</div>}
        {d.transferExp==='music' && <div className="ps-hint">Hold music plays until someone answers.</div>}
      </div>
      <div className="ps-field"><label>Voicemail greeting</label>
        {d.vmEdit
          ? <GreetingEditor text={d.vmGreet} voice={d.vmVoice||'Sarah - friendly female'} businessName={name} suggest={`You’ve reached ${name||'us'}. Please leave a message and we’ll call you back.`} onSave={({text,voice})=>patch({vmGreet:text,vmVoice:voice,vmEdit:false})} onCancel={()=>patch({vmEdit:false})}/>
          : <GreetingSummary text={d.vmGreet} voice={d.vmVoice||'Sarah - friendly female'} onEdit={()=>patch({vmEdit:true})}/>}
      </div>
      {notif && <React.Fragment>
        <div className="ps-divh">Voicemail &amp; missed-call alerts</div>
        <ExtNotifEditor d={notif} patch={patchNotif} slackConnected={slackConnected} slackChannel={slackChannel} onConnectSlack={onConnectSlack}/>
      </React.Fragment>}
    </React.Fragment>
  );
}

/* multi-step number release confirmation */
function ReleaseFlow({ n, onClose, onConfirm }){
  const [step,setStep]=PS_useState(1);
  const [ack,setAck]=PS_useState(false);
  const [typed,setTyped]=PS_useState('');
  const dig=s=>String(s).replace(/[^\d]/g,'');
  const match = dig(typed)===dig(n.num);
  return (
    <Modal title="Release number" icon="trash" desc={n.num} onClose={onClose}
      footer={step===1
        ? <React.Fragment><button className="btn btn-ghost sm" onClick={onClose}>Cancel</button><button className="btn btn-primary sm" disabled={!ack} style={!ack?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>setStep(2)}>Continue</button></React.Fragment>
        : <React.Fragment><button className="btn btn-ghost sm" onClick={()=>setStep(1)}>Back</button><button className="btn btn-danger sm" disabled={!match} style={!match?{opacity:.5,pointerEvents:'none'}:null} onClick={onConfirm}>Release {n.num}</button></React.Fragment>}>
      {step===1 ? (
        <React.Fragment>
          <div className="note warn" style={{marginBottom:14}}><Icon name="info"/><span>Releasing is permanent. You’ll immediately stop receiving calls and texts on this number, and you may not be able to get it back.</span></div>
          <ul className="ps-rellist">
            <li><Icon name="check"/> Calls and texts to {n.num} will stop</li>
            <li><Icon name="check"/> Any routing from this number is removed</li>
            <li><Icon name="check"/> This can’t be undone</li>
          </ul>
          <div className="ps-hint" style={{marginBottom:12}}>Just need a break? Close this and toggle <b>Number active</b> off instead - that keeps the number.</div>
          <label className="ps-ack"><input type="checkbox" checked={ack} onChange={e=>setAck(e.target.checked)}/> I understand this permanently releases {n.num}.</label>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="ov3-tasklead">Type <b>{n.num}</b> to confirm you want to release it.</p>
          <input className="input" autoFocus value={typed} placeholder={n.num} onChange={e=>setTyped(e.target.value)}/>
        </React.Fragment>
      )}
    </Modal>
  );
}

/* notification editor (voicemail + missed-call recipients, Slack) */
function NotifEditor({ d, patch, slackConnected, onConnectSlack, slackChannel }){
  return (
    <React.Fragment>
      <div className="ps-field"><label>Voicemail email recipients</label><Recips items={d.emails} onChange={v=>patch({emails:v})}/></div>
      <label className="ps-toggle"><span><b>Also alert me on missed calls</b><small>Email the same recipients when a call is missed with no message.</small></span><button role="switch" aria-checked={d.missed} className={`toggle sm${d.missed?' on':''}`} onClick={()=>patch({missed:!d.missed})}/></label>
      <div className="ps-field"><label>Slack</label>
        {slackConnected ? (
          <div className="ps-slack">
            <span className="recip-chip slack"><Icon name="slack"/> {slackChannel}</span>
            <label className="ps-toggle slim"><span>Voicemails → Slack</span><button role="switch" aria-checked={d.slackVm} className={`toggle sm${d.slackVm?' on':''}`} onClick={()=>patch({slackVm:!d.slackVm})}/></label>
            <label className="ps-toggle slim"><span>Missed calls → Slack</span><button role="switch" aria-checked={d.slackMissed} className={`toggle sm${d.slackMissed?' on':''}`} onClick={()=>patch({slackMissed:!d.slackMissed})}/></label>
          </div>
        ) : (
          <button className="ps-connect" onClick={onConnectSlack}><Icon name="slack"/> Connect Slack</button>
        )}
      </div>
    </React.Fragment>
  );
}

/* inline (horizontal) email chips with add */
function InlineEmails({ items, onChange, kind='email' }){
  const [adding,setAdding]=PS_useState(false);
  const [v,setV]=PS_useState('');
  const ok = kind==='email' ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) : v.replace(/[^\d]/g,'').length>=10;
  const add=()=>{ if(!ok||items.includes(v.trim())){ setV(''); setAdding(false); return; } onChange([...items,v.trim()]); setV(''); setAdding(false); };
  return (
    <div className="vm-emails">
      {items.map(e=>(<span className="vm-chip" key={e}>{e}<button onClick={()=>onChange(items.filter(x=>x!==e))} aria-label="Remove"><Icon name="x"/></button></span>))}
      {adding ? (
        <input className="vm-addinput" autoFocus value={v} placeholder={kind==='email'?'name@company.com':'(555) 000-0000'} onChange={e=>setV(e.target.value)} onBlur={add} onKeyDown={e=>{ if(e.key==='Enter') add(); if(e.key==='Escape'){ setV(''); setAdding(false); } }}/>
      ) : (
        <button className="vm-addbtn" onClick={()=>setAdding(true)}><Icon name="plus"/> Add</button>
      )}
    </div>
  );
}

/* per-extension notification editor (multi-extension mode) */
function ExtNotifEditor({ d, patch, slackConnected, slackChannel, onConnectSlack }){
  return (
    <React.Fragment>
      <div className="ps-field"><label>Email recipients</label><Recips items={d.emails} onChange={v=>patch({emails:v})}/></div>
      <div className="ps-field"><label>SMS recipients</label><Recips kind="phone" items={d.smsPhones} onChange={v=>patch({smsPhones:v})}/></div>
      <div className="ps-field"><label>Slack notifications</label>
        {slackConnected ? (
          <div className="ps-slack"><span className="recip-chip slack"><Icon name="slack"/> {slackChannel}</span><label className="ps-toggle slim"><span>Voicemail alerts</span><button role="switch" aria-checked={d.slackVm} className={`toggle sm${d.slackVm?' on':''}`} onClick={()=>patch({slackVm:!d.slackVm})}/></label></div>
        ) : <button className="ps-connect" onClick={onConnectSlack}><Icon name="slack"/> Connect Slack</button>}
      </div>
      <label className="ps-toggle"><span><b>Missed call alerts</b><small>Notify recipients when a call is missed with no message.</small></span><button role="switch" aria-checked={d.missed} className={`toggle sm${d.missed?' on':''}`} onClick={()=>patch({missed:!d.missed})}/></label>
      <label className="ps-toggle"><span><b>Webhook notifications</b><small>POST voicemail &amp; missed-call events to a URL.</small></span><button role="switch" aria-checked={d.webhook} className={`toggle sm${d.webhook?' on':''}`} onClick={()=>patch({webhook:!d.webhook})}/></label>
      {d.webhook && <div className="ps-field"><input className="input" value={d.webhookUrl} placeholder="https://example.com/hooks/joel" onChange={e=>patch({webhookUrl:e.target.value})}/></div>}
    </React.Fragment>
  );
}

/* build a real destination object from a seed label string */
function psDest(str,i){
  const base=String(str); const main=base.replace(/\s*-.*/,'').trim(); const tail=base.includes('-')?base.replace(/.*-\s*/,'').trim():'';
  const id='d'+i+Math.random().toString(36).slice(2,6);
  if(/mobile app/i.test(base)) return { id, type:'app', user:main, label:main, enabled:true, screening:false, schedule:null, ring:30 };
  if(/\d{3}/.test(main)){ const lab=(tail&&!/^\d/.test(tail))?tail.charAt(0).toUpperCase()+tail.slice(1):'Cell'; return { id, type:'phone', number:main, label:lab, enabled:true, screening:true, schedule:null, ring:30 }; }
  return { id, type:'sip', device:main, label:main, enabled:true, screening:false, schedule:null, ring:30 };
}
/* full ext-shaped state so the real RoutingPanel / VoicemailPanel / NotificationsPanel work */
function mkExtState(e, extensions, businessName){
  const others=(extensions||[]).filter(x=>x.number!==e.number).map(x=>({number:String(x.number),name:x.name}));
  const vmEmails={0:['team@smilebar.co','bob@smilebar.co'],1:['team@smilebar.co','sales@smilebar.co'],2:['support@smilebar.co'],3:['billing@smilebar.co']}[e.number]||['team@smilebar.co'];
  const ch=e.number===1?'#sales-team':'#front-desk';
  return {
    number:e.number, name:e.name, tts:e.name, enabled:e.enabled!==false, status:e.status,
    routing:'one', transferExp:e.transferExp||'ring',
    officeHours:{ mode:'247', days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM', tz:'Eastern (ET)', away:[] },
    destinations:(e.dests||[]).map((d,i)=>psDest(d,i)),
    fallback:'voicemail', forwardTo: others[0]?others[0].number:'0', fwdCallerId:'business',
    otherExtensions: others.length?others:[{number:'0',name:'Operator'}],
    voicemail:{ enabled:true, afterHoursOn:false, voice:'Aria', schedule:{ days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM' },
      greeting:`Thanks for calling ${businessName} ${e.name}. Sorry we missed you - leave a message and we’ll call right back.`,
      afterHours:`You’ve reached ${businessName} ${e.name} after hours. Leave a message and we’ll reach out next business day.` },
    notifications:{
      missed:{ email:true, emailTo:vmEmails.slice(0,1), text:false, textTo:[], slack:e.number===1, webhook:false, webhookUrl:'', webhookMsg:'{\n  "event": "missed_call"\n}' },
      voicemail:{ email:true, emailTo:vmEmails, emailAttach:true, slack:e.number===1, webhook:false, webhookUrl:'', webhookMsg:'{\n  "event": "voicemail"\n}' },
      slackChannel: ch,
    },
    recording:'inherit', recordingOn:false,
  };
}

function SystemOverviewV3({ businessName, numbers, greeting:greetIn, hours:hoursIn, afterHoursOn:ahIn, routeDestinations, voicemailEmails, extensions, onGo }){
  const realSimple = (extensions||[]).filter(e=>e.number!==0 && e.status!=='disabled').length===0;
  const [acct,setAcct]=PS_useState(realSimple?'simple':'multi');
  const simple = acct==='simple';

  const [nums,setNums]=PS_useState((numbers||[]).map(n=>({...n})));
  const [addNum,setAddNum]=PS_useState(false);
  const [newNum,setNewNum]=PS_useState({label:'',num:'',type:'Local'});
  const [editIdx,setEditIdx]=PS_useState(null);
  const [menuIdx,setMenuIdx]=PS_useState(null);
  const [port,setPort]=PS_useState(null);

  const [greet,setGreet]=PS_useState(greetIn);
  const [voice,setVoice]=PS_useState('Sarah - friendly female');
  const [mainEdit,setMainEdit]=PS_useState(false);
  const [ah,setAh]=PS_useState(false);
  const [ahEdit,setAhEdit]=PS_useState(false);
  const [ahExpanded,setAhExpanded]=PS_useState(false);
  const [hoursEdit,setHoursEdit]=PS_useState(false);
  const [ahGreet,setAhGreet]=PS_useState('Thanks for calling Smilebar. We’re closed right now - leave a message and we’ll call you back.');
  const [ahVoice,setAhVoice]=PS_useState('Sarah - friendly female');
  const [hours,setHours]=PS_useState(hoursIn);
  const [holidays,setHolidays]=PS_useState([{name:'Christmas',date:'Dec 25'},{name:'New Year’s Day',date:'Jan 1'}]);
  const [holidayDrawer,setHolidayDrawer]=PS_useState(false);

  const [slackConnected,setSlackConnected]=PS_useState(true);
  const slackChannel='#front-desk';

  const [exp,setExp]=PS_useState(null), [expVm,setExpVm]=PS_useState(null);
  const [release,setRelease]=PS_useState(null);
  const [task,setTask]=PS_useState(null), [activeMode,setActiveMode]=PS_useState(null);

  const realExts = (extensions||[]).filter(e=>e.number!==0);
  const opExt = (extensions||[]).find(e=>e.number===0);
  const RoutingPanel=window.RoutingPanel, VoicemailPanel=window.VoicemailPanel, NotificationsPanel=window.NotificationsPanel, DestinationModal=window.DestinationModal;

  const [extStates,setExtStates]=PS_useState(()=>{ const m={}; (extensions||[]).forEach(e=>{ m[e.id]=mkExtState(e,extensions,businessName); }); return m; });
  const patchExt=(id,p)=>setExtStates(m=>({...m,[id]:{...m[id],...p}}));
  const dOp=(id,fn)=>setExtStates(m=>({...m,[id]:{...m[id],destinations:fn(m[id].destinations)}}));
  const toggleDest=(id,did)=>dOp(id,ds=>ds.map(d=>d.id===did?{...d,enabled:!d.enabled}:d));
  const screenDest=(id,did)=>dOp(id,ds=>ds.map(d=>d.id===did?{...d,screening:!d.screening}:d));
  const moveDest=(id,did,dir)=>dOp(id,ds=>{ const a=[...ds]; const i=a.findIndex(d=>d.id===did); const j=i+dir; if(j<0||j>=a.length) return ds; [a[i],a[j]]=[a[j],a[i]]; return a; });
  const removeDest=(id,did)=>dOp(id,ds=>ds.filter(d=>d.id!==did));
  const saveDest=(id,d)=>dOp(id,ds=> ds.some(x=>x.id===d.id) ? ds.map(x=>x.id===d.id?d:x) : [...ds,d]);
  const setNotifField=(id,ev,k,v)=>setExtStates(m=>({...m,[id]:{...m[id],notifications:{...m[id].notifications,[ev]:{...m[id].notifications[ev],[k]:v}}}}));
  const setSlackCh=(id,v)=>setExtStates(m=>({...m,[id]:{...m[id],notifications:{...m[id].notifications,slackChannel:v}}}));
  const [destModal,setDestModal]=PS_useState(null);

  const qa = QA.find(q=>q.id===activeMode);
  const addNumber=()=>{ const v=newNum.num.trim(); if(v.replace(/[^\d]/g,'').length<10) return; setNums(n=>[...n,{num:v,label:newNum.label.trim()||'New number',type:newNum.type,sms:'pending',routesTo:'main'}]); setNewNum({label:'',num:'',type:'Local'}); setAddNum(false); };
  const patchNum=(i,p)=>setNums(list=>list.map((n,idx)=>idx===i?{...n,...p}:n));

  return (
    <div className={`sysov v3ctrl${simple?' simple':' multi'}`}>
      <div className="sysov-head ov-headrow">
        <div>
          <h1>Phone system</h1>
          <p>{simple ? 'Forward your calls and email your voicemails - manage everything here.' : 'Manage numbers, greeting, call forwarding, and voicemail - all in one place.'}</p>
        </div>
        <div className="ov-acctswitch" title="Preview the adaptive layout for each account type">
          <span>Preview as</span>
          <button className={simple?'on':''} onClick={()=>setAcct('simple')}>Simple</button>
          <button className={!simple?'on':''} onClick={()=>setAcct('multi')}>Multi-extension</button>
        </div>
      </div>

      {qa && (
        <div className="ov-status attn">
          <span className="ov-status-ic"><Icon name={qa.icon}/></span>
          <div className="ov-status-t"><b>{qa.label} is on</b><span>{qa.desc}</span></div>
          <button className="ov-resolve" onClick={()=>setActiveMode(null)}>Turn off</button>
        </div>
      )}

      {/* 1 · PHONE NUMBERS */}
      <section className="sysov-sec">
        <div className="sysov-sec-h"><span className="sysov-sec-ic"><Icon name="hashnum"/></span><h2>Phone numbers</h2>
          <button className="ov-act" onClick={()=>setAddNum(a=>!a)}><Icon name="plus"/> Add number</button></div>
        <div className="ov-card flush">
          {nums.map((n,idx)=>{ const b=ovSms3(n.sms); const open=editIdx===idx;
            return (
              <div className={`ps-numwrap${open?' open':''}`} key={n.num+idx}>
                <div className="ov-sumrow ps-numrow">
                  <span className={`ov-sum-dot ${n.disabled?'off':'on'}`}/>
                  <span className="ov-sum-main"><b>{n.num}</b><span>{n.label} · {n.type}</span></span>
                  <span className={`ov-chip sms ${b.cls}`}>{b.label}</span>
                  <span className="ov-sum-route">{n.routesTo==='main'?'Main greeting':`Extension ${n.routesTo}`}</span>
                  <span className="ps-rowacts always">
                    {n.disabled && <span className="ov-state off">Disabled</span>}
                    <div className="ps-menuwrap">
                      <button className="ps-iconbtn" title="Number options" onClick={()=>setMenuIdx(menuIdx===idx?null:idx)}><Icon name="kebab"/></button>
                      {menuIdx===idx && (
                        <React.Fragment>
                          <div className="ps-menuscrim" onClick={()=>setMenuIdx(null)}/>
                          <div className="ps-menu">
                            <button onClick={()=>{ setEditIdx(idx); setMenuIdx(null); }}><Icon name="pencil"/> Edit number</button>
                            <button onClick={()=>{ patchNum(idx,{disabled:!n.disabled}); setMenuIdx(null); }}><Icon name={n.disabled?'check':'ban'}/> {n.disabled?'Enable number':'Disable number'}</button>
                            <button onClick={()=>{ setPort(idx); setMenuIdx(null); }}><Icon name="forward"/> Port out number</button>
                            <div className="ps-menusep"/>
                            <button className="danger" onClick={()=>{ setRelease(idx); setMenuIdx(null); }}><Icon name="trash"/> Release number</button>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </span>
                </div>
                {open && (
                  <div className="ps-numedit">
                    <div className="ps-tworow">
                      <div className="ps-field"><label>Label</label><input className="input" value={n.label} onChange={e=>patchNum(idx,{label:e.target.value})}/></div>
                      <div className="ps-field"><label>Route calls to</label>
                        <select className="input" value={n.routesTo} onChange={e=>patchNum(idx,{routesTo:e.target.value})}>
                          <option value="main">Main greeting</option>
                          {realExts.map(e=><option key={e.id} value={String(e.number)}>{e.name} extension</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="ps-field"><label>SMS status</label>
                      <div className="ps-smsline"><span className={`ov-chip sms ${b.cls}`}>{b.label}</span>{n.sms==='pending' && <span className="ps-smsnote">Finish A2P registration in Settings → SMS compliance.</span>}</div>
                    </div>
                    <div className="ps-editacts"><button className="btn btn-primary sm" onClick={()=>setEditIdx(null)}>Done</button></div>
                  </div>
                )}
              </div>
            );
          })}
          {addNum && (
            <div className="ps-addnum">
              <input className="input" placeholder="Label (e.g. Main)" value={newNum.label} onChange={e=>setNewNum(s=>({...s,label:e.target.value}))}/>
              <input className="input" placeholder="(555) 000-0000" value={newNum.num} onChange={e=>setNewNum(s=>({...s,num:e.target.value}))}/>
              <select className="input" value={newNum.type} onChange={e=>setNewNum(s=>({...s,type:e.target.value}))}><option>Local</option><option>Toll-Free</option></select>
              <button className="btn btn-primary sm" onClick={addNumber}>Add</button>
              <button className="btn btn-ghost sm" onClick={()=>setAddNum(false)}>Cancel</button>
            </div>
          )}
        </div>
      </section>

      {/* 2 · GREETING - Main greeting + After-hours greeting */}
      <section className="sysov-sec">
        <div className="sysov-sec-h"><span className="sysov-sec-ic"><Icon name="audiolines"/></span><h2>Greeting</h2></div>
        <div className="ov-card">
          {mainEdit
            ? <GreetingEditor text={greet} voice={voice} businessName={businessName} suggest={`Thank you for calling ${businessName}. Please hold while we connect your call.`}
                onSave={({text,voice})=>{ setGreet(text); setVoice(voice); setMainEdit(false); }} onCancel={()=>setMainEdit(false)}/>
            : <GreetingSummary text={greet} voice={voice} onEdit={()=>setMainEdit(true)}/>}
          <div className="ov-divider"/>
          <div className="ge-closedrow">
            <span className="ge-closedrow-t"><b>After-hours greeting</b><small>{ah?'A separate message plays when you’re closed.':'Play a different message when you’re closed.'}</small></span>
            {ah && <button className="ov-link" onClick={()=>setAhExpanded(x=>!x)}>{ahExpanded?'Done':'Edit'}</button>}
            <span className={`ov-state ${ah?'on':'off'}`}>{ah?'On':'Off'}</span>
            <button role="switch" aria-checked={ah} className={`toggle${ah?' on':''}`} onClick={()=>{ const nv=!ah; setAh(nv); setAhExpanded(nv); if(!nv) setAhEdit(false); }}/>
          </div>
          {ah && ahExpanded && (
            <div className="ge-closed">
              {ahEdit
                ? <GreetingEditor text={ahGreet} voice={ahVoice} businessName={businessName} suggest={`Thanks for calling ${businessName}. We’re closed right now - please leave a message and we’ll call you back.`}
                    onSave={({text,voice})=>{ setAhGreet(text); setAhVoice(voice); setAhEdit(false); }} onCancel={()=>setAhEdit(false)}/>
                : <GreetingSummary text={ahGreet} voice={ahVoice} onEdit={()=>setAhEdit(true)}/>}
              <div className="ge-subsec">
                <div className="ge-subhead"><span className="ge-blockh">Business hours</span>{!hoursEdit && <button className="ov-link" onClick={()=>setHoursEdit(true)}>Edit</button>}</div>
                {hoursEdit
                  ? <div className="ge-hoursedit"><input className="input" value={hours} onChange={e=>setHours(e.target.value)} autoFocus/><button className="btn btn-primary sm" onClick={()=>setHoursEdit(false)}>Save</button></div>
                  : <div className="ge-hours"><Icon name="clock"/> {hours}</div>}
              </div>
              <div className="ge-subsec">
                <div className="ge-blockh">Holiday &amp; away closures</div>
                {holidays.length>0 && (
                  <div className="ps-dests">
                    {holidays.map((h,i)=>(<div className="ps-dest" key={i}><span className="ov-fwd-ic"><Icon name="calendar"/></span><div className="ov-fwd-t"><b>{h.name}</b><span className="ps-destmeta"><span className="ps-pill">{h.date}</span></span></div><button className="ps-x" onClick={()=>setHolidays(l=>l.filter((_,x)=>x!==i))}><Icon name="trash"/></button></div>))}
                  </div>
                )}
                <div className="ge-quickclose">
                  <span className="ge-quickclose-l">Close the office:</span>
                  <button onClick={()=>setHolidays(l=>[...l,{name:'Closed today',date:'Today'}])}>Away today</button>
                  <button onClick={()=>setHolidays(l=>[...l,{name:'Closed tomorrow',date:'Tomorrow'}])}>Away tomorrow</button>
                  <button className="prim" onClick={()=>setHolidayDrawer(true)}><Icon name="plus"/> Custom closure…</button>
                </div>
              </div>
              <div className="ge-tip"><Icon name="info"/><div><b>Tip · </b>Point urgent after-hours callers to an emergency extension - “If this is an emergency, press 8.” <button className="ps-inlinelink" onClick={()=>onGo('extensions')}>Create emergency extension</button></div></div>
            </div>
          )}
        </div>
      </section>

      {/* 3 · CALL FORWARDING & EXTENSIONS - real RoutingPanel / VoicemailPanel / NotificationsPanel */}
      <section className="sysov-sec">
        <div className="sysov-sec-h"><span className="sysov-sec-ic"><Icon name="route"/></span><h2>{simple?'Call forwarding':'Call forwarding & extensions'}</h2>
          {!simple && <button className="ov-act" onClick={()=>onGo('extensions')}><Icon name="plus"/> Add extension</button>}</div>
        {simple ? (
          (opExt && extStates[opExt.id]) ? (
            <div className="ps-extpanels">
              <RoutingPanel ext={{...extStates[opExt.id], name:businessName, tts:businessName}} patch={p=>patchExt(opExt.id,p)} onToggle={did=>toggleDest(opExt.id,did)} onScreening={did=>screenDest(opExt.id,did)} onMove={(did,dir)=>moveDest(opExt.id,did,dir)} onEdit={d=>setDestModal({extId:opExt.id,editing:d})} onRemove={did=>removeDest(opExt.id,did)} openAddDest={()=>setDestModal({extId:opExt.id})}/>
              <VoicemailPanel ext={{...extStates[opExt.id], name:businessName}} patch={p=>patchExt(opExt.id,p)} goForwarding={()=>{}} goHours={()=>{}}/>
              <NotificationsPanel ext={{...extStates[opExt.id], name:businessName}} setNotif={(ev,k,v)=>setNotifField(opExt.id,ev,k,v)} setSlackChannel={v=>setSlackCh(opExt.id,v)}/>
            </div>
          ) : <div className="ov-card"><div className="empty-inline" style={{padding:'18px'}}>No extension configured.</div></div>
        ) : (
          <div className="ov-card flush">
            {realExts.map(e=>{ const es=extStates[e.id]; const open=exp===e.id; const active=es.destinations.filter(d=>d.enabled).length;
              return (
                <div className={`ps-ext${open?' open':''}`} key={e.id}>
                  <button className="ps-exthead" onClick={()=>setExp(open?null:e.id)}>
                    <span className="ov-extnum sm">{e.number}</span>
                    <span className="ov-ext-main"><b>{e.name}</b><span className="ov-ext-sub">{e.status==='disabled'?'Disabled':`${active} destination${active!==1?'s':''} · ${es.routing==='all'?'Ring all at once':'Ring one at a time'}`}</span></span>
                    <span className={`ov-state ${e.status==='disabled'?'off':'on'}`}>{e.status==='disabled'?'Disabled':'Active'}</span>
                    <Icon name="chevdown" style={{transform:open?'rotate(180deg)':'none',transition:'transform .18s'}}/>
                  </button>
                  {open && <div className="ps-extbody ps-extpanels">
                    <RoutingPanel ext={es} patch={p=>patchExt(e.id,p)} onToggle={did=>toggleDest(e.id,did)} onScreening={did=>screenDest(e.id,did)} onMove={(did,dir)=>moveDest(e.id,did,dir)} onEdit={d=>setDestModal({extId:e.id,editing:d})} onRemove={did=>removeDest(e.id,did)} openAddDest={()=>setDestModal({extId:e.id})}/>
                    <VoicemailPanel ext={es} patch={p=>patchExt(e.id,p)} goForwarding={()=>{}} goHours={()=>{}}/>
                    <NotificationsPanel ext={es} setNotif={(ev,k,v)=>setNotifField(e.id,ev,k,v)} setSlackChannel={v=>setSlackCh(e.id,v)}/>
                  </div>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* QUICK ACTIONS */}
      <section className="sysov-sec">
        <div className="sysov-sec-h"><span className="sysov-sec-ic"><Icon name="sliders"/></span><h2>Quick actions</h2></div>
        <p className="sysov-sec-note">Temporarily change what callers experience - no digging through settings.</p>
        <div className="ov3-actiongrid">
          {QA.map(a=>(
            <button key={a.id} className={`ov3-action${activeMode===a.id?' on':''}`} onClick={()=>setTask(a.id)}>
              <span className="ov3-action-ic"><Icon name={a.icon}/></span><span className="ov3-action-t">{a.label}</span>
              {activeMode===a.id ? <span className="ov3-action-on">On</span> : <Icon name="chevright"/>}
            </button>
          ))}
        </div>
      </section>

      {destModal && DestinationModal && <DestinationModal editing={destModal.editing} extName={(extStates[destModal.extId]||{}).name} onClose={()=>setDestModal(null)} onSave={d=>{ saveDest(destModal.extId,d); setDestModal(null); }}/>}

      {holidayDrawer && <HolidayDrawer onSave={(c)=>setHolidays(l=>[...l,{name:c.name,date:c.date}])} onClose={()=>setHolidayDrawer(false)}/>}

      {release!=null && nums[release] && <ReleaseFlow n={nums[release]} onClose={()=>setRelease(null)} onConfirm={()=>{ setNums(l=>l.filter((_,i)=>i!==release)); setRelease(null); setEditIdx(null); }}/>}

      {port!=null && nums[port] && (
        <Modal title="Port out number" icon="forward" desc={nums[port].num} onClose={()=>setPort(null)}
          footer={<React.Fragment><button className="btn btn-ghost sm" onClick={()=>setPort(null)}>Cancel</button><button className="btn btn-primary sm" onClick={()=>setPort(null)}>Start port-out</button></React.Fragment>}>
          <p className="ov3-tasklead">Move {nums[port].num} to another carrier. We’ll generate a port-out PIN and your account details, then your new carrier completes the transfer.</p>
          <p className="ov3-tasknote">The number keeps working on AnyPhone until the port finishes - typically 1–10 business days.</p>
        </Modal>
      )}

      {task && (()=>{ const a=QA.find(q=>q.id===task); return (
        <Modal title={a.label} icon={a.icon} onClose={()=>setTask(null)}
          footer={<React.Fragment><button className="btn btn-ghost sm" onClick={()=>setTask(null)}>Cancel</button><button className="btn btn-primary sm" onClick={()=>{ setActiveMode(a.id); setTask(null); }}>Turn on {a.label.toLowerCase()}</button></React.Fragment>}>
          <p className="ov3-tasklead">{a.desc}</p>
          <p className="ov3-tasknote">Switch this off anytime from the banner at the top of this page. Your normal routing stays saved.</p>
        </Modal>
      ); })()}
    </div>
  );
}

Object.assign(window, { SystemOverviewV3 });
