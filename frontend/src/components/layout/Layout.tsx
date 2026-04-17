import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AlertBanner from '../alerts/AlertBanner';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen text-text-primary overflow-hidden bg-transparent">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col min-w-0">
        <AlertBanner />
        <TopBar />

        <main className="flex-1 overflow-auto p-6 scroll-smooth flex flex-col">
          <div className="max-w-7xl mx-auto space-y-6 w-full flex-1 animate-in fade-in duration-300">
            {children}
          </div>
          <footer className="w-full text-center py-6 mt-auto text-text-secondary text-sm font-medium border-t border-border/30 z-10 mt-12 bg-surface/30 backdrop-blur-sm rounded-xl px-4 shadow-inner">
             <p>VisionMOT &copy; {new Date().getFullYear()} — Developed entirely by <span className="text-primary tracking-wide">Pranav V P</span></p>
             <p className="opacity-70 mt-1">pranavvp1507@gmail.com</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
