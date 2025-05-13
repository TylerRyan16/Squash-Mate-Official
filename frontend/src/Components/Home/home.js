
import './home.scss';
import VideoCard from "../Video/videoCard";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllVideos, getMyVideos, getSharedVideos, getProfilePicForPoster, checkLoggedIn } from "../../services/api";


// MAIN EXPORT
function scrollLeft(id) {
    const itemWidth = document.getElementById(id).getBoundingClientRect().width;
    const padding = 10
    const videoList = document.getElementById(id)
    videoList.scrollLeft -= itemWidth + padding
}

function scrollRight(id) {
    const itemWidth = document.getElementById(id).getBoundingClientRect().width;
    const padding = 10
    const videoList = document.getElementById(id)
    videoList.scrollLeft += itemWidth + padding

}

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [allVideos, setAllVideos] = useState([]);
    const [myVideos, setMyVideos] = useState([]);
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [loggedIn, setLoggedIn] = useState(null);
    const navigate = useNavigate();

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
            } catch (error) {
                console.error(`Error fetching videos or usernames: ${error}`);
            } finally {
                setLoading(false);
            }
        };
        redirectIfNotLoggedIn();
        fetchAllData();
    }, []);

    const redirectIfNotLoggedIn = async () => {
        try {
            const loggedIn = await checkLoggedIn();
            setLoggedIn(loggedIn);
            console.log("logged in:", loggedIn);
            if (!loggedIn) {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
        }
    };

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

    // if (loading) {
    //     return (
    //         <div className="loader-container">
    //             <img src="/assets/icons/loading-spinner.gif" alt="Loading..." className="loading-spinner" />
    //         </div>
    //     )
    // }

    if (loading) {
        return <div className="loader-container"><p>Loading videos...</p></div>;
    }

    if (loggedIn === false) {
        return (
            <div className="loader"></div>
        )
    } else {
        return (
            <div className="flex flex-col w-full h-auto overflow-y-auto pt-2">
                <h1 className="text-center text-4xl lg:text-6xl font-bold">Squash Mate</h1>
                <h3 className="text-center text-base lg:text-xl">Elevate Your Game</h3>


                {/* EXPLORE PAGE */}
                <div className="w-full flex flex-col gap-2 px-4">

                    {/* header */}
                    <div className="flex justify-between items-center">
                        <h1 className='font-semibold text-2xl md:text-4xl'>Explore</h1>
                        <Link to="/explore">View More</Link>
                    </div>

                    {/*LIST */}
                    <div className=" 
                    flex flex-col items-center justify-center
                    sm:grid sm:grid-cols-2
                    md:grid md:grid-cols-2
                    lg:grid lg:grid-cols-3 
                    ">
                        {allVideos.slice(0, 10).map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </div>


                {/* MY VIDEOS */}
                <div className="flex flex-col gap-2 w-full">

                    {/* Header */}
                    <div className="flex justify-between mx-6">
                        <h1 className='font-semibold text-2xl md:text-4xl'>My Videos</h1>
                        <Link to="/my-videos" >View More</Link>
                    </div>

                    {/* List */}
                    <div className="flex justify-between">
                        {/* desktop- left arrow */}
                        <button id="left-scroll-my-videos" className="left-scroll hidden lg:block" onClick={() => scrollLeft('my-videos-list')}>
                            <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                        </button>

                        <div id="my-videos-list" className="flex overflow-x-scroll h-auto w-full gap-4 px-2 py-4 overflow-y-hidden ">
                            {myVideos.length !== 0 && myVideos.map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}

                            {myVideos.length === 0 && <p>You haven't uploaded anything! Try it out!</p>}


                        </div>

                        {/* desktop - right arrow */}
                        <button id="right-scroll-my-videos" className="right-scroll  hidden lg:block" onClick={() => scrollRight("my-videos-list")}>
                            <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                        </button>
                    </div>
                </div>


                {/* SHARED WITH ME */}
                <div className="flex flex-col gap-2 w-full">
                    {/* header */}
                    <div className="flex justify-between mx-6">
                        <h1 className='px-2 font-semibold text-2xl md:text-4xl'>Shared With Me</h1>
                        <Link to="/shared-with-me">View More</Link>
                    </div>

                    {/* list */}
                    <div className="flex justify-between">
                        {/* left arrow */}
                        <button id="left-scroll-shared" className="left-scroll  hidden lg:block" onClick={() => scrollLeft('shared-list')}>
                            <img className='left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                        </button>

                        <div id="shared-list" className="flex overflow-x-scroll h-auto w-full gap-4 px-2 py-4 overflow-y-hidden">
                            {sharedWithMe.length !== 0 && sharedWithMe.map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}

                            {sharedWithMe.length === 0 && <p>Nobody has shared any videos with you :(</p>}

                        </div>
                        {/* right arrow */}
                        <button id="right-scroll-shared" className="right-scroll  hidden lg:block" onClick={() => scrollRight("shared-list")}>
                            <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt='' />
                        </button>
                    </div>
                </div>


                <div className="empty-banner"></div>
            </div>
        );
    }

}

export default Home;
