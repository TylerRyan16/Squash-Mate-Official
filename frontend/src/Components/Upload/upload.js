import './upload.scss';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { uploadVideo } from "../../services/api";
import { getMyUsername } from "../../services/api";
import ReactPlayer from 'react-player';


const Upload = () => {
    const navigate = useNavigate();


    const [thumbnail, setThumbnail] = useState('');
    const [continuePressed, setContinuePressed] = useState(false);
    const [continue2Pressed, setContinue2Pressed] = useState(false);
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);


    const [videoDetails, setVideoDetails] = useState({
        title: "",
        description: "",
        url: "",
        type: "",
        length: "",
        tournament_date: "",
        tournament_name: "",
        tournament_location: "",
        player1_name: "",
        player2_name: "",
        player1_color: "#000000",
        player2_color: "#000000",
        poster: "",
        thumbnail: "",
        player1_score: 0,
        player2_score: 0,
        game_details: []
    });

    useEffect(() => {
        if (videoDetails.type === "Game") {
            setVideoDetails((prevDetails) => ({
                ...prevDetails,
                length: "Single"
            }));
        }
    }, [videoDetails.type]);

    const handlePlayPause = () => {
        setPlaying((prev) => !prev);
    };

    const handleSeekChange = (e) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        playerRef.current.seekTo(newProgress);
    };

    const commentRatio = (time) => {
        const newProgress = time;
        //return newProgress/playerRef.current?.getDuration();
        return (newProgress / playerRef.current?.getDuration()).toFixed(2);
    }

    // HANDLE VIDEO INPUT
    const handleVideoInput = (e) => {
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
        setVideoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        if (name === "url") {
            const videoId = extractYouTubeID(value);
            if (videoId) {
                setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
                setVideoDetails((prevDetails) => ({
                    ...prevDetails,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`
                }))
            } else {
                setThumbnail('');
            }
        }
    };

    const handleContinuePressed = () => {
        if (videoDetails.title && videoDetails.url && videoDetails.type) {
            setContinuePressed(true);
        } else {
            alert("Please fill in all fields!");
        }
    };

    const handleContinue2Pressed = () => {
        if (videoDetails.title && videoDetails.url && videoDetails.type && videoDetails.length) {
            setContinue2Pressed(true);
        } else {
            alert("Please fill in all fields!");
        }
    };

    const extractYouTubeID = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const increaseScore = (player_score) => {
        document.getElementById(player_score).textContent++;
        if (player_score.includes('1')) {
            videoDetails.player1_score++;
            displayCall("Gain Point", 1);
        }
        if (player_score.includes('2')) {
            videoDetails.player2_score++;
            displayCall("Gain Point", 2);
        }

        const winner = checkGameWin();
        console.log(winner + "_wins");
        if (winner) {
            document.getElementById(winner + "_wins").textContent++;
            document.getElementById("player1_score").textContent = 0;
            document.getElementById("player2_score").textContent = 0;
            videoDetails.player1_score = 0;
            videoDetails.player2_score = 0;
        }
    }
    const decreaseScore = (player_score) => {
        if (document.getElementById(player_score).textContent > 0) {
            document.getElementById(player_score).textContent--;
            if (player_score.includes('1')) {
                videoDetails.player1_score--;
                displayCall("Lose Point", 1);
            }
            if (player_score.includes('2')) {
                videoDetails.player2_score--;
                displayCall("Lose Point", 2);
            }
        }
        const winner = checkGameWin();
        if (winner) {
            if (winner.includes('1')) {
                displayCall("Win", 1);
            }
            if (winner.includes('2')) {
                displayCall("Win", 2);
            }
            document.getElementById(winner + "_wins").textContent++;
            document.getElementById("player1_score").textContent = 0;
            document.getElementById("player2_score").textContent = 0;
            videoDetails.player1_score = 0;
            videoDetails.player2_score = 0;
        }

    }

    const checkGameWin = () => {
        // check player1 win
        console.log(videoDetails.player1_score);
        if (videoDetails.player1_score >= 11 && videoDetails.player1_score - videoDetails.player2_score >= 2) {
            console.log("WIN");
            return "player1";
        }
        //check player2 win
        if (videoDetails.player2_score >= 11 && videoDetails.player2_score - videoDetails.player1_score >= 2) {
            return "player2";
        }
        return null;
    }

    const displayCall = (callName, playerNum) => {
        console.log(callName);
        if (playerNum == 1) {
            videoDetails.game_details.push(playerRef.current?.getCurrentTime() + " " + videoDetails.player1_name + " " + callName)
            const length = videoDetails.game_details.length;
            const timestamps = document.getElementById("timestamps")
            timestamps.innerHTML += "<div class='tick' id='tick" + playerNum + callName.toString() + length + "'><span class='tooltiptext'>" + videoDetails.player1_name + " " + callName.toString() + "</span></div>";
            const tick = document.getElementById("tick" + playerNum + callName.toString() + length);
            tick.style.left = (commentRatio(playerRef.current?.getCurrentTime()) * 100 + 0.5) + '%'
        }
        if (playerNum == 2) {
            videoDetails.game_details.push(playerRef.current?.getCurrentTime() + " " + videoDetails.player2_name + " " + callName)
            const length = videoDetails.game_details.length;
            const timestamps = document.getElementById("timestamps")
            timestamps.innerHTML += "<div class='tick' id='tick" + playerNum + callName.toString() + length + "'><span class='tooltiptext'>" + videoDetails.player2_name + " " + callName.toString() + "</span></div>";
            const tick = document.getElementById("tick" + playerNum + callName.toString() + length);
            tick.style.left = (commentRatio(playerRef.current?.getCurrentTime()) * 100 + 0.5) + '%'
        }
    }

    // VIDEO UPLOAD
    const handleVideoUpload = async () => {
        console.log(videoDetails);
        try {
            const uploader = await getMyUsername();
            console.log("uploader name: ", uploader);

            videoDetails.poster = uploader.username;

            const response = await uploadVideo(videoDetails);
            console.log("reponse: ", response);

            const databaseVideoId = response.id;
            navigate(`/video/${databaseVideoId}`);

        } catch (error) {
            console.log(error);
        }
    };
    const handleProgress = (state) => {
        setProgress(state.progress);
    };

    return (
        <div className="page-container">
            {/* PAGE ONE */}
            {!continuePressed && !continue2Pressed && <div className="page-one">
                {/* LINK */}
                <div className="input-container">
                    <label className="floating-label">URL (required)</label>
                    <input
                        type="text"
                        className="input-zone url"
                        name="url"
                        value={videoDetails.url}
                        onChange={handleVideoInput}
                    ></input>
                </div>


                {/* VIDEO DISPLAY */}
                {thumbnail && <img src={thumbnail} alt="thumbnail" className="video-thumbnail"></img>}

                {/* TITLE / TYPE AREA */}
                <div className="title-type-area">
                    {/* TITLE */}
                    <div className="input-container">
                        <label className="floating-label">Title (required)</label>
                        <input
                            type="text"
                            className="input-zone title"
                            name="title"
                            value={videoDetails.title}
                            onChange={handleVideoInput}
                        ></input>
                    </div>

                    {/* MATCH TYPE */}
                    <div className="match-type-area">
                        <button
                            className={`match-type-button ${videoDetails.type === 'Match' ? 'selected' : ''}`}
                            name="type"
                            value="Match"
                            onClick={handleVideoInput}
                        >Match</button>
                        <button
                            className={`match-type-button ${videoDetails.type === 'Game' ? 'selected' : ''}`}
                            name="type"
                            value="Game"
                            onClick={handleVideoInput}

                        >Game</button>
                        <button
                            className={`match-type-button ${videoDetails.type === 'Casual' ? 'selected' : ''}`}
                            name="type"
                            value="Casual"
                            onClick={handleVideoInput}
                        >Casual</button>
                    </div>
                </div>

                {/* CONTINUE BUTTON */}
                <button
                    className="continue-button"
                    onClick={() => handleContinuePressed()}
                >Continue</button>
            </div>}


            {/* PAGE TWO */}
            {continuePressed && !continue2Pressed && <div className="page-two">
                <div className="left-vertical-upload">
                    <div className="upload-input-2">
                        <div className="left-upload-input-section">
                            {/* MORE DETAILS */}

                            {/* LENGTH: TYPE = MATCH */}
                            <div className="best-of-area">
                                <p>Best Of</p>
                                {videoDetails.type === "Match" &&
                                    <div className='match-length-area'>
                                        <button
                                            className={`match-length-button ${videoDetails.length === 'Three' ? 'selected' : ''}`}
                                            name="length"
                                            value="Three"
                                            onClick={handleVideoInput}
                                        >Three</button>
                                        <button
                                            className={`match-length-button ${videoDetails.length === 'Five' ? 'selected' : ''}`}
                                            name="length"
                                            value="Five"
                                            onClick={handleVideoInput}

                                        >Five</button>
                                    </div>
                                }
                            </div>

                            {/* LENGTH: TYPE = GAME */}
                            {videoDetails.type === "Game" &&
                                <div className='match-length-area'>
                                    <button
                                        className={`match-length-button ${videoDetails.length === 'Single' ? 'selected' : ''}`}
                                        name="length"
                                        value="Single"
                                        onClick={handleVideoInput}
                                    >Single Game</button>
                                </div>
                            }

                            {/* LENGTH: TYPE = GAME */}
                            {videoDetails.type === "Casual" &&
                                <div className='match-length-area'>
                                    <button
                                        className={`match-length-button three ${videoDetails.length === 'Single' ? 'selected' : ''}`}
                                        name="length"
                                        value="Single"
                                        onClick={handleVideoInput}
                                    >Single Game</button>
                                    <button
                                        className={`match-length-button five ${videoDetails.length === 'Five' ? 'selected' : ''}`}
                                        name="length"
                                        value="Five"
                                        onClick={handleVideoInput}
                                    >Five</button>
                                </div>
                            }

                            {/* DATE ETC */}
                            <div className="input-container">
                                <label className="floating-label">Date of Play (optional)</label>
                                <input
                                    type="date"
                                    className="input-zone date"
                                    name="tournament_date"
                                    value={videoDetails.tournament_date}
                                    onChange={handleVideoInput}
                                ></input>

                            </div>


                            {/* TOURNAMENT NAME */}
                            <div className="input-container">
                                <label className="floating-label">Tournament Name (optional)</label>
                                <input
                                    type="text"
                                    className="input-zone tournament-input"
                                    name="tournament_name"
                                    value={videoDetails.tournament_name}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>
                            <div className="input-container">
                                <label className="floating-label">Tournament Location (optional)</label>
                                <input
                                    type="text"
                                    className="input-zone tournament-input"
                                    name="tournament_location"
                                    value={videoDetails.tournament_location}
                                    onChange={handleVideoInput}
                                ></input>
                            </div>

                            {/* PLAYER INFO */}
                            <div className="player-info">

                                <h3>Player Names & Jersey Colors</h3>
                                <div className="player-row">
                                    <div className="input-container name-input">
                                        <label className="floating-label">Player 1 Name</label>
                                        <input
                                            type="text"
                                            className="input-zone tournament-input"
                                            name="player1_name"
                                            value={videoDetails.player1_name}
                                            onChange={handleVideoInput}
                                        />
                                    </div>

                                    <input
                                        type="color"
                                        className="color-input"
                                        name="player1_color"
                                        value={videoDetails.player1_color}
                                        onChange={handleVideoInput}
                                    />
                                </div>

                                <div className="player-row">
                                    <div className="input-container name-input">
                                        <label className="floating-label">Player 2 Name</label>
                                        <input
                                            type="text"
                                            className="input-zone tournament-input"
                                            name="player2_name"
                                            value={videoDetails.player2_name}
                                            onChange={handleVideoInput}
                                        />
                                    </div>
                                    <input
                                        type="color"
                                        className="color-input"
                                        name="player2_color"
                                        value={videoDetails.player2_color}
                                        onChange={handleVideoInput}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>

                    <button className="continue2-button" onClick={handleContinue2Pressed}>Continue</button>

                </div>



                {/* RIGHT */}
                <div className="right-area">
                    <h1>Preview</h1>
                    <img src={thumbnail} className="page-two-thumbnail" alt="video thumbnail"></img>
                    <div className="detail-display-background">
                        <h2> {videoDetails.title}</h2>
                        <p> {videoDetails.type}</p>
                    </div>
                    <div className="input-container">
                        <label className="floating-label">Description (optional)</label>
                        <textarea
                            type="text"
                            className="input-zone description"
                            name="description"
                            maxLength={200}
                            value={videoDetails.description}
                            onChange={handleVideoInput}
                        ></textarea>
                    </div>

                </div>
            </div>}
            {/*PAGE THREE*/}
            {continuePressed && continue2Pressed && <div className="page-three">
                <button className="back-button"
                    onClick={() => setContinue2Pressed(prevState => !prevState)}
                >Back</button>
                {/* YouTube Video Player */}
                <h3>Add Marks to Video</h3>
                <div className="upload-video-centered" >
                    <ReactPlayer
                        ref={playerRef}
                        url={videoDetails.url}
                        playing={playing}
                        controls={false}
                        width="720px"
                        height="405px"
                        onProgress={handleProgress}
                    />
                    <div className="upload-video-controls">
                        <button onClick={handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
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
                            ></input>
                            <div className="slider-background">
                                <div id="timestamps">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="point-controls">
                    <button className="point-button" onClick={() => increaseScore("player1_score", videoDetails.player1_score)}>+</button>
                    <button className="point-button" onClick={() => decreaseScore("player1_score")}>-</button>
                    <div className="point-display">
                        <div className="player1-color" id='player1-color' style={{ backgroundColor: videoDetails.player1_color }}></div>
                        <p className='player-name'>{videoDetails.player1_name}</p>
                        <div className="player1_wins" id="player1_wins">0</div>
                        <div className='score-background'><p id="player1_score">0</p><p >-</p><p id="player2_score">0</p></div>
                        <div className="player2_wins" id="player2_wins">0</div>
                        <p className='player-name'>{videoDetails.player2_name}</p>
                        <div className="player2-color" style={{ backgroundColor: videoDetails.player2_color }}></div>

                    </div>
                    <button className="point-button" onClick={() => increaseScore("player2_score", videoDetails.player2_score)}>+</button>
                    <button className="point-button" onClick={() => decreaseScore("player2_score")}>-</button>
                </div>
                <div className="call-controls">
                    <div className="player1-calls">
                        <button className="call-button" onClick={() => displayCall("Yes Let", 1)}>Yes Let</button>
                        <button className="call-button" onClick={() => displayCall("No Let", 1)}>No Let</button>
                        <button className="call-button" onClick={() => displayCall("Stroke", 1)}>Stroke</button>
                        <button className="call-button" onClick={() => displayCall("Fault", 1)}>Fault</button>
                    </div>
                    {/*<hr></hr>*/}
                    <div className="player2-calls">
                        <button className="call-button" onClick={() => displayCall("Yes Let", 2)}>Yes Let</button>
                        <button className="call-button" onClick={() => displayCall("No Let", 2)}>No Let</button>
                        <button className="call-button" onClick={() => displayCall("Stroke", 2)}>Stroke</button>
                        <button className="call-button" onClick={() => displayCall("Fault", 2)}>Fault</button>
                    </div>

                </div>
                <button className="upload-button" onClick={handleVideoUpload}>Upload</button>
            </div>}
        </div>
    );
}

export default Upload;