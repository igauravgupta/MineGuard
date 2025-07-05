import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeading from './AnimatedHeading';
import CustomButton from './Button';

const features = [
  {
    title: "Real-time Incident Reporting",
    description: "Quickly report safety concerns with supporting evidence, anytime, anywhere."
  },
  {
    title: "Regulatory Compliance Assistance",
    description: "Instant access to mining rules and guidelines through an AI chatbot."
  }
];

const HeroSection = () => {
  return (
    <main className="flex flex-col items-center px-4 bg-gray-100 min-h-screen py-12">
      <AnimatedHeading />
      <section className="mt-10 w-full max-w-6xl text-center flex flex-col items-center">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 justify-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 border border-blue-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105 w-80"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/chatbot">
            <CustomButton label="Try Chatbot" marginTop="mt-0" />
          </Link>
          <Link to="/reportIncident">
            <CustomButton label="Report Incident" marginTop="mt-0" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HeroSection;
