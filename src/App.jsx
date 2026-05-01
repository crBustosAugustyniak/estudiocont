import { useState, useMemo } from "react";

const CATEGORIAS = [
  { cat: "A", tope: 10277988.13,  impServ: 4780.46,   impVenta: 4780.46,   sipa: 15616.17, obraSocial: 21990.11 },
  { cat: "B", tope: 15058447.71,  impServ: 9082.88,   impVenta: 9082.88,   sipa: 17177.79, obraSocial: 21990.11 },
  { cat: "C", tope: 21113696.52,  impServ: 15616.17,  impVenta: 14341.38,  sipa: 18895.57, obraSocial: 21990.11 },
  { cat: "D", tope: 26212853.42,  impServ: 25495.79,  impVenta: 23742.95,  sipa: 20785.13, obraSocial: 26133.18 },
  { cat: "E", tope: 30833964.37,  impServ: 47804.60,  impVenta: 37924.98,  sipa: 22863.64, obraSocial: 31869.73 },
  { cat: "F", tope: 38642048.36,  impServ: 67245.13,  impVenta: 49398.08,  sipa: 25150.00, obraSocial: 36650.19 },
  { cat: "G", tope: 46211109.37,  impServ: 122379.76, impVenta: 61189.87,  sipa: 35210.00, obraSocial: 39518.47 },
  { cat: "H", tope: 70113407.33,  impServ: 350567.04, impVenta: 175283.51, sipa: 49294.00, obraSocial: 47485.89 },
  { cat: "I", tope: 78479211.62,  impServ: 697150.35, impVenta: 278860.14, sipa: 69011.60, obraSocial: 58640.31 },
  { cat: "J", tope: 89872640.30,  impServ: 836580.42, impVenta: 334632.18, sipa: 96616.24, obraSocial: 65810.99 },
  { cat: "K", tope: 108357084.05, impServ: 1171212.59,impVenta: 390404.20, sipa: 135262.74,obraSocial: 75212.57 },
];

const MESES      = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const ACTIVIDADES = ["Servicios","Venta de cosas muebles","Ambas"];

const ARS  = n => new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n||0);
const PCT  = n => `${Math.min(100,Math.round(n))}%`;
const hoy  = new Date();
const ANO  = hoy.getFullYear();
const MES  = hoy.getMonth();

const ym    = (y,m) => `${y}-${String(m+1).padStart(2,"0")}`;
const sumaP = (fac,claves) => claves.reduce((a,k)=>a+(fac[k]||0),0);
const ultimos12 = () => { const r=[]; for(let i=11;i>=0;i--){const d=new Date(ANO,MES-i,1);r.push(ym(d.getFullYear(),d.getMonth()));}return r; };
const clavesEJ  = () => Array.from({length:7},(_,i)=>ym(ANO,i));
const clavesAn  = () => Array.from({length:12},(_,i)=>ym(ANO,i));

function getCat(n){ for(const c of CATEGORIAS) if(n<=c.tope) return c; return null; }
function getCuota(c,act){ if(!c)return 0; return (act==="Venta de cosas muebles"?c.impVenta:c.impServ)+c.sipa+c.obraSocial; }
function semaforo(p){
  if(p>=100) return {fg:"#ef4444",bg:"#fef2f2",brd:"#fecaca",label:"⛔ Excluido"};
  if(p>=85)  return {fg:"#f97316",bg:"#fff7ed",brd:"#fed7aa",label:"🔴 Riesgo"};
  if(p>=70)  return {fg:"#eab308",bg:"#fefce8",brd:"#fef08a",label:"🟡 Atención"};
  return           {fg:"#22c55e",bg:"#f0fdf4",brd:"#bbf7d0",label:"🟢 OK"};
}
function calcMetricas(c){
  const m12=ultimos12(); const totalM=sumaP(c.facMensual,m12);
  const catM=getCat(totalM); const pctM=catM?(totalM/catM.tope)*100:100;
  const totalEJ=sumaP(c.facMensual,clavesEJ()); const catEJ=getCat(totalEJ); const pctEJ=catEJ?(totalEJ/catEJ.tope)*100:100;
  const totalAn=sumaP(c.facMensual,clavesAn()); const catAn=getCat(totalAn); const pctAn=catAn?(totalAn/catAn.tope)*100:100;
  const topeMes=catM?catM.tope/12:0; const facMesAct=c.facMensual[ym(ANO,MES)]||0;
  const pctMes=topeMes?(facMesAct/topeMes)*100:0;
  return {totalM,catM,pctM,totalEJ,catEJ,pctEJ,totalAn,catAn,pctAn,topeMes,facMesAct,pctMes,maxPct:Math.max(pctM,pctEJ,pctAn),cuota:getCuota(catM,c.actividad)};
}

const SEED_MONO = [
  { id:1, nombre:"Rodríguez, Ana M.",   cuit:"27-32145678-4", actividad:"Servicios",             notas:"", facMensual:{"2025-06":710000,"2025-07":680000,"2025-08":750000,"2025-09":820000,"2025-10":890000,"2025-11":760000,"2025-12":930000,"2026-01":980000,"2026-02":1050000,"2026-03":1100000,"2026-04":980000,"2026-05":1020000}},
  { id:2, nombre:"López, Martín G.",    cuit:"20-28765432-1", actividad:"Venta de cosas muebles",notas:"Revisar julio", facMensual:{"2025-06":1350000,"2025-07":1400000,"2025-08":1500000,"2025-09":1600000,"2025-10":1700000,"2025-11":1550000,"2025-12":1800000,"2026-01":1900000,"2026-02":2100000,"2026-03":2200000,"2026-04":2050000,"2026-05":2150000}},
  { id:3, nombre:"Fernández, Diego R.", cuit:"20-35123456-7", actividad:"Servicios",             notas:"", facMensual:{"2025-06":4800000,"2025-07":5000000,"2025-08":5200000,"2025-09":5500000,"2025-10":5800000,"2025-11":5600000,"2025-12":6000000,"2026-01":6200000,"2026-02":6500000,"2026-03":6800000,"2026-04":6400000,"2026-05":6600000}},
  { id:4, nombre:"Gómez, Patricia S.",  cuit:"27-29876543-2", actividad:"Servicios",             notas:"", facMensual:{"2025-06":720000,"2025-07":690000,"2025-08":710000,"2025-09":730000,"2025-10":750000,"2025-11":720000,"2025-12":780000,"2026-01":800000,"2026-02":820000,"2026-03":850000,"2026-04":830000,"2026-05":840000}},
];

const NAV = [
  { id:"dashboard",       icon:"⊞",  label:"Dashboard" },
  { id:"monotributistas", icon:"📋", label:"Monotributistas" },
  { id:"resp_inscriptos", icon:"🧾", label:"Resp. Inscriptos", pronto:true },
  { id:"sociedades",      icon:"🏢", label:"Sociedades",       pronto:true },
  { id:"vencimientos",    icon:"📅", label:"Vencimientos",     pronto:true },
  { id:"reportes",        icon:"📊", label:"Reportes",         pronto:true },
];export default function App() {
  const [seccion, setSeccion] = useState("dashboard");
  const [mono, setMono]       = useState(SEED_MONO);
  const [sidebarOpen, setSidebar] = useState(true);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f1f4f9",fontFamily:"'IBM Plex Sans',sans-serif",color:"#1a1a2e"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;600&family=Sora:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#c8d0e0;border-radius:3px;}
        input,select,textarea{font-family:'IBM Plex Sans',sans-serif;outline:none;}
        button{cursor:pointer;font-family:'IBM Plex Sans',sans-serif;}
        .nav-item{display:flex;align-items:center;gap:10px;padding:9px 16px;border-radius:10px;font-size:13.5px;font-weight:500;color:#64748b;background:none;border:none;width:100%;text-align:left;transition:all .15s;position:relative;}
        .nav-item:hover{background:#e8edf5;color:#1a1a2e;}
        .nav-item.active{background:#1e3a5f;color:white;font-weight:600;}
        .nav-item.pronto{opacity:.5;}
        .soon{position:absolute;right:10px;background:#e2e8f0;color:#94a3b8;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;text-transform:uppercase;}
        .topbar{background:white;border-bottom:1px solid #e8edf5;padding:0 28px;height:56px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 4px #0000000a;}
        .card{background:white;border-radius:14px;box-shadow:0 1px 8px #0000000d;padding:20px;}
        .kpi{background:white;border-radius:12px;padding:18px 20px;box-shadow:0 1px 6px #0000000d;border-left:4px solid transparent;}
        .kpi-n{font-family:'IBM Plex Mono',monospace;font-size:28px;font-weight:600;line-height:1;margin-bottom:4px;}
        .kpi-l{font-size:12px;color:#64748b;font-weight:500;}
        .btn-p{background:linear-gradient(135deg,#1e3a5f,#0f3460);color:white;border:none;padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;box-shadow:0 2px 8px #1e3a5f25;}
        .btn-p:hover{opacity:.88;}
        .btn-o{background:white;border:1.5px solid #e2e8f0;color:#1e3a5f;padding:8px 14px;border-radius:9px;font-size:12.5px;font-weight:600;}
        .btn-o:hover{background:#f0f4ff;}
        .btn-s{background:none;border:1.5px solid #e2e8f0;color:#555;padding:4px 10px;border-radius:6px;font-size:11.5px;font-weight:500;transition:all .15s;}
        .btn-s:hover{border-color:#1e3a5f;color:#1e3a5f;}
        .btn-s.del:hover{background:#fef2f2;border-color:#ef4444;color:#ef4444;}
        .chip{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;border:1px solid;}
        .cat-b{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:7px;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;background:#1e3a5f;color:white;}
        .bar{height:6px;background:#e8edf5;border-radius:3px;overflow:hidden;}
        .bar-f{height:100%;border-radius:3px;transition:width .4s;}
        .tbl{width:100%;border-collapse:collapse;font-size:13px;}
        .tbl thead tr{background:#f8fafc;border-bottom:2px solid #e8edf5;}
        .tbl th{padding:10px 14px;text-align:left;font-size:10.5px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;}
        .tbl td{padding:11px 14px;border-bottom:1px solid #f1f4f9;vertical-align:middle;}
        .tbl tbody tr:last-child td{border-bottom:none;}
        .tbl tbody tr:hover td{background:#f8fafc;cursor:pointer;}
        .overlay{position:fixed;inset:0;background:#00000055;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(3px);}
        .modal{background:white;border-radius:18px;padding:28px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px #00000030;}
        .flabel{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px;}
        .finput{border:1.5px solid #e2e8f0;border-radius:8px;padding:9px 12px;font-size:13px;color:#1a1a2e;width:100%;}
        .finput:focus{border-color:#1e3a5f;}
        .side{position:fixed;right:0;top:0;bottom:0;width:400px;background:white;box-shadow:-4px 0 30px #00000012;z-index:80;overflow-y:auto;display:flex;flex-direction:column;}
        .side-hd{background:linear-gradient(135deg,#1a1a2e,#0f3460);color:white;padding:22px;flex-shrink:0;}
        .side-bd{padding:20px;flex:1;}
        .ctrl-card{border-radius:10px;padding:14px;margin-bottom:10px;border:1.5px solid;}
        .irow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #f1f4f9;font-size:13px;}
        .irow:last-child{border-bottom:none;}
        .mes-g{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px;}
        .mes-c{background:#f8fafc;border-radius:7px;padding:7px 6px;text-align:center;}
        .mes-c.hl{background:#eff6ff;}
        .mes-c.ov{background:#fef2f2;}
        @keyframes fi{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
        .ani{animation:fi .2s ease;}
        .pronto-banner{display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:16px;color:#94a3b8;}
        .search{background:white;border:1.5px solid #e2e8f0;border-radius:9px;padding:8px 13px;font-size:13px;width:220px;color:#1a1a2e;}
        .search:focus{border-color:#1e3a5f;}
        .fbtn{background:white;border:1.5px solid #e2e8f0;border-radius:9px;padding:8px 14px;font-size:12.5px;color:#444;font-weight:500;transition:all .15s;}
        .fbtn:hover{border-color:#1e3a5f;color:#1e3a5f;}
        .fbtn.act{background:#1e3a5f;border-color:#1e3a5f;color:white;}
      `}</style>

      <aside style={{width:sidebarOpen?220:0,minWidth:sidebarOpen?220:0,background:"white",borderRight:"1px solid #e8edf5",display:"flex",flexDirection:"column",transition:"all .2s",overflow:"hidden",flexShrink:0,boxShadow:"2px 0 8px #0000000a"}}>
        <div style={{padding:"18px 16px 12px",borderBottom:"1px solid #f1f4f9"}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:16,color:"#1e3a5f"}}>⚖ EstudioCont</div>
          <div style={{fontSize:10.5,color:"#94a3b8",marginTop:3,letterSpacing:".4px",textTransform:"uppercase"}}>Sistema Contable</div>
        </div>
        <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(n=>(
            <button key={n.id} className={`nav-item${seccion===n.id?" active":""}${n.pronto?" pronto":""}`} onClick={()=>setSeccion(n.id)}>
              <span style={{fontSize:15}}>{n.icon}</span>
              <span>{n.label}</span>
              {n.pronto&&<span className="soon">Pronto</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"12px 16px",borderTop:"1px solid #f1f4f9",fontSize:11,color:"#94a3b8"}}>
          <div style={{fontWeight:600,color:"#64748b",marginBottom:2}}>Tabla AFIP vigente</div>
          <div>01/02/2026 · Cat. A→K</div>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <header className="topbar">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <button onClick={()=>setSidebar(v=>!v)} style={{background:"none",border:"none",color:"#64748b",fontSize:18,padding:4}}>☰</button>
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,color:"#1e3a5f"}}>
              {NAV.find(n=>n.id===seccion)?.icon} {NAV.find(n=>n.id===seccion)?.label}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:12,color:"#94a3b8",fontFamily:"'IBM Plex Mono',monospace"}}>
              {hoy.toLocaleDateString("es-AR",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
            </div>
            <div style={{width:32,height:32,background:"#1e3a5f",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:700}}>C</div>
          </div>
        </header>
        <main style={{flex:1,overflow:"auto",padding:"24px 28px"}}>
          {seccion==="dashboard"       && <Dashboard mono={mono}/>}
          {seccion==="monotributistas" && <Monotributistas clientes={mono} setClientes={setMono}/>}
          {(seccion==="resp_inscriptos"||seccion==="sociedades"||seccion==="vencimientos"||seccion==="reportes") && <Pronto seccion={seccion}/>}
        </main>
      </div>
    </div>
  );
}

function Dashboard({mono}){
  const metricas=useMemo(()=>mono.map(c=>({...c,...calcMetricas(c)})),[mono]);
  const criticos=metricas.filter(c=>c.maxPct>=85).sort((a,b)=>b.maxPct-a.maxPct);
  const kpis=[
    {n:mono.length,l:"Monotributistas",c:"#1e3a5f",b:"#1e3a5f"},
    {n:metricas.filter(c=>c.maxPct<70).length,l:"✅ En orden",c:"#22c55e",b:"#22c55e"},
    {n:metricas.filter(c=>c.maxPct>=70&&c.maxPct<85).length,l:"🟡 Con atención",c:"#eab308",b:"#eab308"},
    {n:metricas.filter(c=>c.maxPct>=85&&c.maxPct<100).length,l:"🔴 Riesgo alto",c:"#f97316",b:"#f97316"},
    {n:metricas.filter(c=>c.maxPct>=100).length,l:"⛔ Excluidos",c:"#ef4444",b:"#ef4444"},
  ];
  return(
    <div className="ani">
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:"#1e3a5f"}}>Bienvenida 👋</div>
        <div style={{fontSize:13.5,color:"#64748b",marginTop:3}}>Resumen general · {MESES_FULL[MES]} {ANO}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:22}}>
        {kpis.map(k=><div key={k.l} className="kpi" style={{borderLeftColor:k.b}}><div className="kpi-n" style={{color:k.c}}>{k.n}</div><div className="kpi-l">{k.l}</div></div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="card">
          <div style={{fontWeight:700,fontSize:14,color:"#1e3a5f",marginBottom:14}}>🚨 Requieren atención</div>
          {criticos.length===0
            ?<div style={{color:"#94a3b8",fontSize:13,padding:"20px 0",textAlign:"center"}}>✅ Todos en orden</div>
            :criticos.map(c=>{const s=semaforo(c.maxPct);return(
              <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f4f9"}}>
                <div><div style={{fontWeight:600,fontSize:13}}>{c.nombre}</div><div style={{fontSize:11.5,color:"#94a3b8",marginTop:1}}>{c.cuit}</div></div>
                <div style={{textAlign:"right"}}><span className="chip" style={{background:s.bg,color:s.fg,borderColor:s.brd}}>{s.label}</span><div style={{fontSize:11,color:"#94a3b8",marginTop:3}}>Cat. {c.catM?.cat||"K+"} · {PCT(c.maxPct)}</div></div>
              </div>);})
          }
        </div>
        <div className="card">
          <div style={{fontWeight:700,fontSize:14,color:"#1e3a5f",marginBottom:14}}>📅 Próximas recategorizaciones</div>
          <div style={{background:"#eff6ff",borderRadius:10,padding:14,marginBottom:10,border:"1px solid #bfdbfe"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#1e40af",marginBottom:4}}>Recategorización Julio {ANO}</div>
            <div style={{fontSize:12.5,color:"#3b82f6"}}>Período: Enero → Julio {ANO}</div>
            <div style={{fontSize:12.5,color:"#3b82f6",marginTop:2}}>{metricas.filter(c=>c.pctEJ>=70).length} cliente/s a controlar</div>
          </div>
          <div style={{background:"#f0fdf4",borderRadius:10,padding:14,border:"1px solid #bbf7d0"}}>
            <div style={{fontWeight:700,fontSize:13,color:"#166534",marginBottom:4}}>Recategorización Enero {ANO+1}</div>
            <div style={{fontSize:12.5,color:"#22c55e"}}>Período: Enero → Diciembre {ANO}</div>
            <div style={{fontSize:12.5,color:"#22c55e",marginTop:2}}>{metricas.filter(c=>c.pctAn>=70).length} cliente/s a controlar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pronto({seccion}){
  const info={
    resp_inscriptos:{icon:"🧾",title:"Responsables Inscriptos",desc:"Control de IVA, Ganancias, IIBB y estados de resultado."},
    sociedades:     {icon:"🏢",title:"Sociedades & Fideicomisos",desc:"Cierres de ejercicio, balances y Ganancias Sociedades."},
    vencimientos:   {icon:"📅",title:"Calendario de Vencimientos",desc:"Alertas automáticas de vencimientos impositivos."},
    reportes:       {icon:"📊",title:"Reportes & Exportación",desc:"Estados de resultado, balances y exportación a Excel/PDF."},
  };
  const i=info[seccion]||{icon:"🔧",title:"En desarrollo",desc:"Próximamente."};
  return(
    <div className="pronto-banner ani">
      <div style={{fontSize:52}}>{i.icon}</div>
      <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:"#1e3a5f"}}>{i.title}</div>
      <div style={{fontSize:14,maxWidth:360,textAlign:"center",lineHeight:1.6}}>{i.desc}</div>
      <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:10,padding:"12px 20px",fontSize:13,color:"#1e40af",fontWeight:600}}>🚧 Módulo en construcción</div>
    </div>
  );
}function Monotributistas({clientes,setClientes}){
  const [modal,setModal]=useState(false);
  const [editando,setEdit]=useState(null);
  const [detalle,setDet]=useState(null);
  const [busq,setBusq]=useState("");
  const [filtro,setFiltro]=useState("todos");
  const [tablaRef,setTabla]=useState(false);

  const filtrados=useMemo(()=>clientes.filter(c=>{
    const {maxPct}=calcMetricas(c);
    const mb=c.nombre.toLowerCase().includes(busq.toLowerCase())||c.cuit.includes(busq);
    const mf=filtro==="todos"||(filtro==="ok"&&maxPct<70)||(filtro==="atencion"&&maxPct>=70&&maxPct<85)||(filtro==="riesgo"&&maxPct>=85&&maxPct<100)||(filtro==="excluido"&&maxPct>=100);
    return mb&&mf;
  }),[clientes,busq,filtro]);

  const kpis=useMemo(()=>{
    const p=clientes.map(c=>calcMetricas(c).maxPct);
    return{total:clientes.length,ok:p.filter(x=>x<70).length,atencion:p.filter(x=>x>=70&&x<85).length,riesgo:p.filter(x=>x>=85&&x<100).length,excluidos:p.filter(x=>x>=100).length};
  },[clientes]);

  const guardar=f=>{
    if(f.id) setClientes(p=>p.map(c=>c.id===f.id?f:c));
    else setClientes(p=>[...p,{...f,id:Date.now(),facMensual:f.facMensual||{}}]);
    setModal(false);setEdit(null);
    if(detalle?.id===f.id)setDet(f);
  };
  const eliminar=id=>{
    if(confirm("¿Eliminar cliente?")){setClientes(p=>p.filter(c=>c.id!==id));if(detalle?.id===id)setDet(null);}
  };

  return(
    <div className="ani" style={{paddingRight:detalle?420:0,transition:"padding .25s"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:18}}>
        {[{n:kpis.total,l:"Total",c:"#1e3a5f",b:"#1e3a5f"},{n:kpis.ok,l:"✅ OK",c:"#22c55e",b:"#22c55e"},{n:kpis.atencion,l:"🟡 Atención",c:"#eab308",b:"#eab308"},{n:kpis.riesgo,l:"🔴 Riesgo",c:"#f97316",b:"#f97316"},{n:kpis.excluidos,l:"⛔ Excluidos",c:"#ef4444",b:"#ef4444"}].map(k=>(
          <div key={k.l} className="kpi" style={{borderLeftColor:k.b}}><div className="kpi-n" style={{color:k.c}}>{k.n}</div><div className="kpi-l">{k.l}</div></div>
        ))}
      </div>
      <div style={{marginBottom:12}}><button className="btn-o" onClick={()=>setTabla(v=>!v)}>{tablaRef?"▲ Ocultar":"▼ Ver"} tabla AFIP vigente</button></div>
      {tablaRef&&(
        <div className="card ani" style={{marginBottom:16,overflowX:"auto",padding:16}}>
          <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:13,color:"#1e3a5f",marginBottom:12}}>Categorías Monotributo — Vigente desde 01/02/2026</div>
          <table className="tbl" style={{fontSize:12}}>
            <thead><tr>{["Cat.","Tope Anual","Tope ÷12/mes","Imp.Serv.","Imp.Ventas","SIPA","Obra Social","Total Serv.","Total Ventas"].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>{CATEGORIAS.map(c=><tr key={c.cat}><td><span className="cat-b" style={{width:24,height:24,fontSize:12}}>{c.cat}</span></td><td style={{fontFamily:"'IBM Plex Mono',monospace",color:"#1e3a5f",fontWeight:600}}>{ARS(c.tope)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{ARS(c.tope/12)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace"}}>{ARS(c.impServ)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace"}}>{ARS(c.impVenta)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace"}}>{ARS(c.sipa)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace"}}>{ARS(c.obraSocial)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#22c55e"}}>{ARS(c.impServ+c.sipa+c.obraSocial)}</td><td style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#22c55e"}}>{ARS(c.impVenta+c.sipa+c.obraSocial)}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input className="search" placeholder="🔍 Nombre o CUIT..." value={busq} onChange={e=>setBusq(e.target.value)}/>
        {[{k:"todos",l:"Todos"},{k:"ok",l:"✅ OK"},{k:"atencion",l:"🟡 Atención"},{k:"riesgo",l:"🔴 Riesgo"},{k:"excluido",l:"⛔ Excluido"}].map(f=>(
          <button key={f.k} className={`fbtn${filtro===f.k?" act":""}`} onClick={()=>setFiltro(f.k)}>{f.l}</button>
        ))}
        <button className="btn-p" style={{marginLeft:"auto"}} onClick={()=>{setEdit(null);setModal(true);}}>+ Nuevo cliente</button>
      </div>
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <table className="tbl">
          <thead><tr><th>Cliente</th><th>CUIT</th><th>Cat.</th><th>Tope ÷12</th><th>Fact. {MESES[MES]}</th><th>Año móvil 12m</th><th>Ene→Jul</th><th>Ene→Dic</th><th>Cuota/mes</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {filtrados.length===0&&<tr><td colSpan={11} style={{textAlign:"center",padding:28,color:"#94a3b8"}}>Sin resultados.</td></tr>}
            {filtrados.map(c=>{
              const m=calcMetricas(c);
              const s=semaforo(m.maxPct),sM=semaforo(m.pctM),sEJ=semaforo(m.pctEJ),sAn=semaforo(m.pctAn),sMes=semaforo(m.pctMes);
              return(
                <tr key={c.id} onClick={()=>setDet(c)}>
                  <td><div style={{fontWeight:600,fontSize:13}}>{c.nombre}</div>{c.notas&&<div style={{fontSize:10.5,color:"#94a3b8",marginTop:1}}>📝 {c.notas}</div>}</td>
                  <td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,color:"#64748b"}}>{c.cuit}</td>
                  <td>{m.catM?<span className="cat-b">{m.catM.cat}</span>:<span style={{color:"#ef4444",fontWeight:700,fontSize:12}}>K+</span>}</td>
                  <td><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"#1e3a5f",fontWeight:600}}>{ARS(m.topeMes)}</div><div style={{fontSize:10,color:"#94a3b8"}}>tope÷12</div></td>
                  <td><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600,color:sMes.fg}}>{ARS(m.facMesAct)}</div><div className="bar" style={{width:80,marginTop:3}}><div className="bar-f" style={{width:PCT(m.pctMes),background:sMes.fg}}/></div><div style={{fontSize:10,color:sMes.fg,fontWeight:600}}>{PCT(m.pctMes)}</div></td>
                  <td><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600}}>{ARS(m.totalM)}</div><div className="bar" style={{width:90,marginTop:3}}><div className="bar-f" style={{width:PCT(m.pctM),background:sM.fg}}/></div><div style={{fontSize:10,color:sM.fg,fontWeight:600}}>{PCT(m.pctM)}</div></td>
                  <td><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600}}>{ARS(m.totalEJ)}</div><div className="bar" style={{width:90,marginTop:3}}><div className="bar-f" style={{width:PCT(m.pctEJ),background:sEJ.fg}}/></div><div style={{fontSize:10,color:sEJ.fg,fontWeight:600}}>{PCT(m.pctEJ)}</div></td>
                  <td><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600}}>{ARS(m.totalAn)}</div><div className="bar" style={{width:90,marginTop:3}}><div className="bar-f" style={{width:PCT(m.pctAn),background:sAn.fg}}/></div><div style={{fontSize:10,color:sAn.fg,fontWeight:600}}>{PCT(m.pctAn)}</div></td>
                  <td style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600,color:"#1e3a5f"}}>{ARS(m.cuota)}</td>
                  <td><span className="chip" style={{background:s.bg,color:s.fg,borderColor:s.brd}}>{s.label}</span></td>
                  <td onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:5}}><button className="btn-s" onClick={()=>{setEdit(c);setModal(true);}}>✏</button><button className="btn-s del" onClick={()=>eliminar(c.id)}>×</button></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:8,fontSize:12,color:"#94a3b8"}}>{filtrados.length} de {clientes.length} clientes · Clic en fila para ver detalle</div>
      {detalle&&<DetalleSide c={detalle} onCerrar={()=>setDet(null)} onEditar={c=>{setEdit(c);setModal(true);}}/>}
      {modal&&<div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}><FormMono inicial={editando} onGuardar={guardar} onCerrar={()=>{setModal(false);setEdit(null);}}/></div>}
    </div>
  );
}

function DetalleSide({c,onCerrar,onEditar}){
  const m=calcMetricas(c);
  const [anioV,setAnio]=useState(ANO);
  const sg=semaforo(m.maxPct);
  const mesesAnio=Array.from({length:12},(_,i)=>{const k=ym(anioV,i);const v=c.facMensual[k]||0;const p=m.topeMes?(v/m.topeMes)*100:0;return{mes:MESES[i],k,v,p};});
  const controles=[
    {titulo:"📅 Año móvil — últimos 12 meses",desc:`${(()=>{const d=new Date(ANO,MES-11,1);return`${MESES[d.getMonth()]} ${d.getFullYear()}`;})()}  →  ${MESES[MES]} ${ANO}`,total:m.totalM,cat:m.catM,pct:m.pctM,alerta:"Recategorización permanente si supera el tope"},
    {titulo:"📊 Semestral — Ene → Jul",desc:`Recategorización: Julio ${ANO}`,total:m.totalEJ,cat:m.catEJ,pct:m.pctEJ,alerta:"Debe recategorizarse en Julio"},
    {titulo:"📆 Anual — Ene → Dic",desc:`Recategorización: Enero ${ANO+1}`,total:m.totalAn,cat:m.catAn,pct:m.pctAn,alerta:`Debe recategorizarse en Enero ${ANO+1}`},
  ];
  return(
    <div className="side ani">
      <div className="side-hd">
        <button onClick={onCerrar} style={{background:"none",border:"none",color:"#93c5fd",fontSize:12,marginBottom:10,padding:0}}>← Cerrar</button>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:16,marginBottom:2}}>{c.nombre}</div>
        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,color:"#93c5fd",marginBottom:12}}>{c.cuit}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {m.catM&&<span className="cat-b" style={{fontSize:16,width:38,height:38}}>{m.catM.cat}</span>}
          <span className="chip" style={{background:sg.bg+"cc",color:sg.fg,borderColor:sg.fg+"40"}}>{sg.label}</span>
          <span style={{fontSize:11,color:"#93c5fd"}}>{c.actividad}</span>
        </div>
      </div>
      <div className="side-bd">
        <div style={{background:"#eff6ff",borderRadius:10,padding:14,marginBottom:12,border:"1px solid #bfdbfe"}}>
          <div style={{fontSize:11,color:"#1e40af",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>📐 Mensualización del tope</div>
          <div className="irow"><span style={{color:"#555"}}>Tope anual Cat. {m.catM?.cat}</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{ARS(m.catM?.tope)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontWeight:700,fontSize:14,borderTop:"1px solid #bfdbfe",marginTop:4}}><span style={{color:"#1e40af"}}>÷ 12 = Tope/mes</span><span style={{fontFamily:"'IBM Plex Mono',monospace",color:"#1e40af"}}>{ARS(m.topeMes)}</span></div>
          <div style={{marginTop:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"#666"}}>Facturado {MESES_FULL[MES]}</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:semaforo(m.pctMes).fg}}>{ARS(m.facMesAct)}</span></div>
            <div className="bar"><div className="bar-f" style={{width:PCT(m.pctMes),background:semaforo(m.pctMes).fg}}/></div>
            <div style={{fontSize:11,color:semaforo(m.pctMes).fg,fontWeight:600,marginTop:3}}>{PCT(m.pctMes)} del tope mensual · Margen: {ARS(Math.max(0,m.topeMes-m.facMesAct))}</div>
          </div>
        </div>
        {controles.map(ctrl=>{const cs=semaforo(ctrl.pct);return(
          <div key={ctrl.titulo} className="ctrl-card" style={{borderColor:cs.fg+"50",background:cs.bg}}>
            <div style={{fontSize:12,fontWeight:700,color:cs.fg,marginBottom:2}}>{ctrl.titulo}</div>
            <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>{ctrl.desc}</div>
            <div className="irow"><span style={{color:"#555",fontSize:12}}>Facturado</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:13}}>{ARS(ctrl.total)}</span></div>
            <div className="irow"><span style={{color:"#555",fontSize:12}}>Tope Cat. {ctrl.cat?.cat||"K+"}</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{ctrl.cat?ARS(ctrl.cat.tope):"—"}</span></div>
            <div className="bar" style={{margin:"8px 0 4px"}}><div className="bar-f" style={{width:PCT(ctrl.pct),background:cs.fg}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}><span style={{color:cs.fg,fontWeight:700}}>{PCT(ctrl.pct)} utilizado</span><span style={{color:"#64748b"}}>Margen: {ARS(Math.max(0,(ctrl.cat?.tope||0)-ctrl.total))}</span></div>
            {ctrl.pct>=70&&<div style={{marginTop:6,fontSize:11,color:cs.fg,background:cs.fg+"15",borderRadius:6,padding:"5px 8px"}}>⚠ {ctrl.alerta}</div>}
          </div>);})}
        <div style={{background:"#f8fafc",borderRadius:10,padding:14,marginBottom:12}}>
          <div style={{fontSize:11,color:"#1e3a5f",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:8}}>💳 Cuota mensual</div>
          {m.catM&&[{l:"Impuesto integrado",v:c.actividad==="Venta de cosas muebles"?m.catM.impVenta:m.catM.impServ},{l:"Aporte SIPA",v:m.catM.sipa},{l:"Obra social",v:m.catM.obraSocial}].map(r=><div key={r.l} className="irow"><span style={{color:"#555"}}>{r.l}</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600}}>{ARS(r.v)}</span></div>)}
          <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0 0",fontWeight:700,fontSize:14}}><span style={{color:"#1e3a5f"}}>TOTAL/MES</span><span style={{fontFamily:"'IBM Plex Mono',monospace",color:"#1e3a5f"}}>{ARS(m.cuota)}</span></div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:".5px"}}>📋 Facturación mensual</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button className="btn-s" onClick={()=>setAnio(v=>v-1)}>◀</button>
              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:700}}>{anioV}</span>
              <button className="btn-s" onClick={()=>setAnio(v=>v+1)} disabled={anioV>=ANO}>▶</button>
            </div>
          </div>
          <div className="mes-g">
            {mesesAnio.map(({mes,k,v,p})=>(
              <div key={k} className={`mes-c${k===ym(ANO,MES)?" hl":""}${p>=100?" ov":""}`}>
                <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{mes}</div>
                <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:600,color:p>=85?"#f97316":p>=70?"#eab308":"#1a1a2e",marginTop:2}}>{v>0?`$${(v/1000).toFixed(0)}K`:"—"}</div>
                {v>0&&<div style={{height:3,background:"#e2e8f0",borderRadius:2,marginTop:3}}><div style={{height:"100%",width:PCT(p),background:p>=85?"#f97316":"#22c55e",borderRadius:2}}/></div>}
              </div>
            ))}
          </div>
        </div>
        {c.notas&&<div style={{marginBottom:12,background:"#fefce8",borderRadius:8,padding:10,fontSize:12.5,color:"#666",border:"1px solid #fef08a"}}>📝 {c.notas}</div>}
        <button className="btn-p" style={{width:"100%",padding:12,borderRadius:10}} onClick={()=>onEditar(c)}>✏ Editar / cargar facturación</button>
      </div>
    </div>
  );
}

function FormMono({inicial,onGuardar,onCerrar}){
  const [paso,setPaso]=useState(1);
  const [form,setForm]=useState(inicial||{nombre:"",cuit:"",actividad:"Servicios",notas:"",facMensual:{}});
  const [anioE,setAnioE]=useState(ANO);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setFM=(k,v)=>setForm(f=>({...f,facMensual:{...f.facMensual,[k]:v?Number(v):0}}));
  const prev=useMemo(()=>{const t=sumaP(form.facMensual,ultimos12());const cat=getCat(t);const pct=cat?(t/cat.tope)*100:100;return{t,cat,pct,cuota:getCuota(cat,form.actividad),topeMes:cat?cat.tope/12:0};},[form.facMensual,form.actividad]);
  return(
    <div className="modal ani">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:18,color:"#1e3a5f"}}>{inicial?"✏ Editar":"➕ Nuevo"} monotributista</div>
        <div style={{display:"flex",gap:6}}>
          {[1,2].map(p=><button key={p} className="btn-s" style={paso===p?{background:"#1e3a5f",color:"white",borderColor:"#1e3a5f"}:{}} onClick={()=>setPaso(p)}>{p===1?"1. Datos":"2. Facturación"}</button>)}
          <button onClick={onCerrar} style={{background:"none",border:"none",color:"#aaa",fontSize:20,marginLeft:4}}>×</button>
        </div>
      </div>
      {paso===1&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
          <div style={{gridColumn:"1/-1"}}><label className="flabel">Nombre / Razón social</label><input className="finput" placeholder="Apellido, Nombre" value={form.nombre} onChange={e=>set("nombre",e.target.value)}/></div>
          <div><label className="flabel">CUIT</label><input className="finput" placeholder="20-12345678-9" value={form.cuit} onChange={e=>set("cuit",e.target.value)}/></div>
          <div><label className="flabel">Actividad</label><select className="finput" value={form.actividad} onChange={e=>set("actividad",e.target.value)}>{ACTIVIDADES.map(a=><option key={a}>{a}</option>)}</select></div>
          <div style={{gridColumn:"1/-1"}}><label className="flabel">Notas internas</label><textarea className="finput" rows={2} style={{resize:"vertical"}} value={form.notas} onChange={e=>set("notas",e.target.value)} placeholder="Observaciones..."/></div>
          {prev.t>0&&<div style={{gridColumn:"1/-1",background:"#f8fafc",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#94a3b8",fontWeight:700,marginBottom:6}}>VISTA PREVIA</div><div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>{prev.cat&&<span className="cat-b">{prev.cat.cat}</span>}<span className="chip" style={{background:semaforo(prev.pct).bg,color:semaforo(prev.pct).fg,borderColor:semaforo(prev.pct).brd}}>{semaforo(prev.pct).label}</span><span style={{fontSize:12,color:"#555"}}>Cuota: <strong>{ARS(prev.cuota)}/mes</strong></span><span style={{fontSize:12,color:"#555"}}>Tope/mes: <strong>{ARS(prev.topeMes)}</strong></span></div></div>}
        </div>
      )}
      {paso===2&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,color:"#555",fontWeight:600}}>Facturación mensual</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}><button className="btn-s" onClick={()=>setAnioE(v=>v-1)}>◀</button><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:13,fontWeight:700}}>{anioE}</span><button className="btn-s" onClick={()=>setAnioE(v=>v+1)}>▶</button></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {Array.from({length:12},(_,i)=>{const k=ym(anioE,i);const v=form.facMensual[k]||"";return(<div key={k}><label className="flabel" style={{color:k===ym(ANO,MES)?"#1e3a5f":undefined}}>{MESES_FULL[i]} {anioE}{k===ym(ANO,MES)?" ← actual":""}</label><input className="finput" type="number" placeholder="0" value={v} onChange={e=>setFM(k,e.target.value)} style={{borderColor:k===ym(ANO,MES)?"#1e3a5f":undefined}}/></div>);})}
          </div>
          {prev.t>0&&<div style={{marginTop:12,background:"#eff6ff",borderRadius:9,padding:11,fontSize:12.5,color:"#1e40af"}}>Año móvil: <strong style={{fontFamily:"'IBM Plex Mono',monospace"}}>{ARS(prev.t)}</strong>{prev.cat&&<> · Cat. <strong>{prev.cat.cat}</strong> · {PCT(prev.pct)} del tope</>}</div>}
        </div>
      )}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:20}}>
        <button className="btn-s" onClick={onCerrar} style={{padding:"8px 16px"}}>Cancelar</button>
        {paso===1&&<button className="btn-p" onClick={()=>setPaso(2)}>Siguiente →</button>}
        {paso===2&&<><button className="btn-s" onClick={()=>setPaso(1)} style={{padding:"8px 16px"}}>← Atrás</button><button className="btn-p" onClick={()=>{if(form.nombre&&form.cuit)onGuardar(form);}}>{inicial?"Guardar cambios":"Agregar cliente"}</button></>}
      </div>
    </div>
  );
}
