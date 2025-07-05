const DashboardCard = ({ title, description }) => {
    return (
      <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
        <h4 className="text-xl font-semibold text-blue-900 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };
  
  export default DashboardCard;
  