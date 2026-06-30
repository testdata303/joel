/* ============================================================
   AnyPhone - Billing screen
   A deliberately small page. Optimized for five jobs:
   know the plan, see what you pay for, know when you're billed,
   change the card, and cancel. No dashboards, no analytics.
   ============================================================ */
const { Icon:BIcon, Modal:BModal, Field:BField, Segmented:BSegmented, SStatus:BStatus } = window;
const { useState:bState } = React;

const PLANS = [
  { id:'starter', name:'Starter', m:19,  a:16,  numbers:1,  minutes:500,  blurb:'1 number · 500 minutes / mo' },
  { id:'growth',  name:'Growth',  m:59,  a:49,  numbers:3,  minutes:2000, blurb:'3 numbers · 2,000 minutes / mo' },
  { id:'pro',     name:'Pro',     m:129, a:107, numbers:10, minutes:6000, blurb:'10 numbers · 6,000 minutes / mo' },
];

const ADDONS = [
  { id:'numbers', name:'Additional numbers', icon:'hashnum',  unit:5,  meta:'Extra local or toll-free numbers · $5/mo each' },
  { id:'vanity',  name:'Vanity numbers',     icon:'sparkle',  unit:10, meta:'Memorable custom numbers · $10/mo each' },
  { id:'minutes', name:'Additional minutes', icon:'phone',    unit:8,  meta:'500-minute blocks · $8/mo each', pack:500 },
  { id:'sip',     name:'SIP phones',         icon:'monitor',  unit:3,  meta:'Desk-phone / SIP endpoints · $3/mo each' },
];

const INVOICES = [
  { id:'i6', date:'Jun 1, 2026', amt:96, desc:'Growth plan + add-ons' },
  { id:'i5', date:'May 1, 2026', amt:96, desc:'Growth plan + add-ons' },
  { id:'i4', date:'Apr 1, 2026', amt:96, desc:'Growth plan + add-ons' },
  { id:'i3', date:'Mar 1, 2026', amt:89, desc:'Growth plan + add-ons' },
  { id:'i2', date:'Feb 1, 2026', amt:89, desc:'Growth plan + add-ons' },
  { id:'i1', date:'Jan 1, 2026', amt:59, desc:'Growth plan' },
];

const MONTHLY_DATE = 'Jul 1, 2026';
const ANNUAL_DATE  = 'Mar 3, 2027';
const money = (n)=> '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n)?0:2 });
const money2 = (n)=> '$' + n.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });

/* ---------------- the screen ---------------- */
function BillingScreen(){
  const [planId,setPlanId]   = bState('growth');
  const [cycle,setCycle]     = bState('monthly');     // monthly | annual
  const [qty,setQty]         = bState({ numbers:2, vanity:1, minutes:1, sip:3 });
  const [card,setCard]       = bState({ brand:'VISA', last4:'4242', exp:'08 / 2027', name:'Bob Stevens' });
  const [contact,setContact] = bState({ email:'billing@smilebar.co', address:'221 Newbury St, Suite 4\nBoston, MA 02116' });
  const [canceled,setCanceled] = bState(false);
  const [feesOpen,setFeesOpen] = bState(false);      // collapse the itemized fee breakdown
  const [addonsOpen,setAddonsOpen] = bState(false);  // collapse the add-on steppers
  const [modal,setModal]     = bState(null);          // 'plan' | 'card' | 'contact' | 'cancel'
  const [dl,setDl]           = bState({});            // invoice id -> downloaded flag

  const plan = PLANS.find(p=>p.id===planId);
  const planMonthly = cycle==='annual' ? plan.a : plan.m;
  const addonsTotal = ADDONS.reduce((s,a)=> s + qty[a.id]*a.unit, 0);
  const renew = cycle==='annual' ? ANNUAL_DATE : MONTHLY_DATE;

  // Pass-through telecom taxes & regulatory fees - shown itemized for transparency.
  const round2 = (n)=> Math.round(n*100)/100;
  const lines = 3 + qty.numbers + qty.vanity;                // billable phone numbers on the account
  const baseMonthly = planMonthly + addonsTotal;
  const FEES = [
    { id:'usf',  name:'Federal Universal Service Fund (USF)', amt: round2(baseMonthly*0.0905),
      desc:'Funds phone & broadband access for rural areas, schools, libraries, and low-income households. The FCC sets the rate each quarter; we pass it through at cost.' },
    { id:'e911', name:'E911 service fee', amt: round2(lines*1.00),
      desc:`Funds the local 911 dispatch centers that handle emergency calls. Set by your state and county, charged per phone number (${lines} on your account).` },
    { id:'reg',  name:'Regulatory recovery fee', amt: round2(baseMonthly*0.0299),
      desc:'Recovers our cost to comply with FCC and state telecom rules - number administration, regulatory filings, and reporting. This is not a government tax.' },
    { id:'tax',  name:'State & local telecom taxes', amt: round2(baseMonthly*0.0625),
      desc:'Communications, sales, and utility taxes set by your state and city. Varies with your billing address.' },
  ];
  const feesTotal = round2(FEES.reduce((s,f)=>s+f.amt,0));
  const estTotal = round2(baseMonthly + feesTotal);

  const setQ = (id,delta)=> setQty(q=>({ ...q, [id]: Math.max(0, q[id]+delta) }));
  const download = (id)=>{ setDl(d=>({...d,[id]:true})); setTimeout(()=>setDl(d=>({...d,[id]:false})), 1600); };

  return (
    <div className="billing">
      <div className="set-head">
        <h1 className="set-title">Billing</h1>
        <p className="set-sub">Your plan, what you pay for, and your invoices - all in one place.</p>
      </div>

      {/* PLAN + CHARGES - one compact card: what you're on, what you pay, the total */}
      <section className="card sum-card">
        <div className="sum-head">
          <div className="sum-head-id">
            <span className="plan-name">{plan.name}</span>
            <span className="pill cycle">{cycle==='annual'?'Annual':'Monthly'}</span>
          </div>
          <div className="sum-head-meta">
            <span>{plan.numbers} numbers · {plan.minutes.toLocaleString()} min/mo</span>
            <span className="dot">·</span>
            <span>{canceled?'Active until':'Renews'} {renew}</span>
          </div>
          <button className="btn btn-secondary sm" onClick={()=>setModal('plan')}>Change plan</button>
        </div>

        {canceled && (
          <div className="note warn" style={{margin:'0 20px 4px'}}>
            <BIcon name="info"/>
            <span><b>Scheduled to cancel.</b> Your plan stays active until <b>{renew}</b>. After that AnyPhone stops taking calls and texts, and your numbers are released.</span>
          </div>
        )}

        <div className="sum-row">
          <span className="sum-k">{plan.name} plan <small>{cycle==='annual'?`Billed annually · ${money(plan.a*12)}/yr`:'Billed monthly'}</small></span>
          <span className="sum-v">{money2(planMonthly)}/mo</span>
        </div>

        <button className="sum-row sum-toggle" onClick={()=>setAddonsOpen(o=>!o)} aria-expanded={addonsOpen}>
          <span className="sum-k">Add-ons <small>{addonsTotal===0?'None added - tap to add numbers, minutes & devices':'Numbers, minutes & devices - tap to manage'}</small></span>
          <span className="sum-fees-r">
            <span className="sum-v">{money2(addonsTotal)}/mo</span>
            <span className={`sum-chev${addonsOpen?' open':''}`}><BIcon name="chevdown"/></span>
          </span>
        </button>
        {addonsOpen && (
          <div className="addon-list">
            {ADDONS.map(a=>{
              const q = qty[a.id];
              const cost = q*a.unit;
              return (
                <div className="ss-row" key={a.id}>
                  <span className="ss-ic"><BIcon name={a.icon}/></span>
                  <span className="ss-main">
                    <b>{a.name}</b>
                    <span className="ss-meta">{a.meta}{a.pack && q>0 ? ` · ${(q*a.pack).toLocaleString()} min total` : ''}</span>
                  </span>
                  <span className="addon-trail">
                    <span className={`addon-cost${cost===0?' zero':''}`}>{cost===0?'-':money(cost)+'/mo'}</span>
                    <span className="stepper">
                      <button onClick={()=>setQ(a.id,-1)} disabled={q===0} aria-label={`Remove ${a.name}`}><BIcon name="minus"/></button>
                      <span className="qty">{q}</span>
                      <button onClick={()=>setQ(a.id,1)} aria-label={`Add ${a.name}`}><BIcon name="plus"/></button>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <button className="sum-row sum-toggle" onClick={()=>setFeesOpen(o=>!o)} aria-expanded={feesOpen}>
          <span className="sum-k">Taxes &amp; regulatory fees <small>Federal, state &amp; local government fees - collected and passed through at cost</small></span>
          <span className="sum-fees-r">
            <span className="sum-v">{money2(feesTotal)}/mo</span>
            <span className={`sum-chev${feesOpen?' open':''}`}><BIcon name="chevdown"/></span>
          </span>
        </button>
        {feesOpen && (
          <div className="fee-list">
            {FEES.map(f=>(
              <div className="fee-row" key={f.id}>
                <span className="fee-main"><b>{f.name}</b><span>{f.desc}</span></span>
                <span className="fee-amt">{money2(f.amt)}<small>/mo</small></span>
              </div>
            ))}
          </div>
        )}
        <div className="sum-total">
          <span className="sum-tk">Estimated monthly total</span>
          <span className="sum-tv">{money2(estTotal)}<small>/mo</small></span>
        </div>
      </section>
      <p className="ss-foot">
        Taxes and fees are <b>estimates</b> - set by federal, state, and local governments and finalized on your invoice from your billing address and the numbers on your account.{' '}
        {cycle==='annual'
          ? <>Your plan is billed annually ({money(plan.a*12)}); add-ons and their taxes &amp; fees are billed monthly.</>
          : <>Next charge {money2(estTotal)} on {MONTHLY_DATE}.</>}{' '}
        Government rates can change at any time.
      </p>

      {/* 3 · PAYMENT METHOD */}
      <div className="ss-grouph">Payment method</div>
      <section className="card">
        <div className="ss-row">
          <span className="card-brand">{card.brand}</span>
          <span className="ss-main">
            <b>{card.brand==='VISA'?'Visa':card.brand} ending in {card.last4}</b>
            <span className="ss-meta">Expires {card.exp}<span className="sep">·</span>{card.name}</span>
          </span>
          <span className="ss-trail"><button className="btn btn-secondary sm" onClick={()=>setModal('card')}>Update card</button></span>
        </div>
      </section>

      {/* 4 · BILLING HISTORY */}
      <div className="ss-grouph">Billing history</div>
      <section className="card">
        {INVOICES.map(inv=>(
          <div className="inv-row" key={inv.id}>
            <span className="inv-date">{inv.date}<small>{inv.desc}</small></span>
            <span className="inv-amt">{money2(inv.amt)}</span>
            <BStatus kind="g" label="Paid"/>
            <button className={`inv-dl${dl[inv.id]?' done':''}`} title="Download invoice" onClick={()=>download(inv.id)}>
              <BIcon name={dl[inv.id]?'check':'download'}/>
            </button>
          </div>
        ))}
      </section>
      <p className="ss-foot">Showing your last 6 invoices. Receipts are also emailed to {contact.email}.</p>

      {/* 5 · BILLING CONTACT */}
      <div className="ss-grouph">Billing contact</div>
      <section className="card">
        <div className="card-h">
          <span className="h-icon"><BIcon name="building"/></span>
          <div className="ct"><h3>Where receipts are sent</h3></div>
          <button className="btn btn-secondary sm" onClick={()=>setModal('contact')}><BIcon name="pencil"/> Edit</button>
        </div>
        <div className="card-b flush">
          <div className="ss-row ss-kv">
            <span className="ss-ic"><BIcon name="mail"/></span>
            <span className="ss-main"><b>Billing email</b><span className="ss-kv-val">{contact.email}</span></span>
          </div>
          <div className="ss-row ss-kv">
            <span className="ss-ic"><BIcon name="building"/></span>
            <span className="ss-main"><b>Billing address</b><span className="ss-kv-val">{contact.address.split('\n').map((l,i)=><React.Fragment key={i}>{i>0&&<br/>}{l}</React.Fragment>)}</span></span>
          </div>
        </div>
      </section>

      {/* 6 · DANGER ZONE */}
      <div className="ss-grouph">Cancel</div>
      <section className="card danger-card">
        <div className="dz">
          <div className="dz-t">
            <b>{canceled?'Subscription canceled':'Cancel subscription'}</b>
            <span>{canceled
              ? `Scheduled to end on ${renew}. You can resume any time before then with no interruption.`
              : `Your plan stays active until ${renew}. After that, AnyPhone stops taking calls and texts, and your numbers are released.`}</span>
          </div>
          {canceled
            ? <button className="btn btn-primary" onClick={()=>setCanceled(false)}>Resume subscription</button>
            : <button className="btn btn-danger" onClick={()=>setModal('cancel')}>Cancel subscription</button>}
        </div>
      </section>

      {/* ---- modals ---- */}
      {modal==='plan' && <ChangePlanModal planId={planId} cycle={cycle}
        onClose={()=>setModal(null)}
        onSave={(pid,cyc)=>{ setPlanId(pid); setCycle(cyc); setModal(null); }}/>}
      {modal==='card' && <UpdateCardModal card={card} onClose={()=>setModal(null)}
        onSave={(c)=>{ setCard(c); setModal(null); }}/>}
      {modal==='contact' && <EditContactModal contact={contact} onClose={()=>setModal(null)}
        onSave={(c)=>{ setContact(c); setModal(null); }}/>}
      {modal==='cancel' && <CancelModal renew={renew} planName={plan.name} onClose={()=>setModal(null)}
        onConfirm={()=>{ setCanceled(true); setModal(null); }}/>}
    </div>
  );
}

/* ---------------- change plan ---------------- */
function ChangePlanModal({ planId, cycle, onClose, onSave }){
  const [pid,setPid] = bState(planId);
  const [cyc,setCyc] = bState(cycle);
  return (
    <BModal icon="card" title="Change plan" desc="Pick a plan and a billing cycle. Changes take effect on your next invoice." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>onSave(pid,cyc)}>Save plan</button>
      </React.Fragment>}>
      <div className="cycle-toggle">
        <BSegmented value={cyc} onChange={setCyc} options={[{value:'monthly',label:'Monthly'},{value:'annual',label:'Annual · save 17%'}]}/>
      </div>
      <div className="plan-opts">
        {PLANS.map(p=>{
          const price = cyc==='annual'?p.a:p.m;
          const on = pid===p.id;
          return (
            <button key={p.id} className={`plan-opt${on?' on':''}${p.id===planId?' current-tag':''}`} onClick={()=>setPid(p.id)}>
              <span className="radio"/>
              <span className="plan-opt-main"><b>{p.name}</b><span>{p.blurb}</span></span>
              <span className="plan-opt-price">{money(price)}/mo{cyc==='annual'&&<small>billed {money(p.a*12)}/yr</small>}</span>
            </button>
          );
        })}
      </div>
    </BModal>
  );
}

/* ---------------- update card ---------------- */
function UpdateCardModal({ card, onClose, onSave }){
  const [num,setNum]   = bState('');
  const [name,setName] = bState(card.name);
  const [exp,setExp]   = bState('');
  const [cvc,setCvc]   = bState('');
  const valid = num.replace(/\s/g,'').length>=15 && exp.length>=4 && cvc.length>=3;
  const save = ()=>{
    const digits = num.replace(/\D/g,'');
    onSave({ brand:'VISA', last4:digits.slice(-4)||card.last4, exp:exp||card.exp, name:name||card.name });
  };
  return (
    <BModal icon="card" title="Update card" desc="Your new card replaces the one on file. We charge it on your next invoice." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!valid} style={!valid?{opacity:.5,pointerEvents:'none'}:null} onClick={save}>Save card</button>
      </React.Fragment>}>
      <BField label="Card number">
        <input className="input" inputMode="numeric" placeholder="1234 1234 1234 1234" value={num}
          onChange={e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim(); setNum(v); }}/>
      </BField>
      <BField label="Name on card"><input className="input" value={name} onChange={e=>setName(e.target.value)}/></BField>
      <div className="field row">
        <BField label="Expiry">
          <input className="input" placeholder="MM / YY" value={exp}
            onChange={e=>{ let v=e.target.value.replace(/\D/g,'').slice(0,4); if(v.length>2) v=v.slice(0,2)+' / '+v.slice(2); setExp(v); }}/>
        </BField>
        <BField label="CVC"><input className="input" inputMode="numeric" placeholder="123" value={cvc} onChange={e=>setCvc(e.target.value.replace(/\D/g,'').slice(0,4))}/></BField>
      </div>
    </BModal>
  );
}

/* ---------------- edit billing contact ---------------- */
function EditContactModal({ contact, onClose, onSave }){
  const [email,setEmail]   = bState(contact.email);
  const [addr,setAddr]     = bState(contact.address);
  return (
    <BModal icon="building" title="Billing contact" desc="Where AnyPhone sends invoices and receipts." onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" disabled={!email.trim()} style={!email.trim()?{opacity:.5,pointerEvents:'none'}:null} onClick={()=>onSave({email:email.trim(),address:addr.trim()})}>Save</button>
      </React.Fragment>}>
      <BField label="Billing email"><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></BField>
      <BField label="Billing address">
        <textarea className="notes-ta" style={{minHeight:78}} value={addr} onChange={e=>setAddr(e.target.value)}/>
      </BField>
    </BModal>
  );
}

/* ---------------- cancel subscription ---------------- */
function CancelModal({ renew, planName, onClose, onConfirm }){
  const [ack,setAck] = bState(false);
  return (
    <BModal icon="info" title="Cancel subscription" desc={`We're sorry to see you go. Here's exactly what happens.`} onClose={onClose}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Keep subscription</button>
        <button className="btn btn-danger" disabled={!ack} style={!ack?{opacity:.5,pointerEvents:'none'}:null} onClick={onConfirm}>Cancel subscription</button>
      </React.Fragment>}>
      <div className="note warn" style={{marginBottom:16}}>
        <BIcon name="info"/>
        <span>Your <b>{planName}</b> plan stays active until <b>{renew}</b>. After that, AnyPhone <b>stops taking calls and texts</b>, and your business numbers are <b>released</b> and can't be recovered.</span>
      </div>
      <button className="acc-ack" onClick={()=>setAck(a=>!a)} style={{marginTop:0}}>
        <span className={`acc-checkbox${ack?' on':''}`}>{ack && <BIcon name="check"/>}</span>
        <span>I understand my numbers will be released on {renew} and this can't be undone.</span>
      </button>
    </BModal>
  );
}

Object.assign(window, { BillingScreen });
