import './video.scss';
import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { getSpecificVideo } from "../../services/api";


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

            {/* Custom controls */}
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
    );
}

export default Video;