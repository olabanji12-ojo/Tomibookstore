import { motion } from 'framer-motion';
import type { Book } from '../../types';
import { books } from '../../data/books';

interface FeaturedBooksProps {
  onAddToCart: (book: Book) => void;
  onQuickView: (book: Book) => void;
}

const FeaturedBooks = ({ onAddToCart, onQuickView }: FeaturedBooksProps) => {
  return (
    <section className="py-24 bg-[#f3f2ee]">
      <div className="max-w-[800px] mx-auto px-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <p className="font-poppins text-[10px] font-bold tracking-[0.3em] uppercase text-black/35 mb-2">
            The Curated Selection
          </p>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-[1px] bg-black/10 top-1/2 -translate-y-1/2" />
            <h2 className="font-mona text-3xl md:text-4xl font-black text-black relative bg-[#f3f2ee] px-10">
              Featured Titles
            </h2>
          </div>
        </div>

        {/* Books Grid - Centered 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-24">
          {books.map((book) => (
            <div key={book.id} className="group cursor-pointer">
              
              {/* Image Frame/Container */}
              <div 
                onClick={() => onQuickView(book)}
                className="aspect-[4/5] bg-white/40 flex items-center justify-center p-8 mb-6 relative overflow-hidden transition-all duration-500 hover:shadow-xl"
              >
                
                {/* Book Cover */}
                <motion.img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px]"
                />

                {/* Add to Cart Overlay Button - Explicit Addition */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening modal
                    onAddToCart(book);
                  }}
                  className="absolute bottom-10 left-0 w-full h-12 bg-black text-white 
                             font-poppins text-[10px] font-bold tracking-[0.2em] uppercase
                             opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                             transition-all duration-500 ease-out z-10 cursor-pointer"
                >
                  Add To Cart
                </button>
              </div>

              {/* Book Info */}
              <div className="text-center">
                <h3 
                  onClick={() => onQuickView(book)}
                  className="font-mona text-sm font-bold text-black mb-1 hover:text-black/60 transition-colors duration-300 cursor-pointer"
                >
                  {book.title}
                </h3>
                <p className="font-poppins text-[10px] tracking-[0.1em] text-black/40 uppercase mb-2">
                  {book.author}
                </p>
                <p className="font-poppins text-xs font-bold text-black/80">
                  ₦{book.price.toLocaleString()}
                </p>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
