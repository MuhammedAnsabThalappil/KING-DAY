import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide staff email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Invalid staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 w-full max-w-md shadow-2xl text-white">
        <div className="text-center mb-8">
          <span className="text-2xl font-black uppercase tracking-wider text-blue-400">
            KING<span className="text-kingPink">DAY</span> Staff
          </span>
          <h2 className="text-xl font-bold mt-2 text-slate-200">Admin Control Hub</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in with authorized staff credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@king-day.shop"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-kingBlue text-white"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-kingBlue text-white"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gradient hover:opacity-95 text-white font-extrabold py-3.5 px-6 rounded-xl text-sm shadow-lg disabled:opacity-50 transition-all mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In to Hub'}
          </button>
        </form>

        <div className="mt-8 text-center text-[11px] text-slate-500">
          Protected System • Restricted to ADMIN and MANAGER roles
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
