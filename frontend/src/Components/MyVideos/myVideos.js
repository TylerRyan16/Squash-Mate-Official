import { useEffect } from "react";
import "./myVideos.scss";

//  useEffect(() => {
//    // if (videoDetails.type === "Game") {
//    //     setVideoDetails((prevDetails) => ({
//    //         ...prevDetails,
//    //         length: "Single"
//    //     }));
//    // }

//    const videoId = extractYouTubeID(url);
//    setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
//  }, [videoDetails.type]);
// const [linkEmpty, setLinkEmpty] = useState(true);
// const [videoUrl, setVideoUrl] = useState("");
// const [thumbnail, setThumbnail] = useState("");

// const handleVideoInput = (e) => {
//   const url = e.target.value;
//   setVideoUrl(url);

//   const videoId = extractYouTubeID(url);
//   if (videoId) {
//     setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
//   } else {
//     setThumbnail("");
//   }
// };

// const extractYouTubeID = (url) => {
//   const regex =
//     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

const videos = [
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
];
const MyVideos = () => {
  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="horizontal-flex search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />

          <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon" />
        </div>

        <div class="video-area">
          <div className="rows">
            {videos.map((element, index) => (
              <div key={index} class="my-videos-video-card">
                <a href={element.url} target="_blank" rel="noopener noreferrer">
                  <img class="my-videos-thumbnail" src={`https://img.youtube.com/vi/${element.url.split('v=')[1]}/0.jpg`} alt={`Video ${index}`} />
                </a>  
                <h5 class="video-title">Video Title</h5>
                <small class="video-title">Updated Today</small>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
