
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVideos } from "../../services/api";


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

    const isLoggedIn = () => {
        const loggedIn = localStorage.getItem('authToken');
        console.log("logged in: ", loggedIn);
        return !!loggedIn;
    };

    return (
        <div className="page-container">
            <h1 className='top-header'>Squash Mate</h1>
            <h2 className='top-header'>Elevate Your Game</h2>

            {/* my videos */}
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
                    {allVideos.map(currentVideo => (
                        <div className='video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-video-thumbnail" src={currentVideo.thumbnail} alt=''/>
                            <h4 className="video-title">{currentVideo.title}</h4>
                            <small className='video-title'>{currentVideo.date_posted}</small>
                        </div>
                    ))}
                </div>

                {/* right arrow */}
                <button id="right-scroll-my-videos" className="right-scroll" onClick={() => scrollRight("my-videos-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>

            {/* public games */}
            <div className="category-name-button-area">
                <h1 className='category-name'>Public Games</h1>
                <Link to="/my-videos" className="view-more">View More</Link>
            </div>

            <div className="carousel">
                {/* left arrow */}
                <button id="left-scroll-public" className="left-scroll" onClick={() => scrollLeft('public-games-list')}>
                    <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
                <div id="public-games-list" className="my-videos-list">
                    {allVideos.map(currentVideo => (
                        <div className='video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-video-thumbnail" src={currentVideo.thumbnail} alt=''/>
                            <h4 className="video-title">{currentVideo.title}</h4>
                            <small className='video-title'>{currentVideo.date_posted}</small>
                        </div>
                    ))}
                </div>
                {/* right arrow */}
                <button id="right-scroll-public" className="right-scroll" onClick={() => scrollRight("public-games-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>

            {/* shared with me */}
            <div className="category-name-button-area">
                <h1 className='category-name'>Shared With Me</h1>
                <Link to="/my-videos" className="view-more">View More</Link>
            </div>           
             
            <div class="carousel">
                {/* left arrow */}
                <button id="left-scroll-shared" class="left-scroll" onClick={() => scrollLeft('shared-list')}>
                    <img class='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
                <div id="shared-list" className="my-videos-list">
                    {allVideos.map(currentVideo => (
                        <div className='video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                            <img className="home-video-thumbnail" src={currentVideo.thumbnail} alt='' />
                            <h4 className="video-title">{currentVideo.title}</h4>
                            <small className='video-title'>{currentVideo.date_posted}</small>
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
