import { useEffect, useState } from "react";
import { getAllVideos, getMyUsername } from "../../services/api";
import "./myVideos.scss";


const MyVideos = () => {

  const [allVideos, setAllVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const grabMyUsername = async () => {
      try{
        const username = await getMyUsername();
        console.log("your username: ", username);
      } catch (error){
        console.log(error);
      }
    }

    const fetchAllVideos = async () => {
      try {
        const videos = await getAllVideos();
        setAllVideos(videos);
      } catch (error) {
        console.log(error);
      }
    }
    
    grabMyUsername();
    fetchAllVideos();
  }, []);

  const filteredVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="my-videos-display-area">
          <div className="rows">
          {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <div key={index} className="explore-video-card">
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <img className="explore-thumbnail" src={video.thumbnail} alt={`Explore Video ${index}`} />
                  </a>
                  <h5 className="video-title">{video.title}</h5>
                  <small className="video-title">{video.date_posted}</small>
                </div>
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

export default MyVideos;