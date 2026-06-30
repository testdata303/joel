/* ============================================================
   AnyPhone - Settings sections, part 2: Messaging/compliance + Advanced
   Reuses helpers from settings-sections.jsx (SetDetail/SRow/etc).
   ============================================================ */
const { SetDetail:S2Detail, SRow:S2Row, SStatus:S2Status, SMenu:S2Menu, ListenBtn:S2Listen } = window;
const { Icon:S2Icon, Toggle:S2Toggle, Field:S2Field, Choice:S2Choice, Card:S2Card } = window;
const { useState:s2State } = React;

/* ========================================================== */
/* SMS COMPLIANCE                                             */
/* ========================================================== */
const SMS_STATUS = {
  approved:{ kind:'g', label:'Approved' },
  pending: { kind:'a', label:'In review' },
  none:    { kind:'off', label:'Texting off' },
};
function SmsComplianceSection({ numbers, onBack }){
  const lines = numbers || [];
  return (
    <S2Detail title="SMS compliance" onBack={onBack}
      sub="Before a business number can text, carriers require it to be registered. AnyPhone files the registration for you - you just confirm a few details once.">
      <S2Card icon="building" title="Business details" desc="Used for carrier registration. Shared once, then reused for every number.">
        <S2Row icon="building" title="Registered name" meta="Smilebar LLC" trail={<S2Status kind="g" label="Verified"/>}/>
        <S2Row icon="hashnum" title="Tax ID (EIN)" meta="**-***4471" trail={<S2Status kind="g" label="Verified"/>}/>
        <S2Row icon="route" title="Website" meta="smilebar.co" trail={<S2Status kind="g" label="Verified"/>}/>
        <S2Row icon="message" title="Sample message" meta="“Hi! This is Smilebar confirming your appointment on Friday at 2 PM. Reply C to confirm.”"
          trail={<button className="btn btn-secondary sm"><S2Icon name="pencil"/> Edit</button>}/>
      </S2Card>

      <div className="ss-grouph">Your numbers</div>
      <S2Card flush>
        {lines.map(l=>{
          const st = SMS_STATUS[l.sms||'none'];
          return (
            <S2Row key={l.num} icon="hashnum" title={l.num}
              meta={<>{l.label}<span className="sep">·</span>{l.type}</>}
              trail={<>
                <S2Status kind={st.kind} label={st.label}/>
                {l.sms==='pending' && <button className="btn btn-secondary sm">Check status</button>}
                {!l.sms && <button className="btn btn-primary sm">Enable texting</button>}
              </>}/>
          );
        })}
      </S2Card>
      <p className="ss-foot">Toll-free numbers and local numbers register differently, but AnyPhone handles both. Review usually takes 1–3 business days; calling keeps working the whole time.</p>
    </S2Detail>
  );
}

/* ========================================================== */
/* BLOCKED NUMBERS                                            */
/* ========================================================== */
const SX_BLOCKED = [
  { id:'b1', num:'+1 (844) 555-0188', label:'Robocaller', when:'Blocked May 28' },
  { id:'b2', num:'+1 (305) 555-9921', label:'Spam texts',  when:'Blocked May 14' },
  { id:'b3', num:'+1 (617) 555-7700', label:'',            when:'Blocked Apr 30' },
];
function BlockedSection({ onBack }){
  const [list,setList]=s2State(SX_BLOCKED);
  const [val,setVal]=s2State('');
  const add=()=>{ const v=val.trim(); if(!v) return; setList(l=>[{ id:'b'+Date.now(), num:v.startsWith('+')?v:('+1 '+v), label:'', when:'Blocked just now' },...l]); setVal(''); };
  const remove=(id)=>setList(l=>l.filter(x=>x.id!==id));
  return (
    <S2Detail title="Blocked numbers" onBack={onBack}
      sub="Numbers you’ve blocked can’t call, text, or leave a voicemail. Their past messages and call history stay searchable - blocking only stops anything new.">
      <S2Card flush>
        <div className="ss-row" style={{gap:10}}>
          <span className="ss-ic"><S2Icon name="ban"/></span>
          <div className="input-affix" style={{flex:1}}><span className="pre">+1</span>
            <input value={val} onChange={e=>setVal(e.target.value)} placeholder="(617) 555-0000" onKeyDown={e=>{ if(e.key==='Enter') add(); }}/></div>
          <button className="btn btn-primary sm" disabled={!val.trim()} style={!val.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={add}>Block number</button>
        </div>
        {list.map(b=>(
          <S2Row key={b.id} icon="phoneoff" title={b.num}
            meta={<>{b.label?<>{b.label}<span className="sep">·</span></>:''}{b.when}</>}
            trail={<button className="btn btn-secondary sm" onClick={()=>remove(b.id)}>Unblock</button>}/>
        ))}
        {list.length===0 && (
          <div className="empty"><span className="ei"><S2Icon name="ban"/></span><h4>No blocked numbers</h4><p>Block a number here, or from any call, voicemail, or text conversation.</p></div>
        )}
      </S2Card>
    </S2Detail>
  );
}

/* ========================================================== */
/* DATA RETENTION                                             */
/* ========================================================== */
const RETAIN_OPTS = [
  { v:'90',  l:'90 days' },
  { v:'180', l:'6 months' },
  { v:'365', l:'1 year' },
  { v:'730', l:'2 years' },
  { v:'forever', l:'Keep forever' },
];
function RetentionSection({ onBack }){
  const [rec,setRec]=s2State('365');
  const [vm,setVm]=s2State('365');
  const [sms,setSms]=s2State('730');
  const sel=(v,set)=>(<select className="select" value={v} onChange={e=>set(e.target.value)}>{RETAIN_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}</select>);
  return (
    <S2Detail title="Data retention" onBack={onBack}
      sub="How long AnyPhone keeps your call recordings, voicemails, and messages before clearing them out automatically.">
      <div className="note info" style={{marginBottom:18}}>
        <S2Icon name="info"/>
        <span>When a recording or voicemail reaches its limit, AnyPhone deletes the <b>audio</b> but keeps the <b>transcript, summary, and call details</b>. You keep the searchable history without paying to store the audio forever.</span>
      </div>
      <S2Card flush>
        <S2Row icon="disc" title="Call recordings" meta="Audio of recorded calls." trail={sel(rec,setRec)}/>
        <S2Row icon="voicemail" title="Voicemails" meta="Audio of messages callers leave." trail={sel(vm,setVm)}/>
        <S2Row icon="message" title="Text messages" meta="Conversations in the shared inbox, including photos." trail={sel(sms,setSms)}/>
        <S2Row icon="filetext" iconCls="ai" title="Transcripts & summaries" meta="Kept for the life of the account - these are never auto-deleted."
          trail={<S2Status kind="g" label="Always kept"/>}/>
      </S2Card>
      <p className="ss-foot">If your business is ever under a legal hold, deletion pauses automatically until the hold is lifted - nothing covered by the hold is removed.</p>
    </S2Detail>
  );
}

/* ========================================================== */
/* INTEGRATIONS                                               */
/* ========================================================== */
const SX_HOOKS = [
  { id:'wh1', name:'CRM - new lead', url:'https://hooks.smilebar.co/crm/leads', events:'Voicemail, Missed call', status:'active' },
  { id:'wh2', name:'Reporting pipeline', url:'https://data.smilebar.co/joel', events:'Call completed', status:'attention' },
];
const SX_CHANNELS = [
  { id:'ch1', name:'#front-desk', purpose:'General front-desk activity', used:'Operator, Sales' },
  { id:'ch2', name:'#voicemails', purpose:'New voicemails, all extensions', used:'Sales, Support, Billing' },
  { id:'ch3', name:'#sales-team', purpose:'Sales missed calls & texts', used:'Sales' },
];
function IntegrationsSettingsSection({ onBack }){
  const [hooks,setHooks]=s2State(SX_HOOKS);
  const [channels,setChannels]=s2State(SX_CHANNELS);
  const remove=(id)=>setHooks(h=>h.filter(x=>x.id!==id));
  const removeCh=(id)=>setChannels(c=>c.filter(x=>x.id!==id));
  return (
    <S2Detail title="Integrations" onBack={onBack}
      sub="Send AnyPhone activity to the tools your team already uses. Integrations belong to the business - admins set them up once for everyone.">
      <div className="ss-grouph">Slack</div>
      <S2Card flush>
        <S2Row icon="slack" iconCls="blue" title="Slack workspace" meta={<>Connected to <b style={{color:'var(--ink)'}}>Smilebar HQ</b></>}
          trail={<>
            <S2Status kind="g" label="Connected"/>
            <S2Menu items={[
              { icon:'route', label:'Reconnect workspace' },
              { sep:true },
              { icon:'ban', label:'Disconnect Slack', danger:true },
            ]}/>
          </>}/>
      </S2Card>

      <div className="ss-grouph">WhatsApp</div>
      <window.WhatsAppManage/>
      <p className="ss-foot">When WhatsApp is on, customers can message your business number on WhatsApp and those chats appear in your Inbox, tagged green. Turn it off to stop accepting new WhatsApp messages.</p>

      <div className="ss-grouph">Approved channels</div>
      <div className="note info" style={{marginBottom:14}}>
        <S2Icon name="shield"/>
        <span>Only admins add channels here. Everywhere notifications are set - on an extension or the shared inbox - your team <b>picks from this list</b>. Teammates can’t point AnyPhone at their own channels, so activity only ever flows where you’ve approved it.</span>
      </div>
      <S2Card flush>
        {channels.map(c=>(
          <S2Row key={c.id} icon="slack" title={c.name}
            meta={<>{c.purpose}<span className="sep">·</span>Used by {c.used}</>}
            trail={<S2Menu items={[
              { icon:'pencil', label:'Rename / set purpose' },
              { sep:true },
              { icon:'trash', label:'Remove channel', danger:true, onClick:()=>removeCh(c.id) },
            ]}/>}/>
        ))}
        <button className="add-row"><span className="plus"><S2Icon name="plus"/></span> Add a channel</button>
      </S2Card>
      <p className="ss-foot">Missed calls, voicemails, and new texts post to whichever of these channels you choose, per extension and for the shared inbox.</p>

      <div className="ss-grouph">How teammates get notified</div>
      <S2Card flush>
        <S2Row icon="appbell" iconCls="blue" title="In-app" meta="Everyone with access sees assigned activity in their AnyPhone inbox."
          trail={<S2Status kind="g" label="Always on"/>}/>
        <S2Row icon="mail" title="Email" meta="Each teammate turns their own email alerts on or off."
          trail={<span className="ss-status off"><span className="d m"/>Personal</span>}/>
        <S2Row icon="slack" title="Slack" meta="Shared, admin-curated channels only - AnyPhone never sends Slack DMs to individuals."
          trail={<span className="pill ext">Channels only</span>}/>
      </S2Card>
      <p className="ss-foot">Keeping Slack to shared channels means nothing assigned to a person ever lands in a private DM or an unapproved channel - cleaner for the team and safer for compliance.</p>

      <div className="ss-grouph">Webhooks</div>
      <S2Card flush>
        {hooks.map(h=>(
          <S2Row key={h.id} icon="webhook" title={h.name}
            meta={<>{h.url}<span className="sep">·</span>{h.events}</>}
            trail={<>
              {h.status==='active'
                ? <S2Status kind="g" label="Active"/>
                : <S2Status kind="a" label="Needs attention"/>}
              <S2Menu items={[
                { icon:'pencil', label:'Edit webhook' },
                { icon:'bell', label:'Choose events' },
                h.status==='attention' && { icon:'activity', label:'View recent failures' },
                { sep:true },
                { icon:'trash', label:'Remove', danger:true, onClick:()=>remove(h.id) },
              ]}/>
            </>}/>
        ))}
        <button className="add-row"><span className="plus"><S2Icon name="plus"/></span> Add a webhook</button>
      </S2Card>
      <p className="ss-foot">Webhooks send a small message to a URL you control whenever an event happens. If a webhook keeps failing, AnyPhone flags it as <b>Needs attention</b> and keeps retrying.</p>
    </S2Detail>
  );
}

/* ========================================================== */
/* ADVANCED NUMBER OPTIONS                                    */
/* ========================================================== */
function NumberAdvSection({ numbers, onNav, onBack }){
  const [rec,setRec]=s2State(false);
  const [cid,setCid]=s2State((numbers&&numbers[0]&&numbers[0].num)||'+1 (617) 555-0100');
  const [cnam,setCnam]=s2State('SMILEBAR');
  return (
    <S2Detail title="Advanced number options" onBack={onBack}
      sub="Caller ID, call recording, and number transfers. These apply across your business - most teams set them once and leave them.">
      <S2Card icon="hashnum" title="Outbound caller ID" desc="What people see when your team calls them.">
        <S2Field label="Caller ID name" help="The business name shown on caller ID. Carriers display up to 15 characters, uppercase.">
          <div style={{maxWidth:280}}><input className="input" value={cnam} maxLength={15} onChange={e=>setCnam(e.target.value.toUpperCase())}/></div>
        </S2Field>
        <S2Field label="Default number shown" help="Outbound calls show this number unless a device or extension overrides it.">
          <div style={{maxWidth:320}}>
            <select className="select" value={cid} onChange={e=>setCid(e.target.value)}>
              {(numbers||[]).map(n=><option key={n.num} value={n.num}>{n.num} - {n.label}</option>)}
            </select>
          </div>
        </S2Field>
      </S2Card>

      <S2Card icon="disc" title="Call recording" flush>
        <div className="ss-row">
          <span className="ss-ic"><S2Icon name="disc"/></span>
          <span className="ss-main"><b>Record calls by default</b><span className="ss-meta">Applies to new extensions. Each extension can override this.</span></span>
          <span className="ss-trail"><S2Toggle on={rec} onChange={setRec}/></span>
        </div>
      </S2Card>
      <div className={`note ${rec?'warn':'info'}`} style={{marginTop:-8}}>
        <S2Icon name="info"/>
        <span>{rec
          ? <><b>Recording is on by default.</b> Recording laws vary by state - many require telling callers. Turn on the recording announcement under Advanced greeting options.</>
          : <><b>Off by default - the safe choice.</b> Recording laws vary by state. Turn it on per extension only where you need it.</>}</span>
      </div>

      <div className="ss-grouph">Transfers & porting</div>
      <S2Card flush>
        <S2Row icon="forward" title="Bring a number to AnyPhone" meta="Move an existing business number from another carrier. Calls keep working while it transfers." tappable onClick={()=>onNav&&onNav('numbers')}
          trail={<S2Icon name="chevright" style={{width:16,height:16,color:'var(--muted)'}}/>}/>
        <S2Row icon="hashnum" title="Manage your numbers" meta="Add, route, or remove business numbers." tappable onClick={()=>onNav&&onNav('numbers')}
          trail={<S2Icon name="chevright" style={{width:16,height:16,color:'var(--muted)'}}/>}/>
      </S2Card>
    </S2Detail>
  );
}

Object.assign(window, {
  SmsComplianceSection, BlockedSection, RetentionSection,
  IntegrationsSettingsSection, NumberAdvSection,
});
