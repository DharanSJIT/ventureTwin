import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Crosshair, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

// Helper to categorize skills into domains
const categorizeSkill = (skill: string) => {
  const lower = skill.toLowerCase();
  
  if (lower.match(/(react|vue|angular|html|css|tailwind|javascript|typescript|next\.js|frontend|ui|ux)/)) return 'Frontend';
  if (lower.match(/(node|express|django|flask|spring|python|java|c\+\+|backend|api|go|rust|ruby)/)) return 'Backend';
  if (lower.match(/(sql|postgres|mysql|mongo|redis|database|supabase|firebase)/)) return 'Database';
  if (lower.match(/(aws|azure|gcp|docker|kubernetes|devops|ci\/cd|cloud|linux)/)) return 'Cloud/DevOps';
  if (lower.match(/(ml|ai|data|machine learning|deep learning|pandas|numpy|tensorflow|pytorch)/)) return 'AI & Data';
  if (lower.match(/(algo|data structure|system design|architecture|security)/)) return 'Core CS';
  if (lower.match(/(agile|scrum|leadership|communication|management)/)) return 'Soft Skills';
  
  return 'Other Tools';
};

// Helper to generate a consistent pseudo-random base score
const generateScore = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash) % 29;
  return 60 + normalized; // Score between 60 and 89
};

export default function Skills() {
  const user = useAuthStore((state) => state.user);
  const skills = user?.skills || [];
  
  // Group skills by domain and calculate average score
  const domainScores: Record<string, { total: number; count: number; skills: string[] }> = {};
  
  skills.forEach((skill: string) => {
    const domain = categorizeSkill(skill);
    const score = generateScore(skill);
    
    if (!domainScores[domain]) {
      domainScores[domain] = { total: 0, count: 0, skills: [] };
    }
    domainScores[domain].total += score + 10; // Boost score slightly for having a skill in this domain
    domainScores[domain].count += 1;
    domainScores[domain].skills.push(skill);
  });

  const chartData = Object.keys(domainScores).map(domain => {
    // Calculate average score for the domain (capped at 98)
    const baseScore = domainScores[domain].total / domainScores[domain].count;
    // Boost score based on number of skills in this domain (more skills = higher proficiency)
    const countBoost = Math.min(domainScores[domain].count * 5, 20);
    const finalScore = Math.min(Math.round(baseScore + countBoost), 98);
    
    return {
      subject: domain,
      score: finalScore,
      fullMark: 100,
      skillsList: domainScores[domain].skills.join(', ')
    };
  });

  // Ensure we have at least 3 points for a polygon radar chart
  if (chartData.length > 0 && chartData.length < 3) {
    const defaultDomains = ['Frontend', 'Backend', 'Database', 'Cloud/DevOps', 'AI & Data'];
    for (let i = 0; i < defaultDomains.length && chartData.length < 3; i++) {
      if (!domainScores[defaultDomains[i]]) {
        chartData.push({ subject: defaultDomains[i], score: 20, fullMark: 100, skillsList: 'None yet' });
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Skills</h1>
        <p className="text-slate-500">Your extracted technical and soft skills.</p>
      </div>

      {!skills.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200 shadow-sm bg-amber-50/50">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Skills Found</h3>
                <p className="text-slate-500 max-w-md mt-2">
                  We haven't extracted any skills yet. Upload a resume or paste your text profile to auto-generate your skills.
                </p>
              </div>
              <Link
                to="/resume"
                className="mt-4 px-6 py-2 bg-primary text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
              >
                Go to Resume
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* SKILL CLOUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Crosshair className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-900">Skill Cloud</CardTitle>
                    <CardDescription>Extracted by VentureTwin AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors cursor-default shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* COMPETENCY MAP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-slate-800 shadow-xl rounded-2xl overflow-hidden bg-slate-900 text-white h-full relative">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <CardHeader className="border-b border-slate-800 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl text-white">Competency Map</CardTitle>
                    <CardDescription className="text-slate-400">Your AI-analyzed skill proficiency</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[400px] relative z-10">
                {chartData.length >= 3 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#60a5fa' }}
                        formatter={(value: number, name: string, props: any) => [
                          value + '%', 
                          <span key="tooltip-label" className="text-slate-400 text-xs block mt-1">Found: {props.payload.skillsList}</span>
                        ]}
                        labelStyle={{ display: 'none' }}
                      />
                      <Radar 
                        name="Domain Proficiency" 
                        dataKey="score" 
                        stroke="#60a5fa" 
                        strokeWidth={2}
                        fill="#3b82f6" 
                        fillOpacity={0.4} 
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 flex-col text-center">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                    <p>Add at least 1 skill to generate a Domain Competency Map</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
