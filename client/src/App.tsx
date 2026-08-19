import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronRight,
  Gem,
  Map as MapIcon,
  MapPin,
  Search,
  Sparkles,
  Store,
} from "lucide-react";
import { api } from "./api";
import type { Floor, Product, Section } from "./types";
import { ShowroomMap } from "./components/ShowroomMap";

const categories = [
  { name: "Sarees", icon: Sparkles },
  { name: "Bridal", icon: Gem },
  { name: "Lehenga", icon: Sparkles },
  { name: "Gowns", icon: Gem },
  { name: "Churidar", icon: Store },
  { name: "Jewellery", icon: Gem },
];

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-maharani-page">
      <div className="mx-auto min-h-screen max-w-3xl bg-maharani-surface shadow-xl">
        <header className="sticky top-0 z-40 border-b border-[#d7bd78]/20 bg-[#fffdf8]/95 px-5 py-4 backdrop-blur-xl">
          <Link to="/find" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[#d7bd78]/50 bg-[#651d2c] text-[#e5c77b]">
              <span className="font-serif text-xl font-bold">M</span>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#a6792f]">
                Maharani
              </div>
              <div className="font-serif text-[17px] font-semibold text-[#2f2524]">
                Wedding Collections
              </div>
            </div>
          </Link>
        </header>

        {children}
      </div>
    </main>
  );
}

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [params] = useSearchParams();

  const start = params.get("start") || "main-entrance";

  const search = (e: React.FormEvent) => {
    e.preventDefault();

    if (!q.trim()) return;

    navigate(
      `/search?q=${encodeURIComponent(q.trim())}&start=${encodeURIComponent(
        start
      )}`
    );
  };

  return (
    <Shell>
      <section className="px-5 pb-24 pt-7">
        <div className="premium-hero rounded-[30px] px-6 py-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs">
            <MapPin size={14} />
            You are at Main Entrance
          </div>

          <div className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-[#e5c77b]">
            Smart Store Guide
          </div>

          <h1 className="mt-3 font-serif text-[40px] font-semibold leading-[1.05]">
            Find what you love.
            <span className="block text-[#e5c77b]">
              We’ll show you the way.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
            Search any collection or department to find its exact floor,
            section and showroom location.
          </p>

          <form
            onSubmit={search}
            className="mt-7 flex items-center rounded-2xl bg-white p-2 shadow-2xl"
          >
            <Search className="ml-3 h-5 w-5 text-[#651d2c]" />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Try "Kasavu Saree"'
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[15px] text-[#2f2524] outline-none"
            />

            <button className="rounded-xl bg-[#651d2c] px-5 py-3 text-sm font-bold text-white">
              Find
            </button>
          </form>
        </div>

        <div className="mt-9">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-[#a6792f]">
            Explore
          </div>

          <h2 className="mt-1 font-serif text-2xl font-semibold text-[#2f2524]">
            Popular Collections
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent(
                    name
                  )}&start=${encodeURIComponent(start)}`
                )
              }
              className="premium-card group rounded-2xl p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#651d2c]/10 text-[#651d2c]">
                  <Icon size={19} />
                </div>

                <ChevronRight
                  size={17}
                  className="text-[#a6792f] transition-transform group-hover:translate-x-1"
                />
              </div>

              <div className="mt-6 font-serif text-lg font-semibold">
                {name}
              </div>

              <div className="mt-1 text-xs text-stone-500">
                Find department
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            navigate(`/map?start=${encodeURIComponent(start)}`)
          }
          className="mt-6 flex w-full items-center justify-between rounded-[24px] border border-[#d7bd78]/30 bg-[#f7f0e5] p-5"
        >
          <span className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#651d2c] text-[#e5c77b]">
              <MapIcon size={22} />
            </span>

            <span className="text-left">
              <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[#a6792f]">
                Showroom Guide
              </span>

              <span className="mt-1 block font-serif text-lg font-semibold">
                Explore Floor Map
              </span>
            </span>
          </span>

          <ArrowRight className="text-[#651d2c]" />
        </button>
      </section>
    </Shell>
  );
}

function SearchResults() {
  const [params] = useSearchParams();

  const q = params.get("q") || "";
  const start = params.get("start") || "main-entrance";

  const [data, setData] = useState<{
    sections: Section[];
    products: Product[];
  }>({
    sections: [],
    products: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get("/search", {
        params: { q },
      })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <Shell>
      <section className="px-5 py-6">
        <Link
          to={`/find?start=${encodeURIComponent(start)}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#651d2c]"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="rounded-[26px] bg-[#f7f0e5] px-5 py-5">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#a6792f]">
            Search Results
          </div>

          <h1 className="mt-1 font-serif text-3xl font-semibold">
            “{q}”
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Choose a result to see its exact showroom location.
          </p>
        </div>

        {loading && (
          <div className="premium-card mt-6 rounded-2xl p-5">
            Searching…
          </div>
        )}

        {!loading &&
          data.sections.length === 0 &&
          data.products.length === 0 && (
            <div className="premium-card mt-6 rounded-2xl p-6">
              <div className="font-serif text-xl font-semibold">
                No result found
              </div>

              <p className="mt-2 text-sm text-stone-500">
                Try another product, collection or department.
              </p>
            </div>
          )}

        {data.sections.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Departments
            </h2>

            <div className="space-y-3">
              {data.sections.map((s) => {
                const floor = s.floorId as Floor;

                return (
                  <Link
                    key={s._id}
                    to={`/section/${s._id}?start=${encodeURIComponent(
                      start
                    )}`}
                    className="premium-card flex items-center justify-between rounded-2xl p-5"
                  >
                    <div>
                      <div className="font-serif text-xl font-semibold">
                        {s.name}
                      </div>

                      <div className="mt-2 flex gap-2">
                        <span className="premium-badge">
                          {floor.name}
                        </span>

                        <span className="premium-badge">
                          Section {s.code}
                        </span>
                      </div>
                    </div>

                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#651d2c] text-white">
                      <ArrowRight size={17} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {data.products.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
              Products
            </h2>

            <div className="space-y-3">
              {data.products.map((p) => {
                const floor = p.sectionId.floorId as Floor;

                return (
                  <Link
                    key={p._id}
                    to={`/section/${
                      p.sectionId._id
                    }?start=${encodeURIComponent(start)}`}
                    className="premium-card flex items-center justify-between rounded-2xl p-5"
                  >
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#a6792f]">
                        {p.category}
                      </div>

                      <div className="mt-1 font-serif text-xl font-semibold">
                        {p.name}
                      </div>

                      <div className="mt-2 text-sm text-stone-500">
                        {p.sectionId.name} · {floor.name}
                      </div>
                    </div>

                    <ChevronRight className="text-[#651d2c]" />
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>
    </Shell>
  );
}

function SectionDetails() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const start = params.get("start") || "main-entrance";

  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    api.get(`/sections/${id}`).then((r) => {
      setSection(r.data);
    });
  }, [id]);

  if (!section) {
    return (
      <Shell>
        <div className="p-6">Loading…</div>
      </Shell>
    );
  }

  const floor = section.floorId as Floor;

  return (
    <Shell>
      <section className="px-5 pb-24 pt-6">
        <Link
          to={`/find?start=${encodeURIComponent(start)}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#651d2c]"
        >
          <ArrowLeft size={18} />
          Home
        </Link>

        <div className="destination-card rounded-[30px] p-6 text-white">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#e5c77b]">
            Your Destination
          </div>

          <h1 className="mt-3 font-serif text-[34px] font-semibold">
            {section.name}
          </h1>

          <p className="mt-2 text-sm text-white/60">
            {section.category}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <Building2
                className="text-[#e5c77b]"
                size={20}
              />

              <div className="mt-3 text-xs text-white/55">
                Floor
              </div>

              <div className="mt-1 font-semibold">
                {floor.name}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <MapPin
                className="text-[#e5c77b]"
                size={20}
              />

              <div className="mt-3 text-xs text-white/55">
                Section
              </div>

              <div className="mt-1 font-semibold">
                {section.code}
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card mt-6 rounded-[26px] p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[#651d2c]/10 text-[#651d2c]">
              <MapPin size={20} />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
                Starting point
              </div>

              <div className="mt-1 font-semibold">
                Main Entrance
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-8 font-serif text-2xl font-semibold">
          How to reach
        </h2>

        <div className="mt-4 space-y-3">
          {section.navigationInstructions.map(
            (instruction, index) => (
              <div
                key={index}
                className="premium-card flex gap-4 rounded-2xl p-4"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#651d2c] text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="pt-2 text-sm font-medium leading-5">
                  {instruction}
                </div>
              </div>
            )
          )}
        </div>

        <Link
          to={`/map?floorId=${floor._id}&sectionId=${
            section._id
          }&start=${encodeURIComponent(start)}`}
          className="mt-7 flex w-full items-center justify-between rounded-2xl bg-[#651d2c] px-5 py-4 text-white shadow-xl"
        >
          <span>
            <span className="block text-xs uppercase tracking-[0.18em] text-[#e5c77b]">
              Navigation
            </span>

            <span className="mt-1 block font-serif text-lg font-semibold">
              Show me the way
            </span>
          </span>

          <ArrowRight />
        </Link>
      </section>
    </Shell>
  );
}

function FloorMap() {
  const [params] = useSearchParams();

  const selected = params.get("sectionId") || undefined;
  const requestedFloor = params.get("floorId") || undefined;
  const start = params.get("start") || "main-entrance";

  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorId, setFloorId] = useState("");
  const [map, setMap] = useState<any>(null);
  const [path, setPath] = useState<any[]>([]);

  useEffect(() => {
    api.get("/floors").then((r) => {
      setFloors(r.data);

      setFloorId(
        requestedFloor || r.data[0]?._id || ""
      );
    });
  }, [requestedFloor]);

  useEffect(() => {
    if (floorId) {
      api.get(`/maps/${floorId}`).then((r) => {
        setMap(r.data);
      });
    }
  }, [floorId]);

  useEffect(() => {
    if (selected) {
      api
        .get(`/navigation/${selected}`)
        .then((r) => setPath(r.data.path || []));
    } else {
      setPath([]);
    }
  }, [selected]);

  const floorPath = useMemo(
    () =>
      path.filter(
        (point) => String(point.floorId) === floorId
      ),
    [path, floorId]
  );

  const selectedSection =
    map?.sections?.find(
      (section: Section) => section._id === selected
    );

  return (
    <Shell>
      <section className="px-4 pb-24 pt-5">
        <Link
          to={`/find?start=${encodeURIComponent(start)}`}
          className="mb-5 inline-flex items-center gap-2 px-1 text-sm font-bold text-[#651d2c]"
        >
          <ArrowLeft size={18} />
          Home
        </Link>

        <div className="rounded-[28px] bg-[#651d2c] px-5 py-6 text-white">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5c77b]">
            Showroom Navigation
          </div>

          <div className="mt-2 flex items-end justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold">
                Find your way
              </h1>

              <p className="mt-2 text-sm text-white/65">
                Follow the highlighted route.
              </p>
            </div>

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#e5c77b]">
              <MapIcon size={23} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2 overflow-auto pb-2">
          {floors.map((floor) => (
            <button
              key={floor._id}
              onClick={() => setFloorId(floor._id)}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold ${
                floorId === floor._id
                  ? "bg-[#651d2c] text-white"
                  : "border bg-white"
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {map ? (
            <ShowroomMap
              width={map.width}
              height={map.height}
              sections={map.sections}
              landmarks={map.landmarks}
              selectedSectionId={selected}
              path={floorPath}
            />
          ) : (
            <div className="premium-card rounded-2xl p-6">
              Loading map…
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="premium-card rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-400">
              <MapPin
                size={15}
                className="text-[#651d2c]"
              />
              You are here
            </div>

            <div className="mt-2 font-semibold">
              Main Entrance
            </div>
          </div>

          <div className="premium-card rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-400">
              <Sparkles
                size={15}
                className="text-[#a6792f]"
              />
              Destination
            </div>

            <div className="mt-2 truncate font-semibold">
              {selectedSection?.name ||
                "Select a section"}
            </div>
          </div>
        </div>

        {selected && (
          <div className="mt-4 rounded-[24px] border border-[#d7bd78]/30 bg-[#f7f0e5] p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#651d2c] text-[#e5c77b]">
               <Building2 size={20} />
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.17em] text-[#a6792f]">
                  Route Active
                </div>

                <div className="mt-1 font-serif text-lg font-semibold">
                  Follow the highlighted path
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Shell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/find"
          element={<Home />}
        />

        <Route
          path="/search"
          element={<SearchResults />}
        />

        <Route
          path="/section/:id"
          element={<SectionDetails />}
        />

        <Route
          path="/map"
          element={<FloorMap />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;