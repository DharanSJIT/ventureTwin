import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { templates } from '../templates/TemplateRegistry';
import type { User } from '../store/authStore';
import { Bot } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AIMockInterviewModal } from '../components/AIMockInterviewModal';

export default function LivePortfolio() {
  const { username } = useParams();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users/public/${username}`);
        if (!res.ok) {
          throw new Error('Portfolio not found');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Error loading portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">404</h1>
          <p className="text-slate-500">This portfolio does not exist.</p>
        </div>
      </div>
    );
  }

  const templateId = data.activeTemplate || 'modern';
  const SelectedTemplate = templates[templateId]?.component || templates['modern'].component;

  return (
    <>
      <SelectedTemplate user={data} />
      
      {/* Floating Action Button for Interview */}
      <button
        onClick={() => setShowInterview(true)}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all z-40 flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500 delay-1000"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="font-bold hidden md:inline pr-2 tracking-wide">Interview AI Twin</span>
      </button>

      <AnimatePresence>
        {showInterview && (
          <AIMockInterviewModal
            username={username!}
            name={data.name}
            onClose={() => setShowInterview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
