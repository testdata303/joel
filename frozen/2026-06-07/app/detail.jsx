/* ============================================================
   JOEL app — Contact view (exports to window)
   One merged calls + voicemails + texts timeline by date,
   editable notes, follow-up flag + assignee, downloads, and a
   "ring my device" call-back popover. Modal drawer OR docked pane.
   ============================================================ */
const { Icon, Card, Avatar, fmtDayHeader } = window;

/* ---------- identity resolution (shared with overview rows) ---------- */
const AREA_CODES = {
  '415':'San Francisco, CA', '617':'Boston, MA', '978':'Lawrence, MA',
  '508':'Worcester, MA', '413':'Springfield, MA', '781':'Waltham, MA',
  '857':'Boston, MA', '305':'Miami, FL', '212':'New York, NY', '404':'Atlanta, GA',
};
function regionOf(num){
  const m = String(num).match(/\(?(\d{3})\)?/);
  return (m && AREA_CODES[m[1]]) || 'Unknown location';
}
// { primary, secondary, kind:'contact'|'guess'|'unknown', name }
function identityOf(r){
  if(r.contact) return { primary:r.contact, secondary:r.num, kind:'contact', name:r.contact };
  if(r.cnam)    return { primary:r.num, secondary:'Maybe '+r.cnam, kind:'guess', name:r.cnam };
  return { primary:r.num, secondary:regionOf(r.num), kind:'unknown', name:null };
}

const DIR = {
  in:     { ic:'arrowdownleft', label:'Incoming call', cls:'in' },
  out:    { ic:'arrowupright',  label:'Outgoing call', cls:'out' },
  missed: { ic:'arrowdownleft', label:'Missed call',   cls:'missed' },
};
const CALL_OUTCOME = { answered:'Answered', voicemail:'Left a voicemail', missed:'No answer' };
function timeOnly(when){ const p=String(when).split(','); return (p[1]||p[0]||'').trim(); }

/* ---------- drawer shell (modal overlay OR docked pane) ---------- */
function Drawer({ title, onClose, children, mode='drawer', bodyClass='' }){
  React.useEffect(()=>{
    const h=e=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[onClose]);
  const inner = (
    <aside className={`drawer${mode==='pane'?' docked':''}`} onMouseDown={e=>e.stopPropagation()} role="dialog" aria-label={title}>
      <header className="drawer-h">
        <span className="dh-title">{title}</span>
        <button className="x-btn" onClick={onClose} aria-label="Close"><Icon name="x"/></button>
      </header>
      <div className={`drawer-b${bodyClass?' '+bodyClass:''}`}>{children}</div>
    </aside>
  );
  if(mode==='pane') return inner;
  return <div className="drawer-overlay" onMouseDown={onClose}>{inner}</div>;
}

/* ---------- identity hero ---------- */
function IdentityHero({ rec, sub, onAddContact, compact }){
  const id = identityOf(rec);
  const canAdd = onAddContact && id.kind!=='contact';
  const avatarEl = <span className={`id-av ${id.kind}`}>{id.kind==='contact' ? <Avatar name={id.name}/> : <Icon name="user"/>}</span>;
  const primaryEl = canAdd
    ? <button className="id-primary num as-link" onClick={onAddContact} title="Add to Contacts">{id.primary}</button>
    : <div className={`id-primary${id.kind!=='contact'?' num':''}`}>{id.primary}</div>;
  const secondaryEl = <div className={`id-secondary ${id.kind}`}>{id.kind==='guess' && <Icon name="info"/>}{id.secondary}</div>;
  if(compact){
    return (
      <div className="idhero compact">
        {avatarEl}
        <div className="id-htext">{primaryEl}{secondaryEl}</div>
      </div>
    );
  }
  return (
    <div className="idhero">
      {avatarEl}
      {primaryEl}
      {secondaryEl}
      {canAdd && <button className="add-contact-cta" onClick={onAddContact}><Icon name="plus"/> Add to Contacts</button>}
      {sub && <div className="id-meta">{sub}</div>}
    </div>
  );
}

/* ---------- audio player (scrubber + speed) ---------- */
function durToSec(s){ const [m,sec]=String(s).split(':').map(Number); return (m||0)*60+(sec||0); }
function secToDur(t){ const m=Math.floor(t/60), s=Math.round(t%60); return `${m}:${String(s).padStart(2,'0')}`; }
function AudioPlayer({ dur }){
  const total = durToSec(dur)||1;
  const [playing,setPlaying]=React.useState(false);
  const [pos,setPos]=React.useState(0);
  const [rate,setRate]=React.useState(1);
  const bars = React.useRef([...Array(46)].map(()=>0.25+Math.random()*0.75));
  React.useEffect(()=>{
    if(!playing) return;
    const iv=setInterval(()=>{ setPos(p=>{ const n=p+0.1*rate; if(n>=total){ setPlaying(false); return total; } return n; }); },100);
    return ()=>clearInterval(iv);
  },[playing,rate,total]);
  const frac = pos/total;
  const seek=(e)=>{ const r=e.currentTarget.getBoundingClientRect(); setPos(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*total); };
  return (
    <div className="vplayer">
      <button className="vp-play" onClick={()=>{ if(pos>=total) setPos(0); setPlaying(p=>!p); }} aria-label={playing?'Pause':'Play'}>
        <Icon name={playing?'pause':'play'}/>
      </button>
      <div className="vp-mid">
        <div className="vp-scrub" onClick={seek}>
          {bars.current.map((h,i)=>(<i key={i} className={i/bars.current.length<=frac?'on':''} style={{height:(6+h*20)+'px'}}/>))}
        </div>
        <div className="vp-time"><span>{secToDur(pos)}</span><span>{dur}</span></div>
      </div>
      <button className="vp-rate" onClick={()=>setRate(r=>r===1?1.5:r===1.5?2:1)} aria-label="Playback speed">{rate}×</button>
    </div>
  );
}

/* ---------- transcript ---------- */
function Transcript({ lines, summary, defaultOpen }){
  const [open,setOpen]=React.useState(!!defaultOpen);
  return (
    <div className="ts-card">
      <div className="ts-sum">
        <span className="ts-sum-ic"><Icon name="sparkle"/></span>
        <div><span className="ts-kicker">AI summary</span><p>{summary}</p></div>
      </div>
      <button className="ts-toggle" onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
        <Icon name="message"/>{open?'Hide transcript':'Read full transcript'}
        <Icon name="chevdown" style={{marginLeft:'auto',transform:open?'rotate(180deg)':'none',transition:'transform .18s'}}/>
      </button>
      {open && (
        <div className="ts-body">
          {lines.map((l,i)=>(<div className="ts-line" key={i}><span className="ts-at">{l.at}</span><p>{l.text}</p></div>))}
        </div>
      )}
    </div>
  );
}

/* ---------- voicemail block (player + transcript; actions live in the More menu) ---------- */
function VoicemailBlock({ vm, defaultOpen }){
  return (
    <div className="vmblock">
      <AudioPlayer dur={vm.dur}/>
      <Transcript lines={vm.transcript} summary={vm.summary} defaultOpen={defaultOpen}/>
    </div>
  );
}

/* ---------- timeline items ---------- */
function TLCall({ c, vm, openVm }){
  const d = DIR[c.dir] || DIR.in;
  return (
    <div className="tl-item">
      <span className={`tl-ic ${d.cls}`}><Icon name={d.ic} sw={2.5}/></span>
      <div className="tl-main">
        <div className="tl-row"><b>{d.label}</b><span className="tl-when">{timeOnly(c.when)}</span></div>
        <div className="tl-sub">{CALL_OUTCOME[c.outcome]}{c.dur && c.dur!=='—' ? ' · '+c.dur : ''}</div>
        {vm && <VoicemailBlock vm={vm} defaultOpen={openVm}/>}
      </div>
    </div>
  );
}
function TLVoicemail({ vm, openVm }){
  return (
    <div className="tl-item">
      <span className="tl-ic vm"><Icon name="voicemail"/></span>
      <div className="tl-main">
        <div className="tl-row"><b>Voicemail</b><span className="tl-when">{timeOnly(vm.when)}</span></div>
        <VoicemailBlock vm={vm} defaultOpen={openVm}/>
      </div>
    </div>
  );
}
/* ---------- text bubble + conversation ---------- */
function Bubble({ t, me, small }){
  const out = t.dir==='out';
  const who = out ? (t.author===me ? 'You' : t.author) : null;
  return (
    <div className={`msg-line ${out?'out':'in'}${small?' sm':''}`}>
      {who && <span className="msg-author">{who}</span>}
      <div className={`bubble ${out?'out':'in'}`}>{t.body}</div>
    </div>
  );
}

function TLTextRun({ run, me, onOpen }){
  const msgs = [...run.items].sort((a,b)=>a.ts-b.ts);
  const last = msgs[msgs.length-1];
  return (
    <button className="tl-item textrun" onClick={onOpen}>
      <span className="tl-ic text"><Icon name="message"/></span>
      <div className="tl-main">
        <div className="tl-row"><b>Messages</b><span className="tl-when">{timeOnly(last.when)}</span></div>
        <div className="tr-preview">{msgs.slice(-2).map(t=><Bubble key={t.id} t={t} me={me} small/>)}</div>
        <span className="tl-open">Open conversation <Icon name="chevright"/></span>
      </div>
    </button>
  );
}

function MessagesView({ name, texts, me, onBack, onSend }){
  const [draft,setDraft]=React.useState('');
  const threadRef=React.useRef(null);
  const sorted=[...texts].sort((a,b)=>a.ts-b.ts);
  const groups=[]; let cur=null;
  sorted.forEach(t=>{ const lbl=(String(t.when).split(',')[0]||'').trim(); if(!cur||cur.label!==lbl){ cur={label:lbl,items:[]}; groups.push(cur);} cur.items.push(t); });
  React.useEffect(()=>{ const el=threadRef.current; if(el) el.scrollTop=el.scrollHeight; },[texts.length]);
  const send=()=>{ const v=draft.trim(); if(!v) return; onSend(v); setDraft(''); };
  return (
    <div className="msg-view">
      <button className="msg-back" onClick={onBack}><Icon name="arrowleft"/> Back to contact</button>
      <div className="msg-thread" ref={threadRef}>
        {groups.length===0 && <div className="msg-empty">No messages yet. Send the first text below.</div>}
        {groups.map(g=>(
          <div key={g.label}>
            <div className="msg-day">{g.label}</div>
            {g.items.map(t=><Bubble key={t.id} t={t} me={me}/>)}
          </div>
        ))}
      </div>
      <div className="msg-compose">
        <input className="msg-input" value={draft} placeholder={`Text ${name}`} autoFocus
          onChange={e=>setDraft(e.target.value)}
          onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}/>
        <button className="msg-send" disabled={!draft.trim()} onClick={send} aria-label="Send"><Icon name="arrowupright"/></button>
      </div>
    </div>
  );
}

/* ---------- follow-up ---------- */
function FollowBar({ meta, teammates, onSave }){
  if(meta.follow==='needs'){
    return (
      <div className="followbar needs">
        <span className="fb-ic"><Icon name="flag"/></span>
        <div className="fb-main">
          <b>Needs callback</b>
          <label className="fb-assign">Assigned to
            <select value={meta.assignee||''} onChange={e=>onSave({assignee:e.target.value})}>
              <option value="">Unassigned</option>
              {teammates.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <button className="btn btn-secondary sm" onClick={()=>onSave({follow:'done'})}><Icon name="check"/> Done</button>
      </div>
    );
  }
  if(meta.follow==='done'){
    return (
      <div className="followbar done">
        <span className="fb-ic"><Icon name="check"/></span>
        <div className="fb-main"><b>Followed up</b><span className="fb-note">Marked done{meta.assignee?` · ${meta.assignee}`:''}</span></div>
        <button className="fb-undo" onClick={()=>onSave({follow:'needs'})}>Reopen</button>
      </div>
    );
  }
  return <button className="followbar add" onClick={()=>onSave({follow:'needs'})}><Icon name="flag"/> Flag for follow-up</button>;
}

/* ---------- internal note (single sticky note) ---------- */
function NotesField({ value, onSave }){
  const [v,setV]=React.useState(value||'');
  React.useEffect(()=>{ setV(value||''); },[value]);
  const dirty = v!==(value||'');
  return (
    <div className="stickynote">
      <div className="sticky-h">
        <span className="sticky-ic"><Icon name="pencil"/></span>
        <div className="sticky-ht"><b>Internal note</b><span>Visible only to your team.</span></div>
      </div>
      <textarea className="sticky-ta" value={v} placeholder={'e.g. \u201cCustomer prefers text.\u201d \u00b7 \u201cHusband Marcus is also a patient.\u201d \u00b7 \u201cCall after 3 PM.\u201d'}
        onChange={e=>setV(e.target.value)}/>
      <div className="sticky-acts">
        {v.trim() && <button className="sms-note-clear" onClick={()=>setV('')}>Clear</button>}
        <button className="btn btn-primary sm" disabled={!dirty} style={!dirty?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onSave({note:v})}>Save</button>
      </div>
    </div>
  );
}

/* ---------- add to contacts (create new / add to existing) ---------- */
function ContactCreate({ guess, initialName, isEdit, primaryNum, numbers, emails:emailsInit, knownContacts, onSave, onClose }){
  const [mode,setMode]=React.useState('new');
  const [name,setName]=React.useState(initialName||guess||'');
  const [nums,setNums]=React.useState(numbers||[]);
  const [newNum,setNewNum]=React.useState('');
  const [newLabel,setNewLabel]=React.useState('Mobile');
  const [emails,setEmails]=React.useState(emailsInit||[]);
  const [newEmail,setNewEmail]=React.useState('');
  const [newEmailLabel,setNewEmailLabel]=React.useState('Personal');
  const [q,setQ]=React.useState('');
  const matches = (knownContacts||[]).filter(c=>c.toLowerCase().includes(q.trim().toLowerCase()));
  const addNum=()=>{ const v=newNum.trim(); if(v.replace(/[^\d]/g,'').length<10) return; setNums(n=>[...n,{id:'n'+Date.now(),number:v,label:newLabel}]); setNewNum(''); };
  const removeNum=(id)=>setNums(n=>n.filter(x=>x.id!==id));
  const addEmail=()=>{ const v=newEmail.trim(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return; setEmails(n=>[...n,{id:'e'+Date.now(),email:v,label:newEmailLabel}]); setNewEmail(''); };
  const removeEmail=(id)=>setEmails(n=>n.filter(x=>x.id!==id));
  return (
    <div className="cc-sheet">
      <div className="cc-h">
        <b>{isEdit?'Edit contact':'Add to Contacts'}</b>
        <button className="cc-x" onClick={onClose} aria-label="Close"><Icon name="x"/></button>
      </div>
      {!isEdit && (
        <div className="cc-tabs">
          <button className={mode==='new'?'on':''} onClick={()=>setMode('new')}>Create new</button>
          <button className={mode==='existing'?'on':''} onClick={()=>setMode('existing')}>Add to existing</button>
        </div>
      )}
      {mode==='new' ? (
        <div className="cc-body">
          {guess && !isEdit && name.trim()!==guess && (
            <button className="cc-suggest" onClick={()=>setName(guess)}>
              <span className="cc-sug-av"><Avatar name={guess}/></span>
              <span className="cc-sug-t"><small>From caller ID</small><b>Use “{guess}”</b></span>
              <span className="cc-sug-go"><Icon name="plus"/></span>
            </button>
          )}
          <label className="cc-field"><span>Name</span>
            <input className="input" autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/>
          </label>
          {isEdit && (
            <div className="cc-field">
              <span>Phone numbers</span>
              <div className="cc-nums">
                <div className="cc-numrow primary">
                  <span className="cc-numlbl">Primary</span>
                  <span className="cc-numval">{primaryNum}</span>
                </div>
                {nums.map(n=>(
                  <div className="cc-numrow" key={n.id}>
                    <span className="cc-numlbl">{n.label}</span>
                    <span className="cc-numval">{n.number}</span>
                    <button className="cc-numx" onClick={()=>removeNum(n.id)} aria-label="Remove number"><Icon name="x"/></button>
                  </div>
                ))}
                <div className="cc-numadd">
                  <select value={newLabel} onChange={e=>setNewLabel(e.target.value)}>
                    {['Mobile','Office','Home','Other'].map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <input className="input" value={newNum} placeholder="Add a number" onChange={e=>setNewNum(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addNum(); }}/>
                  <button className="btn btn-secondary sm" onClick={addNum}><Icon name="plus"/></button>
                </div>
              </div>
            </div>
          )}
          {isEdit && (
            <div className="cc-field">
              <span>Email addresses</span>
              <div className="cc-nums">
                {emails.map(e=>(
                  <div className="cc-numrow" key={e.id}>
                    <span className="cc-numlbl">{e.label}</span>
                    <span className="cc-numval">{e.email}</span>
                    <button className="cc-numx" onClick={()=>removeEmail(e.id)} aria-label="Remove email"><Icon name="x"/></button>
                  </div>
                ))}
                <div className="cc-numadd">
                  <select value={newEmailLabel} onChange={e=>setNewEmailLabel(e.target.value)}>
                    {['Personal','Work','Other'].map(l=><option key={l} value={l}>{l}</option>)}
                  </select>
                  <input className="input" value={newEmail} placeholder="Add an email" onChange={e=>setNewEmail(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') addEmail(); }}/>
                  <button className="btn btn-secondary sm" onClick={addEmail}><Icon name="plus"/></button>
                </div>
              </div>
            </div>
          )}
          <div className="cc-foot">
            <button className="btn btn-ghost sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary sm" disabled={!name.trim()} style={!name.trim()?{opacity:.5,pointerEvents:'none'}:null}
              onClick={()=>{ onSave({name:name.trim(), numbers:nums, emails}); onClose(); }}>
              {isEdit?'Save changes':'Create contact'}
            </button>
          </div>
        </div>
      ) : (
        <div className="cc-body">
          <div className="cc-search"><Icon name="search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search contacts"/></div>
          <div className="cc-list">
            {matches.length===0 && <div className="cc-empty">No matching contacts.</div>}
            {matches.map(c=>(
              <button key={c} className="cc-pick" onClick={()=>{ onSave({name:c}); onClose(); }}>
                <Avatar name={c}/><span className="cc-pick-n">{c}</span><span className="cc-pick-add">Add number</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- call-back popover (ring my device first) ---------- */
function CallLaunch({ target, devices, numbers, onClose }){
  const callNums = (numbers && numbers.length) ? numbers : [{ number:target, label:'Primary' }];
  const [toNum,setToNum]=React.useState(callNums[0].number);
  const opts = devices.filter(d=>d.enabled!==false).map(d=>{
    if(d.type==='phone') return { id:d.id, t:'My phone', s:d.number, icon:'phone' };
    if(d.type==='sip')   return { id:d.id, t:'Desk phone', s:d.device, icon:'monitor' };
    return { id:d.id, t:'JOEL app', s:d.user, icon:'smartphone' };
  });
  const [sel,setSel]=React.useState(opts[0]?opts[0].id:'__custom');
  const [customNum,setCustomNum]=React.useState('');
  const [ringing,setRinging]=React.useState(null);
  const customValid = customNum.replace(/[^\d]/g,'').length>=10;
  const chosen = sel==='__custom'
    ? (customValid ? { id:'__custom', t:'this number', s:customNum.trim(), icon:'phone' } : null)
    : opts.find(o=>o.id===sel);
  if(ringing){
    return (
      <div className="cl-pop" onMouseDown={e=>e.stopPropagation()}>
        <div className="cl-ring">
          <span className="cl-ring-ic"><Icon name="phone"/></span>
          <b>Ringing {ringing.id==='__custom'?ringing.s:`your ${ringing.t.toLowerCase()}`}…</b>
          <p>Pick up {ringing.s} and JOEL will connect you to {toNum}.</p>
          <button className="btn btn-secondary sm block" onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
  }
  return (
    <div className="cl-pop" onMouseDown={e=>e.stopPropagation()}>
      <div className="cl-h"><b>Call {target}</b><p>JOEL rings one of your devices first, then connects the call.</p></div>
      {callNums.length>1 && (
        <div className="cl-tonum">
          <span className="cl-tonum-l">Call which number</span>
          <div className="cl-tonum-opts">
            {callNums.map(n=>(
              <button key={n.number} className={`cl-tonum-opt${toNum===n.number?' on':''}`} onClick={()=>setToNum(n.number)}>
                <b>{n.number}</b><span>{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="cl-list">
        {opts.map(o=>(
          <button key={o.id} className={`cl-opt${sel===o.id?' on':''}`} onClick={()=>setSel(o.id)}>
            <span className="cl-ic"><Icon name={o.icon}/></span>
            <span className="cl-t"><b>{o.t}</b><span>{o.s}</span></span>
            <span className={`radio${sel===o.id?' on':''}`}/>
          </button>
        ))}
        <button className={`cl-opt${sel==='__custom'?' on':''}`} onClick={()=>setSel('__custom')}>
          <span className="cl-ic"><Icon name="hashnum"/></span>
          <span className="cl-t"><b>Another number</b><span>Ring a number not set up yet</span></span>
          <span className={`radio${sel==='__custom'?' on':''}`}/>
        </button>
        {sel==='__custom' && (
          <input className="input cl-custom" autoFocus value={customNum} placeholder="(555) 123-4567"
            onChange={e=>setCustomNum(e.target.value)} onMouseDown={e=>e.stopPropagation()}
            onKeyDown={e=>{ if(e.key==='Enter' && customValid) setRinging(chosen); }}/>
        )}
      </div>
      <div className="cl-foot">
        <button className="btn btn-ghost sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary sm" disabled={!chosen} style={!chosen?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>setRinging(chosen)}><Icon name="phone"/> Call</button>
      </div>
    </div>
  );
}

/* ---------- quick action ---------- */
function QAct({ icon, label, primary, danger, on, onClick }){
  return (
    <button className={`qact${primary?' primary':''}${danger?' danger':''}${on?' active':''}`} onClick={onClick}>
      <span className="qa-ic"><Icon name={icon}/></span>{label}
    </button>
  );
}

/* ---------- focused activity card (lead with the clicked item, any type) ---------- */
function FocusVoicemail({ vm, dir, extensions, extra, onMove, onUndoMove, onEmail, onSetHeard }){
  const move = extra && extra.move;
  const currentExt = move ? Number(move.to) : vm.ext;
  const movedFrom = move ? move.from : null;
  const { VmMoreMenu, VmStatusChips } = window;
  return (
    <div className="focus-card">
      <div className="focus-h">
        <span className="focus-ic vm"><Icon name="voicemail"/></span>
        <div className="focus-t">
          <b>{dir==='missed' ? 'Missed call · Voicemail' : 'Voicemail'}</b>
          <span>{fmtDayHeader(vm.when, vm.date)} · {timeOnly(vm.when)} · {vm.dur}</span>
        </div>
      </div>
      <VoicemailBlock vm={vm} defaultOpen/>
      {extensions && <VmStatusChips vm={vm} movedFrom={movedFrom} extensions={extensions} extra={extra} onUndoMove={onUndoMove}/>}
      {extensions && (
        <div className="avp-acts" style={{marginTop:12}}>
          <VmMoreMenu vm={vm} currentExt={currentExt} extensions={extensions} extra={extra} onMove={onMove} onUndoMove={onUndoMove} onEmail={onEmail} onSetHeard={onSetHeard}/>
        </div>
      )}
    </div>
  );
}
function FocusCall({ c, dir }){
  const T = { in:{ic:'arrowdownleft',cls:'in',label:'Incoming call'}, out:{ic:'arrowupright',cls:'out',label:'Outgoing call'}, missed:{ic:'arrowdownleft',cls:'missed',label:'Missed call'} }[dir] || {ic:'phone',cls:'in',label:'Call'};
  const note = c.outcome==='answered' ? 'Call connected.' : c.outcome==='missed' ? 'No voicemail left.' : '';
  return (
    <div className="focus-card">
      <div className="focus-h">
        <span className={`focus-ic ${T.cls}`}><Icon name={T.ic} sw={2.5}/></span>
        <div className="focus-t">
          <b>{T.label}</b>
          <span>{fmtDayHeader(c.when, c.date)} · {timeOnly(c.when)}{c.outcome==='answered'?` · ${c.dur}`:''}</span>
        </div>
      </div>
      {note && <div className="focus-note">{note}</div>}
      {c.rec && (
        <div className="focus-rec">
          <div className="focus-rec-h"><Icon name="disc"/> Call recording</div>
          <AudioPlayer dur={c.dur}/>
          {c.recSummary && <Transcript lines={c.recTranscript||[]} summary={c.recSummary} defaultOpen/>}
          <div className="vmb-acts" style={{marginTop:10}}>
            <button className="mini-btn"><Icon name="download"/> Audio</button>
            <button className="mini-btn"><Icon name="filetext"/> Transcript</button>
          </div>
        </div>
      )}
    </div>
  );
}
function FocusText({ texts, me, onOpen }){
  const msgs = [...texts].sort((a,b)=>a.ts-b.ts).slice(-3);
  return (
    <div className="focus-card">
      <div className="focus-h">
        <span className="focus-ic text"><Icon name="message"/></span>
        <div className="focus-t"><b>Messages</b><span>{texts.length} message{texts.length!==1?'s':''}</span></div>
      </div>
      <div className="focus-msgs">{msgs.map(t=><Bubble key={t.id} t={t} me={me} small/>)}</div>
      <button className="focus-open" onClick={onOpen}>Open conversation <Icon name="chevright"/></button>
    </div>
  );
}

/* ---------- contact profile: numbers, emails, activity digest ---------- */
function NumbersBlock({ num, numbers }){
  const [copied,setCopied]=React.useState(null);
  function copy(n){ try{ navigator.clipboard.writeText(n); }catch(e){} setCopied(n); setTimeout(()=>setCopied(null),1400); }
  const extras = numbers||[];
  return (
    <div className="cprof-sec">
      <div className="cprof-h">Phone</div>
      <div className="cprof-numrow">
        <span className="cd-ic"><Icon name="phone"/></span>
        <div className="cd-v"><b>{num}</b><span>Primary · {regionOf(num)}</span></div>
        <button className="cprof-copy" onClick={()=>copy(num)} title="Copy number">{copied===num ? <Icon name="check"/> : <Icon name="copy"/>}</button>
      </div>
      {extras.map(e=>(
        <div className="cprof-numrow" key={e.id}>
          <span className="cd-ic"><Icon name="phone"/></span>
          <div className="cd-v"><b>{e.number}</b><span>{e.label} · {regionOf(e.number)}</span></div>
          <button className="cprof-copy" onClick={()=>copy(e.number)} title="Copy number">{copied===e.number ? <Icon name="check"/> : <Icon name="copy"/>}</button>
        </div>
      ))}
    </div>
  );
}

function EmailsBlock({ emails }){
  const list = emails||[];
  const [copied,setCopied]=React.useState(null);
  function copy(e){ try{ navigator.clipboard.writeText(e); }catch(_){} setCopied(e); setTimeout(()=>setCopied(null),1400); }
  if(list.length===0) return null;
  return (
    <div className="cprof-sec">
      <div className="cprof-h">Email</div>
      {list.map(e=>(
        <div className="cprof-numrow" key={e.id}>
          <span className="cd-ic"><Icon name="mail"/></span>
          <div className="cd-v"><b>{e.email}</b><span>{e.label}</span></div>
          <button className="cprof-copy" onClick={()=>copy(e.email)} title="Copy email">{copied===e.email ? <Icon name="check"/> : <Icon name="copy"/>}</button>
        </div>
      ))}
    </div>
  );
}

function ActivityDigest({ num, name, calls, voicemails, texts, onNavigate }){
  const recCount = calls.filter(c=>c.rec).length;
  const unreadVm = voicemails.filter(v=>!v.heard).length;
  const all = [...calls, ...voicemails, ...texts];
  const last = all.sort((a,b)=>b.ts-a.ts)[0];
  const lastTxt = last ? `${fmtDayHeader(last.when,last.date)}, ${timeOnly(last.when)}` : '—';
  const rows = [
    { dest:'calls', n:calls.length, label:'Calls', sub: recCount?`${recCount} recorded`:null, icon:'phone' },
    { dest:'voicemails', n:voicemails.length, label:'Voicemails', sub: unreadVm?`${unreadVm} unread`:null, icon:'voicemail' },
    { dest:'sms', n:texts.length, label:'Messages', sub:null, icon:'message' },
  ];
  return (
    <div className="cprof-sec">
      <div className="cprof-h">Activity <span className="cprof-last"><Icon name="clock"/> Last contact {lastTxt}</span></div>
      <div className="dig-list">
        {rows.map(r=>(
          <button key={r.dest} className="dig-row" onClick={()=>onNavigate(r.dest,num,name)} disabled={r.n===0} style={r.n===0?{opacity:.5,pointerEvents:'none'}:null}>
            <span className="dig-ic"><Icon name={r.icon}/></span>
            <span className="dig-label">{r.label}</span>
            {r.sub && <span className="dig-rsub">{r.sub}</span>}
            <span className="dig-count">{r.n}</span>
            <Icon name="chevright"/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ======================= CONTACT DRAWER ======================= */
function ContactDrawer({ num, openItem, calls, voicemails, texts, meta, teammates, knownContacts, devices, me, extensions, vmExtra, onMoveVm, onUndoMoveVm, onEmailVm, onClose, onSaveMeta, onSend, onNavigate, mode }){
  const [creating,setCreating]=React.useState(false);
  const [calling,setCalling]=React.useState(false);
  const [view,setView]=React.useState(openItem && openItem.type==='text' ? 'messages' : 'overview');

  // resolve identity from saved name → any record's contact → any cnam
  let foundContact = meta.name || null, foundCnam = null;
  [...calls, ...voicemails, ...texts].forEach(r=>{
    if(!foundContact && r.contact) foundContact = r.contact;
    if(!foundCnam && r.cnam) foundCnam = r.cnam;
  });
  const id = identityOf({ num, contact:foundContact, cnam:foundCnam });

  // which voicemail to auto-expand (the one the user clicked)
  const openVmId = openItem && openItem.type==='vm' ? openItem.id
    : (openItem && openItem.type==='call' ? (calls.find(c=>c.id===openItem.id)||{}).vmId : null);
  // lead with whatever item was clicked; show the rest as "earlier activity"
  const focusVm = openVmId ? voicemails.find(v=>v.id===openVmId) : null;
  const focusCallOnly = (!focusVm && openItem && openItem.type==='call') ? calls.find(c=>c.id===openItem.id) : null;
  const focusText = !!(openItem && openItem.type==='text');
  const focusDir = focusVm ? ((calls.find(c=>c.vmId===focusVm.id)||{}).dir||focusVm.dir) : (focusCallOnly?focusCallOnly.dir:null);
  const hasFocus = !!(focusVm || focusCallOnly || focusText);
  const focusView = false; // "View contact" always opens the unified contact profile

  // merged, de-duped, date-grouped timeline
  const vmInCalls = new Set(calls.map(c=>c.vmId).filter(Boolean));
  const items = [
    ...calls.map(c=>({ kind:'call', ts:c.ts, when:c.when, data:c })),
    ...voicemails.filter(v=>!vmInCalls.has(v.id)).map(v=>({ kind:'vm', ts:v.ts, when:v.when, data:v })),
    ...texts.map(t=>({ kind:'text', ts:t.ts, when:t.when, data:t })),
  ].sort((a,b)=>b.ts-a.ts);
  const groups=[]; let cur=null;
  items.forEach(it=>{ const lbl=fmtDayHeader(it.when, it.data.date); if(!cur||cur.label!==lbl){ cur={label:lbl,items:[]}; groups.push(cur);} cur.items.push(it); });
  // fold consecutive texts in each day into one conversation entry
  groups.forEach(g=>{
    const merged=[];
    g.items.forEach(it=>{
      const prev=merged[merged.length-1];
      if(it.kind==='text' && prev && prev.kind==='textrun') prev.items.push(it.data);
      else if(it.kind==='text') merged.push({ kind:'textrun', ts:it.ts, items:[it.data] });
      else merged.push(it);
    });
    g.items=merged;
  });

  const last = items[0];
  const subText = `${items.length} interaction${items.length!==1?'s':''}` + (last?` · last ${timeOnly(last.when)} ${String(last.when).split(',')[0]}`:'');
  const sub = <span className="id-sub-line">{subText}</span>;

  // Messages conversation view (reply composer)
  if(view==='messages'){
    return (
      <Drawer title={id.kind==='contact'?id.name:'Caller'} onClose={onClose} mode={mode} bodyClass="flush-body">
        <MessagesView name={id.primary} texts={texts} me={me} onBack={()=>setView('overview')} onSend={(b)=>onSend(num,b)}/>
      </Drawer>
    );
  }

  return (
    <Drawer title={focusView ? (focusVm?'Voicemail':'Call') : (id.kind==='contact'?id.name:'Caller')} onClose={onClose} mode={mode}>
      <IdentityHero rec={{ num, contact:foundContact, cnam:foundCnam }} sub={sub} onAddContact={()=>setCreating(true)} compact={focusView}/>

      <div className="qact-row" style={{position:'relative'}}>
        <QAct icon="phone" label="Call back" primary onClick={()=>setCalling(c=>!c)}/>
        <QAct icon="message" label="Text" onClick={()=>setView('messages')}/>
        {id.kind==='contact'
          ? <QAct icon="user" label="Edit contact" on={creating} onClick={()=>setCreating(c=>!c)}/>
          : <QAct icon="plus" label="Add contact" on={creating} onClick={()=>setCreating(c=>!c)}/>}
        <QAct icon="ban" label="Block" danger onClick={()=>{}}/>
        {calling && <CallLaunch target={id.primary} devices={devices} numbers={[{number:num,label:'Primary'},...((meta.numbers)||[])]} onClose={()=>setCalling(false)}/>}
      </div>

      {creating && <ContactCreate guess={id.kind==='guess'?id.name:null}
        initialName={meta.name||(id.kind==='contact'?id.name:'')} isEdit={id.kind==='contact'}
        primaryNum={num} numbers={meta.numbers} emails={meta.emails}
        knownContacts={knownContacts} onSave={onSaveMeta} onClose={()=>setCreating(false)}/>}

      {focusView ? (
        <React.Fragment>
          {focusVm && <FocusVoicemail vm={focusVm} dir={focusDir} extensions={extensions}
            extra={vmExtra&&vmExtra[focusVm.id]} onMove={onMoveVm} onUndoMove={onUndoMoveVm} onEmail={onEmailVm} onSetHeard={null}/>}
          {focusCallOnly && <FocusCall c={focusCallOnly} dir={focusDir}/>}
          {items.length>1 && (
            <button className="view-contact-link" onClick={()=>setView('contact')}>
              <Icon name="user"/> View full contact · {items.length} interactions <Icon name="chevright"/>
            </button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <NumbersBlock num={num} numbers={meta.numbers}/>
          <EmailsBlock emails={meta.emails}/>
          <NotesField value={meta.note} onSave={onSaveMeta}/>
          <ActivityDigest num={num} name={id.kind==='contact'?id.name:id.primary}
            calls={calls} voicemails={voicemails} texts={texts} onNavigate={onNavigate}/>
        </React.Fragment>
      )}
    </Drawer>
  );
}

Object.assign(window, { identityOf, regionOf, ContactDrawer });
