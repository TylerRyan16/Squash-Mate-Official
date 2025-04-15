import {useNavigate} from 'react-router-dom';
const VideoCard = ({ video }) => {

    const navigate = useNavigate();
    
    return (
        <div className='home-video-card' onClick={() => navigate(`/video/${video.id}`)}>
            <img className="home-thumbnail" src={video.thumbnail} alt='' />
            <div className="title-area">
                <img className="uploader-cover-pic" src={`/assets/characters/${video.poster_pfp || "default"}.png`} alt="profile pic" />
                <h4 className="video-title">{video.title}</h4>
            </div>
            <div className="poster-date-area">
                <p className="video-uploader">{video.poster}</p>
                <small className='video-date'>{video.date_posted}</small>
            </div>
        </div>
    );
};

export default VideoCard;