import { Link } from 'react-router-dom';
import { ShoppingBag, Zap, Shield, Globe, TrendingUp, Users } from 'lucide-react';
import Button from '../../components/common/Button';

const SellerLanding = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative py-20 px-6 overflow-hidden bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Become a Seller on <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Our Marketplace</span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl">
                        Join over 10,000 creators, artisans, and tech brands. Reach millions of customers with our low-commission platform.
                    </p>
                    <Link to="/register">
                        <Button className="px-12 py-5 text-xl rounded-2xl shadow-2xl shadow-indigo-500/20">
                            Start Selling Today
                        </Button>
                    </Link>
                </div>

                {/* Background Sparkles */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Why Join Us? */}
            <div className="max-w-7xl mx-auto py-24 px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Why Sell With Us?</h2>
                    <p className="text-gray-500 font-medium">We provide the tools you need to build a successful brand.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: <Zap />, title: "Quick Setup", desc: "List your first product in under 2 minutes with our intuitive dashboard." },
                        { icon: <Shield />, title: "Secure Payouts", desc: "Get paid instantly via Stripe with transparent fee tracking." },
                        { icon: <TrendingUp />, title: "Low Commission", desc: "We only take a 10% platform fee, much lower than major competitors." },
                        { icon: <Globe />, title: "Global Reach", desc: "Ship products to customers around the world with our integrated logistics." },
                        { icon: <Users />, title: "Seller Community", desc: "Network with other artisans and get tips on growing your shop." },
                        { icon: <ShoppingBag />, title: "AI Marketing", desc: "Our AI assistant recommends your products to interested buyers." },
                    ].map((feature, i) => (
                        <div key={i} className="group p-10 rounded-[2.5rem] border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition duration-500">
                            <div className="w-14 h-14 bg-gray-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 py-24 px-6 border-y border-gray-100">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active Vendors", val: "2,000+" },
                        { label: "Annual Orders", val: "1.2M+" },
                        { label: "Products Sold", val: "5M+" },
                        { label: "Avg. Revenue", val: "$15k/mo" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-4xl font-black text-indigo-600 mb-2">{stat.val}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto py-32 px-6 text-center">
                <h2 className="text-5xl font-black text-gray-900 mb-8 leading-tight">Ready to launch your shop?</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register">
                        <Button className="px-12 py-5 rounded-2xl">Create Seller Account</Button>
                    </Link>
                    <Link to="/auth/login">
                        <button className="px-12 py-5 rounded-2xl border-2 border-gray-200 font-bold hover:bg-gray-50 transition">
                            Login as Vendor
                        </button>
                    </Link>
                </div>
                <p className="mt-8 text-gray-400 text-sm italic">No credit card required to sign up.</p>
            </div>
        </div>
    );
};

export default SellerLanding;
