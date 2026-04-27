import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Star } from 'lucide-react';

const TRUST_REASONS = [
  {
    icon: Truck,
    title: 'Express Delivery',
    description: 'Carefully packaged and delivered\nwithin 48 hours across Lagos.'
  },
  {
    icon: ShieldCheck,
    title: 'Hand-picked Quality',
    description: 'Every piece is vetted by our curator\nfor authenticity and feel.'
  },
  {
    icon: Star,
    title: 'Secure Checkout',
    description: 'Safe and seamless transactions\nvia Paystack integration.'
  }
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-white border-t border-black/[0.03]">
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center md:text-left">
          {TRUST_REASONS.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-[#f3f2ee] flex items-center justify-center shrink-0">
                <item.icon size={20} strokeWidth={1} className="text-black/60" />
              </div>
              <div className="space-y-2">
                <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.3em] text-black">
                  {item.title}
                </h3>
                <p className="font-poppins text-[13px] text-black/40 leading-relaxed font-light whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
