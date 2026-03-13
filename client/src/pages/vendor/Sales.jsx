import { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import API from '../../api/axios';

const Sales = () => {
    const [sales, setSales] = useState({ totalEarnings: 0, sales: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await API.get('/orders/vendor/sales');
                setSales(data);
            } catch (err) {
                console.error('Error fetching sales', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    const updateStatusHandler = async (id, status) => {
        try {
            await API.put(`/orders/${id}/status`, { status });
            alert(`Order marked as ${status}`);
            window.location.reload();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading sales data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Sales History</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Gross Revenue</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black text-gray-900">${(sales.totalEarnings + (sales.totalPlatformFee || 0)).toFixed(2)}</h2>
                        <TrendingUp size={32} className="text-indigo-400" />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Platform Fee (10%)</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-4xl font-black text-red-500">-${(sales.totalPlatformFee || 0).toFixed(2)}</h3>
                        <div className="p-3 bg-red-50 rounded-2xl text-red-500"><DollarSign size={24} /></div>
                    </div>
                </div>
                <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Net Payout</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-black">${sales.totalEarnings.toFixed(2)}</h2>
                        <ArrowUpRight size={32} className="opacity-40" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
                        <tr>
                            <th className="px-8 py-6">Order ID</th>
                            <th className="px-8 py-6">Items</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Revenue</th>
                            <th className="px-8 py-6 text-right">Net Payout</th>
                            <th className="px-8 py-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sales.sales.map((sale) => (
                            <tr key={sale.orderId} className="hover:bg-indigo-50/30 transition duration-300">
                                <td className="px-8 py-6 text-sm font-bold text-gray-400 font-mono">#{sale.orderId.slice(-8)}</td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        {sale.items.map((item, idx) => (
                                            <span key={idx} className="text-sm font-bold text-gray-900">{item.qty}x {item.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${sale.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                        sale.status === 'Shipped' ? 'bg-indigo-100 text-indigo-700' :
                                            sale.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-500'
                                        }`}>
                                        {sale.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right text-sm font-bold text-gray-400">${sale.totalSales.toFixed(2)}</td>
                                <td className="px-8 py-6 text-right text-sm font-black text-gray-900">${sale.earned.toFixed(2)}</td>
                                <td className="px-8 py-6 text-center">
                                    {sale.status === 'Paid' && (
                                        <button
                                            onClick={() => updateStatusHandler(sale.orderId, 'Shipped')}
                                            className="text-[10px] font-black uppercase bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                                        >
                                            Mark Shipped
                                        </button>
                                    )}
                                    {sale.status === 'Shipped' && (
                                        <button
                                            onClick={() => updateStatusHandler(sale.orderId, 'Delivered')}
                                            className="text-[10px] font-black uppercase bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                    {sale.status === 'Delivered' && (
                                        <span className="text-[10px] font-black text-gray-300 uppercase">Completed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {sales.sales.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center text-gray-400">
                                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No sales data found yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
