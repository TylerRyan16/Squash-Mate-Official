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

    const prev = document.getElementById('left-scroll')
    const next = document.getElementById('right-scroll')
    const list = document.getElementById('my-videos-list')
    const itemWidth = 150
    const padding = 10
    if(prev){
        prev.addEventListener('click',()=>{
            list.scrollLeft -= itemWidth + padding
            if(list.scrollLeft === 0){
                document.getElementById('left-scroll').style.display = "none";
            }
            else{
                document.getElementById('left-scroll').style.display = "";
            }
          })
          
    }
if(next){
    next.addEventListener('click',()=>{
        list.scrollLeft += itemWidth + padding
        if(list.scrollLeft === 0){
            document.getElementById('left-scroll').style.display = "none";
        }
        else{
            document.getElementById('left-scroll').style.display = "";
        }
      })
}
if(list){
    if(list.scrollLeft === 0){
        document.getElementById('left-scroll').style.display = "none";
    }
    else{
        document.getElementById('left-scroll').style.display = "";
    }
}   
    
    return (
        <div className="page-container">
            <h1 class='top-header'>Squash Mate add logo?</h1>
            <h2 class = 'top-header'>Elevate Your Game</h2>
            <h1 class = 'category-name'>My Videos</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll" class="left-scroll">
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="my-videos-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h5 class="video-title">Video Title</h5>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}

                    </div>
                    <button id="right-scroll" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Public Games</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll" class="left-scroll">
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="my-videos-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h5 class="video-title">Video Title</h5>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button id="right-scroll" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
            <h1 class='category-name'>Shared With Me</h1>
            <div class="scroll-container">
                <div class="carousel">
                    <button id="left-scroll" class="left-scroll">
                        <img class= 'left-scroll-icon' id='left-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                    <div id="my-videos-list" class="my-videos-list">
                    {videos.map(element => (
                        <div class='video-card'>
                            <div class = "vertical-flex">
                                <img id="item" class="item" src={element} alt=''/>
                                <h5 class="video-title">Video Title</h5>
                                <small class='video-title'>Updated Today</small>
                            </div>
                        </div>
                        ))}
                    </div>
                    <button id="right-scroll" class="right-scroll">
                        <img class='right-scroll-icon' id='right-scroll-icon' src='assets\icons\right-arrow.png' alt=''/>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;