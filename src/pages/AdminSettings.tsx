import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { getSiteSettings, updateSiteSettings } from '../firebase/helpers';
import toast from 'react-hot-toast';
import { Save, Settings2 } from 'lucide-react';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    manifesto: '',
    hero_headline: '',
    hero_tagline: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await getSiteSettings();
    if (res.success && res.settings) {
      setSettings({
        manifesto: res.settings.manifesto || '',
        hero_headline: res.settings.hero_headline || '',
        hero_tagline: res.settings.hero_tagline || ''
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSiteSettings(settings);
    if (res.success) {
      toast.success('Identity updated successfully');
    } else {
      toast.error('Failed to update identity');
    }
    setSaving(false);
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-2 h-2 rounded-full bg-black animate-bounce mr-1" />
        <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s] mr-1" />
        <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-mona text-4xl font-black text-black uppercase tracking-tighter">Site Identity</h1>
            <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em] mt-2">Manage the core messaging of your boutique</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-mona text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-xl shadow-black/10"
          >
            {saving ? 'SAVING...' : <><Save size={14} /> SAVE IDENTITY</>}
          </button>
        </div>

        <div className="space-y-10">
          {/* Section: Hero branding */}
          <section className="bg-white p-12 rounded-[2.5rem] border border-black/5 space-y-10">
            <div className="flex items-center gap-4">
              <Settings2 size={18} className="text-black/20" />
              <h3 className="font-mona text-xs font-black uppercase tracking-widest text-black/80">Hero Presentation</h3>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Main Headline</label>
                <input 
                  type="text"
                  value={settings.hero_headline}
                  onChange={e => setSettings({...settings, hero_headline: e.target.value})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-serif text-2xl focus:border-black outline-none transition-all italic"
                  placeholder="CURATED FOR LIFE"
                />
              </div>

              <div className="space-y-4">
                <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Support Tagline</label>
                <input 
                  type="text"
                  value={settings.hero_tagline}
                  onChange={e => setSettings({...settings, hero_tagline: e.target.value})}
                  className="w-full bg-transparent border-b border-black/10 py-4 font-poppins text-lg focus:border-black outline-none transition-all"
                  placeholder="Thoughtful goods for inspired living."
                />
              </div>
            </div>
          </section>

          {/* Section: Philosophy */}
          <section className="bg-white p-12 rounded-[2.5rem] border border-black/5 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <h3 className="font-mona text-xs font-black uppercase tracking-widest text-black/80">The Manifesto</h3>
            </div>
            
            <div className="space-y-4">
              <label className="font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Core Philosophy Statement</label>
              <textarea 
                rows={4}
                value={settings.manifesto}
                onChange={e => setSettings({...settings, manifesto: e.target.value})}
                className="w-full bg-transparent border-b border-black/10 py-4 font-serif text-xl focus:border-black outline-none transition-all resize-none italic"
                placeholder="We only stock what we love..."
              />
              <p className="font-poppins text-[9px] text-black/20 uppercase tracking-widest leading-relaxed">
                This text appears in the center of your homepage. Keep it short, bold, and meaningful.
              </p>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
