/* ============================================================
   JOEL app - Call Forwarding (quick, on-the-go management)
   One light, airy page: every extension and its forwarding
   numbers. Flip forwarding on/off, set hours, screen calls.
   Deeper edits open the extension's Forwarding panel.
   ============================================================ */
const { Icon: CFIcon, Toggle: CFToggle } = window;
const CF_use = React.useState;
const CF_useEffect = React.useEffect;
const CF_useRef = React.useRef;

const CF_SCHEDS = ['24/7', 'Mon–Fri, 9–5', 'Mon–Fri, 8–6', 'Mon–Sat, 9–6', 'Weekends only'];
const CF_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CF_TIMES = (()=>{ const out=[]; for(let h=0;h<24;h++){ const ap=h<12?'AM':'PM'; const hh=h%12===0?12:h%12; out.push(`${hh}:00 ${ap}`); out.push(`${hh}:30 ${ap}`);} return out; })();
const cfTime=(t)=>t.replace(':00','');
function cfDaysLabel(days){
  const wd=['Mon','Tue','Wed','Thu','Fri'];
  if(days.length===7) return 'Every day';
  if(days.length===5 && wd.every(d=>days.includes(d))) return 'Mon–Fri';
  if(days.length===2 && days.includes('Sat') && days.includes('Sun')) return 'Weekends';
  return days.join(', ');
}

const CF_SCREEN = [
  { id:'direct',   label:'Direct Connect', icon:'forward', desc:'Connect when you answer. Good for call centers, not recommended for mobile phones.' },
  { id:'announce', label:'Announce',       icon:'voicemailbox', desc:'Announce the incoming call before you’re connected. You must press 1 to accept the call. Recommended for mobile phones.' },
  { id:'screen',   label:'Screen',         icon:'shield', desc:'Ask the caller for their name, then you choose to accept.' },
];
const CF_screenMeta = (id)=>CF_SCREEN.find(s=>s.id===id)||CF_SCREEN[0];

const CF_SEED = [
  { number:0, name:'Operator', on:true, dests:[
    { id:'o1', label:'Front Desk', value:'(617) 555-2200', kind:'sip', on:true, sched:'24/7', screen:'direct' },
  ]},
  { number:1, name:'Sales', on:true, dests:[
    { id:'s1', label:'Jane Cho', value:'Mobile app', kind:'app', on:true, sched:'24/7', screen:'announce' },
    { id:'s2', label:'My cell', value:'(617) 555-1141', kind:'phone', on:true, sched:'24/7', screen:'direct' },
    { id:'s3', label:'Front Desk', value:'(617) 555-2200', kind:'sip', on:true, sched:'Mon–Fri, 9–5', screen:'direct' },
  ]},
  { number:2, name:'Support', on:true, dests:[
    { id:'su1', label:'Front Desk', value:'(617) 555-2200', kind:'sip', on:true, sched:'24/7', screen:'direct' },
    { id:'su2', label:'Support line', value:'(617) 555-2201', kind:'sip', on:false, sched:'24/7', screen:'direct' },
  ]},
  { number:3, name:'Billing', on:false, dests:[
    { id:'b1', label:'Susan', value:'(617) 555-3300', kind:'phone', on:true, sched:'24/7', screen:'direct' },
  ]},
  { number:101, name:'Bob Smith', on:true, dests:[
    { id:'bs1', label:'Bob’s Mobile', value:'(617) 555-0142', kind:'phone', on:true, sched:'24/7', screen:'screen' },
  ]},
];

const CF_KIND_ICON = { phone:'phone', app:'smartphone', sip:'monitor' };

function CallForwardingScreen({ onOpenExt }){
  const [data,setData]=CF_use(CF_SEED);
  const [openDD,setOpenDD]=CF_use(null); // "<destId>:sched" | "<destId>:screen"
  const rootRef=CF_useRef(null);
  CF_useEffect(()=>{ if(!openDD) return; const h=e=>{ if(!e.target.closest('.cf-ddwrap')){ setOpenDD(null); setCustom(null); } }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[openDD]);
  const mapExt=(num,fn)=>setData(d=>d.map(e=>e.number===num?fn(e):e));
  const mapDest=(num,id,fn)=>mapExt(num,e=>({...e,dests:e.dests.map(x=>x.id===id?fn(x):x)}));
  const toggleExt=(num)=>mapExt(num,e=>({...e,on:!e.on}));
  const toggleDest=(num,id)=>mapDest(num,id,x=>({...x,on:!x.on}));
  const setSched=(num,id,s)=>mapDest(num,id,x=>({...x,sched:s}));
  const setScreen=(num,id,s)=>mapDest(num,id,x=>({...x,screen:s}));
  const [custom,setCustom]=CF_use(null); // { num, id, days, from, to } when editing a custom schedule
  const toggleCustomDay=(d)=>setCustom(c=>({...c,days:c.days.includes(d)?c.days.filter(x=>x!==d):[...c.days,d]}));
  const openCustom=(num,id)=>setCustom({num,id,days:['Mon','Tue','Wed','Thu','Fri'],from:'9:00 AM',to:'5:00 PM'});
  const saveCustom=()=>{ if(!custom) return; const lbl=custom.days.length?`${cfDaysLabel(custom.days)}, ${cfTime(custom.from)}–${cfTime(custom.to)}`:'24/7'; setSched(custom.num,custom.id,lbl); setCustom(null); setOpenDD(null); };
  const [adding,setAdding]=CF_use(null); // ext number showing the add form
  const [draft,setDraft]=CF_use({value:'',label:''});
  const removeDest=(num,id)=>mapExt(num,e=>({...e,dests:e.dests.filter(x=>x.id!==id)}));
  const [confirmDel,setConfirmDel]=CF_use(null); // dest id pending delete confirmation
  const startAdd=(num)=>{ setDraft({value:'',label:''}); setAdding(num); };
  const addNumber=(num)=>{ const v=draft.value.trim(); if(!v) return; mapExt(num,e=>({...e,dests:[...e.dests,{ id:'n'+Date.now(), label:(draft.label.trim()||v), value:v, kind:'phone', on:true, sched:'24/7', screen:'direct' }]})); setAdding(null); setDraft({value:'',label:''}); };

  return (
    <div className="cf" ref={rootRef}>
      <div className="cf-head">
        <h1 className="cf-title">Call Forwarding</h1>
        <p className="cf-sub">Turn forwarding on or off, set hours, and choose how callers connect - across every extension. Tap <b>Edit</b> on an extension for the full setup.</p>
      </div>

      <div className="cf-list">
        {data.map(e=>{
          const liveCount=e.dests.filter(x=>x.on).length;
          return (
            <section className={`cf-ext${e.on?'':' paused'}`} key={e.number}>
              <header className="cf-ext-h">
                <span className="cf-num">{e.number}</span>
                <div className="cf-ext-t">
                  <b>{e.name}</b>
                  <span>{e.on
                    ? `Ringing ${liveCount} number${liveCount!==1?'s':''}`
                    : 'Away - callers go straight to voicemail'}</span>
                </div>
                <button className="cf-edit" onClick={()=>onOpenExt&&onOpenExt(e.number)}>Edit</button>
                <button className={`away-flag${e.on?' open':''}`} onClick={()=>toggleExt(e.number)} title="Toggle availability"><span className="away-flag-dot"/>{e.on?'Active':'Away'}</button>
              </header>

              {e.on && (
                <div className="cf-dests">
                  {e.dests.map(x=>{
                    const sm=CF_screenMeta(x.screen);
                    return confirmDel===x.id ? (
                    <div className="cf-dest cf-confirm" key={x.id}>
                      <span className="cf-dest-ic warn"><CFIcon name="trash"/></span>
                      <p className="cf-confirm-msg"><b>Remove {x.label}?</b> Calls to {e.name} won’t ring this number anymore.</p>
                      <div className="cf-confirm-acts">
                        <button className="btn btn-ghost sm" onClick={()=>setConfirmDel(null)}>Cancel</button>
                        <button className="btn btn-danger sm" onClick={()=>{ removeDest(e.number,x.id); setConfirmDel(null); }}>Remove</button>
                      </div>
                    </div>
                    ) : (
                    <div className={`cf-dest${x.on?'':' off'}`} key={x.id}>
                      <span className="cf-dest-ic"><CFIcon name={CF_KIND_ICON[x.kind]||'phone'}/></span>
                      <div className="cf-dest-t">
                        <b>{x.label}</b>
                        <span>{x.value}</span>
                      </div>
                      <div className="cf-dest-ctrls">
                        {/* schedule dropdown */}
                        <div className="cf-ddwrap">
                          <button className={`cf-chip${x.sched!=='24/7'?' alt':''}${openDD===x.id+':sched'?' active':''}`} onClick={()=>setOpenDD(o=>o===x.id+':sched'?null:x.id+':sched')}>
                            <CFIcon name="clock"/> {x.sched} <CFIcon name="chevdown" style={{width:12,height:12}}/>
                          </button>
                          {openDD===x.id+':sched' && (
                            <div className="cf-dd">
                              {custom && custom.id===x.id ? (
                                <div className="cf-custom">
                                  <p className="cf-dd-h">Custom hours</p>
                                  <div className="cf-custom-days">
                                    {CF_DAYS.map(d=>(
                                      <button key={d} className={`cf-day${custom.days.includes(d)?' on':''}`} onClick={()=>toggleCustomDay(d)}>{d}</button>
                                    ))}
                                  </div>
                                  <div className="cf-custom-times">
                                    <select className="cf-time-sel" value={custom.from} onChange={ev=>setCustom(c=>({...c,from:ev.target.value}))}>{CF_TIMES.map(t=><option key={t}>{t}</option>)}</select>
                                    <span className="cf-time-dash">–</span>
                                    <select className="cf-time-sel" value={custom.to} onChange={ev=>setCustom(c=>({...c,to:ev.target.value}))}>{CF_TIMES.map(t=><option key={t}>{t}</option>)}</select>
                                  </div>
                                  <div className="cf-custom-acts">
                                    <button className="btn btn-ghost sm" onClick={()=>setCustom(null)}>Back</button>
                                    <button className="btn btn-primary sm" disabled={!custom.days.length} onClick={saveCustom}>Save</button>
                                  </div>
                                </div>
                              ) : (
                                <React.Fragment>
                                  <p className="cf-dd-h">When does this ring?</p>
                                  {CF_SCHEDS.map(s=>(
                                    <button key={s} className={`cf-dd-opt${x.sched===s?' on':''}`} onClick={()=>{ setSched(e.number,x.id,s); setOpenDD(null); }}>
                                      <span>{s}</span>{x.sched===s && <CFIcon name="check"/>}
                                    </button>
                                  ))}
                                  <button className="cf-dd-opt cf-dd-more" onClick={()=>openCustom(e.number,x.id)}>
                                    <span>Custom…</span><CFIcon name="chevright"/>
                                  </button>
                                </React.Fragment>
                              )}
                            </div>
                          )}
                        </div>
                        {/* screening dropdown */}
                        <div className="cf-ddwrap">
                          <button className={`cf-chip${x.screen!=='direct'?' on':''}${openDD===x.id+':screen'?' active':''}`} onClick={()=>setOpenDD(o=>o===x.id+':screen'?null:x.id+':screen')}>
                            <CFIcon name={sm.icon}/> {sm.label} <CFIcon name="chevdown" style={{width:12,height:12}}/>
                          </button>
                          {openDD===x.id+':screen' && (
                            <div className="cf-dd wide">
                              <p className="cf-dd-h">How should the call connect?</p>
                              {CF_SCREEN.map(s=>(
                                <button key={s.id} className={`cf-dd-opt rich${x.screen===s.id?' on':''}`} onClick={()=>{ setScreen(e.number,x.id,s.id); setOpenDD(null); }}>
                                  <span className="cf-dd-ic"><CFIcon name={s.icon}/></span>
                                  <span className="cf-dd-rt"><b>{s.label}</b><small>{s.desc}</small></span>
                                  {x.screen===s.id && <CFIcon name="check"/>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <CFToggle on={x.on} onChange={()=>toggleDest(e.number,x.id)} sm/>
                        <button className="cf-remove" onClick={()=>setConfirmDel(x.id)} aria-label="Remove number" title="Remove number"><CFIcon name="trash"/></button>
                      </div>
                    </div>
                  );})}
                  {adding===e.number ? (
                    <div className="cf-add">
                      <span className="cf-dest-ic"><CFIcon name="phone"/></span>
                      <input className="cf-add-in num" autoFocus placeholder="(617) 555-0000" value={draft.value} onChange={ev=>setDraft(d=>({...d,value:ev.target.value}))} onKeyDown={ev=>{ if(ev.key==='Enter') addNumber(e.number); }}/>
                      <input className="cf-add-in" placeholder="Label (optional)" value={draft.label} onChange={ev=>setDraft(d=>({...d,label:ev.target.value}))} onKeyDown={ev=>{ if(ev.key==='Enter') addNumber(e.number); }}/>
                      <button className="btn btn-ghost sm" onClick={()=>{ setAdding(null); setDraft({value:'',label:''}); }}>Cancel</button>
                      <button className="btn btn-primary sm" disabled={!draft.value.trim()} onClick={()=>addNumber(e.number)}>Add</button>
                    </div>
                  ) : (
                    <button className="cf-addbtn" onClick={()=>startAdd(e.number)}><CFIcon name="plus"/> Add a number</button>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { CallForwardingScreen });
