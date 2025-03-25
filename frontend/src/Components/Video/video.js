import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { getSpecificVideo, getCommentsForVideo, commentOnVideo, getMyUsername } from "../../services/api";


function openCoach(evt, coachName) {
    var i, tabcontent, tablinks, timestamps;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    timestamps = document.getElementsByClassName("timestamps");
    console.log(timestamps);
    for (i = 0; i < timestamps.length; i++) {
        timestamps[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(coachName).style.display = "inline";
    evt.currentTarget.className += " active";
    document.getElementById("timestamp"+coachName).style.display = "inline";

}

function changeHeart(){
    const heart = document.getElementById("heart-icon");
    if(heart.src.indexOf("/assets/icons/heart-empty.png") != -1){
        heart.src = "/assets/icons/heart-full.png";
    }
    else{
        heart.src = "/assets/icons/heart-empty.png"
    }
}

function playPause(){
    const heart = document.getElementById("heart-icon");
    if(heart.src.indexOf("/assets/icons/heart-empty.png") != -1){
        heart.src = "/assets/icons/heart-full.png";
    }
    else{
        heart.src = "/assets/icons/heart-empty.png"
    }
}

var reply_comment;

function showReply(commenter_name, comment){
    const reply_box = document.getElementById("reply-option")
    const reply_name = document.getElementById("reply-name")
    const reply_comment = document.getElementById("reply-comment")

    reply_box.style.display = 'inline'
    reply_name.innerText = commenter_name;
    reply_comment.innerText = comment;
}

function closeReply(){
    const reply_box = document.getElementById("reply-option")
    reply_box.style.display = 'none'
}

var bob_comments = [{
    video_id : "1", 
    commenter_name : "bob_coach", 
    comment: "good work", 
    date_posted : "1/1/2025", 
    parent_comment_id: null, 
    time_stamp: 128
}, {
    video_id : "1", 
    commenter_name : "sarah_coach", 
    comment: "meh work", 
    date_posted : "1/1/2025", 
    parent_comment_id: null,
    time_stamp: 360
},
{
    video_id : "1", 
    commenter_name : "steve_coach", 
    comment: "bad work", 
    date_posted : "1/1/2025", 
    parent_comment_id: null,
    time_stamp: 422

},{
video_id : "1", 
commenter_name : "bob_coach", 
comment: "Bad serve", 
date_posted : "1/1/2025", 
parent_comment_id: null, 
time_stamp: 400
}, {
video_id : "1", 
commenter_name : "sarah_coach", 
comment: "You could try harder here", 
date_posted : "1/1/2025", 
parent_comment_id: null,
time_stamp: 502
},
{
video_id : "1", 
commenter_name : "steve_coach", 
comment: "Yeah also bad...", 
date_posted : "1/1/2025", 
parent_comment_id: null,
time_stamp: 50

},
 
{video_id : "1", 
commenter_name : "bob_coach", 
comment: "I liked this move", 
date_posted : "1/1/2025", 
parent_comment_id: null,
time_stamp: 480
},
{
video_id : "1", 
commenter_name : "steve_coach", 
comment: "That was good form", 
date_posted : "1/1/2025", 
parent_comment_id: null,
time_stamp: 450

}]

const Video = () => {
    // video stuff
    const { videoID } = useParams();
    const [video, setVideo] = useState({});
    
    // comment stuff
    const [videoComments, setVideoComments] = useState([]);
    const [username, setUsername] = useState("");
    const commentRef = useRef();

    // video player stuff
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef(null);

     // GRAB SPECIFIC VIDEO FROM ID ON PAGE LOAD & USERNAME
     useEffect(() => {
        const fetchSpecificVideo = async (id) => {
            try {
                const currentVideo = await getSpecificVideo(id);
                setVideo(currentVideo);
                console.log(`video details: ${currentVideo}`);
            } catch (error) {
                console.log(error);
            }
        }

        const getUser = async () => {
            try{
                const {username} = await getMyUsername();
                console.log("username: ", username);
                setUsername(username);
            } catch (error){
                console.error(error);
            }
        }
        
        getUser();
        fetchSpecificVideo(videoID);
    }, [])

    const fetchComments = async (id) => {
        try {
            const comments = await getCommentsForVideo(id);
            setVideoComments(comments);

            console.log("comments: ", comments);
        } catch (error) {
            console.error(error);
        }
    }
    console.log("Fetching comments for video ID:", videoID); 

    // Grab comments for the video
    useEffect(() => {
        fetchComments(videoID);
    }, [video])

    
    // POST COMMENT
    const postComment = async () => {
        const commentText = commentRef.current.value;

        const commentToSend = {
            id: videoID,
            commenterName: username,
            comment: commentText,
            date_posted: new Date().toLocaleDateString('en-CA'),
            parent_comment_id: null,
        };

        try {
           await commentOnVideo(commentToSend);
           fetchComments(videoID);
        } catch (error){
            console.error(error);
        }

        console.log("Comment details: ", commentToSend);
    }

    const users_commented = ["bob_coach", "sarah_coach", "steve_coach"]
    

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

    const jumpToComment = (time) => {
        const newProgress = time;
        setProgress(newProgress/playerRef.current?.getDuration());
        playerRef.current.seekTo(newProgress);
        const comment = document.getElementById(time);
        bob_comments.forEach(comment_info =>
            document.getElementById(comment_info.time_stamp).style.borderColor = "#f1f1f1"
        );
        comment.style.borderColor = "black";
    };

    const commentRatio = (time) =>{
        const newProgress = time;
        return (newProgress/playerRef.current?.getDuration()).toFixed(2);
    }

    // format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };



    return (
        <div className="page-container">
            <div className="watch-video-page">
                <h1 id="page-title">Watch Video</h1>
                <div className="centered-video-page">
                    <div className="video-area">
                        <div className="video-display">
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
                            <button onClick={handlePlayPause}><img className="play-pause" src={playing ? '/assets/icons/pause-icon.png' : '/assets/icons/play-icon.png'}></img></button>

                            {/* Timeline */}
                            <div className="range-slider">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={progress}
                                onChange={handleSeekChange}
                                className="timeline-slider"
                                list = "tickmarks"
                            ></input>
                            <div className = "slider-background">
                            {users_commented.map((user, index) => (
                                <>
                                <div className="timestamps" id= {"timestamp" + index}>
                                    {bob_comments.filter(comment_info => comment_info.commenter_name === user).map(comment_info => (
                                    <>
                                    <div className="tick" style={{left: (commentRatio(comment_info.time_stamp) * 100 + 0.5) +"%"}} onClick={() => jumpToComment(comment_info.time_stamp)}></div></>
                                
                                    ))}
                                </div>
                                </>
                            ))}
                            
                            </div>
                            </div>
                            


                            {/* display current time */}
                            <span>
                                {formatTime(progress * (playerRef.current?.getDuration() || 0))} / {formatTime(playerRef.current?.getDuration() || 0)}
                            </span>
                        </div>
                    </div>

                {/* COMMENT SECTION */}
                <div className="comment-section">
                <div className='comment-flex'>
                <h3>Coaching Feed</h3>
                <div class="coach-tabs">
                            <button className="tablinks"></button>
                    {users_commented.map((user, index) => (
                            <button className="tablinks" onClick={(event) => openCoach(event, index)}>{user}</button>
                            
                    ))}
                        </div>

                        {users_commented.map((user, index) => (<>
                            <div id= {index} className="tabcontent">
                            <h3>{user}</h3>
                            {bob_comments.filter(comment_info => comment_info.commenter_name === user).map(comment_info => (
                                <><div className='comment' id={comment_info.time_stamp} onClick={() => jumpToComment(comment_info.time_stamp)}>
                                <div className='vertical-flex'>
                                    <div className='commenter-info'>
                                    <div className='info-flex'>
                                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-pic"></img>
                                        <p>{comment_info.commenter_name}</p>
                                        <p className="time-stamp">{formatTime(comment_info.time_stamp )}</p>
                                    </div>
                                    
                                    </div>
                                    <div className="horizontal-flex">
                                    <div className='comment-text'>
                                        <p id="comment">{comment_info.comment}</p>
                                    </div>
                                        <div className="reactions">
                                            <button className="reply-icon" onClick={() => showReply(comment_info.commenter_name, comment_info.comment)}>
                                                <img className="icon" src='/assets\icons\reply.png' alt='' />
                                            </button>
                                            <button onClick={() => changeHeart()} className="reply-icon">
                                                <img id = "heart-icon" className="icon" src= "/assets/icons/heart-empty.png" alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div></>
                            ))}
                            
                        </div></>
                    ))}
                    {/* This only shows if you click Reply*/}
                    <div className="reply-option" id='reply-option'>
                    <button onClick = {()=>closeReply()} className="x-button">
                            <img className = "icon" src='/assets/icons/x-icon.png'/>
                        </button>
                    <div className='comment'>
                                <div className='vertical-flex'>
                                    <div className='reply-commenter-info'>
                                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="reply-pic"></img>
                                        <p id='reply-name'></p>
                                    </div>
                                    <p id='reply-comment'></p>
                                    
                        </div>
                        </div>
                        
                    </div>
                    {/* User types comment here */}
                    <div className="post-section">
                        <input type="text" className='input-container' id = 'input-container' placeholder="Add Comment.."  ref={commentRef}></input>
                        <button className="comment-button" onClick={() => postComment()}>Post</button>
                    </div>
                    
                    
                    
                </div>
                </div>
                </div>
            </div>
            </div>
            
    );
}

export default Video;