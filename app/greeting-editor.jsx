/* ============================================================
   AnyPhone app - Greeting editor (exports to window)
   A greeting = Text + Voice + Audio preview, always together.
   Shared by Main and After-hours so both edit identically.
   ============================================================ */
const { Icon, Modal } = window;
const GE_useState = React.useState, GE_useEffect = React.useEffect;

const VOICES = ['Sarah - friendly female','Michael - friendly male','Olivia - professional female','James - professional male','Maya - warm female','David - warm male'];

/* collapsed view: play the audio, see the voice + text, Edit */
function GreetingSummary({ text, voice, onEdit, sub }){
  const [playing,setPlaying]=GE_useState(false);
  GE_useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(false),1800); return ()=>clearTimeout(t); },[playing]);
  return (
    <div className="ge-sum">
      <button className={`ge-playbig${playing?' on':''}`} onClick={()=>setPlaying(p=>!p)} aria-label="Play greeting"><Icon name={playing?'pause':'play'}/></button>
      <div className="ge-sum-t">
        <div className="ge-sum-voice"><Icon name="audiolines"/> {voice.split(' - ')[0]} <span className="ge-voicetag">AI voice</span></div>
        <p className="ge-sum-text">“{text}”</p>
        {sub && <div className="ge-sum-sub">{sub}</div>}
      </div>
      <button className="ov-act" onClick={onEdit}><Icon name="pencil"/> Edit</button>
    </div>
  );
}

/* edit view: text + voice + generate + preview, with Save / Cancel */
function GreetingEditor({ text:t0, voice:v0, businessName, suggest, extra, onSave, onCancel }){
  const [text,setText]=GE_useState(t0||'');
  const [voice,setVoice]=GE_useState(v0||VOICES[0]);
  const [gen,setGen]=GE_useState(true);
  const [playing,setPlaying]=GE_useState(null);
  GE_useEffect(()=>{ setGen(false); },[text,voice]);
  GE_useEffect(()=>{ if(!playing) return; const t=setTimeout(()=>setPlaying(null),1700); return ()=>clearTimeout(t); },[playing]);
  return (
    <div className="ge-edit">
      <div className="ge-field">
        <label>Greeting text</label>
        <textarea className="ge-ta" value={text} autoFocus onChange={e=>setText(e.target.value)}/>
        <button className="ge-suggest" onClick={()=>setText(suggest||`Thank you for calling ${businessName}. Please hold while we connect your call.`)}><Icon name="sparkle"/> Suggest text</button>
      </div>
      <div className="ge-field">
        <label>Voice</label>
        <div className="ge-voicerow">
          <select className="input ge-voicesel" value={voice} onChange={e=>setVoice(e.target.value)}>{VOICES.map(v=><option key={v} value={v}>{v}</option>)}</select>
          <button className="ge-btn" onClick={()=>setPlaying('voice')}><Icon name={playing==='voice'?'pause':'play'}/> {playing==='voice'?'Playing…':'Hear voice'}</button>
        </div>
      </div>
      {extra}
      <div className="ge-audio">
        {!gen ? (
          <button className="ge-btn primary" disabled={!text.trim()} style={!text.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>{ setGen(true); setPlaying('greeting'); }}><Icon name="sparkle"/> Generate audio</button>
        ) : (
          <button className="ge-btn" onClick={()=>setPlaying('greeting')}><Icon name={playing==='greeting'?'pause':'play'}/> {playing==='greeting'?'Playing…':'Preview greeting'}</button>
        )}
        {gen && <span className="ge-ready"><Icon name="check"/> Audio ready · {voice.split(' - ')[0]}</span>}
      </div>
      <div className="ge-acts">
        <button className="btn btn-ghost sm" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary sm" onClick={()=>onSave({text:text.trim(),voice})}>Save</button>
      </div>
    </div>
  );
}

/* add-closure drawer (single day or range, after-hours or custom greeting) */
function HolidayDrawer({ onSave, onClose }){
  const [name,setName]=GE_useState('');
  const [start,setStart]=GE_useState('');
  const [range,setRange]=GE_useState(false);
  const [end,setEnd]=GE_useState('');
  const [mode,setMode]=GE_useState('afterhours');
  const [custom,setCustom]=GE_useState('');
  const valid = name.trim() && start.trim() && (!range || end.trim()) && (mode!=='custom' || custom.trim());
  return (
    <Modal title="Add closure" icon="calendar" onClose={onClose}
      footer={<React.Fragment><button className="btn btn-ghost sm" onClick={onClose}>Cancel</button><button className="btn btn-primary sm" disabled={!valid} style={!valid?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>{ onSave({ name:name.trim(), date: range?`${start} – ${end}`:start, mode }); onClose(); }}>Save closure</button></React.Fragment>}>
      <div className="ge-field"><label>Closure name</label><input className="input" autoFocus value={name} placeholder="e.g. Christmas, Office retreat, Staff training" onChange={e=>setName(e.target.value)}/></div>
      <div className="ge-field"><label>{range?'Start date':'Date'}</label>
        <div className="ge-daterow">
          <input className="input" value={start} placeholder="e.g. Dec 24" onChange={e=>setStart(e.target.value)}/>
          {range && <React.Fragment><span className="ge-dash">→</span><input className="input" value={end} placeholder="e.g. Dec 26" onChange={e=>setEnd(e.target.value)}/></React.Fragment>}
        </div>
        <label className="ge-check"><input type="checkbox" checked={range} onChange={e=>setRange(e.target.checked)}/> Multiple days (date range)</label>
      </div>
      <div className="ge-field"><label>What callers hear</label>
        <div className="ge-radios">
          <button className={`ge-radio${mode==='afterhours'?' on':''}`} onClick={()=>setMode('afterhours')}><span className="ge-radio-dot"/>Use after-hours greeting</button>
          <button className={`ge-radio${mode==='custom'?' on':''}`} onClick={()=>setMode('custom')}><span className="ge-radio-dot"/>Custom holiday greeting</button>
        </div>
        {mode==='custom' && <textarea className="ge-ta" style={{marginTop:10}} value={custom} placeholder="e.g. Happy holidays! We’re closed until January 2nd. Leave a message and we’ll call you back." onChange={e=>setCustom(e.target.value)}/>}
      </div>
    </Modal>
  );
}

Object.assign(window, { GreetingEditor, GreetingSummary, HolidayDrawer, VOICES });
