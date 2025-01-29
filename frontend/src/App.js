import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Components/Home/home";
import Explore from "./Components/Explore/explore.js";
import Profile from "./Components/Profile/profile";
import Upload from "./Components/Upload/upload";
import Video from "./Components/Video/video";
import Camps from "./Components/Camps/camps";
import Layout from "./Components/Layout/layout";
import SharedWithMe from "./Components/SharedWithMe/shared.js";
import MyVideos from "./Components/MyVideos/myVideos.js";
import Landing from "./Components/Landing/landing.js";
import Login from "./Components/Login/login.js";
import CreateProfile from "./Components/Create Profile/createProfile.js";

import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/landing" element = {<Landing/>}></Route>
          <Route path="/login" element ={ <Login />}></Route>
          <Route path="/create-profile" element = { <CreateProfile />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/upload" element={<Upload />}> </Route>
          <Route path="/my-videos" element={<MyVideos />}> </Route>
          <Route path="/shared-with-me" element={<SharedWithMe />}> </Route>
          <Route path="/video" element={<Video />}> </Route>
          <Route path="/profile" element={<Profile />}> </Route>
          <Route path="/camps" element={<Camps />}> </Route>
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;
