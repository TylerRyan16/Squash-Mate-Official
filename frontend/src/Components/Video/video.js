import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams, useNavigate } from 'react-router-dom';
import { getSpecificVideo, getCommentsForVideo, commentOnVideo, getMyUsername, deleteCommentRequest, deleteVideoRequest, getAllUsers, shareVideo, getProfilePicForPoster } from "../../services/api";

// MUI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ----------- Utility Functions ----------------------------------------------------------------------------
function changeHeart() {
    const heart = document.getElementById("heart-icon");
    if (heart.src.indexOf("/assets/icons/heart-empty.png") !== -1) {
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
    const [posterPic, setPosterPic] = useState("");

    // comment stuff
    const [videoComments, setVideoComments] = useState([]);
    const [username, setUsername] = useState("");
    const [noComments, setNoComments] = useState(true);
    const [replyingComment, setReplyingComment] = useState(null);
    const commentRef = useRef();
    const bottomRef = useRef(null);
    const [amPoster, setAmPoster] = useState(false);
    const [profilePicMap, setProfilePicMap] = useState({});

    // video player stuff
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoLength, setVideoLength] = useState(0);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const playerRef = useRef(null);

    const deleteVideo = async () => {
        try {
            await deleteVideoRequest(video);
            navigate("/");
        } catch (error) {
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
                setVideo(currentVideo);

                console.log("current poster: ", currentVideo.poster);
                // use video poster to query DB for their pfp
                const profilePicResponse = await getProfilePicForPoster(currentVideo.poster);
                console.log("profile pic found: ", profilePicResponse);
                setPosterPic(profilePicResponse);
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

        const fetchAllUsers = async () => {
            try {
                const users = await getAllUsers();
                setAllUsers(users);
            } catch (error) {
                console.log(error);
            }
        }

        fetchSpecificVideo(videoID);
        getUser();
        fetchAllUsers();
        fetchComments(videoID);

    }, [])

    // Grab comments for the video
    useEffect(() => {
    }, [video])

    // SCROLL TO NEW COMMENT WHEN POSTED
    // useEffect(() => {
    //     if (videoComments.length > 0 && bottomRef.current) {
    //         bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    //     }
    // }, [videoComments]);

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

            const picMap = {};
            for (const comment of comments){
                const name = comment.commenter_name;
                if (!picMap[name]){
                    try {
                        const pic = await getProfilePicForPoster(name);
                        picMap[name] = pic;
                    } catch (error){
                        picMap[name] = "default";
                    }
                }
            }
            setProfilePicMap(picMap);
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


        // clear comment 
        commentRef.current.value = "";

        try {
            await commentOnVideo(commentToSend);
            await fetchComments(videoID);
            setReplyingComment(null);
            const commentsArea = document.getElementById("")

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
                        <img src={`/assets/characters/${profilePicMap[reply.commenter_name || "default"]}.png`} alt='profile cover' className="comment-profile-pic"></img>
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

    const updateChecks = (user) => {
        const index = sharedUsers.indexOf(user);
        if (index > -1) {
            sharedUsers.splice(index, 1);
        }
        else {
            sharedUsers.push(user);
        }
        disableShare();
    }
    const disableShare = () => {
        const shareButton = document.getElementById("share-button");
        const users = document.getElementsByClassName("user-checkbox");
        for (const user in users) {
            if (users[user].checked === true) {
                return shareButton.disabled = false;
            }
        }
        shareButton.disabled = true;
    }
    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleShareVideo = async () => {
        const currentDate = new Date().toLocaleDateString('en-CA');
        const shareDetails = {
            video_id: video.id,
            user_id: null,
            shared_at: currentDate,
        };

        for (const index in sharedUsers) {
            shareDetails.user_id = sharedUsers[index].id;
            const response = await shareVideo(shareDetails);

        }
    };

    const getProfilePic = async (username) => {
        try {
            const response = await getProfilePicForPoster(username);
            console.log("found profile color: ", response);
            return response;
        } catch (error){
            console.log(error);
        }
    }

    // ----------- Rendered Content ----------------------------------------------------------------------------
    return (
        <div className="watch-video-page">
            <h1 id="page-title">Watch Video</h1>

            {/* TOP ROW (POSTER, OPTIONS) */}
            <div className="poster-row">
                <div className="poster-info">
                    <img className="poster-profile-pic" src={`/assets/characters/${posterPic}.png`} alt="profile cover"></img>
                    <h3 id="video-poster">{video.poster}</h3>
                </div>

                {/* VIDEO OPTIONS */}
                <div
                    onClick={() => setVideoOptionsOpen(!videoOptionsOpen)}
                    className="video-creator-controls"
                >
                    <div className="open-options-button">
                        <img src="/assets/icons/3 dots.png" alt="more video info" className="three-dots"></img>

                    </div>
                    {/* OPTIONS PANEL */}
                    {videoOptionsOpen && <div className="video-options-panel">
                        <img src="/assets/icons/x-icon.png" alt="close options panel" className="close-popup" onClick={() => setVideoOptionsOpen(false)}></img>
                        <p className="options-title">Video Options</p>
                        <div className="option-row" onClick={() => setShareOpen(!shareOpen)}>
                            <img src='/assets/icons/share icon.png' alt="share video" className="share-icon"></img>
                            <p>Share Video</p>
                        </div>
                        <div className="option-row" onClick={() => setConfirmDeleteOpen(true)} >
                            <img src="/assets/icons/delete.png" alt="delete video" className="option-icon"></img>
                            <p className="option-text">Delete Video</p>
                        </div>
                    </div>}
                </div>

                {/* SHARE POPUP */}
                {shareOpen && (
                    <div className="popup-overlay" onClick={() => setShareOpen(false)}>
                        <div className="share-panel" onClick={(e) => e.stopPropagation()}>
                            <h4 className='share-text'>Share with User</h4>
                            <img src="/assets/icons/x-icon.png" alt="close share page" className="close-popup" onClick={() => setShareOpen(false)}></img>
                            <input
                                type="text"
                                className="user-search-input"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className='user-list'>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <label className="share-user-container" key={user.id}>
                                            <img src='/assets/squash-guy.jpg' alt='profile cover' className="user-profile-pic" />
                                            <label>{user.username}</label>
                                            <input
                                                type="checkbox"
                                                className="user-checkbox"
                                                onClick={() => updateChecks(user)}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    ))
                                ) : (
                                    <p>No users found</p>
                                )}
                            </div>
                            <button className="share-button" id="share-button" onClick={handleShareVideo}>Share</button>
                        </div>
                    </div>
                )}

                {/* DELETE POPUP */}
                {confirmDeleteOpen && (
                    <div className="popup-overlay" onClick={() => setConfirmDeleteOpen(false)}>
                        <div className="delete-panel" onClick={(e) => e.stopPropagation()}>
                            <h4 className='share-text'>Are you sure you want to delete this video?</h4>
                            <img src="/assets/icons/x-icon.png" alt="close delete page" className="close-popup" onClick={() => setConfirmDeleteOpen(false)}></img>
                            <div className="delete-buttons-row">
                                <button className="go-back-button" onClick={() => setConfirmDeleteOpen(false)}>Go Back</button>
                                <button className="confirm-delete-button" onClick={() => deleteVideo()}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>


            {/* WATCH VIDEO & COMMENTS AREA */}
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
                                        {

                                        }
                                        {Object.keys(parsed_game_details).map(time => {
                                            const details = parsed_game_details[time];
                                            const playerName = details.split(" ")[0];
                                            const bgColor = playerName === video.player1_name
                                                ? video.player1_color
                                                : video.player2_color;

                                            return (
                                                <div
                                                    className='tick'
                                                    key={time}
                                                    style={{
                                                        left: (commentRatio(time) * 100 + 0.5) + '%',
                                                        backgroundColor: bgColor,
                                                    }}
                                                >
                                                    <span className='tooltiptext'>{details}</span>
                                                </div>
                                            );
                                        })}
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
                        <div className="comments-area" id="comments-scroll">
                            {noComments && <h4 className='no-comments-text'>No Comments to Display</h4>}

                            {rootComments.map(commentInfo => (
                                <div className="comment-and-replies">
                                    <div className="specific-comment" key={commentInfo.id}>
                                        {/* ROOT COMMENT */}
                                        <img src={`/assets/characters/${profilePicMap[commentInfo.commenter_name || "default"]}.png`}  alt='profile cover' className="comment-profile-pic"></img>
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
                            <div className="input-section">
                                {replyingComment && <div className="close-button-column">
                                    <img src="/assets/icons/x-icon.png" alt='reply' className="close-reply-button" onClick={() => closeReply()}></img>
                                    <img src="/assets/icons/reply-icon.svg" alt='reply' className="reply-indicator"></img>
                                </div>}


                                <TextField
                                    multiline
                                    fullWidth
                                    rows={1}
                                    maxRows={4}
                                    inputRef={commentRef}
                                    placeholder="Message..."
                                    variant="outlined"
                                    className="comment-input"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            postComment(e);
                                        }
                                    }}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: "#b5d4f3",
                                            alignItems: "flex-start",     // ensure top alignment
                                            paddingTop: "10px",           // optional, visual buffer
                                        }
                                    }}
                                />
                            </div>

                            {/* Post Comment */}

                            <Button
                                variant="contained"
                                className="post-reply-button"
                                onClick={() => postComment()}
                                sx={{
                                    height: "50%",
                                    padding: "10px 0px",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                }}

                            >
                                Post
                            </Button>
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