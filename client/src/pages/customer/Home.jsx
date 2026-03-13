import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { getProductsRequest, getProductsSuccess, getProductsFail } from '../../features/productSlice';
import API from '../../api/axios';
import ProductGrid from '../../components/product/ProductGrid';
import { Search, SlidersHorizontal, ShoppingBag, Sparkles, TrendingUp, Zap } from 'lucide-react';

const Home = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { products, loading, error } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Accessories', 'Sports', 'Beauty', 'Books', 'Toys', 'Other'];

    useEffect(() => {
        // Read category/search from URL (e.g. from Navbar links)
        const params = new URLSearchParams(location.search);
        const urlCategory = params.get('category');
        const urlSearch = params.get('search');
        if (urlCategory) setActiveCategory(urlCategory);
        if (urlSearch) setSearchTerm(urlSearch);
        else if (!urlCategory) setSearchTerm('');

        const fetchProducts = async () => {
            dispatch(getProductsRequest());
            try {
                const { data } = await API.get('/products');
                dispatch(getProductsSuccess(data));
            } catch (err) {
                dispatch(getProductsFail(err.response?.data?.message || err.message));
            }
        };
        fetchProducts();
    }, [dispatch, location.search]);

    const handleCategoryClick = (cat) => {
        setActiveCategory(cat);
        // Smooth scroll to products grid
        setTimeout(() => {
            document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    };


    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pb-20">
            {/* Super Hero Section */}
            <div className="relative bg-white pt-10 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-100 animate-fade-in">
                            <Sparkles size={14} /> The Future of Marketplace
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
                            Shop Smart. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">Sell Smarter.</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
                            An AI-powered multi-vendor ecosystem designed for the modern era. Join thousands of creators and shoppers worldwide.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition duration-300 flex items-center gap-2"
                            >
                                <ShoppingBag size={20} /> Start Shopping
                            </button>
                            <Link
                                to="/sell"
                                className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                            >
                                Sell Products
                            </Link>
                        </div>

                        <div className="mt-12 flex items-center gap-8 border-t border-gray-100 pt-8 text-gray-400">
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-black text-2xl">10k+</span>
                                <span className="text-xs font-medium">Active Users</span>
                            </div>
                            <div className="w-px h-10 bg-gray-100"></div>
                            <div className="flex flex-col">
                                <span className="text-gray-900 font-black text-2xl">200+</span>
                                <span className="text-xs font-medium">Verified Vendors</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group lg:block hidden">
                        <div className="absolute inset-0 bg-indigo-500/20 rounded-[4rem] blur-3xl transform rotate-6 group-hover:rotate-0 transition duration-1000"></div>
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white p-2 bg-gray-100 aspect-video transform group-hover:scale-[1.02] transition duration-700">
                            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" alt="Marketplace Hero" className="w-full h-full object-cover" />
                            <div className="absolute bottom-6 left-6 right-6 glass p-6 rounded-3xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Featured Store</p>
                                    <h3 className="text-gray-900 font-black">Modern Essentials Co.</h3>
                                </div>
                                <TrendingUp className="text-emerald-500" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Shapes */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[100px] -z-10"></div>
            </div>

            {/* Main Content Area */}
            <div id="products-grid" className="max-w-7xl mx-auto px-6 pt-20 relative z-20">
                {/* Category Chips */}
                <div className="mb-12 overflow-x-auto whitespace-nowrap pb-4 no-scrollbar">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 mr-2">
                            <SlidersHorizontal size={20} />
                        </div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-8 py-3.5 rounded-2xl font-bold transition duration-300 border-2 ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' : 'bg-white text-gray-500 border-gray-50 hover:border-indigo-100 hover:text-indigo-600 shadow-sm'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid Section */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                            <Zap size={14} fill="currentColor" /> Handpicked for you
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Best of Marketplace</h2>
                    </div>
                    <button className="text-indigo-600 font-bold hover:underline hidden sm:block">View All Collections</button>
                </div>

                {error ? (
                    <div className="bg-red-50 text-red-600 p-8 rounded-[2.5rem] border border-red-100 text-center animate-bounce-in">
                        <p className="font-bold text-lg mb-2">Oops! Something went wrong</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                ) : (
                    <ProductGrid products={filteredProducts} loading={loading} />
                )}
            </div>
        </div>
    );
};

export default Home;
