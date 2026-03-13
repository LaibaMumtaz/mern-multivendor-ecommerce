import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import API from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Customer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'Vendor') {
                navigate('/vendor');
            } else if (userInfo.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [navigate, userInfo]);

    const validateForm = () => {
        if (name.length < 3) return 'Name must be at least 3 characters';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
        if (password.length < 6) return 'Password must be at least 6 characters';
        if (password !== confirmPassword) return 'Passwords do not match';
        return null;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            return setError(validationError);
        }

        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/register', { name, email, password, role });
            dispatch(setCredentials({ ...data }));

            // Critical Role-Based Redirect
            if (data.role === 'Vendor') {
                navigate('/vendor');
            } else if (data.role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50/50">
            <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 flex overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* Visual Side */}
                <div className="hidden lg:flex w-2/5 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="text-2xl font-black tracking-tighter mb-12 block">
                            {import.meta.env.VITE_STORE_NAME || 'AI Marketplace'}
                        </Link>
                        <h2 className="text-4xl font-black mb-4 leading-tight">Join Our <br />Growing Community.</h2>
                        <p className="text-indigo-100 text-lg opacity-80">Whether you're here to buy or sell, you're in the right place.</p>
                    </div>

                    <div className="relative z-10 glass p-8 rounded-[2rem] border-white/20">
                        <div className="flex -space-x-4 mb-6">
                            {[11, 12, 13, 14].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-white shadow-lg overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-4 border-indigo-600 bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm font-bold">Trusted by thousands of users worldwide.</p>
                    </div>

                    {/* Background Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/2 translate-x-1/3"></div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-3/5 p-10 md:p-14 flex flex-col justify-center">
                    <div className="mb-8 lg:hidden">
                        <Link to="/" className="text-xl font-black text-indigo-600 tracking-tighter">
                            {import.meta.env.VITE_STORE_NAME || 'AI Marketplace'}
                        </Link>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
                            <p className="text-gray-500 font-medium text-sm">Join us and start your journey today.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <div className="md:col-span-2 flex flex-col">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">I want to...</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('Customer')}
                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition ${role === 'Customer'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100'
                                        : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                >
                                    Shop Online
                                </button>
                                {import.meta.env.VITE_STORE_MODE !== 'single' && (
                                    <button
                                        type="button"
                                        onClick={() => setRole('Vendor')}
                                        className={`py-3 rounded-xl text-sm font-bold border-2 transition ${role === 'Vendor'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-100'
                                            : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                                    >
                                        Sell Products
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <Button type="submit" loading={loading} className="w-full py-4 !rounded-2xl shadow-xl shadow-indigo-100 text-lg">
                                Create My Account
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:underline font-bold">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
