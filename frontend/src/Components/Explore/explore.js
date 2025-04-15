import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllVideos } from "../../services/api";
import VideoCard from "../Video/videoCard";
import "./explore.scss";

const Explore = () => {
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const videos = await getAllVideos();
        setAllVideos(videos);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAllVideos();
  }, []);

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