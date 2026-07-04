import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Presentation, Award, ExternalLink, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Insights() {
  const { user } = useAuthStore();
  const token = user?.token;
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/insights', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/insights/generate', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error('Error generating insights:', err);
    } finally {
      setGenerating(false);
    }
  };

  const renderSection = (title: string, icon: React.ReactNode, items: any[], colorClass: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-10">
        <h2 className={`text-2xl font-bold flex items-center gap-2 mb-6 ${colorClass}`}>
          {icon} {title}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <Card className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow bg-white h-full flex flex-col group">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-slate-500 text-sm mb-6 flex-1 line-clamp-4">
                    {item.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-auto group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    View Details <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-400" /> AI Career Insights
          </h1>
          <p className="text-slate-300 text-lg">
            We analyze your profile, skills, and target career path to recommend the perfect courses, trainings, and certifications to help you level up.
          </p>
          {insights?.generatedAt && (
            <p className="text-slate-400 text-sm mt-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Last updated: {new Date(insights.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={generating || loading} 
          className="relative z-10 shrink-0 h-14 px-8 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
        >
          {generating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Profile...</> : <><Zap className="w-5 h-5 mr-2 text-yellow-300" /> Generate Insights</>}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
      ) : !insights || (!insights.courses?.length && !insights.trainings?.length && !insights.exams?.length) ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-3xl">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No insights generated yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Click the button above to let our AI scan for the best courses and certifications tailored to your unique profile.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="mt-8">
            {renderSection("Recommended Courses", <BookOpen className="w-6 h-6" />, insights.courses, "text-blue-600")}
            {renderSection("Trainings & Bootcamps", <Presentation className="w-6 h-6" />, insights.trainings, "text-emerald-600")}
            {renderSection("Certification Exams", <Award className="w-6 h-6" />, insights.exams, "text-purple-600")}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
