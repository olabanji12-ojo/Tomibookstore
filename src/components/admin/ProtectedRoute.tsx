import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { subscribeToAuthChanges, getUserRole } from '../../firebase/helpers';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const res = await getUserRole(currentUser.uid);
        if (res.success && res.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error('Admin access required.');
          // We don't sign them out, just prevent dashboard access
        }
      } else {
        setIsAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2ee] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-black animate-bounce mr-1" />
        <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.2s] mr-1" />
        <div className="w-2 h-2 rounded-full bg-black animate-bounce [animation-delay:-0.4s]" />
      </div>
    );
  }

  if (!user || isAdmin === false) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
