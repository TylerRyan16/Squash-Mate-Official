import "./camps.scss";

const campImages = [
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/190x420-coach-schedule-01@2x.jpg",
        link: "https://opensquash.org/squash-camps",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Cornell-1.jpg",
        link: "http://www.squashcampsatcornell.com/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Msquash-JPG.jpg",
        link: "https://www.msquash.com/category/summer-camps",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/11/Thierry--scaled.jpg",
        link: "https://www.thierry-lincou.com/index.php?option=com_content&view=article&id=81&Itemid=494",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Dartmouth.jpg",
        link: "https://vmsquashcamps.totalcamps.com/shop/EVENT",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/11/Saint-James-3.jpg",
        link: "https://tsjsquash.leagueapps.com/classes/4399343-the-st.-james-2025-summer-squash-specialty-camps",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Penn-Squash.png",
        link: "https://www.pennsquashcamp.com/About%20Us",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Academy-Camps-USSquash.org-Ad-2.jpg",
        link: "https://academycamps.com/sports-camp-for-kids/squash",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/02/SUMMER-CAMPS-8.5-x-11-in-190-x-420-mm.jpg",
        link: "https://spectercenter.org/junior-programs-new/camps/summer-squash-camp/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Pinnacle-Squash.png",
        link: "https://pinnaclesquash.com/programs/camps/peakperformance/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/Copy-of-US-Squash-flyer.png",
        link: "https://www.goodnicksquash.com/camps",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/US-Squash-Williams-Hesham-Poster.png",
        link: "https://www.creativesquashandrecruiting.com/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Westover.jpeg",
        link: "https://www.westoverschool.org/admission/summer-programs",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2024/12/2025-SR-Summer-Camp-29.jpg",
        link: "https://www.squashrevolution.com/sr-annual-training-camp.html",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Trinity-ad.png",
        link: "https://www.trinitysquashcamps.com/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Mercersburg-Newsletter-Ad.jpg",
        link: "https://www.mercersburg.edu/summer/programs/squash-camp",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Elite-Squash-camp-ad.png",
        link: "https://elitesquash.com/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Sachvie-Squash-Camp-25.jpg",
        link: "https://sachviesquash.totalcamps.com/About%20Us",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/Summer-Squash-Camp-Ad.png",
        link: "https://www.pyramidsquash.com/",
    },
    {
        imgUrl: "https://ussquash.org/wp-content/uploads/2025/01/InternationalSqaushAcademyUSSquashAd.png",
        link: "https://campsquash.com/",
    }
    // Add more images here
];

const Camps = () => {
    return (
        <div className="page-container">
            <h1>Camps</h1>
            <div>
                <p1>SUMMER 2025 SQUASH CAMPS</p1>
            </div>
            <div>
                <p2>Summer adult and junior squash camps offer many varied and exciting opportunities for players of all levels to have fun and improve their game. Please see below for offerings from facilities, schools and colleges, and clubs around the country to find the best fit! If you are a coach or program director interested in showcasing your camp to the squash community, please email development@ussquash.org for current opportunities. For all summer camp advertising options please click US Squash 2025 Summer Camp Advertising</p2>
            </div>
            <div className="camp-gallery">
                {campImages.map((camp, index) => (
                    <a 
                        key={index} 
                        href={camp.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="camp-image" 
                        style={{ backgroundImage: `url(${camp.imgUrl})` }}
                    ></a>
                ))}
            </div>
        </div>
    );
}

export default Camps;
