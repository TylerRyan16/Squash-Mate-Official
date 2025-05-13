import "./shared.scss";
import { getSharedVideos, getMyUsername, getProfilePicForPoster } from "../../services/api";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import VideoCard from "../Video/videoCard";


const SharedWithMe = () => {
  const [sharedVideos, setSharedVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSharedVideos = async () => {
      try {
        const name = await getMyUsername();
        console.log("name in frontend: ", name);

        const rawVideos = await getSharedVideos(name);
        const enrichedVideos = await enrichVideosWithPFP(rawVideos);

        setSharedVideos(enrichedVideos);
        console.log("enriched: ", enrichedVideos);
      } catch (error) {
        console.error(`Error fetching videos or usernames: ${error}`);
      }
    };

    fetchSharedVideos();
  }, []);

  const enrichVideosWithPFP = async (videos) => {
    const enriched = await Promise.all(
      videos.map(async (video) => {
        try {
          const pfp = await getProfilePicForPoster(video.poster);
          return { ...video, poster_pfp: pfp };
        } catch {
          return { ...video, poster_pfp: "default" };
        }
      })
    );
    return enriched;
  };

  const filteredVideos = sharedVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <title>Shared with me page</title>
      <h1>Shared with Me</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="shared-video-display-area">
          <div className=" 
                    flex flex-col 
                    sm:grid sm:grid-cols-2
                    md:grid md:grid-cols-2
                    lg:grid lg:grid-cols-3 mx-2
                    ">            {filteredVideos.length > 0 ? (
              filteredVideos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              <p>No videos found</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedWithMe;