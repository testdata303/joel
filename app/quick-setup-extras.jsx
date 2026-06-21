/* ============================================================
   JOEL app - Quick Setup extras: SMS Registration + Integrations
   ============================================================ */
const { useState: QX_useState } = React;
const QXIcon = window.Icon;
const QXToggle = window.Toggle;

/* ---------- SMS Registration ---------- */
function SmsRegistration({ onDone }){
  const [dismissed,setDismissed]=QX_useState(false);
  const [biz,setBiz]=QX_useState({ name:'Smilebar', ein:'', website:'smilebar.co', email:'bob@smilebar.co' });
  const [sample,setSample]=QX_useState('Hi! This is Smilebar confirming your appointment on Friday at 2 PM. Reply C to confirm or R to reschedule.');
  const [optin,setOptin]=QX_useState({ website:true, keypad:true, paper:false });
  const set=(p)=>setBiz(b=>({...b,...p}));
  const ready = biz.name && biz.ein && biz.website && [optin.website,optin.keypad,optin.paper].some(Boolean) && sample.trim();

  if(dismissed){
    return (
      <div className="qx">
        <div className="qx-dismissed">
          <span className="qx-dismissed-ic"><QXIcon name="message"/></span>
          <h2>No rush - you can finish this later</h2>
          <p>Your number already <b>receives</b> texts. When you’re ready to <b>send</b>, complete registration under <b>Settings → Numbers</b>.</p>
          <button className="btn btn-secondary" onClick={()=>setDismissed(false)}><QXIcon name="arrowleft"/> Back to registration</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qx">
      <div className="qx-head">
        <button className="qx-dismiss" onClick={()=>setDismissed(true)}>I’ll do this later</button>
        <span className="qx-eyebrow"><QXIcon name="message"/> Texting · one-time setup</span>
        <h1>Register your number for texting</h1>
        <p>US carriers require a quick, one-time registration before your business can <b>send</b> texts. You can already <b>receive</b> them. Approval usually takes 1–3 business days.</p>
      </div>

      <div className="qx-status">
        <div className="qx-status-row"><span className="qx-st-ic ok"><QXIcon name="check" sw={3}/></span><div><b>Receiving texts</b><span>Active now on (617) 555-0100</span></div></div>
        <div className="qx-status-row"><span className="qx-st-ic wait"><QXIcon name="clock"/></span><div><b>Sending texts</b><span>Needs registration - complete the form below</span></div></div>
      </div>

      <section className="qx-card">
        <h2 className="qx-h2">Business details</h2>
        <p className="qx-sub">Carriers match this against public records, so use your registered business info.</p>
        <div className="qx-grid">
          <label className="qx-field"><span>Legal business name</span><input className="qx-in" value={biz.name} onChange={e=>set({name:e.target.value})}/></label>
          <label className="qx-field"><span>EIN / Tax ID</span><input className="qx-in" value={biz.ein} placeholder="12-3456789" onChange={e=>set({ein:e.target.value})}/></label>
          <label className="qx-field"><span>Website</span><input className="qx-in" value={biz.website} onChange={e=>set({website:e.target.value})}/></label>
          <label className="qx-field"><span>Contact email</span><input className="qx-in" value={biz.email} onChange={e=>set({email:e.target.value})}/></label>
        </div>
      </section>

      <section className="qx-card">
        <h2 className="qx-h2">How customers opt in</h2>
        <p className="qx-sub">Tell carriers how people agree to be texted. Pick all that apply.</p>
        <div className="qx-opts">
          {[['website','Website form','A checkbox on your booking or contact form'],['keypad','On a call','“Press 1 to get appointment texts”'],['paper','In person / paper','A form they sign at the front desk']].map(([k,l,d])=>(
            <button key={k} className={`qx-opt${optin[k]?' on':''}`} onClick={()=>setOptin(o=>({...o,[k]:!o[k]}))}>
              <span className="qx-opt-chk"><QXIcon name="check" sw={3}/></span>
              <div><b>{l}</b><span>{d}</span></div>
            </button>
          ))}
        </div>
      </section>

      <section className="qx-card">
        <h2 className="qx-h2">Sample message</h2>
        <p className="qx-sub">One example of a text you’ll send. This is reviewed by the carrier.</p>
        <textarea className="qx-area" value={sample} onChange={e=>setSample(e.target.value)} rows={3}/>
        <div className="qx-note"><QXIcon name="info"/><span>Include your business name and a way to opt out (e.g. “Reply STOP to unsubscribe”) for faster approval.</span></div>
      </section>

      <div className="qx-footer">
        <span className="qx-foot-t">{ready?'Looks good - we’ll submit this to the carrier.':'Fill in the required details to submit.'}</span>
        <button className="btn btn-primary" disabled={!ready} style={ready?null:{opacity:.5,pointerEvents:'none'}} onClick={onDone}>Submit registration</button>
      </div>
    </div>
  );
}

/* ---------- Slack ---------- */
const QX_SLACK_FEEDS = [
  { id:'voicemails', icon:'voicemail', label:'Voicemails', desc:'Every new voicemail, with transcript & summary.', def:'#voicemails' },
  { id:'missed', icon:'phone', label:'Missed calls', desc:'Get pinged the moment a call goes unanswered.', def:'#missed-calls' },
  { id:'inbox', icon:'message', label:'Text inbox', desc:'New SMS conversations, ready to claim.', def:'#customer-texts' },
];
/* a channel picker - channels come from the connected Slack workspace */
function QXChannel({ value, channels, onChange }){
  return (
    <span className="qx-chansel">
      <QXIcon name="slack"/>
      <select value={value} onChange={e=>onChange(e.target.value)}>
        {channels.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
      <QXIcon name="chevdown"/>
    </span>
  );
}
function IntegrationsScreen({ extensions }){
  const [dismissed,setDismissed]=QX_useState(false);
  const [connected,setConnected]=QX_useState(false);
  const existing=['#general','#customer-texts','#front-desk','#sales-team','#support','#voicemails','#missed-calls'];
  // customer texts hit the shared inbox → one channel
  const [texts,setTexts]=QX_useState({ on:true, channel:'#customer-texts' });
  // missed calls & voicemails route per extension - each event gets its own channel & on/off
  const slkExts=(extensions||[]).filter(e=>e.number!==0);
  const [extNotif,setExtNotif]=QX_useState(()=> (extensions||[]).filter(e=>e.number!==0).reduce((m,e)=>{
    const slug='#'+String(e.name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    const base = (e.vm&&e.vm.slack&&existing.includes(e.vm.slack)) ? e.vm.slack
               : existing.includes(slug) ? slug
               : '#front-desk';
    m[e.id]={ missed:{on:true,channel:base}, vm:{on:true,channel:base} };
    return m;
  },{}));
  const setEv=(id,ev,p)=>setExtNotif(m=>({...m,[id]:{...m[id],[ev]:{...m[id][ev],...p}}}));
  const prevExt=slkExts.find(e=>String(e.number)==='1')||slkExts[0];
  const prevCh=(prevExt&&extNotif[prevExt.id])?extNotif[prevExt.id].vm.channel:'#voicemails';

  if(dismissed){
    return (
      <div className="qx">
        <div className="qx-dismissed">
          <span className="qx-dismissed-ic slack"><QXIcon name="slack"/></span>
          <h2>No problem - Slack is always here</h2>
          <p>You can connect your workspace anytime under <b>Settings → Slack connect</b>.</p>
          <button className="btn btn-secondary" onClick={()=>setDismissed(false)}><QXIcon name="arrowleft"/> Back to Slack</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qx">
      <div className="qx-head">
        {!connected && <button className="qx-dismiss" onClick={()=>setDismissed(true)}>Not now</button>}
        <span className="qx-eyebrow"><QXIcon name="slack"/> Notifications in Slack</span>
        <h1>Never miss a customer text</h1>
        <p>Get a Slack notification the instant a customer texts - plus missed calls and voicemails - posted straight into the channels your team already watches. No extra app to check.</p>
      </div>

      {!connected ? (
        <div className="qx-slackconnect">
          <span className="qx-slack-logo"><QXIcon name="slack"/></span>
          <b>Get notified the moment a customer texts</b>
          <p>JOEL posts every new customer message into Slack in real time - so you can reply fast and never leave one waiting. Missed calls and voicemails land there too.</p>
          <div className="qx-slackwhat">
            {[['message','New texts','the moment a customer messages'],['phone','Missed calls','the moment they happen'],['voicemail','Voicemails','with transcript & summary']].map(([ic,t,d])=>(
              <div className="qx-slackwhat-it" key={t}>
                <span className={`qx-feed-ic ${t==='Voicemails'?'voicemails':t==='Missed calls'?'missed':'inbox'}`}><QXIcon name={ic}/></span>
                <b>{t}</b><span>{d}</span>
              </div>
            ))}
          </div>
          <button className="qx-slackbtn" onClick={()=>setConnected(true)}><QXIcon name="slack"/> Add to Slack</button>
          <span className="qx-slack-fine">Takes about 30 seconds. We’ll create the channels for you - or you can pick your own.</span>
        </div>
      ) : (
        <React.Fragment>
          <div className="qx-slackok">
            <span className="qx-st-ic ok"><QXIcon name="check" sw={3}/></span>
            <div className="qx-slackok-t"><b>Connected to Smilebar HQ</b><span>Posting as JOEL · connected by Bob Stevens</span></div>
          </div>

          <section className="qx-card">
            <h2 className="qx-h2">Customer texts</h2>
            <p className="qx-sub">New SMS conversations land in your shared inbox. Post them to a channel so anyone can claim and reply fast.</p>
            <div className="qx-feeds">
              <div className={`qx-feed${texts.on?'':' off'}`}>
                <span className="qx-feed-ic inbox"><QXIcon name="message"/></span>
                <div className="qx-feed-t"><b>New text messages</b><span>Every new customer conversation, ready to claim.</span></div>
                <div className="qx-feed-r">
                  <QXChannel value={texts.channel} channels={existing} onChange={c=>setTexts(t=>({...t,channel:c}))}/>
                  <QXToggle on={texts.on} onChange={v=>setTexts(t=>({...t,on:v}))}/>
                </div>
              </div>
            </div>
          </section>

          <section className="qx-card">
            <h2 className="qx-h2">Missed calls &amp; voicemails</h2>
            <p className="qx-sub">Route each extension to the channel its team watches. Missed calls and voicemails can go to different channels - switch off either one anytime.</p>
            <div className="slk-extstack">
              {slkExts.map(e=>{ const st=extNotif[e.id]; return (
                <div className="slk-extcard" key={e.id}>
                  <div className="slk-extcard-h">
                    <span className="slk-extnum">{e.number}</span>
                    <b>{e.name}</b>
                  </div>
                  <div className="slk-evrows">
                    <div className={`slk-evrow${st.missed.on?'':' off'}`}>
                      <span className="slk-ev-ic missed"><QXIcon name="phone"/></span>
                      <span className="slk-ev-l">Missed calls</span>
                      <QXChannel value={st.missed.channel} channels={existing} onChange={c=>setEv(e.id,'missed',{channel:c})}/>
                      <QXToggle on={st.missed.on} onChange={v=>setEv(e.id,'missed',{on:v})}/>
                    </div>
                    <div className={`slk-evrow${st.vm.on?'':' off'}`}>
                      <span className="slk-ev-ic vm"><QXIcon name="voicemail"/></span>
                      <span className="slk-ev-l">Voicemails</span>
                      <QXChannel value={st.vm.channel} channels={existing} onChange={c=>setEv(e.id,'vm',{channel:c})}/>
                      <QXToggle on={st.vm.on} onChange={v=>setEv(e.id,'vm',{on:v})}/>
                    </div>
                  </div>
                </div>
              );})}
            </div>
            <div className="slk-chanhelp">
              <QXIcon name="info"/>
              <span>Channels come from your connected Slack workspace. Don’t see the one you want? <button className="qx-inline-link">Add a channel in Slack</button> and it’ll show up here.</span>
            </div>
          </section>

          <div className="qx-slackprev2">
            <div className="qx-sp2-h"><QXIcon name="slack"/> {prevCh}</div>
            <div className="qx-sp2-msg"><span className="qx-sp2-bot">JOEL</span><div><b>New voicemail · Ext 1 Sales</b><p>Daniel Okafor (415) 555-0182 - “Hi, calling about scheduling a cleaning…” <b className="qx-sp2-sum">Summary:</b> Wants to book a cleaning this week.</p><span className="qx-sp2-btns"><span className="qx-sp2-b">▶ Play</span><span className="qx-sp2-b">Call back</span></span></div></div>
          </div>

          <div className="qx-offrow">
            <span>Connected to Smilebar HQ Slack workspace.</span>
            <button className="qx-offlink" onClick={()=>setConnected(false)}>Disconnect Slack</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { SmsRegistration, IntegrationsScreen });
