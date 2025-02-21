import { useEffect } from "react";
import axios from "axios";
import "./explore.scss";

const exploreVideos = [
    "https://img.youtube.com/vi/ntyBmviVs4M/0.jpg",
    "https://img.youtube.com/vi/_fIB5xWN6WE/0.jpg",
    "https://img.youtube.com/vi/pM70TROZQsI/0.jpg",
    "https://img.youtube.com/vi/NAh9oLs67Cw/0.jpg",
    "https://img.youtube.com/vi/nV-wPx3fRWE/0.jpg",
    "https://img.youtube.com/vi/1o2fnTNxE_Q/0.jpg",
    "https://img.youtube.com/vi/7rMdwqissE0/0.jpg",
    "https://img.youtube.com/vi/zV92kXblkzk/0.jpg",
    "https://img.youtube.com/vi/AAGIi62-sAU/0.jpg",
    "https://img.youtube.com/vi/-Ta80mqCuJs/0.jpg",
    "https://img.youtube.com/vi/eH-_GMhH-kk/0.jpg",
    "https://img.youtube.com/vi/fuVU64m1sbw/0.jpg",
    "https://img.youtube.com/vi/53rGxPbsffQ/0.jpg",
    "https://img.youtube.com/vi/DzTomOIX6ZQ/0.jpg",
    "https://img.youtube.com/vi/yrpGYTlCjNQ/0.jpg",
    "https://img.youtube.com/vi/1d7FDA2M-9E/0.jpg"
  ];

const Explore = () => {
  return (
    <div className="page-container">
      <title>Explore</title>
      <h1>Trending Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="horizontal-flex search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />

          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div className="video-area">
          <div className="rows">
            {exploreVideos.map((element, index) => (
              <div key={index} className="explore-video-card">
                <img className="explore-thumbnail" src={element} alt={`Explore Video ${index}`} style={{ width: "80%", height: "80%" }} />
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
