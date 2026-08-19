import { NavigationNode } from "../models/NavigationNode.js";

type NodeLike = {
  _id: any;
  key: string;
  x: number;
  y: number;
  floorId: any;
  type: string;
  label?: string;
  sectionId?: any;
  connections: Array<{ nodeId: any; distance: number }>;
};

export async function getRouteToSection(sectionId: string) {
  const nodes = await NavigationNode.find({}).lean() as unknown as NodeLike[];
  const start = nodes.find(n => n.type === "entrance");
  const target = nodes.find(n => String(n.sectionId || "") === sectionId);

  if (!start || !target) return { path: [], distance: null };

  const byId = new Map(nodes.map(n => [String(n._id), n]));
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const unvisited = new Set<string>();

  nodes.forEach(n => {
    const id = String(n._id);
    dist.set(id, Infinity);
    prev.set(id, null);
    unvisited.add(id);
  });
  dist.set(String(start._id), 0);

  while (unvisited.size) {
    let current: string | null = null;
    let best = Infinity;
    for (const id of unvisited) {
      const d = dist.get(id) ?? Infinity;
      if (d < best) { best = d; current = id; }
    }
    if (!current || best === Infinity) break;
    unvisited.delete(current);
    if (current === String(target._id)) break;

    const node = byId.get(current);
    if (!node) continue;
    for (const edge of node.connections || []) {
      const next = String(edge.nodeId);
      if (!unvisited.has(next)) continue;
      const alt = best + (edge.distance || 1);
      if (alt < (dist.get(next) ?? Infinity)) {
        dist.set(next, alt);
        prev.set(next, current);
      }
    }
  }

  const targetId = String(target._id);
  if ((dist.get(targetId) ?? Infinity) === Infinity) return { path: [], distance: null };

  const ids: string[] = [];
  let cur: string | null = targetId;
  while (cur) {
    ids.unshift(cur);
    cur = prev.get(cur) ?? null;
  }

  return {
    distance: dist.get(targetId),
    path: ids.map(id => {
      const n = byId.get(id)!;
      return {
        id,
        key: n.key,
        x: n.x,
        y: n.y,
        floorId: String(n.floorId),
        type: n.type,
        label: n.label
      };
    })
  };
}
