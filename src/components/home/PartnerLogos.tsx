import { GraduationCap, ShieldCheck, Library, BookOpen, Globe } from 'lucide-react';

const PARTNERS = [
  { icon: GraduationCap, label: 'BOOKSTORE' },
  { icon: ShieldCheck, label: 'BOOKDOOR' },
  { icon: Library, label: 'LIBRARY' },
  { icon: BookOpen, label: 'BOOKISH' },
  { icon: Globe, label: 'FLAPRISE' },
];

const PartnerLogos = () => {
  return (
    <section className="bg-[#eeebe4] py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 items-center justify-items-center">
          {PARTNERS.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col items-center gap-4 group cursor-default transition-all duration-300 last:col-span-2 md:last:col-span-1"
              >
                <Icon 
                  size={32} 
                  strokeWidth={1.5}
                  className="text-black/25 group-hover:text-black/70 transition-colors duration-300" 
                />
                <span className="font-poppins text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 group-hover:text-black/70 transition-colors duration-300">
                  {partner.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;
