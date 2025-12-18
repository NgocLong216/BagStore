import { FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b3c5d] text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-white/20">
          DRUG PREVENT
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<FaChartBar />} label="Dashboard" active />
          <SidebarItem icon={<FaUsers />} label="User" />
          <SidebarItem icon={<FaCog />} label="Settings" />
        </nav>
        <button className="flex items-center gap-2 p-4 border-t border-white/20 hover:bg-white/10">
          <FaSignOutAlt /> Log out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Topbar */}
        <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-6">
            <FaBell className="text-xl" />
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">Admin</p>
                <p className="text-xs text-gray-500">admin@email.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <section className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Purchases" value="17,663" />
            <StatCard title="Refunds" value="$4,523" />
            <StatCard title="Visitors" value="46,085" />
          </div>

          {/* User table */}
          <div className="bg-white rounded-xl shadow">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">User Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add User</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3].map(i => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-3">User {i}</td>
                    <td className="p-3">user{i}@mail.com</td>
                    <td className="p-3">0123456789</td>
                    <td className="p-3">USER</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
        active ? "bg-[#00b4d8]" : "hover:bg-white/10"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
