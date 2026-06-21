/* Option A - Caller Journey: a calm top-to-bottom spine of the whole flow. */

function CFAudio({ dur }) {
  const bars = [7, 12, 16, 9, 14, 6, 11, 15, 8, 13, 5, 10, 14, 7];
  return (
    <span className="cf-audio">
      <span className="cf-play"><Icon name="play" /></span>
      <span className="cf-bars">{bars.map((h, i) => <i key={i} style={{ height: h }} />)}</span>
      <span className="cf-dur">{dur}</span>
    </span>
  );
}

function AOption({ o, sel, onSel }) {
  const tt = typeTag(o.type);
  const [on, setOn] = useState(true);
  return (
    <div className="a-opt">
      <div className={`a-optcard${sel ? ' sel' : ''}`}>
        <div className="a-opthead" role="button" tabIndex={0} onClick={onSel}>
          <span className="cf-keybadge">{o.key}</span>
          <span className={`cf-tile ${tt.cls}`}><Icon name={o.glyph} /></span>
          <span className="nm"><b>{o.name}</b><span>{strategyLabel(o)}</span></span>
          <span className="a-opttail">
            <span className={`cf-typetag ${tt.cls}`}>{tt.label}</span>
            <Toggle sm on={on} onChange={setOn} />
            <span className="cf-grip"><Icon name="grip" /></span>
          </span>
        </div>

        {o.type === 'ext' && (
          <React.Fragment>
            <div className="a-dests">
              {o.dests.map((d, i) => (
                <div className="a-dest" key={i}>
                  <span className="di"><Icon name={destIcon(d.kind)} /></span>
                  <span className="dn"><b>{d.name}</b><span>{d.sub}</span></span>
                  {d.screen && <span className="a-scr">Announce</span>}
                  <span className="cf-ringsec">{o.strategy === 'all' ? 'rings now' : `${o.ringSec}s`}</span>
                </div>
              ))}
            </div>
            <div className="a-optfoot">
              <span className="a-fk"><b>{o.strategy === 'all' ? 'All at once' : 'In order'}</b></span>
              <span className="a-fk">· no answer → <b>{o.fallback}</b></span>
              <span style={{ flex: 1 }} />
              <span className="cf-notify">
                {o.notify.map((n, i) => {
                  const m = chMeta(n.ch);
                  return <span className="cf-nchip" key={i}><Icon name={m.icon} />{n.to}</span>;
                })}
              </span>
            </div>
          </React.Fragment>
        )}

        {o.type === 'vm' && (
          <div className="a-dests" style={{ paddingBottom: 12 }}>
            <div className="a-dest">
              <span className="di"><Icon name="mic" /></span>
              <span className="dn"><b>Takes a message</b><span>{o.greeting}</span></span>
              <span className="cf-nchip"><Icon name="mail" />{o.notify[0].to}</span>
            </div>
          </div>
        )}

        {o.type === 'menu' && (
          <div className="a-dests" style={{ paddingBottom: 12 }}>
            {o.sub.map((s, i) => (
              <div className="a-dest" key={i}>
                <span className="di"><Icon name={s.icon} /></span>
                <span className="dn"><b>{s.label}</b></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OptionA() {
  const [sel, setSel] = useState('1');
  return (
    <div className="cf-board">
      <header className="cf-head">
        <span className="cf-bizmark"><Icon name="phone" /></span>
        <div className="cf-headmain">
          <h1>{BIZ.name} <span className="cf-live"><i />Live</span></h1>
          <p>What callers hear when they dial {BIZ.number}</p>
        </div>
        <div className="cf-headact">
          <button className="btn btn-secondary sm"><Icon name="phone" />Test call</button>
          <button className="btn btn-primary sm"><Icon name="check" />Saved</button>
        </div>
      </header>

      <div className="cf-body">
        <div className="a-scroll">
          <div className="a-col">
            <div className="a-incoming">
              <span className="ph"><Icon name="phone" /></span>
              <div style={{ minWidth: 0 }}><span>Incoming call</span><b>{BIZ.number}</b></div>
            </div>
            <div className="a-stem" />

            {/* Greeting + hours */}
            <div className="a-node">
              <div className="a-card-h">
                <span className="cf-tile is-ext"><Icon name="audiolines" /></span>
                <div className="cf-headmain"><h2>Main greeting</h2></div>
                <button className="a-edit"><Icon name="pencil" />Edit</button>
              </div>
              <div className="a-card-b">
                <div className="a-meta"><CFAudio dur={GREETING.dur} /><span className="cf-aichip"><Icon name="sparkle" />AI voice</span></div>
                <div className="a-greettext">“{GREETING.text}”</div>
                <div className="a-hours"><Icon name="clock" /> {BIZ.hours} · {BIZ.tz}</div>
              </div>
            </div>
            <div className="a-stem" />

            <div className="a-menulabel">
              <b>Caller presses a key</b>
              <span>Drag to reorder · toggle a key off to skip it</span>
            </div>

            <div className="a-branch">
              {OPTIONS.map((o) => (
                <AOption key={o.key} o={o} sel={sel === o.key} onSel={() => setSel(o.key)} />
              ))}
              <button className="a-add"><Icon name="plus" />Add a key</button>
            </div>

            <div className="a-stem dotted" />
            <div className="a-fallback">
              <span className="fi"><Icon name="voicemailbox" /></span>
              <div className="ft"><b>If no key is pressed</b><span>After {GREETING.dur} → Billing voicemail · after hours uses the closed greeting</span></div>
              <button className="a-edit"><Icon name="pencil" />Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OptionA, CFAudio });
