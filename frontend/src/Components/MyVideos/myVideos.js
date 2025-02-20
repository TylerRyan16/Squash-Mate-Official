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
  "https://img.youtube.com/vi/23urWKmHS6o/0.jpg",
  "https://img.youtube.com/vi/BxxfExJR63g/0.jpg",
  "http://i3.ytimg.com/vi/KDorKy-13ak/hqdefault.jpg",
  "http://i3.ytimg.com/vi/Cf5dPQ7YeE8/hqdefault.jpg",
  "http://i3.ytimg.com/vi/Ks_Uxuhz6nc/hqdefault.jpg",
  "http://i3.ytimg.com/vi/xgXSLLULGyU/hqdefault.jpg"
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
                <img class="my-videos-thumbnail" src={element} alt="{`Video ${index}`}" />
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
