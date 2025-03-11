import "./shared.scss";
import { getAllVideos } from "../../services/api";
import { useEffect, useState } from 'react';


const SharedWithMe = () => {
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
      <title>Shared with me page</title>
      <h1>Shared with Me</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="shared-video-display-area">
          <div className="rows">
            {allVideos.map((video, index) => (
              <div key={index} className="shared-video-card">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                <img className="shared-thumbnail" src={video.thumbnail} alt={`Explore Video ${index}`}   />
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

export default SharedWithMe;
