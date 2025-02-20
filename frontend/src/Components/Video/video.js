import './video.scss';
import { useRef, useState } from 'react';

function openCoach(evt, coachName){

    console.log("We are here")
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
                <div className = 'horizontal-flex'>
                    <video ref={playerRef} width="720" controls>
                        <source src="" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className='comment-section'>
                        <div class="coach-tabs">
                            <button class="tablinks" onClick={(event) => openCoach(event, '1')}>Coach #1</button>
                            <button class="tablinks" onClick={(event) => openCoach(event, '2')}>Coach #2</button>
                            <button class="tablinks" onClick={(event) => openCoach(event, '3')}>Coach #3</button>
                        </div>
                        <div id="1" class="tabcontent">
                            <h3>Coach #1 Stuff</h3>
                            <p>London is the capital city of England.</p>
                        </div>

                        <div id="2" class="tabcontent">
                            <h3>Coach #2 Stuff</h3>
                            <p>Paris is the capital of France.</p>
                        </div>

                        <div id="3" class="tabcontent">
                            <h3>Coach #3</h3>
                            <p>Tok Stuffyo is the capital of Japan.</p>
                        </div>


                    </div>
                </div>
                

                <div className="controls">
                    <button onClick={togglePlay}></button>
                </div>

            </div>
        </div>
    );
}

export default Video;