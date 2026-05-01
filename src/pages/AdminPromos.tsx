import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Power, Users, Clock } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getPromoSettings, updatePromoSettings } from '../firebase/helpers';
import toast from 'react-hot-toast';

const AdminPromos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [promo, setPromo] = useState({
    code: '',
    maxClaims: 10,
    currentClaims: 0,
    isActive: true,
    text: '',
    timerEnd: ''
  });

  useEffect(() => {
    fetchPromo();
  }, []);

  const fetchPromo = async () => {
    const res = await getPromoSettings();
    if (res.success && res.promo) {
      setPromo({
        ...res.promo as any,
        timerEnd: res.promo.timerEnd ? new Date(res.promo.timerEnd.seconds * 1000).toISOString().slice(0, 16) : ''
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...promo,
        maxClaims: Number(promo.maxClaims),
        timerEnd: promo.timerEnd ? new Date(promo.timerEnd) : null
      };
      const res = await updatePromoSettings(payload);
      if (res.success) {
        toast.success('Promotion Studio updated!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-black/30 hover:text-black mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mona text-[10px] font-black uppercase tracking-widest">Back to Studio</span>
        </button>

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-mona text-4xl font-black text-black uppercase tracking-tighter">Promotion Studio</h1>
            <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em] mt-2">Engine of urgency and exclusivity</p>
          </div>
          
          <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border transition-all ${promo.isActive ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
            <Power size={14} />
            <span className="font-mona text-[10px] font-black uppercase tracking-widest">{promo.isActive ? 'Active' : 'Disabled'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Promo Code */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-black/5 space-y-8">
              <div className="flex items-center gap-3 text-black/20">
                <Sparkles size={18} />
                <h3 className="font-mona text-[10px] font-black uppercase tracking-widest">Incentive</h3>
              </div>
              
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Promo Code</label>
                <input 
                  type="text"
                  value={promo.code}
                  onChange={e => setPromo({...promo, code: e.target.value.toUpperCase()})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-mona text-2xl font-black focus:border-black outline-none transition-all uppercase tracking-tighter"
                  placeholder="WELCOME15"
                />
              </div>

              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Display Text</label>
                <textarea 
                  rows={2}
                  value={promo.text}
                  onChange={e => setPromo({...promo, text: e.target.value})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all resize-none"
                  placeholder="Join the curated list..."
                />
              </div>
            </section>

            {/* Claims & Limit */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-black/5 space-y-8">
              <div className="flex items-center gap-3 text-black/20">
                <Users size={18} />
                <h3 className="font-mona text-[10px] font-black uppercase tracking-widest">Exclusivity</h3>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Max Claims</label>
                  <input 
                    type="number"
                    value={promo.maxClaims}
                    onChange={e => setPromo({...promo, maxClaims: Number(e.target.value)})}
                    className="w-full bg-transparent border-b border-black/10 py-4 font-mona text-2xl font-black focus:border-black outline-none transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Used</label>
                  <div className="py-4 font-mona text-2xl font-black text-black/20">
                    {promo.currentClaims}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Active Status</label>
                <div 
                  onClick={() => setPromo({...promo, isActive: !promo.isActive})}
                  className={`w-full h-14 rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all border
                             ${promo.isActive ? 'bg-black text-white border-black' : 'bg-transparent text-black/30 border-black/10 hover:border-black'}`}
                >
                  <Power size={14} />
                  <span className="font-mona text-[10px] font-black uppercase tracking-widest">{promo.isActive ? 'Disable Offer' : 'Enable Offer'}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="bg-white p-10 rounded-[2.5rem] border border-black/5">
             <div className="flex items-center gap-3 text-black/20 mb-8">
                <Clock size={18} />
                <h3 className="font-mona text-[10px] font-black uppercase tracking-widest">Time Pressure (Optional)</h3>
              </div>
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Offer Expiry Date & Time</label>
                <input 
                  type="datetime-local"
                  value={promo.timerEnd}
                  onChange={e => setPromo({...promo, timerEnd: e.target.value})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-sm focus:border-black outline-none transition-all"
                />
              </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-20 bg-black text-white font-mona text-sm font-black uppercase tracking-[0.5em] rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl shadow-black/20"
          >
            {saving ? 'Synchronizing...' : (
              <>
                <Save size={18} />
                Save Promotion Settings
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPromos;
