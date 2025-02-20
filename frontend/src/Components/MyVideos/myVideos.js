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
  "http://i3.ytimg.com/vi/n05wyIGkeIA/hqdefault.jpg",
  "http://i3.ytimg.com/vi/nTcvGK3k1IQ/hqdefault.jpg",
  "http://i3.ytimg.com/vi/WBLZ3-T8q7s/hqdefault.jpg",
  "http://i3.ytimg.com/vi/0H9xNZQhEc4/hqdefault.jpg",
  "http://i3.ytimg.com/vi/387IPXPUx4Y/hqdefault.jpg",
  "http://i3.ytimg.com/vi/RsVJkAig3PE/hqdefault.jpg",
];
const MyVideos = () => {
  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <div className="search-bar-container">
            <img src="/assets/icons/search-icon.png" alt="search icon" className="search-icon"/>
            <input type="text" className="horizontal-flex search-input" placeholder="Search..." />
          </div>

          <div className="filter-container">
            <img src="/assets/icons/filter-icon.png" alt="filter icon" className="filter-icon"/>
          </div>
          <div>
            <h2>My Videos</h2>
          </div>
        </div>

        <div class="video-card">
          <div className="video-rows">
            {videos.map((element, index) => (
              <div key={index}class="align">
                <img class="video-item" src={element} alt="{`Video ${index}`}" />
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