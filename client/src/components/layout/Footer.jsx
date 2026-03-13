import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-white text-xl font-bold mb-4">AI Marketplace</h3>
                    <p className="text-sm">
                        Empowering small businesses and independent creators with a modern
                        multi-vendor platform.
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-indigo-400 text-gray-300">Home</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 text-gray-300">Browse Products</Link></li>
                        <li><Link to="/cart" className="hover:text-indigo-400 text-gray-300">Cart</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Account</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/login" className="hover:text-indigo-400 text-gray-300">Login</Link></li>
                        <li><Link to="/register" className="hover:text-indigo-400 text-gray-300">Register</Link></li>
                        <li><Link to="/register" className="hover:text-indigo-400 text-gray-300">Sell Products</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-indigo-400 text-gray-300">FAQs</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 text-gray-300">Terms of Service</Link></li>
                        <li><Link to="/" className="hover:text-indigo-400 text-gray-300">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs">
                <p>&copy; {new Date().getFullYear()} AI Multi-Vendor Platform. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
