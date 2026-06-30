/* ============================================================
   AnyPhone app - SMS Inbox Notification settings
   Lives inside the SMS product area (SMS → Inbox settings).
   Model: New (unassigned) conversations vs Assigned conversations
   are notified differently. Anti-spam: one primary channel.
   ============================================================ */
const { useState: SN_useState } = React;
const SNIcon = window.Icon;
const SNToggle = window.Toggle;

const SN_TEAM = [
  { name:'Bob Stevens', role:'Owner', me:true },
  { name:'Jane Rivera', role:'Front desk' },
  { name:'Mara Lopez', role:'Support' },
  { name:'Daniel Kim', role:'Support' },
];
const SN_CHANNELS = ['#customer-texts', '#front-desk', '#support', '#general'];
const SN_DELAYS = [ {v:'15', l:'15 min'}, {v:'30', l:'30 min'}, {v:'60', l:'1 hour'} ];

/* preset → sensible defaults. Each picks ONE primary channel for new convos. */
const SN_PRESETS = {
  owner: {
    label:'Owner / Founder', icon:'user',
    desc:'Everything comes to you, quietly. One channel, no team blast.',
    cfg:{ primary:'email', email:{on:true,to:['bob@smilebar.co']}, slack:{on:false,channel:'#customer-texts'}, sms:{on:false,to:[]},
      esc:{on:false,after:'30',admin:true,team:false,slack:false},
      assigned:{email:true,slack:false,sms:false},
      slackFeed:{on:false,channel:'#customer-texts',voicemails:false,missed:false,newConvos:false,assigned:false} },
  },
  small: {
    label:'Small team', icon:'users',
    desc:'New texts land in Slack so anyone can grab them. Owners get assigned replies.',
    cfg:{ primary:'slack', email:{on:false,to:['bob@smilebar.co']}, slack:{on:true,channel:'#customer-texts'}, sms:{on:false,to:[]},
      esc:{on:true,after:'30',admin:true,team:false,slack:true},
      assigned:{email:true,slack:true,sms:false},
      slackFeed:{on:true,channel:'#customer-texts',voicemails:true,missed:true,newConvos:true,assigned:true} },
  },
  support: {
    label:'Support team', icon:'message',
    desc:'A shared Slack channel for the queue, with escalation if nobody picks up.',
    cfg:{ primary:'slack', email:{on:false,to:[]}, slack:{on:true,channel:'#support'}, sms:{on:false,to:[]},
      esc:{on:true,after:'15',admin:true,team:true,slack:true},
      assigned:{email:true,slack:true,sms:false},
      slackFeed:{on:true,channel:'#support',voicemails:true,missed:true,newConvos:true,assigned:true} },
  },
  frontdesk: {
    label:'Front desk', icon:'phone',
    desc:'A text alert to the desk phone so a new message never gets missed.',
    cfg:{ primary:'sms', email:{on:false,to:[]}, slack:{on:false,channel:'#front-desk'}, sms:{on:true,to:['(617) 555-0142']},
      esc:{on:true,after:'15',admin:true,team:false,slack:false},
      assigned:{email:false,slack:false,sms:true},
      slackFeed:{on:false,channel:'#front-desk',voicemails:false,missed:false,newConvos:false,assigned:false} },
  },
};

/* small recipient chip editor */
function SNChips({ items, onChange, placeholder, type }){
  const [draft,setDraft]=SN_useState('');
  const add=()=>{ const v=draft.trim(); if(!v) return; if(!items.includes(v)) onChange([...items,v]); setDraft(''); };
  return (
    <div className="sn-chips">
      {items.map(it=>(
        <span className="sn-chip" key={it}>{it}<button onClick={()=>onChange(items.filter(x=>x!==it))} aria-label="Remove"><SNIcon name="x"/></button></span>
      ))}
      <input className="sn-chip-in" type={type||'text'} value={draft} placeholder={placeholder} onChange={e=>setDraft(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'||e.key===','){ e.preventDefault(); add(); } }} onBlur={add}/>
    </div>
  );
}

window.SNChips = SNChips;
window.SN_PRESETS = SN_PRESETS;
window.SN_TEAM = SN_TEAM;
window.SN_CHANNELS = SN_CHANNELS;
window.SN_DELAYS = SN_DELAYS;
