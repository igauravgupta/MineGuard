import DashboardLayout from "../components/dasboard/DashboardLayout";
import DashboardCard from "../components/dasboard/DashboardCard"
import { motion } from "framer-motion";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-blue-900 mb-6">Your Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DashboardCard title="👤 Profile" description="View & edit your profile." />
          <DashboardCard title="🎓 Training Status" description="Track your safety training." />
          <DashboardCard title="📝 Report List" description="All submitted incidents." />
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
