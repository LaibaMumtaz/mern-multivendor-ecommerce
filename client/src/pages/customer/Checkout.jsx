import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowRight, Loader } from 'lucide-react';
import API from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
const Checkout = () => {
    const { cartItems, shippingAddress } = useSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const orderData = {
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod: 'Stripe',
                itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
            };

            const { data } = await API.post('/orders', orderData);

            // Redirect to Stripe Checkout
            if (data.sessionUrl) {
                window.location.href = data.sessionUrl;
            } else {
                alert('Order created, but payment session failed. Please contact support.');
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-12 flex items-center">
                <ShieldCheck className="mr-3 text-indigo-600" size={36} /> Secure Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <div className="glass p-10 rounded-[2rem] shadow-xl shadow-indigo-50/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Truck size={24} /></div>
                            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            <Input label="Street Address" placeholder="123 Marketplace Ave" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="City" placeholder="San Francisco" value={city} onChange={(e) => setCity(e.target.value)} required />
                                <Input label="Postal Code" placeholder="94103" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Country</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 ring-indigo-500/20 transition"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100 mt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CreditCard size={24} /></div>
                                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                </div>
                                <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex items-center justify-between">
                                    <span className="font-bold text-emerald-700">Stripe Secure Payment</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-6" alt="Stripe" />
                                </div>
                            </div>

                            <Button type="submit" loading={loading} className="w-full py-5 text-lg mt-8 !rounded-3xl shadow-2xl shadow-indigo-200">
                                Proceed to Payment <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 rounded-[2rem] p-10 text-white sticky top-24">
                        <h2 className="text-xl font-bold mb-8">Summary</h2>

                        <div className="space-y-6 max-h-[40vh] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.productId} className="flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover opacity-80" />
                                            <span className="absolute -top-2 -right-2 bg-indigo-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.qty}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 line-clamp-1">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-indigo-400">${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-800">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-emerald-400 text-sm">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-3xl font-extrabold pt-4">
                                <span>Total</span>
                                <span>${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center">
                            <ShieldCheck size={16} /> Data encrypted with 256-bit SSL
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
