import type { Section } from "../types";

type Props = {
  width:number;
  height:number;
  sections:Section[];
  landmarks:any[];
  selectedSectionId?:string;
  path?:any[];
};

export function ShowroomMap({ width, height, sections, landmarks, selectedSectionId, path=[] }:Props) {
  const points = path.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <div className="overflow-auto rounded-3xl border bg-white shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[760px] w-full h-auto bg-stone-50">
        <rect x="10" y="10" width={width-20} height={height-20} rx="28" fill="white" stroke="#d6d3d1" strokeWidth="5"/>
        {sections.map(s => {
          const active = s._id === selectedSectionId;
          const p = s.mapPosition;
          return <g key={s._id}>
            <rect x={p.x} y={p.y} width={p.width} height={p.height} rx="24"
              fill={active ? "#7c2d12" : "#f5f5f4"} stroke={active ? "#431407" : "#a8a29e"} strokeWidth={active ? 6 : 3}/>
            <text x={p.x+p.width/2} y={p.y+p.height/2} textAnchor="middle" dominantBaseline="middle"
              fontSize="28" fontWeight="700" fill={active ? "white" : "#292524"}>{s.name}</text>
          </g>
        })}
        {landmarks?.map((l:any) => <g key={l.key}>
          <circle cx={l.x} cy={l.y} r="14" fill="#1c1917"/>
          <text x={l.x} y={l.y-24} textAnchor="middle" fontSize="22" fontWeight="600">{l.label}</text>
        </g>)}
        {points && <polyline points={points} fill="none" stroke="#ea580c" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 18"/>}
      </svg>
    </div>
  );
}
