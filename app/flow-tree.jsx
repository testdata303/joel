/* ============================================================
   Call Flow concept - Tree View
   The same flow as a compact indented list. Same selection +
   inspector as the canvas.
   ============================================================ */
const { Icon, flowSummary, FLOW_TYPES } = window;

function FtRow({ n, depth, sel, onSelect, onOpenAdd, onKebab }){
  const isRoot = n.id==='root';
  const kids = n.children||[];
  return (
    <React.Fragment>
      <button className={`cf-trow${sel===n.id?' sel':''}`} onClick={()=>onSelect(n.id)}>
        {isRoot
          ? <span className="cf-tic"><Icon name="phone"/></span>
          : <span className="cf-key" data-t={n.type}>{n.key}</span>}
        <span className="cf-trow-tx">
          <b>{n.name}</b>
          <span>{flowSummary(n)}</span>
        </span>
        <span className="cf-kebab" style={{opacity:1}} role="button" tabIndex={0} aria-label="Step options"
          onClick={(e)=>{ e.stopPropagation(); onKebab(n, e); }}
          onKeyDown={(e)=>{ if(e.key==='Enter'){ e.stopPropagation(); onKebab(n, e); } }}>
          <Icon name="more"/>
        </span>
        <span className="chev"><Icon name="chevright"/></span>
      </button>
      {(kids.length>0 || n.type==='menu') && (
        <div className="cf-tkids">
          {kids.map(k=>(
            <FtRow key={k.id} n={k} depth={depth+1} sel={sel} onSelect={onSelect} onOpenAdd={onOpenAdd} onKebab={onKebab}/>
          ))}
          {n.type==='menu' && (
            <button className="cf-tadd" onClick={(e)=>onOpenAdd(n.id, e)}><Icon name="plus"/>Add an option</button>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

function FlowTree({ root, sel, onSelect, onOpenAdd, onKebab }){
  return (
    <div className="cf-tree">
      <div className="cf-tree-card">
        <FtRow n={root} depth={0} sel={sel} onSelect={onSelect} onOpenAdd={onOpenAdd} onKebab={onKebab}/>
      </div>
    </div>
  );
}

Object.assign(window, { FlowTree });
