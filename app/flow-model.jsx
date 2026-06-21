/* ============================================================
   Call Flow concept - data model, seed flows, tree helpers
   Node types:
     menu  - greeting + keypress options (root = Main Greeting)
     ext   - extension: rings people/phones, vm + slack managed here
     vm    - voicemail box
     text  - send a text back to the caller
     goto  - jump back to another menu
   ============================================================ */

const FLOW_TYPES = {
  menu:{ label:'Menu greeting', icon:'phone',     desc:'Plays audio, callers press a key' },
  ext: { label:'Extension',     icon:'user',      desc:'Rings people or phones' },
  vm:  { label:'Voicemail box', icon:'voicemail', desc:'Takes a message' },
  text:{ label:'Send a text',   icon:'message',   desc:'Texts the caller back' },
  goto:{ label:'Return to menu',icon:'route',     desc:'Sends the caller back' },
};

/* Bob's HVAC - the demo business */
const FLOW_SEED = {
  id:'root', type:'menu', name:'Main Greeting',
  greeting:{ kind:'audio', dur:'0:09', text:'Thanks for calling Bob’s HVAC. Please press one of the following options.' },
  prompt:'Please press one of the following options.',
  timeout:{ on:true, dest:'Billing Voicemail' },
  children:[
    { id:'n1', key:'1', type:'ext', name:'Schedule Service', ext:'1', ring:'order', noAnswer:'voicemail',
      dests:[ {label:'Front Office', sub:'Desk phone', kind:'desk'}, {label:'(617) 555-0142', sub:'Bob’s cell', kind:'cell'} ],
      slack:{ on:true, channel:'#service' }, email:{ on:true, to:'service@bobshvac.com' }, children:[] },
    { id:'n2', key:'2', type:'ext', name:'Emergency Repair', ext:'2', ring:'all', noAnswer:'voicemail',
      dests:[ {label:'Bob Stevens', sub:'Mobile app', kind:'app'}, {label:'Dale Ruiz', sub:'On-call tech - mobile app', kind:'app'} ],
      slack:{ on:true, channel:'#emergencies' }, email:{ on:false, to:'' }, children:[] },
    { id:'n3', key:'3', type:'vm', name:'Billing Voicemail',
      greeting:{ kind:'ai', text:'You’ve reached Bob’s HVAC billing. Leave your name and invoice number and we’ll call you back.' },
      emails:['billing@bobshvac.com'], slack:{ on:false, channel:'#billing' }, children:[] },
    { id:'n4', key:'4', type:'menu', name:'More Options',
      greeting:{ kind:'ai', text:'To get a booking link by text, press 1. To hear these options again, press 2.' },
      prompt:'', timeout:{ on:false, dest:'' },
      children:[
        { id:'n41', key:'1', type:'text', name:'Text a booking link',
          message:'Book your service visit here: bobshvac.com/book - we’ll confirm within the hour.', children:[] },
        { id:'n42', key:'2', type:'goto', name:'Return to Main Menu', target:'Main Greeting', children:[] },
      ] },
  ],
};

/* A brand-new business: just the main greeting */
const FLOW_EMPTY = {
  id:'root', type:'menu', name:'Main Greeting',
  greeting:{ kind:'ai', text:'Thanks for calling Bob’s HVAC. Please hold while we connect your call.' },
  prompt:'', timeout:{ on:false, dest:'' },
  children:[],
};

/* ---------- tree helpers (immutable) ---------- */
function flowFind(node, id){
  if(node.id===id) return node;
  for(const c of node.children||[]){ const f=flowFind(c,id); if(f) return f; }
  return null;
}
function flowFindParent(node, id, parent=null){
  if(node.id===id) return parent;
  for(const c of node.children||[]){ const f=flowFindParent(c,id,node); if(f) return f; }
  return null;
}
function flowUpdate(node, id, patch){
  if(node.id===id) return {...node, ...(typeof patch==='function'?patch(node):patch)};
  return {...node, children:(node.children||[]).map(c=>flowUpdate(c,id,patch))};
}
function flowRemove(node, id){
  return {...node, children:(node.children||[]).filter(c=>c.id!==id).map(c=>flowRemove(c,id))};
}
function flowAddChild(node, parentId, child){
  if(node.id===parentId){
    const used=(node.children||[]).map(c=>Number(c.key)||0);
    const key=String((used.length?Math.max(...used):0)+1);
    return {...node, children:[...(node.children||[]), {...child, key}]};
  }
  return {...node, children:(node.children||[]).map(c=>flowAddChild(c,parentId,child))};
}
function flowCount(node){
  return 1+(node.children||[]).reduce((s,c)=>s+flowCount(c),0);
}
let __flowSeq=100;
function newFlowNode(type){
  const id='nn'+(__flowSeq++);
  if(type==='ext')  return { id, type, name:'New extension', ext:'', ring:'order', noAnswer:'voicemail', dests:[], slack:{on:false,channel:''}, email:{on:false,to:''}, children:[] };
  if(type==='vm')   return { id, type, name:'New voicemail box', greeting:{kind:'ai', text:'Please leave a message after the tone.'}, emails:[], slack:{on:false,channel:''}, children:[] };
  if(type==='menu') return { id, type, name:'New menu', greeting:{kind:'ai', text:'Please press one of the following options.'}, prompt:'', timeout:{on:false,dest:''}, children:[] };
  if(type==='text') return { id, type, name:'Text the caller', message:'Sorry we missed you! Text us here and we’ll get right back to you.', children:[] };
  return { id, type:'goto', name:'Return to Main Menu', target:'Main Greeting', children:[] };
}

/* one-line summary per node (canvas footer + tree subtitle) */
function flowSummary(n){
  if(n.type==='menu') return (n.children||[]).length ? `Menu · ${(n.children||[]).length} options` : 'Greeting';
  if(n.type==='ext')  return n.dests?.length ? (n.dests.length===1 ? n.dests[0].label : `Rings ${n.dests.length} ${n.ring==='all'?'at once':'in order'}`) : 'No destinations yet';
  if(n.type==='vm')   return 'Voicemail';
  if(n.type==='text') return 'Auto-text';
  return 'Back to '+(n.target||'menu');
}

Object.assign(window, { FLOW_TYPES, FLOW_SEED, FLOW_EMPTY,
  flowFind, flowFindParent, flowUpdate, flowRemove, flowAddChild, flowCount, newFlowNode, flowSummary });
