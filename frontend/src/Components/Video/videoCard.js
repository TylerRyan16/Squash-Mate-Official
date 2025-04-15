import { useNavigate } from 'react-router-dom';
import {useEffect} from "react";
import "./videoCard.scss";

const VideoCard = ({ video }) => {

    const navigate = useNavigate();

    const formatDate = (date) => {
        if (!date) return "Unknown";
        return date.slice(0, 10);
    }

    useEffect(() => {
        console.log("Video: ", video);
    }, [])

    return (
        <div className='video-card-display' onClick={() => navigate(`/video/${video.id}`)}>
            <img className="video-thumbnail-display" src={video.thumbnail} alt='' />
            <div className="video-info-zone">
                <img className="uploader-cover-pic" src={`/assets/characters/${video.poster_pfp || "default"}.png`} alt="profile pic" />

                <div className="title-area">
                    <h4 className="video-title">{video.title}</h4>
                    <p className="video-uploader">{video.poster || "TestPoster123"}</p>
                    <small className='video-date'>Posted on <strong>{formatDate(video.date_posted)}</strong></small>
                </div>
            </div>


        </div>
    );
};

export default VideoCard;