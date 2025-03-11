import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { getSpecificVideo } from "../../services/api";


function openCoach(evt, coachName){
    var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  console.log(coachName);
  tabcontent = document.getElementsByClassName("tabcontent");
  console.log(tabcontent);
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(coachName).style.display = "block";
  evt.currentTarget.className += " active";

}

function changeHeart(){
    const heart = document.getElementById("heart-icon");
    if(heart.src === "assets/icons/heart-empty.png"){
        heart.src = "assets/icons/heart-full.png";
    }
    else{
        heart.src = "assets/icons/heart-empty.png"
    }
}

const Video = () => {
    const { videoID } = useParams();
    const [video, setVideo] = useState({
        
    });

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef(null);
    const users_commented = ["bob_coach", "sarah_coach", "steve_coach"]
    const bob_comments = [{
        video_id : "1", 
        commenter_name : "bob_coach", 
        comment: "good work", 
        date_posted : "1/1/2025", 
        parent_comment_id: null
    }, {
        video_id : "1", 
        commenter_name : "sarah_coach", 
        comment: "meh work", 
        date_posted : "1/1/2025", 
        parent_comment_id: null
    },
    {
        video_id : "1", 
        commenter_name : "steve_coach", 
        comment: "bad work", 
        date_posted : "1/1/2025", 
        parent_comment_id: null
    }]

    // GRAB SPECIFIC VIDEO FROM ID ON PAGE LOAD
    useEffect(() => {
        const fetchSpecificVideo = async (id) => {
            try {
                const currentVideo = await getSpecificVideo(id);
                setVideo(currentVideo);
            } catch (error) {
                console.log(error);
            }
        }
        fetchSpecificVideo(videoID);
    }, [])


    const handlePlayPause = () => {
        setPlaying((prev) => !prev);
    };

    const handleProgress = (state) => {
        setProgress(state.progress);
    };

    const handleSeekChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    };

    // format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };



    return (
        <div className="page-container">
            <div className="horizontal-flex">
                <div className="video-section">
                <div className="video-display-area">
                <h1>Video Player.</h1>
                 {/* YouTube Video Player */}
                 <ReactPlayer 
                    ref={playerRef}
                    url={video.url} 
                    playing={playing}
                    controls={false}
                    width="720px" 
                    height="405px" 
                    onPlay={() => console.log('Video started')}
                    onProgress={handleProgress}
                />

                </div>

                <div className="controls">
                <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>

                {/* Timeline */}
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={progress}
                    onChange={handleSeekChange}
                    className="timeline-slider"
                ></input>

                {/* display current time */}
                <span>
                    {formatTime(progress * (playerRef.current?.getDuration() || 0))} / {formatTime(playerRef.current?.getDuration() || 0)}
                </span>
                </div>
            </div>
                

                <div className="comment-section">
                <h3>Coaching Feed</h3>
                <div class="coach-tabs">
                    {users_commented.map((user, index) => (
                            <button class="tablinks" onClick={(event) => openCoach(event, index)}>{user}</button>
                            
                    ))}
                        </div>

                        {users_commented.map((user, index) => (
                            <div id= {index} className="tabcontent">
                            <h3>{user}</h3>
                            {bob_comments.map(comment_info => (
                                <><div className='comment'>
                                <div className='vertical-flex'>
                                    <div className='commenter-info'>
                                    <div className='horizontal-flex'>
                                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-pic"></img>
                                        <p>{comment_info.commenter_name}</p>
                                    </div>
                                    
                                    </div>
                                    <div className="horizontal-flex">
                                    <div className='comment'>
                                        <p>{comment_info.comment}</p>
                                    </div>
                                        <div className="reactions">
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\reply.png' alt='' />
                                            </button>
                                            <button onClick={() => changeHeart()} className="reply-icon">
                                                <img id = "heart-icon" className="icon" src= "assets/icons/heart-empty.png" alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div></>
                            ))}
                            
                        </div>
                    ))}
                    <div className="horizontal-flex">
                        <input type="text" className='input-container' placeholder="Add Comment.."></input>
                        <button className="comment-button">Post</button>
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}

export default Video;