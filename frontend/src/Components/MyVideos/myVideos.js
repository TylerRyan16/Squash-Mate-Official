import { useEffect, useState } from "react";
import { getAllVideos } from "../../services/api";
import "./myVideos.scss";


const MyVideos = () => {

  const [allVideos, setAllVideos] = useState([]);

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


  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="my-videos-display-area">
          <div className="rows">
            {allVideos.map((video, index) => (
              <div key={index} className="my-videos-video-card">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <img className="my-videos-thumbnail" src={video.thumbnail} alt={`Video ${index}`} />
                </a>
                <h5 className="video-title">{video.title}</h5>
                <small className="video-title">{video.date_posted}</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
