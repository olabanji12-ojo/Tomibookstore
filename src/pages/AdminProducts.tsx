import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getProducts, deleteProduct } from '../firebase/helpers';
import type { Product } from '../types';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success) {
      setProducts(result.products || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirm = await Swal.fire({
      title: 'Remove Piece?',
      text: `Are you sure you want to remove "${name}" from the boutique?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#f3f2ee',
      confirmButtonText: 'Yes, remove it',
      background: '#ffffff',
      color: '#000000'
    });

    if (confirm.isConfirmed) {
      const res = await deleteProduct(id);
      if (res.success) {
        toast.success('Removed successfully');
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="font-mona text-4xl font-black text-black uppercase tracking-tighter">Inventory</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">Curation Management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
            <input 
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-black/5 rounded-full pl-14 pr-8 py-4 font-poppins text-[11px] focus:border-black outline-none transition-all w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => navigate('/admin/products/add')}
            className="bg-black text-white px-8 py-4 rounded-full font-mona text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-neutral-800 transition-all shadow-xl shadow-black/10"
          >
            <Plus size={16} />
            New Piece
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5">
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Piece</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Category</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Price</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Stock</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Status</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="w-16 h-16 bg-[#f3f2ee] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package size={24} className="text-black/10" />
                  </div>
                  <p className="font-mona text-xs font-black text-black uppercase tracking-widest">No pieces found</p>
                </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="group hover:bg-black/[0.01] transition-colors">
                    <td className="p-8">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-16 bg-[#f3f2ee] rounded overflow-hidden flex-shrink-0 border border-black/5">
                          <img src={p.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-mona text-xs font-black text-black uppercase tracking-tight">{p.name}</p>
                          <p className="font-poppins text-[9px] text-black/40 uppercase tracking-widest font-bold mt-0.5">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className="font-poppins text-[10px] text-black/60 font-bold uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="p-8">
                      <span className="font-mona text-xs font-black text-black">₦{p.price.toLocaleString()}</span>
                    </td>
                    <td className="p-8">
                      <span className={`font-poppins text-[10px] font-bold ${Number(p.stock || 0) < 5 ? 'text-red-500' : 'text-black'}`}>
                        {p.stock || 0} left
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.featured ? 'bg-green-400' : 'bg-black/10'}`} />
                        <span className="font-mona text-[9px] font-black uppercase tracking-widest text-black/40">
                          {p.featured ? 'Featured' : 'Standard'}
                        </span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 text-black/20 hover:text-black transition-colors" title="Edit Piece">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-3 text-black/20 hover:text-red-500 transition-colors" 
                          title="Delete Piece"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
