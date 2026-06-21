/* ============================================================
   JOEL app - WhatsApp
   1) Onboarding step (Quick Setup, after Slack): enable WhatsApp on
      the business number. Messages land in the Inbox AND the owner's
      WhatsApp app.
   2) WhatsAppManage: the same controls, surfaced in Settings →
      Integrations for anyone who dismissed the setup step.
   ============================================================ */
const { useState: WA_useState } = React;
const WAIcon = window.Icon;
const WAToggle = window.Toggle;

const WA_BIZ_NUMBER = '(617) 555-0100';

/* what arrives, shown on both the onboarding hero and the manage card */
const WA_BENEFITS = [
  { ic:'whatsapp', t:'Customers message your number on WhatsApp', d:'They start a WhatsApp chat with your business number - nothing new for them to install.' },
  { ic:'inbox',    t:'It all lands in your text inbox', d:'WhatsApp chats sit right next to your SMS - one inbox to keep an eye on.' },
  { ic:'users',    t:'Reply & assign from JOEL', d:'Answer from your JOEL number, hand off to a teammate, and resolve together.' },
];

/* the routing story: a WhatsApp message lands in the same text inbox as SMS */
function WAFlow(){
  return (
    <div className="wa-flow">
      <div className="wa-flow-node cust">
        <span className="wa-flow-ic"><WAIcon name="user"/></span>
        <b>Customer</b><span>Messages on WhatsApp</span>
      </div>
      <div className="wa-flow-arrow"><WAIcon name="chevright"/></div>
      <div className="wa-flow-node biz">
        <span className="wa-flow-ic wa"><WAIcon name="whatsapp"/></span>
        <b>Your JOEL number</b><span>{WA_BIZ_NUMBER}</span>
      </div>
      <div className="wa-flow-arrow"><WAIcon name="chevright"/></div>
      <div className="wa-flow-node dest">
        <span className="wa-flow-ic"><WAIcon name="inbox"/></span>
        <b>Your text inbox</b><span>Reply · assign · resolve</span>
      </div>
    </div>
  );
}

/* mini inbox preview - a green WhatsApp conversation sitting next to a blue SMS one */
function WAInboxPreview(){
  return (
    <div className="wa-prev">
      <div className="wa-prev-h"><WAIcon name="inbox"/> Inbox</div>
      <div className="wa-prev-row wa">
        <span className="wa-prev-av wa">RM</span>
        <div className="wa-prev-main">
          <div className="wa-prev-top"><b>Rosa Méndez</b><span className="wa-prev-chip wa"><WAIcon name="whatsapp"/> WhatsApp</span><span className="wa-prev-time">9:41 AM</span></div>
          <p>Hi! Do you have any openings this Saturday?</p>
        </div>
      </div>
      <div className="wa-prev-row">
        <span className="wa-prev-av">DK</span>
        <div className="wa-prev-main">
          <div className="wa-prev-top"><b>Daniel Okafor</b><span className="wa-prev-chip"><WAIcon name="message"/> SMS</span><span className="wa-prev-time">9:12 AM</span></div>
          <p>Can I confirm my cleaning for Friday at 2pm?</p>
        </div>
      </div>
    </div>
  );
}

/* a Slack channel picker - channels come from the connected workspace */
function WAChannel({ value, onChange }){
  const channels=['#customer-texts','#general','#front-desk','#sales-team','#support','#whatsapp'];
  return (
    <span className="wa-chansel">
      <WAIcon name="slack"/>
      <select value={value} onChange={e=>onChange(e.target.value)}>{channels.map(c=><option key={c} value={c}>{c}</option>)}</select>
      <WAIcon name="chevdown"/>
    </span>
  );
}
function WAEmails({ items, onChange }){
  const [v,setV] = WA_useState('');
  const ok=/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
  const add=()=>{ if(!ok || items.includes(v.trim())){ setV(''); return; } onChange([...items,v.trim()]); setV(''); };
  return (
    <div className="wa-emails-ed">
      {items.map(e=>(<span className="wa-emchip" key={e}>{e}<button onClick={()=>onChange(items.filter(x=>x!==e))} aria-label="Remove"><WAIcon name="x"/></button></span>))}
      <input className="wa-eminput" value={v} placeholder="name@company.com" onChange={e=>setV(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); add(); } }}/>
      <button className="wa-emadd" disabled={!ok} style={!ok?{opacity:.45,pointerEvents:'none'}:null} onClick={add}><WAIcon name="plus"/> Add</button>
    </div>
  );
}

/* the shared enable/manage body - used inline by both surfaces */
function WAControls({ enabled, onToggle, number }){
  const [notif,setNotif] = WA_useState({ slack:{on:true,channel:'#customer-texts'}, email:['team@smilebar.co'], app:true });
  return (
    <React.Fragment>
      <div className="wa-ok">
        <span className="qx-st-ic ok"><WAIcon name="check" sw={3}/></span>
        <div className="wa-ok-t">
          <b>WhatsApp is on for {number}</b>
          <span>Customers can message this number on WhatsApp right now.</span>
        </div>
      </div>

      <WAFlow/>

      <section className="qx-card">
        <h2 className="qx-h2">WhatsApp lives in your text inbox</h2>
        <p className="qx-sub">Your JOEL number can accept and reply to WhatsApp Business messages. Every chat arrives in the same inbox as your texts - there’s no separate app to check.</p>
        <div className="wa-points">
          <div className="wa-point">
            <span className="wa-dest-ic inbox"><WAIcon name="inbox"/></span>
            <div className="wa-dest-t"><b>One inbox for texts &amp; WhatsApp</b><span>WhatsApp chats show up green with a WhatsApp tag, right beside your SMS conversations.</span></div>
          </div>
          <div className="wa-point">
            <span className="wa-dest-ic wa"><WAIcon name="whatsapp"/></span>
            <div className="wa-dest-t"><b>Reply from your JOEL number</b><span>Answer on the same business number - no personal WhatsApp account, no new number to share.</span></div>
          </div>
          <div className="wa-point">
            <span className="wa-dest-ic team"><WAIcon name="users"/></span>
            <div className="wa-dest-t"><b>Assign &amp; resolve with your team</b><span>Hand a conversation to a teammate, add a note, and close it out together.</span></div>
          </div>
        </div>
      </section>

      <section className="qx-card">
        <h2 className="qx-h2">When a new WhatsApp message comes in</h2>
        <p className="qx-sub">WhatsApp chats share your text inbox, but you can alert your team independently from SMS - pick a Slack channel, email, or push.</p>
        <div className="wa-notif">
          <div className={`wa-notif-row${notif.slack.on?'':' off'}`}>
            <span className="wa-notif-ic slack"><WAIcon name="slack"/></span>
            <div className="wa-dest-t"><b>Post to Slack</b><span>Drop each new WhatsApp chat into a channel your team watches.</span></div>
            <div className="wa-notif-r">
              <WAChannel value={notif.slack.channel} onChange={c=>setNotif(n=>({...n,slack:{...n.slack,channel:c}}))}/>
              <WAToggle on={notif.slack.on} onChange={v=>setNotif(n=>({...n,slack:{...n.slack,on:v}}))}/>
            </div>
          </div>
          <div className="wa-notif-row col">
            <div className="wa-notif-top">
              <span className="wa-notif-ic mail"><WAIcon name="mail"/></span>
              <div className="wa-dest-t"><b>Email these people</b><span>Send an email when a new WhatsApp conversation starts.</span></div>
            </div>
            <WAEmails items={notif.email} onChange={v=>setNotif(n=>({...n,email:v}))}/>
          </div>
          <div className={`wa-notif-row${notif.app?'':' off'}`}>
            <span className="wa-notif-ic app"><WAIcon name="appbell"/></span>
            <div className="wa-dest-t"><b>Push to the JOEL app</b><span>Whoever’s assigned gets a push notification on their phone.</span></div>
            <div className="wa-notif-r"><WAToggle on={notif.app} onChange={v=>setNotif(n=>({...n,app:v}))}/></div>
          </div>
        </div>
        <p className="wa-notif-foot"><WAIcon name="info"/> Don’t see your channel? Channels come from your connected Slack workspace - add one in Slack and it’ll appear here.</p>
      </section>

      <WAInboxPreview/>

      <div className="wa-offrow">
        <span>WhatsApp is connected to {number}.</span>
        <button className="wa-offlink" onClick={()=>onToggle(false)}>Turn off WhatsApp</button>
      </div>
    </React.Fragment>
  );
}

/* ---------- Onboarding step (Quick Setup) ---------- */
function WhatsAppOnboarding({ onDone }){
  const [dismissed,setDismissed] = WA_useState(false);
  const [enabled,setEnabled] = WA_useState(false);
  const number = WA_BIZ_NUMBER;

  if(dismissed){
    return (
      <div className="qx">
        <div className="qx-dismissed">
          <span className="qx-dismissed-ic wa"><WAIcon name="whatsapp"/></span>
          <h2>No problem - you can turn this on later</h2>
          <p>Enable WhatsApp anytime under <b>Settings → Integrations</b>. Until then, customers can still call and text {number} as usual.</p>
          <button className="btn btn-secondary" onClick={()=>setDismissed(false)}><WAIcon name="arrowleft"/> Back to WhatsApp</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qx">
      <div className="qx-head">
        {!enabled && <button className="qx-dismiss" onClick={()=>setDismissed(true)}>Not now</button>}
        <span className="qx-eyebrow"><WAIcon name="whatsapp"/> Works with WhatsApp</span>
        <h1>Enable WhatsApp</h1>
        <p>Let customers message this business number on WhatsApp. WhatsApp conversations will appear in your Inbox - reply, assign, and resolve them right alongside your texts.</p>
      </div>

      {!enabled ? (
        <div className="wa-connect">
          <span className="wa-connect-logo"><WAIcon name="whatsapp"/></span>
          <b>Turn on WhatsApp for {number}</b>
          <p>One business number for calls, texts, and WhatsApp. We verify it with WhatsApp for you - no new number to share.</p>
          <div className="wa-what">
            {WA_BENEFITS.map(b=>(
              <div className="wa-what-it" key={b.t}>
                <span className="wa-what-ic"><WAIcon name={b.ic}/></span>
                <b>{b.t}</b><span>{b.d}</span>
              </div>
            ))}
          </div>
          <button className="wa-enablebtn" onClick={()=>setEnabled(true)}><WAIcon name="whatsapp"/> Enable WhatsApp</button>
          <span className="wa-fine">Takes about a minute. You can turn it off anytime.</span>
        </div>
      ) : (
        <WAControls enabled={enabled} onToggle={setEnabled} number={number}/>
      )}

      {enabled && (
        <div className="qx-footer">
          <span className="qx-foot-t">WhatsApp is live - new chats will show in your Inbox.</span>
          <button className="btn btn-primary" onClick={onDone}>Go to Inbox <WAIcon name="chevright"/></button>
        </div>
      )}
    </div>
  );
}

/* ---------- Settings → Integrations management block ---------- */
function WhatsAppManage(){
  const [enabled,setEnabled] = WA_useState(true);
  const number = WA_BIZ_NUMBER;
  return (
    <div className="wa-manage">
      {enabled ? (
        <WAControls enabled={enabled} onToggle={setEnabled} number={number}/>
      ) : (
        <div className="wa-connect compact">
          <span className="wa-connect-logo"><WAIcon name="whatsapp"/></span>
          <b>WhatsApp is off</b>
          <p>Turn it on to let customers message {number} on WhatsApp. Conversations appear in your Inbox.</p>
          <button className="wa-enablebtn" onClick={()=>setEnabled(true)}><WAIcon name="whatsapp"/> Enable WhatsApp</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Notifications: WhatsApp recipient + phone verification ----------
   Like the SMS/text recipient editor, but a number must be verified with a
   6-digit code (sent over WhatsApp) before it can receive notifications. */
function WAVerifyEditor({ ev, items, setNotif }){
  const norm = (items||[]).map(it=> typeof it==='string' ? {addr:it, verified:true} : it);
  const [val,setVal] = WA_useState('');
  const [pending,setPending] = WA_useState(null);   // {addr, code}
  const [code,setCode] = WA_useState('');
  const [err,setErr] = WA_useState(false);

  const startVerify = ()=>{
    const v = val.trim();
    if(!v || norm.some(x=>x.addr===v)) { setVal(''); return; }
    const gen = String(Math.floor(100000 + Math.random()*900000));
    setPending({ addr:v, code:gen });
    setCode(''); setErr(false); setVal('');
  };
  const confirm = ()=>{
    if(code.trim()===pending.code || code.trim().length===6){
      setNotif(ev,'whatsappTo',[...norm,{addr:pending.addr, verified:true}]);
      setPending(null); setCode(''); setErr(false);
    } else { setErr(true); }
  };
  const remove = (a)=> setNotif(ev,'whatsappTo', norm.filter(x=>x.addr!==a));

  return (
    <div className="nsub-field">
      <label>Send to these WhatsApp numbers</label>
      <p className="help" style={{margin:'0 0 10px'}}>Each number must be verified once with a code we send over WhatsApp before it can receive {ev==='missed'?'missed-call':'voicemail'} alerts.</p>
      <div className="wa-verify">
        {norm.length===0 && !pending && <span className="wa-verify-empty">No WhatsApp numbers added yet.</span>}
        {norm.map(r=>(
          <div className="wa-vrow" key={r.addr}>
            <span className="wa-vrow-ic"><WAIcon name="whatsapp"/></span>
            <div className="wa-vrow-t"><b>{r.addr}</b><span>Receives alerts on WhatsApp</span></div>
            <span className="wa-vrow-status"><WAIcon name="check" sw={3}/> Verified</span>
            <button className="wa-vrow-x" onClick={()=>remove(r.addr)} aria-label={`Remove ${r.addr}`}><WAIcon name="x"/></button>
          </div>
        ))}

        {pending ? (
          <div className="wa-vrow pending" style={{flexWrap:'wrap'}}>
            <span className="wa-vrow-ic"><WAIcon name="whatsapp"/></span>
            <div className="wa-vrow-t"><b>{pending.addr}</b><span>Awaiting verification</span></div>
            <button className="wa-vrow-x" onClick={()=>{setPending(null);setErr(false);}} aria-label="Cancel"><WAIcon name="x"/></button>
            <div className="wa-codebox" style={{flexBasis:'100%'}}>
              <div className="wa-codebox-h">
                <WAIcon name="whatsapp"/>
                <span>We sent a 6-digit code over WhatsApp to <b>{pending.addr}</b>. Enter it to confirm the number belongs to you.</span>
              </div>
              <div className="wa-coderow">
                <input className={`input wa-codein${err?' err':''}`} inputMode="numeric" maxLength={6} placeholder="••••••"
                  value={code} onChange={e=>{ setCode(e.target.value.replace(/\D/g,'').slice(0,6)); setErr(false); }}
                  onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); confirm(); } }}/>
                <button className="wa-enablebtn" style={{padding:'10px 18px',fontSize:'.9rem'}} onClick={confirm}>Verify</button>
              </div>
              {err && <div className="wa-code-hint" style={{color:'var(--red)'}}>That code didn’t match. Check the WhatsApp message and try again.</div>}
              <div className="wa-code-hint">Didn’t get it? <button className="wa-code-resend" onClick={()=>{ setCode(''); setErr(false); }}>Resend code</button> <span style={{color:'var(--muted)'}}>· demo code {pending.code}</span></div>
            </div>
          </div>
        ) : (
          <div className="wa-verify-add">
            <input className="input" type="tel" value={val} placeholder="+1 (555) 000-0000"
              onChange={e=>setVal(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); startVerify(); } }}/>
            <button className="btn btn-secondary sm" onClick={startVerify}><WAIcon name="whatsapp"/> Send code</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { WhatsAppOnboarding, WhatsAppManage, WAVerifyEditor });
