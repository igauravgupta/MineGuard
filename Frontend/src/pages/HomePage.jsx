// src/pages/Home.jsx
import React from "react";
import Navbar from "../components/UI/Navbar";
import Footer from "../components/UI/Footer";
import HeroSection from "../components/UI/HeroSection";



const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

    <HeroSection/>

      <Footer />
    </div>
  );
};

export default Home;
