import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import { getProductDetailRequest, getProductDetailSuccess, getProductDetailFail } from '../../features/productSlice';
import { addToCart } from '../../features/cartSlice';
import API from '../../api/axios';
import Button from '../../components/common/Button';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error } = useSelector((state) => state.products);
    const { userInfo } = useSelector((state) => state.auth);

    const [qty, setQty] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            dispatch(getProductDetailRequest());
            try {
                const { data } = await API.get(`/products/${id}`);
                dispatch(getProductDetailSuccess(data));
                setMainImage(data.images[0]);
            } catch (err) {
                dispatch(getProductDetailFail(err.response?.data?.message || err.message));
            }
        };
        fetchProduct();
    }, [dispatch, id]);

    const addToCartHandler = () => {
        dispatch(addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            qty
        }));
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        try {
            await API.post(`/products/${id}/reviews`, { rating, comment });
            alert('Review Submitted!');
            window.location.reload(); // Simple refresh to show new review
        } catch (err) {
            setReviewError(err.response?.data?.message || err.message);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading Product...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Link to="/" className="flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition gap-2 group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" /> Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-xl shadow-indigo-50">
                        <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition ${mainImage === img ? 'border-indigo-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <div className="flex items-center text-yellow-500 text-sm font-bold">
                            <Star size={16} fill="currentColor" className="mr-1" /> {product.rating.toFixed(1)}
                            <span className="text-gray-400 font-normal ml-1">({product.numReviews} reviews)</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-indigo-600 mb-6">${product.price.toFixed(2)}</p>

                    <div className="prose prose-indigo mb-8">
                        <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                    </div>

                    <div className="glass p-6 rounded-3xl mb-8 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Inventory Status</span>
                            <span className={`font-bold ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.stock > 0 && (
                            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quantity</span>
                                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100 shadow-inner">
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-indigo-600 hover:shadow-md transition active:scale-90"
                                    >
                                        <span className="text-xl font-bold">−</span>
                                    </button>
                                    <span className="w-12 text-center font-black text-gray-900">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-600 hover:text-indigo-600 hover:shadow-md transition active:scale-90"
                                    >
                                        <span className="text-xl font-bold">+</span>
                                    </button>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    Only {product.stock} available
                                </span>
                            </div>
                        )}

                        <Button onClick={addToCartHandler} disabled={product.stock === 0} className="w-full py-4 !rounded-2xl shadow-lg shadow-indigo-100">
                            <ShoppingCart className="mr-2" size={20} /> Add to Cart
                        </Button>
                    </div>

                    {/* Features/Badges */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <ShieldCheck className="text-indigo-600" size={24} />
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Authentic Product Guaranteed</div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <Truck className="text-emerald-500" size={24} />
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Fast Shipping Worldwide</div>
                        </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <Link to={`/vendors/${product.vendorId?._id}`} className="flex items-center gap-4 group/v hover:text-indigo-600 transition">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold group-hover/v:bg-indigo-600 group-hover/v:text-white transition duration-500">
                                {product.vendorId?.name?.[0] || 'V'}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sold by</p>
                                <p className="font-bold text-gray-900 group-hover/v:text-indigo-600 transition">{product.vendorId?.storeInfo?.name || product.vendorId?.name || 'Local Vendor'}</p>
                            </div>
                        </Link>
                        <Link
                            to={`/vendors/${product.vendorId?._id}`}
                            className="bg-gray-50 text-indigo-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition border border-gray-100"
                        >
                            Visit Store
                        </Link>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 border-t border-gray-100 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-black text-gray-900 mb-6">Customer Reviews</h2>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-5xl font-black text-indigo-600">{product.rating.toFixed(1)}</div>
                            <div>
                                <div className="flex text-yellow-500 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Based on {product.numReviews} ratings</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        {product.reviews.length === 0 ? (
                            <div className="bg-gray-50 p-10 rounded-[2.5rem] text-center">
                                <p className="text-gray-400 font-bold italic">No reviews yet. Be the first to share your experience!</p>
                            </div>
                        ) : (
                            product.reviews.map((review) => (
                                <div key={review._id} className="group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 uppercase">
                                                {review.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">{review.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed pl-13">{review.comment}</p>
                                </div>
                            ))
                        )}

                        {/* Leave a Review Form - Only for logged in customers */}
                        {userInfo && userInfo.role === 'Customer' && (
                            <div className="mt-16 bg-white border-2 border-indigo-50 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100/20">
                                <h3 className="text-xl font-black text-gray-900 mb-6">Write a Review</h3>
                                {reviewError && <p className="text-red-500 mb-4">{reviewError}</p>}
                                <form onSubmit={submitReviewHandler} className="space-y-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="bg-gray-50 border-none rounded-xl px-4 py-2 outline-none focus:ring-4 ring-indigo-50 transition"
                                        >
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Comment</label>
                                        <textarea
                                            rows="4"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-4 ring-indigo-50 transition"
                                            placeholder="Tell others what you think..."
                                            required
                                        ></textarea>
                                    </div>
                                    <Button type="submit" loading={reviewLoading} className="w-full sm:w-auto px-10 py-4 !rounded-2xl">
                                        Submit Review
                                    </Button>
                                </form>
                            </div>
                        )}
                        {!userInfo && (
                            <div className="mt-16 bg-gray-50 p-8 rounded-[2.5rem] text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 font-bold">Please <Link to="/login" className="text-indigo-600 underline">Login</Link> to leave a review.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
