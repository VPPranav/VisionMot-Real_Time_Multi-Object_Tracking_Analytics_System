import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogIn, UserPlus, KeyRound, User, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      if (!email.trim() || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      const res = login(email, password);
      if (res?.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res?.error || 'Failed to login');
      }
    } else {
      if (!username.trim() || !email.trim() || !password) {
        setErrorMsg('Please fill in all fields.');
        return;
      }
      const res = signup({ username, email, password });
      if (res?.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res?.error || 'Failed to sign up');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center animate-fade-in relative px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(99,102,241,0.08),transparent)]" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-sky-500/8 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)]">
          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-500" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-lg" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center border border-indigo-400/30">
                  {isLogin
                    ? <LogIn size={24} className="text-white" />
                    : <UserPlus size={24} className="text-white" />
                  }
                </div>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-text-secondary text-sm mt-1.5 text-center leading-relaxed">
                {isLogin
                  ? 'Sign in to access your surveillance dashboard'
                  : 'Join VisionMOT and start tracking in real-time'}
              </p>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle size={16} className="shrink-0" />
                <span className="text-sm font-medium">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-0.5">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary group-focus-within:text-indigo-400 transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      placeholder="Choose a username"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-0.5">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-0.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary group-focus-within:text-indigo-400 transition-colors">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-text-secondary/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-secondary hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.45)] mt-2"
              >
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-text-secondary border-t border-white/5 pt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={toggleMode}
                className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}