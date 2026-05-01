import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const POLICIES = {
  shipping: {
    title: 'Delivery Policy',
    content: [
      {
        h: 'Fulfillment Time',
        p: 'Each artifact in our collection is curated with care. Orders are typically processed within 1-2 business days.'
      },
      {
        h: 'Domestic Delivery (Nigeria)',
        p: 'Standard shipping takes 3-5 business days. Premium Courier service takes 1-2 business days within Lagos and 2-3 days for other states.'
      },
      {
        h: 'International Shipping',
        p: 'We ship worldwide via DHL. Delivery times vary between 5-10 business days depending on the destination.'
      }
    ]
  },
  returns: {
    title: 'Refund & Returns',
    content: [
      {
        h: 'Exchange Policy',
        p: 'We want you to be delighted with your selection. If the fit isn’t perfect, we offer exchanges within 7 days of delivery.'
      },
      {
        h: 'Conditions',
        p: 'Artifacts must be returned in their original condition, unworn, unwashed, and with all tags attached in original curation.'
      },
      {
        h: 'Refunds',
        p: 'Due to the curated nature of our boutique, we primarily offer store credit or exchanges. Monetary refunds are considered on a case-by-case basis for defective items.'
      }
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    content: [
      {
        h: 'How do I track my order?',
        p: 'Once your order is dispatched, we will send a tracking link to your registered email and WhatsApp.'
      },
      {
        h: 'Can I change my order?',
        p: 'Modifications can be made within 2 hours of purchase. Please contact us via WhatsApp immediately.'
      },
      {
        h: 'Do you offer bulk orders?',
        p: 'Yes, we specialize in curated gifts for events and corporate branding. Reach out via our Contact page for a custom quote.'
      }
    ]
  }
};

const InfoPage = () => {
  const { pathname } = useLocation();
  const path = pathname.replace('/', '') as keyof typeof POLICIES;
  const policy = POLICIES[path] || POLICIES.faq;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className="bg-[#f3f2ee] min-h-screen pt-40 pb-32 px-8">
      <div className="max-w-[800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-20"
        >
          <div className="text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-6xl font-black text-black italic tracking-tighter mb-4">
              {policy.title}
            </h1>
            <div className="w-12 h-px bg-black/10" />
          </div>

          <div className="space-y-16">
            {policy.content.map((item, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="font-mona text-[10px] font-black uppercase tracking-[0.4em] text-black/30">
                  {item.h}
                </h3>
                <p className="font-poppins text-lg text-black/60 leading-relaxed">
                  {item.p}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-20 border-t border-black/5 text-center">
            <p className="font-poppins text-xs text-black/40 italic">
              Need more clarity? <a href="/contact" className="text-black underline underline-offset-4 font-bold not-italic">Message our curator</a>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default InfoPage;
