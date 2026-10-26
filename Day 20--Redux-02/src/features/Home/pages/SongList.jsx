import { Clock, Download, MoreHorizontal, Play, Plus, Shuffle } from "lucide-react";

/* dummy data — replace with API data later */
const dummyTracks = [
  { title: 'Pardesiya - From "Param Sundari"', artists: "Sachin-Jigar, Sonu Nigam, Krishnakali Saha, Amitabh Bhattacharya", album: 'Pardesiya (From "Param Sundari")', added: "2 weeks ago", duration: "3:51", gradient: "from-amber-300 to-rose-700" },
  { title: "Saibo", artists: "Sachin-Jigar, Shreya Ghoshal, Tochi Raina", album: 'Shor in the City (Original Motion Picture)', added: "2 weeks ago", duration: "3:15", gradient: "from-orange-400 to-amber-900" },
  { title: "Main Rang Sharbaton Ka", artists: "Atif Aslam, Chinmayi, Pritam", album: "Best of Romance: Atif Aslam", added: "2 weeks ago", duration: "4:23", gradient: "from-red-500 to-rose-900" },
  { title: "Khuda Jaane", artists: "Vishal-Shekhar, KK, Shilpa Rao, Anvita Dutt Guptan", album: "Bachna Ae Haseeno", added: "2 weeks ago", duration: "5:33", gradient: "from-sky-300 to-blue-800" },
  { title: "Tum Hi Ho", artists: "Arijit Singh", album: "Aashiqui 2", added: "3 weeks ago", duration: "4:22", gradient: "from-teal-300 to-emerald-900" },
  { title: "Chaaha Hai Tujhko", artists: "Udit Narayan, Anuradha Paudwal", album: "Mann", added: "1 month ago", duration: "4:41", gradient: "from-yellow-200 to-amber-800" },
  { title: "Raabta", artists: "Pritam, Arijit Singh", album: "Agent Vinod", added: "1 month ago", duration: "4:01", gradient: "from-violet-400 to-indigo-900" },
  { title: "Kabira", artists: "Tochi Raina, Rekha Bhardwaj", album: "Yeh Jawaani Hai Deewani", added: "2 months ago", duration: "3:58", gradient: "from-lime-300 to-green-900" },
];

const SongList = ({
  playlist: {
    title = "Bollywood & Chill",
    description = "Sit back, and chill with Bollywood's easygoing hits.",
    gradient = "from-yellow-300 to-lime-700",
    saves = "618,088",
  } = {},
}) => (
  <div className="min-h-full pb-10">
    {/* header */}
    <header className="animate-rise flex flex-col items-start gap-6 bg-[linear-gradient(180deg,#8f8f2f_0%,#6b6b25_40%,#121212_100%)] px-8 pb-6 pt-24 md:flex-row md:items-end">
      <div className={`grid h-[232px] w-[232px] shrink-0 place-items-center rounded bg-gradient-to-br ${gradient} p-5 text-center shadow-2xl shadow-black/60`}>
        <span className="font-display text-3xl font-black leading-tight text-white drop-shadow-lg">{title}</span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold">Public Playlist</p>
        <h1 className="mt-2 font-display text-[clamp(3rem,7vw,6rem)] font-black leading-none tracking-[-0.03em]">{title}</h1>
        <p className="mt-5 text-sm text-white/80">{description}</p>
        <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1ed760] text-black">
            <Play size={10} fill="currentColor" />
          </span>
          Spotify <span className="font-normal text-white/80">• {saves} saves • 75 songs, about 5 hr 30 min</span>
        </p>
      </div>
    </header>

    {/* controls */}
    <div className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-6">
        <button aria-label="Play" className="grid h-14 w-14 place-items-center rounded-full bg-[#1ed760] text-black shadow-xl transition hover:scale-105 hover:bg-[#3be477]">
          <Play size={26} fill="currentColor" className="ml-1" />
        </button>
        <button aria-label="Shuffle" className="text-white/60 transition hover:text-white"><Shuffle size={28} /></button>
        <button aria-label="Add to library" className="text-white/60 transition hover:text-white"><Plus size={30} /></button>
        <button aria-label="Download" className="text-white/60 transition hover:text-white"><Download size={28} /></button>
        <button aria-label="More" className="text-white/60 transition hover:text-white"><MoreHorizontal size={30} /></button>
      </div>
      <button className="flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white">
        List
        <span className="flex h-4 flex-col justify-between">
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
          <span className="h-0.5 w-4 bg-current" />
        </span>
      </button>
    </div>

    {/* track table */}
    <div className="px-8">
      <div className="grid grid-cols-[32px_4fr_3fr_2fr_minmax(80px,1fr)] gap-4 border-b border-white/10 px-4 pb-2 text-sm text-white/60">
        <span className="text-right">#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Date added</span>
        <span className="justify-self-end"><Clock size={16} /></span>
      </div>

      <div className="mt-2 space-y-1">
        {dummyTracks.map((t, i) => (
          <div
            key={t.title}
            style={{ animationDelay: `${i * 40}ms` }}
            className="animate-rise group grid grid-cols-[32px_4fr_3fr_2fr_minmax(80px,1fr)] items-center gap-4 rounded-md px-4 py-2 transition hover:bg-white/10"
          >
            <span className="relative text-right text-white/60">
              <span className="group-hover:hidden">{i + 1}</span>
              <Play size={14} fill="currentColor" className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-white group-hover:block" />
            </span>

            <div className="flex min-w-0 items-center gap-3">
              <div className={`h-10 w-10 shrink-0 rounded bg-gradient-to-br ${t.gradient}`} />
              <div className="min-w-0">
                <p className="truncate text-base font-medium">{t.title}</p>
                <p className="truncate text-sm text-white/60">{t.artists}</p>
              </div>
            </div>

            <span className="truncate text-sm text-white/60">{t.album}</span>
            <span className="truncate text-sm text-white/60">{t.added}</span>

            <div className="flex items-center justify-end gap-4 text-sm text-white/60">
              <MoreHorizontal size={18} className="invisible group-hover:visible" />
              <span>{t.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SongList;
