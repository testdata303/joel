/* ============================================================
   JOEL app - Extension Detail root + shell + flows
   ============================================================ */
const { Icon, Toggle, Segmented, Choice, Field, Avatar, Card, Modal, Wave, EmptyArt,
  GeneralPanel, RoutingPanel, SchedulePanel, AvailabilityPanel, VoicemailPanel, NotificationsPanel, RecordingPanel, PermissionsPanel, DangerZone, DEST_META,
  OverviewPanel, ContactDrawer, ActivityScreen, SmsScreen, NumbersScreen, GreetingsScreen,
  SystemOverviewScreen, SystemOverviewV2, SystemOverviewV3, SettingsScreen, ExtensionGreetings, QuickSetup,
  PhoneSystem,
  NumbersSection, MainGreetingSection, AddExtensionModal,
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
  voicemail:{ enabled:true, afterHoursOn:true, voice:'Aria', schedule:{ days:['Mon','Tue','Wed','Thu','Fri'], from:'9:00 AM', to:'5:00 PM' }, greeting:'Thanks for calling Smilebar Sales. Sorry we missed you - leave a message and we\u2019ll call right back.', afterHours:'You\u2019ve reached Smilebar Sales after hours. Leave a message and we\u2019ll reach out next business day.' },
  notifications:{
    missed:{ email:true, emailTo:['team@smilebar.co'], text:false, textTo:[], slack:true, whatsapp:false, whatsappTo:[], webhook:false,
      webhookUrl:'', webhookMsg:'{\n  "event": "missed_call",\n  "extension": "{{extension}}",\n  "from": "{{caller_number}}",\n  "at": "{{time}}"\n}' },
    voicemail:{ email:true, emailTo:['team@smilebar.co','bob@smilebar.co'], emailAttach:true, slack:true, whatsapp:false, whatsappTo:[], webhook:false,
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
      note:'Husband Marcus is also a patient. Prefers Friday afternoons - call after 3 PM.',
      numbers:[{ id:'p2', number:'+1 (415) 555-0147', label:'Office' }],
      emails:[
        { id:'e1', email:'daniel.okafor@gmail.com', label:'Personal' },
        { id:'e2', email:'daniel@marcusdental.com', label:'Work' },
      ],
    },
    '+1 (978) 555-7745':{ note:'Prefers text over a phone call.', emails:[] },
    '+1 (404) 555-1199':{ note:'', emails:[] },
    '+1 (415) 555-0144':{ name:'Rosa Méndez', note:'Reaches out on WhatsApp.', emails:[] },
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
    { id:'c1', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (415) 555-0182', contact:'Daniel Okafor', cnam:null, when:'Today, 10:24 AM', date:'2026-06-05', ts:1000, dur:'-', outcome:'voicemail', vmId:'vm1' },
    { id:'c2', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez',   cnam:null, when:'Today, 9:48 AM', date:'2026-06-05',  ts:992, dur:'4:12', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria confirmed her Friday cleaning and asked about parking - directed her to the validated lot.", recTranscript:[{"at":"0:00","text":"Hi, this is Maria, I wanted to confirm my Friday appointment."},{"at":"0:22","text":"Also, is there parking nearby?"},{"at":"0:31","text":"Great, the validated lot on 2nd works. Thanks!"}] },
    { id:'c3', ext:1, line:'+1 (617) 555-0100', dir:'out',    num:'+1 (617) 555-2290', contact:'Jane Cho',      cnam:null, when:'Today, 9:30 AM', date:'2026-06-05',  ts:984, dur:'2:05', outcome:'answered', via:'JOEL app', by:'Jane Cho' },
    { id:'c4', ext:1, line:'+1 (617) 555-0199', dir:'missed', num:'+1 (978) 555-7745', contact:null, cnam:'Priya Shah', when:'Yesterday, 1:02 PM', date:'2026-06-04', ts:880, dur:'-', outcome:'missed', vmId:'vm3' },
    { id:'c5', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (508) 555-9912', contact:'Tom Reilly',    cnam:null, when:'Yesterday, 11:15 AM', date:'2026-06-04', ts:872, dur:'6:40', outcome:'answered', via:'JOEL app', by:'Jane Cho', rec:true, recSummary:"Tom asked to move his crown fitting a week later and to email the new estimate.", recTranscript:[{"at":"0:00","text":"Hey, it’s Tom Reilly. I need to push my crown fitting."},{"at":"0:30","text":"Can we do the following week instead?"},{"at":"1:10","text":"Perfect, and please email the updated estimate."}] },
    { id:'c6', ext:1, line:'+1 (617) 555-0199', dir:'missed', num:'+1 (978) 555-7745', contact:null, cnam:'Priya Shah', when:'Mon, 3:48 PM', date:'2026-06-01', ts:700, dur:'-', outcome:'missed' },
    { id:'c7', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (305) 555-3360', contact:null, cnam:null, when:'Yesterday, 4:11 PM', date:'2026-06-04', ts:900, dur:'-', outcome:'voicemail', vmId:'vm2' },
    { id:'c8', ext:1, line:'+1 (617) 555-0100', dir:'out',    num:'+1 (415) 555-0182', contact:'Daniel Okafor', cnam:null, when:'Mon, 2:15 PM', date:'2026-06-01', ts:680, dur:'3:22', outcome:'answered', via:'(617) 555-1141', by:'Bob Stevens', rec:true, recSummary:"Confirmed Daniel’s Friday 2pm cleaning and that Delta Dental is accepted.", recTranscript:[{"at":"0:00","text":"Hi Daniel, calling to confirm your Friday 2 o’clock cleaning."},{"at":"0:25","text":"Yes, we do take Delta Dental - you’re all set."},{"at":"0:52","text":"Great, see you Friday. Thanks!"}] },
    { id:'cs1', ext:2, line:'+1 (617) 555-0188', dir:'in',     num:'+1 (212) 555-7788', contact:null, cnam:'Helena Ruiz', when:'Today, 8:50 AM', date:'2026-06-05', ts:960, dur:'-', outcome:'voicemail', vmId:'vm4' },
    { id:'cs2', ext:2, line:'+1 (617) 555-0188', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez', cnam:null, when:'Today, 10:05 AM', date:'2026-06-05', ts:996, dur:'3:18', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria reported the app logging her out; walked her through a password reset.", recTranscript:[{"at":"0:00","text":"The patient app keeps signing me out."},{"at":"0:40","text":"Okay, I reset the password on my end."},{"at":"1:05","text":"That worked, thank you so much."}] },
    { id:'cb1', ext:3, dir:'missed', num:'+1 (404) 555-1199', contact:null, cnam:'Grant Field', when:'Yesterday, 3:20 PM', date:'2026-06-04', ts:890, dur:'-', outcome:'missed' },
    { id:'c9',  ext:1, line:'+1 (617) 555-0100', dir:'missed', num:'+1 (508) 555-9912', contact:'Tom Reilly', cnam:null, when:'Mon, 4:30 PM', date:'2026-05-25', ts:400, dur:'-', outcome:'missed' },
    { id:'c10', ext:1, line:'+1 (617) 555-0100', dir:'in',     num:'+1 (617) 555-3301', contact:'Maria Gomez', cnam:null, when:'Tue, 11:00 AM', date:'2026-05-19', ts:380, dur:'2:40', outcome:'answered', via:'Front Desk', rec:true, recSummary:"Maria asked to add a teeth-whitening to her next visit; noted on her chart.", recTranscript:[{"at":"0:00","text":"Could I add whitening to my next visit?"},{"at":"0:30","text":"Yes, please add it. Thanks!"}] },
  ],
  texts:[
    { id:'t1', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:12 AM', date:'2026-06-05', ts:974, body:'Hi! Can I confirm my cleaning for Friday at 2pm?' },
    { id:'t4', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:21 AM', date:'2026-06-05', ts:978, body:'Perfect, thank you!' },
    { id:'t6', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:34 AM', date:'2026-06-05', ts:980, body:'Actually - any chance we could do 3pm instead of 2?' },
    { id:'t7', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'in',  when:'Today, 9:36 AM', date:'2026-06-05', ts:982, body:'My morning meeting might run long. Thanks!' },
    { id:'t5', ext:1, line:'+1 (617) 555-0100', num:'+1 (978) 555-7745', dir:'in',  when:'Yesterday, 2:02 PM', date:'2026-06-04', ts:886, body:'Tuesday works great, thank you!' },
    { id:'t2', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0182', dir:'out', when:'Today, 9:15 AM', date:'2026-06-05', ts:976, author:'Jane Cho', body:'Yes Daniel, you’re all set for Fri 2:00 PM. See you then!' },
    { id:'t3', ext:1, line:'+1 (617) 555-0100', num:'+1 (978) 555-7745', dir:'out', when:'Yesterday, 1:30 PM', date:'2026-06-04', ts:884, author:'Bob Stevens', body:'Hi Priya, returning your call - happy to set up a first visit. What days work for you?' },
    { id:'tb1', ext:3, num:'+1 (404) 555-1199', dir:'out', when:'Yesterday, 3:35 PM', date:'2026-06-04', ts:892, author:'Bob Stevens', body:'Hi Grant, following up on your billing question - your January statement is attached. Let us know if it looks right.' },
    { id:'tw1', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0144', channel:'whatsapp', dir:'in',  when:'Today, 9:38 AM', date:'2026-06-05', ts:983, body:'Hi! Do you have any openings this Saturday?' },
    { id:'tw2', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0144', channel:'whatsapp', dir:'in',  when:'Today, 9:39 AM', date:'2026-06-05', ts:984, body:'Found you on WhatsApp 🙂 hoping for a morning slot if possible.' },
    { id:'tw3', ext:1, line:'+1 (617) 555-0100', num:'+1 (415) 555-0144', channel:'whatsapp', dir:'out', when:'Today, 9:42 AM', date:'2026-06-05', ts:985, author:'Mara Lopez', body:'Hi Rosa! We have 10:30 AM open this Saturday - want me to book it?' },
  ],
};

const TEAM_POOL = [
  { id:'u3', name:'Mara Lopez', email:'mara@smilebar.co' },
  { id:'u4', name:'Dev Patel', email:'dev@smilebar.co' },
  { id:'u5', name:'Sofia Reyes', email:'sofia@smilebar.co' },
];

const NAV = [
  { id:'calls', icon:'phone', label:'Calls' },
  { id:'inbox', icon:'message', label:'Texts' },
];
const SYSTEM = [
  { id:'sysmap', icon:'route', label:'Phone System' },
  { id:'integrations', icon:'layers', label:'Integrations' },
  { id:'settings', icon:'settings', label:'Settings' },
  { id:'billing', icon:'card', label:'Billing' },
];
const QUICK_SETUP = [
  { id:'setup', icon:'phone', label:'Take Calls' },
  { id:'sms-reg', icon:'message', label:'SMS Registration' },
];
const RAIL = [
  { id:'routing', icon:'route', label:'Call Forwarding' },
  { id:'schedule', icon:'disc', label:'Availability' },
  { id:'greetings', icon:'audiolines', label:'Greetings' },
  { id:'notifications', icon:'bell', label:'Notifications' },
  { id:'general', icon:'settings', label:'Settings' },
];

// master list of extensions (list screen)
const EXTENSIONS = [
  { id:'e0', number:0, name:'Operator', enabled:true,  status:'active', forwards:1, routing:'single', access:5, transferExp:'ring', dests:['Front Desk'], vm:{ emails:['team@smilebar.co','frontdesk@smilebar.co'], slack:null } },
  { id:'e1', number:1, name:'Sales', enabled:true,     status:'active', forwards:4, routing:'order',  access:3, transferExp:'ring', dests:['Jane Cho - mobile app','(617) 555-1141 - cell','Front Desk','(617) 555-2200 - desk'], vm:{ emails:['team@smilebar.co','bob@smilebar.co'], slack:'#sales-team' } },
  { id:'e2', number:2, name:'Support', enabled:true,   status:'active', forwards:3, routing:'all',    access:4, transferExp:'music', awayMode:'away', dests:['Front Desk','(617) 555-2200 - desk'], vm:{ emails:['support@smilebar.co'], slack:null } },
  { id:'e3', number:3, name:'Billing', enabled:false,  status:'disabled', forwards:2, routing:'order', access:2, transferExp:'greeting', awayMode:'forward', awayTo:'2', dests:['Susan - cell','Billing Desk Phone'], vm:{ emails:[], slack:null } },
  { id:'e101', number:101, name:'Bob Smith', enabled:true, status:'active', forwards:2, routing:'order', access:1, transferExp:'ring', dests:['Bob’s Mobile','(617) 555-0142 - cell'], vm:{ emails:['bob@smilebar.co'], slack:null } },
];

// business phone numbers (lines) calls/texts arrive on
const BUSINESS_LINES = [
  { num:'+1 (617) 555-0100', label:'Local', type:'Local', sms:'approved', routesTo:'main' },
  { num:'+1 (617) 555-0188', label:'Toll-free', type:'Toll-Free', sms:'pending', routesTo:'main' },
  { num:'+1 (617) 555-0199', label:'Marketing tracking', type:'Local', sms:null, routesTo:'3' },
];
const lineLabel = (num)=>{ const l=BUSINESS_LINES.find(x=>x.num===num); return l?l.label:'Number'; };

// accounts the signed-in person can switch between, in the sidebar.
// `simple` accounts skip extensions entirely: one number → greeting → rings a phone.
const COMPANIES = [
  { id:'smilebar', name:'Smilebar', kind:'Dental practice · 5 extensions', tone:'blue', simple:false },
  { id:'marco', name:"Marco's Plumbing", kind:'Just me · 1 number', tone:'green', simple:true,
    number:'+1 (617) 555-0142',
    hoursShort:'Mon–Sat, 7–6',
    hoursLong:'Mon–Sat, 7:00 AM – 6:00 PM ET',
    greeting:'You’ve reached Marco’s Plumbing. Leave a message and I’ll call you right back.',
    forward:{ icon:'smartphone', label:'My cell', value:'+1 (617) 555-7788' } },
  // a seat where the signed-in person is just a team member - they manage the extensions they can answer
  { id:'northshore', name:'Northshore Dental', kind:'Member · 2 extensions', tone:'violet',
    role:'member', me:'Priya Shah', myEmail:'priya@northshore.co', myExt:101,
    myExts:[
      { number:101, name:'Priya Shah', kind:'personal', sub:'Your direct extension - rings only your devices.', forwards:2 },
      { number:1, name:'Front Desk', kind:'shared', team:'You and 2 teammates', sub:'Shared team line - rings everyone who answers the front desk.', forwards:4 },
    ] },
];
const initialsOf = (name)=> (name||'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();

// how an extension routes a call → human phrase for the list summary
const ROUTING_PHRASE = {
  order:  (n)=>`Rings ${n} destination${n>1?'s':''} in order`,
  all:    (n)=>`Rings ${n} destination${n>1?'s':''} at once`,
  single: (n)=>`Rings ${n} destination${n>1?'s':''}`,
};

// status pill config - Active / Disabled
const STATUS = {
  active:   { cls:'on',  dot:'dot-g', label:'Active' },
  disabled: { cls:'off', dot:'dot-m', label:'Forwarding off' },
};

let uid = 100;
/* Desk phones are devices set up by an admin under Settings → Devices.
   An extension destination just picks from what's already connected. */
const DESK_PHONES = ['Front Desk','Reception','Conference Room'];
const menuItem={display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:8,fontSize:'.88rem',fontWeight:600,color:'var(--ink)',textAlign:'left'};
const ic={width:16,height:16,color:'var(--muted)',flexShrink:0};

const DEST_DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DEST_TZS=['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','Alaska (AKT)','Hawaii (HT)'];
const DEST_TIMES=(()=>{ const out=[]; for(let h=0;h<24;h++){ for(const m of [0,30]){ const ap=h<12?'AM':'PM'; let hh=h%12; if(hh===0)hh=12; out.push(`${hh}:${m===0?'00':'30'} ${ap}`);} } return out; })();

/* ---------- Add / edit destination modal ---------- */
function DestinationModal({ editing, extName, initialType, onClose, onSave }){
  const ext = extName || 'Sales';
  const [step,setStep]=useState(editing||initialType?'form':'type');
  const [type,setType]=useState(editing?editing.type:(initialType||null));
  const initVal = editing ? (editing.type==='phone'?editing.number.replace(/^\+1\s*/,''):editing.type==='sip'?editing.device:editing.user) : '';
  const [value,setValue]=useState(initVal);
  const [label,setLabel]=useState(editing?(editing.label||''):'');
  const [enabled,setEnabled]=useState(editing?editing.enabled!==false:true);
  const [announce,setAnnounce]=useState(editing?!!editing.screening:false);
  const [schedOn,setSchedOn]=useState(editing?!!editing.schedule:false);
  const [sched,setSched]=useState(()=> (editing && editing.schedule && typeof editing.schedule==='object') ? editing.schedule : {days:['Mon','Tue','Wed','Thu','Fri'],from:'9:00 AM',to:'5:00 PM',tz:'Eastern (ET)'});
  const [ring,setRing]=useState(editing?(editing.ring||30):30);
  const [getPhone,setGetPhone]=useState(false);       // "set up a new desk phone" flow
  const [newPhones,setNewPhones]=useState([]);        // desk phones connected during this add

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
      desc={step==='type'?`Where should calls to ${ext} ring?`:(editing?'Where it rings and how the call is handled.':'Add it now - you can fine-tune timing, schedule, and screening after.')}
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
          ) : type==='sip' ? (
            <Field label="Desk phone" help="Pick a desk phone you've already set up, or set up a new one.">
              {[...DESK_PHONES, ...newPhones].length>0 && (
                <select className="select" value={value} autoFocus onChange={e=>setValue(e.target.value)}>
                  <option value="">Select an existing desk phone…</option>
                  {[...DESK_PHONES, ...newPhones].map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              )}
              <button className="dest-setupphone" onClick={()=>setGetPhone(true)}>
                <span className="dsp-ic"><Icon name="plus"/></span>
                <span className="dsp-tx">Set up a new desk phone</span>
                <Icon name="chevright"/>
              </button>
            </Field>
          ) : (
            <Field label={fieldLabel} help="Teammates ring in the JOEL mobile app.">
              <select className="select" value={value} autoFocus onChange={e=>setValue(e.target.value)}>
                <option value="">Select…</option>
                {['Jane Cho','Bob Stevens','Mara Lopez'].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          )}
          {getPhone && window.AddDeskPhoneFlow && (
            <window.AddDeskPhoneFlow onClose={()=>setGetPhone(false)}
              onAdd={(name)=>{ setNewPhones(p=>[...p,name]); setValue(name); }}/>
          )}

          {editing && (<>
          <Field label="Label" help="A short name so you can recognize this destination.">
            <input className="input" value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Bob Cell, Front Desk, On-call doctor"/>
          </Field>

          <div style={rowStyle}>
            <span className="d-icon" style={{width:36,height:36,borderRadius:'50%',background:'var(--bg-alt)',color:'var(--body)'}}><Icon name="check"/></span>
            <div style={{flex:1}}>
              <b style={{fontWeight:700,fontSize:'.9rem'}}>Status</b>
              <p style={{color:'var(--body)',fontSize:'.82rem'}}>{enabled?'Active - calls can ring here.':'Disabled - JOEL skips this destination.'}</p>
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
              <span>Without this, a personal voicemail could answer first - JOEL would treat the call as answered and stop trying your other destinations. Call announce asks the person to press a key before connecting.</span>
            </div>
          )}

          <Field label="Ring duration" help="How long this destination rings before JOEL moves on.">
            <div style={{maxWidth:200,marginTop:14}}>
              <select className="select" value={ring} onChange={e=>setRing(+e.target.value)}>
                {[20,30,40,60].map(s=><option key={s} value={s}>{s} seconds</option>)}
              </select>
            </div>
          </Field>
          </>)}
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
function WebhookSetup({ cfg, setCfg }){
  const [url,setUrl]=useState(cfg.url||'');
  const [secret,setSecret]=useState(cfg.secret||('whsec_'+Math.random().toString(36).slice(2,12)+Math.random().toString(36).slice(2,10)));
  const [revealed,setRevealed]=useState(false);
  const [events,setEvents]=useState(cfg.events||{missed:true,voicemail:true,text:false});
  const [previewEv,setPreviewEv]=useState('voicemail');
  const [testing,setTesting]=useState(false);
  const [deliveries,setDeliveries]=useState([
    { id:1, ev:'voicemail.created', code:200, when:'2m ago', ok:true },
    { id:2, ev:'call.missed', code:200, when:'17m ago', ok:true },
    { id:3, ev:'message.received', code:500, when:'1h ago', ok:false },
    { id:4, ev:'call.missed', code:200, when:'3h ago', ok:true },
  ]);
  const rotate=()=>{ setSecret('whsec_'+Math.random().toString(36).slice(2,12)+Math.random().toString(36).slice(2,10)); setRevealed(true); };
  const toggleEv=(k)=>setEvents(e=>({...e,[k]:!e[k]}));
  const save=()=>setCfg({ url:url.trim(), secret, events, connected:!!url.trim() });
  const testFire=()=>{ setTesting(true); setTimeout(()=>{ setTesting(false); setDeliveries(d=>[{id:Date.now(),ev:'ping.test',code:200,when:'just now',ok:true},...d].slice(0,6)); },1000); };
  const EVMETA={ missed:['Missed call','call.missed'], voicemail:['Voicemail','voicemail.created'], text:['New text','message.received'] };
  const PAYLOADS={
    missed:{ event:'call.missed', id:'evt_8f21c4', call_id:'CA_3a90f1', from:'+19785557745', to:'+16175550100', extension:{ number:1, name:'Sales' }, rang_for:30, created_at:'2026-06-13T14:22:05Z' },
    voicemail:{ event:'voicemail.created', id:'evt_b7d214', voicemail_id:'VM_77c1ab', from:'+19785557745', extension:{ number:1, name:'Sales' }, duration_sec:54, transcript:'Hi, this is Priya calling about a first visit…', recording_url:'https://api.joel.com/v1/recordings/VM_77c1ab.mp3', created_at:'2026-06-13T14:22:05Z' },
    text:{ event:'message.received', id:'evt_2c10e9', message_id:'SM_55d0c2', from:'+14155550182', to:'+16175550188', body:'Are you open today?', created_at:'2026-06-13T14:22:05Z' },
  };
  const masked = secret.slice(0,9)+'•'.repeat(16);
  return (
    <div className="wh-screen">
      <div className="wh-head">
        <span className="app-logo ink wh-logo"><Icon name="route"/></span>
        <div className="wh-headtx"><h1>Webhooks</h1><p>POST call and message events to your own server as JSON, in real time.</p></div>
        {cfg.connected && <span className="app-status on wh-conn"><span className="app-dot"/>Active</span>}
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Endpoint URL</label>
        <div className="wh-secret">
          <input className="input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.yourapp.com/joel/webhook"/>
          <button className="btn btn-primary sm" onClick={save} disabled={!url.trim()}>Save</button>
        </div>
        <p className="wh-note">We POST to this URL for every subscribed event. Reply <code>2xx</code> within 5s or we retry with backoff for 24h.</p>
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Signing secret</label>
        <div className="wh-secret">
          <input className="input wh-mono" readOnly value={revealed?secret:masked}/>
          <button className="btn btn-secondary sm" onClick={()=>setRevealed(r=>!r)}>{revealed?'Hide':'Reveal'}</button>
          <button className="btn btn-secondary sm" onClick={rotate}>Rotate</button>
        </div>
        <p className="wh-note">Verify each request with the <code>X-JOEL-Signature</code> header - HMAC-SHA256 of the raw body using this secret.</p>
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Events to send</label>
        <div className="wh-events">
          {Object.keys(EVMETA).map(k=>(
            <label className={`wh-event${events[k]?' on':''}`} key={k}>
              <Toggle sm on={!!events[k]} onChange={()=>toggleEv(k)}/>
              <span className="wh-event-tx"><b>{EVMETA[k][0]}</b><span><code>{EVMETA[k][1]}</code></span></span>
            </label>
          ))}
        </div>
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Payload</label>
        <div className="wh-evtabs">
          {Object.keys(EVMETA).map(k=>(
            <button key={k} className={`wh-evtab${previewEv===k?' on':''}`} onClick={()=>setPreviewEv(k)}>{EVMETA[k][0]}</button>
          ))}
        </div>
        <pre className="wh-code"><code>{JSON.stringify(PAYLOADS[previewEv],null,2)}</code></pre>
        <p className="wh-note">Every event uses this shape - the extension is identified in the body, so you filter and route in your own code.</p>
      </div>

      <div className="wh-card">
        <div className="wh-deliv-head">
          <span className="wh-lbl" style={{margin:0}}>Recent deliveries</span>
          <button className="btn btn-secondary sm" onClick={testFire} disabled={testing}>{testing?'Sending…':'Send test event'}</button>
        </div>
        <div className="wh-deliveries">
          {deliveries.map(d=>(
            <div className="wh-delivery" key={d.id}>
              <span className={`wh-delivery-st${d.ok?' ok':' fail'}`}>{d.code}</span>
              <code className="wh-delivery-ev">{d.ev}</code>
              <span className="wh-delivery-when">{d.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function AIAgentSetup({ provider, extensions }){
  const realExts=(extensions||[]).filter(e=>Number(e.number)!==0);
  const [sip,setSip]=useState('');
  const [apiKey,setApiKey]=useState('');
  const [connected,setConnected]=useState(false);
  const [ext,setExt]=useState(realExts[0]?String(realExts[0].number):'1');
  const [answer,setAnswer]=useState('first');   // first = AI answers first; backup = after humans don't pick up
  const [fallback,setFallback]=useState('forward'); // what happens when the AI can't help
  const canConnect = sip.trim() && apiKey.trim();
  const STEPS=[
    { icon:'sparkle', t:'Build or pick your agent', d:`Create a voice agent in ${provider.name} - give it your hours, FAQs, and booking rules.` },
    { icon:'route',   t:'Connect it to JOEL by SIP', d:'Paste the agent\u2019s SIP address and API key below. JOEL hands the live call to your agent.' },
    { icon:'phone',   t:'Assign it to an extension', d:'Choose which extension the AI answers. It can transfer to a teammate or take a message anytime.' },
  ];
  const CANDO=[
    'Answers in a natural voice and greets callers by your business name',
    'Handles routine questions - hours, location, pricing, “are you open?”',
    'Books appointments and captures caller details into your tools',
    'Transfers to a teammate, or takes a voicemail, the moment a human is needed',
  ];
  return (
    <div className="wh-screen">
      <div className="wh-head">
        <span className="app-logo ai wh-logo"><Icon name={provider.icon}/></span>
        <div className="wh-headtx">
          <h1>{provider.name}</h1>
          <p>{provider.blurb||'Connect a voice-AI agent to answer calls on an extension.'}</p>
        </div>
        <span className={`app-status${connected?' on':''} wh-conn`}><span className="app-dot"/>{connected?'Connected':'Not connected'}</span>
      </div>

      <div className="aiset-hero">
        <span className="aiset-hero-ic"><Icon name="sparkle"/></span>
        <div className="aiset-hero-tx">
          <b>Bring your own AI receptionist</b>
          <p>JOEL routes the call; <b>{provider.name}</b> answers it. The AI talks to your caller in a natural voice, handles the routine stuff, and hands the call to your team - or takes a message - whenever a person is needed. You stay in control: it lives on an extension, just like a teammate.</p>
        </div>
      </div>

      <div className="aiset-steps">
        {STEPS.map((s,i)=>(
          <div className="aiset-step" key={i}>
            <span className="aiset-step-n">{i+1}</span>
            <span className="aiset-step-ic"><Icon name={s.icon}/></span>
            <div className="aiset-step-tx"><b>{s.t}</b><span>{s.d}</span></div>
          </div>
        ))}
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Agent SIP address</label>
        <div className="wh-secret">
          <input className="input wh-mono" value={sip} onChange={e=>setSip(e.target.value)} placeholder={provider.sip||'sip:agent@your-provider.ai'}/>
        </div>
        <p className="wh-note">Copy this from your {provider.name} agent settings. JOEL forwards the live audio to this address over SIP.</p>
      </div>

      <div className="wh-card">
        <label className="wh-lbl">API key</label>
        <div className="wh-secret">
          <input className="input wh-mono" type="password" value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="sk_live_…"/>
          <button className="btn btn-primary sm" onClick={()=>setConnected(canConnect)} disabled={!canConnect}>{connected?'Reconnect':'Connect'}</button>
        </div>
        <p className="wh-note">Used to authenticate the handoff. Stored encrypted - never shown to your team.</p>
      </div>

      <div className="wh-card">
        <label className="wh-lbl">Assign to an extension</label>
        <div className="aiset-assign">
          <select className="select" value={ext} onChange={e=>setExt(e.target.value)}>
            {realExts.map(e=><option key={e.id} value={e.number}>Ext {e.number} · {e.name}</option>)}
          </select>
        </div>
        <div className="aiset-opt">
          <button className={`aiset-radio${answer==='first'?' on':''}`} onClick={()=>setAnswer('first')}>
            <span className="aiset-dot"/><span className="aiset-opt-tx"><b>AI answers first</b><span>The agent picks up every call to this extension</span></span>
          </button>
          <button className={`aiset-radio${answer==='backup'?' on':''}`} onClick={()=>setAnswer('backup')}>
            <span className="aiset-dot"/><span className="aiset-opt-tx"><b>AI as backup</b><span>Ring your team first; the agent answers only if no one picks up</span></span>
          </button>
        </div>
        <label className="wh-lbl" style={{marginTop:16}}>When the AI can’t help</label>
        <select className="select" value={fallback} onChange={e=>setFallback(e.target.value)}>
          <option value="forward">Transfer to a teammate</option>
          <option value="voicemail">Take a voicemail</option>
          <option value="hold">Keep the caller with the AI</option>
        </select>
      </div>

      <div className="wh-card aiset-cando">
        <label className="wh-lbl">What your AI agent can do</label>
        <ul>
          {CANDO.map((c,i)=><li key={i}><Icon name="check"/><span>{c}</span></li>)}
        </ul>
        <p className="wh-note">Not using {provider.name}? Any SIP-capable voice-AI works the same way - Vapi, Bland AI, Retell, Synthflow, Goodcall, and more.</p>
      </div>
    </div>
  );
}
function IntegrationsHub({ extensions, webhookCfg, setWebhookCfg }){
  const [open,setOpen]=useState(null);
  const aiAgents=[
    { id:'vapi', name:'Vapi', icon:'sparkle', tone:'ai', kind:'Build your own', blurb:'Developer platform for building custom voice AI agents.', sip:'sip:agent-3f2a@sip.vapi.ai', desc:'Developer platform for custom voice AI agents. Bring your own and connect it by SIP.', connected:false },
    { id:'bland', name:'Bland AI', icon:'mic', tone:'ai', kind:'Turnkey agent', blurb:'Human-sounding AI phone agents that answer 24/7.', sip:'sip:joel@api.bland.ai', desc:'Human-sounding AI phone agents that answer, qualify, and book - 24/7.', connected:false },
  ];
  const apps=[
    { id:'slack', name:'Slack', icon:'slack', tone:'slack', desc:'Post new texts, missed calls, and voicemails straight into your team’s channels.', connected:true },
    { id:'whatsapp', name:'WhatsApp', icon:'whatsapp', tone:'wa', desc:'Let customers message your business on WhatsApp - replies land in your shared inbox.', connected:false },
    { id:'webhooks', name:'Webhooks', icon:'route', tone:'ink', desc:'Send call and message events to your own endpoints in real time.', connected:!!(webhookCfg&&webhookCfg.connected) },
    { id:'zapier', name:'Zapier', icon:'sparkle', tone:'orange', desc:'Connect JOEL to 6,000+ apps with no-code automations.', soon:true },
  ];
  if(open){
    return (
      <div className="apps-detail">
        <button className="intg-back" onClick={()=>setOpen(null)}><Icon name="arrowleft"/> All integrations</button>
        {open==='slack' ? <window.IntegrationsScreen extensions={extensions}/>
          : open==='whatsapp' ? <window.WhatsAppOnboarding onDone={()=>setOpen(null)}/>
          : open==='vapi' ? <AIAgentSetup provider={aiAgents[0]} extensions={extensions}/>
          : open==='bland' ? <AIAgentSetup provider={aiAgents[1]} extensions={extensions}/>
          : open==='webhooks' ? <WebhookSetup cfg={webhookCfg} setCfg={setWebhookCfg}/> : null}
      </div>
    );
  }
  const renderCard = (a)=>(
    <div className={`app-card${a.soon?' soon':''}`} key={a.id}>
      <div className="app-card-top">
        <span className={`app-logo ${a.tone}`}><Icon name={a.icon}/></span>
        {a.soon
          ? <span className="app-status soon">Coming soon</span>
          : <span className={`app-status${a.connected?' on':''}`}><span className="app-dot"/>{a.connected?'Connected':'Not connected'}</span>}
      </div>
      {a.kind && <span className="app-kicker">{a.kind}</span>}
      <b className="app-name">{a.name}</b>
      <p className="app-desc">{a.desc}</p>
      {a.soon
        ? <button className="btn btn-secondary sm app-cta" disabled>Notify me</button>
        : <button className={`btn ${a.connected?'btn-secondary':'btn-primary'} sm app-cta`} onClick={()=>setOpen(a.id)}>{a.connected?'Manage':'Set up'}</button>}
    </div>
  );
  return (
    <div className="apps-screen">
      <div className="apps-head">
        <h1>Integrations</h1>
        <p>Connect JOEL to the tools your team already uses.</p>
      </div>

      <div className="apps-sectionh tools">
        <h2>Connect your tools</h2>
      </div>
      <div className="apps-grid">
        {apps.map(renderCard)}
      </div>

      <div className="apps-sectionh">
        <h2>AI answering agents</h2>
        <p>Bring your own AI receptionist. Connect a voice-AI agent and point an extension at it - it answers in a natural voice, handles routine calls, and hands off to your team when it matters. Works with any SIP agent.</p>
      </div>
      <div className="apps-grid">
        {aiAgents.map(renderCard)}
      </div>
    </div>
  );
}
function Sidebar({ active, onNav, badges, hideSetup, companies, companyId, onSwitch, isMember }){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(!open) return;
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[open]);
  const list = companies || [];
  const cur = list.find(c=>c.id===companyId) || list[0] || { name:'Smilebar' };
  return (
    <aside className="sidebar">
      <div className="sb-top">
        <a href="index.html" className="sb-brand" style={{textDecoration:'none'}} title="JOEL home"><span className="sb-word">JOEL</span></a>
        <div className="switcher-wrap" ref={ref}>
          <button className={`switcher${open?' open':''}`} onClick={()=>setOpen(o=>!o)} aria-haspopup="listbox" aria-expanded={open}>
            <span className={`switcher-mark ${cur.tone||'blue'}`}>{initialsOf(cur.name)}</span>
            <span className="biz-name">{cur.name}</span>
            <span className="chev"><Icon name="chevdown" style={{width:16,height:16}}/></span>
          </button>
          {open && (
            <div className="switcher-menu" role="listbox">
              <div className="switcher-menu-h">Switch business</div>
              {list.map(c=>(
                <button key={c.id} role="option" aria-selected={c.id===companyId}
                  className={`switcher-opt${c.id===companyId?' on':''}`}
                  onClick={()=>{ onSwitch && onSwitch(c.id); setOpen(false); }}>
                  <span className={`switcher-mark ${c.tone||'blue'}`}>{initialsOf(c.name)}</span>
                  <span className="switcher-opt-tx">
                    <b>{c.name}</b>
                  </span>
                  {c.id===companyId && <span className="switcher-check"><Icon name="check"/></span>}
                </button>
              ))}
              <button className="switcher-add"><Icon name="plus"/> Add a business</button>
            </div>
          )}
        </div>
      </div>
      <nav className="sb-nav">
        {NAV.map(n=>(
          <button key={n.id} className={`sb-item${active===n.id?' active':''}`} onClick={()=>onNav(n.id)}>
            <Icon name={n.icon}/>{n.label}{badges && badges[n.id]>0 && <span className="badge">{badges[n.id]}</span>}
          </button>
        ))}
        {isMember ? (
          <button className={`sb-item${active==='myext'?' active':''}`} onClick={()=>onNav('myext')}>
            <Icon name="smartphone"/>My extensions
          </button>
        ) : (
          <React.Fragment>
            <div className="sb-group">Admin</div>
            {SYSTEM.map(n=>(
              <button key={n.id} className={`sb-item${active===n.id?' active':''}`} onClick={()=>onNav(n.id)}>
                <Icon name={n.icon}/>{n.label}
              </button>
            ))}
          </React.Fragment>
        )}
      </nav>
    </aside>
  );
}

function Topbar({ onMenu, who, role }){
  const name = who || 'Bob Stevens';
  const sub = role || 'Admin';
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
          <Avatar name={name}/>
          <span className="acct-who"><b>{name}</b><span>{sub}</span></span>
          <Icon name="chevdown" style={{width:15,height:15,color:'var(--muted)'}}/>
        </button>
      </div>
    </header>
  );
}

/* parse "Jane Cho - mobile app" / "(617) 555-1141 - cell" → icon + name + type */
function cfvDest(str){
  const base=String(str); const name=base.replace(/\s*-.*/,'').trim(); const tail=base.includes('-')?base.replace(/.*-\s*/,'').trim():'';
  if(/mobile app|joel app/i.test(base)) return {icon:'smartphone', name, type:'Mobile app'};
  if(/cell|mobile/i.test(base)) return {icon:'smartphone', name, type:tail||'Cell'};
  if(/desk/i.test(base)) return {icon:'monitor', name, type:tail||'Desk phone'};
  return {icon:'phone', name, type:tail||'Phone number'};
}
/* one-glance destination for an extension card */
function cfvGlance(e, off){
  const dests=e.dests||[];
  const marks=dests.slice(0,4).map(s=>{
    const str=String(s);
    if(/mobile app|joel app/i.test(str)) return 'smartphone';
    if(/desk/i.test(str)) return 'monitor';
    if(/cell|mobile/i.test(str)) return 'smartphone';
    if(/\d{3}/.test(str)) return 'phone';
    return 'user';
  });
  if(off){
    if(e.awayMode==='forward' && e.awayTo) return {marks:[], label:`Forwarding to Ext ${e.awayTo}`};
    if(e.awayMode==='away') return {marks:[], label:'Plays away greeting'};
    return {marks:[], label:'Callers go to voicemail'};
  }
  if(dests.length===0) return {marks:[], label:'Voicemail'};
  return {marks, label:`Rings ${dests.length}`};
}

/* ---------- Call flow: the clean visual on the left (click a step to manage it) ---------- */
function CopyGlyph(){ return (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>); }
function CallFlowView({ greeting, hours, numbers, extensions, businessName, simple, forward, hoursShort, onSelectForward, onSelectVm, onSelectForwarding, justAdded, away, awayMap, sel, selExtNum, onSelectNumbers, onSelectDirectory, onSelectGreeting, onSelectExt, onToggleAway, onToggleFwd, onAddExtension, onDeselect }){
  const k = sel && sel.kind;
  const [playing,setPlaying]=useState(false);
  useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),1800); return ()=>clearTimeout(t); },[playing]);
  const renderExtCard = (e) => {
    const off = !!(awayMap && awayMap[String(e.number)]) || e.status==='disabled';
    const g = cfvGlance(e, off);
    const isSel = k==='ext' && String(selExtNum)===String(e.number);
    return (
      <div key={e.id} className={`cflow-ext${off?' off':''}${isSel?' is-sel':''}${justAdded===e.id?' is-new':''}`} role="button" tabIndex={0}
        onClick={()=>onSelectExt(e)}
        onKeyDown={(ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); onSelectExt(e); } }}>
        <div className="cflow-exthead">
          <span className="cflow-num">{e.number}</span><b>{e.name}</b>
          <button className={`cflow-stat${off?' away':''}`}
            style={{marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px',
              borderRadius:20, fontWeight:800, fontSize:'.66rem', letterSpacing:'.05em', textTransform:'uppercase',
              whiteSpace:'nowrap', flexShrink:0, cursor:'pointer',
              background: off?'#fdeceb':'#e6f7ef', color: off?'#e0413a':'#1bb56a',
              border:'1px solid '+(off?'#f3cdca':'#cfe9db')}}
            title={off?'Away - callers go to voicemail. Click to turn forwarding back on.':'Active - forwarding is on. Click to set away.'}
            onClick={(ev)=>{ ev.stopPropagation(); onToggleFwd && onToggleFwd(e); }}>
            <i style={{width:7, height:7, borderRadius:'50%', background: off?'#e0413a':'#1bb56a'}}></i>{off?'Away':'Active'}
          </button>
        </div>
        <div className="cflow-destrow">
          {g.marks.length>0 && <span className="cflow-avs">{g.marks.map((m,i)=><i key={i}><Icon name={m} style={{width:12,height:12}}/></i>)}</span>}
          <span className="cflow-destn">{g.label}</span>
        </div>
      </div>
    );
  };
  return (
    <div className="cflow" onClick={(e)=>{ if(e.target===e.currentTarget && onDeselect) onDeselect(); }}>
      <div className="cflow-h">
        <h1>Phone System</h1>
        <p>Everything that happens when someone calls {businessName}. Click any step to manage it.</p>
      </div>

      {numbers && numbers.length>0 && (<>
        <div className="cflow-tier cflow-tier-numbers">Your Numbers</div>
        <div className={`cflow-numbers${sel&&sel.kind==='numbers'?' is-sel':''}`} role="button" tabIndex={0}
          onClick={onSelectNumbers}
          onKeyDown={(ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); onSelectNumbers&&onSelectNumbers(); } }}>
          <span className="cflow-numic"><Icon name="phone"/></span>
          <div className="cflow-numlist2">
            {numbers.slice(0,2).map(n=>(
              <div className="cflow-numline2" key={n.num}>
                <b>{String(n.num).replace(/^\+1\s*/,'')}</b>
                <span className="cflow-numtag">{n.label}</span>
              </div>
            ))}
            {numbers.length>2 && <div className="cflow-nummore">+{numbers.length-2} more number{numbers.length-2>1?'s':''}</div>}
          </div>
          <Icon name="chevright"/>
        </div>
        <div className="cflow-line"></div>
      </>)}

      <div className="cflow-tier cflow-tier-greet">Main Greeting</div>
      <div className={`cflow-greet${away?' is-away':' is-open'}${k==='greeting'?' is-sel':''}`}>
        <button className="cflow-greetmain" onClick={onSelectGreeting}>
          <span className="cflow-tx"><b>Main greeting</b><span>{away?'Away greeting on':(hoursShort||'Open Mon–Fri, 9–5')}</span></span>
        </button>
        <button className={`cflow-playbtn${away?' away':''}${playing?' playing':''}`} onClick={()=>setPlaying(p=>!p)}
          title={`Play ${away?'after-hours':'main'} greeting`} aria-label={`Play ${away?'after-hours':'main'} greeting`}>
          <Icon name={playing?'pause':'play'}/>
        </button>
      </div>
      <div className="cflow-line"></div>

      {simple ? (
      <React.Fragment>
        <div className="cflow-tier">Call forwarding</div>
        <div className={`cflow-numbers${sel&&sel.kind==='ext'?' is-sel':''}`} role="button" tabIndex={0}
          onClick={onSelectForwarding}
          onKeyDown={(ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); onSelectForwarding&&onSelectForwarding(); } }}>
          <span className="cflow-numic"><Icon name="forward"/></span>
          <div className="cflow-numlist2">
            <div className="cflow-numline2"><b>Call forwarding</b><span className="cflow-numtag">{away?'Away':'On'}</span></div>
            <div className="cflow-nummore">{away?'Paused - callers go to voicemail':'Rings your phone, then voicemail'}</div>
          </div>
          <Icon name="chevright"/>
        </div>
        <div className="cflow-fwd-wrap" style={{marginTop:16}}>
          <button className="cflow-add" onClick={onAddExtension}><Icon name="plus"/>Add an extension</button>
          <p className="cflow-simplenote">You’re on a simple setup - one number rings your phone. Add an extension to route callers to departments or specific people.</p>
        </div>
      </React.Fragment>
      ) : (
      <React.Fragment>
        <div className="cflow-tier">Extensions</div>
        <div className="cflow-exts">
        {extensions.filter(e=>Number(e.number)<100).map(renderExtCard)}
        <div className={`cflow-ext cflow-ext-dir${sel&&sel.kind==='directory'?' is-sel':''}`} role="button" tabIndex={0}
          onClick={onSelectDirectory}
          onKeyDown={(ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); onSelectDirectory&&onSelectDirectory(); } }}>
          <div className="cflow-exthead">
            <span className="cflow-key dir">9</span><b>Directory</b>
            <span className="cflow-dirtag">Dial by name</span>
          </div>
          <div className="cflow-destrow">
            <span className="cflow-avs"><i><Icon name="mic" style={{width:12,height:12}}/></i></span>
            <span className="cflow-destn">Say or spell a name</span>
          </div>
        </div>
        {extensions.filter(e=>Number(e.number)>=100).map(renderExtCard)}
        <button className="cflow-add" onClick={onAddExtension}><Icon name="plus"/>Add an extension</button>
        </div>
      </React.Fragment>
      )}
    </div>
  );
}

/* ---------- clean, opinionated Alerts: email is the hero, Slack a nudge ---------- */
function ExtAlerts({ ext, setNotif, setSlackChannel, onManageSlack, webhookCfg, onManageWebhook }){
  const vm = ext.notifications.voicemail;
  const missed = ext.notifications.missed;
  const emails = vm.emailTo || [];
  const ch = ext.notifications.slackChannel;
  const SLACK = ['#sales-team','#front-desk','#general'];
  const [adding,setAdding]=useState(false);
  const [draft,setDraft]=useState('');
  const addEmail=()=>{ const v=draft.trim(); if(!v) return; setNotif('voicemail','emailTo',[...emails,v]); setDraft(''); setAdding(false); };
  const removeEmail=(em)=>setNotif('voicemail','emailTo',emails.filter(x=>x!==em));
  return (
    <div className="alerts">
      {/* EMAIL - the default; addresses managed right here */}
      <div className={`alert-card${vm.email?' on':''}`}>
        <div className="alert-head">
          <span className="alert-ic mail"><Icon name="mail"/></span>
          <div className="alert-tx">
            <b>Email me new voicemails</b>
            <span>With a transcript, the moment they land</span>
          </div>
          <Toggle on={vm.email} onChange={v=>setNotif('voicemail','email',v)}/>
        </div>
        {vm.email && (
          <div className="alert-body">
            <div className="email-chips">
              {emails.map(em=>(
                <span className="email-chip" key={em}>{em}
                  <button onClick={()=>removeEmail(em)} aria-label={'Remove '+em}><Icon name="x"/></button>
                </span>
              ))}
              {adding ? (
                <span className="email-addrow">
                  <input autoFocus value={draft} placeholder="name@business.com"
                    onChange={e=>setDraft(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter') addEmail(); if(e.key==='Escape') setAdding(false); }}/>
                  <button className="email-confirm" onClick={addEmail}>Add</button>
                </span>
              ) : (
                <button className="email-add" onClick={()=>setAdding(true)}><Icon name="plus"/>Add email</button>
              )}
            </div>
            <label className="alert-inline">
              <Toggle sm on={!!missed.email} onChange={v=>setNotif('missed','email',v)}/>
              <span>Also email missed-call alerts</span>
            </label>
          </div>
        )}
      </div>

      {/* SLACK - channel lives inside the card, with a path to settings */}
      <div className={`alert-card${vm.slack?' on':''}`}>
        <div className="alert-head">
          <span className="alert-ic slack"><Icon name="slack"/></span>
          <div className="alert-tx">
            <b>Post to Slack</b>
            <span>So the whole team sees them in seconds</span>
          </div>
          <span className="alert-rec">Recommended</span>
          <Toggle on={vm.slack} onChange={v=>setNotif('voicemail','slack',v)}/>
        </div>
        {vm.slack && (
          <div className="alert-body">
            <div className="alert-channelrow">
              <span className="alert-lbl">Voicemails</span>
              <select className="select" value={ch||''} onChange={e=>setSlackChannel(e.target.value)}>
                <option value="">Choose a channel…</option>
                {SLACK.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <button className="alert-manage" onClick={onManageSlack}>Slack settings</button>
            </div>
            <label className="alert-inline">
              <Toggle sm on={!!missed.slack} onChange={v=>setNotif('missed','slack',v)}/>
              <span>Also post missed calls</span>
            </label>
            {missed.slack && (
              <div className="alert-channelrow">
                <span className="alert-lbl">Missed calls</span>
                <select className="select" value={missed.channel||''} onChange={e=>setNotif('missed','channel',e.target.value)}>
                  <option value="">Same channel</option>
                  {SLACK.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const AWAY_TEXT = "Thanks for calling Smilebar. You’ve reached us outside our business hours. Leave your name, number, and a brief message after the tone, and we’ll call you back the next business day.";

/* ---------- Greeting pane: same tabbed convention as an extension ---------- */
function GreetingPane({ businessName='Smilebar', greeting, awayText, away, onToggleAway, hours, scheduleEl, extensions }){
  const GreetingRow = window.GreetingRow;
  const [tab,setTab]=React.useState('main');
  const [editHours,setEditHours]=React.useState(false);
  const [holidays,setHolidays]=React.useState([
    { id:'h1', name:'New Year’s Day',   date:'Jan 1',  observed:true },
    { id:'h2', name:'Memorial Day',     date:'May 25', observed:true },
    { id:'h3', name:'Independence Day', date:'Jul 4',  observed:true },
    { id:'h4', name:'Labor Day',        date:'Sep 7',  observed:true },
    { id:'h5', name:'Thanksgiving',     date:'Nov 26', observed:true },
    { id:'h6', name:'Christmas Eve',    date:'Dec 24', observed:true },
    { id:'h7', name:'Christmas Day',    date:'Dec 25', observed:true },
  ]);
  const [closures,setClosures]=React.useState([
    { id:'c1', name:'Company offsite', from:'2026-08-14', to:'2026-08-15' },
  ]);
  const [addClo,setAddClo]=React.useState(false);
  const [cloName,setCloName]=React.useState(''); const [cloFrom,setCloFrom]=React.useState(''); const [cloTo,setCloTo]=React.useState('');
  const MG_MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtClo=(d)=>{ if(!d) return ''; const [y,m,dd]=d.split('-').map(Number); return `${MG_MO[m-1]} ${dd}, ${y}`; };
  const fmtCloRange=(from,to)=>{ if(!from) return ''; if(!to||to===from) return fmtClo(from);
    const [fy,fm,fd]=from.split('-').map(Number); const [ty,tm,td]=to.split('-').map(Number);
    if(fy===ty&&fm===tm) return `${MG_MO[fm-1]} ${fd}–${td}, ${fy}`;
    return `${fmtClo(from)} – ${fmtClo(to)}`; };
  const addClosure=()=>{ if(!cloFrom) return; setClosures(cs=>[...cs,{id:'c'+Date.now(),name:cloName.trim()||'Closed',from:cloFrom,to:cloTo||cloFrom}]); setAddClo(false); setCloName(''); setCloFrom(''); setCloTo(''); };
  const mainSug=[
    `Thank you for calling ${businessName}. Please listen closely - our menu has changed.`,
    `Thanks for calling ${businessName}! Stay on the line and we’ll connect you.`,
    `You’ve reached ${businessName}. One moment while we connect your call.`,
  ];
  const awaySug=[
    `Thanks for calling ${businessName}. You’ve reached us outside our business hours. Leave your name, number, and a brief message, and we’ll call you back the next business day.`,
    `Thanks for calling ${businessName}. We’re closed right now. If you have an urgent issue, press 7 to reach our on-call line. Otherwise, leave a message after the tone and we’ll get back to you the next business day.`,
    `You’ve reached ${businessName}. Our office is closed and the team can’t take your call right now. Please leave a message, or call back during regular business hours and we’ll be glad to help.`,
  ];
  return (
    <aside className="sysmng">
      <header className="sysmng-h">
        <span className="sysmng-ic g"><Icon name="audiolines"/></span>
        <div className="sysmng-t"><h2>Main greeting</h2><span className="sysmng-sub">The first thing callers hear</span></div>
      </header>
      <div className="sysmng-tabs">
        <button className={tab==='main'?'on':''} onClick={()=>setTab('main')}><Icon name="message"/>Main greeting</button>
        <button className={tab==='closed'?'on':''} onClick={()=>setTab('closed')}><Icon name="clock"/>After-hours</button>
      </div>
      <div className="sysmng-b">
        <div className="pane-sec"><div className="pane-sec-b">
          {tab==='main' && (
            <GreetingRow nameField bizName={businessName} bizSay="Smile Bar" voice="Aria" suggestions={mainSug}/>
          )}
          {tab==='closed' && (
            <React.Fragment>
              <div className="mg-awaynow">
                <div className="mg-awaynow-tx">
                  <b>Switch to after-hours now</b>
                  <span>Normally this follows your business hours. Turn on to play the after-hours greeting right away - handy for an unexpected closure.</span>
                </div>
                <Toggle on={away} onChange={onToggleAway}/>
              </div>
              <div className="note info" style={{marginBottom:16}}><Icon name="info"/><span>Plays automatically <b>outside your business hours</b> and on holidays you observe. During open hours, callers hear your main greeting - your business name carries over, so there’s nothing to re-enter here.</span></div>
              <GreetingRow text={awayText} voice="Aria" suggestions={awaySug}/>
              <div className="mg-hours">
                <div className="mg-hours-head">
                  <div className="mg-hours-tx">
                    <div className="mg-after-h">Business hours</div>
                    <div className="mg-hours-sum"><Icon name="clock"/> {hours}</div>
                  </div>
                  <button className="btn btn-secondary sm" onClick={()=>setEditHours(e=>!e)}>{editHours?'Done':'Edit'}</button>
                </div>
                {editHours && <div className="mg-hours-edit">{scheduleEl}</div>}
              </div>
              <div className="mg-hol">
                <div className="mg-hol-h">Holiday closures</div>
                <div className="mg-hol-list">
                  {holidays.map(h=>(
                    <div className="mg-hol-row" key={h.id}>
                      <span className="hol-ic"><Icon name="calendar"/></span>
                      <div className="mg-hol-main"><b>{h.name}</b><span>{h.date} <em className="mg-hol-every">every year</em></span></div>
                      <Toggle sm on={h.observed} onChange={(v)=>setHolidays(hs=>hs.map(x=>x.id===h.id?{...x,observed:v}:x))}/>
                    </div>
                  ))}
                  {closures.map(c=>(
                    <div className="mg-hol-row" key={c.id}>
                      <span className="hol-ic custom"><Icon name="calendar"/></span>
                      <div className="mg-hol-main"><b>{c.name}</b><span>{fmtCloRange(c.from,c.to)}</span></div>
                      <button className="hol-x" onClick={()=>setClosures(cs=>cs.filter(x=>x.id!==c.id))} aria-label="Remove"><Icon name="x"/></button>
                    </div>
                  ))}
                </div>
                {addClo ? (
                  <div className="avail-add">
                    <input className="input" autoFocus value={cloName} onChange={e=>setCloName(e.target.value)} placeholder="Reason - e.g. Company offsite"/>
                    <div className="avail-add-dates">
                      <label><span>From</span><input className="input" type="date" value={cloFrom} onChange={e=>setCloFrom(e.target.value)}/></label>
                      <label><span>To</span><input className="input" type="date" value={cloTo} onChange={e=>setCloTo(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addClosure(); }}/></label>
                    </div>
                    <div className="avail-add-acts">
                      <button className="btn btn-ghost sm" onClick={()=>{ setAddClo(false); setCloName(''); setCloFrom(''); setCloTo(''); }}>Cancel</button>
                      <button className="btn btn-primary sm" disabled={!cloFrom} onClick={addClosure}>Add</button>
                    </div>
                  </div>
                ) : (
                  <button className="add-row" onClick={()=>setAddClo(true)} style={{marginTop:10}}><span className="plus"><Icon name="plus"/></span> Add a custom closure date</button>
                )}
                <p className="mg-hol-note">On these dates, callers hear your after-hours greeting all day. National holidays repeat every year; custom closures are one-time dates.</p>
              </div>
            </React.Fragment>
          )}
        </div></div>
      </div>
    </aside>
  );
}

/* ---------- a clean, clearly-headed section inside the pane ---------- */
function PaneSection({ title, sub, children }){
  return (
    <section className="pane-sec">
      <div className="pane-sec-h"><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
      <div className="pane-sec-b">{children}</div>
    </section>
  );
}

/* ---------- System map management pane (reuses the real extension panels) ---------- */
const EXT_TABS = [
  { id:'configure', icon:'route',      label:'Configure' },
  { id:'greeting',  icon:'audiolines', label:'Greeting' },
  { id:'advanced',  icon:'settings',   label:'Advanced' },
];
function NumbersManagePane({ numbers, extensions }){
  const list = numbers||[];
  const [open,setOpen]=useState(null);
  const [copied,setCopied]=useState(null);
  const [routes,setRoutes]=useState(()=> list.reduce((m,n)=>{ m[n.num]=n.routesTo||'main'; return m; },{}));
  const [labels,setLabels]=useState(()=> list.reduce((m,n)=>{ m[n.num]=n.label||''; return m; },{}));
  const [savedLabels,setSavedLabels]=useState(()=> list.reduce((m,n)=>{ m[n.num]=n.label||''; return m; },{}));
  const [labelSaved,setLabelSaved]=useState(null);
  const saveLabel=(num)=>{ setSavedLabels(s=>({...s,[num]:labels[num]})); setLabelSaved(num); setTimeout(()=>setLabelSaved(l=>l===num?null:l),1600); };
  const copyNum=(num)=>{ setCopied(num); try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(num).catch(()=>{}); } }catch(e){} setTimeout(()=>setCopied(c=>c===num?null:c),1300); };
  const routeOpts=[{v:'main',l:'Plays main greeting'}, ...(extensions||[]).map(e=>({v:String(e.number),l:`Forwards to Ext. ${e.number} ${e.name}`}))];
  const smsMeta=(s)=> s==='approved'?{cls:'on',txt:'Texting on'} : s==='pending'?{cls:'pend',txt:'Texting pending'} : {cls:'off',txt:'Calls only'};
  const routeLabel=(n)=>{ const v=routes[n.num]||'main'; const o=routeOpts.find(x=>x.v===v); return o?o.l:'Plays main greeting'; };
  return (
    <div className="nmp">
      {list.map(n=>{ const isOpen=open===n.num; const sm=smsMeta(n.sms); return (
        <div className={`nmp-card${isOpen?' open':''}`} key={n.num}>
          <button className="nmp-head" onClick={()=>setOpen(o=>o===n.num?null:n.num)}>
            <span className="nmp-ic"><Icon name="phone"/></span>
            <span className="nmp-main">
              <span className="nmp-numline">
                <b>{n.num}</b>
                <span className={`nmp-copy${copied===n.num?' done':''}`} role="button" tabIndex={0}
                  title="Copy number" aria-label="Copy number"
                  onClick={(e)=>{ e.stopPropagation(); copyNum(n.num); }}
                  onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); copyNum(n.num); } }}>
                  {copied===n.num ? <Icon name="check"/> : <CopyGlyph/>}
                </span>
              </span>
              <span className="nmp-sub">{(savedLabels[n.num]||n.label)} · {routeLabel(n)}</span>
            </span>
            <span className={`nmp-sms ${sm.cls}`}>{sm.txt}</span>
            <Icon name="chevright"/>
          </button>
          {isOpen && (
            <div className="nmp-body">
              <div className="nmp-field">
                <span className="nmp-lbl">Label</span>
                <div className="nmp-saverow">
                  <input className="input" value={labels[n.num]||''} onChange={e=>setLabels(l=>({...l,[n.num]:e.target.value}))} placeholder="e.g. Local, Toll-free, Marketing"/>
                  {labelSaved===n.num
                    ? <span className="nmp-saved"><Icon name="check"/>Saved</span>
                    : <button className="btn btn-secondary sm nmp-savebtn" disabled={(labels[n.num]||'')===(savedLabels[n.num]||'')} onClick={()=>saveLabel(n.num)}>Save</button>}
                </div>
                <span className="nmp-help">A name for you - callers never see it.</span>
              </div>
              <div className="nmp-field">
                <span className="nmp-lbl">When someone calls it</span>
                <select className="select" value={routes[n.num]||'main'} onChange={e=>setRoutes(r=>({...r,[n.num]:e.target.value}))}>
                  {routeOpts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
              <div className="nmp-field">
                <span className="nmp-lbl">Caller ID name</span>
                <div className="nmp-cidnote"><Icon name="building"/><span><b>Smilebar</b> · same on every number. Change it in Business profile.</span></div>
              </div>
              <div className="nmp-field">
                <span className="nmp-lbl">Texting</span>
                <div className="nmp-textrow">
                  <span className={`nmp-sms ${sm.cls}`}>{sm.txt}</span>
                  {n.sms==='pending' && <button className="btn btn-secondary sm">Finish registration</button>}
                  {!n.sms && <button className="btn btn-secondary sm">Enable texting</button>}
                </div>
              </div>
              <div className="nmp-foot">
                <span className="nmp-type">{n.type} number</span>
                <button className="nmp-remove"><Icon name="trash"/>Remove or port out</button>
              </div>
            </div>
          )}
        </div>
      ); })}
      <button className="nmp-add"><Icon name="plus"/>Add or port a number</button>
    </div>
  );
}

/* ---------- Directory (dial-by-name) - Ext 9 - managed in the Call flow ---------- */
function DirectoryPane({ extensions }){
  const roster=(extensions||[]).filter(e=>e.number!==0);
  const [on,setOn]=useState(true);
  const [voice,setVoice]=useState(true);
  const [spell,setSpell]=useState(true);
  const [noMatch,setNoMatch]=useState('operator');
  const [listing,setListing]=useState(()=>{ const m={}; roster.forEach(e=>{ m[e.id]=true; }); return m; });
  const NM=[
    ['operator','Send to the Operator (Ext 0)','A person picks up instead of leaving the caller stuck.'],
    ['replay','Replay the main menu','Read the menu again so they can try another option.'],
    ['hangup','Play a goodbye and hang up','Only if you don’t want unmatched callers routed anywhere.'],
  ];
  return (
    <aside className="sysmng">
      <header className="sysmng-h">
        <span className="sysmng-key">9</span>
        <div className="sysmng-t"><h2>Directory</h2><span className="sysmng-sub">Dial-by-name · callers press 9</span></div>
      </header>
      <div className="sysmng-b">
        <div className="dir-hero">
          <div className="dir-hero-tx">
            <b>Dial-by-name directory</b>
            <span>{on?'Callers reach a teammate by saying or spelling their name - no extension number to remember.':'Turned off - pressing 9 follows your “no match” rule below.'}</span>
          </div>
          <Toggle on={on} onChange={setOn}/>
        </div>
        {on && <>
          <div className="ss-grouph">How callers search</div>
          <div className="dir-card">
            <div className="dir-row">
              <span className="dir-ic"><Icon name="mic"/></span>
              <div className="dir-row-tx"><b>Say a name</b><span>“Sales,” “Dr. Niaraki,” “Bob” - JOEL listens and connects.</span></div>
              <Toggle on={voice} onChange={setVoice}/>
            </div>
            <div className="dir-row">
              <span className="dir-ic"><Icon name="hashnum"/></span>
              <div className="dir-row-tx"><b>Spell on the keypad</b><span>Type the first letters of a name (B-O-B).</span></div>
              <Toggle on={spell} onChange={setSpell}/>
            </div>
          </div>

          <div className="ss-grouph">Who’s listed <span className="dir-sub2">- built from your extension names</span></div>
          <div className="dir-card">
            {roster.map(e=>{ const disabled=!e.enabled||e.status==='disabled'; const isOn=!disabled&&listing[e.id]; return (
              <div className={`dir-row${disabled?' off':''}`} key={e.id}>
                <span className="dir-key">{e.number}</span>
                <div className="dir-row-tx"><b>{e.name}</b><span>{disabled?'Extension off - never listed':isOn?`Spoken as “${e.name}”`:'Hidden from name search'}</span></div>
                {disabled ? <span className="dir-offtag">Off</span> : <Toggle on={isOn} onChange={(v)=>setListing(s=>({...s,[e.id]:v}))}/>}
              </div>
            ); })}
          </div>

          <div className="ss-grouph">If JOEL can’t find a match</div>
          <div className="dir-choices">
            {NM.map(([v,t,d])=>(
              <button key={v} className={`dir-choice${noMatch===v?' on':''}`} onClick={()=>setNoMatch(v)}>
                <span className="dir-choice-ck">{noMatch===v && <Icon name="check" sw={3}/>}</span>
                <span className="dir-choice-tx"><b>{t}</b><span>{d}</span></span>
              </button>
            ))}
          </div>
        </>}
      </div>
    </aside>
  );
}
function SysManagePane({ sel, ext, bodies, panels, businessName, simple, forward, hoursShort, greeting, hours, numbers, extensions, away, onToggleAway, onEditGreeting, onManageNumbers, onGoIntegrations, onExpand, scheduleEl, awayText }){
  const [paneTab, setPaneTab] = React.useState('configure');
  const [greetMode, setGreetMode] = React.useState('ring');
  if(!sel && simple){
    return (
      <aside className="sysmng sysmng-empty">
        <div className="sysempty">
          <span className="sysempty-art"><EmptyArt name="flow" /></span>
          <h2>Your call setup, at a glance</h2>
          <p>Pick your number, greeting, or call forwarding on the left to manage it.</p>
          <button className="syschat"><Icon name="message"/> Need help? Chat with us now.</button>
        </div>
      </aside>
    );
  }
  if(!sel){
    return (
      <aside className="sysmng sysmng-empty">
        <div className="sysempty">
          <span className="sysempty-art"><EmptyArt name="flow" /></span>
          <h2>Your system is managed here</h2>
          <p>Pick your main greeting or any extension on the left to set what callers hear and exactly where calls go.</p>
          <button className="syschat"><Icon name="message"/> Need help? Chat with us now.</button>
        </div>
      </aside>
    );
  }
  const s = sel;

  if(s.kind==='numbers'){
    return (
      <aside className="sysmng">
        <header className="sysmng-h">
          <span className="sysmng-ic n"><Icon name="hashnum"/></span>
          <div className="sysmng-t"><h2>Your numbers</h2><span className="sysmng-sub">The phone numbers customers call</span></div>
        </header>
        <div className="sysmng-b">
          <NumbersManagePane numbers={numbers} extensions={extensions}/>
        </div>
      </aside>
    );
  }
  if(s.kind==='directory'){
    return <DirectoryPane extensions={extensions}/>;
  }
  if(s.kind==='greeting'){
    return <GreetingPane businessName={businessName} greeting={greeting} awayText={awayText} away={away} onToggleAway={onToggleAway} hours={hours} scheduleEl={scheduleEl} extensions={extensions}/>;
  }
  // extension - Configure (who rings + alerts) · Greeting · Advanced
  const body = (bodies && bodies[paneTab]) || (bodies && bodies.configure);
  return (
    <aside className="sysmng">
      <header className="sysmng-h">
        {simple ? <span className="sysmng-ic g"><Icon name="forward"/></span> : <span className="sysmng-key">{ext.number}</span>}
        <div className="sysmng-t"><h2>{simple ? 'Call forwarding' : ext.name}</h2><span className="sysmng-sub">{simple ? 'Where calls go when someone calls you' : 'Extension '+ext.number}</span></div>
      </header>
      <div className="sysmng-tabs">
        {EXT_TABS.map(r=>(
          <button key={r.id} className={paneTab===r.id?'on':''} onClick={()=>setPaneTab(r.id)}><Icon name={r.icon}/>{r.label}</button>
        ))}
      </div>
      <div className="sysmng-b">{body}</div>
    </aside>
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
  const [screen,setScreen]=useState('sysmap'); // open on the System map (the visual overview)
  const [setupDismissed,setSetupDismissed]=useState(false);
  const [sysMode,setSysMode]=useState('phones'); // 'phones'|'greet'|'menu'
  const [sysGreeting,setSysGreeting]=useState('Thanks for calling Smilebar. Please hold or press 0 and we’ll connect you.');
  const [extEnabled,setExtEnabled]=useState(false); // user explicitly turned on extensions
  const [sysAway,setSysAway]=useState(false); // business-wide "away" set from the Main greeting card
  const [mapSel,setMapSel]=useState(null); // System map: which node is open (null = welcome/empty pane on load)
  const [bizHours,setBizHours]=useState({...SEED.officeHours, mode:'custom'}); // business hours for the main-greeting Schedule tab
  const [webhookCfg,setWebhookCfg]=useState({ url:'', secret:'', events:{missed:true,voicemail:true,text:false}, connected:false }); // global webhook endpoint, shared by Integrations + extension Alerts
  const [extraExts,setExtraExts]=useState([]); // extensions the owner adds from the Extensions screen
  const [justAdded,setJustAdded]=useState(null); // id of a just-added extension (one-time glow on the tree)
  const [addExtOpen,setAddExtOpen]=useState(false);
  const [simpleSys,setSimpleSys]=useState(false); // simple (one forwarding number) vs multi-extension; driven by the active company
  const [companyId,setCompanyId]=useState('smilebar');
  const company = COMPANIES.find(c=>c.id===companyId) || COMPANIES[0];
  const businessName = company.name;
  const isMember = company.role==='member';
  const me = isMember ? (company.me||'You') : 'Bob Stevens';
  // a member can answer/manage more than one extension - their own direct line plus any shared team lines
  const memberExts = isMember
    ? (company.myExts || [{number:company.myExt||101, name:company.me, kind:'personal'}]).map(m=>{
        const base = EXTENSIONS.find(e=>e.number===m.number) || EXTENSIONS[0];
        return { ...base, id:'me'+m.number, number:m.number, name:m.name, enabled:true, status:'active',
          forwards:(m.forwards!=null?m.forwards:base.forwards), _kind:m.kind, _sub:m.sub, _team:m.team };
      })
    : [];
  const onMyOwn = isMember && ext && Number(ext.number)===(company.myExt||101);
  const curMyExt = memberExts.find(e=>Number(e.number)===Number(ext&&ext.number)) || {};
  const switchCompany=(id)=>{
    const c = COMPANIES.find(x=>x.id===id) || COMPANIES[0];
    setCompanyId(id);
    setSimpleSys(!!c.simple);
    setExtraExts([]);
    setMapSel(null);
    if(c.role==='member'){
      setScreen('myext'); setView('list'); // a team member lands on the list of extensions they can answer
    } else {
      setScreen('sysmap'); // owners land on the Phone System so the change is visible
    }
  };
  const addExtension=({number,name,forward})=>{
    const dests = forward ? [`+1 ${forward}`] : [];
    const newId='e'+number+'_'+Date.now();
    setExtraExts(list=>[...list,{ id:newId, number:(/^\d+$/.test(number)?Number(number):number), name,
      enabled:true, status:'active', forwards:dests.length, routing:'order', access:1, transferExp:'ring', dests, vm:{ emails:[], slack:null } }]);
    setSimpleSys(false); // adding an extension converts a simple system into an extension-based one
    setAddExtOpen(false);
    setJustAdded(newId);
    setTimeout(()=>setJustAdded(null), 2400);
  };
  const expandToExtensions=()=>{ addExtension({ number:'2', name:'Sales', forward:'(617) 555-0143' }); };
  const [ovVariant,setOvVariant]=useState('v2'); // System Overview compare toggle (v2 = health+actions, v1 = setup summary)
  // "extensions" appears in the product only when there's a menu OR the user opted in
  const hasExtensions = true;
  const [actFilter,setActFilter]=useState('all');
  const [actExt,setActExt]=useState('all');
  const [callsSub,setCallsSub]=useState('all'); // controlled Calls sub-filter: all|missed|incoming|outgoing|vm
  const [callsSeen,setCallsSeen]=useState({}); // extNumber -> true once the calls log has been viewed (clears "missed" hint)
  const [contactFilter,setContactFilter]=useState(null); // {num,name} - a CRM lens over the activity screens
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
  const scopedActivity = isMember ? {
    ...activity,
    calls: activity.calls.filter(c=>String(c.ext)===String(company.myExt||101)),
    voicemails: activity.voicemails.filter(v=>String(v.ext)===String(company.myExt||101)),
  } : activity;
  const teammates=Array.from(new Set([...ext.permissions.map(p=>p.name), ...TEAM_POOL.map(p=>p.name)]));
  const unreadSms=(()=>{ const byNum={}; activity.texts.forEach(t=>{(byNum[t.num]=byNum[t.num]||[]).push(t);}); return Object.keys(byNum).filter(num=>{ const last=byNum[num].slice().sort((a,b)=>a.ts-b.ts).pop(); return last.dir==='in' && !smsRead[num] && !smsArchived[num]; }).length; })();
  const missedUnseen = activity.calls.filter(c=>(c.dir==='missed' || (c.dir==='in' && c.outcome!=='answered')) && !callsSeen[c.ext]).length;
  const navBadges = { inbox: unreadSms, calls: missedUnseen };
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
    else if(id==='sms-reg'){ setScreen('sms-reg'); }
    else if(id==='integrations'){ setScreen('integrations'); }
    else if(id==='whatsapp'){ setScreen('whatsapp'); }
    else if(id==='calls'){ setScreen('calls'); setActExt('all'); setCallsSub('all'); setCallsSeen(allExtsSeen); }
    else if(id==='inbox'){ setScreen('sms'); }
    else if(id==='numbers'){ setScreen('numbers'); setView('list'); }
    else if(id==='greetings'){ setScreen('greetings'); setView('list'); }
    else if(id==='phonesys'){ setScreen('phonesys'); setView('list'); }
    else if(id==='sysmap'){ setScreen('sysmap'); setView('list'); }
    else if(id==='extensions'){ setScreen('extensions'); setView('list'); }
    else if(id==='settings'){ setScreen('settings'); setView('list'); }
    else if(id==='billing'){ setScreen('billing'); setView('list'); }
    else if(id==='myext'){ setScreen('myext'); setView('list'); }
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
    : screen==='sms-reg' ? 'sms-reg'
    : screen==='integrations' ? 'integrations'
    : screen==='whatsapp' ? 'whatsapp'
    : screen==='sms' ? 'inbox'
    : screen==='settings' ? 'settings'
    : screen==='billing' ? 'billing'
    : screen==='sysmap' ? 'sysmap'
    : screen==='numbers' ? 'numbers'
    : screen==='greetings' ? 'greetings'
    : screen==='calls' || screen==='voicemails' ? 'calls'
    : screen==='myext' ? 'myext'
    : 'extensions';
  const [hmenu,setHmenu]=useState(false);
  const hmenuRef = useRef(null);
  // universal "away" flag, keyed by extension number - shared by header, list, and Schedule panel
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
      onEdit={(d)=>setDestModal({editing:d})} onRemove={removeDest} openAddDest={(t)=>setDestModal(t?{type:t}:{})}/>,
    greetings:<ExtensionGreetings ext={ext} patch={patch} away={awayMap[ext.number]||null} onGoSchedule={()=>setTab('schedule')}/>,
    schedule:<AvailabilityPanel ext={ext} patch={patch} away={awayMap[ext.number]||null} onSetAway={(obj)=>setAway(ext.number,obj)}/>,
    notifications:<NotificationsPanel ext={ext} setNotif={setNotif} setSlackChannel={setSlackChannel}/>,
    general:(
      <React.Fragment>
        <GeneralPanel ext={ext} patch={patch}/>
        <PermissionsPanel ext={ext} removePerm={removePerm} updatePerm={updatePerm} reinvitePerm={reinvitePerm} openAddPeople={()=>setPeopleModal(true)}/>
        <DangerZone ext={ext}/>
      </React.Fragment>
    ),
  };

  const paneBodies={
    configure:(
      <React.Fragment>
        <PaneSection title="Call forwarding" sub={`Who rings when someone calls ${ext.name}.`}>
          <RoutingPanel section="basic" solo={simpleSys} ext={ext} patch={patch} onToggle={toggleDest} onScreening={screenDest} onMove={moveDest}
            onEdit={(d)=>setDestModal({editing:d})} onRemove={removeDest} openAddDest={(t)=>setDestModal(t?{type:t}:{})}/>
        </PaneSection>
        <PaneSection title="Availability" sub={`Whether ${ext.name} is taking calls right now.`}>
          <AvailabilityPanel ext={ext} patch={patch} solo={simpleSys} away={awayMap[ext.number]||null} onSetAway={(obj)=>setAway(ext.number,obj)}/>
        </PaneSection>
        <PaneSection title="Alerts" sub="Where new voicemails and missed calls show up.">
          <ExtAlerts ext={ext} setNotif={setNotif} setSlackChannel={setSlackChannel} onManageSlack={()=>onNav('integrations')} webhookCfg={webhookCfg} onManageWebhook={()=>onNav('integrations')}/>
        </PaneSection>
      </React.Fragment>
    ),
    greeting:(
      <PaneSection title="Greeting" sub="What callers hear on this extension.">
        <ExtensionGreetings ext={ext} patch={patch} away={awayMap[ext.number]||null} onGoSchedule={()=>{}}/>
      </PaneSection>
    ),
    advanced:(
      <React.Fragment>
        <PaneSection title="Call handling" sub="Ring style, caller ID, and call recording.">
          <RoutingPanel section="advanced" solo={simpleSys} ext={ext} patch={patch} onToggle={toggleDest} onScreening={screenDest} onMove={moveDest}
            onEdit={(d)=>setDestModal({editing:d})} onRemove={removeDest} openAddDest={(t)=>setDestModal(t?{type:t}:{})}/>
        </PaneSection>
        <PaneSection title="Extension settings" sub="Name, number, and who can manage it.">
          <GeneralPanel ext={ext} patch={patch}/>
          <PermissionsPanel ext={ext} removePerm={removePerm} updatePerm={updatePerm} reinvitePerm={reinvitePerm} openAddPeople={()=>setPeopleModal(true)}/>
          <DangerZone ext={ext}/>
        </PaneSection>
      </React.Fragment>
    ),
  };

  const selectExt = (it)=>{
    setSelId(it.id);
    setExt(it.id==='e1' ? {...SEED, status:it.status} : {...SEED, number:it.number, name:it.name, tts:it.name, enabled:it.enabled, status:it.status});
    setDirty(false);
    setTab('routing');
    setView('detail');
  };

  return (
    <div className={`app${navOpen?' nav-open':''}${paneOpen?' pane-open':''}`}>
      <Sidebar active={activeNav} onNav={onNav} badges={navBadges} hideSetup={setupDismissed}
        companies={COMPANIES} companyId={companyId} onSwitch={switchCompany} isMember={isMember}/>
      <div className="scrim" onClick={()=>setNavOpen(false)}/>
      <div className="main">
        <Topbar onMenu={()=>setNavOpen(true)} who={me} role={isMember?'Member':'Admin'}/>
        <div className="scroll">
          <div className="page">
            {screen==='setup' ? (
              <QuickSetup businessNumber="(617) 555-0100" businessName="Smilebar" ownerEmail="bob@smilebar.co" onDone={()=>onNav('calls')} onDismiss={()=>{ setSetupDismissed(true); onNav('extensions'); }}/>
            ) : screen==='sms-reg' ? (
              <window.SmsRegistration onDone={()=>onNav('sms')}/>
            ) : screen==='integrations' ? (
              <IntegrationsHub extensions={EXTENSIONS} webhookCfg={webhookCfg} setWebhookCfg={setWebhookCfg}/>
            ) : screen==='whatsapp' ? (
              <window.WhatsAppOnboarding onDone={()=>onNav('inbox')}/>
            ) : screen==='calls' || screen==='voicemails' ? (
              <ActivityScreen activity={scopedActivity} extensions={EXTENSIONS} contactMeta={contactMeta}
                mode={screen} extFilter={actExt} setExtFilter={setActExt} onOpen={openContact}
                sub={callsSub} setSub={setCallsSub} businessLines={BUSINESS_LINES} lineLabel={lineLabel}
                hasExtensions={hasExtensions}
                contactFilter={contactFilter} onClearContactFilter={()=>setContactFilter(null)}
                onHeard={markHeard} onSetHeard={setHeard} onMarkAllHeard={markAllHeard} vmExtra={vmExtra} onMoveVm={handleMoveVm} onUndoMoveVm={undoMoveVm} onEmailVm={emailVm}/>
            ) : screen==='sms' ? (
              <SmsScreen activity={activity} contactMeta={contactMeta} onSaveMeta={saveMeta} smsRead={smsRead} smsArchived={smsArchived}
                onArchive={archiveSms} onOpen={openContact} onReadSms={(num)=>setSmsRead(r=>({...r,[num]:true}))} onSend={sendText}
                businessLines={BUSINESS_LINES} lineLabel={lineLabel} onCompleteSmsReg={()=>onNav('sms-reg')}
                initialNum={contactFilter&&contactFilter.num}/>
            ) : screen==='numbers' ? (
              <NumbersScreen numbers={BUSINESS_LINES} extensions={EXTENSIONS} businessName="Smilebar" onGoGreetings={()=>onNav('greetings')} onGoExtensions={()=>onNav('extensions')}/>
            ) : screen==='myext' ? (
              view==='list' ? (
              <div className="ext-listview esys myext-list">
                <div className="lv-head">
                  <div>
                    <h1 className="lv-title">My extensions</h1>
                    <p className="lv-sub">The extensions you answer at {businessName}. Open one to set where it rings, your greeting, and how you’re notified - your admin handles everything else.</p>
                  </div>
                </div>
                <div className="esys-stack">
                  <section className="esys-sec">
                    <div className="esys-exts">
                      {memberExts.map(it=>(
                        <button key={it.id} className="lv-row" onClick={()=>selectExt(it)}>
                          <span className="lv-ext">
                            <span className={`lv-num${it._kind==='shared'?' shared':''}`}>{it.number}</span>
                            <span className="lv-extmeta">
                              <b>{it.name}<span className={`lv-tag${it._kind==='shared'?' shared':''}`}>{it._kind==='shared'?'Shared':'You'}</span></b>
                              <span className="lv-sub2">{it._sub || (it.forwards>0?`Forwards to ${it.forwards} destination${it.forwards>1?'s':''}`:'Voicemail only')}</span>
                            </span>
                          </span>
                          <span className={`away-flag${awayMap[it.number]?'':' open'}`} role="button" tabIndex={0} onClick={(e)=>{ e.stopPropagation(); askAway(it.number, it.name, 'forward-off'); }} title="Click to toggle availability"><span className="away-flag-dot"></span>{awayMap[it.number]?'Away':'Active'}</span>
                          <span className="lv-go"><Icon name="chevright"/></span>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
              ) : (
              <section className="ext-detail myext">
                <button className="lv-back" onClick={()=>setView('list')}><Icon name="arrowleft"/> My extensions</button>
                <div className="phead">
                  <div className="htext">
                    <span className="ext-kicker-inline">{onMyOwn?`My extension · ${ext.number}`:`Shared extension · ${ext.number}`}</span>
                    <h1>{onMyOwn?me:ext.name}<button className={`away-flag${awayMap[ext.number]?'':' open'}`} onClick={()=>askAway(ext.number, onMyOwn?me:ext.name, 'forward-off')} title="Click to toggle availability"><span className="away-flag-dot"></span>{awayMap[ext.number]?'Away':'Active'}</button></h1>
                    <p className="myext-sub">{onMyOwn?`Manage where your calls ring, your greeting, and how you’re notified at ${businessName}. Your admin handles everything else.`:`${curMyExt._team?curMyExt._team+' answer this line. ':''}Manage your own ring order and alerts for this shared extension - your admin handles the rest.`}</p>
                  </div>
                  <div className="phead-actions">
                    <button className="btn btn-secondary" onClick={()=>openExtActivity('calls',ext.number,'all')}><Icon name="activity"/> {onMyOwn?'My activity':'Activity'}</button>
                  </div>
                </div>
                <div className="dtabs" role="tablist">
                  {RAIL.filter(r=>r.id!=='general').map(r=>(
                    <button key={r.id} role="tab" aria-selected={tab===r.id} className={`dtab${tab===r.id?' on':''}`} onClick={()=>setTab(r.id)}>
                      <Icon name={r.icon}/>{r.label}
                    </button>
                  ))}
                </div>
                <div className="dpanel">{panels[tab==='overview'||tab==='general'?'routing':tab]}</div>
              </section>
              )
            ) : screen==='greetings' ? (
              <GreetingsScreen onGoExtensions={()=>onNav('extensions')} extensions={EXTENSIONS} businessName="Smilebar"/>
            ) : screen==='sysmap' ? (
              <div className="cflow-screen">
                <div className="cflow-mapcol">
                  <CallFlowView businessName={businessName}
                    numbers={company.simple ? [{num:company.number, label:'Local', type:'Local'}] : BUSINESS_LINES}
                    extensions={[...(company.simple ? EXTENSIONS.filter(e=>e.number===0) : EXTENSIONS), ...extraExts]}
                    simple={simpleSys} forward={company.forward} hoursShort={company.simple?company.hoursShort:null}
                    justAdded={justAdded}
                    onSelectForward={()=>setMapSel({kind:'forward'})}
                    onSelectVm={()=>setMapSel({kind:'vm'})}
                    onSelectForwarding={()=>setMapSel({kind:'ext'})}
                    greeting={company.simple ? company.greeting : sysGreeting}
                    hours={company.simple ? company.hoursLong : "Mon–Fri, 9:00 AM – 5:00 PM ET"}
                    sel={mapSel} selExtNum={ext.number} away={sysAway}
                    onSelectNumbers={()=>setMapSel({kind:'numbers'})}
                    onSelectDirectory={()=>setMapSel({kind:'directory'})}
                    onSelectGreeting={()=>setMapSel({kind:'greeting'})}
                    onSelectExt={(e)=>{ selectExt(e); setMapSel({kind:'ext'}); }}
                    onDeselect={()=>setMapSel(null)}
                    onToggleAway={()=>setSysAway(s=>!s)}
                    awayMap={awayMap}
                    onToggleFwd={(e)=>askAway(e.number, e.name)}
                    onAddExtension={()=>setAddExtOpen(true)}/>
                </div>
                <SysManagePane sel={mapSel} ext={ext} bodies={paneBodies} panels={panels}
                  businessName={businessName}
                  simple={simpleSys} forward={company.forward} hoursShort={company.simple?company.hoursShort:null}
                  greeting={company.simple ? company.greeting : sysGreeting}
                  hours={company.simple ? company.hoursLong : "Mon–Fri, 9:00 AM – 5:00 PM ET"}
                  numbers={company.simple ? [{num:company.number, label:'Local', type:'Local'}] : BUSINESS_LINES}
                  extensions={[...(company.simple ? EXTENSIONS.filter(e=>e.number===0) : EXTENSIONS), ...extraExts]}
                  away={sysAway} onToggleAway={setSysAway} onEditGreeting={()=>onNav('greetings')}
                  onManageNumbers={()=>onNav('numbers')}
                  onGoIntegrations={()=>onNav('integrations')}
                  onExpand={expandToExtensions}
                  awayText={AWAY_TEXT}
                  scheduleEl={<SchedulePanel hideClosedGreeting hoursOnly bare ext={{name:'Smilebar', officeHours:bizHours}} patch={(p)=>setBizHours(p.officeHours||bizHours)} away={sysAway} onSetAway={setSysAway}/>}/>
              </div>
            ) : screen==='phonesys' ? (
              <SystemOverviewV3 businessName="Smilebar" numbers={BUSINESS_LINES} extensions={EXTENSIONS}
                greeting="Thank you for calling Smilebar. Please hold while we connect your call."
                hours="Mon–Fri, 9:00 AM – 5:00 PM ET" status="Open" afterHoursOn={true}
                routeDestinations={['Bob’s cell','Front desk phone','Answering service']}
                voicemailEmails={['team@smilebar.co','bob@smilebar.co']}
                onGo={(dest)=>onNav(dest)}
                onOpenExt={(e)=>{ if(e){ setScreen('extensions'); selectExt(e); } else onNav('extensions'); }}/>
            ) : screen==='billing' ? (
              <window.BillingScreen/>
            ) : screen==='settings' ? (
              <SettingsScreen onNav={onNav} extensions={EXTENSIONS} numbers={BUSINESS_LINES} businessName="Smilebar"/>
            ) : view==='list' ? (
              <div className="ext-listview esys">
                <div className="lv-head">
                  <div>
                    <h1 className="lv-title">Your phone system</h1>
                    <p className="lv-sub">Your numbers, your greeting, and the extensions that ring your team - all in one place.</p>
                  </div>
                  <div className="esys-preview" title="Preview how the screen adapts to each kind of account">
                    <span>Preview</span>
                    <button className={!simpleSys?'on':''} onClick={()=>setSimpleSys(false)}>Multi-extension</button>
                    <button className={simpleSys?'on':''} onClick={()=>setSimpleSys(true)}>Simple</button>
                  </div>
                </div>

                <div className="esys-stack">
                  <NumbersSection numbers={simpleSys?BUSINESS_LINES.slice(0,1):BUSINESS_LINES} extensions={[...EXTENSIONS, ...extraExts]} onManage={()=>onNav('numbers')}/>

                  <MainGreetingSection businessName="Smilebar"
                    text={sysGreeting}
                    hours="Mon–Fri, 9:00 AM – 5:00 PM ET"
                    away={sysAway} onToggleAway={setSysAway}
                    onEdit={()=>onNav('greetings')}/>

                  <section className="esys-sec">
                    <header className="esys-sechead">
                      <span className="esys-secic ext"><Icon name={simpleSys?'forward':'route'}/></span>
                      <div className="esys-sectitle">
                        <h2>{simpleSys?'Call forwarding':'Extensions'}</h2>
                        <p>{simpleSys?'Calls to your number ring these, in order.':'Press a number - or say a name - to reach the right person.'}</p>
                      </div>
                      {simpleSys && <button className="esys-secact" onClick={()=>selectExt(EXTENSIONS.find(e=>e.number===0)||EXTENSIONS[0])}><Icon name="settings"/> Manage</button>}
                    </header>
                    {simpleSys ? (
                      <div className="esys-nums">
                        {[{icon:'smartphone',label:'My cell',value:'+1 (617) 555-1141'},{icon:'monitor',label:'Front desk',value:'+1 (617) 555-2200'}].map((d,i)=>(
                          <div className="esys-numrow as-fwd" key={i}>
                            <span className="esys-numic fwd"><Icon name={d.icon}/></span>
                            <span className="esys-nummain">
                              <span className="esys-num sm">{d.label}</span>
                              <span className="esys-nummeta">{d.value}</span>
                            </span>
                            <span className="away-flag open"><span className="away-flag-dot"/>Ringing</span>
                          </div>
                        ))}
                        <button className="esys-addnum" onClick={()=>selectExt(EXTENSIONS.find(e=>e.number===0)||EXTENSIONS[0])}><Icon name="plus"/> Add where calls forward</button>
                      </div>
                    ) : (
                    <div className="esys-exts">
                      {[...EXTENSIONS, ...extraExts].filter(it=>Number(it.number)<100).map(it=>(
                        <button key={it.id} className="lv-row" onClick={()=>selectExt(it)}>
                          <span className="lv-ext">
                            <span className="lv-num">{it.number}</span>
                            <span className="lv-extmeta">
                              <b>{it.name}</b>
                              <span className="lv-sub2">{it.forwards>0?`Forwards to ${it.forwards} destination${it.forwards>1?'s':''}`:'Voicemail only'}</span>
                            </span>
                          </span>
                          <span className={`away-flag${awayMap[it.number]?'':' open'}`} role="button" tabIndex={0} onClick={(e)=>{ e.stopPropagation(); askAway(it.number, it.name); }} title="Click to toggle availability"><span className="away-flag-dot"/>{awayMap[it.number]?'Away':'Active'}</span>
                          <span className="lv-go"><Icon name="chevright"/></span>
                        </button>
                      ))}
                      <div className="lv-row system">
                        <span className="lv-ext">
                          <span className="lv-num dir">9</span>
                          <span className="lv-extmeta">
                            <b>Dial by name directory</b>
                            <span className="lv-dirnote">Built automatically from your extension names - callers speak or spell a teammate's name on the keypad and JOEL connects them to the matching extension.</span>
                          </span>
                        </span>
                        <span className="lv-auto"><Icon name="sparkle"/> Automated</span>
                      </div>
                      {[...EXTENSIONS, ...extraExts].filter(it=>Number(it.number)>=100).map(it=>(
                        <button key={it.id} className="lv-row" onClick={()=>selectExt(it)}>
                          <span className="lv-ext">
                            <span className="lv-num">{it.number}</span>
                            <span className="lv-extmeta">
                              <b>{it.name}</b>
                              <span className="lv-sub2">{it.forwards>0?`Forwards to ${it.forwards} destination${it.forwards>1?'s':''}`:'Voicemail only'}</span>
                            </span>
                          </span>
                          <span className={`away-flag${awayMap[it.number]?'':' open'}`} role="button" tabIndex={0} onClick={(e)=>{ e.stopPropagation(); askAway(it.number, it.name); }} title="Click to toggle availability"><span className="away-flag-dot"/>{awayMap[it.number]?'Away':'Active'}</span>
                          <span className="lv-go"><Icon name="chevright"/></span>
                        </button>
                      ))}
                    </div>
                    )}
                    {!simpleSys && (
                    <button className="esys-addext" onClick={()=>setAddExtOpen(true)}>
                      <span className="esys-addtile"><Icon name="plus"/></span>
                      <span className="esys-addmeta">
                        <b>Add an extension</b>
                        <span>Name it and give it a number to forward to.</span>
                      </span>
                      <span className="esys-addgo"><Icon name="chevright"/></span>
                    </button>
                    )}
                  </section>

                  {simpleSys && (
                    <button className="esys-switch" onClick={()=>setAddExtOpen(true)}>
                      <span className="esys-switch-ic"><Icon name="layers"/></span>
                      <span className="esys-switch-t">
                        <b>Your system is a simple one - no extensions.</b>
                        <span>Want departments like Sales and Support, each with its own people, greeting, and forwarding? Switch to an extension-based system.</span>
                      </span>
                      <span className="esys-switch-cta">Add an extension <Icon name="chevright"/></span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <section className="ext-detail">
                <button className="lv-back" onClick={()=>setView('list')}><Icon name="arrowleft"/> Your System</button>
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

      {destModal && <DestinationModal editing={destModal.editing} initialType={destModal.type} extName={ext.name} onClose={()=>setDestModal(null)} onSave={saveDest}/>}
      {addExtOpen && <AddExtensionModal existing={[...(company.simple ? EXTENSIONS.filter(e=>e.number===0) : EXTENSIONS), ...extraExts]} businessName={businessName} onClose={()=>setAddExtOpen(false)} onAdd={addExtension}/>}
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
              <p className="awayconf-note">You can turn {awayConfirm.name} back on anytime - forwarding resumes right away.</p>
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
