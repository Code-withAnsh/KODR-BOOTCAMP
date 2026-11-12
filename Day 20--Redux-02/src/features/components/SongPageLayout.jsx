import { useState } from "react";
import {
  ChevronLeft,
  Bell,
  ChevronRight,
  Download,
  Heart,
  Home,
  Library,
  ListMusic,
  Maximize2,
  Mic2,
  PictureInPicture2,
  Play,
  Plus,
  PlusCircle,
  Repeat,
  Search,
  Shuffle,
  SkipBack,
  SkipForward,
  Users,
  Volume2,
} from "lucide-react";
import SongList from "./SongListCard";

/* dummy data — replace with API data later */
const filters = ["All", "Music", "Podcasts"];

const albums = [
  {
    title: "Aashiqui 2",
    sub: "Mithoon, Ankit Tiwari, Jeet Gannguli",
    label: "Aashiqui 2",
    gradient: "from-slate-500 to-slate-900",
    description: "Mithoon, Ankit Tiwari, Jeet Gannguli",
  },
  {
    title: 'Raanjhan (From "Do Patti")',
    sub: "Sachet-Parampara, Parampara Tandon, Kaushal",
    label: "Raanjhan",
    gradient: "from-rose-400 to-orange-800",
    description: "Sachet-Parampara, Parampara Tandon, Kaushal",
  },
  {
    title: "Finding Her",
    sub: "Kushagra, Bharath, Saaheal",
    label: "Finding Her",
    gradient: "from-sky-300 to-emerald-600",
    description: "Kushagra, Bharath, Saaheal",
  },
  {
    title: "Sanam Teri Kasam (Original Motion Picture)",
    sub: "Himesh Reshammiya, Sameer Anjaan",
    label: "Sanam Teri Kasam",
    gradient: "from-orange-300 to-red-900",
    description: "Himesh Reshammiya, Sameer Anjaan",
  },
];

const editorPicks = [
  {
    title: "90s Sad Bollywood",
    sub: "Made for you",
    label: "90s Sad Bollywood",
    gradient: "from-amber-400 to-orange-700",
    description: "The saddest hits from the 90s.",
  },
  {
    title: "Filmy Covers",
    sub: "Made for you",
    label: "Filmy Covers",
    gradient: "from-pink-400 to-rose-800",
    description: "Fresh covers of filmy classics.",
  },
  {
    title: "Bollywood & Chill",
    sub: "Spotify",
    label: "Bollywood & Chill",
    gradient: "from-yellow-300 to-lime-700",
    description: "Sit back, and chill with Bollywood's easygoing hits.",
  },
  {
    title: "1AM Feels Hindi",
    sub: "Made for you",
    label: "1AM Feels",
    gradient: "from-indigo-500 to-slate-950",
    description: "For the late-night feels.",
  },
  {
    title: "00's Love Hits",
    sub: "Spotify",
    label: "00's Love Hits",
    gradient: "from-fuchsia-400 to-purple-900",
    description: "The biggest love songs of the 2000s.",
  },
  {
    title: "All Out",
    sub: "Spotify",
    label: "All Out",
    gradient: "from-yellow-400 to-amber-700",
    description: "The biggest songs of the moment.",
  },
  {
    title: "Chai & Chill",
    sub: "Made for you",
    label: "Chai & Chill",
    gradient: "from-violet-400 to-fuchsia-900",
    description: "Slow mornings, warm tea, soft songs.",
  },
];

const sidebarItems = [
  { type: "avatar", n: 3 },
  { type: "avatar", n: 5 },
  { type: "avatar", n: 7 },
  { type: "avatar", n: 9 },
  { type: "avatar", n: 10 },
  { type: "avatar", n: 11 },
  { type: "avatar", n: 12 },
  { type: "avatar", n: 13 },
];

/* ---------- pieces ---------- */

const Card = ({ item, onOpen, className = "" }) => (
  <div
    onClick={() => onOpen(item)}
    className={`group relative cursor-pointer rounded-md bg-[#181818] p-4 transition duration-300 hover:bg-[#282828] ${className}`}
  >
    <div
      className={`relative aspect-square overflow-hidden rounded-md bg-gradient-to-br ${item.gradient} shadow-lg shadow-black/50`}
    >
      <span className="absolute inset-0 grid place-items-center p-4 text-center font-display text-2xl font-black leading-tight text-white/90 drop-shadow-lg">
        {item.label}
      </span>
      <button
        aria-label="Play"
        className="absolute bottom-2 right-2 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105"
      >
        <Play size={22} fill="currentColor" className="ml-0.5" />
      </button>
    </div>
    <h3 className="mt-4 truncate font-bold">{item.title}</h3>
    <p className="mt-1 line-clamp-2 text-sm text-white/60">{item.sub}</p>
  </div>
);

const SectionHead = ({ title, showAll = false }) => (
  <div className="mb-4 flex items-end justify-between">
    <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
    {showAll && (
      <button className="text-sm font-semibold text-white/60 transition hover:text-white hover:underline">
        Show all
      </button>
    )}
  </div>
);

const Sidebar = () => (
  <aside className="hidden w-[88px] shrink-0 flex-col items-center gap-4 rounded-lg bg-[#121212] py-3 md:flex">
    <button
      aria-label="Your Library"
      className="grid h-12 w-12 place-items-center rounded-md text-white/60 transition hover:text-white"
    >
      <Library size={26} />
    </button>
    <button
      aria-label="Create"
      className="grid h-12 w-12 place-items-center rounded-full bg-[#242424] text-white/70 transition hover:bg-[#2a2a2a] hover:text-white"
    >
      <Plus size={22} />
    </button>
    <div className="mt-2 grid h-12 w-12 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-violet-200 transition hover:scale-105">
      <Heart size={20} fill="white" className="text-white" />
    </div>
    <div className="flex w-full flex-col items-center gap-3 overflow-y-auto">
      {sidebarItems.map((s) => (
        <img
          key={s.n}
          src={`/people/p${s.n}.jpg`}
          alt=""
          className="h-12 w-12 rounded-full object-cover transition hover:scale-105"
        />
      ))}
    </div>
  </aside>
);

const TopBar = () => (
  <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-3">
    <div className="flex items-center gap-3">
      <button
        aria-label="Back"
        className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white/70 transition hover:bg-black/80 hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Home"
        className="grid h-12 w-12 place-items-center rounded-full bg-[#1f1f1f] transition hover:scale-105 hover:bg-[#2a2a2a]"
      >
        <Home size={24} />
      </button>
      <div className="flex h-12 w-[364px] items-center gap-3 rounded-full bg-[#1f1f1f] px-4 text-white/70 transition hover:bg-[#2a2a2a] hover:text-white">
        <Search size={22} />
        <span className="truncate text-[15px]">What do you want to play?</span>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:scale-105">
        Explore Premium
      </button>
      <button className="flex items-center gap-2 text-sm font-bold text-white/80 transition hover:scale-105 hover:text-white">
        <Download size={18} /> Install App
      </button>
      <button
        aria-label="Notifications"
        className="text-white/70 transition hover:text-white"
      >
        <Bell size={20} />
      </button>
      <button
        aria-label="Friends"
        className="text-white/70 transition hover:text-white"
      >
        <Users size={20} />
      </button>
      <button
        aria-label="Profile"
        className="grid h-8 w-8 place-items-center rounded-full bg-[#b79ce0] text-sm font-bold text-black transition hover:scale-105"
      >
        A
      </button>
    </div>
  </div>
);

const PlayerBar = () => (
  <footer className="grid h-[92px] shrink-0 grid-cols-[1fr_2fr_1fr] items-center gap-4 rounded-lg bg-black px-4">
    <div className="flex min-w-0 items-center gap-3">
      <div className="h-14 w-14 shrink-0 rounded bg-gradient-to-br from-yellow-200 to-amber-800" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">Chaaha Hai Tujhko</p>
        <p className="truncate text-xs text-white/60">
          Udit Narayan, Anuradha Paudwal
        </p>
      </div>
      <button
        aria-label="Add to library"
        className="shrink-0 text-white/60 transition hover:scale-110 hover:text-white"
      >
        <PlusCircle size={20} />
      </button>
    </div>

    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-6 text-white/70">
        <button aria-label="Shuffle" className="transition hover:text-white">
          <Shuffle size={18} />
        </button>
        <button aria-label="Previous" className="transition hover:text-white">
          <SkipBack size={22} fill="currentColor" />
        </button>
        <button
          aria-label="Play"
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition hover:scale-105"
        >
          <Play size={18} fill="currentColor" className="ml-0.5" />
        </button>
        <button aria-label="Next" className="transition hover:text-white">
          <SkipForward size={22} fill="currentColor" />
        </button>
        <button aria-label="Repeat" className="transition hover:text-white">
          <Repeat size={18} />
        </button>
      </div>
      <div className="flex w-full max-w-[600px] items-center gap-2 text-xs text-white/60">
        <span>0:06</span>
        <div className="group relative h-1 flex-1 rounded-full bg-white/20">
          <div className="h-full w-[2%] rounded-full bg-white transition group-hover:bg-[#1ed760]" />
        </div>
        <span>4:41</span>
      </div>
    </div>

    <div className="flex items-center justify-end gap-4 text-white/60">
      <button aria-label="Lyrics" className="transition hover:text-white">
        <Mic2 size={18} />
      </button>
      <button aria-label="Queue" className="transition hover:text-white">
        <ListMusic size={18} />
      </button>
      <button aria-label="Volume" className="transition hover:text-white">
        <Volume2 size={18} />
      </button>
      <div className="h-1 w-24 rounded-full bg-white/20">
        <div className="h-full w-[70%] rounded-full bg-white" />
      </div>
      <button aria-label="Mini player" className="transition hover:text-white">
        <PictureInPicture2 size={18} />
      </button>
      <button aria-label="Fullscreen" className="transition hover:text-white">
        <Maximize2 size={18} />
      </button>
    </div>
  </footer>
);

const HomeView = ({ onOpen }) => (
  <div className="px-6 pb-10 pt-24">
    <div className="mb-6 flex gap-2">
      {filters.map((f, i) => (
        <button
          key={f}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition hover:scale-105 ${i === 0 ? "bg-white text-black" : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"}`}
        >
          {f}
        </button>
      ))}
    </div>

    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <section>
        <SectionHead title="Getting started" />
        <div className="relative flex h-[300px] flex-col justify-between overflow-hidden rounded-lg bg-[linear-gradient(135deg,#1f7a3a,#0f4d24)] p-6">
          <div>
            <h3 className="font-display text-4xl font-black leading-tight">
              2. Try the Miniplayer
            </h3>
            <p className="mt-3 max-w-xs text-lg text-white/80">
              Control your music and watch videos without interruptions.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="rounded-full bg-[#1ed760] px-6 py-2.5 font-bold text-black transition hover:scale-105">
              Try it
            </button>
            <button className="font-semibold text-[#1ed760] transition hover:underline">
              Show more tips
            </button>
          </div>
          <div className="absolute right-6 top-6 w-32 rounded-lg bg-[#2b2b2b] p-3 shadow-2xl transition duration-500 hover:-rotate-3 hover:scale-105">
            <div className="aspect-square rounded bg-gradient-to-br from-lime-300 to-green-600" />
            <p className="mt-2 truncate text-xs font-bold">Green Light</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHead title="Popular albums and singles" showAll />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {albums.map((a) => (
            <Card key={a.title} item={a} onOpen={onOpen} />
          ))}
        </div>
      </section>
    </div>

    <section className="mt-10">
      <SectionHead title="Editor's Picks: No-Skip Playlists" showAll />
      <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
        {editorPicks.map((p) => (
          <Card
            key={p.title}
            item={p}
            onOpen={onOpen}
            className="w-[200px] shrink-0"
          />
        ))}
      </div>
    </section>
  </div>
);

/* ---------- page ---------- */

const SongPageLayout = () => {
  // which card was clicked; null shows the home grid
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex h-screen flex-col gap-2 bg-black p-2 font-sans text-white antialiased">
      <div className="flex min-h-0 flex-1 gap-2">
        <Sidebar />

        <main className="relative min-w-0 flex-1 overflow-hidden rounded-lg bg-[#121212]">
          <TopBar />
          <div className="h-full overflow-y-auto">
            {selected ? (
              <SongList playlist={selected} />
            ) : (
              <HomeView onOpen={setSelected} />
            )}
          </div>
        </main>

        <aside className="hidden w-12 shrink-0 justify-center rounded-lg bg-[#121212] pt-3 2xl:flex">
          <button
            aria-label="Collapse"
            className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </aside>
      </div>

      <PlayerBar />
    </div>
  );
};

export default SongPageLayout;
