import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            qty: 1
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <Link to={`/products/${product?._id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
                <img
                    src={(product?.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/400?text=No+Image'}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product?.stock === 0 ? (
                        <div className="bg-red-500 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg">
                            Out of Stock
                        </div>
                    ) : product?.stock < 10 ? (
                        <div className="bg-orange-500 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full shadow-lg">
                            Low Stock
                        </div>
                    ) : null}
                </div>

                <button className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full text-gray-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-red-500 shadow-xl">
                    <Heart size={18} />
                </button>

                <div className="absolute inset-x-4 bottom-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <button
                        onClick={handleAddToCart}
                        disabled={product?.stock === 0}
                        className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition shadow-2xl disabled:bg-gray-400 disabled:opacity-50"
                    >
                        <ShoppingCart size={18} /> Add to Cart
                    </button>
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{product?.category}</span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={12} fill="#eab308" className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-700">{product?.rating || '4.5'}</span>
                    </div>
                </div>

                <Link to={`/products/${product?._id}`}>
                    <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1 hover:text-indigo-600 transition">{product?.name}</h3>
                </Link>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-grow">{product?.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-2xl font-black text-gray-900 tracking-tight">${product?.price?.toFixed(2) || '0.00'}</span>
                    <Link to={`/vendors/${product?.vendorId?._id || product?.vendorId}`} className="flex items-center gap-2 group/v hover:text-indigo-600 transition">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover/v:bg-indigo-50 group-hover/v:text-indigo-600 transition">
                            {product?.vendorId?.name?.[0] || product?.vendorId?.storeInfo?.name?.[0] || 'V'}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[80px] group-hover/v:text-indigo-600 transition">
                            {product?.vendorId?.storeInfo?.name || product?.vendorId?.name || 'Store'}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
