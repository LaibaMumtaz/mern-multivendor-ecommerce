import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, ShieldCheck, UserCheck, UserX, BarChart3, Store } from 'lucide-react';
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
        <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in relative">
            {/* Ambient Background Glow for Premium Feel */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -z-10 pointer-events-none focus:outline-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-3xl shadow-xl shadow-indigo-200 transform hover:scale-105 transition duration-300">
                        <ShieldCheck size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 tracking-tight">Admin Command Center</h1>
                        <div className="flex items-center gap-2 mt-2">
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">System Online</span>
                             </div>
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 shadow-sm">
                                <Store size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Mode: Multi-Vendor</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Analytics Overview - Premium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                             <DollarSign size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Revenue</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">${(stats.totalRevenue || 0).toFixed(2)}</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <BarChart3 size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                             <BarChart3 size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Platform Commission</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">${(stats.platformCommission || 0).toFixed(2)}</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <Users size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                             <Users size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Users</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">
                        {stats.totalUsers} 
                        <span className="text-sm font-medium text-gray-400 ml-2 border-l border-gray-200 pl-2">{stats.totalVendors} Vendors</span>
                    </p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(245,158,11,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                        <ShoppingBag size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                             <ShoppingBag size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Orders</span>
                    </div>
                    <p className="text-4xl font-black text-gray-900 relative z-10">{stats.totalOrders}</p>
                </div>
            </div>

            {/* Premium User Management Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100/50 shadow-2xl shadow-gray-200/40 overflow-hidden relative">
                <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                            <Users size={24} className="text-indigo-600" /> User Directory
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Manage platform access, roles, and vendor statuses across the entire ecosystem.</p>
                    </div>
                    <button className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition shadow-lg">
                        Export Data
                    </button>
                </div>
                
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5">User Profile</th>
                                <th className="px-8 py-5">Ecosystem Role</th>
                                <th className="px-8 py-5">Account Status</th>
                                <th className="px-8 py-5 text-right flex-shrink-0">Security Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors duration-200">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-black text-lg shadow-inner">
                                                {u.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-base">{u.name}</p>
                                                <p className="text-sm text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                                            u.role === 'Admin' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                            u.role === 'Vendor' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                            'bg-gray-50 border-gray-100 text-gray-700'
                                        }`}>
                                            {u.role === 'Admin' && <ShieldCheck size={14} />}
                                            {u.role === 'Vendor' && <Store size={14} />}
                                            {u.role === 'Customer' && <UserCheck size={14} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                            <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            <span className="text-xs font-bold">{u.isActive ? 'Active' : 'Suspended'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => toggleUserActive(u._id, u.isActive)}
                                            className={`p-3 rounded-2xl transition duration-300 font-bold text-xs flex items-center gap-2 ml-auto ${
                                                    u.role === 'Admin' ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' :
                                                    u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-sm' : 
                                                    'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm'
                                                }`}
                                            title={u.isActive ? 'Suspend Account' : 'Reactivate Account'}
                                            disabled={u.role === 'Admin'} // Prevent deactivating other admins
                                        >
                                            {u.isActive ? (
                                                <>
                                                 <UserX size={16} /> Suspend
                                                </>
                                            ) : (
                                                <>
                                                 <UserCheck size={16} /> Activate
                                                </>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
