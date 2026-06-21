/* ============================================================
   Call Flow concept - root screen + app
   ============================================================ */
const { useState, useCallback, Icon, Segmented, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
const { FLOW_SEED, FLOW_EMPTY, flowFind, flowUpdate, flowRemove, flowAddChild, newFlowNode, flowCount } = window;
const { FlowCanvas, FlowTree, FlowInspector, FcSidebar, FcTopbar, FcAddMenu, FcKebabMenu, FC_TWEAK_DEFAULTS } = window;

function FlowApp(){
  const [t, setTweak] = useTweaks(FC_TWEAK_DEFAULTS);
  const [root, setRoot] = useState(t.startEmpty ? FLOW_EMPTY : FLOW_SEED);
  const [sel, setSel] = useState('root');           // start on the Main Greeting so its settings fill the right panel
  const [view, setView] = useState('canvas');           // canvas | tree
  const [addMenu, setAddMenu] = useState(null);          // { parentId, x, y }
  const [kebab, setKebab] = useState(null);              // { node, x, y }

  // swap seed when the tweak flips
  const lastSeed = React.useRef(t.startEmpty);
  React.useEffect(()=>{
    if(lastSeed.current !== t.startEmpty){
      lastSeed.current = t.startEmpty;
      setRoot(t.startEmpty ? FLOW_EMPTY : FLOW_SEED);
      setSel(null);
    }
  },[t.startEmpty]);

  const patchNode = useCallback((id, patch)=>setRoot(r=>flowUpdate(r, id, patch)),[]);

  const openAdd = useCallback((parentId, e)=>{
    const r = e.currentTarget.getBoundingClientRect();
    setAddMenu({ parentId, x:r.left, y:r.bottom+8 });
    setKebab(null);
  },[]);

  const openKebab = useCallback((node, e)=>{
    const r = e.currentTarget.getBoundingClientRect();
    setKebab({ node, x:r.left-6, y:r.bottom+8 });
    setAddMenu(null);
  },[]);

  const pickType = (type)=>{
    const child = newFlowNode(type);
    setRoot(r=>flowAddChild(r, addMenu.parentId, child));
    setAddMenu(null);
    setSel(child.id);
  };

  const removeNode = ()=>{
    const id = kebab.node.id;
    setRoot(r=>flowRemove(r, id));
    setKebab(null);
    if(sel===id) setSel(null);
  };

  const duplicateNode = ()=>{
    const src = kebab.node;
    const parent = window.flowFindParent(root, src.id);
    if(parent){
      const copy = JSON.parse(JSON.stringify(src));
      const stamp=(n)=>{ n.id='nn'+Math.random().toString(36).slice(2,8); (n.children||[]).forEach(stamp); };
      stamp(copy);
      copy.name = src.name+' copy';
      setRoot(r=>flowAddChild(r, parent.id, copy));
    }
    setKebab(null);
  };

  return (
    <div className="app">
      <FcSidebar/>
      <div className="main">
        <FcTopbar/>
        <div className="cf-screen" data-screen-label="Call Flow">
          <div className="cf-head">
            <div className="cf-head-t">
              <h1>Call Flow</h1>
              <p>What happens when someone calls (617) 555-0100 - click any step to manage it.</p>
            </div>
            <span className="cf-saved"><Icon name="check"/>Saved · Live</span>
            <div className="cf-views">
              <Segmented value={view} onChange={setView}
                options={[{value:'canvas',label:'Flow'},{value:'tree',label:'Tree'}]}/>
            </div>
          </div>
          <div className="cf-body">
            {view==='canvas' ? (
              <FlowCanvas root={root} sel={sel} onSelect={setSel}
                onOpenAdd={openAdd} onKebab={openKebab}
                edgeStyle={t.edgeStyle} dots={t.dotsBg} compact={t.density==='compact'} tinted={t.tinted}/>
            ) : (
              <FlowTree root={root} sel={sel} onSelect={setSel} onOpenAdd={openAdd} onKebab={openKebab}/>
            )}
            <FlowInspector root={root} selId={sel} onSelect={setSel} patchNode={patchNode} onOpenAdd={openAdd}/>
          </div>
        </div>
      </div>

      {addMenu && <FcAddMenu at={addMenu} onPick={pickType} onClose={()=>setAddMenu(null)}/>}
      {kebab && <FcKebabMenu at={kebab} node={kebab.node} onClose={()=>setKebab(null)} onRemove={removeNode} onDuplicate={duplicateNode}/>}

      <TweaksPanel>
        <TweakSection label="Canvas"/>
        <TweakRadio label="Edges" value={t.edgeStyle} options={['square','curved']} onChange={v=>setTweak('edgeStyle',v)}/>
        <TweakRadio label="Card density" value={t.density} options={['roomy','compact']} onChange={v=>setTweak('density',v)}/>
        <TweakToggle label="Dotted background" value={t.dotsBg} onChange={v=>setTweak('dotsBg',v)}/>
        <TweakToggle label="Color-code steps" value={t.tinted} onChange={v=>setTweak('tinted',v)}/>
        <TweakSection label="Scenario"/>
        <TweakToggle label="Brand-new business" value={t.startEmpty} onChange={v=>setTweak('startEmpty',v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FlowApp/>);
