import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Package, DollarSign, Layers, Database } from 'lucide-react';
import API from '../../api/axios';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await API.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImages([...images, data.imageUrl]);
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/products', {
                name,
                price: Number(price),
                description,
                category,
                stock: Number(stock),
                images,
            });
            navigate('/vendor');
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg">
                    <Package size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-gray-500 text-sm italic">Fill in the details to list your product in the marketplace.</p>
                </div>
            </div>

            <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Product Details */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-3xl space-y-4">
                        <Input label="Product Name" placeholder="e.g. Premium Silk Scarf" value={name} onChange={(e) => setName(e.target.value)} required />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Price ($)" type="number" placeholder="29.99" value={price} onChange={(e) => setPrice(e.target.value)} required />
                            <Input label="Stock" type="number" placeholder="100" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                                placeholder="Describe your product features..."
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm bg-white"
                                required
                            >
                                <option value="">Select a category...</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home Decor">Home Decor</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Sports">Sports</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Books">Books</option>
                                <option value="Toys">Toys</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Side: Media & Submit */}
                <div className="space-y-6 flex flex-col">
                    <div className="glass p-8 rounded-3xl flex-grow">
                        <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-100 group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square border-2 border-dashed border-indigo-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50/50 transition bg-white/50">
                                <Upload className="text-indigo-400 mb-2" size={24} />
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                <input type="file" className="hidden" onChange={uploadFileHandler} />
                            </label>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest mt-4">Suggested: 800x800px High Quality JPEGs</p>
                    </div>

                    <div className="mt-auto">
                        <Button type="submit" loading={loading} className="py-4 text-lg">
                            Publish Product Listing
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
