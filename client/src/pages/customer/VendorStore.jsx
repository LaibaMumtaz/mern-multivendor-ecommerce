import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Store, MapPin, Star, Package } from 'lucide-react';
import API from '../../api/axios';
import ProductCard from '../../components/product/ProductCard';

const VendorStore = () => {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const [vendorRes, prodRes] = await Promise.all([
                    API.get(`/vendors/${id}`), // Public vendor route
                    API.get(`/products?vendorId=${id}`)
                ]);
                setVendor(vendorRes.data);
                setProducts(prodRes.data);
            } catch (err) {
                console.error('Error fetching vendor store data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVendorData();
    }, [id]);

    if (loading) return <div className="p-20 text-center">Opening store...</div>;
    if (!vendor) return <div className="p-20 text-center">Store not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Store Header */}
            <div className="bg-white border-b border-gray-100 pt-12 pb-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-100 uppercase">
                        {vendor.storeInfo?.logo ? <img src={vendor.storeInfo.logo} className="w-full h-full object-cover rounded-[2.5rem]" /> : vendor.storeInfo?.name?.[0] || vendor.name[0]}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">{vendor.storeInfo?.name || vendor.name}</h1>
                        <p className="text-gray-500 font-medium mb-4 max-w-xl">{vendor.storeInfo?.description || "Welcome to our official store. Quality products delivered with care."}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">
                                <Package size={14} />
                                <span>{products.length} Products</span>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-bold">
                                <Star size={14} fill="currentColor" />
                                <span>Top Rated Seller</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-gray-900">All Collections</h2>
                        <div className="text-sm font-bold text-gray-400">{products.length} items found</div>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            <Store size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-bold">This store hasn't listed any products yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorStore;
