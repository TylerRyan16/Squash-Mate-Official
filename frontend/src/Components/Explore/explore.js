import { useEffect, useState } from "react";
import { getAllVideos, getMyUsername, getProfilePicForPoster } from "../../services/api";
import VideoCard from "../Video/videoCard";
import "./explore.scss";

const Explore = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
      const fetchMyVideos = async () => {
        try {
          const name = await getMyUsername();
          console.log("name in frontend: ", name);
  
          const rawVideos = await getAllVideos(name);        
          const enrichedVideos = await enrichVideosWithPFP(rawVideos);
  
          setAllVideos(enrichedVideos);
        } catch (error) {
          console.error(`Error fetching videos or usernames: ${error}`);
        } 
      };
  
      fetchMyVideos();
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

  const filteredVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <title>Explore</title>
      <h1>Explore Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="explore-video-display-area">
          <div className="rows">
            {filteredVideos.length > 0 ? (
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

export default Explore;