import { useEffect, useState, useRef } from "react";
import { getAllVideos } from "../../services/api";
import "./myVideos.scss";

const MyVideos = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const filterRef = useRef(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const fetchAllVideos = async () => {
      try {
        const videos = await getAllVideos();
        setAllVideos(videos);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllVideos();
  }, []);

  // Close dropdown and calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />
          
          {/* Filter Icon and Dropdown */}
          <div className="relative" ref={filterRef}>
            <img 
              src="/assets/icons/filter-icon.png" 
              alt="filter icon" 
              className="filter-icon cursor-pointer"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            />
            
            {isFilterOpen && (
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">
                <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 border-b">Filter by</h3>
                <ul className="py-2">
                  <li 
                    className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    Date Posted
                  </li>
                  <li className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer">Match Type</li>
                  <li className="px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer">Player Level</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Dropdown */}
        {isCalendarOpen && (
          <div className="absolute mt-2 w-64 bg-white shadow-lg rounded-lg border z-50 p-4" ref={calendarRef}>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
        )}

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