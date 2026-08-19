import { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Building2, LayoutDashboard, LogOut, Map, Package, QrCode, Tags } from "lucide-react";
import { api } from "./api";

function Protected({children}:{children:React.ReactNode}) {
  return localStorage.getItem("token") ? children : <Navigate to="/login"/>;
}

function Layout({children}:{children:React.ReactNode}) {
 const loc=useLocation();
 const nav=[["/","Dashboard",LayoutDashboard],["/floors","Floors",Building2],["/sections","Sections",Tags],["/products","Products",Package],["/maps","Maps",Map],["/qr","QR Codes",QrCode],["/analytics","Analytics",BarChart3]] as const;
 return <div className="min-h-screen bg-stone-100 lg:flex">
  <aside className="border-b bg-stone-950 text-white lg:min-h-screen lg:w-64 lg:border-b-0">
   <div className="px-5 py-6"><div className="text-xs font-semibold uppercase tracking-[.3em] text-amber-300">Maharani</div><div className="font-black">Smart Store Admin</div></div>
   <nav className="flex gap-1 overflow-auto px-3 pb-3 lg:block lg:space-y-1">
    {nav.map(([to,label,Icon])=><Link key={to} to={to} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${loc.pathname===to?"bg-white text-stone-950":"text-stone-300 hover:bg-white/10"}`}><Icon size={18}/>{label}</Link>)}
   </nav>
  </aside>
  <main className="min-w-0 flex-1">
    <header className="flex justify-end border-b bg-white px-6 py-4"><button onClick={()=>{localStorage.removeItem("token");location.href="/login"}} className="flex items-center gap-2 text-sm font-bold"><LogOut size={16}/> Log out</button></header>
    <div className="p-5 lg:p-8">{children}</div>
  </main>
 </div>
}

function Login() {
 const nav=useNavigate(); const [email,setEmail]=useState("admin@maharani.local"); const [password,setPassword]=useState("Maharani@123"); const [err,setErr]=useState("");
 const submit=async(e:React.FormEvent)=>{e.preventDefault();try{const r=await api.post("/admin/auth/login",{email,password});localStorage.setItem("token",r.data.token);nav("/")}catch{setErr("Invalid email or password")}};
 return <div className="grid min-h-screen place-items-center bg-stone-950 px-5"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8">
  <div className="text-sm font-bold uppercase tracking-widest text-amber-800">Maharani</div><h1 className="mt-2 text-3xl font-black">Admin login</h1>
  {err&&<div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}
  <label className="mt-6 block text-sm font-bold">Email</label><input value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/>
  <label className="mt-4 block text-sm font-bold">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/>
  <button className="mt-6 w-full rounded-xl bg-stone-950 py-3 font-black text-white">Login</button>
 </form></div>
}

function Dashboard() {
 const [d,setD]=useState<any>(null);useEffect(()=>{api.get("/admin/dashboard").then(r=>setD(r.data))},[]);
 const cards=d?[["Total floors",d.floors],["Total sections",d.sections],["Total products",d.products],["Searches today",d.searchesToday]]:[];
 return <><h1 className="text-3xl font-black">Dashboard</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([l,v])=><div key={l} className="rounded-2xl bg-white p-6 shadow-sm"><div className="text-sm text-stone-500">{l}</div><div className="mt-2 text-4xl font-black">{v}</div></div>)}</div></>
}

type Field={key:string;label:string;type?:"text"|"number"|"select"|"textarea";options?:{value:string;label:string}[]};

function CrudPage({title,path,fields,initial}:{title:string;path:string;fields:Field[];initial:any}) {
 const [items,setItems]=useState<any[]>([]); const [form,setForm]=useState<any>(initial); const [editing,setEditing]=useState<string|null>(null);
 const load=()=>api.get(`/admin/${path}`).then(r=>setItems(r.data)); useEffect(()=>{load()},[path]);
 const save=async(e:React.FormEvent)=>{e.preventDefault(); if(editing) await api.put(`/admin/${path}/${editing}`,form); else await api.post(`/admin/${path}`,form); setForm(initial);setEditing(null);load()};
 const edit=(i:any)=>{setEditing(i._id);setForm(fields.reduce((a,f)=>({...a,[f.key]:i[f.key]??""}),{}))};
 const del=async(id:string)=>{if(confirm("Delete this item?")){await api.delete(`/admin/${path}/${id}`);load()}};
 return <div><h1 className="text-3xl font-black">{title}</h1>
  <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
   {fields.map(f=><label key={f.key} className={f.type==="textarea"?"md:col-span-2":""}><span className="mb-1 block text-sm font-bold">{f.label}</span>
    {f.type==="select"?<select value={form[f.key]??""} onChange={e=>setForm({...form,[f.key]:e.target.value})} className="w-full rounded-xl border p-3">{f.options?.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>
    :f.type==="textarea"?<textarea value={form[f.key]??""} onChange={e=>setForm({...form,[f.key]:e.target.value})} className="w-full rounded-xl border p-3" rows={3}/>
    :<input type={f.type||"text"} value={form[f.key]??""} onChange={e=>setForm({...form,[f.key]:f.type==="number"?Number(e.target.value):e.target.value})} className="w-full rounded-xl border p-3"/>}</label>)}
   <div className="md:col-span-2 flex gap-2"><button className="rounded-xl bg-stone-950 px-5 py-3 font-bold text-white">{editing?"Update":"Add"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm(initial)}} className="rounded-xl border px-5 py-3 font-bold">Cancel</button>}</div>
  </form>
  <div className="mt-6 overflow-auto rounded-2xl bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-stone-50"><tr><th className="p-4">Name</th><th className="p-4">Details</th><th className="p-4"></th></tr></thead><tbody>
   {items.map(i=><tr key={i._id} className="border-t"><td className="p-4 font-bold">{i.name||i.label||i.code||i.key}</td><td className="p-4 text-stone-500">{i.code||i.category||i.url||""}</td><td className="p-4 text-right"><button onClick={()=>edit(i)} className="mr-3 font-bold">Edit</button><button onClick={()=>del(i._id)} className="font-bold text-red-700">Delete</button></td></tr>)}
  </tbody></table></div>
 </div>
}

function Floors(){return <CrudPage title="Floors" path="floors" initial={{name:"",code:"",order:0,active:true}} fields={[{key:"name",label:"Floor name"},{key:"code",label:"Code"},{key:"order",label:"Order",type:"number"}]}/>}

function Sections() {
 const [floors,setFloors]=useState<any[]>([]);useEffect(()=>{api.get("/admin/floors").then(r=>setFloors(r.data))},[]);
 const [items,setItems]=useState<any[]>([]);const [f,setF]=useState<any>({name:"",code:"",floorId:"",category:"",description:"",x:80,y:80,width:250,height:180,navigationInstructions:"",keywords:""});
 const load=()=>api.get("/admin/sections").then(r=>setItems(r.data));useEffect(()=>{load()},[]);
 const save=async(e:React.FormEvent)=>{e.preventDefault();await api.post("/admin/sections",{name:f.name,code:f.code,floorId:f.floorId,category:f.category,description:f.description,mapPosition:{x:+f.x,y:+f.y,width:+f.width,height:+f.height},navigationInstructions:f.navigationInstructions.split("\n").filter(Boolean),keywords:f.keywords.split(",").map((x:string)=>x.trim()).filter(Boolean),alternativeNames:[]});load()};
 return <><h1 className="text-3xl font-black">Sections</h1><form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl bg-white p-5 md:grid-cols-2">
 {["name","code","category"].map(k=><input key={k} required placeholder={k} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} className="rounded-xl border p-3"/>)}
 <select required value={f.floorId} onChange={e=>setF({...f,floorId:e.target.value})} className="rounded-xl border p-3"><option value="">Choose floor</option>{floors.map(x=><option key={x._id} value={x._id}>{x.name}</option>)}</select>
 <input placeholder="Description" value={f.description} onChange={e=>setF({...f,description:e.target.value})} className="rounded-xl border p-3 md:col-span-2"/>
 {["x","y","width","height"].map(k=><input key={k} type="number" placeholder={k} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} className="rounded-xl border p-3"/>)}
 <textarea placeholder="Navigation instructions - one per line" value={f.navigationInstructions} onChange={e=>setF({...f,navigationInstructions:e.target.value})} className="rounded-xl border p-3 md:col-span-2"/>
 <input placeholder="Keywords, comma separated" value={f.keywords} onChange={e=>setF({...f,keywords:e.target.value})} className="rounded-xl border p-3 md:col-span-2"/>
 <button className="rounded-xl bg-stone-950 px-5 py-3 font-bold text-white md:col-span-2">Add section</button></form>
 <div className="mt-6 rounded-2xl bg-white p-4">{items.map(i=><div key={i._id} className="flex justify-between border-b p-3"><span><b>{i.name}</b> · {i.code}</span><button onClick={async()=>{if(confirm("Delete?")){await api.delete(`/admin/sections/${i._id}`);load()}}} className="font-bold text-red-700">Delete</button></div>)}</div></>
}

function Products(){
 const [sections,setSections]=useState<any[]>([]);useEffect(()=>{api.get("/admin/sections").then(r=>setSections(r.data))},[]);
 return <CrudPage title="Products" path="products" initial={{name:"",category:"",subcategory:"",sectionId:"",active:true}} fields={[
  {key:"name",label:"Product name"},{key:"category",label:"Category"},{key:"subcategory",label:"Subcategory"},
  {key:"sectionId",label:"Section",type:"select",options:[{value:"",label:"Choose section"},...sections.map(s=>({value:s._id,label:s.name}))]}
 ]}/>
}

function Maps(){
 const [floors,setFloors]=useState<any[]>([]);useEffect(()=>{api.get("/admin/floors").then(r=>setFloors(r.data))},[]);
 return <CrudPage title="Maps" path="maps" initial={{floorId:"",width:1000,height:700,active:true}} fields={[
  {key:"floorId",label:"Floor",type:"select",options:[{value:"",label:"Choose floor"},...floors.map(f=>({value:f._id,label:f.name}))]},
  {key:"width",label:"Width",type:"number"},{key:"height",label:"Height",type:"number"}
 ]}/>
}

function QRPage(){
 const [data,setData]=useState<any>(null);
 const gen=async()=>{const r=await api.post("/admin/qr/generate",{name:"Main Entrance"});setData(r.data)};
 return <><h1 className="text-3xl font-black">QR Code</h1><div className="mt-6 rounded-2xl bg-white p-6"><button onClick={gen} className="rounded-xl bg-stone-950 px-5 py-3 font-bold text-white">Generate Main Entrance QR</button>{data&&<div className="mt-6"><img src={data.dataUrl} className="w-72 max-w-full"/><a href={data.dataUrl} download="maharani-main-entrance-qr.png" className="mt-4 inline-block font-bold text-amber-900">Download PNG</a><div className="mt-2 break-all text-sm text-stone-500">{data.qr.url}</div></div>}</div></>
}

function Analytics(){
 const [d,setD]=useState<any>(null);useEffect(()=>{api.get("/admin/analytics/overview").then(r=>setD(r.data))},[]);
 return <><h1 className="text-3xl font-black">Analytics</h1><div className="mt-6 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl bg-white p-6"><h2 className="font-black">Top searches</h2>{d?.topSearches?.map((x:any)=><div key={x._id} className="flex justify-between border-b py-3"><span>{x._id||"(blank)"}</span><b>{x.count}</b></div>)}</div><div className="rounded-2xl bg-white p-6"><h2 className="font-black">No-result searches</h2>{d?.noResults?.map((x:any)=><div key={x._id} className="flex justify-between border-b py-3"><span>{x._id||"(blank)"}</span><b>{x.count}</b></div>)}</div></div></>
}

function App(){return <BrowserRouter><Routes>
 <Route path="/login" element={<Login/>}/>
 <Route path="*" element={<Protected><Layout><Routes>
  <Route path="/" element={<Dashboard/>}/><Route path="/floors" element={<Floors/>}/><Route path="/sections" element={<Sections/>}/><Route path="/products" element={<Products/>}/><Route path="/maps" element={<Maps/>}/><Route path="/qr" element={<QRPage/>}/><Route path="/analytics" element={<Analytics/>}/>
 </Routes></Layout></Protected>}/>
</Routes></BrowserRouter>}
export default App;
