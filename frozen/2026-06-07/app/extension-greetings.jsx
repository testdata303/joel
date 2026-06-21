/* ============================================================
   JOEL app — Extension greetings panel (exports to window)
   Sub-tab inside an extension: Voicemail · Extension name · Away.
   Uses OUR native convention: Segmented sub-nav + Card + GreetingRow
   (waveform preview, AI voice, Edit text / Change voice).
   ============================================================ */
const { Icon: EGIcon, Segmented: EGSegmented, Card: EGCard, Toggle: EGToggle } = window;
const EG_useState = React.useState;

function ExtensionGreetings({ ext, patch, away, onGoSchedule }){
  const GreetingRow = window.GreetingRow;
  const [gtab,setGtab]=EG_useState('voicemail');
  const nm = ext.name||'this extension';
  const voice = (ext.voicemail&&ext.voicemail.voice) || 'Aria';
  const oh = ext.officeHours||{mode:'247'};
  const is247 = (oh.mode||'247')==='247';
  const hoursLabel = oh.mode==='custom' ? `${(oh.days||[]).join(', ')}, ${oh.from}–${oh.to}` : 'open 24/7';

  const texts = {
    voicemail:`You’ve reached ${nm}. Sorry we missed you — leave a message and we’ll call you right back.`,
    name:`${nm}`,
    away:`You’ve reached ${nm} after hours. Please leave a message and we’ll get back to you the next business day.`,
  };
  const sugs = {
    voicemail:[
      `Hi, you’ve reached ${nm}. We can’t take your call right now — leave a message and we’ll call you back.`,
      `Thanks for calling ${nm}. Sorry we missed you! Leave your name and number and we’ll be in touch shortly.`,
      `You’ve reached ${nm}’s voicemail. Please leave a detailed message and we’ll return your call as soon as we can.`,
    ],
    name:[ `${nm}`, `${nm} department`, `the ${nm} team` ],
    away:[
      `You’ve reached ${nm} outside our business hours. Please leave a message and we’ll get back to you next business day.`,
      `Thanks for calling ${nm}. We’re away right now — leave a message and we’ll follow up soon.`,
      `${nm} is currently closed. Please leave your name, number, and a brief message after the tone.`,
    ],
  };

  return (
    <div className="panel">
      <div className="eg-subnav">
        <EGSegmented value={gtab} onChange={setGtab} full options={[
          { value:'voicemail', label:'Voicemail', icon:'voicemail' },
          { value:'name', label:'Extension name', icon:'route' },
          { value:'away', label:'Away', icon:'clock' },
        ]}/>
      </div>

      {gtab==='voicemail' && (
        <EGCard icon="voicemail" title="Voicemail greeting"
          desc={`What plays when a caller reaches ${nm}'s voicemail. JOEL writes a transcript and summary of every message automatically.`}>
          <GreetingRow text={texts.voicemail} voice={voice} suggestions={sugs.voicemail}/>
        </EGCard>
      )}

      {gtab==='name' && (
        <EGCard icon="route" title="Extension name"
          desc="Played when a caller searches the dial-by-name directory, or announced to your team on calls with call announce on.">
          <GreetingRow text={texts.name} voice={voice} suggestions={sugs.name}/>
        </EGCard>
      )}

      {gtab==='away' && (
        <EGCard icon="clock" title="Away greeting"
          desc="A separate greeting for callers who reach this extension while it’s closed — outside its schedule, on away dates, or while it’s set away. After it plays, they can leave a voicemail.">
          {(()=>{
            const afterHours = oh.afterHours || 'forward-off';
            const hasAwayDates = oh.away && oh.away.length>0;
            const isAwayNow = !!away;
            const everCloses = !is247 || hasAwayDates || isAwayNow;
            const ScheduleLink = <button className="inline-link" onClick={()=>onGoSchedule&&onGoSchedule()}>Extension Schedule</button>;
            if(afterHours!=='away'){
              return <div className="note warn" style={{marginBottom:16}}><EGIcon name="info"/><span><b>Not playing right now.</b> When {nm} is closed it’s set to play the <b>voicemail greeting</b> instead of this away greeting. Switch to “Play away greeting” in {ScheduleLink}.</span></div>;
            }
            if(!everCloses){
              return <div className="note warn" style={{marginBottom:16}}><EGIcon name="info"/><span><b>Not playing right now.</b> {nm} is open <b>24/7</b> with no away dates, so callers never reach this greeting. Set custom hours or away dates — or use <b>Set away now</b> — in {ScheduleLink}.</span></div>;
            }
            if(isAwayNow){
              return <div className="note ok" style={{marginBottom:16}}><EGIcon name="info"/><span><b>Playing now.</b> {nm} is set to away, so every caller hears this greeting until you turn it back on in {ScheduleLink}.</span></div>;
            }
            return <div className="note info" style={{marginBottom:16}}><EGIcon name="info"/><span>Plays when {nm} is closed — outside <b>{hoursLabel}</b> and on any away dates. Manage those in {ScheduleLink}.</span></div>;
          })()}
          <GreetingRow text={texts.away} voice={voice} suggestions={sugs.away}/>
        </EGCard>
      )}
    </div>
  );
}

Object.assign(window, { ExtensionGreetings });
