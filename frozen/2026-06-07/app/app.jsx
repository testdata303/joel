/* ============================================================
   JOEL app — Extension Detail root + shell + flows
   ============================================================ */
const { Icon, Toggle, Segmented, Choice, Field, Avatar, Card, Modal, Wave,
  GeneralPanel, RoutingPanel, SchedulePanel, VoicemailPanel, NotificationsPanel, RecordingPanel, PermissionsPanel, DangerZone, DEST_META,
  OverviewPanel, ContactDrawer, ActivityScreen, SmsScreen, NumbersScreen, GreetingsScreen,
  SystemOverviewScreen, SystemOverviewV2, SystemOverviewV3, SettingsScreen, ExtensionGreetings, QuickSetup, CallForwardingScreen,
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "detailMode": "Drawer",
  "inlinePlay": true
}/*EDITMODE-END*/;

/* ---------- seed data ---------- */
const SEED = {
  number:1, name:'Sales', tts:'Sales', enabled:true, status:'active',
  businessHours:'Mon–Fri, 9:00 AM – 5:00 PM',
  routing:'one',
  transferExp:'ring',
  officeHours:{ mode:'247', days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM', tz:'Eastern (ET)', away:[] },
  destinations:[
    { id:'d1', type:'phone', number:'+1 (617) 555-1141', label:'My cell',   enabled:true,  screening:true,  schedule:null, ring:30 },
    { id:'d2', type:'app',   user:'Jane Cho',           label:'Jane Cho',  enabled:true,  screening:false, schedule:null, ring:30 },
    { id:'d3', type:'sip',   device:'Front Desk',        label:'Front desk',enabled:true,  screening:false, schedule:'Mon–Fri, 9–5', ring:30 },
  ],
  fallback:'voicemail', forwardTo:'2', fwdCallerId:'business',
  otherExtensions:[ {number:'0',name:'Operator'}, {number:'2',name:'Support'}, {number:'3',name:'Billing'} ],
  voicemail:{ enabled:true, afterHoursOn:true, voice:'Aria', schedule:{ days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM' }, greeting:'Thanks for calling Smilebar Sales. Sorry we missed you — leave a message and we\u2019ll call right back.', afterHours:'You\u2019ve reached Smilebar Sales after hours. Leave a message and we\u2019ll reach out next business day.' },
  notifications:{
    missed:{ email:true, emailTo:['team@smilebar.co'], text:false, textTo:[], slack:true, webhook:false,
      webhookUrl:'', webhookMsg:'{\n  "event": "missed_call",\n  "extension": "{{extension}}",\n  "from": "{{caller_number}}",\n  "at": "{{time}}"\n}' },
    voicemail:{ email:true, emailTo:['team@smilebar.co','bob@smilebar.co'], emailAttach:true, slack:true, webhook:false,
      webhookUrl:'', webhookMsg:'{\n  "event": "voicemail",\n  "extension": "{{extension}}",\n  "from": "{{caller_number}}",\n  "summary": "{{summary}}",\n  "recording_url": "{{recording_url}}"\n}' },
    slackChannel:'#sales-team',
  },
  recording:'inherit', recordingOn:false,
  permissions:[
    { id:'u1', name:'Bob Stevens', email:'bob@smilebar.co', role:'Admin' },
    { id:'u2', name:'Jane Cho', email:'jane@smilebar.co', role:'User', pending:true },
  ],
  contacts:{
    '+1 (415) 555-0182':{
      note:'Husband Marcus is also a patient. Prefers Friday afternoons — call after 3 PM.',
      numbers:[{ id:'p2', number:'+1 (415) 555-0147', label:'Office' }],
      emails:[
        { id:'e1', email:'daniel.okafor@gmail.com', label:'Personal' },
        { id:'e2', email:'daniel@marcusdental.com', label:'Work' },
      ],
    },
    '+1 (978) 555-7745':{ note:'Prefers text over a phone call.', emails:[] },
    '+1 (404) 555-1199':{ note:'', emails:[] },
  },
};

/* ---------- global activity (calls + voicemails + texts, tagged by extension) ---------- */
const ACTIVITY = {
  voicemails:[
    { id:'vm1', ext:1, line:'+1 (617) 555-0100', dir:'in', num:'+1 (415) 555-0182', contact:'Daniel Okafor', cnam:null, when:'Today, 10:24 AM', date:'2026-06-05', ts:1000, dur:'0:38', heard:false,
      preview:'Wants to book a Friday cleaning.', summary:'Daniel wants to book a teeth-cleaning this Friday and is checking whether the practice takes Delta Dental. He asked for a callback to confirm a time.',
      transcript:[
        { at:'0:00', text:'Hey, this is Daniel Okafor. I’m trying to book a teeth-cleaning.' },
        { at:'0:14', text:'Ideally sometime this Friday if you have anything open.' },
        { at:'0:25', text:'Also wanted to check whether you take Delta Dental. Give me a call back, thanks.' },
      ] },
    { id:'vm2', ext:1, line:'+1 (617) 555-0199', dir:'in', num:'+1 (305) 555-3360', contact:null, cnam:null, when:'Yesterday, 4:11 PM', date:'2026-06-04', ts:900, dur:'0:21', heard:false,
      preview:'Wants to move to a morning slot.', summary:'The caller wants to move next week’s appointment from the afternoon to the morning. They asked the office to call back with an available morning time.',
      transcript:[
        { at:'0:00', text:'Hi, calling about my appointment next week.' },
        { at:'0:09', text:'Any chance we can move it to the morning instead of the afternoon? Thank you.' },
      ] },
    { id:'vm3', ext:1, line:'+1 (617) 555-0199', dir:'missed', num:'+1 (978) 555-7745', contact:null, cnam:'Priya Shah', when:'Yesterday, 1:02 PM', date:'2026-06-04', ts:880, dur:'0:54', heard:true,
      preview:'New patient wants a first visit.', summary:'Priya is a new patient referred by a friend who already sees the practice. She’d like a callback to schedule a first visit at any available time.',
      transcript:[
        { at:'0:00', text:'Hi there, my name is Priya. A friend of mine sees you and recommended your office.' },
        { at:'0:18', text:'I’m a new patient and I’d love to set up a first visit.' },
        { at:'0:36', text:'Whenever you get a chance, please call me back at this number. Thanks so much.' },
      ] },
    { id:'vm4', ext:2, line:'+1 (617) 555-0188', dir:'in', num:'+1 (212) 555-7788', contact:null, cnam:'Helena Ruiz', when:'Today, 8:50 AM', date:'2026-06-05', ts:960, dur:'0:31', heard:false,
      preview:'Locked out of the patient app.', summary:'Helena can’t log into the patient app and needs a password reset before her appointment tomorrow morning. She asked someone to call her back to help.',
      transcript:[
        { at:'0:00', text:'Hi, it’s Helena. I can’t log into the patient app.' },
        { at:'0:12', text:'It keeps saying my password is wrong and I have an appointment tomorrow.' },
        { at:'0:22', text:'Could someone reset it for me? Thank you.' },
      ] },
  ],
  calls:[
    { id:'c1', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (415) 555-0182', contact:'Daniel Okafor', cnam:null, when:'Today, 10:24 AM', date:'2026-06-05', ts:1000, dur:'—', outcome:'voicemail', vmId:'vm1' },
    { id:'c2', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez',   cnam:null, when:'Today, 9:48 AM', date:'2026-06-05',  ts:992, dur:'4:12', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria confirmed her Friday cleaning and asked about parking — directed her to the validated lot.", recTranscript:[{"at":"0:00","text":"Hi, this is Maria, I wanted to confirm my Friday appointment."},{"at":"0:22","text":"Also, is there parking nearby?"},{"at":"0:31","text":"Great, the validated lot on 2nd works. Thanks!"}] },
    { id:'c3', ext:1, line:'+1 (617) 555-0100', dir:'out',    num:'+1 (617) 555-2290', contact:'Jane Cho',      cnam:null, when:'Today, 9:30 AM', date:'2026-06-05',  ts:984, dur:'2:05', outcome:'answered', via:'JOEL app', by:'Jane Cho' },
    { id:'c4', ext:1, line:'+1 (617) 555-0199', dir:'missed', num:'+1 (978) 555-7745', contact:null, cnam:'Priya Shah', when:'Yesterday, 1:02 PM', date:'2026-06-04', ts:880, dur:'—', outcome:'missed', vmId:'vm3' },
    { id:'c5', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (508) 555-9912', contact:'Tom Reilly',    cnam:null, when:'Yesterday, 11:15 AM', date:'2026-06-04', ts:872, dur:'6:40', outcome:'answered', via:'JOEL app', by:'Jane Cho', rec:true, recSummary:"Tom asked to move his crown fitting a week later and to email the new estimate.", recTranscript:[{"at":"0:00","text":"Hey, it’s Tom Reilly. I need to push my crown fitting."},{"at":"0:30","text":"Can we do the following week instead?"},{"at":"1:10","text":"Perfect, and please email the updated estimate."}] },
    { id:'c6', ext:1, line:'+1 (617) 555-0199', dir:'missed', num:'+1 (978) 555-7745', contact:null, cnam:'Priya Shah', when:'Mon, 3:48 PM', date:'2026-06-01', ts:700, dur:'—', outcome:'missed' },
    { id:'c7', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (305) 555-3360', contact:null, cnam:null, when:'Yesterday, 4:11 PM', date:'2026-06-04', ts:900, dur:'—', outcome:'voicemail', vmId:'vm2' },
    { id:'c8', ext:1, line:'+1 (617) 555-0100', dir:'out',    num:'+1 (415) 555-0182', contact:'Daniel Okafor', cnam:null, when:'Mon, 2:15 PM', date:'2026-06-01', ts:680, dur:'3:22', outcome:'answered', via:'(617) 555-1141', by:'Bob Stevens', rec:true, recSummary:"Confirmed Daniel’s Friday 2pm cleaning and that Delta Dental is accepted.", recTranscript:[{"at":"0:00","text":"Hi Daniel, calling to confirm your Friday 2 o’clock cleaning."},{"at":"0:25","text":"Yes, we do take Delta Dental — you’re all set."},{"at":"0:52","text":"Great, see you Friday. Thanks!"}] },
    { id:'cs1', ext:2, line:'+1 (617) 555-0188', dir:'in',     num:'+1 (212) 555-7788', contact:null, cnam:'Helena Ruiz', when:'Today, 8:50 AM', date:'2026-06-05', ts:960, dur:'—', outcome:'voicemail', vmId:'vm4' },
    { id:'cs2', ext:2, line:'+1 (617) 555-0188', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez', cnam:null, when:'Today, 10:05 AM', date:'2026-06-05', ts:996, dur:'3:18', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria reported the app logging her out; walked her through a password reset.", recTranscript:[{"at":"0:00","text":"The patient app keeps signing me out."},{"at":"0:40","text":"Okay, I reset the password on my end."},{"at":"1:05","text":"That worked, thank you so much."}] },
    { id:'cb1', ext:3, dir:'missed', num:'+1 (404) 555-1199', contact:null, cnam:'Grant Field', when:'Yesterday, 3:20 PM', date:'2026-06-04', ts:890, dur:'—', outcome:'missed' },
    { id:'c9',  ext:1, line:'+1 (617) 555-0100', dir:'missed', num:'+1 (508) 555-9912', contact:'Tom Reilly', cnam:null, when:'Mon, 4:30 PM', date:'2026-05-25', ts:400, dur:'—', outcome:'missed' },
    { id:'c10', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez', cnam:null, when:'Tue, 11:00 AM', date:'2026-05-19', ts:380, dur:'2:40', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria asked to add a teeth-whitening to her next visit; noted on her chart.", recTranscript:[{"at":"0:00","text":"Could I add whitening to my next visit?"},{"at":"0:30","text":"Yes, please add it. Thanks!"}] },
  ],
  texts:[
    { id:'t1', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:12 AM', date:'2026-06-05', ts:974, body:'Hi! Can I confirm my cleaning for Friday at 2pm?' },
    { id:'t4', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:21 AM', date:'2026-06-05', ts:978, body:'Perfect, thank you!' },
    { id:'t6', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:34 AM', date:'2026-06-05', ts:980, body:'Actually — any chance we could do 3pm instead of 2?' },
    { id:'t7', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:36 AM', date:'2026-06-05', ts:982, body:'My morning meeting might run long. Thanks!' },
    { id:'t5', ext:1, line:'+1 (617) 555-0100', num:'+1 (978) 555-7745', dir:'in',  when:'Yesterday, 2:02 PM', date:'2026-06-04', ts:886, body:'Tuesday works great, thank you!' },
    { id:'t2', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'out', when:'Today, 9:15 AM', date:'2026-06-05', ts:976, author:'Jane Cho', body:'Yes Daniel, you’re all set for Fri 2:00 PM. See you then!' },
    { id:'t3', ext:1, line:'+1 (617) 555-0100', num:'+1 (978) 555-7745', dir:'out', when:'Yesterday, 1:30 PM', date:'2026-06-04', ts:884, author:'Bob Stevens', body:'Hi Priya, returning your call — happy to set up a first visit. What days work for you?' },
    { id:'tb1', ext:3, num:'+1 (404) 555-1199', dir:'out', when:'Yesterday, 3:35 PM', date:'2026-06-04', ts:892, author:'Bob Stevens', body:'Hi Grant, following up on your billing question — your January statement is attached. Let us know if it looks right.' },
  ],
};

const TEAM_POOL = [
  { id:'u3', name:'Mara Lopez', email:'mara@smilebar.co' },
  { id:'u4', name:'Dev Patel', email:'dev@smilebar.co' },
  { id:'u5', name:'Sofia Reyes', email:'sofia@smilebar.co' },
];

const NAV = [
  { id:'calls', icon:'phone', label:'Calls' },
  { id:'inbox', icon:'message', label:'SMS' },
];
const SYSTEM = [
  { id:'extensions', icon:'route', label:'Extensions' },
  { id:'forwarding', icon:'forward', label:'Call Forwarding' },
  { id:'settings', icon:'settings', label:'Settings' },
  { id:'billing', icon:'card', label:'Billing' },
];
const RAIL = [
  { id:'routing', icon:'route', label:'Forwarding' },
  { id:'schedule', icon:'clock', label:'Schedule' },
  { id:'greetings', icon:'audiolines', label:'Greetings' },
  { id:'notifications', icon:'bell', label:'Notifications' },
  { id:'general', icon:'settings', label:'Settings' },
];

// master list of extensions (list screen)
const EXTENSIONS = [
  { id:'e0', number:0, name:'Operator', enabled:true,  status:'active', forwards:1, routing:'single', access:5, transferExp:'ring', dests:['Front Desk'], vm:{ emails:['team@smilebar.co','frontdesk@smilebar.co'], slack:null } },
  { id:'e1', number:1, name:'Sales', enabled:true,     status:'active', forwards:4, routing:'order',  access:3, transferExp:'ring', dests:['Jane Cho — mobile app','(617) 555-1141 — cell','Front Desk','(617) 555-2200 — desk'], vm:{ emails:['team@smilebar.co','bob@smilebar.co'], slack:'#sales-team' } },
  { id:'e2', number:2, name:'Support', enabled:true,   status:'active', forwards:3, routing:'all',    access:4, transferExp:'music', dests:['Front Desk','(617) 555-2200 — desk'], vm:{ emails:['support@smilebar.co'], slack:null } },
  { id:'e3', number:3, name:'Billing', enabled:false,  status:'disabled', forwards:2, routing:'order', access:2, transferExp:'greeting', dests:['Susan — cell','Billing Desk Phone'], vm:{ emails:[], slack:null } },
  { id:'e101', number:101, name:'Bob Smith', enabled:true, status:'active', forwards:2, routing:'order', access:1, transferExp:'ring', dests:['Bob’s Mobile','(617) 555-0142 — cell'], vm:{ emails:['bob@smilebar.co'], slack:null } },
];

// business phone numbers (lines) calls/texts arrive on
const BUSINESS_LINES = [
  { num:'+1 (617) 555-0100', label:'Local', type:'Local', sms:'approved', routesTo:'main' },
  { num:'+1 (617) 555-0188', label:'Toll-free', type:'Toll-Free', sms:'pending', routesTo:'main' },
  { num:'+1 (617) 555-0199', label:'Marketing tracking', type:'Local', sms:null, routesTo:'3' },
];
const lineLabel = (num)=>{ const l=BUSINESS_LINES.find(x=>x.num===num); return l?l.label:'Number'; };

// how an extension routes a call → human phrase for the list summary
const ROUTING_PHRASE = {
  order:  (n)=>`Rings ${n} destination${n>1?'s':''} in order`,
  all:    (n)=>`Rings ${n} destination${n>1?'s':''} at once`,
  single: (n)=>`Rings ${n} destination${n>1?'s':''}`,
};

// status pill config — Active / Disabled
const STATUS = {
  active:   { cls:'on',  dot:'dot-g', label:'Active' },
  disabled: { cls:'off', dot:'dot-m', label:'Forwarding off' },
};

let uid = 100;
const menuItem={display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:8,fontSize:'.88rem',fontWeight:600,color:'var(--ink)',textAlign:'left'};
const ic={width:16,height:16,color:'var(--muted)',flexShrink:0};

const DEST_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DEST_TZS=['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','Alaska (AKT)','Hawaii (HT)'];
const DEST_TIMES=(()=>{ const out=[]; for(let h=0;h<24;h++){ for(const m of [0,30]){ const ap=h<12?'AM':'PM'; let hh=h%12; if(hh===0)hh=12; out.push(`${hh}:${m===0?'00':'30'} ${ap}`);} } return out; })();

/* ---------- Add / edit destination modal ---------- */
function DestinationModal({ editing, extName, onClose, onSave }){
  const ext = extName || 'Sales';
  const [step,setStep]=useState(editing?'form':'type');
  const [type,setType]=useState(editing?editing.type:null);
  const initVal = editing ? (editing.type==='phone'?editing.number.replace(/^\+1\s*/,''):editing.type==='sip'?editing.device:editing.user) : '';
  const [value,setValue]=useState(initVal);
  const [label,setLabel]=useState(editing?(editing.label||''):'');
  const [enabled,setEnabled]=useState(editing?editing.enabled!==false:true);
  const [announce,setAnnounce]=useState(editing?!!editing.screening:false);
  const [schedOn,setSchedOn]=useState(editing?!!editing.schedule:false);
  const [sched,setSched]=useState(()=> (editing && editing.schedule && typeof editing.schedule==='object') ? editing.schedule : {days:['Mon','Tue','Wed','Thu','Fri'],from:'9:00 AM',to:'5:00 PM',tz:'Eastern (ET)'});
  const [ring,setRing]=useState(editing?(editing.ring||30):30);

  const TYPES=[
    { type:'phone', icon:'phone', t:'Phone number', s:'Ring a mobile or any outside number.' },
    { type:'sip', icon:'monitor', t:'Desk phone', s:'Ring a desk phone in your office.' },
    { type:'app', icon:'smartphone', t:'Mobile app', s:'Ring a teammate in the JOEL app.' },
  ];
  const meta = type ? DEST_META[type] : null;
  const fieldLabel = type==='phone' ? 'Phone number' : type==='sip' ? 'Desk phone' : 'Teammate';
  const canSave = value.trim();
  const rowStyle = {display:'flex',alignItems:'center',gap:13,padding:'14px 0',borderTop:'1px solid var(--line-soft)'};

  function pick(t){ setType(t); setStep('form'); if(!editing) setAnnounce(t==='phone'); }
  function save(){
    const base = { id: editing?editing.id:('d'+(uid++)), type, label: label.trim()||undefined,
      enabled, screening:announce, schedule: schedOn ? sched : null, ring };
    if(type==='phone') base.number = '+1 '+value.trim().replace(/^\+1\s*/,'');
    else if(type==='sip') base.device = value;
    else base.user = value;
    onSave(base);
  }

  return (
    <Modal onClose={onClose}
      icon={meta?meta.icon:'phone'}
      title={editing?'Edit destination':(step==='type'?'Add a destination':`Add ${meta.kind.toLowerCase()}`)}
      desc={step==='type'?`Where should calls to ${ext} ring?`:'Where it rings and how the call is handled.'}
      footer={step==='form' && (
        <>
          {!editing && <button className="btn btn-ghost left" onClick={()=>setStep('type')}><Icon name="arrowleft"/> Back</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canSave} style={!canSave?{opacity:.5,pointerEvents:'none'}:null} onClick={save}>
            {editing?'Save changes':'Add destination'}
          </button>
        </>
      )}>
      {step==='type' ? (
        <div className="type-grid">
          {TYPES.map(t=>(
            <button key={t.type} className="type-card" onClick={()=>pick(t.type)}>
              <span className="tc-ic d-icon"><Icon name={t.icon}/></span>
              <span className="tc-t"><b>{t.t}</b><span>{t.s}</span></span>
              <span className="tc-go"><Icon name="chevright"/></span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {type==='phone' ? (
            <Field label={fieldLabel} help="Any mobile, landline, or outside number. JOEL rings it directly.">
              <div className="input-affix"><span className="pre">+1</span>
                <input value={value} autoFocus onChange={e=>setValue(e.target.value)} placeholder="(617) 555-0000"/></div>
            </Field>
          ) : (
            <Field label={fieldLabel} help={type==='sip'?'Desk phones are set up by an admin on the Devices screen.':'Teammates ring in the JOEL mobile app.'}>
              <select className="select" value={value} autoFocus onChange={e=>setValue(e.target.value)}>
                <option value="">Select…</option>
                {(type==='sip'
                  ? ['Front Desk','Reception','Conference Room']
                  : ['Jane Cho','Bob Stevens','Mara Lopez']).map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          )}

          <Field label="Label" help="A short name so you can recognize this destination.">
            <input className="input" value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Bob Cell, Front Desk, On-call doctor"/>
          </Field>

          <div style={rowStyle}>
            <span className="d-icon" style={{width:36,height:36,borderRadius:'50%',background:'var(--bg-alt)',color:'var(--body)'}}><Icon name="check"/></span>
            <div style={{flex:1}}>
              <b style={{fontWeight:700,fontSize:'.9rem'}}>Status</b>
              <p style={{color:'var(--body)',fontSize:'.82rem'}}>{enabled?'Active — calls can ring here.':'Disabled — JOEL skips this destination.'}</p>
            </div>
            <Toggle on={enabled} onChange={setEnabled}/>
          </div>

          <div style={rowStyle}>
            <span className="d-icon" style={{width:36,height:36,borderRadius:'50%',background:'var(--bg-alt)',color:'var(--body)'}}><Icon name="calendar"/></span>
            <div style={{flex:1}}>
              <b style={{fontWeight:700,fontSize:'.9rem'}}>Custom schedule</b>
              <p style={{color:'var(--body)',fontSize:'.82rem'}}>{schedOn?'Only rings on the days and times you choose.':'Rings any time.'}</p>
            </div>
            <Toggle on={schedOn} onChange={setSchedOn}/>
          </div>
          {schedOn && (
            <div className="gsched" style={{paddingTop:2,paddingBottom:6}}>
              <div className="gsched-row">
                <span className="gsched-lbl">Days</span>
                <div className="day-chips">
                  {DEST_DAYS.map(d=>{ const o=sched.days.includes(d); return (
                    <button key={d} className={`day-chip${o?' on':''}`} onClick={()=>setSched({...sched, days: o?sched.days.filter(x=>x!==d):[...sched.days,d]})}>{d}</button>
                  ); })}
                </div>
              </div>
              <div className="gsched-row">
                <span className="gsched-lbl">Hours</span>
                <div className="gsched-times">
                  <select className="select" value={sched.from} onChange={e=>setSched({...sched,from:e.target.value})}>{DEST_TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
                  <span className="gsched-to">to</span>
                  <select className="select" value={sched.to} onChange={e=>setSched({...sched,to:e.target.value})}>{DEST_TIMES.map(t=><option key={t} value={t}>{t}</option>)}</select>
                </div>
              </div>
              <div className="gsched-row">
                <span className="gsched-lbl">Time zone</span>
                <select className="select gsched-tz" value={sched.tz} onChange={e=>setSched({...sched,tz:e.target.value})}>{DEST_TZS.map(t=><option key={t} value={t}>{t}</option>)}</select>
              </div>
            </div>
          )}

          <div style={rowStyle}>
            <span className="d-icon" style={{width:36,height:36,borderRadius:'50%',background:'var(--ai-soft)',color:'var(--ai)'}}><Icon name="shield"/></span>
            <div style={{flex:1}}>
              <b style={{fontWeight:700,fontSize:'.9rem'}}>Call announce</b>
              <p style={{color:'var(--body)',fontSize:'.82rem'}}>Before connecting, JOEL says “You have a call for {ext}. Press 1 to accept.”</p>
            </div>
            <Toggle on={announce} onChange={setAnnounce}/>
          </div>
          {announce && (
            <div className="note info" style={{marginTop:12}}>
              <Icon name="info"/>
              <span>Without this, a personal voicemail could answer first — JOEL would treat the call as answered and stop trying your other destinations. Call announce asks the person to press a key before connecting.</span>
            </div>
          )}

          <Field label="Ring duration" help="How long this destination rings before JOEL moves on.">
            <div style={{maxWidth:200,marginTop:14}}>
              <select className="select" value={ring} onChange={e=>setRing(+e.target.value)}>
                {[20,30,40,60].map(s=><option key={s} value={s}>{s} seconds</option>)}
              </select>
            </div>
          </Field>
        </div>
      )}
    </Modal>
  );
}

/* ---------- Add people modal ---------- */
function PeopleModal({ existingIds, onClose, onAdd }){
  const [sel,setSel]=useState([]);
  const pool = TEAM_POOL.filter(p=>!existingIds.includes(p.id));
  function toggle(id){ setSel(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]); }
  return (
    <Modal onClose={onClose} icon="users" title="Add people to Sales"
      desc="They'll get access to this extension's calls, voicemails, and more."
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!sel.length} style={!sel.length?{opacity:.5,pointerEvents:'none'}:null}
          onClick={()=>onAdd(pool.filter(p=>sel.includes(p.id)).map(p=>({...p,role:'User'})))}>
          Add {sel.length||''} {sel.length===1?'person':'people'}
        </button>
      </>}>
      {pool.length===0 ? (
        <p style={{color:'var(--body)',fontSize:'.9rem',padding:'8px 0 4px'}}>Everyone on your team already has access. Invite more teammates from the Users screen.</p>
      ) : pool.map(p=>(
        <button key={p.id} className="pick" onClick={()=>toggle(p.id)}>
          <Avatar name={p.name}/>
          <span className="pk"><b>{p.name}</b><span>{p.email}</span></span>
          <span className={`check${sel.includes(p.id)?' on':''}`}><Icon name="check" sw={3}/></span>
        </button>
      ))}
    </Modal>
  );
}

/* ---------- Shell ---------- */
function Sidebar({ active, onNav, badges, hideSetup }){
  return (
    <aside className="sidebar">
      <div className="sb-top">
        <div className="sb-brand"><span className="sb-word">JOEL</span></div>
        <button className="switcher">
          <span className="biz-name">Smilebar</span>
          <span className="chev"><Icon name="chevdown" style={{width:16,height:16}}/></span>
        </button>
      </div>
      <nav className="sb-nav">
        {NAV.map(n=>(
          <button key={n.id} className={`sb-item${active===n.id?' active':''}`} onClick={()=>onNav(n.id)}>
            <Icon name={n.icon}/>{n.label}{badges && badges[n.id]>0 && <span className="badge">{badges[n.id]}</span>}
          </button>
        ))}
        <div className="sb-group">System</div>
        {!hideSetup && (
          <button className={`sb-item${active==='setup'?' active':''}`} onClick={()=>onNav('setup')}>
            <Icon name="sparkle"/>Quick Setup
          </button>
        )}
        {SYSTEM.map(n=>(
          <button key={n.id} className={`sb-item${active===n.id?' active':''}`} onClick={()=>onNav(n.id)}>
            <Icon name={n.icon}/>{n.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Topbar({ onMenu }){
  return (
    <header className="topbar">
      <button className="hamburger" onClick={onMenu} aria-label="Open menu"><Icon name="menu" style={{width:20,height:20}}/></button>
      <button className="search">
        <Icon name="search" style={{width:17,height:17}}/>
        <input placeholder="Search calls, voicemails, messages…" readOnly/>
        <span className="kbd">⌘K</span>
      </button>
      <div className="top-actions">
        <button className="icon-btn"><Icon name="bell" style={{width:19,height:19}}/><span className="dot"/></button>
        <button className="acct">
          <Avatar name="Bob Stevens"/>
          <span className="acct-who"><b>Bob Stevens</b><span>Admin</span></span>
          <Icon name="chevdown" style={{width:15,height:15,color:'var(--muted)'}}/>
        </button>
      </div>
    </header>
  );
}

/* ---------- Root ---------- */
function App(){
  const [ext,setExt]=useState(SEED);
  const [selId,setSelId]=useState('e1');
  const [view,setView]=useState('list');
  const [tab,setTab]=useState('overview');
  const [dirty,setDirty]=useState(false);
  const [navOpen,setNavOpen]=useState(false);
  const [destModal,setDestModal]=useState(null); // {editing} | {} 
  const [peopleModal,setPeopleModal]=useState(false);
  const [detail,setDetail]=useState(null); // {num, item}
  const [activity,setActivity]=useState(ACTIVITY);
  const [screen,setScreen]=useState('setup');
  const [setupDismissed,setSetupDismissed]=useState(false);
  const [sysMode,setSysMode]=useState('phones'); // 'phones'|'greet'|'menu'
  const [sysGreeting,setSysGreeting]=useState('Thank you for calling Smilebar. Please hold while we connect your call.');
  const [extEnabled,setExtEnabled]=useState(false); // user explicitly turned on extensions
  const [ovVariant,setOvVariant]=useState('v2'); // System Overview compare toggle (v2 = health+actions, v1 = setup summary)
  // "extensions" appears in the product only when there's a menu OR the user opted in
  const hasExtensions = true;
  const [actFilter,setActFilter]=useState('all');
  const [actExt,setActExt]=useState('all');
  const [callsSub,setCallsSub]=useState('all'); // controlled Calls sub-filter: all|missed|incoming|outgoing|vm
  const [callsSeen,setCallsSeen]=useState({}); // extNumber -> true once the calls log has been viewed (clears "missed" hint)
  const [contactFilter,setContactFilter]=useState(null); // {num,name} — a CRM lens over the activity screens
  const [smsRead,setSmsRead]=useState({});
  const [smsArchived,setSmsArchived]=useState({});
  const archiveSms=(num,val)=>setSmsArchived(a=>({...a,[num]:val}));
  const [vmExtra,setVmExtra]=useState({}); // vmId -> { move:{to,from}|null, emails:[] }
  const moveVm=(vmId,toExt,fromExt,note)=>setVmExtra(m=>({...m,[vmId]:{...(m[vmId]||{emails:[]}),move:{to:String(toExt),from:String(fromExt),note:note||''}}}));
  const undoMoveVm=(vmId)=>setVmExtra(m=>({...m,[vmId]:{...(m[vmId]||{emails:[]}),move:null}}));
  const [moveToast,setMoveToast]=useState(null); // {text, vmId}
  useEffect(()=>{ if(!moveToast) return; const t=setTimeout(()=>setMoveToast(null),7000); return ()=>clearTimeout(t); },[moveToast]);
  const handleMoveVm=(vmId,toExt,fromExt,note)=>{ moveVm(vmId,toExt,fromExt,note); const ex=EXTENSIONS.find(e=>String(e.number)===String(toExt)); setMoveToast({ vmId, text:`Voicemail moved to Ext. ${toExt}${ex?' '+ex.name:''}` }); };
  const emailVm=(vmId,email,note)=>setVmExtra(m=>{ const cur=m[vmId]||{emails:[]}; return {...m,[vmId]:{...cur,emails:[...(cur.emails||[]),{email,note:note||''}]}}; });
  const [contactMeta,setContactMeta]=useState(SEED.contacts||{});
  const saveMeta=(num,patch)=>setContactMeta(m=>({...m,[num]:{...(m[num]||{note:'',numbers:[],emails:[]}),...patch}}));
  const [t,setTweak]=useTweaks(TWEAK_DEFAULTS);
  const [wide,setWide]=useState(typeof window!=='undefined' && window.innerWidth>=1100);
  useEffect(()=>{
    const h=()=>setWide(window.innerWidth>=1100);
    window.addEventListener('resize',h); return ()=>window.removeEventListener('resize',h);
  },[]);
  // docked pane only on wide viewports; otherwise fall back to overlay drawer
  const detailMode = (t.detailMode==='Docked pane' && wide) ? 'pane' : 'drawer';
  const paneOpen = !!detail && detailMode==='pane';

  const markHeard=(id)=>setActivity(a=>({...a,voicemails:a.voicemails.map(v=>v.id===id?{...v,heard:true}:v)}));
  const setHeard=(id,val)=>setActivity(a=>({...a,voicemails:a.voicemails.map(v=>v.id===id?{...v,heard:val}:v)}));
  const markAllHeard=()=>setActivity(a=>({...a,voicemails:a.voicemails.map(v=>({...v,heard:true}))}));
  const openContact=(num,item)=>{ if(item && item.type==='vm') markHeard(item.id); if(item && item.type==='text') setSmsRead(r=>({...r,[num]:true})); setDetail({num,item}); };
  const openCall=(c)=>openContact(c.num,{type:'call',id:c.id});
  const openVm=(v)=>openContact(v.num,{type:'vm',id:v.id});
  const sendText=(num,body,line)=>{ const v=(body||'').trim(); if(!v) return; setActivity(a=>{
    const maxTs=Math.max(0, ...a.texts.map(x=>x.ts||0), ...a.calls.map(x=>x.ts||0), ...a.voicemails.map(x=>x.ts||0));
    const tagged=(a.calls.find(c=>c.num===num)||a.voicemails.find(x=>x.num===num)||a.texts.find(x=>x.num===num)||{});
    // a reply always goes back out on the same business number the customer reached;
    // a brand-new message uses the chosen From line. Never silently cross numbers.
    const useLine = line || tagged.line || (BUSINESS_LINES.find(l=>l.sms==='approved')||BUSINESS_LINES[0]||{}).num;
    const nt={ id:'t'+Date.now(), ext:tagged.ext||1, num, line:useLine, dir:'out', when:'Today, just now', date:'2026-06-05', ts:maxTs+1, author:'Bob Stevens', body:v };
    return {...a, texts:[...a.texts, nt]};
  }); };
  const teammates=Array.from(new Set([...ext.permissions.map(p=>p.name), ...TEAM_POOL.map(p=>p.name)]));
  const unreadSms=(()=>{ const byNum={}; activity.texts.forEach(t=>{(byNum[t.num]=byNum[t.num]||[]).push(t);}); return Object.keys(byNum).filter(num=>{ const last=byNum[num].slice().sort((a,b)=>a.ts-b.ts).pop(); return last.dir==='in' && !smsRead[num] && !smsArchived[num]; }).length; })();
  const navBadges = { inbox: unreadSms };
  const knownContacts=Array.from(new Set([
    ...activity.calls.filter(c=>c.contact).map(c=>c.contact),
    ...activity.voicemails.filter(v=>v.contact).map(v=>v.contact),
    ...Object.values(contactMeta).map(m=>m.name).filter(Boolean),
    ...teammates,
  ])).sort();
  const onNav=(id)=>{
    setNavOpen(false);
    setContactFilter(null);
    if(id==='setup'){ setScreen('setup'); }
    else if(id==='calls'){ setScreen('calls'); setActExt('all'); setCallsSub('all'); setCallsSeen(allExtsSeen); }
    else if(id==='inbox'){ setScreen('sms'); }
    else if(id==='numbers'){ setScreen('numbers'); setView('list'); }
    else if(id==='greetings'){ setScreen('greetings'); setView('list'); }
    else if(id==='phonesys'){ setScreen('phonesys'); setView('list'); }
    else if(id==='extensions'){ setScreen('extensions'); setView('list'); }
    else if(id==='forwarding'){ setScreen('forwarding'); setView('list'); }
    else if(id==='settings'){ setScreen('settings'); setView('list'); }
    else if(id==='billing'){ setScreen('billing'); setView('list'); }
  };
  // deep-link from a contact into the activity screens, filtered to that number
  const openFiltered=(dest,num,name)=>{
    setDetail(null);
    setContactFilter(num?{num,name}:null);
    if(dest==='sms'){ setScreen('sms'); }
    else if(dest==='voicemails'){ setScreen('calls'); setCallsSub('vm'); }
    else { setScreen('calls'); setCallsSub('all'); }
  };
  // deep-link from an extension row's hint → the Calls screen, filtered to the extension
  const allExtsSeen = EXTENSIONS.reduce((o,e)=>{ o[e.number]=true; return o; },{});
  const openExtActivity=(dest,extNum,sub)=>{
    setContactFilter(null);
    setActExt(String(extNum));
    setScreen('calls');
    if(dest==='voicemails'){ setCallsSub('vm'); }
    else { setCallsSub(sub||'missed'); setCallsSeen(s=>({...s,[extNum]:true})); }
  };
  const activeNav = screen==='setup' ? 'setup'
    : screen==='sms' ? 'inbox'
    : screen==='settings' ? 'settings'
    : screen==='billing' ? 'billing'
    : screen==='numbers' ? 'numbers'
    : screen==='greetings' ? 'greetings'
    : screen==='forwarding' ? 'forwarding'
    : screen==='calls' || screen==='voicemails' ? 'calls'
    : 'extensions';
  const [hmenu,setHmenu]=useState(false);
  const hmenuRef = useRef(null);
  // universal "away" flag, keyed by extension number — shared by header, list, and Schedule panel
  const [awayMap,setAwayMap]=useState({ 2:{since:new Date().toISOString(),until:'open'} });
  const setAway=(number,obj)=>setAwayMap(m=>{ const n={...m}; if(obj) n[number]=obj; else delete n[number]; return n; });
  const [awayConfirm,setAwayConfirm]=useState(null); // { number, name, toAway, greeting }
  const askAway=(number,name,greeting)=>setAwayConfirm({ number, name, toAway:!awayMap[number], greeting:greeting||'forward-off' });
  const doAway=()=>{ if(!awayConfirm) return; setAway(awayConfirm.number, awayConfirm.toAway?{since:new Date().toISOString(),until:'open'}:null); setAwayConfirm(null); };
  const [fwdConfirm,setFwdConfirm]=useState(false);
  const fwdRef = useRef(null);
  useEffect(()=>{
    if(!fwdConfirm) return;
    const h=e=>{ if(fwdRef.current && !fwdRef.current.contains(e.target)) setFwdConfirm(false); };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[fwdConfirm]);
  useEffect(()=>{
    if(!hmenu) return;
    const h=e=>{ if(hmenuRef.current && !hmenuRef.current.contains(e.target)) setHmenu(false); };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[hmenu]);

  const patch = useCallback((p)=>{ setExt(e=>({...e,...p})); setDirty(true); },[]);

  // destinations
  const toggleDest=(id)=>{ setExt(e=>({...e,destinations:e.destinations.map(d=>d.id===id?{...d,enabled:!d.enabled}:d)})); setDirty(true); };
  const screenDest=(id)=>{ setExt(e=>({...e,destinations:e.destinations.map(d=>d.id===id?{...d,screening:!d.screening}:d)})); setDirty(true); };
  const moveDest=(id,dir)=>{ setExt(e=>{ const a=[...e.destinations]; const i=a.findIndex(d=>d.id===id); const j=i+dir; if(j<0||j>=a.length) return e; [a[i],a[j]]=[a[j],a[i]]; return {...e,destinations:a}; }); setDirty(true); };
  const removeDest=(id)=>{ setExt(e=>({...e,destinations:e.destinations.filter(d=>d.id!==id)})); setDirty(true); };
  const saveDest=(d)=>{ setExt(e=>{ const exists=e.destinations.some(x=>x.id===d.id); return {...e,destinations: exists ? e.destinations.map(x=>x.id===d.id?d:x) : [...e.destinations,d]}; }); setDirty(true); setDestModal(null); };

  // notifications
  const setNotif=(ev,ch,val)=>{ setExt(e=>({...e,notifications:{...e.notifications,[ev]:{...e.notifications[ev],[ch]:val}}})); setDirty(true); };
  const setSlackChannel=(ch)=>{ setExt(e=>({...e,notifications:{...e.notifications,slackChannel:ch}})); setDirty(true); };

  // permissions
  const removePerm=(id)=>{ setExt(e=>({...e,permissions:e.permissions.filter(p=>p.id!==id)})); setDirty(true); };
  const updatePerm=(id,patch)=>{ setExt(e=>({...e,permissions:e.permissions.map(p=>p.id===id?{...p,...patch}:p)})); setDirty(true); };
  const reinvitePerm=(id)=>{ setExt(e=>({...e,permissions:e.permissions.map(p=>p.id===id?{...p,resent:true}:p)})); };
  const addPeople=(people)=>{ setExt(e=>({...e,permissions:[...e.permissions,...people]})); setDirty(true); setPeopleModal(false); };

  const panels={
    overview:<OverviewPanel
      voicemails={activity.voicemails.filter(v=>v.ext===ext.number)}
      calls={activity.calls.filter(c=>c.ext===ext.number)}
      onOpenCall={openCall} onOpenVm={openVm}
      inlinePlay={t.inlinePlay} onHeard={markHeard} contactMeta={contactMeta}
      goActivity={(f)=>{ setScreen(f==='vm'?'voicemails':'calls'); }}/>,
    routing:<RoutingPanel ext={ext} patch={patch} onToggle={toggleDest} onScreening={screenDest} onMove={moveDest}
      onEdit={(d)=>setDestModal({editing:d})} onRemove={removeDest} openAddDest={()=>setDestModal({})}/>,
    greetings:<ExtensionGreetings ext={ext} patch={patch} away={awayMap[ext.number]||null} onGoSchedule={()=>setTab('schedule')}/>,
    schedule:<SchedulePanel ext={ext} patch={patch} away={awayMap[ext.number]||null} onSetAway={(obj)=>setAway(ext.number,obj)}/>,
    notifications:<NotificationsPanel ext={ext} setNotif={setNotif} setSlackChannel={setSlackChannel}/>,
    general:(
      <React.Fragment>
        <GeneralPanel ext={ext} patch={patch}/>
        <PermissionsPanel ext={ext} removePerm={removePerm} updatePerm={updatePerm} reinvitePerm={reinvitePerm} openAddPeople={()=>setPeopleModal(true)}/>
        <DangerZone ext={ext}/>
      </React.Fragment>
    ),
  };

  const goSettings = (t)=>{ setTab(t); };
  const selectExt = (it)=>{
    setSelId(it.id);
    setExt(it.id==='e1' ? {...SEED, status:it.status} : {...SEED, number:it.number, name:it.name, tts:it.name, enabled:it.enabled, status:it.status});
    setDirty(false);
    setTab('routing');
    setView('detail');
  };

  return (
    <div className={`app${navOpen?' nav-open':''}${paneOpen?' pane-open':''}`}>
      <Sidebar active={activeNav} onNav={onNav} badges={navBadges} hideSetup={setupDismissed}/>
      <div className="scrim" onClick={()=>setNavOpen(false)}/>
      <div className="main">
        <Topbar onMenu={()=>setNavOpen(true)}/>
        <div className="scroll">
          <div className="page">
            {screen==='setup' ? (
              <QuickSetup businessNumber="(617) 555-0100" businessName="Smilebar" ownerEmail="bob@smilebar.co" onDone={()=>onNav('calls')} onDismiss={()=>{ setSetupDismissed(true); onNav('extensions'); }}/>
            ) : screen==='calls' || screen==='voicemails' ? (
              <ActivityScreen activity={activity} extensions={EXTENSIONS} contactMeta={contactMeta}
                mode={screen} extFilter={actExt} setExtFilter={setActExt} onOpen={openContact}
                sub={callsSub} setSub={setCallsSub} businessLines={BUSINESS_LINES} lineLabel={lineLabel}
                hasExtensions={hasExtensions}
                contactFilter={contactFilter} onClearContactFilter={()=>setContactFilter(null)}
                onHeard={markHeard} onSetHeard={setHeard} onMarkAllHeard={markAllHeard} vmExtra={vmExtra} onMoveVm={handleMoveVm} onUndoMoveVm={undoMoveVm} onEmailVm={emailVm}/>
            ) : screen==='sms' ? (
              <SmsScreen activity={activity} contactMeta={contactMeta} onSaveMeta={saveMeta} smsRead={smsRead} smsArchived={smsArchived}
                onArchive={archiveSms} onOpen={openContact} onReadSms={(num)=>setSmsRead(r=>({...r,[num]:true}))} onSend={sendText}
                businessLines={BUSINESS_LINES} lineLabel={lineLabel}
                initialNum={contactFilter&&contactFilter.num}/>
            ) : screen==='numbers' ? (
              <NumbersScreen numbers={BUSINESS_LINES} extensions={EXTENSIONS} businessName="Smilebar" onGoGreetings={()=>onNav('greetings')} onGoExtensions={()=>onNav('extensions')}/>
            ) : screen==='greetings' ? (
              <GreetingsScreen onGoExtensions={()=>onNav('extensions')} extensions={EXTENSIONS} businessName="Smilebar"/>
            ) : screen==='forwarding' ? (
              <CallForwardingScreen onOpenExt={(num)=>{ const e=EXTENSIONS.find(x=>x.number===num); if(e){ setScreen('extensions'); selectExt(e); } }}/>
            ) : screen==='phonesys' ? (
              <SystemOverviewV3 businessName="Smilebar" numbers={BUSINESS_LINES} extensions={EXTENSIONS}
                greeting="Thank you for calling Smilebar. Please hold while we connect your call."
                hours="Mon–Fri, 9:00 AM – 5:00 PM ET" status="Open" afterHoursOn={true}
                routeDestinations={['Bob’s cell','Front desk phone','Answering service']}
                voicemailEmails={['team@smilebar.co','bob@smilebar.co']}
                onGo={(dest)=>onNav(dest)}
                onOpenExt={(e)=>{ if(e){ setScreen('extensions'); selectExt(e); } else onNav('extensions'); }}/>
            ) : screen==='settings' || screen==='billing' ? (
              <SettingsScreen onNav={onNav}/>
            ) : view==='list' ? (
              <div className="ext-listview">
                <div className="lv-head">
                  <div>
                    <h1 className="lv-title">Extensions</h1>
                    <p className="lv-sub">Every call belongs to an extension. Pick one to manage how it rings, its voicemail, and who can use it.</p>
                  </div>
                  <button className="btn btn-secondary sm"><Icon name="plus"/> New extension</button>
                </div>
                <div className="lv-table">
                  <div className="lv-row lv-headrow">
                    <span>Extension</span>
                    <span/>
                    <span/>
                  </div>
                  {EXTENSIONS.map(it=>{
                    const st = STATUS[it.status];
                    return (
                      <button key={it.id} className="lv-row" onClick={()=>selectExt(it)}>
                        <span className="lv-ext">
                          <span className="lv-num">{it.number}</span>
                          <span className="lv-extmeta">
                            <b>{it.name}</b>
                            <span className="lv-sub2">Forwards to {it.forwards} destination{it.forwards>1?'s':''}</span>
                          </span>
                        </span>
                        <span className={`away-flag${awayMap[it.number]?'':' open'}`} role="button" tabIndex={0} onClick={(e)=>{ e.stopPropagation(); askAway(it.number, it.name); }} title="Click to toggle availability"><span className="away-flag-dot"/>{awayMap[it.number]?'Away':'Active'}</span>
                        <span className="lv-go"><Icon name="chevright"/></span>
                      </button>
                    );
                  })}
                  <div className="lv-row system">
                    <span className="lv-ext">
                      <span className="lv-num dir">9</span>
                      <span className="lv-extmeta">
                        <b>Dial by name directory</b>
                        <span className="lv-dirnote">Built automatically from your extension names — callers speak or spell a teammate's name on the keypad and JOEL connects them to the matching extension.</span>
                      </span>
                    </span>
                    <span className="lv-auto"><Icon name="sparkle"/> Automated</span>
                  </div>
                </div>
              </div>
            ) : (
              <section className="ext-detail">
                <button className="lv-back" onClick={()=>setView('list')}><Icon name="arrowleft"/> Extensions</button>
                <div className="phead">
                  <div className="htext">
                    <h1>{hasExtensions ? <><span className="ext-kicker-inline">Extension {ext.number}</span> · {ext.name||'Untitled'}</> : (ext.name||'Untitled')}<button className={`away-flag${awayMap[ext.number]?'':' open'}`} onClick={()=>askAway(ext.number, ext.name, (ext.officeHours&&ext.officeHours.afterHours)||'forward-off')} title="Click to toggle availability"><span className="away-flag-dot"/>{awayMap[ext.number]?'Away':'Active'}</button></h1>
                  </div>
                  <div className="phead-actions" ref={hmenuRef} style={{position:'relative',display:'flex',gap:8,alignItems:'center'}}>
                    <button className="btn btn-secondary" onClick={()=>openExtActivity('calls',ext.number,'all')}><Icon name="activity"/> View activity</button>
                    <button className="btn btn-secondary" onClick={()=>setHmenu(v=>!v)} aria-label="More options"><Icon name="kebab"/></button>
                    {hmenu && (
                      <div style={{position:'absolute',top:46,right:0,background:'#fff',border:'1px solid var(--line)',
                        borderRadius:12,boxShadow:'var(--shadow-pop)',padding:6,width:230,zIndex:30}}>
                        <button style={menuItem} onClick={()=>setHmenu(false)}><Icon name="pencil" style={ic}/> Rename extension</button>
                        <div style={{height:1,background:'var(--line)',margin:'5px 4px'}}/>
                        {(awayMap[ext.number]) ? (
                          <button style={menuItem} onClick={()=>{ setAway(ext.number,null); setHmenu(false); }}><Icon name="clock" style={ic}/> Turn back on now</button>
                        ) : (
                          <button style={menuItem} onClick={()=>{ setAway(ext.number,{since:new Date().toISOString(),until:'open'}); setHmenu(false); setTab('schedule'); }}><Icon name="voicemail" style={ic}/> Set away now</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="dtabs" role="tablist">
                  {RAIL.map(r=>(
                    <button key={r.id} role="tab" aria-selected={tab===r.id} className={`dtab${tab===r.id?' on':''}`} onClick={()=>setTab(r.id)}>
                      <Icon name={r.icon}/>{r.label}
                    </button>
                  ))}
                </div>

                <div className="dpanel">{panels[tab]}</div>
              </section>
            )}
          </div>
        </div>
      </div>

      {destModal && <DestinationModal editing={destModal.editing} extName={ext.name} onClose={()=>setDestModal(null)} onSave={saveDest}/>}
      {peopleModal && <PeopleModal existingIds={ext.permissions.map(p=>p.id)} onClose={()=>setPeopleModal(false)} onAdd={addPeople}/>}
      {awayConfirm && (
        <Modal icon={awayConfirm.toAway?'voicemail':'clock'}
          title={awayConfirm.toAway?`Set ${awayConfirm.name} to away?`:`Turn ${awayConfirm.name} back on?`}
          onClose={()=>setAwayConfirm(null)}
          footer={<React.Fragment>
            <button className="btn btn-ghost sm" onClick={()=>setAwayConfirm(null)}>Cancel</button>
            <button className="btn btn-primary sm" onClick={doAway}>{awayConfirm.toAway?'Set away':'Turn back on'}</button>
          </React.Fragment>}>
          {awayConfirm.toAway ? (
            <div className="awayconf">
              <div className="awayconf-row"><span className="awayconf-ic off"><Icon name="pause"/></span><div><b>Call forwarding pauses</b><span>Calls stop ringing your destinations while you’re away.</span></div></div>
              <div className="awayconf-row"><span className="awayconf-ic"><Icon name="voicemail"/></span><div><b>Callers hear your {awayConfirm.greeting==='away'?'away greeting':'voicemail greeting'}</b><span>They can still leave a message, just like normal.</span></div></div>
              <p className="awayconf-note">You can turn {awayConfirm.name} back on anytime — forwarding resumes right away.</p>
            </div>
          ) : (
            <div className="awayconf">
              <div className="awayconf-row"><span className="awayconf-ic on"><Icon name="check"/></span><div><b>Call forwarding turns back on</b><span>Calls ring all your destinations again, exactly as before.</span></div></div>
              <p className="awayconf-note">Your schedule and away dates stay exactly as you set them.</p>
            </div>
          )}
        </Modal>
      )}
      {detail &&
        <ContactDrawer num={detail.num} openItem={detail.item} mode={detailMode}
          calls={activity.calls.filter(c=>c.num===detail.num)}
          voicemails={activity.voicemails.filter(v=>v.num===detail.num)}
          texts={activity.texts.filter(x=>x.num===detail.num)}
          meta={contactMeta[detail.num]||{note:'',numbers:[],emails:[]}}
          teammates={teammates} knownContacts={knownContacts} devices={ext.destinations} me="Bob Stevens"
          extensions={EXTENSIONS} vmExtra={vmExtra} onMoveVm={handleMoveVm} onUndoMoveVm={undoMoveVm} onEmailVm={emailVm}
          onSaveMeta={(patch)=>saveMeta(detail.num,patch)} onSend={sendText} onNavigate={openFiltered}
          onClose={()=>setDetail(null)}/>}

      {moveToast && (
        <div className="move-toast">
          <Icon name="check"/>
          <span>{moveToast.text}</span>
          <button onClick={()=>{ undoMoveVm(moveToast.vmId); setMoveToast(null); }}>Undo</button>
          <button className="mt-x" onClick={()=>setMoveToast(null)} aria-label="Dismiss"><Icon name="x"/></button>
        </div>
      )}

      <TweaksPanel>
        <TweakSection label="Detail view"/>
        <TweakRadio label="When you open a call or voicemail" value={t.detailMode}
          options={['Drawer','Docked pane']} onChange={v=>setTweak('detailMode',v)}/>
        <TweakSection label="List behavior"/>
        <TweakToggle label="Play voicemails inline" value={t.inlinePlay}
          onChange={v=>setTweak('inlinePlay',v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
