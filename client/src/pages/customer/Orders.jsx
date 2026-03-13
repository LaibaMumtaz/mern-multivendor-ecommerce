import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, ExternalLink, Search } from 'lucide-react';
import API from '../../api/axios';
import { Link } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders/mine');
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error('Error fetching orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Delivered': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle2 size={14} />;
            case 'Shipped': return <Truck size={14} />;
            case 'Delivered': return <Package size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 text-sm">Track your purchases and view order history.</p>
                </div>
                <div className="relative md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search order ID..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 ring-indigo-100 outline-none w-full text-sm" />
                </div>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] h-48 animate-pulse border border-gray-100 shadow-sm"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 glass rounded-[2rem]">
                    <Package className="mx-auto text-gray-300 mb-6" size={64} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                    <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                    <Link to="/" className="btn-primary !w-auto inline-block px-8 py-3">Start Browsing</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
                            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-sm font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                        <p className="text-sm font-mono text-gray-500 uppercase">#{order._id.slice(-8)}</p>
                                    </div>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${getStatusStyles(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="space-y-6">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <div className="flex items-center gap-6">
                                                <img src={item.image} className="w-20 h-20 rounded-2xl object-cover border border-gray-100" />
                                                <div>
                                                    <Link to={`/products/${item.productId}`} className="font-bold text-gray-900 hover:text-indigo-600 transition leading-tight mb-1 block">{item.name}</Link>
                                                    <p className="text-sm text-gray-400">Sold by Vendor</p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="text-xs font-bold bg-gray-50 px-2 py-0.5 rounded text-gray-500">Qty: {item.qty}</span>
                                                        <span className="text-xs font-bold text-gray-900">${item.price.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 px-4 py-2 rounded-xl transition">
                                                Write Review <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
