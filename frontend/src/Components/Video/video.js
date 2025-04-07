import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { getSpecificVideo, getCommentsForVideo, commentOnVideo, getMyUsername } from "../../services/api";


function openCoach(evt, coachName) {
    // var i, tabcontent, tablinks;

    // // Get all elements with class="tabcontent" and hide them
    // tabcontent = document.getElementsByClassName("tabcontent");
    // for (i = 0; i < tabcontent.length; i++) {
    //     tabcontent[i].style.display = "none";
    // }

    // // Get all elements with class="tablinks" and remove the class "active"
    // tablinks = document.getElementsByClassName("tablinks");
    // for (i = 0; i < tablinks.length; i++) {
    //     tablinks[i].className = tablinks[i].className.replace(" active", "");
    // }

    // // Show the current tab, and add an "active" class to the button that opened the tab
    // document.getElementById(coachName).style.display = "inline";
    // evt.currentTarget.className += " active";

}

function changeHeart() {
    const heart = document.getElementById("heart-icon");
    if (heart.src.indexOf("/assets/icons/heart-empty.png") != -1) {
        heart.src = "/assets/icons/heart-full.png";
    }
    else {
        heart.src = "/assets/icons/heart-empty.png"
    }
}


function showReply(commenter_name, comment) {
    const reply_box = document.getElementById("reply-option")
    const reply_name = document.getElementById("reply-name")
    const reply_comment = document.getElementById("reply-comment")

    reply_box.style.display = 'inline'
    reply_name.innerText = commenter_name;
    reply_comment.innerText = comment;
}

function closeReply() {
    const reply_box = document.getElementById("reply-option")
    reply_box.style.display = 'none'
}

var bob_comments = [{
    video_id: "1",
    commenter_name: "bob_coach",
    comment: "good work",
    date_posted: "1/1/2025",
    parent_comment_id: null,
    time_stamp: 128
}, {
    video_id: "1",
    commenter_name: "sarah_coach",
    comment: "meh work",
    date_posted: "1/1/2025",
    parent_comment_id: null,
    time_stamp: 360
},
{
    video_id: "1",
    commenter_name: "steve_coach",
    comment: "bad work",
    date_posted: "1/1/2025",
    parent_comment_id: null,
    time_stamp: 422

}]

const Video = () => {
    // video stuff
    const { videoID } = useParams();
    const [video, setVideo] = useState({});

    // comment stuff
    const [videoComments, setVideoComments] = useState([]);
    const [username, setUsername] = useState("");
    const [noComments, setNoComments] = useState(true);
    const [replyingComment, setReplyingComment] = useState(null);
    const commentRef = useRef();
    const bottomRef = useRef(null);

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
            } catch (error) {
                console.log(error);
            }
        }

        // get your username
        const getUser = async () => {
            try {
                const { username } = await getMyUsername();
                setUsername(username);
            } catch (error) {
                console.error(error);
            }
        }

        getUser();
        fetchSpecificVideo(videoID);
    }, [])
    var parsed_game_details = {}
    for(const evt in video.game_details){
        const spaceIndex = video.game_details[evt].indexOf(' ');
        const time = video.game_details[evt].substring(0, spaceIndex);
        const secondPart = video.game_details[evt].substring(spaceIndex + 1);
        parsed_game_details[time] = secondPart;

    }
    const fetchComments = async (id) => {
        try {
            const comments = await getCommentsForVideo(id);
            setVideoComments(comments);
            if (comments.length === 0) {
                setNoComments(true);
            } else {
                setNoComments(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Grab comments for the video
    useEffect(() => {
        fetchComments(videoID);
    }, [video])


    // COMMENT LOGIC
    const postComment = async () => {
        const commentText = commentRef.current.value;
        const currentDate = new Date().toLocaleDateString('en-CA');
        const parent_id = replyingComment.id;
        console.log("comment we are replying to: ", replyingComment);
        console.log("VIDEO ID we are replying to: ", replyingComment.video_id);
        console.log("COMMENT ID we are replying to: ", replyingComment.id);


        // if reply
        if (replyingComment){
            const commentToSend = {
                video_id: videoID,
                commenterName: username,
                comment: commentText,
                date_posted: currentDate,
                parent_comment_id: parent_id,
            };
        } 

        // regular comment
        else {
            const commentToSend = {
                video_id: videoID,
                commenterName: username,
                comment: commentText,
                date_posted: currentDate,
                parent_comment_id: null,
            };
    
            // clear comment textarea
            commentRef.current.value = "";
    
            try {
                await commentOnVideo(commentToSend);
                await fetchComments(videoID);
    
            } catch (error) {
                console.error(error);
            }
    
        }
        
    }

    // SCROLL TO NEW COMMENT WHEN POSTED
    useEffect(() => {
        console.log("should be scrolling");
        if (videoComments.length > 0 && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [videoComments]);


    // SET REPLYING
    const setReplyingTo = (commentData) => {
        setReplyingComment(commentData);
        commentRef.current.value = `@${commentData.commenter_name} `
        commentRef.current.focus();
        console.log("comment data: ", commentData);
    };


    const closeReply = () => {
        setReplyingComment(null);
        commentRef.current.value = "";
    }

    // END REPLY

    // COMMENT MARKING
    const jumpToComment = (time) => {
        const newProgress = time;
        setProgress(newProgress / playerRef.current?.getDuration());
        playerRef.current.seekTo(newProgress);
    };

    const commentRatio = (time) => {
        const newProgress = time;
        return newProgress / playerRef.current?.getDuration();
    }
    // END COMMENT MARKING


    // VIDEO CONTROLS
    const handlePlayPause = () => {
        setPlaying((prev) => !prev);
    };

    const handleProgress = (state) => {
        setProgress(state.progress);
        setScoreBoard();
    };

    function setScoreBoard() {
        const currTime = playerRef.current?.getCurrentTime();
        const sortedTimes = Object.keys(parsed_game_details).sort();
        document.getElementById("player1_score").textContent = 0;
        document.getElementById("player2_score").textContent = 0;
        document.getElementById("player1_wins").textContent = 0;
        document.getElementById("player2_wins").textContent = 0;
        for(const time in sortedTimes){
            if(currTime >= sortedTimes[time]){
                const evt = parsed_game_details[sortedTimes[time]].split(" ");
                if(evt[1] === "Gain"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_score").textContent ++;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_score").textContent ++;
                    }
                }
                if(evt[1] === "Lose"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_score").textContent --;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_score").textContent --;
                    } 
                }
                if(evt[1] === "Win"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_wins").textContent ++;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_wins").textContent ++;
                    } 
                }
            }
        }
        /*
        for(const time in sortedTimes){
            if(currTime >= time){
                const evt = parsed_game_details[time].split(" ");
                if(evt[1] === "Gain"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_score").textContent ++;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_score").textContent ++;
                    }
                }
                if(evt[1] === "Lose"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_score").textContent --;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_score").textContent --;
                    } 
                }
                if(evt[1] === "Win"){
                    if(evt[0]===video.player1_name){
                        document.getElementById("player1_wins").textContent ++;
                    }
                    if(evt[0]===video.player2_name){
                        document.getElementById("player2_wins").textContent ++;
                    } 
                }
            }
        }*/
    }

    const handleSeekChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    };
    // END VIDEO CONTROLS


    // format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="page-container">
            <h1 id="page-title">Watch Video</h1>
            <div className="watch-video-page-column">
                <div className="video-comments-section-row">



                    <div className="video-area">


                        <div className="react-player-wrapper">
                            {/* YouTube Video Player */}
                            <ReactPlayer
                                ref={playerRef}
                                url={video.url}
                                playing={playing}
                                controls={false}
                                width="95%"
                                height="100%"
                                className="react-player"
                                onProgress={handleProgress}
                            />
                        
                        </div>

                       <div className="video-point-display">
                            <div className="video-player1-color" id='player1-color'style={{backgroundColor:video.player1_color}}></div>
                            <p className='video-player-name'>{video.player1_name}</p>
                            <div className="video-player1_wins" id="player1_wins">0</div>
                            <div className='video-score-background'><p id="player1_score">0</p><p >-</p><p id="player2_score">0</p></div>
                            <div className="video-player2_wins" id="player2_wins">0</div>
                            <p className='video-player-name'>{video.player2_name}</p>
                            <div className="video-player2-color" style={{backgroundColor:video.player2_color}}></div>
                        </div>

                        <div className="controls">
                        <button onClick={handlePlayPause}><img className="play-pause" src={playing ? '/assets/icons/pause-icon.png' : '/assets/icons/play-icon.png'}></img></button>
                            <div className="range-slider">
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={progress}
                                    onChange={handleSeekChange}
                                    className="timeline-slider"
                                ></input>
                                <div className = "slider-background">
                                    <div id="timestamps">
                                        {Object.keys(parsed_game_details).map(time => (<div className='tick' style={{left:(commentRatio(time) * 100 + 0.5) +'%'}}><span class='tooltiptext'>{parsed_game_details[time]}</span></div>)
                                    )}
                                    </div>
                                </div>
                            </div>


                            <span>
                                {formatTime(progress * (playerRef.current?.getDuration() || 0))} / {formatTime(playerRef.current?.getDuration() || 0)}
                            </span>
                        </div>


                    </div>


                    {/* COMMENT SECTION */}
                    <div className="comment-section">
                        <div className="comment-section-top-bar">
                            <h2 id="coaching-header">Coaching Feed</h2>
                            <div class="coach-tabs">
                                <button className="tablinks"></button>

                                {/* {users_commented.map((user, index) => (
                                    <button className="tablinks" onClick={(event) => openCoach(event, index)}>{user}</button>

                                ))} */}
                            </div>

                        </div>



                        <div className="comments-area">
                            {noComments && <h4 className='no-comments-text'>No Comments to Display</h4>}

                            {videoComments.map(commentInfo => (
                                <div className="specific-comment">
                                    <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-profile-pic"></img>

                                    <div className="comment-div">
                                        <div className="comment-top-bar">
                                            <h4 className="commenter-name">{commentInfo.commenter_name}</h4>
                                            <p className="date-posted">{commentInfo.date_posted.slice(0, 10)}</p>
                                        </div>

                                        <div className="comment">
                                            <p>{commentInfo.comment}</p>
                                        </div>

                                        <div className="comment-button-area">
                                            <img src="/assets/icons/heart-empty.png" alt="Like Comment" className="like-button"></img>

                                            <p className="view-more-button">View More</p>

                                            <div className="right-comment-button-area" onClick={() => setReplyingTo(commentInfo)}>
                                                <img src="/assets/icons/reply.png" alt="Like Comment" className="reply-icon"></img>
                                                <p className="reply-button">Reply</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <div ref={bottomRef}></div>

                        </div>

                        <div className="comment-input-bar">

                            {/* COMMENT, NOT REPLY
                            {!replyingComment && <div className="post-section">
                                <textarea
                                    className='comment-input'
                                    id='input-container'
                                    placeholder="Add Comment.."
                                    ref={commentRef}
                                    maxLength={200}
                                />
                                <button className="post-comment-button" onClick={() => postComment()}>Post</button>
                            </div>} */}


                            {/* REPLY! */}
                            <div className="reply-section">

                                <div className="reply-input-section">
                                    {replyingComment && <div className="close-button-column">
                                        <img src="/assets/icons/x-icon.png" alt='reply' className="close-reply-button" onClick={() => closeReply()}></img>
                                        <img src="/assets/icons/reply-icon.svg" alt='reply' className="reply-indicator"></img>
                                    </div>}
                                    <div className="reply-input-container">
                                        <textarea
                                            className='comment-input'
                                            placeholder="Message.."
                                            ref={commentRef}
                                            maxLength={200}
                                        />
                                    </div>
                                </div>

                                <button className="post-reply-button" onClick={() => postComment()}>Post</button>
                            </div>
                            
                        </div>


                    </div>
                </div>
            </div>
        </div>

    );
}

export default Video;