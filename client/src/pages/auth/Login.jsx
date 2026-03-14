import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../features/authSlice';
import API from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

import { ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });
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
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 flex overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-10 duration-700">
                {/* Visual Side */}
                <div className="hidden lg:flex w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="text-2xl font-black tracking-tighter mb-12 block">
                            {import.meta.env.VITE_STORE_NAME || 'AI Marketplace'}
                        </Link>
                        <h2 className="text-4xl font-black mb-4 leading-tight">Welcome Back to <br />Premium Shopping.</h2>
                        <p className="text-indigo-100 text-lg opacity-80">Access your personalized dashboard, track orders, and discover new creators.</p>
                    </div>

                    <div className="relative z-10 p-8 glass rounded-[2rem] border-white/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-white" size={24} />
                            </div>
                            <p className="font-bold">Secure Marketplace</p>
                        </div>
                        <p className="text-xs opacity-70 leading-relaxed font-medium">Your data and payments are protected by industry-leading encryption and 2FA protocols.</p>
                    </div>

                    {/* Background Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
                </div>

                {/* Form Side */}
                <div className="w-full lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                    <div className="mb-10 lg:hidden">
                        <Link to="/" className="text-xl font-black text-indigo-600 tracking-tighter">
                            {import.meta.env.VITE_STORE_NAME || 'AI Marketplace'}
                        </Link>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-8 font-medium">Please enter your credentials to login.</p>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl mb-8 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-8 text-sm text-indigo-800 shadow-inner">
                         <strong>🎓 Admin Login:</strong>
                         <ul className="mt-1 list-disc list-inside space-y-0.5 opacity-80">
                             <li><strong>Email:</strong> admin@example.com <span className="text-xs">(Pass: admin123)</span></li>
                         </ul>
                    </div>

                    <form onSubmit={submitHandler} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Link to="/forgot-password" size="sm" className="absolute top-0 right-0 text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest mt-0.5">Forgot?</Link>
                        </div>

                        <Button type="submit" loading={loading} className="w-full py-4 !rounded-2xl shadow-xl shadow-indigo-100 text-lg">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-10 text-center text-sm text-gray-500 font-medium">
                        Don't have an account yet? <Link to="/register" className="text-indigo-600 hover:underline font-bold">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
