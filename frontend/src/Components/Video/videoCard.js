import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {

    const navigate = useNavigate();

    const formatDate = (date) => {
        if (!date) return "Unknown";
        return date.slice(0, 10);
    }

    return (
        // outer
        <div className=
            "w-[350px] sm:w-[360px] md:w-[380px] lg:w-[330px] xl:w-[610px] my-5 p-2 hover:scale-105 transition-transform duration-300 flex-shrink-0 scroll-smooth cursor-pointer"

            onClick={() => navigate(`/video/${video.id}`)}>
            {/* thumbnail */}
            <img className="w-full flex-grow aspect-video object-cover rounded-lg" src={video.thumbnail} alt='' />

            <div className="text-sm lg:text-base flex items-start gap-1 mt-1">
                {/* pfp */}
                <img className="w-8 md:w-10" src={`/assets/characters/${video.poster_pfp || "default"}.png`} alt="profile pic" />

                <div className="w-full flex flex-col gap-0.5">
                    {/* title, poster name, posted on */}
                    <h4 className="ellipses font-semibold m-0 p-0 whitespace-normal overflow-hidden">{video.title}</h4>
                    <p className="video-uploader text-xs text-neutral-600">{video.poster || "TestPoster123"}</p>
                    <small className='video-date text-xs text-neutral-600'>Posted on <strong>{formatDate(video.date_posted)}</strong></small>
                </div>
            </div>


        </div>
    );
};

export default VideoCard;