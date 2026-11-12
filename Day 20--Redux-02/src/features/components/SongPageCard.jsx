import React from "react";
import { Play } from "lucide-react";

const SongPageCard = ({ album }) => (
  <div className="group relative cursor-pointer rounded-md bg-[#181818] p-4 text-white transition duration-300 hover:bg-[#282828]">
    <div className="relative aspect-square overflow-hidden rounded-md bg-[#282828] shadow-lg shadow-black/50">
      <img
        src={album.artwork?.["480x480"]}
        alt={album.title}
        className="h-full w-full object-cover"
      />
      <button
        aria-label="Play"
        className="absolute bottom-2 right-2 grid h-12 w-12 translate-y-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105"
      >
        <Play size={22} fill="currentColor" className="ml-0.5" />
      </button>
    </div>
    <h3 className="mt-4 truncate font-bold">{album.title}</h3>
    <p className="mt-1 line-clamp-2 text-sm text-white/60">
      {album.user?.name}
    </p>
  </div>
);

export default React.memo(SongPageCard);
