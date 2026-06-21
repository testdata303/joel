/* Option B - Stage Columns: the call as a left-to-right pipeline.
   Selecting a key lights up the "Who answers" + "If no answer" columns. */

function BKeyRow({ o, sel, onSel }) {
  const tt = typeTag(o.type);
  return (
    <button className={`b-keyrow${sel ? ' sel' : ''}`} onClick={onSel}>
      <span className="cf-keybadge">{o.key}</span>
      <span className={`cf-tile ${tt.cls}`}><Icon name={o.glyph} /></span>
      <span className="kn"><b>{o.name}</b><span>{strategyLabel(o)}</span></span>
      <span className="kchev"><Icon name="chevright" /></span>
    </button>
  );
}

function OptionB() {
  const [sel, setSel] = useState('1');
  const o = OPTIONS.find((x) => x.key === sel);
  const tt = typeTag(o.type);

  return (
    <div className="cf-board">
      <header className="cf-head">
        <span className="cf-bizmark"><Icon name="route" /></span>
        <div className="cf-headmain">
          <h1>{BIZ.name} <span className="cf-live"><i />Live</span></h1>
          <p>Follow a call across the line, left to right · {BIZ.number}</p>
        </div>
        <div className="cf-headact">
          <button className="btn btn-secondary sm"><Icon name="phone" />Test call</button>
          <button className="btn btn-primary sm"><Icon name="check" />Saved</button>
        </div>
      </header>

      <div className="cf-body">
        <div className="b-wrap">
          <div className="b-cols">

            {/* 1 - Incoming */}
            <div className="b-col">
              <div className="b-colhead"><span className="b-step">1</span><b>Incoming</b></div>
              <div className="b-stack">
                <div className="b-card">
                  <div className="b-cardtop">
                    <span className="cf-tile is-ext"><Icon name="phone" /></span>
                    <div className="ct"><b className="b-num">{BIZ.number}</b><span>Business line</span></div>
                  </div>
                </div>
                <div className="b-card muted">
                  <div className="b-cardtop">
                    <span className="cf-tile is-menu"><Icon name="clock" /></span>
                    <div className="ct"><b>Open hours</b><span>{BIZ.hours}</span></div>
                  </div>
                  <div className="b-sub">After hours → closed greeting + voicemail.</div>
                </div>
              </div>
            </div>

            {/* 2 - Greeting */}
            <div className="b-col">
              <div className="b-colhead"><span className="b-step">2</span><b>Greeting</b></div>
              <div className="b-stack">
                <div className="b-card">
                  <div className="b-cardtop">
                    <span className="cf-tile is-ext"><Icon name="audiolines" /></span>
                    <div className="ct"><b>Main greeting</b><span>AI voice · {GREETING.dur}</span></div>
                  </div>
                  <div className="b-sub">“{GREETING.text}”</div>
                  <div style={{ marginTop: 10 }}><CFAudio dur={GREETING.dur} /></div>
                </div>
                <div className="b-card muted">
                  <div className="b-cardtop">
                    <span className="cf-tile is-vm"><Icon name="sparkle" /></span>
                    <div className="ct"><b>After-hours greeting</b><span>Plays when closed</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 - Press a key */}
            <div className="b-col">
              <div className="b-colhead"><span className="b-step">3</span><b>Press a key</b></div>
              <div className="b-stack">
                {OPTIONS.map((x) => (
                  <BKeyRow key={x.key} o={x} sel={sel === x.key} onSel={() => setSel(x.key)} />
                ))}
                <button className="b-add"><Icon name="plus" />Add a key</button>
              </div>
            </div>

            {/* 4 - Who answers (reactive) */}
            <div className="b-col">
              <div className="b-colhead"><span className="b-step">4</span><b>Who answers</b></div>
              <div className="b-stack">
                <div className="b-card">
                  <div className="b-cardtop" style={{ marginBottom: 10 }}>
                    <span className="cf-keybadge">{o.key}</span>
                    <div className="ct"><b>{o.name}</b><span>{tt.label}</span></div>
                  </div>

                  {o.type === 'ext' && (
                    <React.Fragment>
                      <div className="b-strat">
                        <span className="pill on" style={{ fontSize: '.72rem' }}>{o.strategy === 'all' ? 'All at once' : 'In order'}</span>
                        <span className="cf-ringsec">· rings {o.ringSec}s each</span>
                      </div>
                      {o.dests.map((d, i) => (
                        <div className="b-destrow" key={i}>
                          <span className="di"><Icon name={destIcon(d.kind)} /></span>
                          <span className="dn"><b>{d.name}</b><span>{d.sub}</span></span>
                          {d.screen && <span className="a-scr">Announce</span>}
                        </div>
                      ))}
                      <button className="b-add" style={{ marginTop: 8 }}><Icon name="plus" />Add destination</button>
                    </React.Fragment>
                  )}

                  {o.type === 'vm' && (
                    <div className="b-destrow"><span className="di"><Icon name="mic" /></span>
                      <span className="dn"><b>Takes a message</b><span>{o.greeting}</span></span></div>
                  )}
                  {o.type === 'menu' && o.sub.map((s, i) => (
                    <div className="b-destrow" key={i}><span className="di"><Icon name={s.icon} /></span>
                      <span className="dn"><b>{s.label}</b></span></div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 - If no answer (reactive) */}
            <div className="b-col">
              <div className="b-colhead"><span className="b-step">5</span><b>If no answer</b></div>
              <div className="b-stack">
                <div className="b-card">
                  <div className="b-cardtop">
                    <span className="cf-tile is-vm"><Icon name="voicemailbox" /></span>
                    <div className="ct"><b>{o.type === 'vm' ? 'This is the voicemail' : 'Send to voicemail'}</b>
                      <span>{o.type === 'menu' ? 'Repeats the menu' : 'Caller can leave a message'}</span></div>
                  </div>
                </div>
                <div className="b-card">
                  <div className="b-fieldlabel">Notify the team</div>
                  {(o.notify || [{ ch: 'email', to: 'team@bobshvac.com' }]).map((n, i) => {
                    const m = chMeta(n.ch);
                    return (
                      <div className="b-destrow" key={i}>
                        <span className="di"><Icon name={m.icon} /></span>
                        <span className="dn"><b>{m.label}</b><span>{n.to}</span></span>
                        <Toggle sm on onChange={() => { }} />
                      </div>
                    );
                  })}
                  <button className="b-add" style={{ marginTop: 8 }}><Icon name="plus" />Add alert</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OptionB });
