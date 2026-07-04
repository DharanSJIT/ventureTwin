import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb, CheckCircle2, XCircle, BrainCircuit, Scale, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Decisions() {
  const { user } = useAuthStore();
  const token = user?.token;
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [dilemma, setDilemma] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/decisions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDecisions(data.decisions || []);
      }
    } catch (err) {
      console.error('Error fetching decisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!dilemma.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/api/users/decisions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dilemma })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Analysis failed');
      
      setDecisions(data);
      setDilemma('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/decisions/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (err) {
      console.error('Error deleting decision:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
          <Scale className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">AI Decision Matrix</h1>
        <p className="text-lg text-slate-500">Stuck on a tough career or project choice? Tell the AI your dilemma and get an objective pros, cons, and recommendation breakdown.</p>
      </div>

      <Card className="border-indigo-100 shadow-md bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <CardContent className="p-8">
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-500" /> What's on your mind?
              </h3>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <Input 
                placeholder="e.g. Should I accept a $100k job offer at a startup or stay at my stable corporate job?"
                value={dilemma}
                onChange={(e) => setDilemma(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                disabled={analyzing}
                className="h-14 text-lg border-slate-200 focus-visible:ring-indigo-500 shadow-sm"
              />
            </div>
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing || !dilemma.trim()} 
              className="h-14 px-8 mt-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm"
            >
              {analyzing ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</> : "Analyze Decision"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : (
        <div className="space-y-12 mt-12">
          <AnimatePresence>
            {[...decisions].reverse().map((decision, index) => {
              const actualIndex = decisions.length - 1 - index;
              return (
                <motion.div 
                  key={actualIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-slate-200 shadow-sm bg-slate-50/50 overflow-hidden relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleDelete(actualIndex)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardHeader className="bg-white border-b border-slate-100 pb-6 pt-8 px-8">
                      <CardDescription className="font-semibold text-indigo-600 uppercase tracking-wider mb-2 text-xs">Dilemma</CardDescription>
                      <CardTitle className="text-2xl leading-relaxed text-slate-800 pr-12">{decision.dilemma}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Pros */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Pros
                          </h4>
                          <ul className="space-y-3">
                            {decision.pros?.map((pro: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 text-emerald-900 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Cons */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                            <XCircle className="w-5 h-5" /> Cons
                          </h4>
                          <ul className="space-y-3">
                            {decision.cons?.map((con: string, i: number) => (
                              <li key={i} className="flex items-start gap-3 bg-rose-50/50 p-3 rounded-lg border border-rose-100/50 text-rose-900 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-indigo-900 text-white p-6 rounded-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                          <Lightbulb className="w-32 h-32" />
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-indigo-200 font-bold uppercase tracking-wider text-xs mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" /> AI Verdict & Recommendation
                          </h4>
                          <p className="text-lg leading-relaxed font-medium">{decision.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {decisions.length === 0 && !analyzing && (
            <div className="text-center py-20 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No decisions analyzed yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mt-2">Enter a dilemma above to get started with your first AI decision matrix.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
