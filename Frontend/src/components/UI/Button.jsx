import { motion } from "framer-motion";

const CustomButton = ({
  label,
  onClick,
  type = "button",
  icon: Icon,
  className = "",
  style = {},
  ariaLabel = "",
  marginTop = "mt-4", // Optional marginTop prop to control top margin
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || label} // Accessible label for screen readers
      className={`inline-block px-6 py-2 bg-transparent text-gray-900 font-medium rounded-lg border border-gray-300 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${marginTop} ${className}`}
      style={style} // Allow passing inline styles if needed
    >
      {Icon && <Icon className="w-5 h-5" />}
      {label}
    </motion.button>
  );
};

export default CustomButton;
