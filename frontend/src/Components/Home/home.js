import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


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

    const videos = ['https://img.youtube.com/vi/n05wyIGkeIA/0.jpg','https://img.youtube.com/vi/Lbdp-HCjWw8/0.jpg','https://img.youtube.com/vi/5Dd_LS5mWUE/0.jpg', 'https://img.youtube.com/vi/n05wyIGkeIA/0.jpg','https://img.youtube.com/vi/Lbdp-HCjWw8/0.jpg','https://img.youtube.com/vi/5Dd_LS5mWUE/0.jpg','https://img.youtube.com/vi/n05wyIGkeIA/0.jpg','https://img.youtube.com/vi/Lbdp-HCjWw8/0.jpg','https://img.youtube.com/vi/5Dd_LS5mWUE/0.jpg',]
    const isLoggedIn = () => {
        const loggedIn = localStorage.getItem('authToken');
        console.log("logged in: ", loggedIn);
        return !!loggedIn;
    };

    useEffect(() => {
        if (!isLoggedIn()){
            console.log("user not logged in, redirecting to /landing");
            //navigate("/login");
        }
        
        //navigate("/login");
    }, [navigate])


    return (
        <div className="page-container">
            <h1 class='top-header'>Squash Mate</h1>
            <h2 class = 'top-header'>Elevate Your Game</h2>
            <h1 class = 'category-name'>My Videos</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-my-videos" class="left-scroll" onClick = {() => scrollLeft('my-videos-list')}>
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="my-videos-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h4 class="video-title">Video Title</h4>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}

                    </div>
                    <button id="right-scroll-my-videos" class="right-scroll" onClick={() =>scrollRight("my-videos-list")}>
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Public Games</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-public" class="left-scroll" onClick = {() => scrollLeft('public-games-list')}>
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="public-games-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h4 class="video-title">Video Title</h4>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button id="right-scroll-public" className="right-scroll" onClick={() =>scrollRight("public-games-list")}>
                        <img className='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Shared With Me</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-shared" class="left-scroll" onClick = {() => scrollLeft('shared-list')}>
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="shared-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h4 class="video-title">Video Title</h4>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button id="right-scroll-shared" class="right-scroll" onClick={() =>scrollRight("shared-list")}>
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;