import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    TrendingUp,
    Settings,
    Users,
    ShieldCheck,
    LogOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice';

const Sidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);

    const vendorLinks = [
        { name: 'Overview', path: '/vendor', icon: LayoutDashboard },
        { name: 'My Products', path: '/vendor/products', icon: Package },
        { name: 'Add Product', path: '/vendor/add-product', icon: PlusCircle },
        { name: 'Sales History', path: '/vendor/sales', icon: TrendingUp },
        { name: 'Account Setting', path: '/profile', icon: Settings },
    ];

    const adminLinks = [
        { name: 'Admin Panel', path: '/admin', icon: ShieldCheck },
        { name: 'Manage Products', path: '/admin/products', icon: Package },
        { name: 'Manage Users', path: '/admin', icon: Users },
        { name: 'Account Setting', path: '/profile', icon: Settings },
    ];

    const links = userInfo?.role === 'Admin' ? adminLinks : vendorLinks;

    return (
        <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-80px)] p-6 hidden md:flex flex-col sticky top-20">
            <div className="flex-grow space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition duration-300 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                                }`}
                        >
                            <Icon size={18} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            <button
                onClick={() => dispatch(logout())}
                className="mt-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition duration-300"
            >
                <LogOut size={18} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
