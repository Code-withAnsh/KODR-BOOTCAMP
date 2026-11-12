import React, { useEffect, useState } from "react";
import { getAlbumApi } from "../../API/AlbumApi";

import SongPage from "../../../components/SongPageCard";

const albumCard = () => {
  const [albumcard, setalbumcard] = useState([]);

  let getSongPage = async () => {
    let data = await getAlbumApi();
    console.log(data.data);
    setalbumcard(data.data);
  };
  useEffect(() => {
    getSongPage();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] p-6 font-sans text-white">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
        {albumcard.map((val) => {
            console.log(val)
            
          return <SongPage key={val.id} album={val} />;
        })}
      </div>
    </div>
  );
};

export default React.memo(albumCard);
