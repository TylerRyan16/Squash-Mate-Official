import './video.scss';
import { useRef, useState } from 'react';

const Video = () => {
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");


    const togglePlay = () => {

    };



    return (
        <div className="page-container">
            <div className="video-display-area">
                <h1>Video Player.</h1>

                {/* Video Element */}
                <video ref={playerRef} width="720" controls>
                    <source src="" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="controls">
                    <button onClick={togglePlay}></button>
                </div>

            </div>
        </div>
    );
}

export default Video;