import "./shared.scss";
import { getAllVideos } from "../../services/api";
import { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";


const SharedWithMe = () => {
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
      <title>Shared with me page</title>
      <h1>Shared with Me</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="shared-video-display-area">
          <div className="rows">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, index) => (
                <div className='shared-video-card' onClick={() => navigate(`/video/${video.id}`)}>
                  <img className="shared-thumbnail" src={video.thumbnail} alt='' />
                  <div className="title-area">
                    <img className="uploader-cover-pic" src="/assets/squash-guy.jpg" alt="profile pic"></img>
                    <h4 className="video-title">{video.title}</h4>
                  </div>
                  <div className="poster-date-area">
                    <p className="video-uploader">{video.poster}</p>
                    <small className='video-date'>{video.date_posted}</small>
                  </div>
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

export default SharedWithMe;