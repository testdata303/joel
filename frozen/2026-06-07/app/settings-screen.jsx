/* ============================================================
   JOEL app — Settings (exports to window)
   Stripe-style: a constrained, centered page of grouped cards.
   Numbers, Main Greeting, Directory & Devices live under System.
   ============================================================ */
const { Icon } = window;

const SETTINGS_GROUPS = [
  { title:'System', items:[
    { icon:'hashnum', label:'Numbers', desc:'Your business numbers and where each one routes.', nav:'numbers' },
    { icon:'audiolines', label:'Main Greeting', desc:'What callers hear before they’re routed, and after hours.', nav:'greetings' },
    { icon:'route', label:'Directory', desc:'Dial-by-name directory built from your extensions.' },
    { icon:'monitor', label:'Devices', desc:'Desk phones, the mobile app, and SIP endpoints.' },
    { icon:'music', label:'Music on hold', desc:'What callers hear while they wait to be connected.' },
  ]},
  { title:'Team', items:[
    { icon:'users', label:'Users & roles', desc:'Invite teammates, set Owner / Admin / User access.' },
    { icon:'building', label:'Business profile', desc:'Company name, address, and time zone.' },
  ]},
  { title:'Messaging & compliance', items:[
    { icon:'message', label:'SMS compliance', desc:'A2P / toll-free registration and sender details.' },
    { icon:'ban', label:'Blocked numbers', desc:'Numbers blocked from calling or texting you.' },
    { icon:'shield', label:'Data retention', desc:'How long calls, recordings, and messages are kept.' },
  ]},
  { title:'Integrations & advanced', items:[
    { icon:'slack', label:'Integrations', desc:'Slack, webhooks, and other connected tools.' },
    { icon:'audiolines', label:'Advanced greeting options', desc:'Menus, multi-language, and time-of-day routing.' },
    { icon:'hashnum', label:'Advanced number options', desc:'Porting, caller ID (CNAM), and call-record settings.' },
  ]},
];

function SettingsScreen({ onNav }){
  return (
    <div className="settings-screen">
      <div className="set-head">
        <h1 className="set-title">Settings</h1>
        <p className="set-sub">Manage your phone system, team, and account. Everyday changes live on their own pages — this is the deeper setup.</p>
      </div>
      {SETTINGS_GROUPS.map(g=>(
        <div className="set-group" key={g.title}>
          <div className="set-grouph">{g.title}</div>
          <div className="set-grid">
            {g.items.map(it=>(
              <button className="set-card" key={it.label} onClick={()=>it.nav&&onNav&&onNav(it.nav)}>
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
