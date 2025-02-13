// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import Profile from "./pages/Profile";
import "./index.scss";  // Import global styles

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipe/:id" element={<Recipe />} /> {/* Dynamic route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
