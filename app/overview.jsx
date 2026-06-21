/* ============================================================
   JOEL app - Extension Overview (activity, not settings)
   Shows the extension's voicemails & calls; rows open detail drawers.
   ============================================================ */
const { Icon, Card, Avatar, identityOf, EmptyArt } = window;

/* parse "m:ss" -> seconds, and back */
function vmSec(s){ const [m,x]=String(s).split(':').map(Number); return (m||0)*60+(x||0); }
function vmFmt(t){ const m=Math.floor(t/60), s=Math.round(t%60); return `${m}:${String(s).padStart(2,'0')}`; }

/* voicemail row - play happens INLINE; clicking the row opens the detail */
function VmRow({ vm, onOpen, inlinePlay, onHeard, cmeta }){
  const id = identityOf({...vm, contact:(cmeta&&cmeta.name)||vm.contact});
  const total = vmSec(vm.dur)||1;
  const [playing,setPlaying]=React.useState(false);
  const [pos,setPos]=React.useState(0);
  const bars = React.useRef([...Array(40)].map(()=>0.25+Math.random()*0.75));
  React.useEffect(()=>{
    if(!playing) return;
    const iv=setInterval(()=>{ setPos(p=>{ const n=p+0.1; if(n>=total){ setPlaying(false); return total; } return n; }); },100);
    return ()=>clearInterval(iv);
  },[playing,total]);
  const active = playing || pos>0;
  const frac = pos/total;

  function togglePlay(e){
    e.stopPropagation();
    if(!inlinePlay){ onOpen(vm); return; }
    if(!vm.heard) onHeard(vm.id);
    if(pos>=total) setPos(0);
    setPlaying(p=>!p);
  }
  function seek(e){
    e.stopPropagation();
    const r=e.currentTarget.getBoundingClientRect();
    setPos(Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))*total);
  }

  return (
    <button className={`ov-vm${vm.heard?'':' unheard'}`} onClick={()=>onOpen(vm)}>
      <span className="vm-dot" aria-hidden="true"/>
      {id.kind==='contact'
        ? <Avatar name={id.name} className="vm-av"/>
        : <span className="vm-av glyph"><Icon name="user"/></span>}
      <div className="vm-body">
        <div className="vm-top">
          <b>{id.primary}</b>
          {id.kind==='guess'  && <span className="vm-maybe">Maybe {id.name}</span>}
          <span className="vm-when">{vm.when} · {vm.dur}</span>
        </div>
        {active && inlinePlay ? (
          <div className="vm-inline">
            <div className="vmi-scrub" onClick={seek}>
              {bars.current.map((h,i)=>(
                <i key={i} className={i/bars.current.length<=frac?'on':''} style={{height:(4+h*16)+'px'}}/>
              ))}
            </div>
            <span className="vmi-time">{vmFmt(pos)} / {vm.dur}</span>
          </div>
        ) : (
          <p className="vm-sum"><span className="ai-mini"><Icon name="sparkle"/></span>{vm.summary}</p>
        )}
      </div>
      <span className={`vm-play${playing?' playing':''}`} onClick={togglePlay} aria-label={playing?'Pause':'Play'}>
        <Icon name={playing?'pause':'play'}/>
      </span>
      <span className="vm-open" onClick={(e)=>{ e.stopPropagation(); onOpen(vm); }} aria-label="Open details">
        <Icon name="chevright"/>
      </span>
    </button>
  );
}

const DIR_META = {
  in:     { icon:'arrowdownleft', cls:'in',     label:'Inbound' },
  out:    { icon:'arrowupright',  cls:'out',    label:'Outbound' },
  missed: { icon:'arrowdownleft', cls:'missed', label:'Missed' },
};
const OUTCOME = {
  answered:{ t:'Answered', cls:'on' },
  voicemail:{ t:'Voicemail', cls:'vm' },
  missed:{ t:'Missed', cls:'miss' },
};

function CallRow({ c, onOpen, cmeta }){
  const d = DIR_META[c.dir], o = OUTCOME[c.outcome];
  const id = identityOf({...c, contact:(cmeta&&cmeta.name)||c.contact});
  return (
    <button className="ov-call" onClick={()=>onOpen(c)}>
      <span className={`cdir ${d.cls}`} title={d.label}><Icon name={d.icon} sw={2.5}/></span>
      <div className="cmain">
        <b>{id.primary}</b>
        <span className="cnum">{id.kind==='guess' ? 'Maybe '+id.name : id.secondary}</span>
      </div>
      <span className={`coutcome ${o.cls}`}>{o.t}</span>
      <span className="cdur">{c.dur}</span>
      <span className="cwhen">{c.when}</span>
    </button>
  );
}

function OverviewPanel({ voicemails, calls, onOpenCall, onOpenVm, inlinePlay, onHeard, contactMeta, goActivity }){
  const unheard = voicemails.filter(v=>!v.heard).length;
  return (
    <div className="panel ov">
      {/* Recent voicemails for THIS extension */}
      <Card>
        <div className="ov-sec-h">
          <h3><Icon name="voicemail"/> Recent voicemails {unheard>0 && <span className="sec-count">{unheard} new</span>}</h3>
          <button className="ov-link" onClick={()=>goActivity&&goActivity('vm')}>
            View all in Activity <Icon name="chevright"/>
          </button>
        </div>
        <div className="ov-vmlist">
          {voicemails.length===0
            ? <div className="ov-empty"><EmptyArt name="voicemail" size={84} /><b>No voicemails yet</b><span>New messages land here, transcribed and ready to play.</span></div>
            : voicemails.map(vm=><VmRow key={vm.id} vm={vm} onOpen={onOpenVm} inlinePlay={inlinePlay} onHeard={onHeard} cmeta={contactMeta&&contactMeta[vm.num]}/>)}
        </div>
      </Card>

      {/* Recent calls for THIS extension */}
      <Card>
        <div className="ov-sec-h">
          <h3><Icon name="phone"/> Recent calls</h3>
          <button className="ov-link" onClick={()=>goActivity&&goActivity('calls')}>
            View all in Activity <Icon name="chevright"/>
          </button>
        </div>
        <div className="ov-calllist">
          {calls.length===0
            ? <div className="ov-empty">No calls on this extension yet.</div>
            : calls.map(c=><CallRow key={c.id} c={c} onOpen={onOpenCall} cmeta={contactMeta&&contactMeta[c.num]}/>)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { OverviewPanel });
