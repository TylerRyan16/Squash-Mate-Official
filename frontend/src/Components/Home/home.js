
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVideos, getMyVideos, getMyUsername } from "../../services/api";


// MAIN EXPORT
function scrollLeft(id) {
    const itemWidth = 150
    const padding = 10
    const pubGamesList = document.getElementById(id)
    pubGamesList.scrollLeft -= itemWidth + padding
}

function scrollRight(id) {
    const itemWidth = 150
    const padding = 10
    const pubGamesList = document.getElementById(id)
    pubGamesList.scrollLeft += itemWidth + padding
}

const Home = () => {
    const navigate = useNavigate();
    const [allVideos, setAllVideos] = useState([]);
    const [myVideos, setMyVideos] = useState([]);
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [exploreVideos, setExploredVideos] = useState([]);
    const [username, setUsername] = useState("");

    useEffect(() => {
        // get your username
        const getUser = async () => {
            try {
                const { username } = await getMyUsername();
                setUsername(username);
            } catch (error) {
                console.error(error);
            }
        }

        const fetchAllVideos = async () => {
            try {
                const videos = await getAllVideos();
                setAllVideos(videos);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchMyVideos = async () => {
            try {
                const result = await getMyVideos(username);
                console.log("my videos: ", result);
                setMyVideos([result]);
            } catch (error) {
                console.log(error);
            }
        }

        getUser();
        fetchMyVideos();
        fetchAllVideos();
    }, []);

    const isLoggedIn = () => {
        const loggedIn = localStorage.getItem('authToken');
        console.log("logged in: ", loggedIn);
        return !!loggedIn;
    };

    return (
        <div className="page-container">
            <h1 id='app-title'>Squash Mate</h1>
            <h3 id='slogan'>Elevate Your Game</h3>

            {/* MY VIDEOS */}
            <div className="category-name-button-area">
                <h1 className='category-name'>My Videos</h1>
                <Link to="/my-videos" className="view-more">View More</Link>
            </div>

            <div className="carousel">
                {/* left arrow */}
                <button id="left-scroll-my-videos" className="left-scroll" onClick={() => scrollLeft('my-videos-list')}>
                    <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>

                <div id="my-videos-list" className="my-videos-list">
                    {myVideos.map(currentVideo => (
                        <div className='home-video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-thumbnail" src={currentVideo.thumbnail} alt='' />
                            <div className="title-area">
                                <img className="uploader-cover-pic" src="/assets/squash-guy.jpg" alt="profile pic"></img>
                                <h4 className="video-title">{currentVideo.title}</h4>
                            </div>
                            <div className="poster-date-area">
                                <p className="video-uploader">{currentVideo.poster}</p>
                                <small className='video-date'>{currentVideo.date_posted}</small>
                            </div>
                        </div>
                    ))}
                </div>

                {/* right arrow */}
                <button id="right-scroll-my-videos" className="right-scroll" onClick={() => scrollRight("my-videos-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>

            {/* EXPLORE PAGE */}
            <div className="category-name-button-area">
                <h1 className='category-name'>Explore</h1>
                <Link to="/explore" className="view-more">View More</Link>
            </div>

            <div className="carousel">
                {/* left arrow */}
                <button id="left-scroll-public" className="left-scroll" onClick={() => scrollLeft('public-games-list')}>
                    <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>

                <div id="public-games-list" className="my-videos-list">
                    {allVideos.map(currentVideo => (
                        <div className='home-video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-thumbnail" src={currentVideo.thumbnail} alt='' />
                            <div className="title-area">
                                <img className="uploader-cover-pic" src="/assets/squash-guy.jpg" alt="profile pic"></img>
                                <h4 className="video-title">{currentVideo.title}</h4>
                            </div>
                            <div className="poster-date-area">
                                <p className="video-uploader">{currentVideo.poster}</p>
                                <small className='video-date'>{currentVideo.date_posted}</small>
                            </div>
                        </div>
                    ))}
                </div>
                {/* right arrow */}
                <button id="right-scroll-public" className="right-scroll" onClick={() => scrollRight("public-games-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>

            {/* SHARED WITH ME */}
            <div className="category-name-button-area">
                <h1 className='category-name'>Shared With Me</h1>
                <Link to="/shared-with-me" className="view-more">View More</Link>
            </div>

            <div className="carousel">
                {/* left arrow */}
                <button id="left-scroll-shared" className="left-scroll" onClick={() => scrollLeft('shared-list')}>
                    <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
                <div id="shared-list" className="my-videos-list">
                    {allVideos.map(currentVideo => (
                        <div className='home-video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-thumbnail" src={currentVideo.thumbnail} alt='' />
                            <div className="title-area">
                                <img className="uploader-cover-pic" src="/assets/squash-guy.jpg" alt="profile pic"></img>
                                <h4 className="video-title">{currentVideo.title}</h4>
                            </div>
                            <div className="poster-date-area">
                                <p className="video-uploader">{currentVideo.poster}</p>
                                <small className='video-date'>{currentVideo.date_posted}</small>
                            </div>
                        </div>
                    ))}
                </div>
                {/* right arrow */}
                <button id="right-scroll-shared" className="right-scroll" onClick={() => scrollRight("shared-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>
        </div>
    );
}

export default Home;
