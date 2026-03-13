import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Package, DollarSign, List, Edit, Trash2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Button from '../../components/common/Button';

const VendorDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState({ totalEarnings: 0, sales: [] });
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('products'); // 'products' or 'sales'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, salesRes] = await Promise.all([
                    API.get('/products/vendor/mine'),
                    API.get('/orders/vendor/sales')
                ]);
                setProducts(prodRes.data);
                setSales(salesRes.data);
            } catch (err) {
                console.error('Error fetching vendor data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const deleteProductHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch {
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {userInfo.storeInfo?.name || userInfo.name}</p>
                </div>
                <Link to="/vendor/add-product">
                    <Button className="!w-auto px-6">
                        <Plus className="mr-2" size={20} /> Add New Product
                    </Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="glass p-6 rounded-3xl">
                    <div className="flex items-center gap-4 text-indigo-600 mb-4">
                        <div className="p-3 bg-indigo-50 rounded-2xl"><Package size={24} /></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Products</span>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900">{products.length}</p>
                </div>
                <div className="glass p-6 rounded-3xl">
                    <div className="flex items-center gap-4 text-emerald-600 mb-4">
                        <div className="p-3 bg-emerald-50 rounded-2xl"><DollarSign size={24} /></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Gross Revenue</span>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900">${(sales.totalEarnings + (sales.totalPlatformFee || 0)).toFixed(2)}</p>
                </div>
                <div className="glass p-6 rounded-3xl border-2 border-red-50">
                    <div className="flex items-center gap-4 text-red-500 mb-4">
                        <div className="p-3 bg-red-50 rounded-2xl"><TrendingUp size={24} /></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Platform Fee (10%)</span>
                    </div>
                    <p className="text-4xl font-extrabold text-gray-900">-${(sales.totalPlatformFee || 0).toFixed(2)}</p>
                </div>
                <div className="glass p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl"><DollarSign size={24} /></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Net Payout</span>
                    </div>
                    <p className="text-4xl font-extrabold">${sales.totalEarnings.toFixed(2)}</p>
                </div>
            </div>

            {/* View Toggles */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setView('products')}
                    className={`px-6 py-3 font-semibold transition ${view === 'products' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    My Products
                </button>
                <Link
                    to="/vendor/sales"
                    className="px-6 py-3 font-semibold text-gray-500 hover:text-indigo-600 transition"
                >
                    Sales History
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : view === 'products' ? (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr key={p._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <img src={(p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/400?text=No+Image'} className="w-10 h-10 rounded-lg object-cover" />
                                        <span className="font-medium text-gray-900">{p.name || 'Untitled Product'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${p.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Edit size={18} /></button>
                                        <button onClick={() => deleteProductHandler(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm p-6 text-center text-gray-500">
                    {sales.sales.length > 0 ? (
                        <List className="mx-auto mb-4" />
                    ) : "No sales recorded yet."}
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
