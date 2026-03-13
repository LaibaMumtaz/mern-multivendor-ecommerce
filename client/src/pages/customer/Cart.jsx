import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { removeFromCart, addToCart } from '../../features/cartSlice';
import Button from '../../components/common/Button';

const Cart = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login?redirect=cart');
        } else {
            navigate('/checkout');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <ShoppingBag className="mr-2 text-indigo-600" size={32} />
                Your Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-20 glass rounded-3xl">
                    <p className="text-gray-500 text-xl mb-6">Your cart is empty.</p>
                    <Link to="/" className="btn-primary px-8">Start Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <img
                                    src={item.image || 'https://via.placeholder.com/100'}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />
                                <div className="flex-grow">
                                    <Link to={`/products/${item.productId}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition">{item.name}</Link>
                                    <p className="text-indigo-600 font-bold mt-1">${item.price.toFixed(2)}</p>

                                    <div className="flex items-center mt-3 space-x-4">
                                        <select
                                            value={item.qty}
                                            onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                                            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => removeFromCartHandler(item.productId)}
                                            className="text-red-500 hover:text-red-700 transition p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass p-8 rounded-3xl sticky top-24 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
                            <div className="space-y-4 text-gray-600 mb-6 pb-6 border-b border-gray-200/50">
                                <div className="flex justify-between">
                                    <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-2xl font-extrabold text-gray-900 mb-8">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <Button onClick={checkoutHandler} className="py-4 text-lg">
                                Checkout Now <ArrowRight className="ml-2" size={20} />
                            </Button>

                            <div className="mt-4 text-center">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Secure Checkout Powered by Stripe</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
