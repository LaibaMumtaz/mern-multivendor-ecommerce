import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { clearCart } from '../../features/cartSlice';
import API from '../../api/axios';
import Button from '../../components/common/Button';

const OrderSuccess = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(clearCart());
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, dispatch]);

    return (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="mb-8 flex justify-center">
                <div className="relative">
                    <CheckCircle className="text-emerald-500 w-24 h-24 animate-in zoom-in duration-500" />
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl opacity-20 -z-10 animate-pulse"></div>
                </div>
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-500 text-lg mb-12">Thank you for your purchase. Your order <span className="font-mono font-bold text-indigo-600">#{id?.slice(-6)}</span> has been confirmed.</p>

            {loading ? (
                <div className="glass p-8 rounded-3xl animate-pulse h-64"></div>
            ) : order && (
                <div className="glass p-8 rounded-3xl text-left mb-12 border-emerald-100 bg-emerald-50/10">
                    <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package size={20} className="text-indigo-600" /> Order Details
                    </h2>
                    <div className="space-y-4">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Total Paid</span>
                        <span className="text-2xl font-black text-indigo-600">${order.total.toFixed(2)}</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/orders">
                    <Button className="!w-auto px-8 py-3 !bg-gray-900 hover:!bg-black">
                        View My Orders <ArrowRight className="ml-2" size={18} />
                    </Button>
                </Link>
                <Link to="/">
                    <Button className="!w-auto px-8 py-3 !bg-white !text-gray-900 border border-gray-200 hover:!bg-gray-50 transition">
                        <Home className="mr-2" size={18} /> Return Home
                    </Button>
                </Link>
            </div>

            <p className="mt-12 text-sm text-gray-400">A confirmation email has been sent to your registered address.</p>
        </div>
    );
};

export default OrderSuccess;
