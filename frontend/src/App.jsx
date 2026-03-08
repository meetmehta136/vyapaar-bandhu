import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie } from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────
const T = {
  bg:       "#060B18",
  surface:  "#0D1526",
  card:     "#111D35",
  border:   "#1C2E50",
  blue:     "#2563EB",
  blueL:    "#3B82F6",
  blueD:    "#1D4ED8",
  cyan:     "#06B6D4",
  text:     "#F1F5F9",
  textSub:  "#64748B",
  textMid:  "#94A3B8",
  green:    "#10B981",
  greenBg:  "#022C22",
  yellow:   "#F59E0B",
  yellowBg: "#1C1505",
  red:      "#EF4444",
  redBg:    "#2D0A0A",
  gold:     "#F59E0B",
};

const css = {
  root: { display:"flex", height:"100vh", background:T.bg, fontFamily:"'IBM Plex Sans', 'Segoe UI', sans-serif", color:T.text, overflow:"hidden" },
};

// ─── MOCK DATA ────────────────────────────────────────────────────────
const CLIENTS = [
  { id:1, name:"Shree Ram General Store", phone:"9876543210", gstin:"24AADDC14534K1ZL", state:"Gujarat",      itc:9.62,    invoices:1,  turnover:84000,  status:"green",  risk:"Low",    joined:"2026-01-10" },
  { id:2, name:"Mehta Traders",           phone:"9765432109", gstin:"27AAFCI2112P1ZH", state:"Maharashtra",  itc:6062.04, invoices:3,  turnover:420000, status:"green",  risk:"Low",    joined:"2025-12-05" },
  { id:3, name:"Krishna Kirana",          phone:"9654321098", gstin:"07AAACK1234M1ZP", state:"Delhi",        itc:0,       invoices:0,  turnover:0,      status:"red",    risk:"High",   joined:"2026-02-01" },
  { id:4, name:"Patel Electronics",       phone:"9543210987", gstin:"24BBBCP1234R1ZS", state:"Gujarat",      itc:1842.50, invoices:7,  turnover:280000, status:"yellow", risk:"Medium", joined:"2025-11-20" },
  { id:5, name:"Jai Hind Pharma",         phone:"9432109876", gstin:"29CCCCP1234S1ZT", state:"Karnataka",    itc:12400,   invoices:12, turnover:960000, status:"green",  risk:"Low",    joined:"2025-10-15" },
  { id:6, name:"Sharma Wholesale",        phone:"9321098765", gstin:"08CCCCP1234S1ZT", state:"Rajasthan",    itc:3200,    invoices:5,  turnover:380000, status:"green",  risk:"Low",    joined:"2026-01-22" },
  { id:7, name:"Desai Textiles",          phone:"9210987654", gstin:"24DDDCP1234S1ZT", state:"Gujarat",      itc:780,     invoices:2,  turnover:120000, status:"yellow", risk:"Medium", joined:"2026-02-14" },
];

const INVOICES = [
  { id:1, client:"Shree Ram General Store", invoice_no:"GSTINO/8873",        date:"03-02-2020", gstin:"24AADDC14534K1ZL", taxable:593.22, cgst:53.39, sgst:53.39, igst:0,       total:700,     itc:106.78, status:"confirmed" },
  { id:2, client:"Mehta Traders",           invoice_no:"FAE1HB2200008214",   date:"10-10-2021", gstin:"27AAFCI2112P1ZH", taxable:33677.97,cgst:0,     sgst:0,     igst:6062.04, total:39740,   itc:6062.04,status:"confirmed" },
  { id:3, client:"Patel Electronics",       invoice_no:"PE/2025/0892",       date:"15-01-2026", gstin:"24BBBCP1234R1ZS", taxable:8200,   cgst:738,   sgst:738,   igst:0,       total:9676,    itc:1476,   status:"confirmed" },
  { id:4, client:"Jai Hind Pharma",         invoice_no:"JHP/INV/12345",      date:"20-02-2026", gstin:"29CCCCP1234S1ZT", taxable:52000,  cgst:0,     sgst:0,     igst:9360,    total:61360,   itc:9360,   status:"confirmed" },
  { id:5, client:"Sharma Wholesale",        invoice_no:"SW/2026/0341",       date:"28-02-2026", gstin:"08CCCCP1234S1ZT", taxable:14500,  cgst:1305,  sgst:1305,  igst:0,       total:17110,   itc:2610,   status:"pending"   },
  { id:6, client:"Desai Textiles",          invoice_no:"DT/2026/0087",       date:"05-03-2026", gstin:"24DDDCP1234S1ZT", taxable:3800,   cgst:342,   sgst:342,   igst:0,       total:4484,    itc:684,    status:"pending"   },
  { id:7, client:"Krishna Kirana",          invoice_no:"KK/2026/0001",       date:"01-03-2026", gstin:"07AAACK1234M1ZP", taxable:1200,   cgst:108,   sgst:108,   igst:0,       total:1416,    itc:216,    status:"rejected"  },
];

const ALERTS = [
  { id:1, client:"Krishna Kirana",    type:"GSTR-3B Due",    due:"2026-03-20", days:12, priority:"high",   message:"GSTR-3B filing due for Feb 2026. No invoices uploaded yet." },
  { id:2, client:"Desai Textiles",    type:"ITC Mismatch",   due:"2026-03-18", days:10, priority:"high",   message:"ITC claimed differs from GSTR-2B data by ₹340." },
  { id:3, client:"Patel Electronics", type:"GSTR-1 Due",     due:"2026-03-25", days:17, priority:"medium", message:"GSTR-1 filing deadline approaching for Feb 2026." },
  { id:4, client:"Sharma Wholesale",  type:"Invoice Pending", due:"2026-03-15", days:7,  priority:"medium", message:"2 invoices awaiting confirmation from user." },
  { id:5, client:"Mehta Traders",     type:"Turnover Alert",  due:"2026-03-31", days:23, priority:"low",    message:"Approaching ₹5L quarterly turnover threshold." },
];

const CHART_ITC = [
  {month:"Oct",itc:4200},{month:"Nov",itc:6800},{month:"Dec",itc:5100},
  {month:"Jan",itc:9200},{month:"Feb",itc:7600},{month:"Mar",itc:6072},
];
const CHART_CLIENTS = [
  {month:"Oct",clients:3},{month:"Nov",clients:4},{month:"Dec",clients:4},
  {month:"Jan",clients:5},{month:"Feb",clients:6},{month:"Mar",clients:7},
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ caName, onLogout }) {
  const nav = useNavigate();
  const loc = useLocation();
  const links = [
    ["📊","Dashboard","/"],
    ["👥","Clients","/clients"],
    ["📄","Invoices","/invoices"],
    ["🔔","Alerts","/alerts"],
    ["⚙️","Settings","/settings"],
  ];
  return (
    <div style={{width:"220px",background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:"34px",height:"34px",background:T.blue,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"14px",color:"#fff",letterSpacing:"1px"}}>VB</div>
        <div>
          <div style={{fontSize:"13px",fontWeight:"600",color:T.text}}>VyapaarBandhu</div>
          <div style={{fontSize:"10px",color:T.cyan,letterSpacing:"2px",textTransform:"uppercase"}}>CA Portal</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:"2px"}}>
        {links.map(([icon,label,path])=>{
          const active = loc.pathname === path;
          return (
            <div key={path} onClick={()=>nav(path)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"8px",cursor:"pointer",background:active?`${T.blue}22`:"transparent",color:active?T.blueL:T.textSub,fontWeight:active?"600":"400",fontSize:"14px",borderLeft:active?`2px solid ${T.blue}`:"2px solid transparent",transition:"all 0.15s"}}>
              <span style={{fontSize:"16px"}}>{icon}</span>{label}
            </div>
          );
        })}
      </nav>
      <div style={{padding:"16px",borderTop:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"12px"}}>
          <div style={{width:"32px",height:"32px",background:T.blue,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"700"}}>{caName.charAt(0)}</div>
          <div>
            <div style={{fontSize:"12px",color:T.text,fontWeight:"500"}}>{caName}</div>
            <div style={{fontSize:"10px",color:T.gold,letterSpacing:"1px"}}>PRO PLAN</div>
          </div>
        </div>
        <button onClick={onLogout} style={{width:"100%",background:"transparent",border:`1px solid ${T.border}`,color:T.textSub,borderRadius:"6px",padding:"7px",fontSize:"12px",cursor:"pointer"}}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────
function StatCard({icon,label,value,sub,color="#2563EB"}) {
  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,right:0,width:"80px",height:"80px",background:`${color}11`,borderRadius:"0 12px 0 80px"}}/>
      <div style={{fontSize:"22px",marginBottom:"8px"}}>{icon}</div>
      <div style={{fontSize:"26px",fontWeight:"700",color:T.text,marginBottom:"4px"}}>{value}</div>
      <div style={{fontSize:"12px",color:T.textSub,marginBottom:"4px"}}>{label}</div>
      {sub && <div style={{fontSize:"11px",color:color}}>{sub}</div>}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────
function Badge({status}) {
  const map = {
    green:     {bg:T.greenBg,  color:T.green,  label:"Compliant"},
    yellow:    {bg:T.yellowBg, color:T.yellow, label:"Attention"},
    red:       {bg:T.redBg,    color:T.red,    label:"At Risk"},
    confirmed: {bg:"#0A1628",  color:T.blueL,  label:"Confirmed"},
    pending:   {bg:T.yellowBg, color:T.yellow, label:"Pending"},
    rejected:  {bg:T.redBg,    color:T.red,    label:"Rejected"},
    high:      {bg:T.redBg,    color:T.red,    label:"High"},
    medium:    {bg:T.yellowBg, color:T.yellow, label:"Medium"},
    low:       {bg:T.greenBg,  color:T.green,  label:"Low"},
  };
  const s = map[status] || map.low;
  return <span style={{background:s.bg,color:s.color,padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"600",letterSpacing:"0.5px",whiteSpace:"nowrap"}}>{s.label}</span>;
}

// ─── PAGE HEADER ──────────────────────────────────────────────────────
function PageHeader({title,sub,action}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px"}}>
      <div>
        <h1 style={{color:T.text,fontSize:"22px",margin:"0 0 4px",fontWeight:"600"}}>{title}</h1>
        {sub && <p style={{color:T.textSub,fontSize:"13px",margin:0}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────────
function SearchInput({value,onChange,placeholder}) {
  return (
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Search..."}
      style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"9px 14px",color:T.text,fontSize:"13px",outline:"none",width:"240px"}} />
  );
}

// ─── BTN ──────────────────────────────────────────────────────────────
function Btn({children,onClick,variant="primary",small}) {
  const styles = {
    primary: {background:T.blue,color:"#fff",border:"none"},
    outline: {background:"transparent",color:T.blueL,border:`1px solid ${T.blue}`},
    ghost:   {background:"transparent",color:T.textSub,border:`1px solid ${T.border}`},
    danger:  {background:"transparent",color:T.red,border:`1px solid ${T.red}`},
  };
  return (
    <button onClick={onClick} style={{...styles[variant],borderRadius:"8px",padding:small?"6px 12px":"9px 18px",fontSize:small?"12px":"13px",fontWeight:"600",cursor:"pointer",whiteSpace:"nowrap"}}>
      {children}
    </button>
  );
}

// ─── TABLE ────────────────────────────────────────────────────────────
function Table({headers,rows}) {
  return (
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead>
        <tr>{headers.map(h=><th key={h} style={{color:T.textSub,fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",textAlign:"left",padding:"10px 14px",borderBottom:`1px solid ${T.border}`,fontWeight:"500"}}>{h}</th>)}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
function TR({children,onClick}) {
  return <tr onClick={onClick} style={{borderBottom:`1px solid ${T.border}22`,cursor:onClick?"pointer":"default"}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.background=`${T.blue}11`}} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{children}</tr>;
}
function TD({children,style}) {
  return <td style={{padding:"13px 14px",fontSize:"13px",color:T.textMid,...style}}>{children}</td>;
}

// ─── MODAL ────────────────────────────────────────────────────────────
function Modal({open,onClose,title,children}) {
  if(!open) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"14px",padding:"28px",width:"480px",maxWidth:"90vw"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px"}}>
          <h2 style={{color:T.text,fontSize:"17px",margin:0,fontWeight:"600"}}>{title}</h2>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:T.textSub,fontSize:"20px",cursor:"pointer"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({label,children}) {
  return (
    <div style={{marginBottom:"16px"}}>
      <label style={{display:"block",color:T.textSub,fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"6px"}}>{label}</label>
      {children}
    </div>
  );
}
function Input({value,onChange,placeholder,type="text"}) {
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 14px",color:T.text,fontSize:"14px",outline:"none",boxSizing:"border-box"}} />;
}
function Select({value,onChange,options}) {
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:T.surface,border:`1px solid ${T.border}`,borderRadius:"8px",padding:"10px 14px",color:T.text,fontSize:"14px",outline:"none"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
}

// ════════════════════════════════════════════════════════════════════
// PAGES
// ════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ───────────────────────────────────────────────────────
function Dashboard() {
  const nav = useNavigate();
  const totalITC   = CLIENTS.reduce((s,c)=>s+c.itc,0);
  const totalInv   = CLIENTS.reduce((s,c)=>s+c.invoices,0);
  const green      = CLIENTS.filter(c=>c.status==="green").length;
  const red        = CLIENTS.filter(c=>c.status==="red").length;
  const period     = new Date().toLocaleString("default",{month:"long",year:"numeric"});

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <PageHeader title="Dashboard" sub={`${period} · ${CLIENTS.length} active clients`}
        action={<Btn onClick={()=>nav("/clients")}>+ Add Client</Btn>} />

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"24px"}}>
        <StatCard icon="💰" label="Total ITC This Month" value={`₹${totalITC.toLocaleString("en-IN",{maximumFractionDigits:0})}`} sub="↑ 12% vs last month" color={T.gold} />
        <StatCard icon="📄" label="Invoices Processed"   value={totalInv} sub={`${INVOICES.filter(i=>i.status==="pending").length} pending review`} color={T.blue} />
        <StatCard icon="✅" label="Compliant Clients"    value={`${green}/${CLIENTS.length}`} sub="On track for filing" color={T.green} />
        <StatCard icon="⚠️" label="Alerts"               value={ALERTS.length} sub={`${ALERTS.filter(a=>a.priority==="high").length} high priority`} color={T.red} />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:"16px",marginBottom:"16px"}}>
        {/* ITC Chart */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"16px"}}>
            <div>
              <div style={{color:T.text,fontSize:"15px",fontWeight:"600"}}>ITC Trend</div>
              <div style={{color:T.textSub,fontSize:"12px",marginTop:"2px"}}>Monthly ITC across all clients (₹)</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CHART_ITC} barSize={24}>
              <XAxis dataKey="month" stroke={T.border} tick={{fill:T.textSub,fontSize:12}} />
              <YAxis stroke={T.border} tick={{fill:T.textSub,fontSize:11}} />
              <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"8px"}} labelStyle={{color:T.text}} itemStyle={{color:T.blueL}} formatter={v=>[`₹${v.toLocaleString("en-IN")}`,"ITC"]} />
              <Bar dataKey="itc" radius={[4,4,0,0]}>
                {CHART_ITC.map((_,i)=><Cell key={i} fill={i===CHART_ITC.length-1?T.blue:T.border} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"16px"}}>Compliance Status</div>
          {[["green","Compliant",T.green,T.greenBg],["yellow","Attention",T.yellow,T.yellowBg],["red","At Risk",T.red,T.redBg]].map(([key,label,color,bg])=>{
            const count = CLIENTS.filter(c=>c.status===key).length;
            const pct   = Math.round(count/CLIENTS.length*100);
            return (
              <div key={key} style={{marginBottom:"16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                  <span style={{fontSize:"13px",color}}>{label}</span>
                  <span style={{fontSize:"13px",color:T.textSub}}>{count} clients</span>
                </div>
                <div style={{height:"6px",background:T.surface,borderRadius:"3px"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:"3px",transition:"width 0.5s"}} />
                </div>
              </div>
            );
          })}
          <div style={{borderTop:`1px solid ${T.border}`,paddingTop:"16px",marginTop:"4px"}}>
            <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"12px"}}>Client Growth</div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={CHART_CLIENTS}>
                <Line type="monotone" dataKey="clients" stroke={T.blue} strokeWidth={2} dot={false} />
                <XAxis dataKey="month" stroke="transparent" tick={{fill:T.textSub,fontSize:10}} />
                <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"8px"}} labelStyle={{color:T.text}} itemStyle={{color:T.blueL}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600"}}>Recent Alerts</div>
          <Btn variant="ghost" small onClick={()=>nav("/alerts")}>View All →</Btn>
        </div>
        <Table headers={["Client","Type","Due","Days Left","Priority"]}
          rows={ALERTS.slice(0,3).map(a=>(
            <TR key={a.id}>
              <TD style={{color:T.text,fontWeight:"500"}}>{a.client}</TD>
              <TD>{a.type}</TD>
              <TD>{a.due}</TD>
              <TD><span style={{color:a.days<=7?T.red:a.days<=14?T.yellow:T.green,fontWeight:"600"}}>{a.days}d</span></TD>
              <TD><Badge status={a.priority} /></TD>
            </TR>
          ))}
        />
      </div>
    </div>
  );
}

// ─── CLIENTS ─────────────────────────────────────────────────────────
function Clients() {
  const nav = useNavigate();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({name:"",phone:"",gstin:"",state:"Gujarat"});

  const STATES = ["Gujarat","Maharashtra","Delhi","Karnataka","Rajasthan","Tamil Nadu","Uttar Pradesh","West Bengal"];

  const filtered = CLIENTS.filter(c => {
    const m = filter==="all" || c.status===filter;
    const s = c.name.toLowerCase().includes(search.toLowerCase()) || c.gstin.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <PageHeader title="Clients" sub={`${CLIENTS.length} total clients · ${CLIENTS.filter(c=>c.status==="green").length} compliant`}
        action={<Btn onClick={()=>setShowAdd(true)}>+ Add Client</Btn>} />

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"20px"}}>
        {[
          ["Total Clients", CLIENTS.length, T.blue],
          ["Active ITC", `₹${CLIENTS.reduce((s,c)=>s+c.itc,0).toLocaleString("en-IN",{maximumFractionDigits:0})}`, T.gold],
          ["Total Invoices", CLIENTS.reduce((s,c)=>s+c.invoices,0), T.cyan],
          ["High Risk", CLIENTS.filter(c=>c.status==="red").length, T.red],
        ].map(([l,v,color])=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px"}}>
            <div style={{fontSize:"20px",fontWeight:"700",color}}>{v}</div>
            <div style={{fontSize:"12px",color:T.textSub,marginTop:"4px"}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"}}>
          <div style={{display:"flex",gap:"6px"}}>
            {["all","green","yellow","red"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?T.blue:"transparent",color:filter===f?"#fff":T.textSub,border:`1px solid ${filter===f?T.blue:T.border}`,borderRadius:"20px",padding:"5px 14px",fontSize:"12px",cursor:"pointer",fontWeight:filter===f?"600":"400"}}>
                {f==="all"?"All":f==="green"?"Compliant":f==="yellow"?"Attention":"At Risk"}
                <span style={{marginLeft:"6px",background:filter===f?"#ffffff33":"#ffffff11",borderRadius:"10px",padding:"1px 6px"}}>
                  {f==="all"?CLIENTS.length:CLIENTS.filter(c=>c.status===f).length}
                </span>
              </button>
            ))}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, GSTIN, state..." />
        </div>

        <Table
          headers={["Client","GSTIN","State","Invoices","ITC This Month","Turnover","Status","Risk",""]}
          rows={filtered.map(c=>(
            <TR key={c.id} onClick={()=>nav(`/client/${c.id}`)}>
              <TD>
                <div style={{color:T.text,fontWeight:"600",fontSize:"13px"}}>{c.name}</div>
                <div style={{color:T.textSub,fontSize:"11px",marginTop:"2px"}}>+91 {c.phone}</div>
              </TD>
              <TD><code style={{fontSize:"11px",color:T.textSub,fontFamily:"monospace"}}>{c.gstin}</code></TD>
              <TD>{c.state}</TD>
              <TD><span style={{color:T.blueL,fontWeight:"600"}}>{c.invoices}</span></TD>
              <TD><span style={{color:T.gold,fontWeight:"600"}}>₹{c.itc.toLocaleString("en-IN",{maximumFractionDigits:2})}</span></TD>
              <TD>₹{c.turnover.toLocaleString("en-IN")}</TD>
              <TD><Badge status={c.status} /></TD>
              <TD><Badge status={c.risk==="Low"?"green":c.risk==="Medium"?"yellow":"red"} /></TD>
              <TD><Btn variant="ghost" small onClick={e=>{e.stopPropagation();nav(`/client/${c.id}`);}}>View →</Btn></TD>
            </TR>
          ))}
        />
        {filtered.length===0 && <div style={{textAlign:"center",color:T.textSub,padding:"40px"}}>No clients found</div>}
      </div>

      {/* Add Client Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add New Client">
        <Field label="Business Name"><Input value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Shree Ram General Store" /></Field>
        <Field label="WhatsApp Number"><Input value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="9876543210" /></Field>
        <Field label="GSTIN"><Input value={form.gstin} onChange={v=>setForm({...form,gstin:v})} placeholder="24AADDC14534K1ZL" /></Field>
        <Field label="State"><Select value={form.state} onChange={v=>setForm({...form,state:v})} options={STATES} /></Field>
        <div style={{display:"flex",gap:"10px",marginTop:"8px"}}>
          <Btn onClick={()=>setShowAdd(false)} variant="ghost">Cancel</Btn>
          <Btn onClick={()=>{ alert(`Client "${form.name}" added! (Connect to backend API)`); setShowAdd(false); }}>Add Client</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── CLIENT DETAIL ────────────────────────────────────────────────────
function ClientDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const client = CLIENTS.find(c=>c.id===parseInt(id)) || CLIENTS[0];
  const invoices = INVOICES.filter(i=>i.client===client.name);
  const totalITC = invoices.reduce((s,i)=>s+i.itc,0);

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"24px"}}>
        <Btn variant="ghost" small onClick={()=>nav("/clients")}>← Back</Btn>
        <div style={{flex:1}}>
          <h1 style={{color:T.text,fontSize:"20px",margin:"0 0 4px",fontWeight:"600"}}>{client.name}</h1>
          <p style={{color:T.textSub,fontSize:"12px",margin:0}}>GSTIN: {client.gstin} · {client.state} · Joined {client.joined}</p>
        </div>
        <Badge status={client.status} />
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"14px",marginBottom:"20px"}}>
        {[
          ["Total ITC",`₹${totalITC.toLocaleString("en-IN",{maximumFractionDigits:2})}`,T.gold],
          ["Invoices",invoices.length,T.blue],
          ["Total Spend",`₹${invoices.reduce((s,i)=>s+i.total,0).toLocaleString("en-IN",{maximumFractionDigits:0})}`,T.cyan],
          ["Turnover YTD",`₹${client.turnover.toLocaleString("en-IN")}`,T.green],
        ].map(([l,v,color])=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"18px"}}>
            <div style={{fontSize:"22px",fontWeight:"700",color}}>{v}</div>
            <div style={{fontSize:"12px",color:T.textSub,marginTop:"4px"}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600"}}>Invoice History</div>
          <Btn variant="outline" small onClick={()=>alert("PDF export — connect to backend")}>Export PDF</Btn>
        </div>
        <Table
          headers={["Invoice No","Date","Supplier GSTIN","Taxable","CGST","SGST","IGST","Total","ITC","Status"]}
          rows={invoices.length>0 ? invoices.map(inv=>(
            <TR key={inv.id}>
              <TD><code style={{fontFamily:"monospace",fontSize:"11px",color:T.blueL}}>{inv.invoice_no}</code></TD>
              <TD>{inv.date}</TD>
              <TD><code style={{fontFamily:"monospace",fontSize:"11px",color:T.textSub}}>{inv.gstin}</code></TD>
              <TD>₹{inv.taxable.toLocaleString("en-IN")}</TD>
              <TD>{inv.cgst?`₹${inv.cgst}`:"—"}</TD>
              <TD>{inv.sgst?`₹${inv.sgst}`:"—"}</TD>
              <TD>{inv.igst?`₹${inv.igst}`:"—"}</TD>
              <TD style={{color:T.text,fontWeight:"600"}}>₹{inv.total.toLocaleString("en-IN")}</TD>
              <TD style={{color:T.gold,fontWeight:"700"}}>₹{inv.itc.toFixed(2)}</TD>
              <TD><Badge status={inv.status} /></TD>
            </TR>
          )) : [<TR key="empty"><TD style={{textAlign:"center",color:T.textSub,padding:"30px"}} colSpan={10}>No invoices yet — user hasn't uploaded any</TD></TR>]}
        />
      </div>
    </div>
  );
}

// ─── INVOICES ─────────────────────────────────────────────────────────
function Invoices() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = INVOICES.filter(i => {
    const m = filter==="all" || i.status===filter;
    const s = i.client.toLowerCase().includes(search.toLowerCase()) || i.invoice_no.toLowerCase().includes(search.toLowerCase()) || i.gstin.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  const totalITC = INVOICES.reduce((s,i)=>s+i.itc,0);

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <PageHeader title="Invoices" sub={`${INVOICES.length} total invoices across all clients`}
        action={<Btn variant="outline" onClick={()=>alert("Export CSV — connect to backend")}>Export CSV</Btn>} />

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"20px"}}>
        {[
          ["Total Invoices",INVOICES.length,T.blue],
          ["Total ITC",`₹${totalITC.toLocaleString("en-IN",{maximumFractionDigits:2})}`,T.gold],
          ["Confirmed",INVOICES.filter(i=>i.status==="confirmed").length,T.green],
          ["Pending Review",INVOICES.filter(i=>i.status==="pending").length,T.yellow],
        ].map(([l,v,color])=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px"}}>
            <div style={{fontSize:"20px",fontWeight:"700",color}}>{v}</div>
            <div style={{fontSize:"12px",color:T.textSub,marginTop:"4px"}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"10px"}}>
          <div style={{display:"flex",gap:"6px"}}>
            {["all","confirmed","pending","rejected"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?T.blue:"transparent",color:filter===f?"#fff":T.textSub,border:`1px solid ${filter===f?T.blue:T.border}`,borderRadius:"20px",padding:"5px 14px",fontSize:"12px",cursor:"pointer"}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." />
        </div>

        <Table
          headers={["Client","Invoice No","Date","GSTIN","Taxable","Tax","Total","ITC","Status",""]}
          rows={filtered.map(inv=>{
            const tax = inv.cgst+inv.sgst+inv.igst;
            return (
              <TR key={inv.id}>
                <TD style={{color:T.text,fontWeight:"500"}}>{inv.client}</TD>
                <TD><code style={{fontFamily:"monospace",fontSize:"11px",color:T.blueL}}>{inv.invoice_no}</code></TD>
                <TD>{inv.date}</TD>
                <TD><code style={{fontFamily:"monospace",fontSize:"11px",color:T.textSub}}>{inv.gstin}</code></TD>
                <TD>₹{inv.taxable.toLocaleString("en-IN")}</TD>
                <TD>₹{tax.toFixed(2)}</TD>
                <TD style={{color:T.text,fontWeight:"600"}}>₹{inv.total.toLocaleString("en-IN")}</TD>
                <TD style={{color:T.gold,fontWeight:"700"}}>₹{inv.itc.toFixed(2)}</TD>
                <TD><Badge status={inv.status} /></TD>
                <TD>
                  {inv.status==="pending" && <Btn variant="outline" small onClick={()=>alert("Approve invoice — connect to API")}>Approve</Btn>}
                  {inv.status==="confirmed" && <Btn variant="ghost" small onClick={()=>alert("View invoice details")}>View</Btn>}
                </TD>
              </TR>
            );
          })}
        />
        {filtered.length===0 && <div style={{textAlign:"center",color:T.textSub,padding:"40px"}}>No invoices found</div>}
      </div>
    </div>
  );
}

// ─── ALERTS ───────────────────────────────────────────────────────────
function Alerts() {
  const [filter, setFilter] = useState("all");

  const filtered = ALERTS.filter(a => filter==="all" || a.priority===filter);

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <PageHeader title="Alerts" sub="Deadline reminders and compliance warnings" />

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"20px"}}>
        {[
          ["High Priority",ALERTS.filter(a=>a.priority==="high").length,T.red],
          ["Medium Priority",ALERTS.filter(a=>a.priority==="medium").length,T.yellow],
          ["Low Priority",ALERTS.filter(a=>a.priority==="low").length,T.green],
        ].map(([l,v,color])=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px",borderLeft:`3px solid ${color}`}}>
            <div style={{fontSize:"24px",fontWeight:"700",color}}>{v}</div>
            <div style={{fontSize:"12px",color:T.textSub,marginTop:"4px"}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"20px"}}>
        <div style={{display:"flex",gap:"6px",marginBottom:"16px"}}>
          {["all","high","medium","low"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{background:filter===f?T.blue:"transparent",color:filter===f?"#fff":T.textSub,border:`1px solid ${filter===f?T.blue:T.border}`,borderRadius:"20px",padding:"5px 14px",fontSize:"12px",cursor:"pointer"}}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {filtered.map(a=>(
            <div key={a.id} style={{background:T.surface,border:`1px solid ${a.priority==="high"?T.red+"44":a.priority==="medium"?T.yellow+"44":T.border}`,borderRadius:"10px",padding:"16px",display:"flex",alignItems:"flex-start",gap:"14px"}}>
              <div style={{fontSize:"22px",marginTop:"2px"}}>{a.priority==="high"?"🚨":a.priority==="medium"?"⚠️":"ℹ️"}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px",flexWrap:"wrap"}}>
                  <span style={{color:T.text,fontWeight:"600",fontSize:"14px"}}>{a.client}</span>
                  <span style={{color:T.blueL,fontSize:"12px",background:`${T.blue}22`,padding:"2px 8px",borderRadius:"10px"}}>{a.type}</span>
                  <Badge status={a.priority} />
                </div>
                <p style={{color:T.textMid,fontSize:"13px",margin:"0 0 8px"}}>{a.message}</p>
                <div style={{display:"flex",gap:"16px",fontSize:"12px"}}>
                  <span style={{color:T.textSub}}>Due: <span style={{color:T.text}}>{a.due}</span></span>
                  <span style={{color:a.days<=7?T.red:a.days<=14?T.yellow:T.green,fontWeight:"600"}}>{a.days} days remaining</span>
                </div>
              </div>
              <div style={{display:"flex",gap:"8px",flexShrink:0}}>
                <Btn variant="ghost" small onClick={()=>alert(`WhatsApp reminder sent to ${a.client}`)}>Send Reminder</Btn>
                <Btn variant="outline" small onClick={()=>alert("Mark as resolved")}>Resolve</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────
function Settings() {
  const [profile, setProfile] = useState({ name:"CA Rajesh Shah", firm:"Shah & Associates", email:"rajesh@shahca.com", phone:"9876543210", license:"CA/2019/012345" });
  const [brand, setBrand]     = useState({ label:"Shah & Associates", color:"#2563EB", tagline:"Your trusted GST partner" });
  const [saved, setSaved]     = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div style={{flex:1,overflow:"auto",padding:"28px"}}>
      <PageHeader title="Settings" sub="Manage your CA profile and white-label branding" />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        {/* Profile */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"24px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"20px",paddingBottom:"12px",borderBottom:`1px solid ${T.border}`}}>👤 CA Profile</div>
          <Field label="Full Name"><Input value={profile.name} onChange={v=>setProfile({...profile,name:v})} /></Field>
          <Field label="Firm Name"><Input value={profile.firm} onChange={v=>setProfile({...profile,firm:v})} /></Field>
          <Field label="Email"><Input value={profile.email} onChange={v=>setProfile({...profile,email:v})} type="email" /></Field>
          <Field label="Phone"><Input value={profile.phone} onChange={v=>setProfile({...profile,phone:v})} /></Field>
          <Field label="CA License Number"><Input value={profile.license} onChange={v=>setProfile({...profile,license:v})} /></Field>
          <Btn onClick={save}>{saved?"✅ Saved!":"Save Profile"}</Btn>
        </div>

        {/* White Label */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"24px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"20px",paddingBottom:"12px",borderBottom:`1px solid ${T.border}`}}>🎨 White Label Branding</div>
          <Field label="Brand Name (shown to clients)"><Input value={brand.label} onChange={v=>setBrand({...brand,label:v})} /></Field>
          <Field label="Tagline"><Input value={brand.tagline} onChange={v=>setBrand({...brand,tagline:v})} /></Field>
          <Field label="Brand Color">
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <input type="color" value={brand.color} onChange={e=>setBrand({...brand,color:e.target.value})} style={{width:"48px",height:"38px",border:"none",borderRadius:"6px",cursor:"pointer",background:"transparent"}} />
              <Input value={brand.color} onChange={v=>setBrand({...brand,color:v})} />
            </div>
          </Field>
          {/* Preview */}
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:"10px",padding:"16px",marginTop:"8px",marginBottom:"16px"}}>
            <div style={{fontSize:"11px",color:T.textSub,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"10px"}}>Preview</div>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"36px",height:"36px",background:brand.color,borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",color:"#fff",fontSize:"14px"}}>{brand.label.charAt(0)}</div>
              <div>
                <div style={{color:T.text,fontWeight:"600",fontSize:"14px"}}>{brand.label}</div>
                <div style={{color:T.textSub,fontSize:"11px"}}>{brand.tagline}</div>
              </div>
            </div>
          </div>
          <Btn onClick={save}>{saved?"✅ Saved!":"Save Branding"}</Btn>
        </div>

        {/* Plan */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"24px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"20px",paddingBottom:"12px",borderBottom:`1px solid ${T.border}`}}>💳 Subscription Plan</div>
          <div style={{background:`${T.blue}11`,border:`1px solid ${T.blue}44`,borderRadius:"10px",padding:"16px",marginBottom:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:T.blueL,fontWeight:"700",fontSize:"16px"}}>Pro Plan</div>
                <div style={{color:T.textSub,fontSize:"12px",marginTop:"4px"}}>Up to 50 clients · Unlimited invoices</div>
              </div>
              <div style={{color:T.gold,fontWeight:"700",fontSize:"18px"}}>₹999<span style={{fontSize:"12px",color:T.textSub}}>/mo</span></div>
            </div>
          </div>
          {["✅ Up to 50 clients","✅ Unlimited invoice OCR","✅ White label branding","✅ WhatsApp alerts","✅ CA dashboard","✅ PDF export"].map(f=>(
            <div key={f} style={{color:T.textMid,fontSize:"13px",padding:"5px 0"}}>{f}</div>
          ))}
        </div>

        {/* Notifications */}
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"12px",padding:"24px"}}>
          <div style={{color:T.text,fontSize:"15px",fontWeight:"600",marginBottom:"20px",paddingBottom:"12px",borderBottom:`1px solid ${T.border}`}}>🔔 Notification Settings</div>
          {[
            ["GSTR-1 Deadline Reminder","7 days before"],
            ["GSTR-3B Deadline Reminder","5 days before"],
            ["ITC Mismatch Alert","Immediately"],
            ["New Invoice Uploaded","Immediately"],
            ["Client Turnover Alert","When threshold crossed"],
          ].map(([label,timing])=>(
            <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}22`}}>
              <div>
                <div style={{color:T.text,fontSize:"13px"}}>{label}</div>
                <div style={{color:T.textSub,fontSize:"11px",marginTop:"2px"}}>{timing}</div>
              </div>
              <div style={{width:"36px",height:"20px",background:T.blue,borderRadius:"10px",cursor:"pointer",position:"relative"}}>
                <div style={{position:"absolute",right:"2px",top:"2px",width:"16px",height:"16px",background:"#fff",borderRadius:"50%"}} />
              </div>
            </div>
          ))}
          <div style={{marginTop:"16px"}}>
            <Btn onClick={save}>{saved?"✅ Saved!":"Save Preferences"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const nav = useNavigate();

  const submit = e => {
    e.preventDefault();
    if(email==="ca@demo.com" && password==="demo123") {
      localStorage.setItem("ca_token","demo_token");
      localStorage.setItem("ca_name","CA Rajesh Shah");
      nav("/");
    } else setError("Invalid credentials. Use ca@demo.com / demo123");
  };

  return (
    <div style={{display:"flex",height:"100vh",background:T.bg,fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif"}}>
      <div style={{flex:1,padding:"60px",display:"flex",flexDirection:"column",justifyContent:"space-between",borderRight:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"40px",height:"40px",background:T.blue,borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"16px",color:"#fff"}}>VB</div>
          <div>
            <div style={{color:T.text,fontSize:"18px",fontWeight:"600"}}>VyapaarBandhu</div>
            <div style={{color:T.cyan,fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase"}}>CA Partner Portal</div>
          </div>
        </div>
        <div>
          <div style={{color:T.textSub,fontSize:"48px",fontWeight:"300",lineHeight:1.2,marginBottom:"8px"}}>GST compliance</div>
          <div style={{color:T.text,fontSize:"48px",fontWeight:"700",lineHeight:1.2,marginBottom:"8px"}}>at scale.</div>
          <div style={{color:T.blueL,fontSize:"16px",marginTop:"16px"}}>Manage 50+ clients. Zero paperwork.</div>
        </div>
        <div style={{display:"flex",gap:"40px"}}>
          {[["8Cr+","Indian SMEs"],["₹0","Setup Cost"],["<10s","Per Invoice"]].map(([v,l])=>(
            <div key={l}>
              <div style={{color:T.text,fontSize:"24px",fontWeight:"700"}}>{v}</div>
              <div style={{color:T.textSub,fontSize:"12px",marginTop:"2px",textTransform:"uppercase",letterSpacing:"1px"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{width:"440px",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px"}}>
        <div style={{width:"100%"}}>
          <h2 style={{color:T.text,fontSize:"26px",margin:"0 0 6px",fontWeight:"600"}}>Welcome back</h2>
          <p style={{color:T.textSub,fontSize:"14px",margin:"0 0 32px"}}>Sign in to your CA dashboard</p>
          <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
            <Field label="Email"><Input value={email} onChange={setEmail} placeholder="ca@yourfirm.com" type="email" /></Field>
            <Field label="Password"><Input value={password} onChange={setPassword} placeholder="••••••••" type="password" /></Field>
            {error && <p style={{color:T.red,fontSize:"13px",margin:0}}>{error}</p>}
            <button type="submit" style={{background:T.blue,color:"#fff",border:"none",borderRadius:"8px",padding:"14px",fontSize:"15px",fontWeight:"600",cursor:"pointer",marginTop:"4px"}}>Sign In →</button>
          </form>
          <p style={{color:T.textSub,fontSize:"12px",textAlign:"center",marginTop:"24px"}}>Demo: ca@demo.com / demo123</p>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────
function AppShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const caName = localStorage.getItem("ca_name") || "CA";
  const token  = localStorage.getItem("ca_token");

  if(!token) return <Navigate to="/login" />;
  if(loc.pathname==="/login") return <Navigate to="/" />;

  const logout = () => { localStorage.clear(); nav("/login"); };

  return (
    <div style={css.root}>
      <Sidebar caName={caName} onLogout={logout} />
      <Routes>
        <Route path="/"           element={<Dashboard />} />
        <Route path="/clients"    element={<Clients />} />
        <Route path="/client/:id" element={<ClientDetail />} />
        <Route path="/invoices"   element={<Invoices />} />
        <Route path="/alerts"     element={<Alerts />} />
        <Route path="/settings"   element={<Settings />} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*"     element={<AppShell />} />
      </Routes>
    </BrowserRouter>
  );
}