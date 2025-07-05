import { motion } from 'framer-motion';

const AnimatedHeading = () => (
    <motion.h1
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-5xl font-extrabold text-center text-blue-900 mt-16"
  >
    Welcome to <span className="text-blue-600">MineGuard</span>
    <p className="text-lg font-medium mt-4 text-gray-700">
    Regulatory Guidance Chatbot and Incident Reporting System for the Indian Mining Industry.
    </p>
  </motion.h1>
  );

export default AnimatedHeading;
  