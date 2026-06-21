/* Mount - three call-flow directions side by side on a design canvas. */
const { DesignCanvas, DCSection, DCArtboard } = window;

function AdminCanvas() {
  return (
    <DesignCanvas>
      <DCSection id="callflow" title="Call flow - phone system admin"
        subtitle="Bob's HVAC · three ways to see & edit the whole number. Click a card's ⤢ to focus.">
        <DCArtboard id="e" label="E · Call Tree (node map)" width={1140} height={720}><OptionE /></DCArtboard>
        <DCArtboard id="a" label="A · Caller Journey" width={680} height={1480}><OptionA /></DCArtboard>
        <DCArtboard id="b" label="B · Stage Columns" width={1180} height={560}><OptionB /></DCArtboard>
        <DCArtboard id="c" label="C · Outline + Inspector" width={1180} height={940}><OptionC /></DCArtboard>
        <DCArtboard id="d" label="D · Visual Hierarchy" width={760} height={960}><OptionD /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminCanvas />);
