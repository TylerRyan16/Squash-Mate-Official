import { useEffect } from "react";
import axios from "axios";
import "./explore.scss";

const exploreVideos = [
  { url: "https://www.youtube.com/watch?v=DKrUjudr69A" },
  { url: "https://www.youtube.com/watch?v=unmI-kF1ZBc" },
  { url: "https://www.youtube.com/watch?v=N7jyDk0bXfA" },
  { url: "https://www.youtube.com/watch?v=wSG-e6667x4" },
  { url: "https://www.youtube.com/watch?v=9tTOpf5ZEqs" },
  { url: "https://www.youtube.com/watch?v=CEKvwpIVxX0" },
  { url: "https://www.youtube.com/watch?v=WPnrQdVZcsI" },
  { url: "https://www.youtube.com/watch?v=nz1hEjLX-Y8" },
  { url: "https://www.youtube.com/watch?v=7zJ6REBsMXI" },
  { url: "https://www.youtube.com/watch?v=RsVJkAig3PE" },
  { url: "https://www.youtube.com/watch?v=bOL_M3nw6a4" },
  { url: "https://www.youtube.com/watch?v=A9sNnVtaI2Q" },
  { url: "https://www.youtube.com/watch?v=AE15tULut0k" },
  { url: "https://www.youtube.com/watch?v=vFJJoJvRHy8" },
  { url: "https://www.youtube.com/watch?v=FkgLsWV3Rps" },
  { url: "https://www.youtube.com/watch?v=nfCP-bnY_po" },
];

const Explore = () => {
  return (
    <div className="page-container">
      <title>Explore</title>
      <h1>Explore Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />

          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="video-area">
          <div className="rows">
            {exploreVideos.map((video, index) => (
              <div key={index} className="explore-video-card">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <img className="explore-thumbnail" src={`https://img.youtube.com/vi/${video.url.split('v=')[1]}/0.jpg`} alt={`Explore Video ${index}`}  />
                </a>
                <h5 className="video-title">Explore Video</h5>
                <small className="video-title">Updated Today</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
