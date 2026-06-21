/* ============================================================
   JOEL - Settings sections, part 1: shared helpers + System + Team
   Built from the app's existing vocabulary (Card / Toggle / Field /
   Choice / note / pill). Grounded in Product Rules v1.
   ============================================================ */
const { Icon, Toggle, Field, Choice, Avatar, Card, Modal, Segmented } = window;
const { useState:sxState, useRef:sxRef, useEffect:sxEffect } = React;

/* ---- shared layout: back + heading + body ---- */
function SetDetail({ title, sub, onBack, children }){
  return (
    <div className="ss-detail">
      <button className="lv-back" onClick={onBack}><Icon name="arrowleft"/> Settings</button>
      <div className="set-head">
        <h1 className="set-title">{title}</h1>
        {sub && <p className="set-sub">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

/* ---- generic list row: icon · main · trailing ---- */
function SRow({ icon, iconCls, title, meta, trail, tappable, onClick, muted }){
  const Tag = tappable ? 'button' : 'div';
  return (
    <Tag className={`ss-row${tappable?' tappable':''}${muted?' muted-row':''}`} onClick={onClick}>
      {icon && <span className={`ss-ic${iconCls?' '+iconCls:''}`}><Icon name={icon}/></span>}
      <span className="ss-main"><b>{title}</b>{meta && <span className="ss-meta">{meta}</span>}</span>
      {trail!=null && <span className="ss-trail">{trail}</span>}
    </Tag>
  );
}

/* ---- a small "Status: Active/Offline" line - kind: g(green) a(amber) r(red) m/off(grey) ---- */
function SStatus({ kind, label }){
  const off = kind==='m'||kind==='off';
  const dot = kind==='off'?'m':kind;
  return <span className={`ss-status${off?' off':''}${kind==='r'?' danger':''}`}><span className={`d ${dot}`}/>{label}</span>;
}

/* ---- a kebab menu - fixed-positioned (never clipped) and flips up near the bottom ---- */
function SMenu({ items }){
  const [open,setOpen]=sxState(false);
  const [pos,setPos]=sxState(null);
  const ref=sxRef(null);
  const btn=sxRef(null);
  const real = items.filter(Boolean);
  sxEffect(()=>{ if(!open) return;
    const r=btn.current.getBoundingClientRect();
    const est = real.reduce((h,it)=>h+(it.sep?11:38),0)+12; // approx menu height
    const right = Math.max(12, window.innerWidth - r.right);
    const below = window.innerHeight - r.bottom;
    setPos(below>=est+12 || below>=r.top ? { top:r.bottom+6, right } : { bottom: window.innerHeight - r.top + 6, right });
    const h=e=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const sc=()=>setOpen(false);
    document.addEventListener('mousedown',h);
    window.addEventListener('resize',sc);
    const s=document.querySelector('.scroll'); if(s) s.addEventListener('scroll',sc,{passive:true});
    return ()=>{ document.removeEventListener('mousedown',h); window.removeEventListener('resize',sc); if(s) s.removeEventListener('scroll',sc); };
  },[open]);
  return (
    <span ref={ref} style={{display:'inline-flex'}}>
      <button ref={btn} className="kebab" onClick={()=>setOpen(v=>!v)} aria-label="Options"><Icon name="kebab"/></button>
      {open && pos && (
        <div style={{position:'fixed',...(pos.top!=null?{top:pos.top}:{bottom:pos.bottom}),right:pos.right,background:'#fff',border:'1px solid var(--line)',borderRadius:12,boxShadow:'var(--shadow-pop)',padding:6,width:222,zIndex:80}}>
          {real.map((it,i)=> it.sep
            ? <div key={i} style={{height:1,background:'var(--line)',margin:'5px 4px'}}/>
            : <button key={i} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 10px',borderRadius:8,fontSize:'.88rem',fontWeight:600,textAlign:'left',color:it.danger?'var(--red)':'var(--ink)'}} onClick={()=>{ setOpen(false); it.onClick&&it.onClick(); }}>
                <Icon name={it.icon} style={{width:16,height:16,color:it.danger?'var(--red)':'var(--muted)',flexShrink:0}}/>{it.label}
              </button>)}
        </div>
      )}
    </span>
  );
}

/* ---- a row with a small "Listen / playing…" preview button ---- */
function ListenBtn({ disabled }){
  const [p,setP]=sxState(false);
  sxEffect(()=>{ if(!p) return; const t=setTimeout(()=>setP(false),2400); return ()=>clearTimeout(t); },[p]);
  return <button className="btn btn-secondary sm" disabled={disabled} style={disabled?{opacity:.45,pointerEvents:'none'}:null} onClick={()=>setP(v=>!v)}><Icon name={p?'pause':'play'}/> {p?'Playing…':'Listen'}</button>;
}

/* ========================================================== */
/* DIRECTORY                                                  */
/* ========================================================== */
function DirectorySection({ extensions, onBack }){
  const [on,setOn]=sxState(true);
  const [voice,setVoice]=sxState(true);
  const [spell,setSpell]=sxState(true);
  const [noMatch,setNoMatch]=sxState('operator');
  const roster = extensions.filter(e=>e.number!==0); // Operator (0) is the fallback, not a directory entry
  const [listing,setListing]=sxState(()=>{ const m={}; roster.forEach(e=>{ m[e.id]=true; }); return m; });
  const setList=(id,v)=>setListing(s=>({...s,[id]:v}));
  return (
    <SetDetail title="Directory" onBack={onBack}
      sub="Callers press 9 to reach a teammate by name instead of remembering an extension number. JOEL builds the directory automatically from your extension names.">
      <Card icon="route" title="Dial-by-name directory" desc="Available at 9 on your menu.">
        <SRow title="Directory enabled" meta={on?'Callers can look up an extension by name.':'Pressing 9 follows your “no match” behavior below.'}
          trail={<Toggle on={on} onChange={setOn}/>}/>
      </Card>

      {on && <>
        <Card icon="mic" title="How callers search" flush>
          <SRow title="Say a name" meta="“Sales,” “Dr. Niaraki,” “Bob” - JOEL listens and connects."
            trail={<Toggle on={voice} onChange={setVoice}/>}/>
          <SRow title="Spell a name on the keypad" meta="Type the first letters of a name (e.g. B-O-B)."
            trail={<Toggle on={spell} onChange={setSpell}/>}/>
        </Card>

        <Card icon="layers" title="In the directory" desc="Choose who callers can reach by name. JOEL uses each extension’s spoken (text-to-voice) name." flush>
          {roster.map(e=>{
            const disabled = !e.enabled || e.status==='disabled';
            if(disabled){
              return (
                <SRow key={e.id} icon="user" muted title={e.name}
                  meta="Not listed - this extension is turned off"
                  trail={<SStatus kind="off" label="Off"/>}/>
              );
            }
            const isOn = listing[e.id];
            return (
              <SRow key={e.id} icon="user" title={e.name}
                meta={isOn
                  ? <>Spoken as “{e.name}”<span className="sep">·</span>Extension {e.number}</>
                  : 'Won’t be offered when callers search by name'}
                trail={<>
                  <SStatus kind={isOn?'g':'r'} label={isOn?'Listed':'Unlisted'}/>
                  <Toggle on={isOn} onChange={(v)=>setList(e.id,v)}/>
                </>}/>
            );
          })}
        </Card>
        <p className="ss-foot">Turn off any extension you don’t want callers reaching by name, even while it’s active. Turned-off and deleted extensions are never listed.</p>

        <div className="ss-grouph">If JOEL can’t find a match</div>
        <div className="ss-choices">
          <Choice on={noMatch==='replay'} onClick={()=>setNoMatch('replay')} title="Replay the menu" desc="Read the main menu again so the caller can try another option, or press # to return to the main menu."/>
          <Choice on={noMatch==='operator'} onClick={()=>setNoMatch('operator')} title="Send to the Operator (Ext 0)" desc="Recommended. A person picks up instead of leaving the caller stuck."/>
          <Choice on={noMatch==='hangup'} onClick={()=>setNoMatch('hangup')} title="Play a goodbye and hang up" desc="Use only if you don’t want unmatched callers routed anywhere."/>
        </div>
      </>}
    </SetDetail>
  );
}

/* ========================================================== */
/* DEVICES                                                    */
/* ========================================================== */
const SX_DEVICES = [
  { id:'dv1', name:'Front Desk',     type:'sip', status:'active',  rings:'Operator, Sales, Support', cid:'Main · (617) 555-0100' },
  { id:'dv2', name:'Reception',      type:'sip', status:'active',  rings:'Operator', cid:'Main · (617) 555-0100' },
  { id:'dv3', name:'Conference Room',type:'sip', status:'offline', rings:'Operator', cid:'Main · (617) 555-0100' },
  { id:'dv4', name:'Jane’s iPhone',  type:'app', status:'active',  who:'Jane Cho',    rings:'Sales',  cid:'Sales · (617) 555-0100' },
  { id:'dv5', name:'Bob’s iPhone',   type:'app', status:'active',  who:'Bob Stevens', rings:'Operator, Billing', cid:'Main · (617) 555-0100' },
];
/* ---- compatible desk-phone catalog + "bring your own" connect flow ---- */
const DESK_MODELS = [
  { id:'yealink-t31g', brand:'Yealink', name:'T31G', tag:'Our pick', price:'~$65',
    blurb:'The desk phone we recommend - reliable, inexpensive, and plug-and-play with JOEL. A sharp display and gigabit passthrough.',
    specs:['2 lines','Gigabit Ethernet','Plug-and-play setup'], buy:'https://www.amazon.com/s?k=Yealink+T31G+IP+phone' },
];
function QRishCode({ size=168 }){
  const N=21, cell=size/N, R=[];
  const ring=(r,c,R0,C0)=>{ const rr=r-R0, cc=c-C0; return rr===0||rr===6||cc===0||cc===6||(rr>=2&&rr<=4&&cc>=2&&cc<=4); };
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    let on;
    if(r<7&&c<7) on=ring(r,c,0,0);
    else if(r<7&&c>=N-7) on=ring(r,c,0,N-7);
    else if(r>=N-7&&c<7) on=ring(r,c,N-7,0);
    else if((r<8&&c<8)||(r<8&&c>=N-8)||(r>=N-8&&c<8)) on=false; // quiet zone around finders
    else on=((r*7+c*13+(r^c)*5)%3===0);
    if(on) R.push(<rect key={r+'-'+c} x={c*cell} y={r*cell} width={cell+0.6} height={cell+0.6} fill="#10131a"/>);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Pairing QR code" style={{display:'block'}}>{R}</svg>;
}
function AddDeskPhoneFlow({ onClose, onAdd }){
  const [step,setStep]=sxState(1);
  const [model,setModel]=sxState(DESK_MODELS.length===1?DESK_MODELS[0]:null);
  const [ext,setExt]=sxState('Operator');
  const code='JOEL-4F2A-9C71';
  const back=()=>setStep(s=>Math.max(1,s-1));
  const finish=()=>{ onAdd && onAdd(model?`${model.brand} ${model.name}`:'New desk phone', ext); onClose(); };

  const footer = step===1
    ? <><span className="dp-foot-note">Already have a compatible phone? You can skip ahead.</span>
        <button className="btn btn-secondary" onClick={()=>setStep(3)}>I have one already</button>
        <button className="btn btn-primary" onClick={()=>setStep(2)}>See compatible phones</button></>
    : step===2
    ? <><button className="btn btn-secondary" onClick={back}>Back</button>
        <button className="btn btn-primary" onClick={()=>setStep(3)} disabled={!model}>{model?'Connect this phone':'Pick a phone'}</button></>
    : <><button className="btn btn-secondary" onClick={back}>Back</button>
        <button className="btn btn-primary" onClick={finish}>Done</button></>;

  return (
    <Modal wide title="Add a desk phone" icon="monitor" onClose={onClose} footer={footer}>
      <div className="dp-steps">
        <span className={`dp-stepdot${step>=1?' on':''}`}>1 Learn</span>
        <span className="dp-steparr">→</span>
        <span className={`dp-stepdot${step>=2?' on':''}`}>2 Get a phone</span>
        <span className="dp-steparr">→</span>
        <span className={`dp-stepdot${step>=3?' on':''}`}>3 Connect</span>
      </div>

      {step===1 && (
        <div className="dp-learn">
          <p className="dp-lead">Prefer a real handset on the desk? JOEL works with standard SIP desk phones - bring your own and point it at an extension, just like the mobile app. Here’s how it works:</p>
          <div className="dp-how">
            <div className="dp-howrow"><span className="dp-howic"><Icon name="monitor"/></span><div><b>Bring any approved phone</b><span>Buy a supported model - or use one you already own. No contract, no special hardware from us.</span></div></div>
            <div className="dp-howrow"><span className="dp-howic"><Icon name="webhook"/></span><div><b>Plug in &amp; scan to pair</b><span>Connect it to your network, scan the pairing code, and it configures itself - no telecom settings.</span></div></div>
            <div className="dp-howrow"><span className="dp-howic"><Icon name="route"/></span><div><b>Assign it to an extension</b><span>Choose which extension it rings for. It becomes a device here under Settings → Devices.</span></div></div>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="dp-models">
          <p className="dp-lead">Two we recommend for small teams. Buy from any retailer - these links open Amazon.</p>
          <div className="dp-grid">
            {DESK_MODELS.map(m=>(
              <button key={m.id} className={`dp-card${model&&model.id===m.id?' on':''}`} onClick={()=>setModel(m)}>
                <div className="dp-card-top">
                  <span className="dp-phoneico"><Icon name="monitor"/></span>
                  <span className="dp-tag">{m.tag}</span>
                </div>
                <b className="dp-name">{m.brand} {m.name}</b>
                <span className="dp-price">{m.price}</span>
                <p className="dp-blurb">{m.blurb}</p>
                <ul className="dp-specs">{m.specs.map((s,i)=><li key={i}><Icon name="check"/>{s}</li>)}</ul>
                <a className="dp-buy" href={m.buy} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}>View on Amazon <Icon name="chevright"/></a>
              </button>
            ))}
          </div>
          <p className="dp-note"><Icon name="info"/> <span>Also works with most <b>Yealink</b>, <b>Poly</b>, and <b>Grandstream</b> SIP phones. Avoid carrier-locked phones from other providers.</span></p>
        </div>
      )}

      {step===3 && (
        <div className="dp-connect">
          <div className="dp-qr"><QRishCode/></div>
          <div className="dp-connect-tx">
            <b>Scan to connect{model?` your ${model.brand} ${model.name}`:''}</b>
            <p>On the phone, open <b>Settings → Provisioning → Scan QR</b> and point it at this code. It downloads its setup and registers in about a minute - no codes to type.</p>
            <div className="dp-manual"><span>Can’t scan?</span> Enter this on the phone: <code>{code}</code></div>
            <label className="dp-asglbl">Which extension should it ring for?</label>
            <select className="select" value={ext} onChange={e=>setExt(e.target.value)}>
              {['Operator','Sales','Support','Billing'].map(o=><option key={o} value={o}>{o}</option>)}
            </select>
            <p className="dp-pending"><Icon name="info"/> <span>It’ll show as <b>Waiting for phone</b> here until it checks in, then flips to <b>Connected</b>.</span></p>
          </div>
        </div>
      )}
    </Modal>
  );
}
function DeviceRow({ d, onDisable, onRemove }){
  const sip = d.type==='sip';
  return (
    <SRow icon={sip?'monitor':'smartphone'} title={d.name} muted={d.status==='disabled'}
      meta={<>{sip?'Desk phone':`Mobile app · ${d.who}`}<span className="sep">·</span>Rings for {d.rings}<span className="sep">·</span>Calls out as {d.cid}</>}
      trail={<>
        {d.status==='active' && <SStatus kind="g" label="Connected"/>}
        {d.status==='offline' && <SStatus kind="a" label="Offline"/>}
        {d.status==='pending' && <SStatus kind="a" label="Waiting for phone"/>}
        {d.status==='disabled' && <SStatus kind="off" label="Disabled"/>}
        <SMenu items={[
          { icon:'pencil', label:'Rename device' },
          { icon:'route', label:'Set default extension' },
          { icon:'hashnum', label:'Set caller ID' },
          { sep:true },
          d.status==='disabled'
            ? { icon:'check', label:'Enable device', onClick:()=>onDisable(d.id,false) }
            : { icon:'ban', label:'Disable device', onClick:()=>onDisable(d.id,true) },
          { icon:'trash', label:'Remove', danger:true, onClick:()=>onRemove(d.id) },
        ]}/>
      </>}/>
  );
}
function DevicesSection({ onBack }){
  const [devices,setDevices]=sxState(SX_DEVICES);
  const [addOpen,setAddOpen]=sxState(false);
  const setStatus=(id,disabled)=>setDevices(ds=>ds.map(d=>d.id===id?{...d,status:disabled?'disabled':'active'}:d));
  const remove=(id)=>setDevices(ds=>ds.filter(d=>d.id!==id));
  const addPhone=(name,rings)=>setDevices(ds=>[...ds,{ id:'dv'+Date.now(), name, type:'sip', status:'pending', rings, cid:'Main · (617) 555-0100' }]);
  const sip = devices.filter(d=>d.type==='sip');
  const app = devices.filter(d=>d.type==='app');
  const offline = devices.find(d=>d.status==='offline');
  return (
    <SetDetail title="Devices" onBack={onBack}
      sub="The phones and apps that ring when a call reaches an extension. Devices are endpoints - what actually rings - while extensions decide who gets the call.">
      {offline && (
        <div className="note warn" style={{marginBottom:18}}>
          <Icon name="info"/>
          <span><b>{offline.name} is offline.</b> It’s probably unplugged or powered off. Calls skip it and ring your other devices - plug it back in and it reconnects on its own.</span>
        </div>
      )}
      <div className="ss-grouph">Desk phones</div>
      <Card flush>
        {sip.map(d=><DeviceRow key={d.id} d={d} onDisable={setStatus} onRemove={remove}/>)}
        <button className="add-row" onClick={()=>setAddOpen(true)}><span className="plus"><Icon name="plus"/></span> Add a desk phone</button>
      </Card>
      <p className="ss-foot">JOEL supports approved phone models only - plug one in and it connects automatically. No setup codes, no telecom settings.</p>
      {addOpen && <AddDeskPhoneFlow onClose={()=>setAddOpen(false)} onAdd={addPhone}/>}

      <div className="ss-grouph">Mobile app</div>
      <Card flush>
        {app.map(d=><DeviceRow key={d.id} d={d} onDisable={setStatus} onRemove={remove}/>)}
      </Card>
      <p className="ss-foot">A teammate’s phone becomes a device when they sign in to the JOEL app. Add people on the <b>Users &amp; roles</b> screen.</p>
    </SetDetail>
  );
}

/* ========================================================== */
/* MUSIC ON HOLD                                              */
/* ========================================================== */
const SX_HOLD = [
  { id:'ambient', name:'Ambient Calm',  desc:'Soft, neutral pads. A safe default for most businesses.' },
  { id:'acoustic',name:'Soft Acoustic', desc:'Warm guitar - friendly and unobtrusive.' },
  { id:'piano',   name:'Classic Piano', desc:'Understated piano. Reads as established and professional.' },
  { id:'lofi',    name:'Lo-fi Beats',   desc:'Relaxed downtempo. Best for younger, casual audiences.' },
];
function HoldSection({ onBack }){
  const [sel,setSel]=sxState('ambient');
  return (
    <SetDetail title="Music on hold" onBack={onBack}
      sub="What callers hear while they wait to be connected - for example during call screening, or while JOEL rings your next destination.">
      <Card flush>
        {SX_HOLD.map(h=>(
          <div className="ss-row" key={h.id}>
            <button className={`choice${sel===h.id?' on':''}`} style={{flex:1,padding:0,border:'none',background:'none'}} onClick={()=>setSel(h.id)} role="radio" aria-checked={sel===h.id}>
              <span className="radio"/>
              <span className="ctext"><b>{h.name}{h.id==='ambient' && <span className="pill ext tag-ext">Default</span>}</b><span>{h.desc}</span></span>
            </button>
            <span className="ss-trail"><ListenBtn/></span>
          </div>
        ))}
      </Card>
      <p className="ss-foot">New businesses start on <b>Ambient Calm</b> - a safe choice for any audience. Prefer a plain ring tone with no music? That’s set per extension, under Forwarding.</p>

      <div className="ss-grouph">Your own track</div>
      <Card flush>
        <SRow icon="music" iconCls="blue" title="Upload an audio file"
          meta="MP3 or WAV, up to 10 MB. We’ll loop it smoothly. Use music you have the rights to play."
          trail={<button className="btn btn-secondary sm"><Icon name="download" style={{transform:'rotate(180deg)'}}/> Upload</button>}/>
      </Card>
    </SetDetail>
  );
}

/* ========================================================== */
/* USERS & ROLES                                              */
/* ========================================================== */
const SX_USERS = [
  { id:'us1', name:'Bob Stevens', email:'bob@smilebar.co', role:'owner', scope:'all',  exts:[], perms:{} },
  { id:'us2', name:'Mara Lopez',  email:'mara@smilebar.co', role:'admin', scope:'all',  exts:[], perms:{} },
  { id:'us3', name:'Jane Cho',    email:'jane@smilebar.co', role:'user',  scope:'some', exts:['e1','e2'], perms:{ inbox:true, reports:true, integrations:false } },
  { id:'us4', name:'Dev Patel',   email:'dev@smilebar.co',  role:'user',  scope:'some', exts:['e3'], perms:{}, pending:true },
];

/* add-on permissions a USER can be granted (an Admin always has them all) */
const UR_PERMS = [
  { key:'inbox',        icon:'inbox',   label:'Shared text inbox', desc:'Read and reply in the business text inbox.' },
  { key:'reports',      icon:'sliders', label:'Reports & analytics', desc:'View call and message reports.' },
  { key:'integrations', icon:'layers',  label:'Integrations', desc:'Connect and manage Slack, WhatsApp, and webhooks.' },
];
const UR_PERM_SHORT = { inbox:'Inbox', reports:'Reports', integrations:'Integrations' };
const UR_ROLE = {
  owner: { label:'Owner', cls:'role-owner', icon:'shield', desc:'Full access including billing. Exactly one \u2014 can\u2019t be removed.' },
  admin: { label:'Admin', cls:'role-admin', icon:'shield', desc:'Runs the whole system \u2014 every extension, all permissions, settings, and users.' },
  user:  { label:'User',  cls:'role-user',  icon:'user',   desc:'Works only the extensions you assign. Grant extra permissions below.' },
};
function urExtSummary(u, roster){
  if(u.scope==='all') return 'All extensions';
  const list=(u.exts||[]).map(id=>roster.find(e=>e.id===id)).filter(Boolean);
  if(list.length===0) return 'No extensions';
  const labels=list.map(e=>`Ext. ${e.number} ${e.name}`);
  if(labels.length<=2) return labels.join(', ');
  return `${labels.slice(0,2).join(', ')} +${labels.length-2}`;
}
function urPermSummary(u){
  if(u.role==='owner'||u.role==='admin') return 'Full access';
  const on=UR_PERMS.filter(p=>u.perms[p.key]);
  if(on.length===0) return 'No added permissions';
  return on.map(p=>UR_PERM_SHORT[p.key]).join(', ');
}
function RoleTag({ role }){ const m=UR_ROLE[role]||UR_ROLE.user; return <span className={`role-pill ${m.cls}`}><Icon name={m.icon}/>{m.label}</span>; }

/* per-user access page (Shopify-style: list \u2192 detail) */
function UserAccess({ user:u, roster, onBack, onChange, onTransfer, onRemove }){
  const setScope=(scope)=>onChange({ ...u, scope, exts: scope==='all'?[]:u.exts });
  const toggleExt=(id)=>{ const has=(u.exts||[]).includes(id); onChange({ ...u, scope:'some', exts: has?u.exts.filter(x=>x!==id):[...(u.exts||[]),id] }); };
  const togglePerm=(key)=>onChange({ ...u, perms:{...u.perms,[key]:!u.perms[key]} });
  const applyRole=(r)=>{ if(r==='admin') onChange({ ...u, role:'admin', scope:'all', exts:[] }); else onChange({ ...u, role:'user' }); };
  const owner = u.role==='owner';
  return (
    <div className="ss-detail">
      <button className="lv-back" onClick={onBack}><Icon name="arrowleft"/> Users &amp; roles</button>
      <div className="ud-id">
        <Avatar name={u.name}/>
        <div className="ud-id-tx">
          <div className="ud-id-name"><h1>{u.name}</h1><RoleTag role={u.role}/>{u.pending && <span className="pill ext">Invite sent</span>}</div>
          <div className="ud-id-email">{u.email}</div>
        </div>
      </div>
      {owner ? (<>
        <div className="ud-card pad ud-note"><span className="perm-ic blue"><Icon name="shield"/></span>
          <div><b>This person owns the workspace</b><p>The Owner has every extension and permission, including billing - there’s nothing to limit. To move ownership to someone else, use the button below.</p></div></div>
        <div className="ud-danger" style={{marginTop:26}}>
          <span className="perm-ic"><Icon name="shield"/></span>
          <div className="ud-danger-tx"><b>Transfer ownership</b><p>Hand the Owner role - including billing - to an Admin. You become an Admin.</p></div>
          <button className="btn btn-secondary sm" onClick={onTransfer}>Transfer ownership</button>
        </div>
      </>) : (<>
        <div className="ss-grouph">Role</div>
        <div className="ud-card pad">
          <div className="ud-roles">
            {['admin','user'].map(r=>{ const m=UR_ROLE[r]; const on=u.role===r; return (
              <button key={r} className={`ud-role${on?' on':''}`} onClick={()=>applyRole(r)}>
                <span className="ud-role-top"><Icon name={m.icon}/><b>{m.label}</b><span className="ck">{on && <Icon name="check" sw={3}/>}</span></span>
                <span>{m.desc}</span>
              </button>
            ); })}
          </div>
        </div>
        {u.role==='admin' ? (
          <div className="ud-card pad ud-note" style={{marginTop:14}}><span className="perm-ic ai"><Icon name="shield"/></span>
            <div><b>Admins have full access</b><p>Every extension, all permissions, and system settings \u2014 nothing to configure here. Switch to <b>User</b> to limit what they can see and do.</p></div></div>
        ) : (<>
          <div className="ss-grouph">Extension access</div>
          <div className="ud-card pad">
            <div className="ur-seg">
              <button className={u.scope==='all'?'on':''} onClick={()=>setScope('all')}>All extensions</button>
              <button className={u.scope!=='all'?'on':''} onClick={()=>setScope('some')}>Choose extensions</button>
            </div>
            {u.scope==='all' ? (
              <div className="ud-allnote"><Icon name="check"/>Sees every extension now \u2014 and any added later.</div>
            ) : (
              <div className="ud-extlist">
                {roster.map(e=>{ const on=(u.exts||[]).includes(e.id); return (
                  <button key={e.id} className={`ud-ext${on?' on':''}`} onClick={()=>toggleExt(e.id)}>
                    <span className="ud-extkey">{e.number}</span>
                    <span className="ud-extnm"><b>{e.name}</b><span>Ext. {e.number}</span></span>
                    <span className="ud-extck">{on && <Icon name="check" sw={3}/>}</span>
                  </button>
                ); })}
                <div className="ud-allnote muted"><Icon name="info"/>The Operator (0) is shared with everyone.</div>
              </div>
            )}
          </div>
          <div className="ss-grouph">Permissions <span className="ud-sec-sub">\u2014 on top of their extensions</span></div>
          <div className="ud-card">
            {UR_PERMS.map(p=>(
              <div className="perm" key={p.key}>
                <span className="perm-ic"><Icon name={p.icon}/></span>
                <div className="perm-tx"><b>{p.label}</b><p>{p.desc}</p></div>
                <div className="perm-trail"><Toggle on={!!u.perms[p.key]} onChange={()=>togglePerm(p.key)}/></div>
              </div>
            ))}
          </div>
        </>)}
        <div className="ud-danger"><span className="perm-ic"><Icon name="shield"/></span>
          <div className="ud-danger-tx"><b>Make this person the Owner</b><p>Transfers billing and full control. You become an Admin.</p></div>
          <button className="btn btn-secondary sm" onClick={onTransfer}>Transfer ownership</button></div>
        <div className="ud-danger" style={{marginTop:10}}><span className="perm-ic red"><Icon name="trash"/></span>
          <div className="ud-danger-tx"><b>{u.pending?'Cancel invite':'Remove from workspace'}</b><p>{u.pending?'They won\u2019t be able to join.':'They lose access immediately. Your phones keep ringing.'}</p></div>
          <button className="btn btn-secondary sm ud-removebtn" onClick={onRemove}>{u.pending?'Cancel invite':'Remove'}</button></div>
      </>)}
    </div>
  );
}

/* one access dimension as a toggle-pill: Extensions · Inbox · Admin */
function AccessChip({ icon, label, on, locked, onClick }){
  const Tag = locked || !onClick ? 'span' : 'button';
  return (
    <Tag className={`acc-chip${on?' on':''}${locked?' locked':''}`} onClick={locked?undefined:onClick}>
      <Icon name={icon} className="acc-cic"/>{label}
      {locked && <Icon name="lock" className="acc-lock"/>}
    </Tag>
  );
}

function ExtAccessModal({ user, extensions, onClose, onSave }){
  const roster = (extensions||[]).filter(e=>e.number!==0); // Operator is shared, granted to everyone
  const [sel,setSel]=sxState(()=>new Set((user.exts||[]).filter(id=>id!=='e0')));
  const all = roster.length>0 && roster.every(e=>sel.has(e.id));
  const toggle=(id)=>setSel(s=>{ const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; });
  const toggleAll=()=>setSel(all?new Set():new Set(roster.map(e=>e.id)));
  return (
    <Modal icon="route" title="Extension access" desc={`Which extensions ${user.name} can use - they’ll see those calls, voicemails, and recordings. The Operator (0) is shared with everyone.`} onClose={onClose}
      footer={<><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>onSave(['e0',...roster.filter(e=>sel.has(e.id)).map(e=>e.id)])}>Save access</button></>}>
      <div className="acc-allrow" role="button" onClick={toggleAll}>
        <span className="acc-allmain"><b>All extensions</b><span>Everything now and any added later</span></span>
        <Toggle on={all} onChange={()=>{}}/>
      </div>
      <div className="acc-extlist">
        {roster.map(e=>{ const on=sel.has(e.id); return (
          <button key={e.id} className={`acc-extrow${on?' on':''}`} onClick={()=>toggle(e.id)}>
            <span className="acc-extkey">{e.number}</span>
            <span className="acc-extname"><b>{e.name}</b>{e.status==='disabled' && <span className="acc-extoff">Turned off</span>}</span>
            <span className={`acc-check${on?' on':''}`}>{on && <Icon name="check"/>}</span>
          </button>
        ); })}
      </div>
    </Modal>
  );
}

function TransferModal({ owner, candidates, onClose, onConfirm }){
  const [pick,setPick]=sxState(null);
  const [ack,setAck]=sxState(false);
  const chosen = candidates.find(c=>c.id===pick);
  return (
    <Modal icon="shield" title="Transfer ownership" desc="There’s exactly one Owner. Handing it over makes that person the Owner - including billing - and turns you into an Admin. This can’t be undone from here." onClose={onClose}
      footer={<><button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!pick||!ack} style={(!pick||!ack)?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onConfirm(pick)}>Transfer ownership</button></>}>
      <div className="ss-grouph" style={{marginTop:0}}>Make Owner</div>
      <div className="acc-extlist">
        {candidates.length===0 && <p className="ss-foot" style={{margin:'4px 2px'}}>Only Admins can become Owner. Make someone an Admin first.</p>}
        {candidates.map(c=>(
          <button key={c.id} className={`acc-extrow${pick===c.id?' on':''}`} onClick={()=>setPick(c.id)}>
            <Avatar name={c.name}/>
            <span className="acc-extname" style={{marginLeft:10}}><b>{c.name}</b><span className="acc-extoff" style={{color:'var(--muted)'}}>{c.email}</span></span>
            <span className={`acc-check${pick===c.id?' on':''}`}>{pick===c.id && <Icon name="check"/>}</span>
          </button>
        ))}
      </div>
      {chosen && (
        <button className="acc-ack" onClick={()=>setAck(a=>!a)}>
          <span className={`acc-checkbox${ack?' on':''}`}>{ack && <Icon name="check"/>}</span>
          <span>I understand {chosen.name} will control billing and I’ll become an Admin.</span>
        </button>
      )}
    </Modal>
  );
}

function UsersSection({ onBack, extensions }){
  const [users,setUsers]=sxState(SX_USERS);
  const [openId,setOpenId]=sxState(null);
  const [transfer,setTransfer]=sxState(false);
  const roster=(extensions||[]).filter(e=>e.number!==0);
  const open=users.find(u=>u.id===openId);
  const update=(nu)=>setUsers(us=>us.map(u=>u.id===nu.id?nu:u));
  const remove=()=>{ setUsers(us=>us.filter(u=>u.id!==openId)); setOpenId(null); };
  const owner=users.find(u=>u.role==='owner');
  const candidates=users.filter(u=>u.role==='admin' && !u.pending);

  if(open){
    return (<>
      <UserAccess user={open} roster={roster} onBack={()=>setOpenId(null)} onChange={update}
        onTransfer={()=>setTransfer(true)} onRemove={remove}/>
      {transfer && <TransferModal owner={owner} candidates={candidates} onClose={()=>setTransfer(false)}
        onConfirm={(newId)=>{ setUsers(us=>us.map(x=> x.id===newId?{...x,role:'owner',scope:'all',exts:[]} : x.role==='owner'?{...x,role:'admin'}:x )); setTransfer(false); }}/>}
    </>);
  }

  return (
    <SetDetail title="Users & roles" onBack={onBack}
      sub="Who can sign in, which extensions they see, and what they can manage. Select a person to set their access.">
      <div className="ulist">
        {users.map(u=>(
          <button key={u.id} className={`uitem${u.pending?' pending':''}`} onClick={()=>setOpenId(u.id)}>
            <Avatar name={u.name}/>
            <div className="uitem-body">
              <div className="uitem-top"><b>{u.name}</b><RoleTag role={u.role}/>{u.pending && <span className="pill ext">Invite sent</span>}</div>
              <div className="uitem-sum">{urExtSummary(u,roster)}<span className="dot">•</span>{urPermSummary(u)}</div>
            </div>
            <span className="uitem-chev"><Icon name="chevright"/></span>
          </button>
        ))}
        <button className="add-row"><span className="plus"><Icon name="plus"/></span> Invite a teammate</button>
      </div>
      <p className="ss-foot">JOEL still rings your phones whether or not anyone has an account - accounts only control who can sign in and what they can see or change. There’s always exactly one <b>Owner</b>: full access including billing, can’t be removed.</p>
    </SetDetail>
  );
}

/* ========================================================== */
/* BUSINESS PROFILE                                           */
/* ========================================================== */
function ProfileSection({ businessName, onNav, onBack }){
  const [name,setName]=sxState(businessName||'Smilebar');
  const [spoken,setSpoken]=sxState(businessName||'Smilebar');
  const [cid,setCid]=sxState(businessName||'Smilebar');
  const [savedCid,setSavedCid]=sxState(businessName||'Smilebar');
  const [tz,setTz]=sxState('Eastern (ET)');
  const TZS=['Eastern (ET)','Central (CT)','Mountain (MT)','Pacific (PT)','Alaska (AKT)','Hawaii (HT)'];
  return (
    <SetDetail title="Business profile" onBack={onBack}
      sub="Your company’s identity. The name is used in greetings, voicemail, and generated audio, so it’s worth getting the pronunciation right.">
      <Card icon="building" title="Identity">
        <div style={{display:'flex',gap:16,alignItems:'flex-start',marginBottom:18}}>
          <div className="ss-logo">LOGO<br/>1:1</div>
          <div style={{flex:1,paddingTop:2}}>
            <p style={{fontSize:'.86rem',color:'var(--body)',lineHeight:1.5}}>Add a square logo. It shows in the app and on email notifications - it isn’t played to callers.</p>
            <div className="ss-actions" style={{marginTop:10}}><button className="btn btn-secondary sm">Upload logo</button></div>
          </div>
        </div>
        <Field label="Business name" help="Shown across the app and written into your greetings.">
          <div style={{maxWidth:360}}><input className="input" value={name} onChange={e=>setName(e.target.value)}/></div>
        </Field>
        <Field label="How it’s pronounced" help="How JOEL says your name in generated audio. Spell it out if it’s tricky - e.g. “Smile-bar.”">
          <div style={{maxWidth:360,display:'flex',gap:8}}>
            <input className="input" value={spoken} onChange={e=>setSpoken(e.target.value)}/>
            <ListenBtn/>
          </div>
        </Field>
        <Field label="Caller ID name (CNAM)" help="The name shown to people you call - used on every business number. Carriers display it where supported.">
          <div style={{maxWidth:360,display:'flex',gap:8}}>
            <input className="input" value={cid} onChange={e=>setCid(e.target.value)} maxLength={15}/>
            <button className="btn btn-secondary sm" disabled={cid===savedCid} style={cid===savedCid?{opacity:.45,pointerEvents:'none'}:null} onClick={()=>setSavedCid(cid)}>{cid===savedCid?'Saved':'Save'}</button>
          </div>
        </Field>
      </Card>

      <Card icon="route" title="Address" desc="Used for billing and number registration. Not shared with callers.">
        <Field label="Street"><div style={{maxWidth:420}}><input className="input" defaultValue="221 Newbury St, Suite 4"/></div></Field>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:12,maxWidth:420}}>
          <Field label="City"><input className="input" defaultValue="Boston"/></Field>
          <Field label="State"><input className="input" defaultValue="MA"/></Field>
          <Field label="ZIP"><input className="input" defaultValue="02116"/></Field>
        </div>
      </Card>

      <Card icon="clock" title="Time & hours" flush>
        <div className="ss-row">
          <span className="ss-ic"><Icon name="clock"/></span>
          <span className="ss-main"><b>Time zone</b><span className="ss-meta">JOEL uses this to decide when you’re open and which greeting to play.</span></span>
          <span className="ss-trail">
            <select className="select" value={tz} onChange={e=>setTz(e.target.value)}>{TZS.map(t=><option key={t} value={t}>{t}</option>)}</select>
          </span>
        </div>
        <SRow icon="calendar" title="Business hours" meta="Mon–Fri, 9:00 AM – 5:00 PM · Holiday calendar on" tappable onClick={()=>onNav&&onNav('greetings')}
          trail={<Icon name="chevright" style={{width:16,height:16,color:'var(--muted)'}}/>}/>
      </Card>
      <p className="ss-foot">Hours and holidays live with your <span className="inline-link" onClick={()=>onNav&&onNav('greetings')}>main greeting</span>, since they decide which greeting callers hear.</p>
    </SetDetail>
  );
}

Object.assign(window, {
  SetDetail, SRow, SStatus, SMenu, ListenBtn, AddDeskPhoneFlow,
  DirectorySection, DevicesSection, HoldSection, UsersSection, ProfileSection,
});
