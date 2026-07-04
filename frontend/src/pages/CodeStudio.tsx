import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, GitPullRequest, GitBranch, Terminal, ShieldAlert, Cpu, Activity, Play } from 'lucide-react';

export default function CodeStudio() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mb-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md">
            <Terminal className="w-4 h-4 text-blue-400" /> Code Studio 
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Engineering Hub</h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Manage your repositories, run CI/CD pipelines, and let AI analyze your code architecture.
          </p>
        </div>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Repos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GitBranch className="w-5 h-5 text-blue-500" /> Active Repositories</CardTitle>
              <CardDescription>Your synced GitHub repositories and their build statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'ventureTwin-core', lang: 'TypeScript', status: 'Passing', color: 'bg-emerald-500', updated: '2 hrs ago' },
                  { name: 'auth-microservice', lang: 'Go', status: 'Failing', color: 'bg-rose-500', updated: '5 hrs ago' },
                  { name: 'ai-mentor-engine', lang: 'Python', status: 'Building', color: 'bg-amber-500', updated: 'Just now' }
                ].map((repo, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Code className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{repo.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-medium text-slate-700">{repo.lang}</span>
                          <span>•</span>
                          <span>{repo.updated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${repo.color} ${repo.status === 'Building' ? 'animate-pulse' : ''}`} />
                      <span className="text-sm font-medium text-slate-700">{repo.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* IDE Mock */}
          <Card className="border-slate-200 shadow-sm bg-slate-950 text-slate-300">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-100"><Terminal className="w-5 h-5 text-emerald-400" /> Web Terminal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 font-mono text-sm h-64 overflow-y-auto">
              <p className="text-emerald-400">$ npm run build</p>
              <p className="text-slate-400 mt-1">&gt; ventureTwin@1.0.0 build</p>
              <p className="text-slate-400">&gt; tsc && vite build</p>
              <br />
              <p className="text-blue-400">vite v5.0.0 building for production...</p>
              <p className="text-slate-400">✓ 42 modules transformed.</p>
              <p className="text-slate-400">dist/assets/index-D8rW.css   15.2 kB</p>
              <p className="text-slate-400">dist/assets/index-B2xT.js   142.5 kB</p>
              <p className="text-emerald-400 mt-2">✓ built in 2.41s</p>

            </CardContent>
          </Card>
        </div>

        {/* Right Column - PRs & Analysis */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GitPullRequest className="w-5 h-5 text-indigo-500" /> Open PRs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h4 className="text-sm font-bold text-indigo-900">Feature: Dynamic Sidebar</h4>
                  <p className="text-xs text-indigo-700 mt-1">#42 opened 2 days ago</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <h4 className="text-sm font-bold text-slate-700">Fix: Auth Token Expiry</h4>
                  <p className="text-xs text-slate-500 mt-1">#41 opened 3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-500" /> Code Smells</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5" />
                  <span className="text-slate-600"><strong className="text-slate-900">Dashboard.tsx</strong> is 500+ lines. Consider splitting.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
                  <span className="text-slate-600"><strong className="text-slate-900">authStore.ts</strong> has direct localStorage access.</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                  <span className="text-slate-600"><strong className="text-slate-900">package.json</strong> has 3 outdated dependencies.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
