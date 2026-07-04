import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend, AreaChart, Area } from 'recharts';
import { Trophy, Code, Target, Map, Award, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data to show off animations
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (!user || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Crunching your profile data...</p>
      </div>
    );
  }

  // Dynamic Data Calculation
  const totalSkills = user.skills?.length || 0;
  const totalProjects = user.projects?.length || 0;
  const totalCerts = user.certifications?.length || 0;
  const totalRoadmaps = user.learningRoadmaps?.length || 0;
  
  // Radial Chart Data
  const radialData = [
    { name: 'Projects', value: Math.min(totalProjects * 20, 100), fill: '#3b82f6' }, // Blue
    { name: 'Skills', value: Math.min(totalSkills * 10, 100), fill: '#8b5cf6' }, // Purple
    { name: 'Certifications', value: Math.min(totalCerts * 25, 100), fill: '#10b981' }, // Green
    { name: 'Roadmaps', value: Math.min(totalRoadmaps * 33, 100), fill: '#f59e0b' }, // Yellow
  ];

  // Activity Area Chart Data (Mocking a timeline of their growth based on counts)
  const activityData = [
    { name: 'Jan', skills: Math.max(0, totalSkills - 8), projects: Math.max(0, totalProjects - 3) },
    { name: 'Feb', skills: Math.max(0, totalSkills - 5), projects: Math.max(0, totalProjects - 2) },
    { name: 'Mar', skills: Math.max(0, totalSkills - 2), projects: Math.max(0, totalProjects - 1) },
    { name: 'Apr', skills: totalSkills, projects: totalProjects },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" /> Profile Analytics
        </h1>
        <p className="text-slate-500 mt-1">Real-time insights and metrics based on your portfolio growth.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-blue-100">Total Skills</p>
                <Code className="h-5 w-5 text-blue-200" />
              </div>
              <div className="text-3xl font-bold">{totalSkills}</div>
              <p className="text-xs text-blue-200 mt-1">+2 from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-emerald-100">Shipped Projects</p>
                <Target className="h-5 w-5 text-emerald-200" />
              </div>
              <div className="text-3xl font-bold">{totalProjects}</div>
              <p className="text-xs text-emerald-200 mt-1">High velocity</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-slate-200 shadow-sm bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-slate-500">Certifications</p>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{totalCerts}</div>
              <p className="text-xs text-slate-400 mt-1">Verified credentials</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-slate-200 shadow-sm bg-white h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-slate-500">Active Roadmaps</p>
                <Map className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{totalRoadmaps}</div>
              <p className="text-xs text-slate-400 mt-1">Continuous learning</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Portfolio Growth Velocity</CardTitle>
            <CardDescription>Your skill and project acquisition over the last 4 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="skills" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSkills)" name="Skills" strokeWidth={3} />
                <Area type="monotone" dataKey="projects" stroke="#3b82f6" fillOpacity={1} fill="url(#colorProjects)" name="Projects" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Profile Strength</CardTitle>
            <CardDescription>Metric saturation based on recommended thresholds.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" barSize={15} data={radialData}>
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ right: 0 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value}% saturated`, 'Score']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
