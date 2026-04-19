import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List, ShoppingBag, ArrowRight, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../firebase/helpers';
import type { Product } from '../types';
import toast from 'react-hot-toast';

const categories = ['FASHION', 'ACCESSORIES', 'GIFTS', 'HOME', 'PACKAGING'];
const rituals = ['WORK', 'PLAY', 'FANCY', 'SLEEP', 'EAT'];

interface ShopProps {
  onQuickView: (product: Product) => void;
}

export default function Shop({ onQuickView }: ShopProps) {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState(catParam?.toUpperCase() || 'ALL');
  const [selectedRitual, setSelectedRitual] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getProducts();
      if (res.success) setProducts(res.products);
      else toast.error('Failed to load archives.');
      setLoading(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (catParam) setSelectedCat(catParam.toUpperCase());
  }, [catParam]);

  const filtered = products.filter(p => {
    const name = p.name || 'Untitled Product';
    const category = p.category || 'Uncategorized';
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || category.toUpperCase() === selectedCat;
    const matchesRitual = selectedRitual === 'ALL' || (p.functions || []).some(f => f.toUpperCase() === selectedRitual);
    return matchesSearch && matchesCat && matchesRitual;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#f3f2ee]">
        <div className="w-10 h-10 border-2 border-black/5 border-t-black rounded-full animate-spin mb-6" />
        <p className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/30">
          ACCESSING ARCHIVES...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ee] pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-8 border-b border-black/[0.03]">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block py-2 px-4 bg-black/5 rounded-full mb-8"
          >
            <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/40">
              The Archives
            </span>
          </motion.div>
          <h1 className="font-mona text-6xl md:text-9xl font-black tracking-tighter text-black mb-8 leading-[0.85]">
            CURATED <br /> COLLECTION
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[95px] z-40 bg-[#f3f2ee]/80 backdrop-blur-xl border-b border-black/[0.03] py-5 px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Refine Toggle */}
          <div className="flex items-center gap-8">
            <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-3 font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/60 hover:text-black transition-colors"
            >
                <Filter size={14} />
                Refine
            </button>
            <div className="h-4 w-[1px] bg-black/10 hidden md:block" />
            <span className="font-mona text-[9px] font-black tracking-widest text-black/20 uppercase hidden lg:inline">
              {filtered.length} Items Found
            </span>
          </div>

          {/* Center: Search */}
          <div className="relative group flex-1 md:max-w-md mx-4">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
              <input 
                type="text"
                placeholder="Search archives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/5 border border-transparent focus:bg-white focus:border-black/10 rounded-full py-2.5 pl-10 pr-6 font-poppins text-xs outline-none transition-all w-full"
              />
          </div>

          {/* Right: View Toggles */}
          <div className="flex items-center gap-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-black/15 hover:text-black/40'}`}
              >
                  <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'text-black' : 'text-black/15 hover:text-black/40'}`}
              >
                  <List size={18} />
              </button>
          </div>
        </div>
      </section>

      {/* Global Left Filter Sidebar */}
      <AnimatePresence>
          {showFilters && (
              <>
                  {/* Backdrop */}
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowFilters(false)}
                      className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
                  />
                  
                  {/* Sidebar Panel */}
                  <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed top-0 left-0 w-full md:w-[450px] h-full bg-[#f3f2ee] z-[70] shadow-2xl overflow-y-auto"
                  >
                      {/* Sidebar Header */}
                      <div className="sticky top-0 bg-[#f3f2ee] px-10 pt-12 pb-8 flex justify-between items-center z-10">
                          <div>
                              <h2 className="font-mona text-3xl font-black uppercase tracking-tighter leading-none mb-2">Refine</h2>
                              <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-widest">Sort & Filter Archives</p>
                          </div>
                          <button 
                              onClick={() => setShowFilters(false)}
                              className="p-3 bg-white border border-black/5 rounded-full hover:bg-black hover:text-white transition-all group"
                          >
                              <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                          </button>
                      </div>

                      {/* Sidebar Content */}
                      <div className="px-10 pb-20 space-y-16">
                          {/* Categories Section */}
                          <section>
                              <div className="flex items-center gap-4 mb-8">
                                  <div className="h-[1px] flex-1 bg-black/5" />
                                  <h4 className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/30">By Department</h4>
                                  <div className="h-[1px] w-8 bg-black/5" />
                              </div>
                              <div className="grid grid-cols-1 gap-1">
                                  <FilterTab 
                                      label="All Items" 
                                      active={selectedCat === 'ALL'} 
                                      onClick={() => setSelectedCat('ALL')} 
                                  />
                                  {categories.map(cat => (
                                      <FilterTab 
                                          key={cat}
                                          label={cat}
                                          active={selectedCat === cat}
                                          onClick={() => setSelectedCat(cat)}
                                      />
                                  ))}
                              </div>
                          </section>

                          {/* Rituals Section */}
                          <section>
                              <div className="flex items-center gap-4 mb-8">
                                  <div className="h-[1px] flex-1 bg-black/5" />
                                  <h4 className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/30">By Ritual</h4>
                                  <div className="h-[1px] w-8 bg-black/5" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                  <RitualCard 
                                      label="ALL" 
                                      active={selectedRitual === 'ALL'} 
                                      onClick={() => setSelectedRitual('ALL')} 
                                  />
                                  {rituals.map(rit => (
                                      <RitualCard 
                                          key={rit}
                                          label={rit}
                                          active={selectedRitual === rit}
                                          onClick={() => setSelectedRitual(rit)}
                                      />
                                  ))}
                              </div>
                          </section>

                          {/* Action Button */}
                          <button 
                              onClick={() => setShowFilters(false)}
                              className="w-full bg-black text-white py-6 rounded-2xl font-mona text-[10px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all flex items-center justify-center gap-4 mt-6 overflow-hidden relative group"
                          >
                              <span className="relative z-10">Show {filtered.length} Items</span>
                              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          </button>
                      </div>
                  </motion.div>
              </>
          )}
      </AnimatePresence>

      {/* Product Display */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
        <motion.div 
            layout
            className={viewMode === 'grid' 
                ? "grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-12" 
                : "flex flex-col gap-6"
            }
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
                <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-black/[0.03] hover:border-black/10 transition-all duration-500 shadow-sm hover:shadow-xl ${viewMode === 'list' ? 'flex flex-col md:flex-row h-auto md:h-64' : ''}`}
                >
                    {/* Image Area */}
                    <div 
                        className={`relative overflow-hidden bg-black/5 cursor-pointer ${viewMode === 'list' ? 'w-full md:w-64 flex-shrink-0 h-48 md:h-full' : 'aspect-[4/5]'}`}
                        onClick={() => onQuickView(product)}
                    >
                        <img 
                            src={product.image || (product.images && product.images[0])} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                            <span className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[8px] font-black tracking-widest uppercase">
                                Quick View
                            </span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 md:p-8 flex flex-col justify-between flex-1">
                        <div>
                            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-1 md:gap-4 mb-2">
                                <span className="font-mona text-[8px] md:text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">
                                    {product.category}
                                </span>
                                <span className="font-poppins text-[10px] md:text-xs font-bold text-black opacity-60">
                                    ₦{(product.price || 0).toLocaleString()}
                                </span>
                            </div>
                            <h3 
                                className={`font-mona font-black text-black tracking-tight leading-tight group-hover:text-black/60 transition-colors cursor-pointer ${viewMode === 'list' ? 'text-xl md:text-3xl' : 'text-sm md:text-xl'}`}
                                onClick={() => onQuickView(product)}
                            >
                                {product.name}
                            </h3>
                            {viewMode === 'list' && (
                                <p className="font-poppins text-sm text-black/40 mt-3 line-clamp-2 max-w-xl">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={() => onQuickView(product)}
                            className="w-full mt-6 py-4 bg-black text-white font-mona text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-neutral-800 transition-all shadow-sm flex items-center justify-center gap-2 group/btn"
                        >
                            View Details
                            <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-40">
            <ShoppingBag size={40} className="mx-auto text-black/5 mb-6" />
            <p className="font-mona text-2xl font-black text-black/10 uppercase tracking-[0.3em]">
              Empty Archives
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Components ───────────────────────────────────────────────────────────────

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-between py-6 border-b border-black/[0.03] transition-all group ${active ? 'pl-4 pr-2 bg-black/5' : 'hover:pl-4'}`}
        >
            <span className={`font-mona text-xs font-black tracking-widest uppercase transition-colors ${active ? 'text-black' : 'text-black/30 group-hover:text-black/60'}`}>
                {label}
            </span>
            {active && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
        </button>
    );
}

function RitualCard({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${active ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-black/5 text-black/40 hover:border-black/20 hover:shadow-md'}`}
        >
            <span className="font-mona text-[10px] font-black tracking-[0.2em] uppercase">
                {label}
            </span>
        </button>
    );
}

