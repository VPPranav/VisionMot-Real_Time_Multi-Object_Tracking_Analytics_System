import { Code2, Mail, LayoutDashboard, BrainCircuit, Users, Shield } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-3xl mx-auto mt-8">
        <div className="flex justify-center mb-6">
           <img src="/logo.png" alt="VisionMOT Logo" className="w-24 h-24 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-primary/30" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-info">
          About VisionMOT
        </h1>
        <p className="text-xl text-text-secondary">
          A high-performance Real-Time Multi-Object Tracking System optimized for intelligent surveillance and analytical insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
        <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 p-8 shadow-glass transition-all hover:border-primary/30 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] group">
           <div className="w-12 h-12 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <Code2 size={24} />
           </div>
           <h3 className="text-2xl font-bold mb-3">Project Overview</h3>
           <p className="text-text-secondary leading-relaxed mb-4">
              VisionMOT is engineered to process live camera feeds using advanced YOLOv8 object detection algorithms intertwined with stable ByteTrack heuristics. 
           </p>
           <p className="text-text-secondary leading-relaxed">
              Capable of dynamically analyzing crowds, capturing crossing metrics, generating immediate anomaly alerts, and projecting real-time velocity distributions onto an interactive Dashboard.
           </p>
        </div>

        <div className="bg-surface/70 backdrop-blur-md rounded-2xl border border-border/50 p-8 shadow-glass transition-all hover:border-info/30 hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] group">
           <div className="w-12 h-12 bg-info/10 rounded-xl border border-info/20 flex items-center justify-center text-info mb-6 group-hover:scale-110 transition-transform">
              <Users size={24} />
           </div>
           <h3 className="text-2xl font-bold mb-3">Developer Details</h3>
           <div className="space-y-4">
              <p className="text-text-secondary leading-relaxed">
                 This project is designed, engineered, and maintained entirely by <span className="text-white font-semibold">Pranav V P</span>.
              </p>
              <div className="flex flex-col space-y-3 mt-4">
                 <div className="flex items-center space-x-3 text-text-secondary bg-surface-elevated/50 p-3 rounded-lg border border-border/50">
                    <Mail size={18} className="text-primary" />
                    <span>pranavvp1507@gmail.com</span>
                 </div>
                 <div className="flex items-center space-x-3 text-text-secondary bg-surface-elevated/50 p-3 rounded-lg border border-border/50">
                    <Shield size={18} className="text-success" />
                    <span>Proprietary &copy; {new Date().getFullYear()}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
