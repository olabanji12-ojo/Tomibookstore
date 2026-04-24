import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List, ShoppingBag, ArrowRight, Filter, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import MetaTags from '../components/shared/MetaTags';
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
  const [sortBy, setSortBy] = useState('NEWEST');
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

  const filteredAndSorted = products
    .filter(p => {
      const name = p.name || 'Untitled Product';
      const category = p.category || 'Uncategorized';
      
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCat === 'ALL' || category.toUpperCase() === selectedCat;
      const matchesRitual = selectedRitual === 'ALL' || (p.functions || []).some(f => f.toUpperCase() === selectedRitual);
      return matchesSearch && matchesCat && matchesRitual;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.price - b.price;
      if (sortBy === 'PRICE_HIGH') return b.price - a.price;
      if (sortBy === 'NEWEST') {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      }
      return 0;
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
      <MetaTags 
        title="Curated Collection" 
        description="Explore our archive of curated fashion, home decor, and lifestyle pieces."
      />
      {/* Header */}
      <section className="pt-24 pb-12 px-4 md:px-8 border-b border-black/[0.03]">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block py-2 px-4 bg-black/5 rounded-full mb-6"
          >
            <span className="font-mona text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black/40">
              The Archives
            </span>
          </motion.div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-9xl font-black tracking-tighter text-black mb-6 leading-[0.9] md:leading-[0.85]">
            CURATED <br className="md:hidden" /> COLLECTION
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-[70px] md:top-[95px] z-40 bg-[#f3f2ee]/80 backdrop-blur-xl border-b border-black/[0.03] py-4 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-row items-center justify-between gap-4 md:gap-6">
          
          {/* Left: Refine Toggle */}
          <div className="flex items-center gap-4 md:gap-8">
            <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 md:gap-3 font-mona text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black/60 hover:text-black transition-colors"
            >
                <Filter size={12} />
                <span className="hidden xs:inline">Refine</span>
            </button>
            <div className="h-4 w-[1px] bg-black/10 hidden sm:block" />
            <span className="font-mona text-[9px] font-black tracking-widest text-black/20 uppercase hidden lg:inline">
              {filteredAndSorted.length} Items
            </span>
          </div>

          {/* Center: Search */}
          <div className="relative group flex-1 max-w-[200px] md:max-w-md mx-2 md:mx-4">
              <Search size={12} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/5 border border-transparent focus:bg-white focus:border-black/10 rounded-full py-2 md:py-2.5 pl-8 md:pl-10 pr-4 md:pr-6 font-poppins text-[10px] md:text-xs outline-none transition-all w-full"
              />
          </div>

          {/* Right: View Toggles */}
          <div className="flex items-center gap-1 md:gap-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 md:p-2 transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-black/15 hover:text-black/40'}`}
              >
                  <LayoutGrid className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 md:p-2 transition-colors ${viewMode === 'list' ? 'text-black' : 'text-black/15 hover:text-black/40'}`}
              >
                  <List className="w-4 h-4 md:w-[18px] md:h-[18px]" />
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
                           {/* Sort Section */}
                           <section>
                               <div className="flex items-center gap-4 mb-8">
                                   <div className="h-[1px] flex-1 bg-black/5" />
                                   <h4 className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/30">Sort By</h4>
                                   <div className="h-[1px] w-8 bg-black/5" />
                               </div>
                               <div className="grid grid-cols-1 gap-1">
                                   <FilterTab label="Newest Arrivals" active={sortBy === 'NEWEST'} onClick={() => setSortBy('NEWEST')} />
                                   <FilterTab label="Price: Low to High" active={sortBy === 'PRICE_LOW'} onClick={() => setSortBy('PRICE_LOW')} />
                                   <FilterTab label="Price: High to Low" active={sortBy === 'PRICE_HIGH'} onClick={() => setSortBy('PRICE_HIGH')} />
                               </div>
                           </section>
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
                              <span className="relative z-10">Show {filteredAndSorted.length} Items</span>
                              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          </button>
                      </div>
                  </motion.div>
              </>
          )}
      </AnimatePresence>

      {/* Product Display */}
      <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <motion.div 
            layout
            className={viewMode === 'grid' 
                ? "w-full grid grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-8 sm:gap-4 md:gap-6 lg:gap-8" 
                : "w-full flex flex-col gap-8 md:gap-16"
            }
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.map((product) => (
                <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`w-full group transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col md:flex-row h-auto md:h-80 border-b border-black/5 pb-12' : ''}`}
                >
                    {/* Image Area */}
                    <div 
                        className={`w-full relative overflow-hidden bg-white cursor-pointer ${viewMode === 'list' ? 'md:w-80 flex-shrink-0 h-48 md:h-full' : 'aspect-[3/4]'}`}
                        onClick={() => onQuickView(product)}
                    >
                        <img 
                            src={product.image || (product.images && product.images[0])} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                    </div>

                    {/* Content Area */}
                    <div className={`flex flex-col justify-between flex-1 ${viewMode === 'list' ? 'p-6 md:p-12' : 'pt-4 pb-2 md:pt-8'}`}>
                        <div>
                            <div className="flex justify-between items-center mb-1 md:mb-3">
                                <span className="font-sans text-[7px] md:text-[10px] font-bold text-black/30 uppercase tracking-[0.1em] md:tracking-[0.2em]">
                                    {product.category}
                                </span>
                                <span className="font-sans text-[8px] md:text-[11px] font-black text-black">
                                    ₦{(product.price || 0).toLocaleString()}
                                </span>
                            </div>
                            <h3 
                                className={`font-display font-bold text-black tracking-tight leading-tight group-hover:text-black/60 transition-colors cursor-pointer ${viewMode === 'list' ? 'text-2xl md:text-5xl' : 'text-[11px] md:text-2xl'}`}
                                onClick={() => onQuickView(product)}
                            >
                                {product.name}
                            </h3>
                            {viewMode === 'list' && (
                                <p className="font-sans text-[13px] md:text-[14px] text-black/50 mt-4 md:mt-8 line-clamp-2 md:line-clamp-3 max-w-2xl leading-relaxed">
                                    {product.description}
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={() => onQuickView(product)}
                            className="w-full mt-6 md:mt-12 py-3.5 md:py-5 bg-black text-white font-sans text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 md:gap-3 group/btn shadow-xl"
                        >
                            View Details
                            <ArrowRight className="w-3 h-3 md:w-[12px] md:h-[12px] group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAndSorted.length === 0 && (
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

