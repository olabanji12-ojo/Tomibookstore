import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, registerAdmin } from '../firebase/helpers';
import toast from 'react-hot-toast';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill all fields');
    
    setLoading(true);
    const result = isLogin 
      ? await loginAdmin(email, password)
      : await registerAdmin(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(isLogin ? 'Welcome back.' : 'Account secured.');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ee] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-white p-10 md:p-14 shadow-2xl shadow-black/[0.03] rounded-[2rem] border border-black/5"
      >
        <div className="text-center mb-12">
          <h1 className="font-mona text-[10px] font-black uppercase tracking-[0.5em] text-black/30 mb-4">
            Boutique Operations
          </h1>
          <h2 className="font-mona text-3xl font-black text-black uppercase tracking-tighter">
            {isLogin ? 'Authenticating' : 'Registration'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 block ml-1">
              Admin Identity
            </label>
            <input 
              type="email"
              placeholder="email@goodthingsco.online"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/[0.02] border-b border-black/5 py-4 px-1 font-poppins text-sm focus:border-black outline-none transition-all placeholder:text-black/10"
            />
          </div>

          <div className="space-y-2">
            <label className="font-poppins text-[9px] font-bold uppercase tracking-[0.3em] text-black/30 block ml-1">
              Secret Key
            </label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/[0.02] border-b border-black/5 py-4 px-1 font-poppins text-sm focus:border-black outline-none transition-all placeholder:text-black/10"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-black text-white font-mona text-[10px] font-black uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Unlock Dashboard' : 'Create Admin Access'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="font-poppins text-[10px] text-black/40 hover:text-black transition-colors uppercase tracking-widest font-bold"
          >
            {isLogin ? "Don't have access? Register" : "Already have access? Login"}
          </button>
        </div>
      </motion.div>
      
      <p className="mt-10 font-poppins text-[10px] text-black/20 uppercase tracking-[0.2em] font-bold">
        Good Things Co. • Selective Operations
      </p>
    </div>
  );
};

export default AdminAuth;
