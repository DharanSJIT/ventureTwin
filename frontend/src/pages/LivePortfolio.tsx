import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { templates } from '../templates/TemplateRegistry';
import type { User } from '../store/authStore';

export default function LivePortfolio() {
  const { username } = useParams();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return <SelectedTemplate user={data} />;
}
