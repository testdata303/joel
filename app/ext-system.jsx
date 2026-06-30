/* ============================================================
   AnyPhone app - Numbers + Main greeting overview sections.
   These sit ABOVE the extension list on the Extensions screen so
   an owner can see their whole phone system at a glance:
     · Numbers      - what people call; edit/add jumps to Numbers settings
     · Main greeting - hear it, flip on Away mode, edit in settings
   Exports: NumbersSection, MainGreetingSection, AddExtensionModal
   ============================================================ */
const ES_Icon = window.Icon;
const ES_Wave = window.Wave;
const ES_Toggle = window.Toggle;
const ES_Modal = window.Modal;
const ES_Field = window.Field;
const { useState: ES_useState, useEffect: ES_useEffect } = React;

function esExtName(extensions, n){
  const e = (extensions||[]).find(x=>String(x.number)===String(n));
  return e ? e.name : `Ext ${n}`;
}

/* ---------- NUMBERS ---------- */
function NumbersSection({ numbers, extensions, onManage }){
  const nums = numbers || [];
  return (
    <section className="esys-sec">
      <header className="esys-sechead">
        <span className="esys-secic num"><ES_Icon name="hashnum"/></span>
        <div className="esys-sectitle">
          <h2>Numbers</h2>
          <p>The phone numbers your customers call.</p>
        </div>
        <button className="esys-secact" onClick={onManage}><ES_Icon name="plus"/> Add number</button>
      </header>
      <div className="esys-nums">
        {nums.map(n=>{
          const direct = n.routesTo && n.routesTo!=='main';
          return (
            <button className="esys-numrow" key={n.num} onClick={onManage} title="Edit in Numbers settings">
              <span className="esys-numic"><ES_Icon name="phone"/></span>
              <span className="esys-nummain">
                <span className="esys-num">{n.num}</span>
                <span className="esys-nummeta">{n.label} · {n.type}</span>
              </span>
              <span className={`esys-route${direct?' direct':''}`}>
                {direct
                  ? <><ES_Icon name="forward"/> Straight to {esExtName(extensions, n.routesTo)}</>
                  : <>Plays main greeting</>}
              </span>
              <span className="esys-numedit" aria-label="Manage number"><ES_Icon name="chevright"/></span>
            </button>
          );
        })}
        <button className="esys-addnum" onClick={onManage}><ES_Icon name="plus"/> Add or port a number</button>
      </div>
    </section>
  );
}

/* ---------- MAIN GREETING ---------- */
function MainGreetingSection({ businessName, text, hours, away, onToggleAway, onEdit }){
  const [playing,setPlaying]=ES_useState(false);
  ES_useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),2600); return ()=>clearTimeout(t); },[playing]);
  return (
    <section className="esys-sec">
      <header className="esys-sechead">
        <span className="esys-secic greet"><ES_Icon name="audiolines"/></span>
        <div className="esys-sectitle">
          <h2>Main greeting</h2>
          <p>What every caller hears first.</p>
        </div>
        <button className="esys-secact" onClick={onEdit}><ES_Icon name="settings"/> Manage</button>
      </header>
      <div className="esys-greetbody">
        <div className="esys-greetplay">
          <button className={`esys-play${playing?' on':''}`} onClick={()=>setPlaying(p=>!p)} aria-label={playing?'Stop greeting':'Play main greeting'}>
            <ES_Icon name={playing?'pause':'play'}/>
          </button>
          <span className="esys-greetmeta">
            <b>Hear your greeting</b>
            <span>{playing?'Playing…':'0:06'}</span>
          </span>
          <ES_Wave n={32} playing={playing}/>
        </div>
        <div className="esys-greettext">“{text}”</div>
        {away ? (
          <div className="esys-awaynote">
            <ES_Icon name="info"/>
            <span><b>Away mode is on.</b> Callers hear your away message and go straight to voicemail until you switch it back.</span>
          </div>
        ) : null}
        <div className="esys-greetfoot">
          <span className="esys-hours"><ES_Icon name="clock"/> {hours}</span>
          <label className="esys-awaytoggle">
            <span>Away mode</span>
            <ES_Toggle on={!!away} onChange={onToggleAway}/>
          </label>
        </div>
      </div>
    </section>
  );
}

/* ---------- ADD EXTENSION (basic info) ---------- */
function AddExtensionModal({ existing, businessName, onClose, onAdd }){
  // suggest the next free single digit (1–8)
  const taken = new Set((existing||[]).map(e=>String(e.number)));
  const suggested = (()=>{ for(let i=1;i<=8;i++){ if(!taken.has(String(i))) return String(i); } return '4'; })();
  const [name,setName]=ES_useState('');
  const [number,setNumber]=ES_useState(suggested);
  const [forward,setForward]=ES_useState('');

  const dupe = taken.has(number.trim());
  const canSave = name.trim() && number.trim() && !dupe;

  function save(){
    if(!canSave) return;
    onAdd({
      number: number.trim(),
      name: name.trim(),
      forward: forward.trim(),
    });
  }

  return (
    <ES_Modal icon="route" title="Add an extension"
      desc="Give it a name and a number callers can press. You can fine-tune forwarding, voicemail, and access afterward."
      onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!canSave} style={!canSave?{opacity:.5,pointerEvents:'none'}:null} onClick={save}>Add extension</button>
      </>}>
      <div className="aext-grid">
        <ES_Field label="Number" help={dupe?'In use':'Keypad digit'}>
          <input className="input" value={number} inputMode="numeric" maxLength={3}
            onChange={e=>setNumber(e.target.value.replace(/[^\d]/g,''))} style={dupe?{borderColor:'var(--red)'}:null}/>
        </ES_Field>
        <ES_Field label="Name" help="Shown in your menu and dial-by-name directory.">
          <input className="input" autoFocus value={name} placeholder="e.g. Marketing, Front Desk, Dr. Lee"
            onChange={e=>setName(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && canSave) save(); }}/>
        </ES_Field>
      </div>
      <ES_Field label="Forward calls to" help="A phone we should ring first. Optional - add more destinations later.">
        <div className="input-affix"><span className="pre">+1</span>
          <input value={forward} onChange={e=>setForward(e.target.value)} placeholder="(617) 555-0000"/></div>
      </ES_Field>
      <div className="aext-preview">
        <span className="lv-num">{number||'#'}</span>
        <span className="aext-preview-t">
          <b>{name.trim()||'New extension'}</b>
          <span>{forward.trim()?`Forwards to +1 ${forward.trim()}`:'Voicemail only until you add a destination'}</span>
        </span>
      </div>
    </ES_Modal>
  );
}

Object.assign(window, { NumbersSection, MainGreetingSection, AddExtensionModal });
