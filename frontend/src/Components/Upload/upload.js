import './upload.scss';

const Upload = () => {
    return (
        <div className="page-container">
            <h1 className="page-header">Upload a Video</h1>

            <div className="vertical-flex">
                {/* LINK */}
                <label for="link-input" className="label">Video Link</label>
                <input
                    type="text"
                    className="link-input url"
                    name="link-input"
                    placeholder="YouTube URL..."
                ></input>
                <div className="video-area"></div>
                {/* TITLE */}
                <label for="link-input" className="label">Title</label>
                <input
                    type="text"
                    className="link-input"
                    name="link-input"
                    placeholder="Title..."
                ></input>

                {/* MATCH TYPE */}
                <h1 id="match-type">Match Type</h1>
                <div className="horizontal-flex radio-area">
                    <div className="horizontal-flex">
                        <input type="radio" id="match" name="match-type" value="Match" />
                        <label for="match">Match</label>
                    </div>
                    <div className="horizontal-flex">
                        <input type="radio" id="game" name="match-type" value="Game" />
                        <label for="game">Game</label>
                    </div>
                    <div className="horizontal-flex">
                        <input type="radio" id="casual" name="match-type" value="Casual" />
                        <label for="casual">Casual</label>
                    </div>
                </div>

                 {/* BEST OF */}
                 <h1 id="length">Length</h1>
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
                    type="text"
                    className="link-input"
                    name="link-input"
                    placeholder="Date..."
                ></input>
                {/* TOURNAMENT NAME */}
                <div className="horizontal-flex tournament">
                    <div className="vertical-flex">
                        <label for="link-input" className="label">Tournament Name</label>
                        <input
                            type="text"
                            className="link-input tournament-input"
                            name="link-input"
                            placeholder="Name..."
                        ></input>
                    </div>
                    <div className="vertical-flex">
                        <label for="link-input" className="label">Tournament Location</label>
                        <input
                            type="text"
                            className="link-input tournament-input"
                            name="link-input"
                            placeholder="Location..."
                        ></input>
                    </div>

                </div>




            </div>


        </div>
    );
}

export default Upload;