import "./shared.scss";

const sharedVideos = [
    { url: "https://www.youtube.com/watch?v=ntyBmviVs4M" },
    { url: "https://www.youtube.com/watch?v=_fIB5xWN6WE" },
    { url: "https://www.youtube.com/watch?v=pM70TROZQsI" },
    { url: "https://www.youtube.com/watch?v=NAh9oLs67Cw" },
    { url: "https://www.youtube.com/watch?v=nV-wPx3fRWE" },
    { url: "https://www.youtube.com/watch?v=1o2fnTNxE_Q" },
    { url: "https://www.youtube.com/watch?v=7rMdwqissE0" },
    { url: "https://www.youtube.com/watch?v=zV92kXblkzk" },
    { url: "https://www.youtube.com/watch?v=AAGIi62-sAU" },
    { url: "https://www.youtube.com/watch?v=-Ta80mqCuJs" },
    { url: "https://www.youtube.com/watch?v=eH-_GMhH-kk" },
    { url: "https://www.youtube.com/watch?v=fuVU64m1sbw" },
    { url: "https://www.youtube.com/watch?v=53rGxPbsffQ" },
    { url: "https://www.youtube.com/watch?v=DzTomOIX6ZQ" },
    { url: "https://www.youtube.com/watch?v=yrpGYTlCjNQ" },
    { url: "https://www.youtube.com/watch?v=1d7FDA2M-9E" }
];

const SharedWithMe = () => {
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

        <div className="video-area">
          <div className="rows">
            {sharedVideos.map((video, index) => (
              <div key={index} className="shared-video-card">
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <img 
                    className="shared-thumbnail" 
                    src={`https://img.youtube.com/vi/${new URL(video.url).searchParams.get("v")}/0.jpg`} 
                    alt={`Shared Video ${index}`} 
                  />
                </a>
                <h5 className="video-title">Shared Video</h5>
                <small className="video-title">Updated Today</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedWithMe;
