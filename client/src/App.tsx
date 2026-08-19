import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MapPin, Search, ArrowRight, ChevronLeft, Map as MapIcon } from "lucide-react";
import { api } from "./api";
import type { Floor, Product, Section } from "./types";
import { ShowroomMap } from "./components/ShowroomMap";

const categories = ["Sarees","Bridal","Lehenga","Gowns","Churidar","Jewellery"];

function Shell({children}:{children:React.ReactNode}) {
  return <main className="min-h-screen bg-[#faf7f2]">
    <div className="mx-auto min-h-screen max-w-3xl bg-[#fffdf9] shadow-sm">
      <header className="sticky top-0 z-20 border-b bg-[#fffdf9]/95 px-5 py-4 backdrop-blur">
        <Link to="/find" className="text-decoration-none">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-800">Maharani</div>
          <div className="text-lg font-bold text-stone-900">Wedding Collections</div>
        </Link>
      </header>
      {children}
    </div>
  </main>
}

function Home() {
  const navigate = useNavigate();
  const [q,setQ]=useState("");
  const submit=(e:React.FormEvent)=>{e.preventDefault(); if(q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)};
  return <Shell>
    <section className="px-5 pb-28 pt-10">
      <div className="mb-3 text-sm font-semibold text-amber-800">Welcome to Maharani</div>
      <h1 className="max-w-xl text-4xl font-black leading-tight text-stone-950">What are you looking for today?</h1>
      <p className="mt-3 text-stone-600">Find the correct floor and section in a few seconds.</p>
      <form onSubmit={submit} className="mt-8 flex rounded-2xl border bg-white p-2 shadow-sm">
        <Search className="ml-3 mt-3 h-5 w-5 text-stone-400"/>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products or sections"
          className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none"/>
        <button className="rounded-xl bg-stone-900 px-4 font-bold text-white">Find</button>
      </form>
      <h2 className="mt-10 text-lg font-bold">Popular categories</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {categories.map(c=><button key={c} onClick={()=>navigate(`/search?q=${encodeURIComponent(c)}`)}
          className="rounded-2xl border bg-white p-5 text-left font-bold shadow-sm hover:border-amber-800">{c}</button>)}
      </div>
      <button onClick={()=>navigate("/map")} className="mt-8 flex w-full items-center justify-between rounded-2xl bg-amber-900 p-5 text-left text-white">
        <span><span className="block text-xs uppercase tracking-wider text-amber-200">Showroom</span><span className="text-lg font-bold">View floor map</span></span>
        <MapIcon/>
      </button>
    </section>
  </Shell>
}

function SearchResults() {
  const [params]=useSearchParams();
  const q=params.get("q")||"";
  const [data,setData]=useState<{sections:Section[];products:Product[]}>({sections:[],products:[]});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);api.get("/search",{params:{q}}).then(r=>setData(r.data)).finally(()=>setLoading(false))},[q]);
  return <Shell><section className="px-5 py-7">
    <Link to="/find" className="mb-6 flex items-center gap-2 text-sm font-semibold text-stone-600"><ChevronLeft size={18}/> Back</Link>
    <h1 className="text-2xl font-black">Results for “{q}”</h1>
    {loading && <p className="mt-6">Searching…</p>}
    {!loading && data.sections.length===0 && data.products.length===0 && <div className="mt-8 rounded-2xl border bg-white p-6"><b>No result found.</b><p className="mt-2 text-stone-600">Try another product or section name.</p></div>}
    {data.sections.length>0 && <><h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-stone-500">Sections</h2>
      <div className="space-y-3">{data.sections.map(s=><Link key={s._id} to={`/section/${s._id}`} className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm">
        <div><div className="font-black">{s.name}</div><div className="mt-1 text-sm text-stone-500">{(s.floorId as Floor).name} · {s.code}</div></div><ArrowRight/>
      </Link>)}</div></>}
    {data.products.length>0 && <><h2 className="mt-8 mb-3 text-sm font-bold uppercase tracking-wider text-stone-500">Products</h2>
      <div className="space-y-3">{data.products.map(p=><Link key={p._id} to={`/section/${p.sectionId._id}`} className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm">
        <div><div className="font-black">{p.name}</div><div className="mt-1 text-sm text-stone-500">{p.sectionId.name} · {(p.sectionId.floorId as Floor).name}</div></div><ArrowRight/>
      </Link>)}</div></>}
  </section></Shell>
}

function SectionDetails() {
  const {id}=useParams();
  const [s,setS]=useState<Section|null>(null);
  useEffect(()=>{api.get(`/sections/${id}`).then(r=>setS(r.data))},[id]);
  if(!s) return <Shell><div className="p-6">Loading…</div></Shell>;
  const floor=s.floorId as Floor;
  return <Shell><section className="px-5 py-7">
    <Link to="/find" className="mb-7 flex items-center gap-2 text-sm font-semibold text-stone-600"><ChevronLeft size={18}/> Home</Link>
    <div className="rounded-3xl bg-stone-950 p-7 text-white">
      <div className="text-sm font-bold uppercase tracking-widest text-amber-300">{s.category}</div>
      <h1 className="mt-2 text-3xl font-black">{s.name}</h1>
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4">
        <MapPin className="text-amber-300"/><div><div className="font-bold">{floor.name}</div><div className="text-sm text-stone-300">Section {s.code}</div></div>
      </div>
    </div>
    <h2 className="mt-7 text-lg font-black">How to reach</h2>
    <ol className="mt-3 space-y-3">{s.navigationInstructions.map((x,i)=><li key={i} className="flex gap-3 rounded-2xl border bg-white p-4"><span className="font-black text-amber-800">{i+1}</span><span>{x}</span></li>)}</ol>
    <Link to={`/map?floorId=${floor._id}&sectionId=${s._id}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-900 px-5 py-4 font-black text-white">View location <MapIcon size={19}/></Link>
  </section></Shell>
}

function FloorMap() {
  const [params]=useSearchParams();
  const selected=params.get("sectionId")||undefined;
  const requestedFloor=params.get("floorId")||undefined;
  const [floors,setFloors]=useState<Floor[]>([]);
  const [floorId,setFloorId]=useState<string>("");
  const [map,setMap]=useState<any>(null);
  const [path,setPath]=useState<any[]>([]);
  useEffect(()=>{api.get("/floors").then(r=>{setFloors(r.data);setFloorId(requestedFloor||r.data[0]?._id||"")})},[requestedFloor]);
  useEffect(()=>{if(floorId) api.get(`/maps/${floorId}`).then(r=>setMap(r.data))},[floorId]);
  useEffect(()=>{if(selected) api.get(`/navigation/${selected}`).then(r=>setPath(r.data.path||[])); else setPath([])},[selected]);
  const floorPath=useMemo(()=>path.filter(p=>String(p.floorId)===floorId),[path,floorId]);
  return <Shell><section className="px-4 py-6">
    <Link to="/find" className="mb-5 flex items-center gap-2 text-sm font-semibold text-stone-600"><ChevronLeft size={18}/> Home</Link>
    <h1 className="px-1 text-2xl font-black">Showroom Map</h1>
    <div className="mt-5 flex gap-2 overflow-auto pb-2">{floors.map(f=><button key={f._id} onClick={()=>setFloorId(f._id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${floorId===f._id?"bg-stone-950 text-white":"border bg-white"}`}>{f.name}</button>)}</div>
    <div className="mt-4">{map ? <ShowroomMap width={map.width} height={map.height} sections={map.sections} landmarks={map.landmarks} selectedSectionId={selected} path={floorPath}/> : "Loading map…"}</div>
    <p className="mt-3 px-1 text-xs text-stone-500">Swipe horizontally to inspect the full floor plan.</p>
  </section></Shell>
}

function App() {
 return <BrowserRouter><Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/find" element={<Home/>}/>
   <Route path="/search" element={<SearchResults/>}/>
   <Route path="/section/:id" element={<SectionDetails/>}/>
   <Route path="/map" element={<FloorMap/>}/>
 </Routes></BrowserRouter>
}
export default App;
