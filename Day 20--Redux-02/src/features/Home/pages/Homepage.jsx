import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  Check,
  ChevronDown,
  CircleArrowDown,
  CircleUser,
  Globe,
  Menu,
  Megaphone,
  Pause,
  Play,
  Shuffle,
  X,
} from "lucide-react";

/* ============================ data ============================ */

const person = (n) => `/people/p${n}.jpg`;

const heroWords = ["music", "artists", "fans", "live events", "videos"];

const perks = [
  { icon: Megaphone, title: "Ad-free music listening", copy: "All the music, without all the ads. Just non-stop beats." },
  { icon: BarsIcon, title: "Very high audio quality", copy: "Dive deeper into music with sound quality up to ~320 kbps." },
  { icon: CircleArrowDown, title: "Offline listening", copy: "Download thousands of songs, or let Offline Backup do it for you." },
  { icon: Shuffle, title: "Full control over what plays next", copy: "Repeat songs, play albums in order, and skip as many times as you want." },
];

const moments = [
  { img: 5, caption: "Shilpa Rao performing under spotlights at a film album launch", w: "w-[26vw] min-w-[260px]", h: "h-[40vh]" },
  { img: 12, caption: "Hanumankind hyping up a crowd at a fan event", w: "w-[18vw] min-w-[190px]", h: "h-[30vh]" },
  { img: 16, caption: "Karan Aujla performing at an invite-only party while the audience films", w: "w-[30vw] min-w-[300px]", h: "h-[34vh]" },
  { img: 7, caption: "An evening with Sonu Nigam and Shreya Ghoshal", w: "w-[20vw] min-w-[210px]", h: "h-[42vh]" },
  { img: 14, caption: "Paal Dabba performing at Rap91", w: "w-[24vw] min-w-[250px]", h: "h-[28vh]" },
  { img: 20, caption: "Badshah at the launch of his latest album", w: "w-[28vw] min-w-[280px]", h: "h-[38vh]" },
];

const stripImages = [
  [3, "h-[16vh] w-[16vh]"], [9, "h-[12vh] w-[20vh]"], [11, "h-[18vh] w-[14vh]"], [13, "h-[14vh] w-[14vh]"],
  [15, "h-[12vh] w-[22vh]"], [18, "h-[18vh] w-[18vh]"], [19, "h-[14vh] w-[12vh]"], [23, "h-[16vh] w-[24vh]"],
  [24, "h-[12vh] w-[12vh]"], [10, "h-[18vh] w-[16vh]"],
];

const footerCols = [
  ["Company", ["About", "Jobs", "For the Record"]],
  ["Communities", ["For Artists", "For creators", "For authors", "Developers", "Advertising", "Investors", "Vendors"]],
  ["Useful links", ["Support", "Web Player", "Free Mobile App", "Import your music"]],
  ["Spotify Plans", ["Premium Standard", "Premium Platinum", "Premium Student", "Spotify Free"]],
];

const legal = ["Legal", "Safety and Privacy Centre", "Privacy Policy", "Cookies", "About Ads", "Accessibility"];

/* ============================ helpers ============================ */

function BarsIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <rect x="3" y="7" width="4" height="14" rx="1" />
      <rect x="10" y="3" width="4" height="18" rx="1" />
      <rect x="17" y="12" width="4" height="9" rx="1" />
    </svg>
  );
}

const Logo = ({ className = "h-9 w-9" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.4-1.1a.75.75 0 1 1-.33-1.46c4.5-1 8.4-.6 11.5 1.3.35.2.46.65.23 1Zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.2-1.97-8.1-2.55-11.9-1.4a.94.94 0 0 1-.54-1.8c4.3-1.3 9.7-.67 13.4 1.6.44.27.58.85.31 1.29Zm.13-3.4C15.2 8.35 8.8 8.14 5.1 9.27a1.13 1.13 0 1 1-.66-2.16c4.2-1.28 11.3-1.03 15.7 1.6a1.13 1.13 0 0 1-1.04 2Z" />
  </svg>
);

const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

// runs `onProgress(p)` (0 → 1) while a tall section scrolls past a sticky child
const useScrollProgress = (ref, onProgress) => {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      cb.current(clamp(-r.top / (r.height - window.innerHeight)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
};

// fades + lifts children in when they enter the viewport
const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
};

const GreenButton = ({ children, className = "" }) => (
  <button className={`rounded-full bg-[#5fd86a] px-9 py-4 text-lg font-bold text-black transition duration-200 hover:scale-105 hover:bg-[#7ae584] ${className}`}>
    {children}
  </button>
);

const OutlineButton = ({ children, className = "" }) => (
  <button className={`rounded-full border border-white/40 px-9 py-4 text-lg font-bold text-white transition duration-200 hover:scale-105 hover:border-white ${className}`}>
    {children}
  </button>
);

const SocialIcon = ({ label, children }) => (
  <a href="#top" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full bg-[#2a2a2a] text-white transition hover:scale-110 hover:bg-[#3a3a3a]">
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </a>
);

/* ============================ navbar ============================ */

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Premium plans", "Support", "Download"];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black">
      <nav className="flex h-[88px] items-center justify-between px-6 lg:h-[100px] lg:px-12">
        <a href="#top" className="flex items-center gap-1 text-[28px] font-extrabold tracking-tight">
          <Logo className="h-10 w-10" />
          Spotify
        </a>

        <div className="hidden items-center gap-10 text-lg font-bold lg:flex">
          {links.map((l) => (
            <a key={l} href="#top" className="transition hover:scale-105 hover:text-[#5fd86a]">{l}</a>
          ))}
          <span className="h-5 w-px bg-white/80" />
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-4">
              <CircleUser size={48} strokeWidth={1.4} />
              Profile
              <ChevronDown size={18} className={`transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute right-0 top-[calc(100%+14px)] w-52 origin-top-right rounded-xl bg-[#282828] p-2 shadow-2xl transition duration-200 ${profileOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
              {["Account", "Profile", "Log out"].map((i) => (
                <a key={i} href="#top" className="block rounded-lg px-3 py-3 text-base font-semibold hover:bg-white/10">{i}</a>
              ))}
            </div>
          </div>
          <GreenButton className="!px-8 !py-3.5 !text-lg">Get Premium Standard</GreenButton>
        </div>

        <button aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </nav>

      <div className={`overflow-hidden bg-[#121212] transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[420px]" : "max-h-0"}`}>
        <div className="flex flex-col gap-1 p-6 text-lg font-bold">
          {[...links, "Profile"].map((l) => (
            <a key={l} href="#top" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 hover:bg-white/10">{l}</a>
          ))}
          <GreenButton className="mt-3">Get Premium Standard</GreenButton>
        </div>
      </div>
    </header>
  );
};

/* ============================ hero (logo zoom reveal) ============================ */

const Hero = () => {
  const sectionRef = useRef(null);
  const maskedRef = useRef(null);
  const fullRef = useRef(null);
  const textRef = useRef(null);
  const circleVideo = useRef(null);
  const bgVideo = useRef(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % heroWords.length), 2600);
    return () => clearInterval(id);
  }, []);

  useScrollProgress(sectionRef, (p) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const d0 = Math.min(W * 0.52, H * 0.9);
    const d1 = Math.max(W, H) * 4.5;
    const e = Math.pow(clamp(p / 0.85), 1.4);
    const size = d0 * Math.pow(d1 / d0, e);
    const x = W * (0.7 - 0.2 * e) - size / 2;
    const y = H * (0.55 - 0.05 * e) - size / 2;

    const m = maskedRef.current;
    m.style.setProperty("mask-size", `${size}px ${size}px`);
    m.style.setProperty("-webkit-mask-size", `${size}px ${size}px`);
    m.style.setProperty("mask-position", `${x}px ${y}px`);
    m.style.setProperty("-webkit-mask-position", `${x}px ${y}px`);
    m.style.opacity = 1 - clamp((p - 0.8) / 0.15);

    fullRef.current.style.opacity = clamp((p - 0.5) / 0.3);

    textRef.current.style.opacity = 1 - clamp(p / 0.18);
    textRef.current.style.transform = `translateY(${-p * 160}px)`;
  });

  const togglePlay = () => {
    [circleVideo.current, bgVideo.current].forEach((v) => (paused ? v.play() : v.pause()));
    setPaused(!paused);
  };

  return (
    <section ref={sectionRef} id="top" className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#121212]">
        {/* full-bleed crowd video, revealed once the logo has zoomed past the screen */}
        <div ref={fullRef} className="absolute inset-0 opacity-0">
          <video ref={bgVideo} className="h-full w-full object-cover" src="/videos/crowd.mp4" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* video visible only through the logo-shaped circle */}
        <div ref={maskedRef} className="hero-mask absolute inset-0">
          <video ref={circleVideo} className="h-full w-full object-cover" src="/videos/stage.mp4" autoPlay muted loop playsInline />
        </div>

        <div ref={textRef} className="absolute inset-0 flex items-end px-6 pb-[7vh] lg:px-[7vw]">
          <div className="w-full">
            <h1 className="font-display text-[clamp(2.6rem,7.3vw,9rem)] font-black leading-[1.02] tracking-[-0.01em] [font-stretch:125%]">
              The ultimate home
              <br />
              for
              <br />
              <span key={wordIndex} className="inline-block animate-[word-in_.6s_ease-out_both] italic">
                {heroWords[wordIndex]}
              </span>
            </h1>

            <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-base font-semibold backdrop-blur">
              <BellRing size={20} className="text-[#6f9bff]" /> Offer ends in 3 days
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <GreenButton>Get Premium Standard</GreenButton>
              <OutlineButton>View all plans</OutlineButton>
            </div>
            <p className="mt-6 text-sm text-white/80">
              Limited time offer. Limited Eligibility. <a href="#top" className="underline">Terms Apply</a>.
            </p>
          </div>
        </div>

        <button
          aria-label={paused ? "Play background video" : "Pause background video"}
          onClick={togglePlay}
          className="absolute bottom-8 right-8 z-10 grid h-16 w-16 place-items-center rounded-full bg-[#2a2a2a]/90 transition hover:scale-110 hover:bg-[#3a3a3a]"
        >
          {paused ? <Play size={26} fill="currentColor" /> : <Pause size={26} fill="currentColor" />}
        </button>
      </div>
    </section>
  );
};

/* ============================ made for fans ============================ */

const MadeForFans = () => (
  <section className="bg-[#121212] px-6 py-28 lg:px-[10vw]">
    <div className="mx-auto max-w-[1400px] text-center">
      <Reveal>
        <p className="flex items-center justify-center gap-2 text-2xl font-extrabold"><Logo className="h-8 w-8" /> Premium Standard</p>
        <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,6.5rem)] font-black leading-[1.05] tracking-[-0.03em]">
          Made for fans who want more
        </h2>
      </Reveal>

      <div className="mt-24 grid gap-12 text-left sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ icon: Icon, title, copy }, i) => (
          <Reveal key={title} delay={i * 120}>
            <Icon size={44} strokeWidth={1.6} className="text-[#5fd86a]" />
            <h3 className="mt-5 text-[26px] font-extrabold leading-tight tracking-tight">{title}</h3>
            <p className="mt-3 text-[19px] leading-snug text-white/90">{copy}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24">
        <div className="flex flex-wrap justify-center gap-4">
          <GreenButton>Try 2 months for ₹139</GreenButton>
          <OutlineButton>View all plans</OutlineButton>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-sm text-white/70">
          ₹139 for 2 months, then ₹139 per month after. Offer only available if you haven't tried Premium before. <a href="#top" className="underline">Terms apply.</a>
        </p>
      </Reveal>
    </div>
  </section>
);

/* ============================ morphing figure + discover heading ============================ */

const DiscoverIntro = () => {
  const sectionRef = useRef(null);
  const figureRef = useRef(null);
  const textRef = useRef(null);

  useScrollProgress(sectionRef, (p) => {
    figureRef.current.style.opacity = 1 - clamp((p - 0.35) / 0.3);
    figureRef.current.style.transform = `scale(${1 + p * 0.5}) rotate(${p * 160}deg) translateY(${-p * 80}px)`;
    textRef.current.style.opacity = clamp((p - 0.5) / 0.25);
    textRef.current.style.transform = `translateY(${(1 - clamp((p - 0.5) / 0.3)) * 60}px)`;
  });

  return (
    <section ref={sectionRef} className="relative h-[260vh] bg-[#121212]">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden">
        <div ref={figureRef} className="absolute">
          <div className="relative h-[340px] w-[340px] animate-[floaty_5s_ease-in-out_infinite]">
            <div className="absolute left-[10%] top-[30%] h-44 w-60 animate-[morph_7s_ease-in-out_infinite] bg-gradient-to-br from-[#a21caf] to-[#6d28d9]" />
            <div className="absolute left-[34%] top-[12%] h-36 w-28 animate-[morph_6s_ease-in-out_infinite_reverse] bg-gradient-to-b from-[#4f46e5] to-[#2563eb]" />
            <div className="absolute right-[6%] top-[8%] h-32 w-24 animate-[morph_8s_ease-in-out_infinite] bg-gradient-to-b from-[#3b82f6] to-[#4338ca]" />
            <div className="absolute bottom-[16%] left-[2%] h-24 w-14 animate-[morph_5s_ease-in-out_infinite] bg-gradient-to-b from-[#bef264] to-[#86efac]" />
            <div className="absolute bottom-[8%] right-[14%] h-28 w-14 animate-[morph_6s_ease-in-out_infinite_reverse] bg-gradient-to-b from-[#d9f99d] to-[#86efac]" />
            <div className="absolute left-[30%] top-[52%] h-12 w-12 rounded-full bg-white/90" />
          </div>
        </div>

        <div ref={textRef} className="px-6 text-center opacity-0">
          <p className="text-xl font-bold text-[#5fd86a]">Fresh ways to discover music</p>
          <h2 className="mt-4 font-display text-[clamp(2.6rem,8vw,9rem)] font-black leading-[1.02] tracking-[-0.02em] [font-stretch:125%]">
            Made for you, with you.
          </h2>
        </div>
      </div>
    </section>
  );
};

/* ============================ stacked scroll cards ============================ */

const StackCard = ({ index, color, label, title, copy, children }) => (
  <div
    style={{ top: `${110 + index * 26}px` }}
    className={`sticky mb-[12vh] grid min-h-[68vh] items-center gap-10 overflow-hidden rounded-[2rem] p-8 shadow-2xl shadow-black/60 lg:grid-cols-2 lg:p-16 ${color}`}
  >
    <Reveal>
      <p className="text-lg font-bold opacity-80">{label}</p>
      <h3 className="mt-3 font-display text-[clamp(2rem,4.4vw,4.6rem)] font-black leading-[1.05] tracking-[-0.02em]">{title}</h3>
      <p className="mt-5 max-w-md text-xl font-medium opacity-90">{copy}</p>
    </Reveal>
    <div className="relative grid min-h-[320px] place-items-center">{children}</div>
  </div>
);

const Stack = () => (
  <section className="bg-[#121212] px-4 pb-[10vh] lg:px-12">
    <div className="mx-auto max-w-[1400px]">
      {/* 1 — device switching */}
      <StackCard index={0} color="bg-[#f5a3c7] text-[#2a0a18]" label="Connect" title="Switch devices with just one tap" copy="Start on your phone, carry on through the speaker. Your music follows you around the house.">
        <div className="w-64 rounded-[2.5rem] border-[6px] border-black bg-[#1a1a1a] p-5 text-white shadow-2xl transition duration-500 hover:-rotate-2 hover:scale-105">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-700 to-indigo-900" />
          <div className="mt-4 h-3 w-3/4 rounded-full bg-white/80" />
          <div className="mt-2 h-2 w-1/2 rounded-full bg-white/40" />
          <div className="mt-5 space-y-2">
            {["This phone", "Living room speaker", "MacBook"].map((d, i) => (
              <div key={d} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${i === 1 ? "bg-white/15 text-[#5fd86a]" : "bg-white/5"}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${i === 1 ? "animate-[ping-soft_1.5s_infinite] bg-[#5fd86a]" : "bg-white/40"}`} />
                {d}
              </div>
            ))}
          </div>
        </div>
      </StackCard>

      {/* 2 — wrapped */}
      <StackCard index={1} color="bg-[#5fd86a] text-black" label="Wrapped" title="Your year in music, wrapped up" copy="Every December, see the songs, artists and moments that defined your listening.">
        <div className="relative h-[340px] w-[300px]">
          {[
            ["rotate-[-10deg] bg-[#e8115b] text-white", "Top artist", "Your #1"],
            ["rotate-[4deg] bg-[#2d46b9] text-white", "Minutes listened", "1,284"],
            ["rotate-[-2deg] bg-[#ffd2d7] text-black", "Top song", "On repeat"],
          ].map(([cls, a, b], i) => (
            <div key={a} style={{ top: i * 34, left: i * 22 }} className={`absolute flex h-52 w-52 flex-col justify-between rounded-2xl p-5 shadow-xl transition duration-500 hover:z-10 hover:scale-110 hover:rotate-0 ${cls}`}>
              <span className="text-sm font-bold opacity-80">{a}</span>
              <span className="font-display text-3xl font-black leading-none">{b}</span>
            </div>
          ))}
        </div>
      </StackCard>

      {/* 3 — daylist */}
      <StackCard index={2} color="bg-[#509bf5] text-[#06162b]" label="daylist" title="A playlist that changes with your day" copy="Morning, afternoon, late night — a mix that updates through the day to match the mood.">
        <div className="relative flex flex-wrap justify-center gap-3">
          {["sunny friday afternoon", "feel-good bollywood", "late night lo-fi", "gym pump", "road trip", "rainy mood"].map((chip, i) => (
            <span
              key={chip}
              style={{ animationDelay: `${i * 0.4}s` }}
              className="animate-[floaty_4s_ease-in-out_infinite] rounded-full bg-white px-6 py-3 text-lg font-bold shadow-lg transition hover:scale-110"
            >
              {chip}
            </span>
          ))}
        </div>
      </StackCard>
    </div>
  </section>
);

/* ============================ listen together ============================ */

const Together = () => (
  <section className="bg-[#121212] px-6 py-28 lg:px-12">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <p className="text-xl font-bold text-[#5fd86a]">The best place to listen, together</p>
        <h2 className="mt-3 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,5.5rem)] font-black leading-[1.05] tracking-[-0.03em]">
          Where artists and fans meet through music.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="group relative h-[480px] overflow-hidden rounded-[2rem] bg-[#2d46b9] p-10 transition duration-500 hover:scale-[1.02]">
            <h3 className="font-display text-5xl font-black">Jam</h3>
            <p className="mt-3 max-w-xs text-lg">Play any song with friends in real time.</p>
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex -space-x-4">
                {[9, 11, 19, 13].map((n) => (
                  <img key={n} src={person(n)} alt="" className="h-20 w-20 rounded-full border-4 border-[#2d46b9] object-cover transition duration-300 group-hover:-translate-y-2" />
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-black/30 px-5 py-4 backdrop-blur">
                <div className="flex h-6 items-end gap-1">
                  {[0, 0.2, 0.4, 0.1].map((d) => (
                    <span key={d} style={{ animationDelay: `${d}s` }} className="h-full w-1.5 origin-bottom animate-[eq_1s_ease-in-out_infinite] rounded-full bg-[#5fd86a]" />
                  ))}
                </div>
                <span className="font-bold">Jam session · 4 listening</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="group relative h-[480px] overflow-hidden rounded-[2rem] bg-[#8d67ab] p-10 transition duration-500 hover:scale-[1.02]">
            <h3 className="font-display text-5xl font-black">Blend</h3>
            <p className="mt-3 max-w-xs text-lg">Find your taste match with another listener.</p>
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center">
              <img src={person(5)} alt="" className="h-52 w-52 rounded-full border-4 border-[#8d67ab] object-cover transition duration-500 group-hover:-translate-x-4" />
              <img src={person(14)} alt="" className="-ml-14 h-52 w-52 rounded-full border-4 border-[#8d67ab] object-cover transition duration-500 group-hover:translate-x-4" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-lg font-black text-black shadow-xl">92%</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ============================ horizontal "library" scroll ============================ */

const BigMoments = () => {
  const sectionRef = useRef(null);
  const rowA = useRef(null);
  const rowB = useRef(null);

  useScrollProgress(sectionRef, (p) => {
    const a = rowA.current;
    const b = rowB.current;
    const travelA = a.scrollWidth - window.innerWidth + 96;
    const travelB = b.scrollWidth - window.innerWidth + 96;
    a.style.transform = `translateX(${-p * travelA}px)`;
    b.style.transform = `translateX(${-(1 - p) * travelB}px)`;
  });

  return (
    <section ref={sectionRef} className="relative h-[420vh] bg-[#121212]">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-[3vh] overflow-hidden pt-[100px]">
        <div className="px-6 lg:px-12">
          <h2 className="max-w-5xl font-display text-[clamp(1.4rem,2.6vw,2.8rem)] font-black leading-tight tracking-[-0.02em]">
            <span className="text-[#5fd86a]">Shaping the big moments in music.</span> Spotify is where music breaks and culture moves. Be here when history hits play.
          </h2>
        </div>

        <div ref={rowA} className="flex items-end gap-6 px-6 will-change-transform lg:px-12">
          {moments.map((m) => (
            <figure key={m.img} className={`group shrink-0 ${m.w}`}>
              <div className={`overflow-hidden rounded-2xl ${m.h}`}>
                <img src={person(m.img)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              </div>
              <figcaption className="mt-3 max-w-[22rem] text-sm font-semibold text-white/80">{m.caption}</figcaption>
            </figure>
          ))}
        </div>

        <div ref={rowB} className="flex w-max items-center gap-4 px-6 will-change-transform lg:px-12">
          {[...stripImages, ...stripImages].map(([n, size], i) => (
            <div key={i} className={`shrink-0 overflow-hidden rounded-xl ${size}`}>
              <img src={person(n)} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================ plans ============================ */

const PlanCard = ({ badge, badgeClass, extra, title, sub, features, cta, note, children }) => (
  <article className="flex h-full flex-col rounded-[1.5rem] bg-[#1f1f1f] p-8 transition duration-300 hover:-translate-y-2 hover:bg-[#262626]">
    <div className="flex items-center justify-between">
      <span className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-extrabold ${badgeClass}`}><Logo className="h-4 w-4" /> {badge}</span>
      {extra && <span className="text-sm font-bold text-[#5fd86a]">{extra}</span>}
    </div>
    <h3 className="mt-8 text-3xl font-extrabold tracking-tight">{title}</h3>
    <p className="mt-1 text-white/70">{sub}</p>
    <ul className="mt-8 flex-1 space-y-3 border-t border-white/15 pt-8 text-[17px]">
      {features.map((f) => (
        <li key={f} className="flex gap-3"><Check size={20} className="mt-0.5 shrink-0" />{f}</li>
      ))}
    </ul>
    <button className={`mt-8 w-full rounded-full py-4 text-lg font-bold text-black transition hover:scale-[1.03] ${badgeClass}`}>{cta}</button>
    {children}
    <p className="mt-5 text-xs leading-snug text-white/50">{note}</p>
  </article>
);

const Plans = () => (
  <section className="bg-black px-6 py-28 lg:px-12">
    <div className="mx-auto max-w-[1400px]">
      <Reveal>
        <p className="text-xl font-bold text-[#5fd86a]">The world is listening here</p>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,5.5vw,5.5rem)] font-black leading-[1.05] tracking-[-0.03em]">
          There's a plan for everyone. Join the party.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        <Reveal>
          <PlanCard
            badge="Premium Standard"
            badgeClass="bg-[#cfb7ff] text-[#1b0b3a]"
            title="₹139 for 2 months"
            sub="Then ₹139 per month"
            features={["1 Standard account", "Offline downloads", "Very high audio quality (up to ~320 kbps)", "Cancel anytime", "Subscribe or one-time payment"]}
            cta="Try 2 months for ₹139"
            note="Offer only available if you haven't tried Premium before. Terms apply."
          >
            <div className="mt-5 rounded-2xl bg-black/40 p-5">
              <p className="font-bold">One-time payment</p>
              <p className="mt-1 text-sm text-white/70">₹799 for 1 year (about ₹66.59/month). Doesn't auto-renew.</p>
              <button className="mt-4 w-full rounded-full border border-white/40 py-3 font-bold transition hover:border-white">Continue</button>
            </div>
          </PlanCard>
        </Reveal>

        <Reveal delay={120}>
          <PlanCard
            badge="Premium Platinum"
            badgeClass="bg-[#9ad1ff] text-[#06223a]"
            extra="Savings available"
            title="₹299 per month"
            sub="For up to 3 people"
            features={["Up to 3 Platinum accounts", "Offline downloads", "Lossless audio (up to 24-bit/44.1kHz)", "Playlist mixing", "Personal AI DJ", "AI playlist creation", "DJ software connection", "Cancel anytime"]}
            cta="Get Premium Platinum"
            note="For up to 3 people living at the same address. Terms apply."
          />
        </Reveal>

        <Reveal delay={240}>
          <PlanCard
            badge="Premium Student"
            badgeClass="bg-[#ffc864] text-[#3a2600]"
            title="₹69 for 2 months"
            sub="Then ₹69 per month"
            features={["1 verified Standard account", "Offline downloads", "Very high audio quality (up to ~320 kbps)", "Cancel anytime"]}
            cta="Try 2 months for ₹69"
            note="Only for students at an eligible accredited higher-education institution. Not available if you've already tried Premium. Student discount terms apply."
          >
            <a href="#top" className="mt-5 block text-center text-sm font-semibold underline">Or sign up to Spotify for free.</a>
          </PlanCard>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ============================ footer ============================ */

const Footer = () => (
  <footer className="bg-black px-6 pb-12 pt-20 lg:px-12">
    <div className="mx-auto max-w-[1400px]">
      <div className="grid gap-14 lg:grid-cols-[auto_1fr_auto]">
        <a href="#top" className="flex h-fit items-center gap-1 text-[28px] font-extrabold tracking-tight">
          <Logo className="h-10 w-10" /> Spotify
        </a>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {footerCols.map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white/60">{title}</h4>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l}><a href="#top" className="font-bold transition hover:text-[#5fd86a] hover:underline">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex h-fit gap-4">
          <SocialIcon label="Instagram">
            <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
          </SocialIcon>
          <SocialIcon label="X"><path d="M4 4l16 16M20 4L4 20" /></SocialIcon>
          <SocialIcon label="Facebook"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></SocialIcon>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 border-t border-white/20 pt-8 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {legal.map((l) => (
            <li key={l}><a href="#top" className="transition hover:text-white">{l}</a></li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-6">
          <button className="flex items-center gap-2 font-semibold text-white transition hover:text-[#5fd86a]"><Globe size={18} /> India (English)</button>
          <span>© 2026 Spotify AB</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ============================ page ============================ */

const Homepage = () => (
  <div className="bg-[#121212] font-sans text-white antialiased">
    <Navbar />
    <main>
      <Hero />
      <MadeForFans />
      <DiscoverIntro />
      <Stack />
      <Together />
      <BigMoments />
      <Plans />
    </main>
    <Footer />
  </div>
);

export default Homepage;
