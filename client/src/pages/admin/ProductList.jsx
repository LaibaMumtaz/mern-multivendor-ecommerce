import { useState, useEffect } from 'react';
import { Package, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import API from '../../api/axios';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleProductActive = async (id, currentStatus) => {
        try {
            await API.put(`/products/${id}`, { isActive: !currentStatus });
            setProducts(products.map(p => p._id === id ? { ...p, isActive: !currentStatus } : p));
        } catch {
            alert('Failed to update product status');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-20 text-center">Loading all products...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Platform Products</h1>
                    <p className="text-gray-500 font-medium">Control inventory and visibility across all vendors.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-4 ring-indigo-50 outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                        <tr>
                            <th className="px-8 py-6">Product Info</th>
                            <th className="px-8 py-6">Vendor</th>
                            <th className="px-8 py-6">Price</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100" />
                                        <div>
                                            <p className="font-bold text-gray-900 leading-tight">{p.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mt-1">{p.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-gray-600">{p.vendorId?.name || 'Unknown Vendor'}</p>
                                    <p className="text-[10px] text-gray-400">{p.vendorId?.email}</p>
                                </td>
                                <td className="px-8 py-6 text-sm font-black text-gray-900">${p.price.toFixed(2)}</td>
                                <td className="px-8 py-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${p.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {p.isActive ? 'Live' : 'Hidden'}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <button
                                        onClick={() => toggleProductActive(p._id, p.isActive)}
                                        className={`p-3 rounded-xl transition ${p.isActive ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                        title={p.isActive ? 'Deactivate Product' : 'Activate Product'}
                                    >
                                        {p.isActive ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
