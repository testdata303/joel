/* ============================================================
   Call Flow concept - right-side inspector
   Everything about a node is managed here: greeting audio,
   menu options, who rings, voicemail emails, Slack, auto-texts.
   ============================================================ */
const { Icon, Toggle, Segmented, CfWave, FLOW_TYPES, flowSummary } = window;

/* labelled section */
function CiSec({ label, help, children }){
  return (
    <div className="cf-sec">
      {label && <span className="cf-sec-l">{label}</span>}
      {children}
      {help && <div className="help">{help}</div>}
    </div>
  );
}

/* greeting block: recorded audio OR AI text */
function CiGreeting({ g, onChange, label='Greeting' }){
  const isAudio = g && g.kind==='audio';
  return (
    <CiSec label={label}>
      {isAudio ? (
        <div className="cf-audio">
          <span className="cf-playbtn"><Icon name="play"/></span>
          <CfWave seed={(g.text||'g')+label} n={30}/>
          <span className="cf-audio-meta">{g.dur||'0:08'}</span>
        </div>
      ) : (
        <React.Fragment>
          <textarea className="cf-ta" value={g?.text||''}
            onChange={e=>onChange({ ...(g||{kind:'ai'}), text:e.target.value })}></textarea>
          <div style={{marginTop:8}}><span className="cf-aitag"><Icon name="sparkle"/>Read by your AI voice</span></div>
        </React.Fragment>
      )}
      <div className="cf-audio-btns">
        <button className="btn btn-secondary"><Icon name="mic"/>Record new</button>
        <button className="btn btn-secondary"><Icon name="audiolines"/>Upload audio</button>
      </div>
      {!isAudio && <div className="help">Saved once as an audio file using the AI voice from Quick Setup - not read live on each call.</div>}
    </CiSec>
  );
}

/* notification channel row with expandable config */
function CiChannel({ icon, name, desc, on, onToggle, children }){
  return (
    <React.Fragment>
      <div className="cf-chrow">
        <span className="cf-ric"><Icon name={icon}/></span>
        <span className="cf-rtxt"><b>{name}</b><span>{desc}</span></span>
        <Toggle sm on={on} onChange={onToggle}/>
      </div>
      {on && children ? <div className="cf-chsub">{children}</div> : null}
    </React.Fragment>
  );
}

const CI_CHANNELS = ['#service','#emergencies','#billing','#general'];

/* ---------- per-type panels ---------- */

function CiMenu({ n, patch, allNodes, onSelect, onOpenAdd, isRoot }){
  const kids = n.children||[];
  const vmTargets = allNodes.filter(x=>x.type==='vm');
  return (
    <React.Fragment>
      <CiGreeting g={n.greeting} onChange={g=>patch({greeting:g})}/>
      <CiSec label={`Menu options (${kids.length})`} help={kids.length ? 'Callers press a key to choose. Click an option to manage it.' : 'No options yet - every caller just hears the greeting.'}>
        <div className="cf-dlist">
          {kids.map(k=>(
            <button key={k.id} className="cf-optrow" onClick={()=>onSelect(k.id)}>
              <span className="cf-key" data-t={k.type}>{k.key}</span>
              <span className="cf-rtxt"><b>{k.name}</b><span>{flowSummary(k)}</span></span>
              <Icon name="chevright"/>
            </button>
          ))}
          <button className="cf-addbtn" onClick={(e)=>onOpenAdd(n.id, e)}><Icon name="plus"/>Add an option</button>
        </div>
      </CiSec>
      {kids.length>0 && (
        <CiSec label="If the caller doesn't press a key">
          <div className="cf-chrow" style={{padding:'4px 0 10px', borderBottom:'none'}}>
            <span className="cf-rtxt"><b>Timeout fallback</b><span>After the greeting plays twice</span></span>
            <Toggle sm on={!!(n.timeout&&n.timeout.on)} onChange={v=>patch({timeout:{...(n.timeout||{}), on:v}})}/>
          </div>
          {n.timeout && n.timeout.on && (
            <select className="cf-sel" value={n.timeout.dest||''} onChange={e=>patch({timeout:{...n.timeout, dest:e.target.value}})}>
              <option value="">Choose a destination…</option>
              {vmTargets.map(v=><option key={v.id} value={v.name}>{v.name}</option>)}
              <option value="__hangup">End the call politely</option>
            </select>
          )}
        </CiSec>
      )}
      {isRoot && (
        <CiSec label="Number">
          <div className="cf-sumline" style={{borderBottom:'none', padding:'2px 0'}}>
            <span className="cf-ric"><Icon name="phone"/></span>
            <b>(617) 555-0100</b>
            <span style={{color:'var(--green)',fontWeight:700}}>Active</span>
          </div>
          <div className="help">Every call to your main number starts here.</div>
        </CiSec>
      )}
    </React.Fragment>
  );
}

function CiExt({ n, patch }){
  const dests = n.dests||[];
  const addDest = ()=>{
    const pool = [
      {label:'Bob Stevens', sub:'Mobile app', kind:'app'},
      {label:'(617) 555-0177', sub:'Mobile phone', kind:'cell'},
      {label:'Front Office', sub:'Desk phone', kind:'desk'},
    ];
    patch({ dests:[...dests, pool[dests.length % pool.length]] });
  };
  return (
    <React.Fragment>
      <CiSec label={`Who rings (${dests.length})`} help={dests.length===0 ? 'Add a teammate, the mobile app, or any phone number.' : undefined}>
        <div className="cf-dlist">
          {dests.map((d,i)=>(
            <div key={i} className="cf-drow">
              <span className="cf-ric"><Icon name={d.kind==='desk'?'monitor':'smartphone'}/></span>
              <span className="cf-rtxt"><b>{d.label}</b><span>{d.sub}</span></span>
              <button className="cf-del" onClick={()=>patch({dests:dests.filter((_,j)=>j!==i)})} aria-label={'Remove '+d.label}><Icon name="trash"/></button>
            </div>
          ))}
          <button className="cf-addbtn" onClick={addDest}><Icon name="plus"/>Add a person or phone</button>
        </div>
      </CiSec>
      {dests.length>1 && (
        <CiSec label="Ring order">
          <Segmented full value={n.ring||'order'} onChange={v=>patch({ring:v})}
            options={[{value:'order',label:'In order'},{value:'all',label:'All at once'}]}/>
        </CiSec>
      )}
      <CiSec label="If nobody answers">
        <Segmented full value={n.noAnswer||'voicemail'} onChange={v=>patch({noAnswer:v})}
          options={[{value:'voicemail',label:'Voicemail'},{value:'text',label:'Text back'},{value:'menu',label:'Main menu'}]}/>
      </CiSec>
      <CiSec label="Notify the team">
        <CiChannel icon="slack" name="Slack" desc="Missed calls & voicemails" on={!!(n.slack&&n.slack.on)}
          onToggle={v=>patch({slack:{...(n.slack||{channel:''}), on:v}})}>
          <select className="cf-sel" value={(n.slack&&n.slack.channel)||''} onChange={e=>patch({slack:{...n.slack, channel:e.target.value}})}>
            <option value="">Choose a channel…</option>
            {CI_CHANNELS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </CiChannel>
        <CiChannel icon="mail" name="Email" desc="Voicemail recordings attached" on={!!(n.email&&n.email.on)}
          onToggle={v=>patch({email:{...(n.email||{to:''}), on:v}})}>
          <input className="cf-in" type="email" placeholder="name@business.com" value={(n.email&&n.email.to)||''}
            onChange={e=>patch({email:{...n.email, to:e.target.value}})}/>
        </CiChannel>
      </CiSec>
    </React.Fragment>
  );
}

function CiVm({ n, patch }){
  const emails = n.emails||[];
  return (
    <React.Fragment>
      <CiGreeting g={n.greeting} onChange={g=>patch({greeting:g})} label="Voicemail greeting"/>
      <CiSec label="Send recordings to" help="Each voicemail is transcribed and emailed with the audio attached.">
        <div className="cf-dlist">
          {emails.map((em,i)=>(
            <div key={i} className="cf-drow">
              <span className="cf-ric"><Icon name="mail"/></span>
              <span className="cf-rtxt"><b>{em}</b><span>Email</span></span>
              <button className="cf-del" onClick={()=>patch({emails:emails.filter((_,j)=>j!==i)})} aria-label={'Remove '+em}><Icon name="trash"/></button>
            </div>
          ))}
          <button className="cf-addbtn" onClick={()=>patch({emails:[...emails,'team@bobshvac.com']})}><Icon name="plus"/>Add an email</button>
        </div>
      </CiSec>
      <CiSec label="Notify the team">
        <CiChannel icon="slack" name="Slack" desc="Post new voicemails to a channel" on={!!(n.slack&&n.slack.on)}
          onToggle={v=>patch({slack:{...(n.slack||{channel:''}), on:v}})}>
          <select className="cf-sel" value={(n.slack&&n.slack.channel)||''} onChange={e=>patch({slack:{...n.slack, channel:e.target.value}})}>
            <option value="">Choose a channel…</option>
            {CI_CHANNELS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </CiChannel>
      </CiSec>
    </React.Fragment>
  );
}

function CiText({ n, patch }){
  return (
    <React.Fragment>
      <CiSec label="Message" help="Sent from your main number the moment the caller picks this option.">
        <textarea className="cf-ta" value={n.message||''} onChange={e=>patch({message:e.target.value})}></textarea>
      </CiSec>
      <div className="cf-note"><Icon name="message"/><span>The caller hears a short confirmation - “Okay, we just texted you” - and the call ends.</span></div>
    </React.Fragment>
  );
}

function CiGoto({ n, patch, allNodes }){
  const menus = allNodes.filter(x=>x.type==='menu');
  return (
    <CiSec label="Send the caller back to" help="Replays that menu's greeting and options.">
      <select className="cf-sel" value={n.target||''} onChange={e=>patch({target:e.target.value})}>
        {menus.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}
      </select>
    </CiSec>
  );
}

/* default panel - nothing selected */
function CiDefault({ root, count, onSelect }){
  const lines = [
    { icon:'phone', name:'Main number', meta:'(617) 555-0100' },
    { icon:'route', name:'Steps in your flow', meta:String(count) },
    { icon:'check', name:'Status', meta:'Live' },
  ];
  return (
    <React.Fragment>
      <CiSec label="Your phone system">
        {lines.map(l=>(
          <div key={l.name} className="cf-sumline">
            <span className="cf-ric"><Icon name={l.icon}/></span>
            <b>{l.name}</b><span>{l.meta}</span>
          </div>
        ))}
      </CiSec>
      <div className="cf-note"><Icon name="info"/><span>Click any step to manage it here - greetings, who rings, voicemail, Slack alerts, everything.</span></div>
      <CiSec label="Start here">
        <button className="cf-optrow" onClick={()=>onSelect('root')}>
          <span className="cf-tic"><Icon name="phone"/></span>
          <span className="cf-rtxt"><b>{root.name}</b><span>What callers hear first</span></span>
          <Icon name="chevright"/>
        </button>
      </CiSec>
    </React.Fragment>
  );
}

/* ---------- the inspector shell ---------- */
function FlowInspector({ root, selId, onSelect, patchNode, onOpenAdd, onRename }){
  const n = selId ? window.flowFind(root, selId) : null;
  const allNodes = [];
  (function walk(x){ allNodes.push(x); (x.children||[]).forEach(walk); })(root);

  if(!n){
    return (
      <aside className="cf-insp">
        <div className="cf-insp-h">
          <span className="cf-insp-ic" data-t="root"><Icon name="phone"/></span>
          <div className="cf-insp-t">
            <div style={{fontWeight:800,fontSize:'1.02rem',letterSpacing:'-.01em'}}>Bob's HVAC</div>
            <div className="cf-insp-sub">Phone system overview</div>
          </div>
        </div>
        <div className="cf-insp-b">
          <CiDefault root={root} count={window.flowCount(root)} onSelect={onSelect}/>
        </div>
      </aside>
    );
  }

  const isRoot = n.id==='root';
  const t = FLOW_TYPES[n.type] || FLOW_TYPES.menu;
  const patch = (p)=>patchNode(n.id, p);
  return (
    <aside className="cf-insp">
      <div className="cf-insp-h">
        <span className="cf-insp-ic" data-t={isRoot?'root':n.type}><Icon name={isRoot?'phone':t.icon}/></span>
        <div className="cf-insp-t">
          <input className="cf-namein" value={n.name} onChange={e=>patch({name:e.target.value})} aria-label="Step name"/>
          <div className="cf-insp-sub">{isRoot ? 'What callers hear first' : (n.key ? `Press ${n.key} · ${t.label}` : t.label)}</div>
        </div>
        <button className="cf-insp-x" onClick={()=>onSelect(null)} aria-label="Close"><Icon name="x"/></button>
      </div>
      <div className="cf-insp-b">
        {n.type==='menu' && <CiMenu n={n} patch={patch} allNodes={allNodes} onSelect={onSelect} onOpenAdd={onOpenAdd} isRoot={isRoot}/>}
        {n.type==='ext'  && <CiExt n={n} patch={patch}/>}
        {n.type==='vm'   && <CiVm n={n} patch={patch}/>}
        {n.type==='text' && <CiText n={n} patch={patch}/>}
        {n.type==='goto' && <CiGoto n={n} patch={patch} allNodes={allNodes}/>}
      </div>
    </aside>
  );
}

Object.assign(window, { FlowInspector });
