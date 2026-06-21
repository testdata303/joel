/* ============================================================
   JOEL - Text notifications (literal, Slack-central controls)
   Owned by the SMS Inbox.
   ============================================================ */
const { useState: NS_useState, useRef: NS_useRef, useEffect: NS_useEffect } = React;
const NSIcon = window.Icon;
const NSToggle = window.Toggle;

const NS_CHANNELS = ['#customer-texts', '#support', '#front-desk', '#general'];
const NS_USERS = [
{ name: 'Bob Stevens', email: 'bob@smilebar.co', phone: '(617) 555-0142' },
{ name: 'Jane Rivera', email: 'jane@smilebar.co', phone: '(617) 555-0143' },
{ name: 'Mara Lopez', email: 'mara@smilebar.co', phone: '(617) 555-0144' },
{ name: 'Daniel Kim', email: 'daniel@smilebar.co', phone: '(617) 555-0145' }];

// who can be assigned, with the personal channels they chose + whether they've linked Slack
const NS_ASSIGNEES = [
{ name: 'Jane Rivera', init: 'JR', channels: ['In‑app', 'Slack DM'], slack: 'linked' },
{ name: 'Bob Stevens', init: 'BS', channels: ['In‑app', 'Email'], slack: 'linked' },
{ name: 'Mara Lopez', init: 'ML', channels: ['In‑app', 'Email'], slack: 'unlinked' }];


/* channel dropdown */
function NSChannel({ value, onChange }) {
  return (
    <label className="sn-select ns-chan">
      <NSIcon name="slack" />
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {NS_CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <NSIcon name="chevdown" />
    </label>);

}

/* a row: "Post to Slack" toggle + channel (when on) */
function NSSlackRow({ label, sub, value, onToggle, onChannel }) {
  return (
    <div className="ns-row">
      <div className="ns-row-l">
        <span className="ns-row-ic slack"><NSIcon name="slack" /></span>
        <div className="ns-row-t"><b>{label}</b>{sub && <span>{sub}</span>}</div>
      </div>
      <div className="ns-row-r">
        {value.on && <NSChannel value={value.channel} onChange={onChannel} />}
        <NSToggle on={value.on} onChange={onToggle} />
      </div>
    </div>);

}

/* chips + add-menu for users (email or text). kind: 'email' | 'phone' */
function NSUsers({ icon, label, sub, kind, items, onChange }) {
  const [open, setOpen] = NS_useState(false);
  const [num, setNum] = NS_useState('');
  const ref = NS_useRef(null);
  NS_useEffect(() => {if (!open) return;const h = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};document.addEventListener('mousedown', h);return () => document.removeEventListener('mousedown', h);}, [open]);
  const avail = NS_USERS.filter((u) => !items.includes(u.name));
  const detail = (name) => {const u = NS_USERS.find((x) => x.name === name);return u ? kind === 'email' ? u.email : u.phone : name;};
  const addNum = () => {const v = num.trim();if (!v) return;if (!items.includes(v)) onChange([...items, v]);setNum('');};
  return (
    <div className="ns-row ns-users">
      <div className="ns-row-l">
        <span className={`ns-row-ic ${kind === 'email' ? 'mail' : 'sms'}`}><NSIcon name={icon} /></span>
        <div className="ns-row-t"><b>{label}</b>{sub && <span>{sub}</span>}</div>
      </div>
      <div className="ns-users-r">
        <div className="ns-chips">
          {items.map((it) =>
          <span className="ns-chip" key={it}>
              <span className="ns-chip-nm">{it}</span><span className="ns-chip-dt">{detail(it)}</span>
              <button onClick={() => onChange(items.filter((x) => x !== it))} aria-label="Remove"><NSIcon name="x" /></button>
            </span>
          )}
          <div className="ns-add" ref={ref}>
            <button className="ns-addbtn" onClick={() => setOpen((o) => !o)}><NSIcon name="plus" /> Add</button>
            {open &&
            <div className="ns-addmenu">
                {avail.length > 0 && <div className="ns-addmenu-h">Teammates</div>}
                {avail.map((u) =>
              <button key={u.name} className="ns-addopt" onClick={() => {onChange([...items, u.name]);setOpen(false);}}>
                    <span className="ns-addopt-av">{u.name.split(' ').map((s) => s[0]).join('')}</span>
                    <span className="ns-addopt-t"><b>{u.name}</b><span>{kind === 'email' ? u.email : u.phone}</span></span>
                  </button>
              )}
                {avail.length === 0 && <div className="ns-addmenu-empty">Everyone’s added.</div>}
                {kind === 'phone' &&
              <div className="ns-addnum">
                    <input className="ns-addnum-in" value={num} placeholder="Add a phone number…" onChange={(e) => setNum(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault();addNum();}}} />
                    <button className="ns-addnum-go" onClick={addNum} disabled={!num.trim()}>Add</button>
                  </div>
              }
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}

function NSWebhook({ value, onChange, events }) {
  const [show, setShow] = NS_useState(false);
  const payload = `{
  "event": "${value.event}",
  "conversation_id": "cnv_8fa2",
  "from": "+1 (415) 555-0182",
  "to": "+1 (617) 555-0100",
  "body": "Hi! Can I confirm my appointment?",
  "received_at": "2026-06-07T14:03:22-05:00"
}`;
  return (
    <div className="ns-row ns-webhook">
      <div className="ns-row-l">
        <span className="ns-row-ic hook"><NSIcon name="webhook" /></span>
        <div className="ns-row-t"><b>Send a webhook</b><span>POST this event to your own endpoint.</span></div>
      </div>
      <div className="ns-row-r"><NSToggle on={value.on} onChange={(v) => onChange({ on: v })} /></div>
      {value.on &&
      <div className="ns-hookcfg">
          <label className="ns-hookfield"><span>Endpoint URL</span><input className="ns-addnum-in" value={value.url} placeholder="https://api.yoursite.com/joel-hook" onChange={(e) => onChange({ url: e.target.value })} /></label>
          <label className="ns-hookfield"><span>Event</span>
            <span className="sn-select ns-chan"><NSIcon name="webhook" />
              <select value={value.event} onChange={(e) => onChange({ event: e.target.value })}>{events.map((ev) => <option key={ev} value={ev}>{ev}</option>)}</select>
              <NSIcon name="chevdown" />
            </span>
          </label>
          <button className="ns-hooktoggle" onClick={() => setShow((s) => !s)}><NSIcon name="chevdown" style={{ transform: show ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} /> {show ? 'Hide' : 'Preview'} example payload</button>
          {show && <pre className="ns-hookpre">{payload}</pre>}
        </div>
      }
    </div>);

}

function SmsNotifications({ onBack }) {
  const [neu, setNeu] = NS_useState({ slack: { on: true, channel: '#customer-texts' }, email: [], text: [], webhook: { on: false, url: '', event: 'message.received' } });
  const [rep, setRep] = NS_useState({ assigned: true, solo: true });
  const [un, setUn] = NS_useState({ after: '30', slack: { on: true, channel: '#customer-texts' }, email: [], text: [] });

  const setNeuSlack = (p) => setNeu((c) => ({ ...c, slack: { ...c.slack, ...p } }));
  const setUnSlack = (p) => setUn((c) => ({ ...c, slack: { ...c.slack, ...p } }));

  const linkedCount = NS_ASSIGNEES.filter((u) => u.slack === 'linked').length;

  // plain-English summary
  const newDest = [neu.slack.on ? neu.slack.channel : null, neu.email.length ? `email ${neu.email.length}` : null, neu.text.length ? `text ${neu.text.length}` : null].filter(Boolean);
  const sLine1 = neu.slack.on ? `New texts post to ${neu.slack.channel}${neu.email.length || neu.text.length ? ' and notify your chosen people' : ''}.` : neu.email.length || neu.text.length ? 'New texts notify your chosen people.' : 'New texts aren’t announced anywhere yet.';
  const sLine2 = rep.assigned ? 'Customer replies notify whoever’s assigned, the way they set up their own profile.' : 'Replies aren’t routed to anyone in particular.';
  const sLine3 = un.after === '0' ? 'No reminders for unanswered texts.' : `Unanswered texts remind ${un.slack.on ? un.slack.channel : 'your chosen people'} after ${un.after === '60' ? '1 hour' : un.after + ' minutes'}.`;

  return (
    <div className="sn">
      <div className="sn-top">
        <button className="sn-back" onClick={onBack}><NSIcon name="arrowleft" /> Inbox</button>
        <div className="sn-head">
          <h1>Text notifications</h1>
          <p>Choose where new texts and replies should go.</p>
        </div>
      </div>

      {/* 1 - new texts */}
      <section className="ns-sec">
        <div className="ns-seclabel">When a new text comes in</div>
        <div className="sn-card ns-card">
          <NSSlackRow label="Post to Slack" value={neu.slack} onToggle={(v) => setNeuSlack({ on: v })} onChannel={(c) => setNeuSlack({ channel: c })} />
          <NSUsers icon="mail" label="Email these users" kind="email" items={neu.email} onChange={(v) => setNeu((c) => ({ ...c, email: v }))} />
          <NSUsers icon="message" label="Text these users" kind="phone" items={neu.text} onChange={(v) => setNeu((c) => ({ ...c, text: v }))} />
          <NSWebhook value={neu.webhook} onChange={(p) => setNeu((c) => ({ ...c, webhook: { ...c.webhook, ...p } }))} events={['message.received', 'conversation.created']} />
        </div>
        <p className="ns-help"><NSIcon name="info" /> New texts are unassigned until someone replies or assigns the conversation.</p>
      </section>

      {/* 2 - assigned conversation */}
      <section className="ns-sec">
        <div className="ns-seclabel">When a conversation is assigned to a teammate</div>
        <div className="sn-card ns-card">
          <div className="ns-row ns-assigned">
            <div className="ns-row-l"><span className="ns-row-ic user"><NSIcon name="user" /></span><div className="ns-row-t"><b>Notify the assigned teammate</b><span>Whoever’s handling it hears about new replies - the way they set up their own profile. Nothing to pick per conversation.</span></div></div>
            <div className="ns-row-r"><NSToggle on={rep.assigned} onChange={(v) => setRep((c) => ({ ...c, assigned: v }))} /></div>
          </div>
          {rep.assigned &&
          <React.Fragment>
              <div className="ns-row">
                <div className="ns-row-l"><span className="ns-row-ic solo"><NSIcon name="bell" /></span><div className="ns-row-t"><b>Once assigned, alert only the assignee</b><span>When someone takes a conversation, JOEL stops pinging the shared channel and the rest of the team - only the assignee hears about new replies. Avoids notification chaos.</span></div></div>
                <div className="ns-row-r"><NSToggle on={rep.solo} onChange={(v) => setRep((c) => ({ ...c, solo: v }))} /></div>
              </div>
              <div className="ns-prefnote">
                <div className="ns-prefnote-h"><NSIcon name="user" /> Each teammate is reached the way they chose</div>
                <div className="ns-team">
                  {NS_ASSIGNEES.map((u) =>
                <div className="ns-team-row" key={u.name}>
                      <span className="ns-prefex-av">{u.init}</span>
                      <span className="ns-team-nm">{u.name}</span>
                      <span className="ns-team-ch">{u.channels.join(' · ')}</span>
                      {u.slack === 'linked' ?
                  <span className="ns-slack-pill ok"><NSIcon name="slack" /> Slack linked</span> :
                  <span className="ns-slack-pill no"><NSIcon name="slack" /> Slack not linked</span>}
                    </div>
                )}
                </div>
                <span className="ns-prefnote-link">They control this under <b>My Settings → Notifications</b> - admins don’t set it per person.</span>
              </div>

              <div className="ns-slackexp">
                <span className="ns-slackexp-ic"><NSIcon name="slack" /></span>
                <div className="ns-slackexp-b">
                  <b>Getting a personal Slack message</b>
                  <p>A Slack DM reaches a teammate only after they link their own Slack - one tap in their notification settings. You connect the workspace and shared channels under <b>Settings → Integrations</b>; each person links their personal account themselves, so JOEL never needs you to type anyone’s Slack username.</p>
                  <div className="ns-slackexp-foot">
                    <span>{linkedCount} of {NS_ASSIGNEES.length} teammates have linked Slack</span>
                    <button className="btn btn-secondary sm"><NSIcon name="mail" /> Remind the rest</button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          }
        </div>
        <p className="ns-help"><NSIcon name="info" /> {rep.solo ? 'Once someone’s assigned, JOEL keeps it personal - no channel-wide pings for every reply.' : 'New replies still post to the shared channel even after someone’s assigned - turn on the setting above to keep it to the assignee.'}</p>
      </section>

      {/* 3 - unanswered */}
      <section className="ns-sec">
        <div className="ns-seclabel">If a new text isn’t answered</div>
        <div className="sn-card ns-card">
          <div className="ns-row ns-remind">
            <div className="ns-row-l"><span className="ns-row-ic amber"><NSIcon name="clock" /></span><div className="ns-row-t"><b>Send a reminder after</b></div></div>
            <div className="sn-seg">
              {[['0', 'No reminder'], ['15', '15 min'], ['30', '30 min'], ['60', '1 hour']].map(([v, l]) =>
              <button key={v} className={`sn-seg-b${un.after === v ? ' on' : ''}`} onClick={() => setUn((c) => ({ ...c, after: v }))}>{l}</button>
              )}
            </div>
          </div>
          {un.after !== '0' &&
          <React.Fragment>
              <NSSlackRow label="Remind in Slack" value={un.slack} onToggle={(v) => setUnSlack({ on: v })} onChannel={(c) => setUnSlack({ channel: c })} />
              <NSUsers icon="mail" label="Email these users" kind="email" items={un.email} onChange={(v) => setUn((c) => ({ ...c, email: v }))} />
              <NSUsers icon="message" label="Text these users" kind="phone" items={un.text} onChange={(v) => setUn((c) => ({ ...c, text: v }))} />
            </React.Fragment>
          }
        </div>
      </section>

      {/* summary */}
      <div className="ns-summary">
        <div className="ns-sum-h"><NSIcon name="check" sw={3} /> Here’s the plan</div>
        <ul>
          <li>{sLine1}</li>
          <li>{sLine2}</li>
          <li>{sLine3}</li>
        </ul>
      </div>

      <div className="sn-footer">
        <span className="sn-foot-summary">Changes apply to your shared text inbox.</span>
        <button className="btn btn-primary" onClick={onBack}>Save</button>
      </div>
    </div>);

}

window.SmsNotifications = SmsNotifications;