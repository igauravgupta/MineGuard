// src/pages/AboutPage.js
import React from 'react';
import NavBar from '../components/UI/Navbar';
import Footer from '../components/UI/Footer';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      <NavBar />
      
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold leading-tight">
            Welcome to MineGuard
          </h1>
          <p className="mt-4 text-lg">
            AI-Powered Regulatory Guidance & Incident Reporting for the Mining Industry
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
          <header className="mb-6 text-center">
            <h2 className="text-4xl font-semibold text-blue-800">About MineGuard</h2>
            <p className="mt-2 text-lg text-gray-600">
              Simplifying compliance and enhancing safety in the Indian mining industry.
            </p>
          </header>
          
          <div className="space-y-6 text-lg text-gray-700">
            <p>
              <strong>MineGuard</strong> is an AI-powered regulatory guidance chatbot and incident reporting system specifically designed for the Indian mining industry. The system aims to streamline compliance with Indian mining laws and ensure workplace safety through real-time guidance and proactive incident management.
            </p>
            <p>
              Our goal is to simplify the complex regulatory landscape of the mining sector and provide a platform that ensures the highest levels of safety and compliance at every stage of mining operations.
            </p>
          </div>
        </div>

        {/* Key Features Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-blue-800">AI-Driven Chatbot</h3>
            <p className="mt-4 text-gray-600">
              Provides 24/7 access to legal and safety regulations, ensuring compliance at all times.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-blue-800">Incident Reporting</h3>
            <p className="mt-4 text-gray-600">
              Users can submit and categorize incidents, ensuring timely notifications for intervention.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-blue-800">Real-Time Notifications</h3>
            <p className="mt-4 text-gray-600">
              Safety officers and compliance teams are alerted immediately to ensure fast action.
            </p>
          </div>

        </div>
        
      </section>

      {/* Why MineGuard Section */}
      <section className="p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-blue-800 mb-6">Why MineGuard?</h2>

          <div className="flex justify-between items-center border-t-2 border-b-2 border-gray-300 py-6">
            <div className="w-1/2 pr-4">
              <h3 className="text-xl font-semibold text-blue-800">Enhanced Safety</h3>
              <p className="mt-4 text-lg text-gray-700">
                MineGuard ensures that mining operations adhere to safety protocols, minimizing risk and ensuring workers' safety in hazardous environments.
              </p>
            </div>
            <div className="w-1/2 pl-4">
              <h3 className="text-xl font-semibold text-blue-800">Regulatory Compliance</h3>
              <p className="mt-4 text-lg text-gray-700">
                With AI-powered legal guidance, MineGuard keeps mining companies updated on compliance with ever-changing mining laws and safety regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold mb-4">Ready to Improve Safety & Compliance?</h2>
          <p className="mb-6 text-lg">
            Start using MineGuard today to bring real-time regulatory guidance and safety incident management to your mining operations.
          </p>
          <button className="bg-yellow-200 text-blue-600 py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-400 transition ease-in-out duration-300">
            <Link to="/signup">Get Started</Link>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
