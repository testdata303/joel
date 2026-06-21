/* Option C - Outline + Inspector: the whole system as a tree on the left,
   a real editor for the selected node on the right. */

function CNode({ icoCls, ico, keytag, title, meta, status, child, last, sel, onSel }) {
  return (
    <button className={`c-node${child ? ' child' : ''}${last ? ' last' : ''}${sel ? ' sel' : ''}`} onClick={onSel}>
      {keytag ? <span className="c-keytag">{keytag}</span>
        : <span className={`c-ico ${icoCls}`}><Icon name={ico} /></span>}
      <span className="c-cn"><b>{title}</b>{meta && <span>{meta}</span>}</span>
      {status && <span className={`c-statusdot ${status}`} />}
    </button>
  );
}

/* ---- inspector bodies ---- */
function InspExt({ o }) {
  const tt = typeTag(o.type);
  return (
    <React.Fragment>
      <div className="c-sec">
        <div className="c-sec-h"><Icon name="user" style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>What this key is called</b></div>
        <div className="c-sec-b">
          <div className="c-fieldrow"><input className="c-input" defaultValue={o.name} /><span className="cf-typetag is-ext">Key {o.key}</span></div>
        </div>
      </div>

      <div className="c-sec">
        <div className="c-sec-h"><Icon name="route" style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>When this key is pressed, ring…</b><span className="cf-eyebrow">{o.dests.length} destinations</span></div>
        <div className="c-sec-b">
          <div className="c-strat">
            <div className={`c-stratbtn${o.strategy === 'order' ? ' on' : ''}`}>In order<span>One at a time</span></div>
            <div className={`c-stratbtn${o.strategy === 'all' ? ' on' : ''}`}>All at once<span>Everyone rings</span></div>
            <div className="c-stratbtn">Round-robin<span>Take turns</span></div>
          </div>
          <div style={{ marginTop: 14 }}>
            {o.dests.map((d, i) => (
              <div className="c-destrow" key={i}>
                <span className="cf-grip"><Icon name="grip" /></span>
                <span className="di"><Icon name={destIcon(d.kind)} /></span>
                <span className="dn"><b>{d.name}</b><span>{d.sub}</span></span>
                <span className="c-destctl">
                  <span className="c-scrtog"><Toggle sm on={d.screen} onChange={() => { }} />Announce</span>
                  <span className="cf-ringsec">{o.ringSec}s</span>
                  <button className="btn-ghost" style={{ color: 'var(--muted)', padding: 4 }}><Icon name="kebab" /></button>
                </span>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary sm" style={{ marginTop: 4 }}><Icon name="plus" />Add a destination</button>
        </div>
      </div>

      <div className="c-sec">
        <div className="c-sec-h"><Icon name="clock" style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>Fallbacks & schedule</b></div>
        <div className="c-sec-b" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <div className="c-kv"><span className="kvic"><Icon name="voicemailbox" /></span>
            <span className="kvt"><b>If no one answers</b><span>Send to {o.fallback.toLowerCase()}</span></span>
            <span className="pill ext">{o.fallback}</span></div>
          <div className="c-kv"><span className="kvic"><Icon name="calendar" /></span>
            <span className="kvt"><b>Active schedule</b><span>{o.schedule}</span></span>
            <span className="pill on">On</span></div>
        </div>
      </div>

      <div className="c-sec">
        <div className="c-sec-h"><Icon name="bell" style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>Notify the team</b></div>
        <div className="c-sec-b" style={{ paddingTop: 6, paddingBottom: 6 }}>
          {o.notify.map((n, i) => {
            const m = chMeta(n.ch);
            return (
              <div className="c-kv" key={i}><span className="kvic"><Icon name={m.icon} /></span>
                <span className="kvt"><b>{m.label}</b><span>{n.to}</span></span>
                <Toggle sm on onChange={() => { }} /></div>
            );
          })}
          <div className="c-kv"><span className="kvic"><Icon name="plus" /></span>
            <span className="kvt"><b style={{ color: 'var(--muted)' }}>Add Email, Text, Slack or WhatsApp…</b></span></div>
        </div>
      </div>
    </React.Fragment>
  );
}

function InspSimple({ icon, title, body }) {
  return (
    <div className="c-sec">
      <div className="c-sec-h"><Icon name={icon} style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>{title}</b></div>
      <div className="c-sec-b">{body}</div>
    </div>
  );
}

function OptionC() {
  const [sel, setSel] = useState('1');
  const opt = OPTIONS.find((x) => x.key === sel);

  let crumb = 'Main number', title = '', tt = { label: '', cls: 'is-ext' }, glyph = 'phone', body = null;
  if (sel === 'greeting') {
    title = 'Main greeting'; tt = { label: 'Audio', cls: 'is-ext' }; glyph = 'audiolines';
    body = (
      <React.Fragment>
        <InspSimple icon="audiolines" title="What callers hear first" body={
          <React.Fragment>
            <div className="a-meta" style={{ marginBottom: 12 }}><CFAudio dur={GREETING.dur} /><span className="cf-aichip"><Icon name="sparkle" />AI voice</span></div>
            <div className="a-greettext" style={{ marginTop: 0 }}>“{GREETING.text}”</div>
          </React.Fragment>} />
        <InspSimple icon="sparkle" title="After-hours greeting" body={<div className="a-greettext" style={{ marginTop: 0 }}>“{AFTER_HOURS.text}”</div>} />
      </React.Fragment>
    );
  } else if (sel === 'hours') {
    title = 'Business hours'; tt = { label: 'Schedule', cls: 'is-menu' }; glyph = 'clock';
    body = <InspSimple icon="clock" title="When you're open" body={
      <div className="c-kv" style={{ borderTop: 'none', paddingTop: 0 }}><span className="kvic"><Icon name="calendar" /></span>
        <span className="kvt"><b>{BIZ.hours}</b><span>{BIZ.tz} · after hours routes to voicemail</span></span>
        <span className="pill on">Open now</span></div>} />;
  } else if (sel === 'menu') {
    title = 'Menu - press a key'; tt = { label: 'Sub-menu', cls: 'is-menu' }; glyph = 'route';
    body = (
      <div className="c-sec">
        <div className="c-sec-h"><Icon name="route" style={{ width: 16, height: 16, color: 'var(--muted)' }} /><b>Keys callers can press</b><span className="cf-eyebrow">Drag to reorder</span></div>
        <div className="c-sec-b">
          {OPTIONS.map((x) => (
            <div className="c-destrow" key={x.key}>
              <span className="cf-grip"><Icon name="grip" /></span>
              <span className="cf-keybadge">{x.key}</span>
              <span className="dn" style={{ flex: 1 }}><b>{x.name}</b><span>{strategyLabel(x)}</span></span>
              <span className={`cf-typetag ${typeTag(x.type).cls}`}>{typeTag(x.type).label}</span>
            </div>
          ))}
          <button className="btn btn-secondary sm"><Icon name="plus" />Add a key</button>
        </div>
      </div>
    );
  } else if (sel === 'after') {
    title = 'If no key is pressed'; tt = { label: 'Fallback', cls: 'is-vm' }; glyph = 'voicemailbox';
    body = <InspSimple icon="voicemailbox" title="Catch every caller" body={
      <div className="c-kv" style={{ borderTop: 'none', paddingTop: 0 }}><span className="kvic"><Icon name="voicemailbox" /></span>
        <span className="kvt"><b>Send to Billing voicemail</b><span>After the greeting plays with no keypress</span></span>
        <span className="pill ext">Voicemail</span></div>} />;
  } else {
    crumb = 'Main number · Menu'; title = opt.name; tt = typeTag(opt.type); glyph = opt.glyph;
    body = opt.type === 'ext' ? <InspExt o={opt} />
      : opt.type === 'vm' ? (
        <React.Fragment>
          <InspSimple icon="mic" title="Voicemail greeting" body={<div className="a-greettext" style={{ marginTop: 0 }}>“{opt.greeting}”</div>} />
          <InspSimple icon="bell" title="Where messages go" body={
            <div className="c-kv" style={{ borderTop: 'none', paddingTop: 0 }}><span className="kvic"><Icon name="mail" /></span>
              <span className="kvt"><b>Email</b><span>{opt.notify[0].to}</span></span><Toggle sm on onChange={() => { }} /></div>} />
        </React.Fragment>
      ) : (
        <InspSimple icon="route" title="Sub-menu options" body={opt.sub.map((s, i) => (
          <div className="c-kv" key={i} style={i === 0 ? { borderTop: 'none', paddingTop: 0 } : null}>
            <span className="kvic"><Icon name={s.icon} /></span><span className="kvt"><b>{s.label}</b></span></div>
        ))} />
      );
  }

  return (
    <div className="cf-board">
      <header className="cf-head">
        <span className="cf-bizmark"><Icon name="phone" /></span>
        <div className="cf-headmain">
          <h1>{BIZ.name} <span className="cf-live"><i />Live</span></h1>
          <p>The whole phone system, in one place · {BIZ.number}</p>
        </div>
        <div className="cf-headact">
          <button className="btn btn-secondary sm"><Icon name="phone" />Test call</button>
        </div>
      </header>

      <div className="cf-body">
        <div className="c-wrap">
          {/* tree */}
          <aside className="c-tree">
            <div className="c-treehead">
              <div className="cf-eyebrow">Your phone system</div>
              <div className="c-numline">
                <span className="nm"><Icon name="phone" /></span>
                <div><b>{BIZ.number}</b><span>Business line · Live</span></div>
              </div>
            </div>
            <div className="c-treebody">
              <CNode ico="audiolines" icoCls="cf-tile is-ext" title="Main greeting" meta={`AI voice · ${GREETING.dur}`} sel={sel === 'greeting'} onSel={() => setSel('greeting')} />
              <CNode ico="clock" icoCls="cf-tile is-menu" title="Business hours" meta={BIZ.hours} status="g" sel={sel === 'hours'} onSel={() => setSel('hours')} />
              <CNode ico="route" icoCls="cf-tile is-menu" title="Menu - press a key" meta={`${OPTIONS.length} keys`} sel={sel === 'menu'} onSel={() => setSel('menu')} />
              {OPTIONS.map((x, i) => (
                <CNode key={x.key} keytag={x.key} title={x.name} meta={strategyLabel(x)}
                  status={x.type === 'vm' ? 'a' : 'g'} child last={i === OPTIONS.length - 1}
                  sel={sel === x.key} onSel={() => setSel(x.key)} />
              ))}
              <CNode ico="voicemailbox" icoCls="cf-tile is-vm" title="If no key is pressed" meta="→ Billing voicemail" sel={sel === 'after'} onSel={() => setSel('after')} />
            </div>
          </aside>

          {/* inspector */}
          <section className="c-insp">
            <div className="c-inspbar">
              <span className={`cf-tile ${tt.cls}`}><Icon name={glyph} /></span>
              <div className="c-bc"><div className="crumb">{crumb}</div><h2>{title}</h2></div>
              <span className={`cf-typetag ${tt.cls}`}>{tt.label}</span>
            </div>
            <div className="c-inspbody">{body}</div>
            <div className="cf-savebar">
              <span className="sv-dot"><i />All changes saved</span>
              <span className="sp" style={{ flex: 1 }} />
              <button className="btn btn-secondary sm">Discard</button>
              <button className="btn btn-primary sm"><Icon name="check" />Save</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OptionC });
