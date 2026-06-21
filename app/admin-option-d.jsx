/* Option D - Visual Hierarchy: one bold hero, one dominant routing block,
   secondary settings demoted to a quiet grid. Scale + color do the work. */

function summaryFor(o) {
  if (o.type === 'ext') {
    const names = o.dests.map((d) => d.name);
    if (o.strategy === 'all') {
      return <React.Fragment>Rings <b>all {names.length}</b> at once for {o.ringSec}s. No answer goes to <b>{o.fallback.toLowerCase()}</b>.</React.Fragment>;
    }
    return <React.Fragment>Rings <b>{names[0]}</b>, then <b>{names[1] || 'voicemail'}</b> - {o.ringSec}s each. No answer goes to <b>{o.fallback.toLowerCase()}</b>.</React.Fragment>;
  }
  if (o.type === 'vm') return <React.Fragment>Sends callers <b>straight to voicemail</b>. Messages land in <b>{o.notify[0].to}</b>.</React.Fragment>;
  if (o.type === 'menu') return <React.Fragment>Opens a <b>sub-menu</b> with {o.sub.length} more options for the caller.</React.Fragment>;
  return null;
}

function DPrimary({ o }) {
  if (o.type === 'ext') {
    const seq = o.strategy === 'order';
    return (
      <section className="d-primary">
        <div className="d-primhead">
          <div>
            <div className="eb">The important part</div>
            <h3>Who rings when callers press {o.key}</h3>
          </div>
          <span className="sp" />
          <span className="d-stratpill"><Icon name={seq ? 'route' : 'activity'} />{seq ? 'In order · one at a time' : 'All at once'}</span>
        </div>
        <div className={`d-ringline ${seq ? 'seq' : 'par'}`}>
          {o.dests.map((d, i) => (
            <div className="d-ringstep" key={i}>
              <span className="d-stepnum">{seq ? i + 1 : '•'}</span>
              <div className="d-devcard">
                <span className="d-devtile"><Icon name={destIcon(d.kind)} /></span>
                <span className="d-devname"><b>{d.name}</b><span>{d.sub}</span></span>
                <span className="d-rings"><Icon name="clock" />{seq ? `rings ${o.ringSec}s` : `${o.ringSec}s`}</span>
                <span className="d-announce"><Toggle sm on={d.screen} onChange={() => { }} />Announce</span>
              </div>
            </div>
          ))}
          <button className="d-addbtn"><Icon name="plus" />Add a destination</button>
        </div>
      </section>
    );
  }
  if (o.type === 'vm') {
    return (
      <section className="d-primary">
        <div className="d-primhead">
          <div>
            <div className="eb">The important part</div>
            <h3>What the caller hears</h3>
          </div>
        </div>
        <div className="d-ringline">
          <div className="d-ringstep">
            <span className="d-stepnum" style={{ borderRadius: 12 }}><Icon name="mic" /></span>
            <div className="d-devcard">
              <span className="d-devtile vm"><Icon name="voicemailbox" /></span>
              <span className="d-devname"><b>Takes a message</b><span>Caller can record after the tone</span></span>
              <span className="cf-aichip"><Icon name="sparkle" />AI voice</span>
            </div>
          </div>
        </div>
        <div className="d-quote">“{o.greeting}”</div>
      </section>
    );
  }
  // menu
  return (
    <section className="d-primary">
      <div className="d-primhead">
        <div>
          <div className="eb">The important part</div>
          <h3>Sub-menu options</h3>
        </div>
      </div>
      <div className="d-ringline seq">
        {o.sub.map((s, i) => (
          <div className="d-ringstep" key={i}>
            <span className="d-stepnum">{i + 1}</span>
            <div className="d-devcard">
              <span className="d-devtile menu"><Icon name={s.icon} /></span>
              <span className="d-devname"><b>{s.label}</b></span>
            </div>
          </div>
        ))}
        <button className="d-addbtn"><Icon name="plus" />Add an option</button>
      </div>
    </section>
  );
}

function DSecondary({ o }) {
  const notify = o.notify || [];
  return (
    <React.Fragment>
      <div className="d-seclabel">Then the plumbing</div>
      <div className="d-secgrid">
        {o.type !== 'menu' && (
          <div className="d-mini">
            <span className="mic"><Icon name="voicemailbox" /></span>
            <span className="mt"><span className="meb">If no answer</span><b>{o.type === 'vm' ? 'Already voicemail' : `Send to ${(o.fallback || 'voicemail').toLowerCase()}`}</b></span>
          </div>
        )}
        <div className="d-mini">
          <span className="mic"><Icon name="calendar" /></span>
          <span className="mt"><span className="meb">Active schedule</span><b>{o.schedule || 'Always on'}</b></span>
          <span className="pill on">On</span>
        </div>
        <div className="d-mini wide">
          <span className="mic"><Icon name="bell" /></span>
          <span className="mt"><span className="meb">Notify the team</span>
            <span className="d-nchips" style={{ marginTop: 4 }}>
              {notify.length ? notify.map((n, i) => {
                const m = chMeta(n.ch);
                return <span className="cf-nchip" key={i}><Icon name={m.icon} />{n.to}</span>;
              }) : <span style={{ fontSize: '.78rem', color: 'var(--muted)' }}>No alerts yet</span>}
              <span className="cf-nchip" style={{ color: 'var(--muted)', borderStyle: 'dashed' }}><Icon name="plus" />Add</span>
            </span>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}

function OptionD() {
  const [sel, setSel] = useState('1');
  const o = OPTIONS.find((x) => x.key === sel);
  const tt = typeTag(o.type);

  return (
    <div className="cf-board">
      <header className="cf-head">
        <span className="cf-bizmark"><Icon name="phone" /></span>
        <div className="cf-headmain">
          <h1>{BIZ.name} <span className="cf-live"><i />Live</span></h1>
          <p>Editing the menu · {BIZ.number}</p>
        </div>
        <div className="cf-headact">
          <button className="btn btn-secondary sm"><Icon name="phone" />Test call</button>
        </div>
      </header>

      <div className="cf-body">
        <div className="d-wrap">
          {/* key switcher */}
          <div className="d-keyrail">
            {OPTIONS.map((x) => (
              <button className={`d-keychip${sel === x.key ? ' sel' : ''}`} key={x.key} onClick={() => setSel(x.key)}>
                <span className="kk">{x.key}</span><span className="kl">{x.name}</span>
              </button>
            ))}
          </div>

          {/* HERO */}
          <div className="d-hero">
            <span className="d-herokey">{o.key}</span>
            <div className="d-herotext">
              <div className="crumb">Main number · Menu</div>
              <h2>{o.name}</h2>
              <p className="d-summary">{summaryFor(o)}</p>
            </div>
            <span className="d-herotag"><Icon name={o.type === 'ext' ? 'users' : o.type === 'vm' ? 'voicemailbox' : 'route'} style={{ width: 13, height: 13 }} />{tt.label}</span>
          </div>

          {/* PRIMARY */}
          <DPrimary o={o} />

          {/* SECONDARY */}
          <DSecondary o={o} />
        </div>
      </div>

      <div className="cf-savebar">
        <span className="sv-dot"><i />All changes saved</span>
        <span className="sp" style={{ flex: 1 }} />
        <button className="btn btn-secondary sm">Discard</button>
        <button className="btn btn-primary sm"><Icon name="check" />Save</button>
      </div>
    </div>
  );
}

Object.assign(window, { OptionD });
