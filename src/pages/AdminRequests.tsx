import { useState, useEffect } from 'react';
import { Layers, Clock, Mail, Phone, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { getPersonalizationRequests } from '../firebase/helpers';
import type { PersonalizationRequest } from '../types';

const AdminRequests = () => {
  const [requests, setRequests] = useState<PersonalizationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const result = await getPersonalizationRequests();
    if (result.success) {
      setRequests(result.requests || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-400';
      case 'In Progress': return 'bg-orange-400';
      case 'Completed': return 'bg-green-400';
      default: return 'bg-black/10';
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="font-mona text-3xl md:text-4xl font-black text-black uppercase tracking-tighter">Concierge</h1>
          <p className="font-poppins text-[10px] text-black/30 font-bold uppercase tracking-[0.2em]">Personalization Requests</p>
        </div>
        
        <div className="bg-white px-8 py-4 rounded-3xl border border-black/5 flex items-center gap-4">
           <Layers size={16} className="text-black/20" />
           <span className="font-mona text-[10px] font-black uppercase tracking-widest">{requests.length} Submissions</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5">
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Client</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Project Type</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Description</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Status</th>
                <th className="p-8 font-mona text-[9px] font-black uppercase tracking-[0.3em] text-black/30">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
                    </div>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <p className="font-mona text-xs font-black text-black uppercase tracking-widest">No requests found</p>
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id} className="group hover:bg-black/[0.01] transition-colors">
                    <td className="p-8">
                        <div className="space-y-1">
                            <p className="font-mona text-xs font-black text-black uppercase tracking-tight">{r.customerName}</p>
                            <div className="flex items-center gap-2 text-black/40">
                                <Mail size={10} />
                                <span className="font-poppins text-[10px] font-bold">{r.customerEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-black/40">
                                <Phone size={10} />
                                <span className="font-poppins text-[10px] font-bold">{r.customerPhone}</span>
                            </div>
                        </div>
                    </td>
                    <td className="p-8">
                      <span className="bg-[#f3f2ee] px-4 py-2 rounded-full font-mona text-[9px] font-black uppercase tracking-widest text-black/60">
                        {r.productType}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="max-w-xs">
                        <p className="font-poppins text-[11px] text-black/60 leading-relaxed line-clamp-2">{r.description}</p>
                        {r.imageUrl && (
                            <a 
                                href={r.imageUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 mt-2 text-black/30 hover:text-black transition-colors"
                            >
                                <ExternalLink size={10} />
                                <span className="font-mona text-[9px] font-black uppercase tracking-widest">View Reference</span>
                            </a>
                        )}
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(r.status)}`} />
                        <span className="font-mona text-[9px] font-black uppercase tracking-widest text-black/40">{r.status}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2 text-black/20">
                        <Clock size={12} />
                        <span className="font-poppins text-[10px] font-bold uppercase tracking-tighter">
                          {r.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRequests;
