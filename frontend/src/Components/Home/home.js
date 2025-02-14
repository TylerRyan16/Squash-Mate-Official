import './home.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


// MAIN EXPORT
const Home = () => {
    const navigate = useNavigate();

    const videos = ['https://img.youtube.com/vi/23urWKmHS6o/0.jpg','https://img.youtube.com/vi/BxxfExJR63g/0.jpg','https://img.youtube.com/vi/6lVrj_XokGo/0.jpg', 'https://img.youtube.com/vi/23urWKmHS6o/0.jpg','https://img.youtube.com/vi/BxxfExJR63g/0.jpg','https://img.youtube.com/vi/6lVrj_XokGo/0.jpg','https://img.youtube.com/vi/23urWKmHS6o/0.jpg','https://img.youtube.com/vi/BxxfExJR63g/0.jpg','https://img.youtube.com/vi/6lVrj_XokGo/0.jpg','https://img.youtube.com/vi/23urWKmHS6o/0.jpg','https://img.youtube.com/vi/BxxfExJR63g/0.jpg','https://img.youtube.com/vi/6lVrj_XokGo/0.jpg','https://img.youtube.com/vi/23urWKmHS6o/0.jpg','https://img.youtube.com/vi/BxxfExJR63g/0.jpg','https://img.youtube.com/vi/6lVrj_XokGo/0.jpg']
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

    const itemWidth = 150
    const padding = 10

    const myVideosPrev = document.getElementById('left-scroll-my-videos')
    const myVideosNext = document.getElementById('right-scroll-my-videos')
    console.log(myVideosNext)
    const myVideosList = document.getElementById('my-videos-list')
    console.log(myVideosList)
    myVideosPrev.addEventListener('click',()=>{
            myVideosList.scrollLeft -= itemWidth + padding
        })
    myVideosNext.addEventListener('click',()=>{
            myVideosList.scrollLeft += itemWidth + padding
          })
    const pubGamesPrev = document.getElementById('left-scroll-public')
    const pubGamesNext = document.getElementById('right-scroll-public')
    const pubGamesList = document.getElementById('public-games-list')
    pubGamesPrev?.addEventListener('click',()=>{
            pubGamesList.scrollLeft -= itemWidth + padding
        })
    pubGamesNext?.addEventListener('click',()=>{
            pubGamesList.scrollLeft += itemWidth + padding
          })
    const sharedPrev = document.getElementById('left-scroll-shared')
    const sharedNext = document.getElementById('right-scroll-shared')
    const sharedList = document.getElementById('shared-list')
    sharedPrev.addEventListener('click',()=>{
            sharedList.scrollLeft -= itemWidth + padding
        })
    sharedNext.addEventListener('click',()=>{
            sharedList.scrollLeft += itemWidth + padding
          })  
    return (
        <div className="page-container">
            <h1 class='top-header'>Squash Mate add logo?</h1>
            <h2 class = 'top-header'>Elevate Your Game</h2>
            <h1 class = 'category-name'>My Videos</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-my-videos" class="left-scroll">
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
                    <button id="right-scroll-my-videos" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Public Games</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-public" class="left-scroll">
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
                    <button id="right-scroll-public" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Shared With Me</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll-shared" class="left-scroll">
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
                    <button id="right-scroll-shared" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;