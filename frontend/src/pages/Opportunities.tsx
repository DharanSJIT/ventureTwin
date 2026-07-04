import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Briefcase, Building2, MapPin, DollarSign, Search, Trash2, ArrowUpRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function Opportunities() {
  const { user } = useAuthStore();
  const token = user?.token;
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/opportunities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data.opportunities || []);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    setMatching(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/opportunities/match', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.error('Error matching opportunities:', err);
    } finally {
      setMatching(false);
    }
  };

  const handleDelete = async (index: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/opportunities/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOpportunities(data);
      }
    } catch (err) {
      console.error('Error deleting opportunity:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <Briefcase className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-400" /> AI Opportunity Matcher
          </h1>
          <p className="text-slate-300 text-lg">We analyze your exact skills and project history to find highly tailored job roles and freelance gigs that fit you perfectly.</p>
        </div>
        <Button 
          onClick={handleMatch} 
          disabled={matching} 
          className="relative z-10 shrink-0 h-14 px-8 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold text-base shadow-lg hover:shadow-xl transition-all"
        >
          {matching ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning Market...</> : <><Search className="w-5 h-5 mr-2" /> Find Best Matches</>}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-3xl">
          <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">No opportunities matched yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Click the button above to let our AI scan for roles tailored to your unique profile.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {[...opportunities].reverse().map((opp, index) => {
              const actualIndex = opportunities.length - 1 - index;
              
              // Dynamic color based on score
              const score = opp.matchScore || 85;
              let strokeColor = '#3b82f6'; // blue
              if (score >= 90) strokeColor = '#10b981'; // green
              if (score < 75) strokeColor = '#f59e0b'; // yellow

              return (
                <motion.div 
                  key={actualIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200 shadow-md hover:shadow-lg transition-shadow bg-white h-full flex flex-col relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 bg-white/80 backdrop-blur-sm" onClick={() => handleDelete(actualIndex)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardHeader className="pb-4 relative">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none font-semibold">
                          {opp.type}
                        </Badge>
                        <div className="w-14 h-14 relative -mt-2 -mr-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={4} data={[{ name: 'Score', value: score, fill: strokeColor }]}>
                              <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: strokeColor }}>
                            {score}%
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl leading-tight mb-2">{opp.role}</CardTitle>
                      <div className="flex items-center text-slate-500 text-sm gap-4 font-medium">
                        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4"/> {opp.company}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex items-center text-emerald-600 font-bold mb-4 bg-emerald-50 w-fit px-3 py-1 rounded-md text-sm">
                        <DollarSign className="w-4 h-4 mr-0.5"/> {opp.salary}
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex-1">
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          <span className="text-primary font-bold block mb-1">Why you match:</span>
                          {opp.matchReason}
                        </p>
                      </div>

                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                        View Role <ArrowUpRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
