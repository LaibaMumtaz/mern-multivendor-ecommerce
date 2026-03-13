import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, ShieldCheck, UserCheck, UserX, BarChart3, Package } from 'lucide-react';
import API from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        platformCommission: 0
    });
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    API.get('/admin/stats'),
                    API.get('/admin/users')
                ]);
                setStats(statsRes.data);
                setUsers(usersRes.data);
            } catch (err) {
                console.error('Error fetching admin data', err);
            }
        };
        fetchData();
    }, []);

    const toggleUserActive = async (id, isActive) => {
        try {
            await API.put(`/admin/users/${id}`, { isActive: !isActive });
            setUsers(users.map(u => u._id === id ? { ...u, isActive: !isActive } : u));
        } catch {
            alert('Failed to update user status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-12">
                <div className="p-4 bg-indigo-900 text-white rounded-2xl shadow-lg">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                    <div className="flex gap-4 mt-2">
                        <Link to="/admin" className="text-indigo-600 text-sm font-bold border-b-2 border-indigo-600">Users</Link>
                        <Link to="/admin/products" className="text-gray-400 text-sm font-bold hover:text-indigo-600 transition">Products</Link>
                    </div>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="glass p-6 rounded-3xl border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</span>
                        <DollarSign className="text-indigo-500" size={16} />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">${(stats.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <div className="glass p-6 rounded-3xl border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commission</span>
                        <BarChart3 className="text-emerald-500" size={16} />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">${(stats.platformCommission || 0).toFixed(2)}</p>
                </div>
                <div className="glass p-6 rounded-3xl border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Users</span>
                        <Users className="text-blue-500" size={16} />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="glass p-6 rounded-3xl border-l-4 border-l-amber-500">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                        <ShoppingBag className="text-amber-500" size={16} />
                    </div>
                    <p className="text-3xl font-extrabold text-gray-900">{stats.totalOrders}</p>
                </div>
            </div>

            {/* User Management */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 flex items-center gap-2"><Users size={20} /> User Management</h2>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white text-gray-400 text-[10px] uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Name & Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u._id} className="hover:bg-gray-50/50 transition">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                                    <p className="text-xs text-gray-500">{u.email}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-600' :
                                        u.role === 'Vendor' ? 'bg-amber-100 text-amber-600' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-medium ${u.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {u.isActive ? 'Active' : 'Deactivated'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleUserActive(u._id, u.isActive)}
                                        className={`p-2 rounded-xl transition ${u.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                        title={u.isActive ? 'Deactivate User' : 'Activate User'}
                                    >
                                        {u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
