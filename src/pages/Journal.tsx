import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter } from 'lucide-react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Product } from '../types';

type Post = {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  category: string;
  createdAt?: any;
};

const JournalCard = ({ post }: { post: Post }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.5 }}
    className="group bg-white rounded-3xl overflow-hidden border border-black/[0.03] hover:border-black/10 transition-all duration-500 shadow-sm hover:shadow-xl"
  >
    <Link to={`/journal/${post.slug}`} className="block">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        <div className="absolute top-6 left-6">
          <span className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6 md:p-10">
        <h3 className="font-mona text-xl md:text-3xl font-black text-black mb-3 md:mb-4 leading-tight group-hover:text-black/60 transition-colors">
          {post.title}
        </h3>
        <p className="font-poppins text-black/40 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center gap-3 font-mona text-[9px] md:text-[10px] font-black tracking-[0.2em] uppercase text-black group-hover:gap-5 transition-all">
          READ STORY <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  </motion.article>
);

export default function Journal() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [books, setBooks] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<'ALL' | string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Blog Posts
        const qPosts = query(
          collection(db, 'gallery_posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapPosts = await getDocs(qPosts);
        const dataPosts = snapPosts.docs.map((d) => ({ id: d.id, ...d.data() } as Post));
        setPosts(dataPosts);

        // Fetch Books from Products
        const qBooks = query(
          collection(db, 'products'),
          where('category', '==', 'books'),
          orderBy('createdAt', 'desc')
        );
        const snapBooks = await getDocs(qBooks);
        const dataBooks = snapBooks.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                ...data,
                image: data.image || (data.images && data.images[0]) || 'https://via.placeholder.com/400x500?text=No+Image'
            } as Product;
        });
        setBooks(dataBooks);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['ALL', ...Array.from(new Set(posts.map((p) => p.category.toUpperCase())))];

  const filteredPosts = activeCat === 'ALL' 
    ? posts 
    : posts.filter((p) => p.category.toUpperCase() === activeCat);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center bg-[#f3f2ee]">
        <div className="w-12 h-12 border-2 border-black/10 border-t-black rounded-full animate-spin mb-6" />
        <p className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/40">
          CURATING STORIES...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f2ee] min-h-screen">
      {/* Editorial Header */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block py-2 px-4 bg-black/5 rounded-full mb-6 md:mb-8"
            >
                <span className="font-mona text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-black/40">
                    Read
                </span>
            </motion.div>
          <h1 className="font-mona text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-black mb-8 md:mb-10 leading-[0.9] md:leading-[0.85]">
            READ
          </h1>
          <p className="font-poppins text-base md:text-xl text-black/40 max-w-2xl mx-auto leading-relaxed px-4">
            A visual anthology of curated spaces, sustainable fashion, and the stories behind the good things we create.
          </p>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 mb-24 md:mb-32">
        <div className="flex items-center gap-4 mb-12">
            <h2 className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/30">Featured Works</h2>
            <div className="h-[1px] flex-1 bg-black/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {books.map((book) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 flex flex-col md:flex-row gap-8 md:gap-12 group hover:shadow-2xl transition-all duration-700"
            >
              {/* Vertical Book Frame */}
              <div className="w-full md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative shrink-0">
                <img 
                  src={book.image} 
                  alt={book.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-black/5" />
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="font-mona text-[9px] font-black tracking-[0.3em] uppercase text-black/20 mb-4 block">
                  {book.author || 'Published Work'}
                </span>
                <h3 className="font-mona text-3xl md:text-4xl font-black text-black mb-6 tracking-tight leading-none group-hover:text-black/60 transition-colors">
                  {book.name}
                </h3>
                <p className="font-poppins text-black/40 text-sm leading-relaxed mb-8 line-clamp-4">
                  {book.description}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                    <p className="font-mona text-xl font-black text-black">₦{book.price.toLocaleString()}</p>
                    <Link 
                      to={`/product/${book.slug}`}
                      className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full font-mona text-[10px] font-black tracking-[0.2em] uppercase hover:bg-neutral-800 transition-all"
                    >
                      ADD TO LIFE
                    </Link>
                </div>
              </div>
            </motion.div>
          ))}
          
          {books.length === 0 && !loading && (
             <div className="col-span-full py-20 border-2 border-dashed border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <p className="font-mona text-[10px] font-black text-black/20 uppercase tracking-widest">No books currently featured.</p>
             </div>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[70px] md:top-[85px] z-40 bg-[#f3f2ee]/80 backdrop-blur-xl border-y border-black/[0.03] py-4 md:py-6 px-4 md:px-8 mb-12 md:mb-20">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-10">
          <div className="flex items-center gap-3 mr-4 hidden md:flex">
            <Filter size={14} className="text-black/30" />
            <span className="font-mona text-[10px] font-black tracking-widest text-black/30 uppercase">Filter Stories</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`font-mona text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all relative py-2 ${
                activeCat === cat ? 'text-black' : 'text-black/30 hover:text-black/60'
              }`}
            >
              {cat}
              {activeCat === cat && (
                <motion.div 
                    layoutId="underline" 
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black" 
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Narrative Grid */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <JournalCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-40">
            <p className="font-mona text-2xl font-black text-black/20 uppercase tracking-widest">
              No entries found.
            </p>
          </div>
        )}
      </section>

      {/* Custom Request CTA */}
      <section className="bg-black py-24 md:py-40 px-6 md:px-8 text-center text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-mona text-3xl md:text-7xl font-black tracking-tight mb-6 md:mb-8 leading-tight">
            BECOME PART OF <br /> THE STORY
          </h2>
          <p className="font-poppins text-white/50 text-base md:text-lg mb-10 md:mb-12 max-w-2xl mx-auto italic">
            "We don't just sell products; we create the artifacts of your life."
          </p>
          <Link
            to="/personalize"
            className="inline-flex items-center gap-3 md:gap-4 bg-white text-black px-8 md:px-12 py-4 md:py-6 rounded-full font-mona text-[10px] md:text-[12px] font-black tracking-[0.2em] md:tracking-[0.4em] uppercase hover:scale-105 transition-all shadow-2xl"
          >
            START A PROJECT <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mona text-[20vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
          GOOD THINGS CO
        </div>
      </section>
    </div>
  );
}
