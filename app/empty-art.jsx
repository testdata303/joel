/* ============================================================
   AnyPhone app - EmptyArt: friendly monoline empty-state illustrations
   (Direction B "soft duotone": ink line art + one accent + tonal
   shape behind). One system, reused across every empty/welcome pane.

   Usage:  <EmptyArt name="sms" />   names: sms | flow | voicemail
   Props:  name, size (px, default 120), soft (tonal shape, default true)
   ============================================================ */
const EA_PALETTE = {
  sms:       { accent:'#2540ee', soft:'#dfe5ff' }, // indigo - messages
  flow:      { accent:'#6b2fe8', soft:'#ece2ff' }, // purple - greeting/voice
  voicemail: { accent:'#1bb56a', soft:'#d8f1e4' }, // green  - all caught up
};
const EA_STROKE = '#10131a';
const EA_W = 2.4;

function EmptyArt({ name = 'sms', size = 120, soft = true }){
  const cfg = EA_PALETTE[name] || EA_PALETTE.sms;
  const S = EA_STROKE, W = EA_W, A = cfg.accent;
  return (
    <svg className="empty-art" width={size} height={size} viewBox="0 0 128 128" fill="none"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {soft ? (
        <path d="M64 14c26 0 46 14 46 44 0 30-20 52-46 52S18 88 18 58 38 14 64 14Z" fill={cfg.soft}></path>
      ) : null}

      {name === 'sms' ? (
        <g stroke={S} strokeWidth={W}>
          <path d="M40 42h44a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H62l-12 11v-11h-10a8 8 0 0 1-8-8V50a8 8 0 0 1 8-8Z" stroke={A}></path>
          <circle cx="54" cy="60" r="2.4" fill={A} stroke="none"></circle>
          <circle cx="64" cy="60" r="2.4" fill={A} stroke="none"></circle>
          <circle cx="74" cy="60" r="2.4" fill={A} stroke="none"></circle>
          <path d="M30 64h26a7 7 0 0 1 7 7v9a7 7 0 0 1-7 7H44l-9 8v-8h-5a7 7 0 0 1-7-7v-9a7 7 0 0 1 7-7Z" fill="#fff"></path>
        </g>
      ) : null}

      {name === 'flow' ? (
        <g stroke={S} strokeWidth={W}>
          <path d="M64 65v8"></path>
          <path d="M64 73C64 83 51 82 41 88"></path>
          <path d="M64 73C64 83 77 82 87 88"></path>
          <circle cx="64" cy="46" r="19" fill="#fff"></circle>
          <g transform="translate(54.4 36.4) scale(0.8)" stroke={A} vectorEffect="non-scaling-stroke">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </g>
          <path d="M80 30q6.5 0 7 7" stroke={A}></path>
          <path d="M85 24q12 0 12.5 13" stroke={A}></path>
          <rect x="30" y="88" width="22" height="16" rx="5" fill="#fff"></rect>
          <rect x="76" y="88" width="22" height="16" rx="5" fill="#fff"></rect>
        </g>
      ) : null}

      {name === 'voicemail' ? (
        <g stroke={S} strokeWidth={W}>
          <rect x="26" y="44" width="76" height="40" rx="11" fill="#fff"></rect>
          <circle cx="44" cy="64" r="10" fill={A} stroke={A}></circle>
          <path d="M41 60l7 4-7 4Z" fill="#fff" stroke="#fff"></path>
          <path d="M62 58v12M70 54v20M78 60v8M86 56v16M94 62v4"></path>
        </g>
      ) : null}
    </svg>
  );
}

Object.assign(window, { EmptyArt });
