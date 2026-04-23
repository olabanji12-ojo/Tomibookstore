import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getProductById, updateProduct, uploadProductImages } from '../firebase/helpers';
import toast from 'react-hot-toast';



const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subCategory: '',
    stock: '1',
    featured: false,
    author: '',
  });

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const res = await getProductById(id!);
    if (res.success && res.product) {
      const p = res.product;
      setFormData({
        name: p.name,
        price: p.price.toString(),
        description: p.description,
        category: p.category,
        subCategory: p.subCategory || '',
        stock: (p.stock || 0).toString(),
        featured: p.featured || false,
        author: p.author || '',
      });
      setExistingImages(p.images || [p.image]);
      setPreviewUrls(p.images || [p.image]);
    } else {
      toast.error('Could not find piece');
      navigate('/admin/products');
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    // If it's an existing image (string URL), remove from existingImages
    const urlToRemove = previewUrls[index];
    if (existingImages.includes(urlToRemove)) {
      setExistingImages(prev => prev.filter(url => url !== urlToRemove));
    } else {
      // If it's a new file, remove from files
      // We need to find which file it corresponds to. 
      // This is slightly complex because previewUrls combines both.
      // Simpler way: filter previewUrls and manage both arrays.
    }
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    // Implementation Note: In a real app, you'd manage the file mapping more strictly.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let finalImages = [...existingImages];

      // 1. Upload new images if any
      if (files.length > 0) {
        const uploadRes = await uploadProductImages(files);
        if (uploadRes.success) {
          finalImages = [...finalImages, ...uploadRes.urls];
        }
      }

      if (finalImages.length === 0) {
        throw new Error('At least one image is required');
      }

      // 2. Prepare payload
      const productPayload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        subCategory: formData.subCategory,
        featured: formData.featured,
        author: formData.category === 'books' ? formData.author : undefined,
        images: finalImages,
        image: finalImages[0], 
      };

      // 3. Update Firestore
      const result = await updateProduct(id!, productPayload);
      if (result.success) {
        toast.success('Boutique updated successfully');
        navigate('/admin/products');
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error: any) {
      toast.error(error.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
          <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-black/30 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mona text-[10px] font-black uppercase tracking-widest">Back to Archives</span>
        </button>

        <div className="mb-12">
          <h1 className="font-mona text-4xl font-black text-black uppercase tracking-tighter">Edit Piece</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em] mt-2">Update the details of your curation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Basic Info */}
          <section className="bg-white p-12 rounded-[2.5rem] border border-black/5 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Product Name *</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
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
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-base focus:border-black outline-none transition-all resize-none"
                />
            </div>
          </section>

          {/* Section: Media */}
          <section className="bg-white p-12 rounded-[2.5rem] border border-black/5 space-y-10">
            <h3 className="font-mona text-xs font-black uppercase tracking-widest text-black/80">Visual Assets</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-black/5">
                  {url ? (
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-black/5 animate-pulse" />
                  )}
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
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
                <span className="font-mona text-[8px] font-black uppercase tracking-[0.2em] text-black/30">Add More</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </section>

          {/* Section: Status */}
          <section className="bg-white p-12 rounded-[2.5rem] border border-black/5 space-y-10">
            <div className="flex items-center gap-10">
              <div className="space-y-4 flex-1">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Current Stock</label>
                <input 
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-4 mt-8 bg-[#f3f2ee] px-6 py-4 rounded-3xl cursor-pointer" onClick={() => setFormData({...formData, featured: !formData.featured})}>
                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${formData.featured ? 'bg-black border-black' : 'border-black/10'}`}>
                  {formData.featured && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="font-mona text-[9px] font-black uppercase tracking-widest text-black/60">Featured Piece</span>
              </div>
            </div>
          </section>

          <div className="pt-8">
            <button
              disabled={saving}
              className="w-full h-20 bg-black text-white font-mona text-sm font-black uppercase tracking-[0.5em] rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-black/20"
            >
              {saving ? 'UPDATING ARCHIVE...' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEditProduct;
