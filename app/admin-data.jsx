/* ============================================================
   Phone System Admin - shared demo data + small helpers
   Tenant: Bob's HVAC · business number (617) 555-0100
   ============================================================ */

const BIZ = {
  name: "Bob's HVAC",
  number: "(617) 555-0100",
  hours: "Mon–Fri · 8:00 AM – 6:00 PM",
  tz: "Eastern time",
};

const GREETING = {
  kind: 'audio', dur: '0:09',
  text: "Thanks for calling Bob's HVAC. To schedule a visit press 1, for an emergency repair press 2, for billing press 3.",
};

const AFTER_HOURS = {
  kind: 'ai',
  text: "You've reached Bob's HVAC after hours. Leave a message and we'll call you first thing in the morning.",
};

/* The menu - what each key does. Mix of extensions, a voicemail box, a submenu. */
const OPTIONS = [
  {
    key: '1', name: 'Schedule Service', type: 'ext', glyph: 'calendar',
    strategy: 'order', ringSec: 20,
    dests: [
      { name: 'Front Office', sub: 'Desk phone', kind: 'desk', screen: false, on: true },
      { name: "Bob's cell", sub: '(617) 555-0142', kind: 'cell', screen: true, on: true },
    ],
    fallback: 'Voicemail',
    schedule: 'Business hours',
    notify: [{ ch: 'slack', to: '#service' }, { ch: 'email', to: 'service@bobshvac.com' }],
  },
  {
    key: '2', name: 'Emergency Repair', type: 'ext', glyph: 'phone',
    strategy: 'all', ringSec: 30,
    dests: [
      { name: 'Bob Stevens', sub: 'JOEL app', kind: 'app', screen: false, on: true },
      { name: 'Dale Ruiz', sub: 'On-call tech · JOEL app', kind: 'app', screen: false, on: true },
    ],
    fallback: 'Voicemail',
    schedule: '24 / 7',
    notify: [{ ch: 'slack', to: '#emergencies' }],
  },
  {
    key: '3', name: 'Billing', type: 'vm', glyph: 'voicemailbox',
    greeting: "You've reached billing. Leave your name and invoice number and we'll call you back.",
    schedule: 'Business hours',
    notify: [{ ch: 'email', to: 'billing@bobshvac.com' }],
  },
  {
    key: '4', name: 'More options', type: 'menu', glyph: 'route',
    sub: [
      { label: 'Text a booking link', icon: 'message' },
      { label: 'Repeat the menu', icon: 'route' },
    ],
  },
];

/* destination device → icon */
function destIcon(kind) {
  return ({ desk: 'monitor', cell: 'smartphone', app: 'appbell', sip: 'phone', person: 'user' })[kind] || 'phone';
}
/* notification channel → icon + label */
function chMeta(ch) {
  return ({
    slack: { icon: 'slack', label: 'Slack' },
    email: { icon: 'mail', label: 'Email' },
    whatsapp: { icon: 'whatsapp', label: 'WhatsApp' },
    sms: { icon: 'message', label: 'Text' },
  })[ch] || { icon: 'bell', label: ch };
}
/* node type → human tag + accent class */
function typeTag(type) {
  return ({
    ext: { label: 'Rings people', cls: 'is-ext' },
    vm: { label: 'Voicemail', cls: 'is-vm' },
    menu: { label: 'Sub-menu', cls: 'is-menu' },
    text: { label: 'Auto-text', cls: 'is-text' },
  })[type] || { label: type, cls: '' };
}
function strategyLabel(o) {
  if (o.type !== 'ext') return typeTag(o.type).label;
  if (!o.dests || !o.dests.length) return 'No one yet';
  if (o.dests.length === 1) return o.dests[0].name;
  return o.strategy === 'all' ? `Rings ${o.dests.length} at once` : `Rings ${o.dests.length} in order`;
}

Object.assign(window, { BIZ, GREETING, AFTER_HOURS, OPTIONS, destIcon, chMeta, typeTag, strategyLabel });
