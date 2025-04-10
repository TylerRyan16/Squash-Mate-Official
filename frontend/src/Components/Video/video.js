import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpecificVideo, getCommentsForVideo, commentOnVideo, getMyUsername, deleteCommentRequest, deleteVideoRequest, getAllUsers, shareVideo } from "../../services/api";


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

// ----------- Utility Functions ----------------------------------------------------------------------------
function changeHeart() {
    const heart = document.getElementById("heart-icon");
    if (heart.src.indexOf("/assets/icons/heart-empty.png") != -1) {
        heart.src = "/assets/icons/heart-full.png";
    }
    else {
        heart.src = "/assets/icons/heart-empty.png"
    }
}

const Video = () => {
    const navigate = useNavigate();
    // video stuff
    const { videoID } = useParams();
    const [video, setVideo] = useState({});
    const [videoOptionsOpen, setVideoOptionsOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [sharedUsers, setSharedUsers] = useState([]);

    // comment stuff
    const [videoComments, setVideoComments] = useState([]);
    const [username, setUsername] = useState("");
    const [noComments, setNoComments] = useState(true);
    const [replyingComment, setReplyingComment] = useState(null);
    const commentRef = useRef();
    const bottomRef = useRef(null);
    const [amPoster, setAmPoster] = useState(false);

    // video player stuff
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const playerRef = useRef(null);

    const deleteVideo = async () => {
        try {
            await deleteVideoRequest(video);
            navigate("/");
        } catch (error){
            console.error(error);
        }
    }

    // ----------- UseEffects ----------------------------------------------------------------------------

    // GRAB SPECIFIC VIDEO FROM ID ON PAGE LOAD & USERNAME
    useEffect(() => {
        // Fetch video with id
        const fetchSpecificVideo = async (id) => {
            try {
                const currentVideo = await getSpecificVideo(id);
                console.log("current video: ", currentVideo);
                setVideo(currentVideo);
            } catch (error) {
                console.log(error);
            }
        }

        // get your username
        const getUser = async () => {
            console.log("get it0");
            try {
                const { username } = await getMyUsername();
                setUsername(username);
            } catch (error) {
                console.error(error);
            }
        }

        const fetchAllUsers = async () => {
              try {
                const users = await getAllUsers();
                setAllUsers(users);
                console.log(users);
              } catch (error) {
                console.log(error);
              }
            }
            
        fetchAllUsers();
        getUser();
        fetchSpecificVideo(videoID);
    }, [])

    // Grab comments for the video
    useEffect(() => {
        fetchComments(videoID);
    }, [video])

    // SCROLL TO NEW COMMENT WHEN POSTED
    useEffect(() => {
        if (videoComments.length > 0 && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [videoComments]);

    // Control video paused / playing
    useEffect(() => {

    })




    var parsed_game_details = {}
    for (const evt in video.game_details) {
        const spaceIndex = video.game_details[evt].indexOf(' ');
        const time = video.game_details[evt].substring(0, spaceIndex);
        const secondPart = video.game_details[evt].substring(spaceIndex + 1);
        parsed_game_details[time] = secondPart;

    }

    // ----------- Comment Logic ----------------------------------------------------------------------------
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

    const postComment = async () => {
        let commentText = commentRef.current.value;
        const currentDate = new Date().toLocaleDateString('en-CA');

        // timestamp 
        const currentTime = playerRef.current?.getCurrentTime();

        // check if replying
        let parent_id;
        if (replyingComment) {
            parent_id = replyingComment.id;

            let lengthToTruncate = replyingComment.commenter_name.length + 2;

            commentText = commentText.slice(lengthToTruncate)
        } else parent_id = null;


        let commentToSend = {
            video_id: videoID,
            commenterName: username,
            comment: commentText,
            date_posted: currentDate,
            parent_comment_id: parent_id || null,
            timestamp: currentTime,
        }


        // clear comment textarea
        commentRef.current.value = "";

        try {
            await commentOnVideo(commentToSend);
            await fetchComments(videoID);
            setReplyingComment(null);

        } catch (error) {
            console.error(error);
        }

    }

    const deleteComment = async (comment) => {
        try {
            await deleteCommentRequest(comment);
            await fetchComments(videoID);
        } catch (error) {
            console.error(error);
        }
    }


    // create root comment and reply structure for display
    const rootComments = videoComments.filter(comment => comment.parent_comment_id === null);
    const replyMap = new Map();

    videoComments.forEach(comment => {
        // if comment is a reply
        if (comment.parent_comment_id !== null) {
            // if reply not already in map, set new key
            if (!replyMap.has(comment.parent_comment_id)) {
                replyMap.set(comment.parent_comment_id, []);
            }
            // push reply to map
            replyMap.get(comment.parent_comment_id).push(comment);
        }
    });

    const commentMap = new Map();
    videoComments.forEach(comment => {
        commentMap.set(comment.id, comment);
    });



    const setReplyingTo = (commentData) => {
        setReplyingComment(commentData);
        commentRef.current.value = `@${commentData.commenter_name} `
        commentRef.current.focus();
    };


    const closeReply = () => {
        setReplyingComment(null);
        commentRef.current.value = "";
    }

    const jumpToTimestamp = (time) => {
        const newProgress = time;
        setProgress(newProgress / playerRef.current?.getDuration());
        playerRef.current.seekTo(newProgress);
    };

    const commentRatio = (time) => {
        const newProgress = time;
        return newProgress / playerRef.current?.getDuration();
    }

    const renderReplies = (parentId) => {
        const replies = replyMap.get(parentId);
        if (!replies) return null;

        return replies.map(reply => {
            // find parent to show username
            const parentComment = commentMap.get(reply.parent_comment_id);
            const mention = parentComment ? `@${parentComment.commenter_name} ` : "";
            return (
                <>
                    <div className="specific-comment reply" key={reply.id}>
                        <img src="/assets/icons/reply-icon.svg" alt='reply' className="reply-indicator-display"></img>
                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-profile-pic"></img>
                        <div className="comment-div">
                            <div className="comment-top-bar">
                                <h4 className="commenter-name">{reply.commenter_name}</h4>
                                <div className="delete-date-zone">
                                    <p className="date-posted">{reply.date_posted.slice(0, 10)}</p>
                                    <img onClick={() => deleteComment(reply)} src="/assets/icons/x-icon.png" alt="Delete Comment" className="delete-comment-button"></img>
                                </div>
                            </div>
                            <div className="comment">
                                <p><span className="mention-text">{mention}</span>{reply.comment}</p>
                            </div>
                            <div className="comment-button-area">
                                <p onClick={() => jumpToTimestamp(reply.timestamp)} className="timestamp-jump">Jump</p>
                                <img className="view-more-button" alt="view more" src="/assets/icons/view more.png"></img>
                                <div className="buttons-zone">

                                    <img src="/assets/icons/heart-empty.png" alt="Like Comment" className="like-button"></img>
                                    <div className="right-comment-button-area" onClick={() => setReplyingTo(reply)}>
                                        <img src="/assets/icons/reply.png" alt="Like Comment" className="reply-icon"></img>
                                        <p className="reply-button">Reply</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* render this comments replies if it has any (chained comments) */}
                    {renderReplies(reply.id)}
                </>
            );
        });
    };



    // ----------- Video Controls ----------------------------------------------------------------------------
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
        for (const time in sortedTimes) {
            if (currTime >= sortedTimes[time]) {
                const evt = parsed_game_details[sortedTimes[time]].split(" ");
                if (evt[1] === "Gain") {
                    if (evt[0] === video.player1_name) {
                        document.getElementById("player1_score").textContent++;
                    }
                    if (evt[0] === video.player2_name) {
                        document.getElementById("player2_score").textContent++;
                    }
                }
                if (evt[1] === "Lose") {
                    if (evt[0] === video.player1_name) {
                        document.getElementById("player1_score").textContent--;
                    }
                    if (evt[0] === video.player2_name) {
                        document.getElementById("player2_score").textContent--;
                    }
                }
                if (evt[1] === "Win") {
                    if (evt[0] === video.player1_name) {
                        document.getElementById("player1_wins").textContent++;
                    }
                    if (evt[0] === video.player2_name) {
                        document.getElementById("player2_wins").textContent++;
                    }
                }
            }
        }
    }

    const handleSeekChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const updateChecks=(user)=>{
        console.log("UPDATING");
        const index = sharedUsers.indexOf(user);
        if (index > -1) {
            sharedUsers.splice(index, 1);
            }
        else{
            console.log("appending");
            sharedUsers.push(user);
            console.log(sharedUsers)
        }
        disableShare();
    }
    const disableShare=()=>{
        console.log("disabling");
        const shareButton = document.getElementById("share-button");
        const users = document.getElementsByClassName("user-checkbox");
        for(const user in users){
            if(users[user].checked == true){
                console.log(user);
                return shareButton.disabled = false;
            }
        }
        shareButton.disabled = true;
    }
    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const handleShareVideo= async ()=>{
        console.log("hereeee");
        const currentDate = new Date().toLocaleDateString('en-CA');
        const shareDetails = {
            video_id: video.id,
            user_id: null,
            shared_at: currentDate, 
        };

        console.log("shared users", sharedUsers);
        console.log("shared details: ", shareDetails);

        for(const index in sharedUsers){
            console.log(shareDetails);
            shareDetails.user_id = sharedUsers[index].id;
            const response = await shareVideo(shareDetails);
            console.log("reponse: ", response);
        }
    };

    // ----------- Rendered Content ----------------------------------------------------------------------------
    return (
        <div className="watch-video-page">
            <h1 id="page-title">Watch Video</h1>
            <div className="poster-row">
                <div className="poster-info">
                    <img src='/assets/squash-guy.jpg' alt='profile cover' className="poster-profile-pic"></img>
                    <h3 id="video-poster">{video.poster}</h3>
                </div>
                <div className="share-section">
                <img src='/assets/icons/share icon.png' className="share-icon" onClick={()=>setShareOpen(!shareOpen)}></img>
                {shareOpen && <div className="share-panel">
                    <h4 className='share-text'>Share with User</h4>
                    <input type="text" className="user-search-input" placeholder="Search..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <div className='user-list'>
                    {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                        <label className="share-user-container">
                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="user-profile-pic"></img>
                        <label>{user.username}</label>
                        <input type="checkbox" className="user-checkbox" onClick={()=>updateChecks(user)}/>
                        <span class="checkmark"></span>
                        </label>
              ))
            ) : (
              <p>No videos found</p>
            )}
                    </div>

                    <button className="share-button" id="share-button" onClick={handleShareVideo}>Share</button>
                    </div>}
                    
                </div>
                <div
                    onClick={() => setVideoOptionsOpen(!videoOptionsOpen)}
                    className="video-creator-controls"
                >
                    <img src="/assets/icons/3 dots.png" alt="more video info" className="three-dots"></img>
                    {videoOptionsOpen && <div className="video-options-panel">
                        <div className="option-row">
                            <img src="/assets/icons/delete.png" alt="delete video" className="option-icon"></img>
                            <p onClick={() => deleteVideo()}className="option-text">Delete Video</p>
                        </div>
                    </div>}
                </div>

            </div>
            <div className="watch-video-page-column">
                <div className="video-comments-section-row">
                    <div className="video-area">
                        {/* YouTube Video Player */}
                        <div className="react-player-wrapper">
                            <ReactPlayer
                                ref={playerRef}
                                url={video.url}
                                playing={playing}
                                controls={false}
                                width="95%"
                                height="100%"
                                className="react-player"
                                onProgress={handleProgress}
                                onDuration={(duration) => setVideoLength(duration)}
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                            />
                        </div>

                        {/* Scoreboard */}
                        <div className="video-point-display">
                            <div className="video-player1-color" id='player1-color' style={{ backgroundColor: video.player1_color }}></div>
                            <p className='video-player-name'>{video.player1_name}</p>
                            <div className="video-player1_wins" id="player1_wins">0</div>
                            <div className='video-score-background'><p id="player1_score">0</p><p >-</p><p id="player2_score">0</p></div>
                            <div className="video-player2_wins" id="player2_wins">0</div>
                            <p className='video-player-name'>{video.player2_name}</p>
                            <div className="video-player2-color" style={{ backgroundColor: video.player2_color }}></div>
                        </div>

                        {/* Video Controls */}
                        <div className="controls">
                            <button onClick={handlePlayPause}><img className="play-pause" alt="play/pause video" src={playing ? '/assets/icons/pause-icon.png' : '/assets/icons/play-icon.png'}></img></button>
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
                                <div className="slider-background">
                                    <div id="timestamps">
                                        {Object.keys(parsed_game_details).map(time => (<div className='tick' style={{ left: (commentRatio(time) * 100 + 0.5) + '%' }}><span class='tooltiptext'>{parsed_game_details[time]}</span></div>)
                                        )}
                                    </div>
                                </div>
                            </div>


                            <span>
                                {formatTime(progress * (playerRef.current?.getDuration() || 0))} / {formatTime(playerRef.current?.getDuration() || 0)}
                            </span>
                        </div>


                    </div>


                    {/* Comment Section */}
                    <div className="comment-section">
                        <div className="comment-section-top-bar">
                            <h2 id="coaching-header">Coaching Feed</h2>
                            <div class="coach-tabs">
                                <button className="tablinks"></button>
                            </div>
                        </div>


                        {/* Comments List */}
                        <div className="comments-area">
                            {noComments && <h4 className='no-comments-text'>No Comments to Display</h4>}

                            {rootComments.map(commentInfo => (
                                <div className="comment-and-replies">
                                    <div className="specific-comment" key={commentInfo.id}>
                                        {/* ROOT COMMENT */}
                                        <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-profile-pic"></img>
                                        <div className="comment-div">
                                            <div className="comment-top-bar">
                                                <h4 className="commenter-name">{commentInfo.commenter_name}</h4>
                                                <div className="delete-date-zone">
                                                    <p className="date-posted">{commentInfo.date_posted.slice(0, 10)}</p>
                                                    <img onClick={() => deleteComment(commentInfo)} src="/assets/icons/x-icon.png" alt="Delete Comment" className="delete-comment-button"></img>
                                                </div>
                                            </div>
                                            <div className="comment">
                                                <p>{commentInfo.comment}</p>
                                            </div>
                                            <div className="comment-button-area">
                                                <p onClick={() => jumpToTimestamp(commentInfo.timestamp)} className="timestamp-jump">Jump</p>
                                                <img className="view-more-button" alt="view more" src="/assets/icons/view more.png"></img>
                                                <div className="buttons-zone">
                                                    <img src="/assets/icons/heart-empty.png" alt="Like Comment" className="like-button"></img>
                                                    <div className="right-comment-button-area" onClick={() => setReplyingTo(commentInfo)}>
                                                        <img src="/assets/icons/reply.png" alt="Like Comment" className="reply-icon"></img>
                                                        <p className="reply-button">Reply</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* render replies recursively */}
                                    {renderReplies(commentInfo.id)}
                                </div>

                            ))}

                            <div ref={bottomRef}></div>

                        </div>

                        {/* Comment Input */}
                        <div className="comment-input-bar">
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
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    postComment(e);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Post Comment */}
                                <button className="post-reply-button" onClick={() => postComment()}>Post</button>
                            </div>

                        </div>


                    </div>
                </div>
            </div>

            <div className="video-description">
                <div className="top-description-row">
                    <h2>{video.title}</h2>
                    <p>Posted on {video.date_posted}</p>
                </div>
                <h4>Description</h4>
                <p>{video.description || "No description provided."}</p>
            </div>
        </div>

    );
}

export default Video; 