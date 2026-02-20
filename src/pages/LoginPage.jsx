import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 mb-6 shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0A0F1E] rounded-[calc(1.5rem-2px)] flex items-center justify-center">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">AcuTrace</h1>
          <p className="text-white/40 font-medium">Enterprise Investigative Intelligence</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0A0F1E] font-bold py-4 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 group"
            >
              {submitting ? 'Authenticating...' : 'Access Intelligence'}
              {!submitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 text-xs">
              RESTRICTED ACCESS. UNAUTHORIZED ATTEMPTS WILL BE LOGGED.
            </p>
          </div>
        </div>

        {/* Demo Helper */}
        <div className="mt-8 text-center text-white/30 text-sm">
          <p>Demo: admin / admin123 or analyst / analyst123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
