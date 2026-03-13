import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    ShoppingCart, ShoppingBag, LogOut, Menu, X, Search,
    ChevronDown, ShieldCheck, User, Package, Settings,
    Camera, Loader, MapPin, Mail, Star
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { logout, setCredentials } from '../../features/authSlice';
import API from '../../api/axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUploading, setAvatarUploading] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const categories = ['Electronics', 'Fashion', 'Home Decor', 'Accessories', 'Sports', 'Beauty', 'Books', 'Toys', 'Other'];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        setProfileOpen(false);
        navigate('/login');
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await API.post('/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Save avatar to profile
            const update = await API.put('/auth/profile', { avatar: data.imageUrl });
            dispatch(setCredentials({ ...userInfo, ...update.data }));
        } catch {
            alert('Photo upload failed. Please try again.');
        } finally {
            setAvatarUploading(false);
        }
    };

    const avatarContent = userInfo?.avatar
        ? <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
        : <span className="text-sm font-black">{userInfo?.name?.[0]?.toUpperCase() || '?'}</span>;

    const roleColor = userInfo?.role === 'Admin'
        ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
        : userInfo?.role === 'Vendor'
            ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
            : 'text-gray-600 bg-gray-50 border-gray-100';

    return (
        <nav className="glass sticky top-0 z-50 w-full px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center gap-8">
                {/* Logo */}
                <Link to="/" className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent shrink-0">
                    {import.meta.env.VITE_STORE_NAME || 'AI Marketplace'}
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-xl relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-gray-100/50 border border-gray-100 rounded-2xl py-2 pl-4 pr-10 focus:outline-none focus:ring-2 ring-indigo-500/20 transition"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                        <Search size={18} />
                    </button>
                </form>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 shrink-0">
                    {/* Categories Dropdown */}
                    <div className="group relative">
                        <button className="flex items-center space-x-1 hover:text-indigo-600 transition font-medium text-sm">
                            <span>Categories</span>
                            <ChevronDown size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 hidden group-hover:block">
                            {categories.map(cat => (
                                <Link key={cat} to={`/?category=${cat}`} className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 transition text-sm">
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="relative hover:text-indigo-600 transition">
                        <ShoppingCart size={22} />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {/* Profile Dropdown or Login */}
                    {userInfo ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* Trigger */}
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2.5 bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded-2xl transition border border-gray-100 hover:border-indigo-100"
                            >
                                <div className="w-8 h-8 rounded-xl overflow-hidden bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {avatarContent}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-gray-900 leading-tight">{userInfo.name.split(' ')[0]}</span>
                                    <span className="text-[10px] text-gray-400">{userInfo.role}</span>
                                </div>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Panel */}
                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-[1.75rem] shadow-2xl border border-gray-100 overflow-hidden z-50">
                                    {/* Header with Avatar */}
                                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 pb-8 relative">
                                        <div className="flex items-center gap-4">
                                            {/* Big Editable Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div className="w-16 h-16 rounded-2xl ring-2 ring-white/30 overflow-hidden bg-white/20 flex items-center justify-center">
                                                    {userInfo?.avatar
                                                        ? <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                        : <span className="text-2xl font-black text-white">{userInfo?.name?.[0]?.toUpperCase()}</span>
                                                    }
                                                </div>
                                                {/* Camera Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={avatarUploading}
                                                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition"
                                                    title="Change Photo"
                                                >
                                                    {avatarUploading
                                                        ? <Loader size={12} className="animate-spin text-indigo-600" />
                                                        : <Camera size={12} className="text-indigo-600" />
                                                    }
                                                </button>
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                            </div>

                                            <div className="text-white min-w-0">
                                                <p className="font-black text-base leading-tight truncate">{userInfo.name}</p>
                                                <p className="text-white/70 text-xs truncate flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} /> {userInfo.email}
                                                </p>
                                                {userInfo.country && (
                                                    <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
                                                        <MapPin size={10} /> {userInfo.country}
                                                    </p>
                                                )}
                                                <span className={`inline-block mt-2 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/20 text-white border border-white/20`}>
                                                    {userInfo.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-3 space-y-1">
                                        {userInfo.role === 'Admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition text-sm font-bold text-gray-700"
                                            >
                                                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                    <ShieldCheck size={15} className="text-indigo-600" />
                                                </div>
                                                Admin Panel
                                            </Link>
                                        )}
                                        {userInfo.role === 'Vendor' && (
                                            <Link
                                                to="/vendor"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition text-sm font-bold text-gray-700"
                                            >
                                                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                    <ShoppingBag size={15} className="text-emerald-600" />
                                                </div>
                                                Vendor Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            to="/orders"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition text-sm font-bold text-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Package size={15} className="text-gray-500" />
                                            </div>
                                            My Orders
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 transition text-sm font-bold text-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <Settings size={15} className="text-gray-500" />
                                            </div>
                                            Account Settings
                                        </Link>

                                        <div className="h-px bg-gray-100 my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 hover:text-red-500 transition text-sm font-bold text-gray-700"
                                        >
                                            <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center">
                                                <LogOut size={15} className="text-red-500" />
                                            </div>
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 pb-4">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-gray-100 rounded-xl py-2 pl-4 pr-10 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={18} />
                        </button>
                    </form>

                    {userInfo && (
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center text-white font-black">
                                    {userInfo?.avatar
                                        ? <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        : userInfo?.name?.[0]?.toUpperCase()
                                    }
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                                    <Camera size={10} className="text-indigo-600" />
                                </button>
                            </div>
                            <div className="text-white">
                                <p className="font-black text-sm">{userInfo.name}</p>
                                <p className="text-white/70 text-xs">{userInfo.role}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Categories</p>
                        {categories.map(cat => (
                            <Link key={cat} to={`/?category=${cat}`} onClick={() => setIsOpen(false)} className="block px-2 py-2 hover:bg-indigo-50 rounded-xl transition font-medium text-sm">
                                {cat}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px bg-gray-100 my-4" />

                    {userInfo ? (
                        <div className="space-y-1">
                            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-xl font-bold text-sm"><User size={15} /> Account Settings</Link>
                            <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-xl font-bold text-sm"><Package size={15} /> My Orders</Link>
                            {userInfo.role === 'Vendor' && <Link to="/vendor" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm"><ShoppingBag size={15} /> Vendor Dashboard</Link>}
                            {userInfo.role === 'Admin' && <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-2 py-2 hover:bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm"><ShieldCheck size={15} /> Admin Panel</Link>}
                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-2 py-2 text-red-500 font-bold text-sm"><LogOut size={15} /> Log Out</button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-indigo-600 text-white text-center py-3 rounded-2xl font-bold">
                            Login / Register
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
