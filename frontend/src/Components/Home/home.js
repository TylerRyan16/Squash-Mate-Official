
import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVideos, getMyVideos, getSharedVideos, getProfilePicForPoster } from "../../services/api";


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

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [all, mine, shared] = await Promise.all([
                    getAllVideos(),
                    getMyVideos(),
                    getSharedVideos(),
                ]);

                const enrichedAll = await enrichVideosWithPFP(all);
                const enrichedMine = await enrichVideosWithPFP(mine);
                const enrichedShared = await enrichVideosWithPFP(shared);

                setAllVideos(enrichedAll);
                setMyVideos(enrichedMine);
                setSharedWithMe(enrichedShared);
            } catch (error){
                console.error("Error fetching videos or usernames: ", error);
            }
        };

        fetchAllData();
    });

    const isLoggedIn = () => {
        const loggedIn = localStorage.getItem('authToken');
        console.log("logged in: ", loggedIn);
        return !!loggedIn;
    };

    const enrichVideosWithPFP = async (videos) => {
        const enriched = await Promise.all(
            videos.map( async (video) => {
                try {
                    const pfp = await getProfilePicForPoster(video.poster);
                    return {...video, poster_pfp: pfp };
                } catch {
                    return {...video, poster_pfp: "default" };
                }
            })
        );
        return enriched;
    };

    return (
        <div className="home-container">
            <h1 id='app-title'>Squash Mate</h1>
            <h3 id='slogan'>Elevate Your Game</h3>


            {/* EXPLORE PAGE */}
            <div className="category-name-button-area">
                <h1 className='category-name'>Explore</h1>
                <Link to="/explore" className="view-more">View More</Link>
            </div>

            <div className="all-videos-list">
                {allVideos.map(currentVideo => (
                    <div className='home-video-card' onClick={() => navigate(`/video/${currentVideo.id}`)}>
                        <img className="home-thumbnail" src={currentVideo.thumbnail} alt='' />
                        <div className="title-area">
                            {/* HERE we need to get the video uploader pfp */}
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
                    {myVideos.length !== 0 && myVideos.map(currentVideo => (
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

                    {myVideos.length === 0 && <p>You haven't uploaded anything! Try it out!</p>}


                </div>

                {/* right arrow */}
                <button id="right-scroll-my-videos" className="right-scroll" onClick={() => scrollRight("my-videos-list")}>
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
                    {sharedWithMe.length !== 0 && sharedWithMe.map(currentVideo => (
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

                    {sharedWithMe.length === 0 && <p>Nobody has shared any videos with you :(</p>}

                </div>
                {/* right arrow */}
                <button id="right-scroll-shared" className="right-scroll" onClick={() => scrollRight("shared-list")}>
                    <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                </button>
            </div>

            <div className="empty-banner"></div>
        </div>
    );
}

export default Home;
