/* ============================================================
   Call Flow concept - shell + screen + popover menus + tweaks
   The whole PBX is managed on this one screen: canvas (or tree)
   on the left, everything-about-the-selected-node on the right.
   ============================================================ */
const { useState, useEffect, Icon, Segmented, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
const { FLOW_TYPES, FLOW_SEED, FLOW_EMPTY, flowFind, flowFindParent, flowUpdate, flowRemove, flowAddChild, newFlowNode, FlowCanvas, FlowTree, FlowInspector } = window;

const FC_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "edgeStyle": "square",
  "dotsBg": true,
  "density": "roomy",
  "tinted": true,
  "startEmpty": false
}/*EDITMODE-END*/;

/* ---------- sidebar (Call Flow replaces Phone System + Greetings) ---------- */
const FC_NAV = [
  { id:'overview', icon:'inbox',    label:'Overview' },
  { id:'activity', icon:'activity', label:'Activity' },
  { id:'texts',    icon:'message',  label:'Texts' },
  { id:'contacts', icon:'users',    label:'Contacts' },
];
const FC_SYSTEM = [
  { id:'flow',     icon:'route',    label:'Call Flow' },
  { id:'numbers',  icon:'hashnum',  label:'Numbers' },
  { id:'users',    icon:'user',     label:'Users & Roles' },
  { id:'settings', icon:'settings', label:'Settings' },
];

function FcSidebar(){
  return (
    <aside className="sidebar">
      <div className="sb-top">
        <div className="sb-brand"><span className="sb-word">AnyPhone</span></div>
        <button className="switcher">
          <span className="biz-name">Bob's HVAC</span>
          <span className="chev"><Icon name="chevdown" style={{width:16,height:16}}/></span>
        </button>
      </div>
      <nav className="sb-nav">
        {FC_NAV.map(n=>(
          <button key={n.id} className="sb-item"><Icon name={n.icon}/>{n.label}</button>
        ))}
        <div className="sb-group">System</div>
        {FC_SYSTEM.map(n=>(
          <button key={n.id} className={`sb-item${n.id==='flow'?' active':''}`}><Icon name={n.icon}/>{n.label}</button>
        ))}
      </nav>
    </aside>
  );
}

function FcTopbar(){
  return (
    <header className="topbar">
      <button className="hamburger" aria-label="Open menu"><Icon name="menu" style={{width:20,height:20}}/></button>
      <button className="search">
        <Icon name="search" style={{width:17,height:17}}/>
        <input placeholder="Search calls, voicemails, messages…" readOnly/>
        <span className="kbd">⌘K</span>
      </button>
      <div className="top-actions">
        <button className="icon-btn"><Icon name="bell" style={{width:19,height:19}}/><span className="dot"></span></button>
        <button className="acct">
          <span className="avatar">BS</span>
          <span className="acct-who"><b>Bob Stevens</b><span>Admin</span></span>
          <Icon name="chevdown" style={{width:15,height:15,color:'var(--muted)'}}/>
        </button>
      </div>
    </header>
  );
}

/* ---------- popover menus ---------- */
function FcAddMenu({ at, onPick, onClose }){
  useEffect(()=>{
    const close=()=>onClose();
    const esc=(e)=>{ if(e.key==='Escape') onClose(); };
    setTimeout(()=>window.addEventListener('click',close),0);
    window.addEventListener('keydown',esc);
    return ()=>{ window.removeEventListener('click',close); window.removeEventListener('keydown',esc); };
  },[onClose]);
  const style = {
    left: Math.min(at.x, window.innerWidth-280),
    top: Math.min(at.y, window.innerHeight-330),
  };
  return (
    <div className="cf-menu" style={style} onClick={e=>e.stopPropagation()}>
      <div className="cf-menu-h">When the caller presses this key…</div>
      {Object.entries(FLOW_TYPES).map(([t,def])=>(
        <button key={t} className="cf-mi" data-t={t} onClick={()=>onPick(t)}>
          <span className="cf-mi-ic"><Icon name={def.icon}/></span>
          <span className="cf-mi-tx"><b>{def.label}</b><span>{def.desc}</span></span>
        </button>
      ))}
    </div>
  );
}

function FcKebabMenu({ at, node, onClose, onRemove, onDuplicate }){
  useEffect(()=>{
    const close=()=>onClose();
    const esc=(e)=>{ if(e.key==='Escape') onClose(); };
    setTimeout(()=>window.addEventListener('click',close),0);
    window.addEventListener('keydown',esc);
    return ()=>{ window.removeEventListener('click',close); window.removeEventListener('keydown',esc); };
  },[onClose]);
  const isRoot = node.id==='root';
  const style = { left: Math.min(at.x, window.innerWidth-280), top: Math.min(at.y, window.innerHeight-180) };
  return (
    <div className="cf-menu" style={style} onClick={e=>e.stopPropagation()}>
      <div className="cf-menu-h">{node.name}</div>
      {!isRoot && <button className="cf-act" onClick={onDuplicate}><Icon name="copy"/>Duplicate step</button>}
      {!isRoot && <div className="cf-sep"></div>}
      {!isRoot && <button className="cf-act danger" onClick={onRemove}><Icon name="trash"/>Remove step</button>}
      {isRoot && <button className="cf-act" onClick={onClose}><Icon name="info"/>The main greeting can't be removed</button>}
    </div>
  );
}

Object.assign(window, { FcSidebar, FcTopbar, FcAddMenu, FcKebabMenu, FC_TWEAK_DEFAULTS });
