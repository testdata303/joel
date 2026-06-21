/* ============================================================
   JOEL app — UI primitives + icon set  (exports to window)
   ============================================================ */
const { useState, useRef, useEffect, useCallback } = React;

/* ---------------- ICONS (lucide-style, 2px stroke) ---------------- */
const ICONS = {
  inbox:'M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  phone:'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384z',
  voicemail:'M6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M18 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8z|line:6,14,18,14',
  hashnum:'M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18',
  layers:'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z M2 12.18a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 .59-.92 M2 17.18a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 .59-.92',
  monitor:'M8 21h8 M12 17v4|rect:2,3,20,14,2',
  smartphone:'|rect:5,2,14,20,2|line:12,18,12.01,18',
  users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75|circle:9,7,4',
  user:'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2|circle:12,7,4',
  ban:'|circle:12,12,10|line:4.93,4.93,19.07,19.07',
  arrowdownleft:'M17 7 7 17 M17 17H7V7',
  arrowupright:'M7 17 17 7 M7 7h10v10',
  flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
  filetext:'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z M14 2v4a2 2 0 0 0 2 2h4 M16 13H8 M16 17H8 M10 9H8',
  sliders:'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  route:'M9 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M9 13V8a3 3 0 0 1 3-3h3',
  disc:'|circle:12,12,10|circle:12,12,3',
  settings:'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z|circle:12,12,3',
  card:'|rect:2,5,20,14,2|line:2,10,22,10',
  search:'M21 21l-4.34-4.34|circle:11,11,8',
  bell:'M10.268 21a2 2 0 0 0 3.464 0 M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326z',
  mail:'M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7|rect:2,4,20,16,2',
  slack:'M9 12a2 2 0 1 1-4 0V5a2 2 0 1 1 4 0z M9 12h7a2 2 0 1 1 0 4H9z|x',
  webhook:'M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2 M6 17l3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06 M12 6l3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8',
  appbell:'M12 8a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2 2 2 0 0 0 2-2v0a2 2 0 0 0-2-2z|rect:5,2,14,20,2',
  check:'M20 6 9 17l-5-5',
  x:'M18 6 6 18 M6 6l12 12',
  plus:'M5 12h14 M12 5v14',
  chevdown:'m6 9 6 6 6-6',
  chevright:'m9 18 6-6-6-6',
  arrowleft:'m12 19-7-7 7-7 M19 12H5',
  kebab:'|circle:12,12,1|circle:12,5,1|circle:12,19,1',
  menu:'M4 6h16 M4 12h16 M4 18h16',
  message:'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  audiolines:'M2 10v3 M6 6v11 M10 3v18 M14 8v7 M18 5v13 M22 10v3',
  activity:'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
  grip:'|circle:9,5,1|circle:9,12,1|circle:9,19,1|circle:15,5,1|circle:15,12,1|circle:15,19,1',
  trash:'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6',
  pencil:'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z M15 5l4 4',
  clock:'|circle:12,12,10|polyline:12,6,12,12,16,14',
  lock:'M7 11V7a5 5 0 0 1 10 0v4|rect:3,11,18,11,2',
  music:'M9 18V5l12-2v13|circle:6,18,3|circle:18,16,3',
  tag:'M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z|circle:7.5,7.5,.5',
  copy:'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2',
  calendar:'M8 2v4 M16 2v4 M3 10h18|rect:3,4,18,18,2',
  play:'M6 3l14 9-14 9z',
  pause:'|rect:6,4,4,16,1|rect:14,4,4,16,1',
  download:'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  archive:'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8 M10 12h4|rect:2,3,20,5,1',
  building:'M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18 M2 22h20 M10 7h4 M10 11h4 M10 15h4',
  info:'|circle:12,12,10|line:12,16,12,12|line:12,8,12.01,8',
  sparkle:'M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z',
  shield:'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
  voicemailbox:'M16 6 4 6 M16 6a4 4 0 1 1 0 8H4a4 4 0 1 1 0-8',
  mic:'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v3',
  forward:'m15 17 5-5-5-5 M4 18v-2a4 4 0 0 1 4-4h12',
  phoneoff:'M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91 M2 2l20 20',
};

function Icon({ name, sw=2, style }){
  const raw = ICONS[name] || '';
  const parts = raw.split('|');
  const els = [];
  parts.forEach((p,i)=>{
    if(!p) return;
    if(p.startsWith('circle:')){const[cx,cy,r]=p.slice(7).split(',');els.push(<circle key={i} cx={cx} cy={cy} r={r}/>);}
    else if(p.startsWith('rect:')){const[x,y,w,h,rr]=p.slice(5).split(',');els.push(<rect key={i} x={x} y={y} width={w} height={h} rx={rr}/>);}
    else if(p.startsWith('line:')){const[x1,y1,x2,y2]=p.slice(5).split(',');els.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2}/>);}
    else if(p.startsWith('polyline:')){els.push(<polyline key={i} points={p.slice(9)}/>);}
    else els.push(<path key={i} d={p}/>);
  });
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw}
         strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">{els}</svg>
  );
}

/* ---------------- primitives ---------------- */
function Toggle({ on, onChange, sm }){
  return <button role="switch" aria-checked={on} className={`toggle${sm?' sm':''}${on?' on':''}`} onClick={()=>onChange(!on)}/>;
}

function Segmented({ value, onChange, options, full }){
  return (
    <div className={`segmented${full?' full':''}`} role="tablist">
      {options.map(o=>(
        <button key={o.value} role="tab" aria-selected={value===o.value}
          className={`seg${value===o.value?' on':''}`} onClick={()=>onChange(o.value)}>
          {o.icon && <Icon name={o.icon}/>}{o.label}
        </button>
      ))}
    </div>
  );
}

function Choice({ on, onClick, title, desc }){
  return (
    <button className={`choice${on?' on':''}`} onClick={onClick} role="radio" aria-checked={on}>
      <span className="radio"/>
      <span className="ctext"><b>{title}</b>{desc && <span>{desc}</span>}</span>
    </button>
  );
}

function Field({ label, help, children, row }){
  return (
    <div className={`field${row?' row-wrap':''}`}>
      {label && <label>{label}</label>}
      {children}
      {help && <div className="help">{help}</div>}
    </div>
  );
}

function Avatar({ name, className='' }){
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return <span className={`avatar ${className}`}>{initials}</span>;
}

function Card({ icon, title, desc, action, children, flush }){
  return (
    <section className="card">
      {(title||icon) && (
        <div className={`card-h${children?'':' noborder'}`}>
          {icon && <span className="h-icon"><Icon name={icon}/></span>}
          <div className="ct"><h3>{title}</h3>{desc && <p>{desc}</p>}</div>
          {action}
        </div>
      )}
      {children && <div className={`card-b${flush?' flush':''}`}>{children}</div>}
    </section>
  );
}

function Modal({ title, desc, icon, onClose, children, footer, wide }){
  useEffect(()=>{
    const h=e=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h);
  },[onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" style={wide?{maxWidth:560}:null} onMouseDown={e=>e.stopPropagation()}>
        <div className="modal-h">
          {icon && <span className="h-icon"><Icon name={icon}/></span>}
          <div className="mt"><h3>{title}</h3>{desc && <p>{desc}</p>}</div>
          <button className="x-btn" onClick={onClose} aria-label="Close"><Icon name="x"/></button>
        </div>
        <div className="modal-b">{children}</div>
        {footer && <div className="modal-f">{footer}</div>}
      </div>
    </div>
  );
}

function Wave({ n=42, playing }){
  const bars = useRef([...Array(n)].map(()=>6+Math.round(Math.random()*22)));
  return (
    <div className="wave">
      {bars.current.map((h,i)=>(
        <i key={i} style={{height:h+'px', background: playing && i< n*0.4 ? 'var(--blue)' : undefined}}/>
      ))}
    </div>
  );
}

/* ---------------- date formatting (Apple-style) ---------------- */
const _TODAY = new Date(2026,5,5); // Jun 5 2026 (fixed "now" for the mock)
const _WD = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const _MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function _midnight(d){ return new Date(d.getFullYear(),d.getMonth(),d.getDate()); }
function _dateOf(when, date){
  if(date) return new Date(date+'T00:00:00');
  const p = String(when||'').split(',')[0].trim();
  if(p==='Today') return _midnight(_TODAY);
  if(p==='Yesterday'){ const d=_midnight(_TODAY); d.setDate(d.getDate()-1); return d; }
  const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p);
  if(wd>=0){ const d=_midnight(_TODAY); while(d.getDay()!==wd) d.setDate(d.getDate()-1); return d; }
  return _midnight(_TODAY);
}
function _timePart(when){ const p=String(when||'').split(','); return (p[1]||p[0]||'').trim(); }
function _diff(d){ return Math.round((_midnight(_TODAY)-_midnight(d))/86400000); }
// compact timestamp for flat lists (SMS): time / Yesterday / weekday / M/D/YY
function fmtRowTime(when, date){
  const d=_dateOf(when,date), n=_diff(d);
  if(n<=0) return _timePart(when)||'Today';
  if(n===1) return 'Yesterday';
  if(n<7) return _WD[d.getDay()];
  return `${d.getMonth()+1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
}
// date-group header: Today / Yesterday / Weekday / "Monday, May 25"
function fmtDayHeader(when, date){
  const d=_dateOf(when,date), n=_diff(d);
  if(n<=0) return 'Today';
  if(n===1) return 'Yesterday';
  if(n<7) return _WD[d.getDay()];
  const sameYear = d.getFullYear()===_TODAY.getFullYear();
  return `${_WD[d.getDay()]}, ${_MO[d.getMonth()]} ${d.getDate()}${sameYear?'':', '+d.getFullYear()}`;
}

Object.assign(window, { React, useState, useRef, useEffect, useCallback,
  Icon, Toggle, Segmented, Choice, Field, Avatar, Card, Modal, Wave, fmtRowTime, fmtDayHeader });
