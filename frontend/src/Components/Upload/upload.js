import './upload.scss';
import { useState } from 'react';

const Upload = () => {
    const [thumbnail, setThumbnail] = useState('');
    const [continuePressed, setContinuePressed] = useState(false);
    const [videoDetails, setVideoDetails] = useState({
        title: "",
        url: "",
        type: "",
        length: "",
        date: "",
        tournament_name: "",
        tournament_location: ""
    });

    const handleVideoInput = (e) => {
        const { name, value } = e.target;
        console.log("title", videoDetails.title);
        console.log("url", videoDetails.url);
        console.log("type", videoDetails.type);


        setVideoDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        if (name === "url") {
            const videoId = extractYouTubeID(value);
            if (videoId) {
                setThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
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

    const extractYouTubeID = (url) => {
        const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    // VIDEO UPLOAD
    const handleVideoUpload = () => {

    };

    return (
        <div className="page-container">
            <h1 className="page-header">Upload a Video</h1>

            {/* PAGE ONE */}
            {!continuePressed && <div className="page-one">
                <div className="original-details">
                    {/* LINK */}
                    <label for="url" className="label">Video Link</label>
                    <input
                        type="text"
                        className="link-input url"
                        name="url"
                        placeholder="YouTube URL..."
                        value={videoDetails.url}
                        onChange={handleVideoInput}
                    ></input>

                    {/* VIDEO DISPLAY */}
                    {thumbnail && <img src={thumbnail} alt="thumbnail" className="video-thumbnail"></img>}

                    {/* TITLE / TYPE AREA */}
                    <div className="horizontal-flex title-type">
                        <div className="vertical-flex">
                            {/* TITLE */}
                            <label for="link-input" className="label title">Title</label>
                            <input
                                type="text"
                                className="link-input title"
                                name="title"
                                placeholder="Title..."
                                value={videoDetails.title}
                                onChange={handleVideoInput}
                            ></input>
                        </div>

                        {/* MATCH TYPE */}
                        <div className="vertical-flex">
                            <label for="match-type" className="label">Match Type</label>
                            <div className="horizontal-flex radio-area">
                                <div className="horizontal-flex">
                                    <input type="radio" id="match" name="type" value="Match" checked={videoDetails.type === "Match"} onChange={handleVideoInput} />
                                    <label for="match">Match</label>
                                </div>
                                <div className="horizontal-flex">
                                    <input type="radio" id="game" name="type" value="Game" checked={videoDetails.type === "Game"} onChange={handleVideoInput} />
                                    <label for="game">Game</label>
                                </div>
                                <div className="horizontal-flex">
                                    <input type="radio" id="casual" name="type" value="Casual" checked={videoDetails.type === "Casual"} onChange={handleVideoInput} />
                                    <label for="casual">Casual</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* CONTINUE BUTTON */}
                    <button
                        className="continue-button"
                        onClick={() => handleContinuePressed()}
                    >Continue</button>
                </div>
            </div>}

            {/* PAGE TWO */}
            {continuePressed && <div className="page-two">
                {/* LEFT */}
                <div className='left-area'>
                    <div className="detail-display">
                        <button className="back-button"
                            onClick={() => setContinuePressed(prevState => !prevState)}
                        >Back</button>
                        <div className="detail-display-background">
                            <div className='detail-row'>
                                <h2>Title: </h2>
                                <p> {videoDetails.title}</p>
                            </div>
                            <div className='detail-row'>
                                <h2>Link: </h2>
                                <p> {videoDetails.url}</p>
                            </div>
                            <div className='detail-row'>
                                <h2>Type: </h2>
                                <p> {videoDetails.type}</p>
                            </div>
                        </div>
                    </div>

                    {/* MORE DETAILS */}
                    <div className="more-details">
                        {/* LENGTH */}
                        <label for="length" className="label title">Length</label>
                        <div className="horizontal-flex radio-area best-of">
                            <div className="horizontal-flex">
                                <input type="radio" id="five" name="match-length" value="five" />
                                <label for="match">Best of 5</label>
                            </div>

                            <div className="horizontal-flex">
                                <input type="radio" id="seven" name="match-length" value="seven" />
                                <label for="casual">Best of 7</label>
                            </div>
                        </div>


                        {/* DATE ETC */}
                        <label for="link-input" className="label">Date</label>
                        <input
                            type="date"
                            className="link-input date"
                            name="link-input"
                            placeholder="Date..."
                        ></input>

                        {/* TOURNAMENT NAME */}
                        <label for="link-input" className="label">Tournament Name</label>
                        <input
                            type="text"
                            className="link-input tournament-input"
                            name="link-input"
                            placeholder="Name..."
                        ></input>
                        <label for="link-input" className="label">Tournament Location</label>
                        <input
                            type="text"
                            className="link-input tournament-input"
                            name="link-input"
                            placeholder="Location..."
                        ></input>


                        <button className="upload-button" onClick={handleVideoUpload}>Upload</button>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="right-area">
                    <h1>Preview</h1>
                    <img src={thumbnail} className="page-two-thumbnail"></img>
                </div>
            </div>}




        </div>

    );
}

export default Upload;