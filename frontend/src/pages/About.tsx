import {
   Code2, Mail, Users, Shield, Cpu, Layers, Zap, AlertTriangle, BarChart2,
   MonitorPlay, Settings, Globe, Bell, CameraIcon, Server, TerminalSquare, Box,
} from 'lucide-react';

function Badge({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'purple' }) {
   const styles: Record<string, string> = {
      primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      info: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      danger: 'bg-red-500/10 text-red-400 border-red-500/20',
      purple: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
   };
   return (
      <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-lg border ${styles[variant]}`}>
         {label}
      </span>
   );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
   return (
      <p className="text-xs font-bold tracking-widest uppercase text-indigo-400/70 mb-4">
         {children}
      </p>
   );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
   return (
      <div className={`bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/8 p-6 ${className}`}>
         {children}
      </div>
   );
}

function IconBox({ icon: Icon, colorClass }: { icon: React.ElementType; colorClass: string }) {
   return (
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorClass}`}>
         <Icon size={20} />
      </div>
   );
}

function Chip({ dot, label }: { dot: string; label: string }) {
   return (
      <span className="inline-flex items-center gap-1.5 text-xs text-text-secondary bg-white/3 border border-white/8 rounded-lg px-2.5 py-1 m-0.5 hover:border-white/15 transition-colors">
         <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
         {label}
      </span>
   );
}

function Metric({ value, label }: { value: string; label: string }) {
   return (
      <div className="bg-white/3 hover:bg-white/5 rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all group">
         <p className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">{value}</p>
         <p className="text-xs text-text-secondary mt-1 font-medium">{label}</p>
      </div>
   );
}

function PageRow({ num, icon: Icon, title, desc }: { num: string; icon: React.ElementType; title: string; desc: string }) {
   return (
      <div className="flex items-start gap-4 p-4 bg-white/2 hover:bg-white/4 rounded-xl border border-white/5 hover:border-white/10 mb-2 last:mb-0 transition-all group">
         <span className="text-xs font-black text-indigo-400/60 min-w-[24px] mt-0.5 font-mono">{num}</span>
         <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
            <Icon size={14} className="text-text-secondary group-hover:text-white transition-colors" />
         </div>
         <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{desc}</p>
         </div>
      </div>
   );
}

function AnomalyRow({ dot, title, desc }: { dot: string; title: string; desc: string }) {
   return (
      <div className="flex items-start gap-3 p-3 bg-white/2 rounded-xl border border-white/5 mb-2 last:mb-0">
         <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dot}`} />
         <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}

function EndpointRow({ method, path, desc, variant }: { method: string; path: string; desc: string; variant: 'primary' | 'info' | 'success' | 'warning' }) {
   return (
      <div className="mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
         <div className="flex items-center gap-2.5 mb-1.5">
            <Badge label={method} variant={variant} />
            <code className="text-xs text-text-secondary font-mono bg-white/3 px-2 py-0.5 rounded-md border border-white/8">{path}</code>
         </div>
         <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
      </div>
   );
}

function ArchStep({ num, title, desc }: { num: number; title: string; desc: string }) {
   return (
      <div className="flex items-start gap-3 mb-4 last:mb-0">
         <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400 flex-shrink-0 mt-0.5">
            {num}
         </div>
         <div>
            <p className="text-sm font-bold text-white">{title}</p>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}

export default function About() {
   return (
      <div className="space-y-10 max-w-5xl mx-auto pb-16">

         {/* Hero */}
         <div className="text-center space-y-4 max-w-3xl mx-auto mt-10 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(99,102,241,0.08),transparent)] -z-10" />
            <div className="flex justify-center mb-6">
               <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-xl" />
                  <img
                     src="/logo.png"
                     alt="VisionMOT Logo"
                     className="relative w-20 h-20 rounded-2xl border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                  />
               </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
               Real-Time Surveillance Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
               About <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">VisionMOT</span>
            </h1>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
               Multi-Object Tracking & Analytics Ecosystem — engineered for intelligent surveillance, geofencing metrics, and zero-latency anomaly detection.
            </p>
         </div>

         {/* At a glance */}
         <section>
            <SectionLabel>At a glance</SectionLabel>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               <Metric value="2Hz" label="WebSocket push rate" />
               <Metric value="YOLOv8" label="Object detection model" />
               <Metric value="ByteTrack" label="Tracking heuristic" />
               <Metric value="<50ms" label="End-to-end latency" />
            </div>
         </section>

         {/* Architecture */}
         <section>
            <SectionLabel>System architecture</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="hover:border-indigo-500/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <IconBox icon={Server} colorClass="bg-indigo-500/10 border-indigo-500/20 text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                     <Badge label="Backend" variant="primary" />
                     <span className="text-xs text-text-secondary">Python · FastAPI · OpenCV</span>
                  </div>
                  <ArchStep num={1} title="FastAPI async server" desc="High-throughput ASGI server handles concurrent video stream processing and WebSocket broadcasting." />
                  <ArchStep num={2} title="YOLOv8 + ByteTrack pipeline" desc="Frames are classified by YOLOv8s and tracked with ByteTrack ID persistence across occlusions." />
                  <ArchStep num={3} title="WebSocket analytics broadcast" desc="Aggregated JSON analytics pushed at 2Hz to all connected clients without polling." />
               </Card>
               <Card className="hover:border-sky-500/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <IconBox icon={TerminalSquare} colorClass="bg-sky-500/10 border-sky-500/20 text-sky-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                     <Badge label="Frontend" variant="info" />
                     <span className="text-xs text-text-secondary">React 18 · Vite · Zustand · Tailwind</span>
                  </div>
                  <ArchStep num={1} title="Zustand store" desc="Fast, unopinionated state management spreads WebSocket packets into components without context re-renders." />
                  <ArchStep num={2} title="Recharts integration" desc="Feeds raw historical JSON into high-framerate SVG charts that adapt in real-time as new data arrives." />
                  <ArchStep num={3} title="CV & tracking engine" desc="YOLOv8s classifies humans and vehicles via PyTorch. ByteTrack handles ID persistence via lapx assignment." />
               </Card>
            </div>
         </section>

         {/* Dashboard pages */}
         <section>
            <SectionLabel>Dashboard pages</SectionLabel>
            <Card>
               <PageRow num="01" icon={MonitorPlay} title="Dashboard" desc="Live matrices of running visual feeds. Start / stop API threads directly on active elements." />
               <PageRow num="02" icon={CameraIcon} title="Camera detailed analytics" desc="Per-feed line chart graphing active vehicles over the last 60s, with cumulative tracked identities." />
               <PageRow num="03" icon={Bell} title="System alerts log" desc="Every threshold breach logged with tracking IDs, class definitions, timestamps, and dismissible alerts." />
               <PageRow num="04" icon={Globe} title="Global analytics" desc="System-wide class distribution pie-chart, plus historical metrics export in CSV format." />
               <PageRow num="05" icon={Settings} title="Configuration" desc="Generate and manage camera feed identifiers directly into the cameras.json API store." />
            </Card>
         </section>

         {/* Tech stack */}
         <section>
            <SectionLabel>Tech stack</SectionLabel>
            <Card>
               <div className="flex flex-wrap gap-0.5">
                  <Chip dot="bg-indigo-400" label="Python 3.10+" />
                  <Chip dot="bg-indigo-400" label="FastAPI" />
                  <Chip dot="bg-indigo-400" label="OpenCV" />
                  <Chip dot="bg-indigo-400" label="Uvicorn" />
                  <Chip dot="bg-sky-400" label="React 18" />
                  <Chip dot="bg-sky-400" label="Vite" />
                  <Chip dot="bg-sky-400" label="Zustand" />
                  <Chip dot="bg-sky-400" label="Tailwind CSS" />
                  <Chip dot="bg-sky-400" label="Recharts" />
                  <Chip dot="bg-violet-400" label="YOLOv8 (yolov8s.pt)" />
                  <Chip dot="bg-violet-400" label="ByteTrack" />
                  <Chip dot="bg-violet-400" label="PyTorch" />
                  <Chip dot="bg-violet-400" label="lapx" />
                  <Chip dot="bg-amber-400" label="WebSockets (asyncio)" />
                  <Chip dot="bg-text-secondary" label="Docker / Docker Compose" />
                  <Chip dot="bg-text-secondary" label="CUDA (optional)" />
               </div>
            </Card>
         </section>

         {/* API endpoints */}
         <section>
            <SectionLabel>API & WebSocket endpoints</SectionLabel>
            <Card>
               <IconBox icon={Box} colorClass="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
               <h2 className="text-lg font-bold text-white mb-5">Integration surface</h2>
               <EndpointRow method="WS" variant="success" path="/ws/analytics" desc="Pipes real-time JSON with aggregate data classes, velocity updates, tracking IDs, and object volume densities at 2Hz." />
               <EndpointRow method="GET" variant="info" path="/cameras" desc="Returns all configured camera feed identifiers from the cameras.json store, verified via Pydantic models." />
               <EndpointRow method="POST" variant="warning" path="/cameras/<id>/start" desc="Starts a specific stream endpoint safely through Pydantic-verified request models." />
            </Card>
         </section>

         {/* Setup */}
         <section>
            <SectionLabel>Setup & prerequisites</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="hover:border-white/15 transition-all">
                  <h3 className="text-base font-bold text-white mb-3">Requirements</h3>
                  <ul className="space-y-2 text-sm text-text-secondary">
                     {[
                        'Python >= 3.10',
                        'Node.js >= 18.0',
                        'Docker Desktop & Docker Compose (optional)',
                        'NVIDIA GPU + CUDA toolkit (optional)',
                     ].map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-indigo-400/50 mt-1.5 shrink-0" />
                           {req}
                        </li>
                     ))}
                  </ul>
               </Card>
            </div>
         </section>

         {/* Developer */}
         <section>
            <SectionLabel>Developer</SectionLabel>
            <Card className="hover:border-sky-500/20 hover:shadow-[0_0_30px_rgba(14,165,233,0.08)] transition-all group">
               <IconBox icon={Users} colorClass="bg-sky-500/10 border-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform" />
               <h2 className="text-lg font-bold text-white mb-5">Developer details</h2>
               <div className="flex items-center gap-3 mb-5 p-3 bg-white/3 rounded-xl border border-white/8">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-sky-600/30 border border-indigo-500/20 flex items-center justify-center text-sm font-black text-indigo-300">
                     PV
                  </div>
                  <div>
                     <p className="font-bold text-white">Pranav V P</p>
                     <p className="text-xs text-text-secondary">Designer, Engineer & Maintainer</p>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-text-secondary bg-white/3 p-3 rounded-xl border border-white/8">
                     <Mail size={15} className="text-indigo-400 shrink-0" />
                     <span className="font-mono text-xs">pranavvp1507@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary bg-white/3 p-3 rounded-xl border border-white/8">
                     <Shield size={15} className="text-emerald-400 shrink-0" />
                     <span className="text-xs">Proprietary Software © {new Date().getFullYear()}. All rights reserved.</span>
                  </div>
               </div>
            </Card>
         </section>

      </div>
   );
}