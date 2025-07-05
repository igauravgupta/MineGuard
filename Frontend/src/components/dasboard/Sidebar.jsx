const Sidebar = () => {
    return (
      <aside className="w-64 bg-blue-900 text-white p-6 rounded-r-2xl">
        <h2 className="text-xl font-bold mb-8">MineGuard</h2>
        <ul className="space-y-5">
          <li className="hover:text-yellow-400 cursor-pointer">Dashboard</li>
          <li className="hover:text-yellow-400 cursor-pointer">Training</li>
          <li className="hover:text-yellow-400 cursor-pointer">Reports</li>
          <li className="hover:text-yellow-400 cursor-pointer">Logout</li>
        </ul>
      </aside>
    );
  };
  
  export default Sidebar;
  