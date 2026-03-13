import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Shield, Lock, Store, Camera, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { setCredentials } from '../../features/authSlice';
import API from '../../api/axios';

const COUNTRIES = [
    'Pakistan', 'India', 'United States', 'United Kingdom', 'Canada',
    'United Arab Emirates', 'Saudi Arabia', 'Australia', 'Germany',
    'France', 'Bangladesh', 'Malaysia', 'Singapore', 'Other'
];

const sidebarItems = (role) => [
    { id: 'profile', label: 'Public Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Password & Security', icon: Lock },
    ...(role === 'Vendor' ? [{ id: 'store', label: 'Store Settings', icon: Store }] : []),
];

const Profile = () => {
    const { userInfo } = useSelector((s) => s.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [section, setSection] = useState('profile');
    const [name, setName] = useState(userInfo?.name || '');
    const [email, setEmail] = useState(userInfo?.email || '');
    const [country, setCountry] = useState(userInfo?.country || '');
    const [storeName, setStoreName] = useState(userInfo?.storeInfo?.name || '');
    const [storeDesc, setStoreDesc] = useState(userInfo?.storeInfo?.description || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, text) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await API.post('/upload/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const res = await API.put('/auth/profile', { avatar: data.imageUrl });
            dispatch(setCredentials({ ...userInfo, ...res.data }));
            showToast('success', 'Profile photo updated!');
        } catch {
            showToast('error', 'Photo upload failed. Try again.');
        } finally {
            setAvatarUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (section === 'security' && password !== confirmPassword) {
            return showToast('error', 'Passwords do not match.');
        }
        setLoading(true);
        try {
            const payload = {};
            if (section === 'profile') { payload.name = name; }
            if (section === 'account') { payload.email = email; payload.country = country; }
            if (section === 'security' && password) { payload.password = password; }
            if (section === 'store') { payload.storeInfo = { name: storeName, description: storeDesc }; }

            const { data } = await API.put('/auth/profile', payload);
            dispatch(setCredentials({ ...userInfo, ...data }));
            showToast('success', 'Settings saved successfully!');
            if (section === 'security') { setPassword(''); setConfirmPassword(''); }
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Save failed.');
        } finally {
            setLoading(false);
        }
    };

    const currentSections = sidebarItems(userInfo?.role);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-white border border-emerald-200 text-emerald-700' : 'bg-white border border-red-200 text-red-600'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-500" />}
                    {toast.text}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="w-52 flex-shrink-0">
                        <nav className="space-y-1">
                            {currentSections.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setSection(id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${section === id
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-grow">
                        <form onSubmit={handleSave}>

                            {/* Public Profile */}
                            {section === 'profile' && (
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">Public Profile</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">This information will be shown on your profile.</p>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        {/* Avatar Row */}
                                        <div className="flex items-center gap-6">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center border-2 border-gray-200">
                                                    {userInfo?.avatar
                                                        ? <img src={userInfo.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                        : <span className="text-2xl font-black text-indigo-600">{userInfo?.name?.[0]?.toUpperCase()}</span>
                                                    }
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={avatarUploading}
                                                    className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-indigo-400 transition"
                                                >
                                                    {avatarUploading ? <Loader size={12} className="animate-spin text-indigo-500" /> : <Camera size={12} className="text-gray-500" />}
                                                </button>
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{userInfo?.name}</p>
                                                <p className="text-xs text-gray-500">{userInfo?.email}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition"
                                                >
                                                    Change photo
                                                </button>
                                            </div>
                                        </div>

                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                placeholder="Your full name"
                                            />
                                        </div>

                                        {/* Role Badge */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${userInfo?.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                                                    userInfo?.role === 'Vendor' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {userInfo?.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
                                            {loading && <Loader size={14} className="animate-spin" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Account */}
                            {section === 'account' && (
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">Account</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Manage your email and location settings.</p>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country / Region</label>
                                            <select
                                                value={country}
                                                onChange={e => setCountry(e.target.value)}
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition bg-white"
                                            >
                                                <option value="">Select country...</option>
                                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
                                            {loading && <Loader size={14} className="animate-spin" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Password & Security */}
                            {section === 'security' && (
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">Password & Security</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Leave blank to keep your current password.</p>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder="Min. 8 characters"
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter password"
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        {password && confirmPassword && password !== confirmPassword && (
                                            <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
                                        )}
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                        <button type="submit" disabled={loading || !password} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-40">
                                            {loading && <Loader size={14} className="animate-spin" />}
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Store Settings */}
                            {section === 'store' && userInfo?.role === 'Vendor' && (
                                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100">
                                        <h2 className="font-semibold text-gray-900">Store Settings</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Manage your vendor store information.</p>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
                                            <input
                                                type="text"
                                                value={storeName}
                                                onChange={e => setStoreName(e.target.value)}
                                                placeholder="Your store name"
                                                className="w-full max-w-md px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Description</label>
                                            <textarea
                                                value={storeDesc}
                                                onChange={e => setStoreDesc(e.target.value)}
                                                placeholder="Tell customers about your store..."
                                                rows={4}
                                                className="w-full max-w-2xl px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                        <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
                                            {loading && <Loader size={14} className="animate-spin" />}
                                            Save Store Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Profile;
