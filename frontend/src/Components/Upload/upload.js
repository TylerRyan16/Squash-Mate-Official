import './upload.scss';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { uploadVideo } from "../../services/api";
import { getMyUsername } from "../../services/api";
import ReactPlayer from 'react-player';

// Material UI
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


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
                <TextField
                    label="URL (required)"
                    name="url"
                    fullWidth
                    value={videoDetails.url}
                    onChange={handleVideoInput}
                    variant="outlined"
                    className='upload-input'
                />



                {/* VIDEO DISPLAY */}
                {thumbnail && <img src={thumbnail} alt="thumbnail" className="video-thumbnail"></img>}

                {/* TITLE / TYPE AREA */}
                <div className="title-type-area">

                    {/* TITLE */}
                    <TextField
                        label="Title (required)"
                        name="title"
                        value={videoDetails.title}
                        onChange={handleVideoInput}
                        fullWidth
                        variant="outlined"
                        className="upload-input"
                    />


                    {/* MATCH TYPE */}
                    <div className="match-type-area">
                        {["Match", "Game", "Casual"].map((type) => (
                            <Button
                                key={type}
                                name="type"
                                value={type}
                                onClick={handleVideoInput}
                                variant={videoDetails.type === type ? "contained" : "outlined"}
                                className={`match-type-mui-button ${videoDetails.type === type ? "selected" : ""}`}
                                sx={{
                                    transition: "all 0.15s ease-in-out",
                                }}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className="continue-button"
                    onClick={() => handleContinuePressed()}
                    sx={{
                        width: "50%",
                        padding: "10px 0px",
                        fontSize: "18px",
                        fontWeight: 600,
                    }}
                >Continue</Button>
            </div>}


            {/* PAGE TWO */}
            {continuePressed && !continue2Pressed && (
                <div className="page-two">

                    <Button
                        onClick={() => setContinuePressed(prev => !prev)}
                        className="back-button"
                        startIcon={<ArrowBackIcon />}
                        variant="outline"
                        sx={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            marginBottom: "20px",
                            zIndex: 10,
                            fontWeight: 600
                        }}
                    >
                        Back
                    </Button>
                    <div className="left-vertical-upload">
                        <div className="upload-input-2">
                            <div className="left-upload-input-section">

                                {/* BEST OF */}
                                <div className="best-of-area">
                                    <h3>Best Of</h3>
                                    {videoDetails.type === "Match" && (
                                        <div className="match-length-area">
                                            {["Three", "Five"].map((length) => (
                                                <Button
                                                    key={length}
                                                    name="length"
                                                    value={length}
                                                    variant={videoDetails.length === length ? "contained" : "outlined"}
                                                    onClick={handleVideoInput}
                                                    className={`match-type-mui-button ${videoDetails.length === length ? "selected" : ""}`}
                                                    sx={{
                                                        transition: "all 0.15s ease-in-out",
                                                        width: '50%',
                                                    }}                                                >
                                                    {length}
                                                </Button>
                                            ))}
                                        </div>
                                    )}

                                    {videoDetails.type === "Game" && (
                                        <div className="match-length-area">
                                            <Button
                                                name="length"
                                                value="Single"
                                                variant="contained"
                                                onClick={handleVideoInput}
                                                className="match-type-mui-button selected"
                                                sx={{
                                                    transition: "all 0.15s ease-in-out",
                                                    width: '100%',

                                                }}                                            >
                                                Single Game
                                            </Button>
                                        </div>
                                    )}

                                    {videoDetails.type === "Casual" && (
                                        <div className="match-length-area">
                                            {["Single", "Five"].map((length) => (
                                                <Button
                                                    key={length}
                                                    name="length"
                                                    value={length}
                                                    variant={videoDetails.length === length ? "contained" : "outlined"}
                                                    onClick={handleVideoInput}
                                                    className={`match-type-mui-button ${videoDetails.length === length ? "selected" : ""}`}
                                                    sx={{
                                                        transition: "all 0.15s ease-in-out",
                                                        width: '50%',
                                                    }}                                                         >
                                                    {length === "Single" ? "Single Game" : "Five"}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Date of Play */}
                                <TextField
                                    type="date"
                                    label="Date of Play (optional)"
                                    name="tournament_date"
                                    className='upload-input'
                                    value={videoDetails.tournament_date}
                                    onChange={handleVideoInput}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ mt: 2 }}
                                />

                                {/* Tournament Name */}
                                <TextField
                                    label="Tournament Name (optional)"
                                    name="tournament_name"
                                    className='upload-input'
                                    value={videoDetails.tournament_name}
                                    onChange={handleVideoInput}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />

                                {/* Tournament Location */}
                                <TextField
                                    label="Tournament Location (optional)"
                                    name="tournament_location"
                                    className='upload-input'
                                    value={videoDetails.tournament_location}
                                    onChange={handleVideoInput}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />

                                {/* Player Info */}
                                <div className="player-info">
                                    <h3>Player Names & Jersey Colors</h3>

                                    {/* Player 1 */}
                                    <div className="player-row">
                                        <TextField
                                            label="Player 1 Name"
                                            name="player1_name"
                                            className='upload-input'
                                            value={videoDetails.player1_name}
                                            onChange={handleVideoInput}
                                            sx={{ flex: 1, mr: 2 }}
                                        />
                                        <input
                                            type="color"
                                            name="player1_color"
                                            value={videoDetails.player1_color}
                                            onChange={handleVideoInput}
                                            className="color-input"
                                        />
                                    </div>

                                    {/* Player 2 */}
                                    <div className="player-row">
                                        <TextField
                                            label="Player 2 Name"
                                            name="player2_name"
                                            className='upload-input'
                                            value={videoDetails.player2_name}
                                            onChange={handleVideoInput}
                                            sx={{ flex: 1, mr: 2 }}
                                        />
                                        <input
                                            type="color"
                                            name="player2_color"
                                            value={videoDetails.player2_color}
                                            onChange={handleVideoInput}
                                            className="color-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Continue Button 2*/}
                        <Button
                            variant="contained"
                            color="primary"
                            className="continue2-button"
                            onClick={handleContinue2Pressed}
                            sx={{
                                width: "55%",
                                padding: "10px 0px",
                                fontSize: "18px",
                                fontWeight: 600,
                            }}
                        >
                            Continue
                        </Button>
                    </div>

                    {/* Right side remains untouched for now */}
                    <div className="right-area">
                        <h1>Preview</h1>
                        <img src={thumbnail} className="page-two-thumbnail" alt="video thumbnail" />
                        <div className="detail-display-background">
                            <h2>{videoDetails.title}</h2>
                            <p>{videoDetails.type}</p>
                        </div>

                        <TextField
                            label="Description (optional)"
                            name="description"
                            value={videoDetails.description}
                            onChange={handleVideoInput}
                            multiline
                            rows={6}
                            maxRows={10}
                            fullWidth
                            inputProps={{ maxLength: 200 }}
                            className="upload-input"
                        >
                        </TextField>

                    </div>
                </div>
            )}

            {/*PAGE THREE*/}
            {continuePressed && continue2Pressed && <div className="page-three">
                <Button
                    onClick={() => setContinue2Pressed(prev => !prev)}
                    className="back-button"
                    startIcon={<ArrowBackIcon />}
                    variant="outline"
                    sx={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        marginBottom: "20px",
                        zIndex: 10,
                        fontWeight: 600
                        
                    }}
                >
                    Back
                </Button>

                {/* <h3>Add Marks to Video</h3> */}


                <div className="upload-video-centered" >
                    <div className="upload-video-player-wrapper">
                        <ReactPlayer
                            ref={playerRef}
                            url={videoDetails.url}
                            playing={playing}
                            controls={false}
                            width="720px"
                            height="405px"
                            className="upload-player"
                            onProgress={handleProgress}
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                        />
                    </div>

                    <div className="upload-video-controls">
                        <button onClick={handlePlayPause}></button>
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
                    <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="point-button" onClick={() => increaseScore("player1_score", videoDetails.player1_score)}>+</Button>
                    <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="point-button" onClick={() => decreaseScore("player1_score")}>-</Button>


                    <div className="point-display">
                        <div className="player1-color" id='player1-color' style={{ backgroundColor: videoDetails.player1_color }}></div>
                        <p className='player-name'>{videoDetails.player1_name}</p>
                        <div className="player1_wins" id="player1_wins">0</div>
                        <div className='score-background'><p id="player1_score">0</p><p>-</p><p id="player2_score">0</p></div>
                        <div className="player2_wins" id="player2_wins">0</div>
                        <p className='player-name'>{videoDetails.player2_name}</p>
                        <div className="player2-color" style={{ backgroundColor: videoDetails.player2_color }}></div>
                    </div>


                    <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="point-button" onClick={() => increaseScore("player2_score", videoDetails.player2_score)}>+</Button>
                    <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="point-button" onClick={() => decreaseScore("player2_score")}>-</Button>
                </div>

                <div className="call-controls">
                    <div className="player1-calls">
                        <Button sx={{ padding: "5px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Yes Let", 1)}>Yes Let</Button>
                        <Button sx={{ padding: "5px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("No Let", 1)}>No Let</Button>
                        <Button sx={{ padding: "5px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Stroke", 1)}>Stroke</Button>
                        <Button sx={{ padding: "5px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Fault", 1)}>Fault</Button>
                    </div>

                    <div className="player2-calls">
                        <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Yes Let", 2)}>Yes Let</Button>
                        <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("No Let", 2)}>No Let</Button>
                        <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Stroke", 2)}>Stroke</Button>
                        <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="call-button" onClick={() => displayCall("Fault", 2)}>Fault</Button>
                    </div>

                </div>
                <Button sx={{ padding: "10px 0px", fontSize: "18px", fontWeight: 600, }} variant="contained" className="upload-button" onClick={handleVideoUpload}>Upload</Button>
            </div>}
        </div>
    );
}

export default Upload;