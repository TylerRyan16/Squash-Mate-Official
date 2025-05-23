import { useEffect, useState, useRef } from "react";
import { getMyVideos, getMyUsername, getProfilePicForPoster } from "../../services/api";
import { useNavigate } from "react-router-dom";
import VideoCard from "../Video/videoCard";
import "./myVideos.scss";

const MyVideos = () => {
  const [myVideos, setMyVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMatchTypeOpen, setIsMatchTypeOpen] = useState(false);
  const [isPlayerLevelOpen, setIsPlayerLevelOpen] = useState(false);
  const [selectedPlayerLevel, setSelectedPlayerLevel] = useState("");
  const [selectedMatchType, setSelectedMatchType] = useState("");
  const filterRef = useRef(null);
  const calendarRef = useRef(null);
  const matchTypeRef = useRef(null);
  const playerLevelRef = useRef(null);

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const name = await getMyUsername();

        const rawVideos = await getMyVideos(name);
        const enrichedVideos = await enrichVideosWithPFP(rawVideos);

        setMyVideos(enrichedVideos);
      } catch (error) {
        console.error(`Error fetching videos or usernames: ${error}`);
      }
    };

    fetchMyVideos();
  }, []);

  const enrichVideosWithPFP = async (videos) => {
    const enriched = await Promise.all(
      videos.map(async (video) => {
        try {
          const pfp = await getProfilePicForPoster(video.poster);
          return { ...video, poster_pfp: pfp };
        } catch {
          return { ...video, poster_pfp: "default" };
        }
      })
    );
    return enriched;
  };


  const filteredVideos = myVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterRef.current && !filterRef.current.contains(event.target) &&
        calendarRef.current && !calendarRef.current.contains(event.target) &&
        matchTypeRef.current && !matchTypeRef.current.contains(event.target) &&
        playerLevelRef.current && !playerLevelRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
        setIsCalendarOpen(false);
        setIsMatchTypeOpen(false);
        setIsPlayerLevelOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterClick = (filterType) => {
    setIsCalendarOpen(filterType === 'Date Posted' ? !isCalendarOpen : false);
    setIsMatchTypeOpen(filterType === 'Match Type' ? !isMatchTypeOpen : false);
    setIsPlayerLevelOpen(filterType === 'Player Level' ? !isPlayerLevelOpen : false);
  };

  const handleMatchTypeClick = (type) => {
    setSelectedMatchType(type);
  };

  const handlePlayerLevelClick = (level) => {
    setSelectedPlayerLevel(level);
  };

  const handleFilterIconClick = () => {
    setIsFilterOpen(!isFilterOpen);
    setIsCalendarOpen(false);
    setIsMatchTypeOpen(false);
    setIsPlayerLevelOpen(false);
  };



  return (
    <div className="page-container">
      <title>My Videos</title>
      <h1>My Videos Page</h1>
      <main>
        <div className="search-filter-container">
          <input type="text" className="search-input" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <img src="/assets/icons/search.png" alt="search icon" className="search-icon" />

          <div className="relative" ref={filterRef}>
            <img
              src="/assets/icons/filter-icon.png"
              alt="filter icon"
              className="filter-icon cursor-pointer"
              onClick={handleFilterIconClick}
            />
            {isFilterOpen && (
              <div className="dropdown-menu">
                <h3 className="dropdown-title">Filter by</h3>
                <ul>
                  <li onClick={() => handleFilterClick('Date Posted')}>Date Posted</li>
                  <li onClick={() => handleFilterClick('Match Type')}>Match Type</li>
                  <li onClick={() => handleFilterClick('Player Level')}>Player Level</li>
                </ul>
              </div>
            )}
          </div>

          {isCalendarOpen && (
            <div className="calendar-container" ref={calendarRef}>
              <input type="date" className="calendar-input" />
            </div>
          )}

          {isMatchTypeOpen && (
            <div className="match-type-container" ref={matchTypeRef}>
              <button
                className={`match-type-button ${selectedMatchType === 'Match' ? 'selected' : ''}`}
                onClick={() => handleMatchTypeClick('Match')}
              >
                Match
              </button>
              <button
                className={`match-type-button ${selectedMatchType === 'Game' ? 'selected' : ''}`}
                onClick={() => handleMatchTypeClick('Game')}
              >
                Game
              </button>
              <button
                className={`match-type-button ${selectedMatchType === 'Casual' ? 'selected' : ''}`}
                onClick={() => handleMatchTypeClick('Casual')}
              >
                Casual
              </button>
            </div>
          )}

          {isPlayerLevelOpen && (
            <div className="player-level-container" ref={playerLevelRef}>
              <button
                className={`player-level-button ${selectedPlayerLevel === 'Beginner' ? 'selected' : ''}`}
                onClick={() => handlePlayerLevelClick('Beginner')}
              >
                Beginner
              </button>
              <button
                className={`player-level-button ${selectedPlayerLevel === 'Intermediate' ? 'selected' : ''}`}
                onClick={() => handlePlayerLevelClick('Intermediate')}
              >
                Intermediate
              </button>
              <button
                className={`player-level-button ${selectedPlayerLevel === 'Professional' ? 'selected' : ''}`}
                onClick={() => handlePlayerLevelClick('Professional')}
              >
                Professional
              </button>
            </div>
          )}
        </div>

        <div className=" 
                    flex flex-col
                    sm:grid sm:grid-cols-2
                    md:grid md:grid-cols-2
                    lg:grid lg:grid-cols-3 mx-2
                    ">          {filteredVideos.length > 0 ? (
            filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyVideos;
