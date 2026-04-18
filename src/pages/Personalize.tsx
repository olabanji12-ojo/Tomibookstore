import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, User, DollarSign, ChevronDown, ChevronUp, Clock, CloudUpload, Gift, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { submitPersonalizationRequest, uploadProductImages } from '../firebase/helpers';

type Form = {
  productType: string;
  description: string;
  occasion: string;
  quantity: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type OpenSection = 'design' | 'logistics' | 'contact' | '';

// --- Pure UI Custom Accordion ---
interface AccordionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  number: string;
}

const Accordion = ({ title, icon, children, isOpen, onToggle, number }: AccordionProps) => (
  <div className="border border-black/[0.06] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-500 hover:border-black/10">
    <button
      type="button"
      onClick={onToggle}
      className="flex justify-between items-center w-full p-8 text-left focus:outline-none hover:bg-black/[0.01] transition-colors"
    >
      <div className="flex items-center gap-5">
        <span className="font-mona text-[10px] font-black text-black/20 tracking-widest">{number}</span>
        <div className="text-black/60">{icon}</div>
        <h3 className="font-mona text-sm tracking-[0.2em] uppercase font-black text-black">
          {title}
        </h3>
      </div>
      {isOpen ? <ChevronUp size={18} className="text-black/30" /> : <ChevronDown size={18} className="text-black/30" />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="px-8 pb-10 pt-2 border-t border-black/[0.03] space-y-8">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function Personalize() {
  const [form, setForm] = useState<Form>({
    productType: '',
    description: '',
    occasion: '',
    quantity: '',
    budget: '',
    timeline: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [openSection, setOpenSection] = useState<OpenSection>('design');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles].slice(0, 5)); // Limit to 5
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.productType || !form.description || !form.name || !form.email || !form.phone) {
      toast.error('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    const loadingToastId = toast.loading('Sending your vision to our team...');

    try {
      let imageUrls: string[] = [];
      if (files.length > 0) {
        const uploadRes = await uploadProductImages(files);
        if (uploadRes.success) imageUrls = uploadRes.urls;
      }

      await submitPersonalizationRequest({
        ...form,
        referenceImages: imageUrls,
        updatedAt: new Date()
      });

      toast.dismiss(loadingToastId);
      toast.success('Vision received. We will contact you soon.');
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-[#f3f2ee] pt-40 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <Gift size={32} strokeWidth={1.5} />
          </div>
          <h2 className="font-mona text-4xl md:text-5xl font-black tracking-tight text-black mb-8">
            VISION RECEIVED
          </h2>
          <p className="font-poppins text-black/50 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
            Thank you for trusting us with your custom project. Our design team will review your request and get back to you with a boutique quote within 24 hours.
          </p>
          <button
            onClick={() => setDone(false)}
            className="group flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-mona text-[10px] font-black tracking-[0.3em] uppercase hover:scale-105 transition-all mx-auto shadow-xl"
          >
            START NEW REQUEST
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ee] pb-32">
      {/* Hero */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-[1400px] mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block py-2 px-4 bg-black/5 rounded-full mb-8"
            >
                <span className="font-mona text-[10px] font-black tracking-[0.3em] uppercase text-black/40">
                    Bespoke Creations
                </span>
            </motion.div>
          <h1 className="font-mona text-5xl md:text-8xl font-black tracking-tighter text-black mb-8 leading-[0.9]">
            THE CONCIERGE <br /> PORTAL
          </h1>
          <p className="font-poppins text-lg md:text-xl text-black/40 max-w-3xl mx-auto leading-relaxed">
            Collaborate with our designers to bring your unique lifestyle visions to life. From custom hampers to personalized fashion pieces, we specialize in the intentional.
          </p>
        </div>
      </section>

      {/* Form Area */}
      <section className="px-8 flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4">
          
          <Accordion 
            number="01"
            title="Design & Item Details" 
            icon={<Layers size={18} />}
            isOpen={openSection === 'design'}
            onToggle={() => setOpenSection(openSection === 'design' ? '' : 'design')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Type of Item *</label>
                    <select
                        name="productType"
                        value={form.productType}
                        onChange={handleChange}
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Select Category</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="accessory">Lifestyle Accessories</option>
                        <option value="home">Home & Decor</option>
                        <option value="gift">Curated Gift Sets</option>
                        <option value="packaging">Boutique Packaging</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Occasion</label>
                    <input
                        name="occasion"
                        value={form.occasion}
                        onChange={handleChange}
                        placeholder="e.g. Wedding, Launch"
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Your Vision *</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe materials, colors, and your desired outcome..."
                    className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all resize-none"
                />
            </div>
          </Accordion>

          <Accordion 
            number="02"
            title="Logistics & Budget" 
            icon={<DollarSign size={18} />}
            isOpen={openSection === 'logistics'}
            onToggle={() => setOpenSection(openSection === 'logistics' ? '' : 'logistics')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Quantity</label>
                    <input
                        name="quantity"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={form.quantity}
                        onChange={handleChange}
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-4 py-4 font-poppins text-sm focus:bg-white outline-none transition-all"
                    />
                </div>
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Budget (₦)</label>
                    <input
                        name="budget"
                        type="number"
                        placeholder="50,000"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-4 py-4 font-poppins text-sm focus:bg-white outline-none transition-all"
                    />
                </div>
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Target Date</label>
                    <input
                        name="timeline"
                        type="date"
                        value={form.timeline}
                        onChange={handleChange}
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-4 py-4 font-poppins text-sm focus:bg-white outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Reference Moodboard</label>
                <div className="relative">
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFiles}
                        className="hidden"
                    />
                    <label 
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-2xl p-10 bg-white/30 cursor-pointer hover:bg-white/50 hover:border-black/20 transition-all group"
                    >
                        <CloudUpload size={24} className="text-black/20 group-hover:text-black/40 transition-colors mb-3" />
                        <span className="font-mona text-[10px] font-black uppercase tracking-widest text-black/40 group-hover:text-black/60 transition-colors">
                            {files.length > 0 ? `${files.length} Images Selected` : 'Click to upload references'}
                        </span>
                    </label>
                </div>
                {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((f, i) => (
                            <span key={i} className="bg-black/5 px-3 py-1 rounded-full font-poppins text-[10px] text-black/40 uppercase">
                                {f.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
          </Accordion>

          <Accordion 
            number="03"
            title="Contact Information" 
            icon={<User size={18} />}
            isOpen={openSection === 'contact'}
            onToggle={() => setOpenSection(openSection === 'contact' ? '' : 'contact')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Full Name *</label>
                    <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all"
                    />
                </div>
                <div className="space-y-3">
                    <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Email Address *</label>
                    <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all"
                    />
                </div>
            </div>
            <div className="space-y-3">
                <label className="font-mona text-[10px] font-black text-black/30 tracking-widest uppercase ml-1">Phone Number *</label>
                <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                    className="w-full bg-[#f3f2ee]/50 border border-black/5 rounded-xl px-5 py-4 font-poppins text-sm focus:bg-white focus:border-black outline-none transition-all"
                />
            </div>
          </Accordion>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-6 rounded-2xl font-mona text-[12px] font-black tracking-[0.4em] uppercase hover:bg-black/90 transition-all disabled:opacity-30 mt-12 shadow-2xl flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Clock size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                FINALIZE & SEND VISION
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
