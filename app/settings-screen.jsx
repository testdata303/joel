/* ============================================================
   AnyPhone app - Settings (exports to window)
   Stripe-style: a constrained, centered page of grouped cards.
   Everyday config (Numbers, Main Greeting) jumps to its own
   top-level screen; deeper setup opens an in-place detail page.
   ============================================================ */
const { Icon } = window;

const SETTINGS_GROUPS = [
  { title:'Account', items:[
    { icon:'users', label:'Users & roles', desc:'Invite teammates, set Owner / Admin / User access.', sub:'users' },
    { icon:'building', label:'Business profile', desc:'Company name, address, and time zone.', sub:'profile' },
  ]},
  { title:'Messaging & compliance', items:[
    { icon:'message', label:'SMS compliance', desc:'A2P / toll-free registration and sender details.', sub:'sms' },
    { icon:'ban', label:'Blocked numbers', desc:'Numbers blocked from calling or texting you.', sub:'blocked' },
    { icon:'shield', label:'Data retention', desc:'How long calls, recordings, and messages are kept.', sub:'retention' },
  ]},
  { title:'Call experience', items:[
    { icon:'monitor', label:'Devices', desc:'Desk phones, the mobile app, and SIP endpoints.', sub:'devices' },
    { icon:'music', label:'Music on hold', desc:'What callers hear while they wait to be connected.', sub:'hold' },
  ]},
  { title:'Advanced', items:[
    { icon:'hashnum', label:'Advanced number options', desc:'Porting, caller ID (CNAM), and call-record settings.', sub:'number-adv' },
  ]},
];

const SECTION_MAP = {
  directory:'DirectorySection', devices:'DevicesSection', hold:'HoldSection',
  users:'UsersSection', profile:'ProfileSection',
  sms:'SmsComplianceSection', blocked:'BlockedSection', retention:'RetentionSection',
  integrations:'IntegrationsSettingsSection', 'number-adv':'NumberAdvSection',
};

function SettingsScreen({ onNav, extensions, numbers, businessName }){
  const [sub,setSub]=React.useState(null);

  if(sub){
    const Comp = window[SECTION_MAP[sub]];
    if(Comp){
      return <Comp extensions={extensions} numbers={numbers} businessName={businessName}
        onNav={onNav} onBack={()=>setSub(null)}/>;
    }
  }

  return (
    <div className="settings-screen">
      <div className="set-head">
        <h1 className="set-title">Settings</h1>
        <p className="set-sub">Your account, team, and compliance. Everyday changes - numbers, greetings, and integrations - live on their own screens.</p>
      </div>
      {SETTINGS_GROUPS.map(g=>(
        <div className="set-group" key={g.title}>
          <div className="set-grouph">{g.title}</div>
          <div className="set-grid">
            {g.items.map(it=>(
              <button className="set-card" key={it.label} onClick={()=>{ if(it.nav) onNav&&onNav(it.nav); else if(it.sub) setSub(it.sub); }}>
                <span className="set-ic"><Icon name={it.icon}/></span>
                <span className="set-card-t"><b>{it.label}</b><span>{it.desc}</span></span>
                <Icon name="chevright"/>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { SettingsScreen });
