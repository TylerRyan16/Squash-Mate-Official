import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { getSpecificVideo } from "../../services/api";


function openCoach(evt, coachName) {
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
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

const Video = () => {
    const { videoID } = useParams();
    const [video, setVideo] = useState({

    });

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const playerRef = useRef(null);

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
                        <h3 className="comments-header">Comments</h3>
                        <div class="coach-tabs">
                            <button class="tablinks" onClick={(event) => openCoach(event, '1')}>Coach #1</button>
                            <button class="tablinks" onClick={(event) => openCoach(event, '2')}>Coach #2</button>
                            <button class="tablinks" onClick={(event) => openCoach(event, '3')}>Coach #3</button>
                        </div>
                        <div id="1" class="tabcontent">
                            <div className='comment'>
                                <div className='vertical-flex'>
                                    <div className='commenter-info'>
                                        <div className='horizontal-flex'>
                                            <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-pic"></img>
                                            <p>Coach Bob</p>
                                        </div>

                                    </div>
                                    <div className="horizontal-flex">
                                        <div className='comment'>
                                            <p>Great Serve</p>
                                        </div>
                                        <div className="reactions">
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\reply.png' alt='' />
                                            </button>
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\heart-empty.png' alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="2" class="tabcontent">
                            <div className='comment'>
                                <div className='vertical-flex'>
                                    <div className='commenter-info'>
                                        <div className='horizontal-flex'>
                                            <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-pic"></img>
                                            <p>Coach Steve</p>
                                        </div>

                                    </div>
                                    <div className="horizontal-flex">
                                        <div className='comment'>
                                            <p>Do better</p>
                                        </div>
                                        <div className="reactions">
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\reply.png' alt='' />
                                            </button>
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\heart-empty.png' alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="3" class="tabcontent">
                            <div className='comment'>
                                <div className='vertical-flex'>
                                    <div className='commenter-info'>
                                        <div className='horizontal-flex'>
                                            <img src='/assets/squash-guy.jpg' alt='profile cover' className="comment-pic"></img>
                                            <p>Coach Sarah</p>
                                        </div>

                                    </div>
                                    <div className="comment-flex">
                                        <div className='comment'>
                                            <p>That was a bad point</p>
                                        </div>
                                        <div className="reactions">
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\reply.png' alt='' />
                                            </button>
                                            <button className="reply-icon">
                                                <img className="icon" src='assets\icons\heart-empty.png' alt='' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
}

export default Video;