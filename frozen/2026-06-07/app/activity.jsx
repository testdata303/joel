/* ============================================================
   JOEL app — global Activity screen (exports ActivityScreen)
   One merged feed of calls + voicemails + texts across every
   extension the user can access. Filter by type and by extension.
   ============================================================ */
const { Icon, Avatar, identityOf, fmtRowTime, fmtDayHeader } = window;
const { useState, useRef, useEffect } = React;
function vmSec(s){ const [m,x]=String(s).split(':').map(Number); return (m||0)*60+(x||0); }
function vmFmt(t){ const m=Math.floor(t/60), s=Math.round(t%60); return `${m}:${String(s).padStart(2,'0')}`; }

const DIRA = {
  in:     { ic:'arrowdownleft', label:'Incoming call', cls:'in' },
  out:    { ic:'arrowupright',  label:'Outgoing call', cls:'out' },
  missed: { ic:'arrowdownleft', label:'Missed call',   cls:'missed' },
};
function actTime(when){ const p=String(when).split(','); return (p[1]||p[0]||'').trim(); }
function actDay(when){ return (String(when).split(',')[0]||'').trim(); }
function shortNum(n){ return String(n||'').replace(/^\+1\s*/,''); }

// resolve a number's identity from saved contact → any call/voicemail contact/cnam
function numIdentity(num, activity, contactMeta){
  const m = contactMeta && contactMeta[num];
  let contact = (m&&m.name)||null, cnam=null;
  [...activity.calls, ...activity.voicemails].forEach(r=>{
    if(r.num!==num) return;
    if(!contact && r.contact) contact=r.contact;
    if(!cnam && r.cnam) cnam=r.cnam;
  });
  return identityOf({ num, contact, cnam });
}

function ActAvatar({ id }){
  return id.kind==='contact'
    ? <Avatar name={id.name} className="act-av"/>
    : <span className="act-av glyph"><Icon name="user"/></span>;
}

function ActCallRow({ c, hasVm, vm, extLabel, lineNum, lineLabel, cmeta, onOpen, onHeard, extensions, extra, onMove, onUndoMove, onEmail, onSetHeard }){
  const id = identityOf({ ...c, contact:(cmeta&&cmeta.name)||c.contact });
  const answered = c.outcome==='answered';
  const inbound = c.dir!=='out';
  const tm = answered ? (DIRA[c.dir]||DIRA.in) : (inbound ? DIRA.missed : DIRA.out);
  const baseLabel = answered ? tm.label : (inbound ? 'Missed call' : 'No answer');
  const viaPart = answered ? (
    c.dir==='out'
      ? `${c.via?` · ${c.via}`:''}${c.by?` · by ${c.by}`:''}`
      : (c.via?` · ${c.via}`:'')
  ) : '';
  const desc = baseLabel + (answered ? ` · ${c.dur}` : '') + viaPart;
  // playable content: recording (answered) or the linked voicemail (unanswered)
  const showVm = !answered && hasVm && vm;
  const playDur = answered ? c.dur : (showVm ? vm.dur : '0:00');
  const total = vmSec(playDur)||1;
  const sumText = answered ? c.recSummary : (showVm ? vm.summary : null);
  const tsLines = answered ? c.recTranscript : (showVm ? vm.transcript : null);
  const playable = answered ? c.rec : showVm;
  const [open,setOpen]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [pos,setPos]=useState(0);
  const bars = useRef([...Array(56)].map(()=>0.22+Math.random()*0.78));
  useEffect(()=>{ if(!playing) return; const iv=setInterval(()=>{ setPos(p=>{ const n=p+0.1; if(n>=total){ setPlaying(false); return total; } return n; }); },100); return ()=>clearInterval(iv); },[playing,total]);
  const frac = pos/total;
  function toggleExpand(){ setOpen(o=>{ if(!o && showVm && !vm.heard && onHeard) onHeard(vm.id); return !o; }); }
  function togglePlay(e){ e.stopPropagation(); if(showVm && !vm.heard && onHeard) onHeard(vm.id); if(pos>=total) setPos(0); setPlaying(p=>!p); }
  function seek(e){ e.stopPropagation(); const r=e.currentTarget.getBoundingClientRect(); setPos(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*total); }
  const connLine = answered ? (
    c.dir==='out'
      ? (c.by||c.via ? `Placed by ${c.by||'you'}${c.via?` · from ${c.via}`:''}` : null)
      : (c.via ? `Answered on ${c.via}${c.by?` · ${c.by}`:''}` : null)
  ) : null;
  const noRecReason = answered
    ? 'No recording for this call. Turn on call recording in the extension’s settings.'
    : 'This call wasn’t answered, and the caller didn’t leave a voicemail.';
  return (
    <div className={`act-row ${tm.cls} expandable${open?' expanded':''}`}>
      <div className="act-vm-head" onClick={toggleExpand}>
        <span className="act-dot" aria-hidden="true"/>
        <ActAvatar id={id}/>
        <div className="act-main">
          <div className="act-name"><b>{id.primary}</b>{id.kind==='guess' && <span className="act-maybe">Maybe {id.name}</span>}</div>
          <div className="act-meta">
            <span className={`act-tic ${tm.cls}`}><Icon name={tm.ic} sw={2.6}/></span>
            <span className="act-desc">{desc}</span>
            {hasVm && <span className="act-vmtag"><Icon name="voicemail" sw={2.2}/> Voicemail</span>}
            {answered && c.rec && <span className="act-rectag"><Icon name="audiolines" sw={2.2}/> Recording</span>}
          </div>
        </div>
        <div className="act-right"><span className="act-when">{actTime(c.when)}</span>{(extLabel||lineNum) && <span className="act-ext">{extLabel}{lineNum && <span className="act-on"> on {shortNum(lineNum)}</span>}</span>}</div>
        <span className="act-playcell">{playable && <span className={`act-play${playing?' playing':''}`} onClick={togglePlay} aria-label={playing?'Pause':'Play'}><Icon name={playing?'pause':'play'}/></span>}</span>
        <span className="act-chev"><Icon name="chevdown"/></span>
      </div>
      {open && (
        <div className="act-vm-panel" onClick={e=>e.stopPropagation()}>
          {connLine && <div className="avp-detail"><Icon name={inbound?'arrowdownleft':'arrowupright'} sw={2.4}/> {connLine}</div>}
          {showVm && <div className="avp-detail vm"><Icon name="voicemail" sw={2.2}/> Voicemail left · {vm.dur}</div>}
          {playable && (
            <div className="avp-player">
              <div className="avp-scrub" onClick={seek}>{bars.current.map((h,i)=><i key={i} className={i/bars.current.length<=frac?'on':''} style={{height:(4+h*18)+'px'}}/>)}</div>
              <span className="avp-time">{vmFmt(pos)} / {playDur}</span>
            </div>
          )}
          {sumText && (
            <div className="avp-sum">
              <span className="ts-sum-ic"><Icon name="sparkle"/></span>
              <div><span className="ts-kicker">AI summary</span><p>{sumText}</p></div>
            </div>
          )}
          {tsLines && tsLines.length>0 && (
            <div className="avp-ts">
              <div className="avp-ts-h">Transcript</div>
              {tsLines.map((l,i)=>(<p className="avp-ts-line" key={i}>{l.text}</p>))}
            </div>
          )}
          {!playable && <div className="avp-norec"><span className="avp-norec-ic"><Icon name="audiolines"/></span><p>{noRecReason}</p></div>}
          <div className="avp-acts">
            {showVm
              ? (extensions && <VmMoreMenu vm={vm} currentExt={c.ext} extensions={extensions} extra={extra} onMove={onMove} onUndoMove={onUndoMove} onEmail={onEmail} onSetHeard={onSetHeard}/>)
              : (<React.Fragment>
                  {playable && <button className="mini-btn"><Icon name="download"/> Download audio</button>}
                  {tsLines && tsLines.length>0 && <button className="mini-btn"><Icon name="filetext"/> Download transcript</button>}
                </React.Fragment>)}
            <button className="mini-btn" onClick={()=>onOpen(c.num,{type:'call',id:c.id})}><Icon name="user"/> View contact</button>
          </div>
        </div>
      )}
    </div>
  );
}

function VmMoreMenu({ vm, currentExt, extensions, extra, onMove, onUndoMove, onEmail, onSetHeard }){
  const [open,setOpen]=useState(false);
  const [view,setView]=useState('root'); // root | move | email
  const [email,setEmail]=useState('');
  const [note,setNote]=useState('');
  const ref=useRef(null);
  useEffect(()=>{ if(!open) return; const h=e=>{ if(ref.current && !ref.current.contains(e.target)){ setOpen(false); setView('root'); } }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[open]);
  const close=()=>{ setOpen(false); setView('root'); setEmail(''); setNote(''); };
  const moved = extra && extra.move;
  const others = extensions.filter(e=>String(e.number)!==String(currentExt));
  const emailValid = /.+@.+\..+/.test(email.trim());
  return (
    <div className="more-wrap" ref={ref}>
      <button className="mini-btn" onClick={(e)=>{e.stopPropagation();setOpen(o=>!o);setView('root');}}><Icon name="kebab"/> More</button>
      {open && (
        <div className="more-menu" onClick={e=>e.stopPropagation()}>
          {view==='root' && (
            <React.Fragment>
              <button className="more-item" onClick={close}><Icon name="download"/> Download audio</button>
              <button className="more-item" onClick={close}><Icon name="filetext"/> Download transcript</button>
              <div className="more-sep"/>
              <button className="more-item" onClick={()=>setView('email')}><Icon name="mail"/> Forward to email…</button>
              <button className="more-item" onClick={()=>setView('move')}><Icon name="forward"/> Move to extension…</button>
              <div className="more-sep"/>
              {onSetHeard && <button className="more-item" onClick={()=>{onSetHeard(vm.id,!vm.heard);close();}}><Icon name={vm.heard?'voicemail':'check'}/> Mark {vm.heard?'unread':'read'}</button>}
            </React.Fragment>
          )}
          {view==='move' && (
            <React.Fragment>
              <button className="more-back" onClick={()=>setView('root')}><Icon name="arrowleft"/> Move to extension</button>
              <textarea className="more-note" value={note} placeholder="Add a note for the extension (optional)" onChange={e=>setNote(e.target.value)}/>
              {others.map(e=>(
                <button key={e.id} className="more-item" onClick={()=>{onMove(vm.id,e.number,currentExt,note.trim());close();}}>
                  <span className="fwd-opt-n">Ext. {e.number}</span><span className="fwd-opt-name">{e.name}</span>{!e.enabled && <span className="fwd-opt-tag">Disabled</span>}
                </button>
              ))}
              <div className="fwd-note">Moves the voicemail to that extension’s inbox.</div>
            </React.Fragment>
          )}
          {view==='email' && (
            <div className="more-email">
              <button className="more-back" onClick={()=>setView('root')}><Icon name="arrowleft"/> Forward to email</button>
              <input className="input" autoFocus value={email} placeholder="name@company.com"
                onChange={e=>setEmail(e.target.value)}/>
              <textarea className="more-note" value={note} placeholder="Add a note (optional)" onChange={e=>setNote(e.target.value)}/>
              <button className="btn btn-primary sm block" disabled={!emailValid} style={!emailValid?{opacity:.5,pointerEvents:'none'}:null}
                onClick={()=>{ onEmail(vm.id,email.trim(),note.trim()); close(); }}>Send a copy</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VmStatusChips({ vm, movedFrom, extensions, extra, onUndoMove }){
  const emails = (extra && extra.emails) || [];
  if(emails.length===0) return null;
  return (
    <div className="fwd-chips">
      {emails.map((em,i)=>(
        <span className="fwd-chip email" key={i} title={em.note||''}><Icon name="mail"/> Forwarded to {em.email||em}{em.note?' · “'+em.note+'”':''}</span>
      ))}
    </div>
  );
}

function ActVmRow({ vm, dir, extLabel, extNum, lineNum, lineLabel, cmeta, onOpen, onHeard, onSetHeard, extensions, extra, movedFrom, movedTo, moveNote, onMove, onUndoMove, onEmail, labeled }){
  const id = identityOf({ ...vm, contact:(cmeta&&cmeta.name)||vm.contact });
  const total = vmSec(vm.dur)||1;
  const [open,setOpen]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [pos,setPos]=useState(0);
  const bars = useRef([...Array(56)].map(()=>0.22+Math.random()*0.78));
  useEffect(()=>{ if(!playing) return; const iv=setInterval(()=>{ setPos(p=>{ const n=p+0.1; if(n>=total){ setPlaying(false); return total; } return n; }); },100); return ()=>clearInterval(iv); },[playing,total]);
  const frac = pos/total;
  function heardOnce(){ if(!vm.heard && onHeard) onHeard(vm.id); }
  function toggleExpand(){ setOpen(o=>{ if(!o) heardOnce(); return !o; }); }
  function togglePlay(e){ e.stopPropagation(); heardOnce(); if(pos>=total) setPos(0); setPlaying(p=>!p); }
  function seek(e){ e.stopPropagation(); const r=e.currentTarget.getBoundingClientRect(); setPos(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*total); }
  return (
    <div className={`act-row vm expandable${vm.heard?'':' unread'}${open?' expanded':''}`}>
      <div className="act-vm-head" onClick={toggleExpand}>
        <span className="act-dot" aria-hidden="true"/>
        <ActAvatar id={id}/>
        <div className="act-main">
          <div className="act-name"><b>{id.primary}</b>{id.kind==='guess' && <span className="act-maybe">Maybe {id.name}</span>}{(movedFrom||movedTo) && (()=>{ const n=movedFrom||movedTo; const fe=extensions&&extensions.find(e=>String(e.number)===String(n)); const lbl=`×${n}${fe?' '+fe.name:''}`; return movedTo
            ? <span className="act-movedtag tombstone"><Icon name="forward" sw={2.2}/><span>{`Moved to ${lbl}`}</span><button onClick={(ev)=>{ev.stopPropagation();onUndoMove(vm.id);}}>Undo</button></span>
            : <span className="act-movedtag"><Icon name="forward" sw={2.2}/><span>{`Moved from ${lbl}`}</span></span>; })()}</div>
          <div className="act-meta">
            {labeled && <span className="act-vmtag"><Icon name="voicemail" sw={2.2}/> Voicemail</span>}
            <span className="act-tic ai" title="AI summary"><Icon name="sparkle" sw={2.2}/></span>
            <span className="act-desc">{vm.preview||vm.summary}</span>
          </div>
        </div>
        <div className="act-right"><span className="act-when">{actTime(vm.when)}</span>{(extLabel||lineNum) && <span className="act-ext">{extLabel}{lineNum && <span className="act-on"> on {shortNum(lineNum)}</span>}</span>}</div>
        <span className="act-playcell"><span className={`act-play${playing?' playing':''}`} onClick={togglePlay} aria-label={playing?'Pause':'Play'}><Icon name={playing?'pause':'play'}/></span></span>
        <span className="act-chev"><Icon name="chevdown"/></span>
      </div>
      {open && (
        <div className="act-vm-panel" onClick={e=>e.stopPropagation()}>
          {movedFrom && moveNote && (()=>{ const fe=extensions&&extensions.find(e=>String(e.number)===String(movedFrom)); return <div className="move-note-banner"><Icon name="forward"/><div><b>Note from {fe?fe.name:'×'+movedFrom}</b><p>{moveNote}</p></div></div>; })()}
          <div className="avp-player">
            <div className="avp-scrub" onClick={seek}>{bars.current.map((h,i)=><i key={i} className={i/bars.current.length<=frac?'on':''} style={{height:(4+h*18)+'px'}}/>)}</div>
            <span className="avp-time">{vmFmt(pos)} / {vm.dur}</span>
          </div>
          <div className="avp-sum">
            <span className="ts-sum-ic"><Icon name="sparkle"/></span>
            <div><span className="ts-kicker">AI summary</span><p>{vm.summary}</p></div>
          </div>
          <div className="avp-ts">
            <div className="avp-ts-h">Transcript</div>
            {vm.transcript.map((l,i)=>(<p className="avp-ts-line" key={i}>{l.text}</p>))}
          </div>
          {extensions && <VmStatusChips vm={vm} movedFrom={movedFrom} extensions={extensions} extra={extra} onUndoMove={onUndoMove}/>}
          <div className="avp-acts">
            {extensions && <VmMoreMenu vm={vm} currentExt={extNum} extensions={extensions} extra={extra} onMove={onMove} onUndoMove={onUndoMove} onEmail={onEmail} onSetHeard={onSetHeard}/>}
            <button className="mini-btn" onClick={()=>onOpen(vm.num,{type:'vm',id:vm.id})}><Icon name="user"/> View contact</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- combined filter: pick a number AND/OR an extension ---------- */
function ActFilter({ businessLines, extensions, hasExtensions, lineFilter, setLineFilter, extFilter, setExtFilter }){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ if(!open) return; const h=e=>{ if(ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); },[open]);
  const count = (lineFilter!=='all'?1:0)+(extFilter!=='all'?1:0);
  return (
    <div className="act-filter" ref={ref}>
      <button className={`act-filterbtn${count?' on':''}`} onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
        <Icon name="sliders"/> Filter{count>0 && <span className="act-filtercount">{count}</span>}
        <Icon name="chevdown"/>
      </button>
      {open && (
        <div className="act-filterpop">
          <div className="afp-sec">
            <div className="afp-h">Phone number</div>
            <button className={`afp-opt${lineFilter==='all'?' on':''}`} onClick={()=>setLineFilter('all')}><span className="afp-radio"/>All numbers</button>
            {(businessLines||[]).map(l=>(
              <button key={l.num} className={`afp-opt${lineFilter===l.num?' on':''}`} onClick={()=>setLineFilter(l.num)}>
                <span className="afp-radio"/><span className="afp-opt-t"><b>{l.label}</b><span>{l.num}</span></span>
              </button>
            ))}
          </div>
          {hasExtensions && (
            <div className="afp-sec">
              <div className="afp-h">Extension</div>
              <button className={`afp-opt${extFilter==='all'?' on':''}`} onClick={()=>setExtFilter('all')}><span className="afp-radio"/>All extensions</button>
              {extensions.map(e=>(
                <button key={e.id} className={`afp-opt${String(extFilter)===String(e.number)?' on':''}`} onClick={()=>setExtFilter(e.number)}>
                  <span className="afp-radio"/><span className="afp-opt-t"><b>Ext. {e.number} {e.name}</b></span>
                </button>
              ))}
            </div>
          )}
          <div className="afp-foot">
            <button className="afp-clear" disabled={!count} onClick={()=>{ setLineFilter('all'); setExtFilter('all'); }}>Clear all</button>
            <button className="btn btn-primary sm" onClick={()=>setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityScreen({ activity, extensions, contactMeta, mode, extFilter, setExtFilter, onOpen, onHeard, onSetHeard, onMarkAllHeard, vmExtra, onMoveVm, onUndoMoveVm, onEmailVm, contactFilter, onClearContactFilter, sub, setSub, businessLines, lineLabel, hasExtensions=true }){
  const extLabel = (n)=>{ const e=extensions.find(x=>x.number===n); return 'Ext. '+n+(e?' '+e.name:''); };
  const [sub2i,setSub2i]=useState('all');
  const sub2 = sub!=null ? sub : sub2i;
  const setSub2 = setSub || setSub2i;
  const [lineFilter,setLineFilter]=useState('all');
  const vmIds = new Set(activity.calls.map(c=>c.vmId).filter(Boolean));
  const buildVm = ()=>{
    const wrap = (baseExt, vm, when, ts, date, dir)=>{
      const mv = (vmExtra && vmExtra[vm.id] && vmExtra[vm.id].move) || null;
      const base = { kind:'vm', ts, when, date, vm, dir };
      if(!mv) return [{ ...base, ext:baseExt, movedFrom:null, movedTo:null }];
      // a moved voicemail lives in the TARGET inbox (recipient: "Moved from origin" + note)
      // and leaves an UNDO tombstone in the ORIGIN inbox (sender: "Moved to target · Undo")
      return [
        { ...base, ext:Number(mv.to), movedFrom:mv.from, movedTo:null, moveNote:mv.note||'' },
        { ...base, ext:Number(mv.from), movedFrom:null, movedTo:mv.to, tombstone:true },
      ];
    };
    const vmFromCalls = activity.calls.filter(c=>c.vmId).flatMap(c=>{ const vm=activity.voicemails.find(v=>v.id===c.vmId); return vm?wrap(c.ext,vm,c.when,c.ts,c.date,c.dir):[]; });
    const vmStandalone = activity.voicemails.filter(v=>!vmIds.has(v.id)).flatMap(v=>wrap(v.ext,v,v.when,v.ts,v.date,v.dir));
    let list = [...vmFromCalls, ...vmStandalone];
    // in the "all extensions" view, hide the origin tombstone so a moved vm shows once (at its new home)
    if(extFilter==='all') list = list.filter(i=>!i.tombstone);
    return list;
  };
  let feed;
  if(mode==='voicemails'){
    feed = buildVm();
  } else if(sub2==='vm'){
    feed = buildVm();
  } else {
    const callItems = activity.calls.map(c=>({ kind:'call', ts:c.ts, when:c.when, date:c.date, ext:c.ext, data:c, hasVm:!!c.vmId }));
    const inbound = (c)=>c.dir==='in'||c.dir==='missed';
    feed = sub2==='missed' ? callItems.filter(i=>inbound(i.data) && i.data.outcome!=='answered')
      : sub2==='incoming' ? callItems.filter(i=>i.data.dir==='in' && i.data.outcome==='answered')
      : sub2==='outgoing' ? callItems.filter(i=>i.data.dir==='out')
      : callItems;
  }
  if(extFilter!=='all') feed = feed.filter(i=>String(i.ext)===String(extFilter));
  if(lineFilter!=='all') feed = feed.filter(i=>(i.data?i.data.line:i.vm.line)===lineFilter);
  if(contactFilter && contactFilter.num) feed = feed.filter(i=>(i.data?i.data.num:i.vm.num)===contactFilter.num);
  feed.sort((a,b)=>b.ts-a.ts);

  const groups=[]; let cur=null;
  feed.forEach(it=>{ const lbl=fmtDayHeader(it.when, it.date); if(!cur||cur.label!==lbl){ cur={label:lbl,items:[]}; groups.push(cur);} cur.items.push(it); });

  const TITLE = mode==='voicemails' ? 'Voicemails' : 'Calls';
  const SUB = mode==='voicemails'
    ? 'Every voicemail across the extensions you can access.'
    : 'Calls across the extensions you can access.';

  // two independent filters: by phone number and/or by extension
  const anyFilter = lineFilter!=='all' || extFilter!=='all';
  const clearActFilter = ()=>{ setExtFilter('all'); setLineFilter('all'); };
  const lineChip = lineFilter==='all' ? null : (()=>{ const l=(businessLines||[]).find(x=>x.num===lineFilter); return l?`${l.label} · ${l.num}`:lineFilter; })();
  const extChip = extFilter==='all' ? null : (()=>{ const e=extensions.find(x=>String(x.number)===String(extFilter)); return e?`Ext. ${e.number} ${e.name}`:('Ext. '+extFilter); })();

  return (
    <div className="act-screen">
      <div className="act-head">
        <div>
          <h1 className="lv-title">{TITLE}</h1>
          <p className="lv-sub">{SUB}</p>
        </div>
      </div>

      {contactFilter && contactFilter.num && (
        <div className="cfilter-bar">
          <span className="cfilter-ic"><Icon name="user"/></span>
          <span className="cfilter-t">Showing {mode==='voicemails'?'voicemails':'calls'} for <button className="cfilter-name" onClick={()=>onOpen(contactFilter.num)}>{contactFilter.name||contactFilter.num}</button></span>
          <button className="cfilter-x" onClick={onClearContactFilter}><Icon name="x"/> Clear</button>
        </div>
      )}

      {anyFilter && (
        <div className="cfilter-bar filtered">
          <span className="cfilter-ic"><Icon name="sliders"/></span>
          <span className="cfilter-t">Filtered to
            {lineChip && <button className="fchip" onClick={()=>setLineFilter('all')} title="Remove"><Icon name="hashnum"/>{lineChip}<Icon name="x"/></button>}
            {extChip && <button className="fchip" onClick={()=>setExtFilter('all')} title="Remove"><Icon name="layers"/>{extChip}<Icon name="x"/></button>}
          </span>
          <button className="cfilter-x" onClick={clearActFilter}><Icon name="x"/> Clear all</button>
        </div>
      )}

      <div className="act-toolbar">
        <div className="act-chips">
          {mode==='calls' && (
            <React.Fragment>
              <button className={`act-chip${sub2==='all'?' on':''}`} onClick={()=>setSub2('all')}>All</button>
              <button className={`act-chip${sub2==='missed'?' on':''}`} onClick={()=>setSub2('missed')}>Missed</button>
              <button className={`act-chip${sub2==='incoming'?' on':''}`} onClick={()=>setSub2('incoming')}>Connected</button>
              <button className={`act-chip${sub2==='outgoing'?' on':''}`} onClick={()=>setSub2('outgoing')}>Outgoing</button>
              <button className={`act-chip${sub2==='vm'?' on':''}`} onClick={()=>setSub2('vm')}>Voicemails</button>
            </React.Fragment>
          )}
        </div>
        <ActFilter businessLines={businessLines} extensions={extensions} hasExtensions={hasExtensions}
          lineFilter={lineFilter} setLineFilter={setLineFilter} extFilter={extFilter} setExtFilter={setExtFilter}/>
        {sub2==='vm' && feed.some(i=>i.vm && !i.vm.heard) && (
          <button className="act-markall" onClick={onMarkAllHeard}><Icon name="check"/> Mark all read</button>
        )}
      </div>

      <div className="act-feed">
        {groups.length===0 && (
          <div className="empty" style={{padding:'60px 24px'}}>
            <span className="ei"><Icon name="activity"/></span>
            <h4>Nothing here yet</h4>
            <p>No activity matches this filter.</p>
          </div>
        )}
        {groups.map(g=>(
          <div className="act-group" key={g.label}>
            <div className="act-day">{g.label}</div>
            <div className="act-list">
              {g.items.map(it=>{
                if(it.kind==='vm') return <ActVmRow key={'vm-'+it.vm.id+'-'+it.ext+(it.tombstone?'-t':'')} vm={it.vm} dir={it.dir} extLabel={hasExtensions?extLabel(it.ext):''} extNum={it.ext} lineNum={it.vm.line} lineLabel={lineLabel} movedFrom={it.movedFrom} movedTo={it.movedTo} moveNote={it.moveNote} cmeta={contactMeta&&contactMeta[it.vm.num]} onOpen={onOpen} onHeard={onHeard} onSetHeard={onSetHeard} extensions={extensions} extra={vmExtra&&vmExtra[it.vm.id]} onMove={onMoveVm} onUndoMove={onUndoMoveVm} onEmail={onEmailVm} labeled={mode==='calls'}/>;
                return <ActCallRow key={'c-'+it.data.id} c={it.data} hasVm={it.hasVm} vm={it.data.vmId?activity.voicemails.find(v=>v.id===it.data.vmId):null} extLabel={hasExtensions?extLabel(it.ext):''} lineNum={it.data.line} lineLabel={lineLabel} cmeta={contactMeta&&contactMeta[it.data.num]} onOpen={onOpen} onHeard={onHeard} extensions={extensions} extra={it.data.vmId&&vmExtra?vmExtra[it.data.vmId]:null} onMove={onMoveVm} onUndoMove={onUndoMoveVm} onEmail={onEmailVm} onSetHeard={onSetHeard}/>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- SMS conversation list (number-based, standard inbox conventions) ---------- */
/* ---------- SMS: two-column inbox (list left, thread right) ---------- */
function smsDay(when){ return (String(when).split(',')[0]||'').trim(); }
function SmsThread({ num, id, msgs, calls, voicemails, me, onSend, onViewContact, lineLabel, businessLines, reachedLine, archived, onArchive, note, onNote }){
  const [draft,setDraft]=useState('');
  const [showNote,setShowNote]=useState(false);
  const [noteDraft,setNoteDraft]=useState(note||'');
  const ref=useRef(null);
  // replies always go back out on the same business number the customer texted — no chooser
  const replyLine = reachedLine || ((businessLines||[]).find(l=>l.sms==='approved')||(businessLines||[])[0]||{}).num;
  useEffect(()=>{ setNoteDraft(note||''); },[num]);
  const vmInCalls=new Set((calls||[]).map(c=>c.vmId).filter(Boolean));
  const events=(msgs||[]).map(t=>({kind:'text', ts:t.ts, when:t.when, date:t.date, data:t})).sort((a,b)=>a.ts-b.ts);
  const groups=[]; let curg=null;
  events.forEach(it=>{ const lbl=fmtDayHeader(it.when,it.date); if(!curg||curg.label!==lbl){ curg={label:lbl,items:[]}; groups.push(curg);} curg.items.push(it); });
  useEffect(()=>{ const el=ref.current; if(el) el.scrollTop=el.scrollHeight; },[events.length,num]);
  const send=()=>{ const v=draft.trim(); if(!v) return; onSend(num,v,replyLine); setDraft(''); };
  const evtTime=(w)=>(String(w).split(',')[1]||String(w).split(',')[0]||'').trim();
  const callEvt=(c)=>{
    if(c.dir==='missed'||c.outcome==='missed'||c.outcome==='voicemail') return {ic:'arrowdownleft',cls:'missed',label:c.vmId?'Missed call · Voicemail':'Missed call', detail:c.vmId?'Caller left a message':'No message left'};
    if(c.dir==='out') return {ic:'arrowupright',cls:'out',label:'Outgoing call', detail:c.outcome==='answered'?`Answered · ${c.dur}`:'No answer'};
    return {ic:'arrowdownleft',cls:'in',label:'Incoming call', detail:`Answered · ${c.dur}${c.rec?' · Recorded':''}`};
  };
  return (
    <div className="sms-thread">
      <div className="sms-thread-h">
        <ActAvatar id={id}/>
        <div className="sth-id">
          <b>{id.primary}</b>
          <span className="sth-num">{id.kind==='contact'? id.secondary : (id.kind==='guess'?('Maybe '+id.name):id.secondary)}</span>
        </div>
        <div className="sms-hacts">
          <button className="btn btn-ghost sm sms-hbtn" onClick={onArchive}><Icon name="archive"/> {archived?'Unarchive':'Archive'}</button>
          <button className="btn btn-ghost sm sms-hbtn" onClick={onViewContact}><Icon name="user"/> Contact</button>
        </div>
      </div>

      <div className={`sms-notebar${showNote?' open':''}${note?' has-note':' no-note'}`}>
        {!showNote ? (
          <button className="sms-notetoggle" onClick={()=>{ setNoteDraft(note||''); setShowNote(true); }}>
            <span className="sms-note-ic"><Icon name="pencil"/></span>
            <span className="sms-note-collapsed">
              <span className="sms-note-lbl">Internal note</span>
              {note && <span className="sms-note-prev">{note}</span>}
            </span>
            <span className="sms-note-expand">{note?'Expand':'Add note'}</span>
          </button>
        ) : (
          <div className="sms-noteedit">
            <div className="sms-note-head"><Icon name="pencil"/> Internal note<span className="sms-note-sub">Visible only to your team</span></div>
            <textarea className="sms-notearea" autoFocus value={noteDraft} placeholder={'e.g. \u201cCustomer prefers text.\u201d \u00b7 \u201cCall after 3 PM.\u201d'} onChange={e=>setNoteDraft(e.target.value)}/>
            <div className="sms-noteactions">
              {noteDraft.trim() && <button className="sms-note-clear" onClick={()=>setNoteDraft('')}>Clear</button>}
              <button className="btn btn-ghost sm" onClick={()=>{ setNoteDraft(note||''); setShowNote(false); }}>Cancel</button>
              <button className="btn btn-primary sm" onClick={()=>{ onNote(noteDraft.trim()); setShowNote(false); }}>Save &amp; close</button>
            </div>
          </div>
        )}
      </div>

      <div className="sms-thread-body" ref={ref}>
        {groups.map(g=>(
          <div key={g.label}>
            <div className="msg-day">{g.label}</div>
            {g.items.map(it=>{
              if(it.kind==='text'){ const t=it.data; const out=t.dir==='out'; const who=out?(t.author===me?'You':t.author):null;
                return <div className={`msg-line ${out?'out':'in'}`} key={t.id}>{who&&<span className="msg-author">{who}</span>}<div className={`bubble ${out?'out':'in'}`}>{t.body}</div></div>;
              }
              if(it.kind==='vm'){ const v=it.data;
                return <div className="sms-event" key={'vm'+v.id}><span className="sms-evt-ic vm"><Icon name="voicemail"/></span><div className="sms-evt-t"><b>Voicemail · {v.dur}</b><span>{v.preview||'New voicemail'}</span></div><button className="sms-evt-play" onClick={onViewContact} aria-label="Listen"><Icon name="play"/></button></div>;
              }
              const c=it.data; const e=callEvt(c);
              return <div className="sms-event" key={'c'+c.id}><span className={`sms-evt-ic ${e.cls}`}><Icon name={e.ic} sw={2.5}/></span><div className="sms-evt-t"><b>{e.label}</b><span>{e.detail}</span></div><span className="sms-evt-when">{evtTime(c.when)}</span></div>;
            })}
          </div>
        ))}
      </div>

      <div className="sms-compose-wrap">
        <div className="sms-compose">
          <input className="msg-input" value={draft} placeholder={`Text ${id.primary}`}
            onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}/>
          <button className="msg-send" disabled={!draft.trim()} onClick={send} aria-label="Send"><Icon name="arrowupright"/></button>
        </div>
        <div className="sms-replyfrom">
          <span className="rf-k">Replying from</span>
          <span className="rf-static">{(lineLabel?lineLabel(replyLine):'')}{replyLine?` · ${shortNum(replyLine)}`:''}</span>
        </div>
      </div>
    </div>
  );
}

function NewMessageCompose({ businessLines, lineLabel, recipients, onSend, onClose, onSent }){
  const approved = (businessLines||[]).filter(l=>l.sms==='approved');
  const [to,setTo]=useState('');
  const [picked,setPicked]=useState(null);
  const [from,setFrom]=useState(approved[0]?approved[0].num:'');
  const [draft,setDraft]=useState('');
  const [showSug,setShowSug]=useState(false);
  const digits=(picked?picked.num:to).replace(/[^\d]/g,'');
  const toValid=digits.length>=10;
  const canSend = approved.length>0 && toValid && draft.trim().length>0;
  const q=to.trim().toLowerCase();
  const sug=(recipients||[]).filter(r=> q && (String(r.name).toLowerCase().includes(q) || String(r.num).replace(/[^\d]/g,'').includes(q.replace(/[^\d]/g,'')))).slice(0,5);
  const send=()=>{ if(!canSend) return; const target=picked?picked.num:to.trim(); onSend(target, draft.trim(), from); setDraft(''); onSent&&onSent(target); };
  return (
    <div className="sms-newmsg">
      <div className="sms-newmsg-h">
        <b>New message</b>
        <button className="x-btn" onClick={onClose} aria-label="Cancel"><Icon name="x"/></button>
      </div>
      <div className="nm-fields">
        <div className="nm-row">
          <span className="nm-k">To</span>
          <div className="nm-toinput">
            {picked ? (
              <span className="nm-chip"><Avatar name={picked.name}/> {picked.name}<button onClick={()=>{setPicked(null);setTo('');}} aria-label="Clear"><Icon name="x"/></button></span>
            ) : (
              <input className="nm-input" autoFocus value={to} placeholder="Name or phone number"
                onChange={e=>{setTo(e.target.value);setShowSug(true);}} onFocus={()=>setShowSug(true)}/>
            )}
            {!picked && showSug && sug.length>0 && (
              <div className="nm-sug">
                {sug.map(r=>(
                  <button key={r.num} className="nm-sugrow" onClick={()=>{setPicked(r);setShowSug(false);}}>
                    <Avatar name={r.name}/><span className="nm-sugt"><b>{r.name}</b><span>{r.sub}</span></span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {approved.length>1 && (
          <div className="nm-row">
            <span className="nm-k">From</span>
            <select className="nm-from" value={from} onChange={e=>setFrom(e.target.value)}>
              {approved.map(l=><option key={l.num} value={l.num}>{l.label} · {shortNum(l.num)}</option>)}
            </select>
          </div>
        )}
        {approved.length===1 && (
          <div className="nm-row">
            <span className="nm-k">From</span>
            <span className="nm-fromstatic">{lineLabel(approved[0].num)} · {shortNum(approved[0].num)}<span className="nm-auto">SMS-approved</span></span>
          </div>
        )}
      </div>
      {approved.length===0 ? (
        <div className="nm-compliance">
          <Icon name="info"/>
          <div><b>No SMS-approved numbers</b><p>None of your business numbers are approved to send texts yet. Finish SMS registration on the Numbers screen to start messaging.</p></div>
        </div>
      ) : (
        <div className="sms-compose">
          <input className="msg-input" value={draft} placeholder="Type your message"
            onChange={e=>setDraft(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}/>
          <button className="msg-send" disabled={!canSend} onClick={send} aria-label="Send"><Icon name="arrowupright"/></button>
        </div>
      )}
    </div>
  );
}

function SmsScreen({ activity, contactMeta, onSaveMeta, smsRead, smsArchived, onArchive, onOpen, onReadSms, onSend, initialNum, businessLines, lineLabel }){
  const [tab,setTab]=useState('inbox');
  const [composing,setComposing]=useState(false);
  const [query,setQuery]=useState('');
  const [lineFilter,setLineFilter]=useState('all');
  const byNum={};
  activity.texts.forEach(tx=>{ (byNum[tx.num]=byNum[tx.num]||[]).push(tx); });
  const callsByNum={}; activity.calls.forEach(c=>{ (callsByNum[c.num]=callsByNum[c.num]||[]).push(c); });
  const vmByNum={}; activity.voicemails.forEach(v=>{ (vmByNum[v.num]=vmByNum[v.num]||[]).push(v); });
  const convos = Object.keys(byNum).map(num=>{
    const msgs=byNum[num].slice().sort((a,b)=>a.ts-b.ts);
    const last=msgs[msgs.length-1];
    const line = last.line || (msgs.slice().reverse().find(m=>m.line)||{}).line;
    const unread = last.dir==='in' && !(smsRead&&smsRead[num]);
    // count the trailing run of inbound messages (messages waiting for a reply)
    let ur=0; for(let i=msgs.length-1;i>=0;i--){ if(msgs[i].dir==='in') ur++; else break; }
    return { num, msgs, last, line, count:msgs.length, unread, unreadCount: unread?ur:0, archived: !!(smsArchived&&smsArchived[num]) };
  }).sort((a,b)=>b.last.ts-a.last.ts);

  const archivedCount = convos.filter(c=>c.archived).length;
  // unread is counted by CONVERSATION (not by message): sidebar total, then per-business-number.
  const unreadByLine={}; let totalUnread=0;
  convos.forEach(c=>{ if(c.unread && !c.archived){ totalUnread++; if(c.line) unreadByLine[c.line]=(unreadByLine[c.line]||0)+1; } });
  const inboxUnread = lineFilter==='all' ? totalUnread : (unreadByLine[lineFilter]||0);
  const q=query.trim().toLowerCase();
  const matchesQuery=(c)=>{ if(!q) return true; const id=numIdentity(c.num, activity, contactMeta); return String(id.primary).toLowerCase().includes(q) || c.num.replace(/[^\d]/g,'').includes(q.replace(/[^\d]/g,'')) || String(c.last.body||'').toLowerCase().includes(q); };
  const shown = convos.filter(c=> (tab==='archived' ? c.archived : !c.archived) && (lineFilter==='all' || c.line===lineFilter) && matchesQuery(c));
  const [sel,setSel]=useState(initialNum||null);
  useEffect(()=>{ if(initialNum) setSel(initialNum); },[initialNum]);
  const selConvo = sel ? (shown.find(c=>c.num===sel) || null) : null;
  useEffect(()=>{ if(selConvo && selConvo.unread && onReadSms) onReadSms(selConvo.num); },[selConvo&&selConvo.num]);
  function pick(num){ setComposing(false); setSel(num); if(onReadSms) onReadSms(num); }
  const recipients = Array.from(new Set([...activity.texts,...activity.calls,...activity.voicemails].map(x=>x.num)))
    .map(n=>{ const id=numIdentity(n, activity, contactMeta); return { num:n, name:id.primary, sub:id.kind==='contact'?(id.secondary||shortNum(n)):shortNum(n) }; });

  return (
    <div className="sms-screen">
      <div className="sms-list-col">
        <div className="sms-list-head">
          <h1 className="sms-title">Messages</h1>
          <div className="sms-searchrow">
            <div className="sms-search">
              <Icon name="search"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search messages"/>
              {query && <button className="sms-search-x" onClick={()=>setQuery('')} aria-label="Clear search"><Icon name="x"/></button>}
            </div>
            <button className="sms-newbtn" onClick={()=>setComposing(true)} title="New message"><Icon name="plus"/> New</button>
          </div>
          <div className="sms-tabs">
            <button className={`sms-tab${tab==='inbox'?' on':''}`} onClick={()=>setTab('inbox')}>Inbox{lineFilter!=='all' && inboxUnread>0?` (${inboxUnread})`:''}</button>
            <button className={`sms-tab${tab==='archived'?' on':''}`} onClick={()=>setTab('archived')}>Archived{archivedCount>0?` · ${archivedCount}`:''}</button>
          </div>
          {businessLines && businessLines.length>0 && (
            <label className="sms-numfilter">
              <Icon name="hashnum"/>
              <select value={lineFilter} onChange={e=>setLineFilter(e.target.value)}>
                <option value="all">All numbers{totalUnread>0?` (${totalUnread})`:''}</option>
                {businessLines.map(l=>{ const u=unreadByLine[l.num]||0; return <option key={l.num} value={l.num}>{l.label||shortNum(l.num)}{u>0?` (${u})`:''}</option>; })}
              </select>
              <Icon name="chevdown"/>
            </label>
          )}
        </div>
        {shown.length===0 ? (
          <div className="empty" style={{padding:'48px 20px'}}>
            <span className="ei"><Icon name="message"/></span>
            <h4>{tab==='archived'?'Nothing archived':'No conversations'}</h4>
            <p>{tab==='archived'?'Archived conversations show up here.':'Texts to your business number show up here.'}</p>
          </div>
        ) : (
          <div className="sms-list">
            {shown.map(c=>{
              const id = numIdentity(c.num, activity, contactMeta);
              const sent = c.last.dir==='out';
              return (
                <div className={`sms-convo${c.unread?' unread':''}${selConvo&&selConvo.num===c.num?' sel':''}`} key={c.num} onClick={()=>pick(c.num)}>
                  <span className="sms-ldot" aria-hidden="true"/>
                  <ActAvatar id={id}/>
                  <div className="sms-main">
                    <div className="sms-top">
                      <b className="sms-name">{id.primary}</b>
                      {(contactMeta&&contactMeta[c.num]&&contactMeta[c.num].note) && <span className="sms-noteflag" title="Has an internal note"/>}
                      <span className="sms-when">{fmtRowTime(c.last.when, c.last.date)}</span>
                    </div>
                    <div className="sms-prevrow">
                      <span className="sms-preview">{sent && <span className="sms-you">You:</span>} {c.last.body}</span>
                      {c.unreadCount>1 && <span className="sms-ucount" title={`${c.unreadCount} unread messages`}>{c.unreadCount}</span>}
                    </div>
                  </div>
                  <button className="sms-archive" title={c.archived?'Unarchive':'Archive'}
                    onClick={(e)=>{ e.stopPropagation(); onArchive(c.num, !c.archived); }}>
                    <Icon name="archive"/>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="sms-thread-col">
        {composing ? (
          <NewMessageCompose businessLines={businessLines} lineLabel={lineLabel} recipients={recipients}
            onSend={onSend} onClose={()=>setComposing(false)} onSent={(num)=>pick(num)}/>
        ) : selConvo ? (
          <SmsThread num={selConvo.num} id={numIdentity(selConvo.num, activity, contactMeta)} msgs={selConvo.msgs}
            calls={callsByNum[selConvo.num]||[]} voicemails={vmByNum[selConvo.num]||[]}
            me="Bob Stevens" onSend={onSend} onViewContact={()=>onOpen(selConvo.num)} lineLabel={lineLabel}
            businessLines={businessLines} reachedLine={selConvo.line} archived={selConvo.archived}
            onArchive={()=>onArchive(selConvo.num, !selConvo.archived)}
            note={(contactMeta&&contactMeta[selConvo.num]&&contactMeta[selConvo.num].note)||''} onNote={(v)=>onSaveMeta&&onSaveMeta(selConvo.num,{note:v})}/>
        ) : (
          <div className="sms-noselect"><span className="ei"><Icon name="message"/></span><p>Select a conversation to read and reply.</p></div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ActivityScreen, SmsScreen, VmMoreMenu, VmStatusChips });
