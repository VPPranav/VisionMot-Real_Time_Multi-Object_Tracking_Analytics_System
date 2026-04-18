import { ArrowRight, Activity, Video, Bell, BarChart3, Zap, Shield, Target, LogIn, LogOut, LayoutDashboard, ChevronRight, Play } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const features = [
    {
      icon: Target,
      title: 'Precision Tracking',
      description: 'State-of-the-art YOLOv8 object detection seamlessly combined with ByteTrack for pin-point accuracy.',
      color: 'text-indigo-400',
      glow: 'rgba(99,102,241,0.4)',
      gradFrom: 'from-indigo-500/20',
      gradTo: 'to-indigo-500/5',
      border: 'hover:border-indigo-500/40',
      dot: 'bg-indigo-400',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Optimized inference engine operating at peak FPS for instantaneous insights with sub-50ms latency.',
      color: 'text-amber-400',
      glow: 'rgba(245,158,11,0.4)',
      gradFrom: 'from-amber-500/20',
      gradTo: 'to-amber-500/5',
      border: 'hover:border-amber-500/40',
      dot: 'bg-amber-400',
    },
    {
      icon: Shield,
      title: 'Intelligent Security',
      description: 'Define custom ROIs and crossing lines with automated, context-aware rule execution.',
      color: 'text-emerald-400',
      glow: 'rgba(16,185,129,0.4)',
      gradFrom: 'from-emerald-500/20',
      gradTo: 'to-emerald-500/5',
      border: 'hover:border-emerald-500/40',
      dot: 'bg-emerald-400',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Dive deep into comprehensive statistics, heatmaps, and historical tracking log data.',
      color: 'text-sky-400',
      glow: 'rgba(14,165,233,0.4)',
      gradFrom: 'from-sky-500/20',
      gradTo: 'to-sky-500/5',
      border: 'hover:border-sky-500/40',
      dot: 'bg-sky-400',
    }
  ];

  const stats = [
    { value: '60+', label: 'FPS Processing' },
    { value: '99.2%', label: 'Detection Accuracy' },
    { value: '<50ms', label: 'Latency' },
    { value: '∞', label: 'Camera Feeds' },
  ];

  return (
    <div className="space-y-0 animate-fade-in pb-16 -mt-2">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 mb-10 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-indigo-500/30 blur-md" />
            <img src="/logo.png" alt="VisionMOT" className="relative w-9 h-9 rounded-xl border border-indigo-500/30" />
          </div>
          <span className="text-xl font-black tracking-tight">
            <span className="text-white">Vision</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">MOT</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white rounded-xl transition-all duration-200 border border-indigo-500/20 text-sm font-semibold"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 text-sm font-medium border border-transparent hover:border-border/50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="group flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
            >
              <LogIn size={16} />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative px-4 pt-8 pb-20 text-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-24 bg-gradient-to-b from-transparent via-sky-500/20 to-transparent" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            VisionMOT Platform — AI-Powered Surveillance
            <ChevronRight size={12} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
            <span className="block text-white">Next-Gen</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400">
              Multi-Object
            </span>
            <span className="block text-white/70 text-4xl sm:text-5xl md:text-6xl font-bold mt-2">Tracking Platform</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Elevate your surveillance with AI-powered, real-time object tracking. VisionMOT bridges raw video feeds and actionable, precise analytics at scale.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_45px_rgba(99,102,241,0.55)] hover:-translate-y-0.5"
            >
              <Play size={18} className="fill-white" />
              <span>Launch Dashboard</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('configuration')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-base border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>Configure System</span>
            </button>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/15 rounded-2xl p-4 transition-all duration-300 group">
                <div className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">{s.value}</div>
                <div className="text-xs text-text-secondary mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div>
              <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-2">Capabilities</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Core Features</h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className={`relative group bg-white/3 hover:bg-white/5 border border-white/8 ${feature.border} rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-default`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradFrom} ${feature.gradTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <div className={`w-6 h-0.5 rounded-full ${feature.dot} mb-4 opacity-60`} />
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white">{feature.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Architecture showcase ── */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/8 bg-white/2">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(99,102,241,0.08),transparent)]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[80px] -mr-40 -mt-40" />

            <div className="relative flex flex-col lg:flex-row">
              {/* Text side */}
              <div className="lg:w-[45%] p-10 lg:p-14 flex flex-col justify-center">
                <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-3">Architecture</p>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5 leading-tight">
                  Comprehensive System Architecture
                </h2>
                <p className="text-text-secondary mb-8 leading-relaxed text-sm">
                  Built on a scalable, high-performance foundation designed for robust deployments. Integrates a{' '}
                  <span className="text-indigo-300 font-semibold">FastAPI backend</span> with a reactive{' '}
                  <span className="text-sky-300 font-semibold">React frontend</span>.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Video, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', title: 'Multi-Stream Aggregation', desc: 'Concurrently process multiple RTSP, HTTP, or local video sources.' },
                    { icon: Bell, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'Instantaneous Alerting', desc: 'Automated WebSocket triggers for perimeter breaches and loitering.' },
                    { icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Operational Analytics', desc: 'Transform raw data into heatmaps, flow charts, and insights.' },
                  ].map((item, i) => {
                    const Ic = item.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className={`p-2.5 rounded-xl border ${item.bg} ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                          <Ic size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visual side */}
              <div className="lg:w-[55%] bg-black/20 border-t lg:border-t-0 lg:border-l border-white/5 relative overflow-hidden flex items-center justify-center p-8 lg:p-12 min-h-[360px]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Fake camera feed mockup */}
                <div className="relative w-full max-w-md">
                  {/* Top bar */}
                  <div className="flex items-center justify-between bg-black/60 backdrop-blur-sm border border-white/10 rounded-t-2xl px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono text-white/70">CAM_01 — Main Intersection</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">LIVE • 30fps</span>
                  </div>

                  {/* Feed area */}
                  <div className="relative bg-black/50 border-x border-white/10 aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Tracking boxes */}
                    <div className="absolute top-[18%] left-[22%] w-16 h-28 border-2 border-emerald-400 rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                      <div className="absolute -top-5 left-0 bg-emerald-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">#102 Person 0.97</div>
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="absolute top-[40%] right-[20%] w-28 h-20 border-2 border-sky-400 rounded-sm shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                      <div className="absolute -top-5 left-0 bg-sky-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">#55 Car 0.91</div>
                    </div>
                    <div className="absolute top-[28%] right-[12%] w-12 h-20 border-2 border-amber-400 rounded-sm shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                      <div className="absolute -top-5 left-0 bg-amber-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">#103 0.88</div>
                    </div>

                    {/* Restricted line */}
                    <div className="absolute bottom-[30%] left-0 w-full h-px bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                      <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded tracking-widest">ZONE BOUNDARY</div>
                    </div>

                    {/* Scan line */}
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-scan" />
                  </div>

                  {/* Bottom stats */}
                  <div className="flex items-center justify-between bg-black/60 backdrop-blur-sm border border-white/10 rounded-b-2xl px-4 py-2">
                    <div className="flex gap-4 text-[10px] font-mono">
                      <span className="text-emerald-400">PEOPLE: 3</span>
                      <span className="text-sky-400">VEHICLES: 2</span>
                    </div>
                    <span className="text-[9px] text-red-400 font-bold animate-pulse">⚠ ALERT ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-sky-600/20 border border-indigo-500/20 p-10 lg:p-14 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Ready to deploy?</h2>
              <p className="text-text-secondary mb-8 text-base max-w-lg mx-auto">Start monitoring your camera feeds with intelligent AI-powered tracking in minutes.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="group flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                >
                  <LayoutDashboard size={16} />
                  Open Dashboard
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="flex items-center gap-2 text-text-secondary hover:text-white text-sm font-medium transition-colors"
                >
                  Learn more about VisionMOT
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}