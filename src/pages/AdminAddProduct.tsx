import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { addProduct, uploadProductImages } from '../firebase/helpers';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'fashion', label: 'Fashion', subs: ['Kaftans', 'Accessories', 'Occasion'] },
  { id: 'home', label: 'Home', subs: ['Decor', 'Fragrance', 'Kitchen'] },
  { id: 'gifts', label: 'Gifts', subs: ['For Her', 'For Him', 'Kids'] },
  { id: 'books', label: 'Books', subs: ['Fiction', 'Non-Fiction', 'Children'] },
  { id: 'bundles', label: 'Bundles', subs: ['Kits', 'Gift Boxes', 'Sets'] }
];

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subCategory: '',
    stock: '1',
    featured: false,
    author: '',
    availableSizes: [] as string[],
    fitInfo: '',
    styleWithIds: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images to Cloudinary
      const uploadRes = await uploadProductImages(files);
      if (!uploadRes.success) throw new Error('Image upload failed');

      // 2. Prepare product data
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const productPayload = {
        name: formData.name,
        slug,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        subCategory: formData.subCategory,
        featured: formData.featured,
        author: formData.category === 'books' ? formData.author : undefined,
        images: uploadRes.urls,
        image: uploadRes.urls[0], // Primary image
        hasVariants: false,
        availableSizes: formData.availableSizes,
        fitInfo: formData.fitInfo,
        styleWithIds: formData.styleWithIds.split(',').map(s => s.trim()).filter(s => s !== ''),
      };

      // 3. Save to Firestore
      const result = await addProduct(productPayload);
      if (result.success) {
        toast.success('Product added to boutique!');
        navigate('/admin/dashboard');
      } else {
        throw new Error('Failed to save product');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-black/30 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mona text-[10px] font-black uppercase tracking-widest">Back to Studio</span>
        </button>

        <div className="mb-12">
          <h1 className="font-mona text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">Add New Piece</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em] mt-2">Introduce a new artifact to the collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Basic Info */}
          <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Product Name *</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Silk Kaftan No. 01"
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-lg focus:border-black outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Price (NGN) *</label>
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  placeholder="25,000"
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-lg focus:border-black outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Description *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the story, material, and uniqueness of this piece..."
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-base focus:border-black outline-none transition-all resize-none"
                />
            </div>
          </section>

          {/* Section: Classification */}
          <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 space-y-10">
            <h3 className="font-mona text-xs font-black uppercase tracking-widest text-black/80">Classification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Primary Category</label>
                <select 
                  required
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value, subCategory: ''})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>

              {formData.category && (
                <div className="space-y-4">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Department</label>
                  <select 
                    required
                    value={formData.subCategory}
                    onChange={e => setFormData({...formData, subCategory: e.target.value})}
                    className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select Sub-category</option>
                    {CATEGORIES.find(c => c.id === formData.category)?.subs.map(sub => (
                      <option key={sub} value={sub.toLowerCase().replace(/\s+/g, '-')}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {formData.category === 'books' && (
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Author / Creator</label>
                <input 
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  placeholder="Writer or Brand name"
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all"
                />
              </div>
            )}
            
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                <div className="space-y-4 flex-1">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Opening Stock</label>
                  <input 
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 sm:mt-8 bg-[#f3f2ee] px-6 py-4 rounded-3xl cursor-pointer self-start sm:self-auto" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${formData.featured ? 'bg-black border-black' : 'border-black/10'}`}>
                    {formData.featured && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="font-mona text-[9px] font-black uppercase tracking-widest text-black/60">Featured Piece</span>
                </div>
              </div>

              {/* NEW: Sizing & Details */}
              <div className="pt-10 border-t border-black/5 space-y-10">
                <div className="space-y-6">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Available Sizes</label>
                  <div className="flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL', 'OS'].map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const current = formData.availableSizes || [];
                          const updated = current.includes(size) 
                            ? current.filter(s => s !== size)
                            : [...current, size];
                          setFormData({...formData, availableSizes: updated});
                        }}
                        className={`px-6 py-3 rounded-xl font-mona text-[10px] font-black uppercase tracking-widest transition-all border
                                   ${(formData.availableSizes || []).includes(size) ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black/40 border-black/5 hover:border-black/20'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Fit & Sizing Information</label>
                  <textarea 
                    rows={2}
                    value={formData.fitInfo}
                    onChange={e => setFormData({...formData, fitInfo: e.target.value})}
                    placeholder="e.g. Regular fit. Model is 6'1 wearing a Large."
                    className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Style With (Product IDs, comma separated)</label>
                  <input 
                    type="text"
                    value={formData.styleWithIds}
                    onChange={e => setFormData({...formData, styleWithIds: e.target.value})}
                    placeholder="e.g. kaftan-01, silk-scarf-02"
                    className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all"
                  />
                </div>
              </div>
            </section>
  
            {/* Section: Media */}
            <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 space-y-10">
            <h3 className="font-mona text-xs font-black uppercase tracking-widest text-black/80">Visual Assets</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-black/5">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <label 
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-black/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#f3f2ee] transition-all group"
              >
                <Upload size={20} className="text-black/20 group-hover:text-black transition-colors" />
                <span className="font-mona text-[8px] font-black uppercase tracking-[0.2em] text-black/30">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </section>

          <div className="pt-8">
            <button
              disabled={loading}
              className="w-full h-20 bg-black text-white font-mona text-sm font-black uppercase tracking-[0.5em] rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-black/20"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.4s]" />
                </div>
              ) : (
                <>
                  <Plus size={18} />
                  Publish to Boutique
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddProduct;
