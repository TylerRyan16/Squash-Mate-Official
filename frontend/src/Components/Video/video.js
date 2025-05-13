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
    const playerContainerRef = useRef(null);
    const [fullscreen, setFullscreen] = useState(false);

    // sharing
    const [shareDisabled, setShareDisabled] = useState(true);
    const [invalidShare, setInvalidShare] = useState(false);

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
                // use video poster to query DB for their pfp
                const profilePicResponse = await getProfilePicForPoster(currentVideo.poster);
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

    }, [videoID])

    // disable share button on empty list
    useEffect(() => {
        if (sharedUsers.length === 0) {
            setShareDisabled(true);
        } else {
            setShareDisabled(false);
        }
    }, [sharedUsers]);

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
            for (const comment of comments) {
                const name = comment.commenter_name;
                if (!picMap[name]) {
                    try {
                        const pic = await getProfilePicForPoster(name);
                        picMap[name] = pic;
                    } catch (error) {
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
                <div key={reply.id} className="w-full relative">
                    <div className="w-full h-fit flex justify-start border-b-2 border-b-neutral-300/50 mb-1 py-1">
                        {/* reply icon indicator */}
                        <img src="/assets/icons/reply-icon.svg" alt="reply" className="w-4 h-4 self-start mr-1 mt-2" />

                        {/* profile picture */}
                        <img src={`/assets/characters/${profilePicMap[reply.commenter_name || "default"]}.png`} alt="profile cover" className="w-10 h-10 md:w-14 md:h-14" />

                        <div className="w-full flex flex-col pl-1">
                            {/* name, timestamp, delete button */}
                            <div className="w-full h-1/6 flex items-center justify-between mt-2">
                                <h4 className="m-0 p-0 text-base font-bold">{reply.commenter_name}</h4>
                                <div className="flex justify-center items-center gap-2 mr-5">
                                    <p className="text-xs text-neutral-600 italic">{formatDate(reply.date_posted)}</p>
                                    <img onClick={() => deleteComment(reply)} src="/assets/icons/x-icon.png" alt="Delete Comment" className="h-4 cursor-pointer" />
                                </div>
                            </div>

                            {/* comment text */}
                            <div className="w-full h-1/2 overflow-hidden text-ellipsis text-sm">
                                <p><span className="text-blue-600 font-medium">{mention}</span>{reply.comment}</p>
                            </div>

                            {/* bottom button bar */}
                            <div className="w-full h-1/4 flex justify-between items-center">
                                <div className="flex items-center justify-center ">
                                    <img src="/assets/icons/heart-empty.png" alt="Like Comment" className="w-8 cursor-pointer" />
                                    <p className="cursor-pointer font-medium text-sm">Reply</p>
                                </div>
                                <img className="w-3 -end h-1 cursor-pointer p-0 m-0 opacity-80 mb-1" alt="view more" src="/assets/icons/view more.png" />
                                <p onClick={() => jumpToTimestamp(reply.timestamp)} className="cursor-pointer text-xs">Jump</p>

                            </div>
                        </div>
                    </div>

                    {/* render nested replies */}
                    {renderReplies(reply.id)}
                </div>
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
        return <p className="text-neutral-300 text-center">{mins}:{secs}</p>
    };

    const updateChecks = (user) => {
        const index = sharedUsers.findIndex(u => u.id === user.id);
        let updatedUsers;
        // if already in list, remove
        if (index > -1) {
            updatedUsers = sharedUsers.filter(u => u.id !== user.id);
        }
        // if not in list, push
        else {
            updatedUsers = [...sharedUsers, user];
        }
        setSharedUsers(updatedUsers);

        // disableShare();
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
            // error
            if (!response.success) {
                if (response.reason === 'already_shared') {
                    setInvalidShare(true);
                } else {
                    console.log(response.reason);
                    alert(response.message || "Unknown error. Please contact support.");
                }
                // SUCCESS
            } else {
                setInvalidShare(false);
                setShareOpen(false);

            }
        }

    };

    const formatDate = (date) => {
        return date ? date.slice(0, 10) : "";
    }



    const toggleFullScreen = () => {
        const elem = playerContainerRef.current;

        if (!document.fullscreenElement) {
            elem?.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChanged = () => {
            const isFull = !!document.fullscreenElement;
            setFullscreen(isFull);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChanged);

        return (() => {
            document.removeEventListener("fullscreenchange", handleFullscreenChanged);

        });
    }, [])

    // ----------- Rendered Content ----------------------------------------------------------------------------
    return (
        <div className="flex flex-col w-full h-screen max-w-full items-center">

            {/* VIDEO WRAPPER */}
            <div className="w-full bg-black flex flex-col justify-center items-center relative group"
                ref={playerContainerRef}>
                {/* YouTube Video Player */}
                <div className={`${fullscreen ? '' : 'max-w-6xl'} aspect-video w-full  bg-black relative`}>
                    <ReactPlayer
                        ref={playerRef}
                        url={video.url}
                        playing={playing}
                        controls={false}
                        width="100%"
                        height="100%"
                        onProgress={handleProgress}
                        onDuration={(duration) => setVideoLength(duration)}
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        config={{
                            youtube: {
                                playerVars: {
                                    rel: 0,
                                    modestbranding: 1,
                                    showInfo: 0,
                                }
                            }
                        }}
                    />
                </div>

                {/* Video Controls */}
                <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 absolute bottom-0 left-0 flex justify-between items-center w-full h-auto rounded-lg pr-5">
                    {/* VIDEO TIMELINE */}
                    <div className="absolute top-0 h-2 w-full">
                        {/* range slider */}
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={progress}
                            onChange={handleSeekChange}
                            className="z-50 absolute top-0 text-center w-full h-full border-solid appearance-none
                            [&::-webkit-slider-runnable-track]:bg-transparent"
                        ></input>

                        {/* dark background */}
                        <div className="w-full h-full bg-gray-900/90 absolute top-0">
                            {/* timestamps */}
                            <div id="timestamps">
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

                    <div className="flex gap-2">
                        {/* play/pause button */}
                        <button onClick={handlePlayPause} className="p-2">
                            {/* play button */}
                            <svg
                                className={`w-6 ml-5 mt-2 text-white ${playing ? 'hidden' : 'block'}`}
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 326.41 368.37"
                                fill="currentColor"
                            >
                                <path d="M27.91,367.87c-15.12,0-27.41-12.3-27.41-27.41V27.91C.5,12.8,12.8.5,27.91.5c4.79,0,9.38,1.25,13.64,3.71l270.67,156.27c8.57,4.95,13.69,13.81,13.69,23.7s-5.12,18.76-13.69,23.71L41.56,364.16c-4.26,2.46-8.85,3.71-13.64,3.71h0Z" /><path d="M27.91,1c4.7,0,9.21,1.23,13.39,3.64l270.67,156.27c8.41,4.86,13.44,13.56,13.44,23.27s-5.02,18.41-13.44,23.27L41.31,363.72c-4.19,2.42-8.69,3.64-13.39,3.64-14.84,0-26.91-12.07-26.91-26.91V27.91C1,13.07,13.07,1,27.91,1M27.91,0C13.35,0,0,11.64,0,27.91v312.54c0,16.27,13.36,27.91,27.91,27.91,4.64,0,9.4-1.18,13.89-3.78l270.67-156.27c18.58-10.73,18.58-37.55,0-48.28L41.81,3.78c-4.49-2.59-9.25-3.78-13.89-3.78h0Z" />
                            </svg>

                            {/* pause button */}
                            <svg
                                className={`w-3 ml-5 mt-2 text-white ${playing ? 'block' : 'hidden'}`}
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 202.12 454.55"
                                fill="currentColor"
                            >
                                <rect x=".5" y=".5" width="76.12" height="453.55" rx="21.38" ry="21.38" /><path d="M55.24,1c11.51,0,20.88,9.36,20.88,20.88v410.79c0,11.51-9.36,20.88-20.88,20.88H21.88c-11.51,0-20.88-9.36-20.88-20.88V21.88C1,10.36,10.36,1,21.88,1h33.37M55.24,0H21.88C9.84,0,0,9.84,0,21.88v410.79c0,12.03,9.84,21.88,21.88,21.88h33.37c12.03,0,21.88-9.84,21.88-21.88V21.88c0-12.03-9.84-21.88-21.88-21.88h0Z" /><rect x="125.5" y=".5" width="76.12" height="453.55" rx="21.38" ry="21.38" /><path d="M180.24,1c11.51,0,20.88,9.36,20.88,20.88v410.79c0,11.51-9.36,20.88-20.88,20.88h-33.37c-11.51,0-20.88-9.36-20.88-20.88V21.88c0-11.51,9.36-20.88,20.88-20.88h33.37M180.24,0h-33.37c-12.03,0-21.88,9.84-21.88,21.88v410.79c0,12.03,9.84,21.88,21.88,21.88h33.37c12.03,0,21.88-9.84,21.88-21.88V21.88c0-12.03-9.84-21.88-21.88-21.88h0Z" />
                            </svg>
                        </button>



                        <div className="w-full flex items-center justify-center gap-2 text-neutral-400 pt-2">
                            {formatTime(progress * (playerRef.current?.getDuration() || 0))} / {formatTime(playerRef.current?.getDuration() || 0)}
                        </div>
                    </div>

                    {/* fullscreen button */}
                    <svg
                        className="w-5 ml-5 mt-2 text-white cursor-pointer"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 487.75 517.99"
                        fill="currentColor"
                        onClick={toggleFullScreen}
                    >
                        <path d="M449.39,195.04c-6.34,0-11.5-5.16-11.5-11.5V49.87h-133.68c-6.34,0-11.5-5.16-11.5-11.5V12c0-6.34,5.16-11.5,11.5-11.5h171.54c6.34,0,11.5,5.16,11.5,11.5v171.54c0,6.34-5.16,11.5-11.5,11.5h-26.37Z" /><path d="M475.75,1c6.07,0,11,4.93,11,11v171.55c0,6.07-4.93,11-11,11h-26.37c-6.07,0-11-4.93-11-11V49.37h-134.18c-6.07,0-11-4.93-11-11V12c0-6.07,4.93-11,11-11h171.55M475.75,0h-171.55c-6.6,0-12,5.4-12,12v26.37c0,6.6,5.4,12,12,12h133.18v133.18c0,6.6,5.4,12,12,12h26.37c6.6,0,12-5.4,12-12V12c0-6.6-5.4-12-12-12h0Z" /><path d="M12,195.04c-6.34,0-11.5-5.16-11.5-11.5V12C.5,5.66,5.66.5,12,.5h171.55c6.34,0,11.5,5.16,11.5,11.5v26.37c0,6.34-5.16,11.5-11.5,11.5H49.87v133.68c0,6.34-5.16,11.5-11.5,11.5H12Z" /><path d="M183.55,1c6.07,0,11,4.93,11,11v26.37c0,6.07-4.93,11-11,11H49.37v134.18c0,6.07-4.93,11-11,11H12c-6.07,0-11-4.93-11-11V12C1,5.93,5.93,1,12,1h171.55M183.55,0H12C5.4,0,0,5.4,0,12v171.55c0,6.6,5.4,12,12,12h26.37c6.6,0,12-5.4,12-12V50.37h133.18c6.6,0,12-5.4,12-12V12C195.55,5.4,190.15,0,183.55,0h0Z" /><path d="M304.21,517.49c-6.34,0-11.5-5.16-11.5-11.5v-26.37c0-6.34,5.16-11.5,11.5-11.5h133.68v-133.68c0-6.34,5.16-11.5,11.5-11.5h26.37c6.34,0,11.5,5.16,11.5,11.5v171.54c0,6.34-5.16,11.5-11.5,11.5h-171.54Z" /><path d="M475.75,323.45c6.07,0,11,4.93,11,11v171.55c0,6.07-4.93,11-11,11h-171.55c-6.07,0-11-4.93-11-11v-26.37c0-6.07,4.93-11,11-11h134.18v-134.18c0-6.07,4.93-11,11-11h26.37M475.75,322.45h-26.37c-6.6,0-12,5.4-12,12v133.18h-133.18c-6.6,0-12,5.4-12,12v26.37c0,6.6,5.4,12,12,12h171.55c6.6,0,12-5.4,12-12v-171.55c0-6.6-5.4-12-12-12h0Z" /><path d="M12,517.49c-6.34,0-11.5-5.16-11.5-11.5v-171.54c0-6.34,5.16-11.5,11.5-11.5h26.37c6.34,0,11.5,5.16,11.5,11.5v133.68h133.68c6.34,0,11.5,5.16,11.5,11.5v26.37c0,6.34-5.16,11.5-11.5,11.5H12Z" /><path d="M38.37,323.45c6.07,0,11,4.93,11,11v134.18h134.18c6.07,0,11,4.93,11,11v26.37c0,6.07-4.93,11-11,11H12c-6.07,0-11-4.93-11-11v-171.55c0-6.07,4.93-11,11-11h26.37M38.37,322.45H12c-6.6,0-12,5.4-12,12v171.55c0,6.6,5.4,12,12,12h171.55c6.6,0,12-5.4,12-12v-26.37c0-6.6-5.4-12-12-12H50.37v-133.18c0-6.6-5.4-12-12-12h0Z" />
                    </svg>

                </div>
            </div>



            {/* Scoreboard */}
            <div className="bg-[#4B3C3C] md:w-2/5 w-10/12 mt-2 h-28 flex self-center items-center justify-center border-2 border-[#3D3D3D] rounded-lg">
                {/* player 1 color */}
                <div className="flex-grow-1 h-full w-1/12" id='player1-color' style={{ backgroundColor: video.player1_color }}></div>
                {/* player 1 wins */}
                <div className="h-full bg-[#315fb9] text-white w-1/12 text-center content-center text-xl px-2 font-bold" id="player1_wins">0</div>
                {/* player 1 name */}
                <p className='text-sm md:text-base font-bold text-white w-1/3 px-4 py-4 text-center'>{video.player1_name}</p>
                {/* score */}
                <div className='bg-[#3D3D3D] text-white h-full w-1/4 text-center flex items-center justify-center'><p className="text-sm" id="player1_score">0</p><p className="text-sm">-</p><p className="text-sm" id="player2_score">0</p></div>
                {/* player 2 name */}
                <p className='text-sm md:text-base font-bold text-white w-1/3 px-4 py-4 text-center'>{video.player2_name}</p>
                {/* player 2 wins */}
                <div className="h-full bg-[#315fb9] text-white w-1/12 text-center content-center text-xl px-2 font-bold" id="player2_wins">0</div>
                {/* player 2 color */}
                <div className="flex-grow-1 h-full w-1/12" style={{ backgroundColor: video.player2_color }}></div>
            </div>

            {/* video title */}
            <h1 className="self-start text-left text-xl font-bold px-5 py-1 mt-1.5">{video.title}</h1>
            <div className="w-full flex justify-between items-center px-4">


                {/* profile picture & name of poster */}
                <div className="flex items-center gap-1">
                    <img className="w-6 h-auto" src={`/assets/characters/${posterPic}.png`} alt="profile cover"></img>
                    <p className="text-base font-semibold p-0">{video.poster}</p>
                </div>

                <div className="flex gap-1 items-center justify-center">

                    <p className="text-xs text-neutral-500 ">Posted on {formatDate(video.date_posted)}</p>

                    {/* VIDEO OPTIONS (3 dots) */}
                    <div
                        onClick={() => setVideoOptionsOpen(!videoOptionsOpen)}
                        className="relative flex items-center justify-center rounded-full transition-all duration-100"
                    >
                        <img src="/assets/icons/3 dots.png" alt="more video info" className="w-4 cursor-pointer p-1 rounded-lg hover:bg-neutral-600/30"></img>

                        {/* OPTIONS PANEL */}
                        {videoOptionsOpen && <div className="video-options-panel">
                            <img src="/assets/icons/x-icon.png" alt="close options panel" className="absolute top-2 right-2 w-3 h-auto cursor-pointer" onClick={() => setVideoOptionsOpen(false)}></img>
                            <p className="options-title">Video Options</p>
                            <div className="option-row" onClick={() => {
                                setShareOpen(!shareOpen);
                                setInvalidShare(false);
                                setSharedUsers([]);
                            }}>
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
                        <div className="fixed top-0 left-0 w-screen h-screen bg-black/60 z-50 flex items-center justify-center" onClick={() => setShareOpen(false)}>
                            <div className="relative flex flex-col rounded-lg w-3/4 md:w-1/4 h-3/4 md:h-1/2 z-50 bg-navbar shadow-xl border-2 border-neutral-400/50 text-center items-center" onClick={(e) => e.stopPropagation()}>
                                <h4 className='text-base font-bold'>Share with User</h4>
                                <img src="/assets/icons/x-icon.png" alt="close share page" className="absolute top-2 right-2 w-3 h-auto cursor-pointer" onClick={() => setShareOpen(false)}></img>
                                <input
                                    type="text"
                                    className="w-full h-12 px-1"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className='w-full h-3/4 overflow-y-scroll flex flex-col gap-2 '>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            // individual user container
                                            <div
                                                className="border-b-2 border-neutral-200/50 w-full h-12 flex gap-2 items-center justify-start relative overflow-x-hidden pl-5 py-y1 cursor-pointer text-md"
                                                key={user.id}
                                                onClick={() => updateChecks(user)}
                                            >
                                                {/* dark checkmark */}
                                                <span className={`${sharedUsers.find(u => u.id === user.id) ? 'bg-green-500' : 'bg-neutral-300'} h-6 w-6 rounded-md self-center`}></span>

                                                {/* profile pic */}
                                                <img src='/assets/squash-guy.jpg' alt='profile cover' className="user-profile-pic" />
                                                {/* username */}

                                                <p>{user.username}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No users found</p>
                                    )}
                                </div>
                                <p className={`${invalidShare === true ? 'opacity-100 block' : 'opacity-0 hidden'} transition-all duration-300 text-xs text-red-500`}>Video has already been shared with one or more users.</p>
                                <button className="share-button" id="share-button" disabled={shareDisabled} onClick={handleShareVideo}>Share</button>
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
            </div>

            {/* DESCRIPTION */}
            <div className="w-11/12 self-start ml-4 h-auto mt-2 mb-3 rounded-md bg-neutral-200">
                <p className="text-sm">{video.description || "No description provided."}</p>
            </div>



            {/* Comment Section */}
            <div className="w-full h-full flex flex-col items-center justify-start relative gap-2">
                <h1 className="text-xl font-semibold self-start px-4">Comments</h1>
                <p className="italic text-neutral-400 self-start px-8">Leave a comment!</p>

                {/* Comment Input */}
                <div className="w-full px-6 flex items-center justify-center">
                    <div className="relative w-3/4 h-full flex flex-row">
                        {replyingComment && <div className="close-button-column">
                            <img src="/assets/icons/x-icon.png" alt='reply' className="close-reply-button" onClick={() => closeReply()}></img>
                            <img src="/assets/icons/reply-icon.svg" alt='reply' className="reply-indicator"></img>
                        </div>}


                        <TextField
                            multiline
                            fullWidth
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
                            height: "100%",
                            padding: "10px 0px",
                            fontSize: "18px",
                            fontWeight: 600,
                            marginLeft: 1,
                        }}

                    >
                        Post
                    </Button>
                </div>

                {/* Comments List */}
                <div className="w-full h-auto px-6" id="comments-scroll">
                    {noComments && <h4 className='self-center italic text-lg font-bold'>No Comments to Display</h4>}

                    {rootComments.map(commentInfo => (
                        <div className="w-full h-fit" key={commentInfo.id}>
                            {/* ROOT COMMENT */}
                            <div className="w-full h-fit flex justify-start border-b-2 border-b-neutral-300/50 mb-1 py-1">
                                {/* profile pic */}
                                <img src={`/assets/characters/${profilePicMap[commentInfo.commenter_name || "default"]}.png`} alt='profile cover' className="w-10 h-10 md:w-14 md:h-14"></img>
                                <div className="w-full flex flex-col pl-1">
                                    {/* name, timestamp, delete button */}
                                    <div className="w-full h-1/6 flex items-center justify-between mt-2">
                                        <h4 className="m-0 p-0 text-base font-bold">{commentInfo.commenter_name}</h4>
                                        <div className="flex justify-center items-center gap-2 mr-5">
                                            <p className="text-xs text-neutral-600 italic">{formatDate(commentInfo.date_posted)}</p>
                                            <img onClick={() => deleteComment(commentInfo)} src="/assets/icons/x-icon.png" alt="Delete Comment" className="h-4 cursor-pointer"></img>
                                        </div>
                                    </div>
                                    <div className="w-full h-1/2 overflow-hidden text-ellipsis text-sm">
                                        <p className="text-sm">{commentInfo.comment}</p>
                                    </div>
                                    <div className="w-full h-1/4 flex justify-between items-center">
                                        <p onClick={() => jumpToTimestamp(commentInfo.timestamp)} className="text-xs cursor-pointer">Jump</p>
                                        <img className="w-3 self-end h-1 cursor-pointer p-0 m-0 opacity-80 mb-1" alt="view more" src="/assets/icons/view more.png"></img>
                                        <div className="flex">
                                            <img src="/assets/icons/heart-empty.png" alt="Like Comment" className="w-8 cursor-pointer"></img>
                                            <div className="h-full w-auto flex items-center justify-center mr-3" onClick={() => setReplyingTo(commentInfo)}>
                                                <img src="/assets/icons/reply.png" alt="Like Comment" className="w-7 cursor-pointer"></img>
                                                <p className="cursor-pointer font-medium text-sm">Reply</p>
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

                <div className="w-full h-32">

                </div>
            </div>
        </div>

    );
}

export default Video; 