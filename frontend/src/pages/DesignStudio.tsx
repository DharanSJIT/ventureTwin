import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, PenTool, LayoutTemplate, MousePointerClick, Eye, ShieldAlert, Zap } from 'lucide-react';

export default function DesignStudio() {
  const { user } = useAuthStore();
  const [testing, setTesting] = useState(false);

  const runTest = () => {
    setTesting(true);
    setTimeout(() => setTesting(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-br from-fuchsia-900 to-pink-900 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -mb-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md">
            <PenTool className="w-4 h-4 text-pink-300" /> Design Studio 
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Product Design</h1>
          <p className="text-fuchsia-100 text-lg max-w-2xl leading-relaxed">
            Manage your Figma boards, run usability tests, and check component accessibility.
          </p>
        </div>

        <div className="relative z-10 flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button 
            className="bg-white text-fuchsia-900 hover:bg-fuchsia-50 border-0 shadow-lg h-12 px-6 font-bold"
            onClick={runTest}
            disabled={testing}
          >
            {testing ? <Zap className="w-5 h-5 mr-2 animate-spin" /> : <Eye className="w-5 h-5 mr-2" />}
            {testing ? 'Running Usability Test...' : 'Run Usability Test'}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Artboards */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-fuchsia-500" /> Figma Prototypes</CardTitle>
              <CardDescription>Your recently synced design files and artboards.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Dashboard UI Revamp', screens: 12, status: 'In Review', color: 'bg-amber-100 text-amber-700' },
                  { name: 'Mobile App V2', screens: 45, status: 'Approved', color: 'bg-emerald-100 text-emerald-700' },
                  { name: 'Landing Page', screens: 3, status: 'Draft', color: 'bg-slate-100 text-slate-700' },
                  { name: 'Design System', screens: 104, status: 'Published', color: 'bg-blue-100 text-blue-700' }
                ].map((file, i) => (
                  <div key={i} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow group cursor-pointer bg-white">
                    <div className="h-32 bg-slate-50 rounded-lg mb-4 flex items-center justify-center border border-slate-100 group-hover:border-fuchsia-200 transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d946ef_1px,transparent_1px)] [background-size:16px_16px]" />
                      <Palette className="w-8 h-8 text-slate-300 group-hover:text-fuchsia-400 transition-colors" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 truncate max-w-[150px]">{file.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{file.screens} screens</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${file.color}`}>
                        {file.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Accessibility & Tests */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-500" /> WCAG Accessibility Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Color Contrast</span>
                  <span className="text-sm font-bold text-emerald-600">98% Pass</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '98%' }} />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-slate-600">Tap Targets (Mobile)</span>
                  <span className="text-sm font-bold text-amber-600">82% Pass</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '82%' }} />
                </div>

                {testing && <p className="text-xs text-fuchsia-600 animate-pulse mt-4 text-center">Re-evaluating components...</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MousePointerClick className="w-5 h-5 text-indigo-500" /> Heatmap Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-xl p-4 relative h-40 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-500 rounded-full blur-xl opacity-60 mix-blend-screen" />
                <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-yellow-400 rounded-full blur-lg opacity-50 mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-40 mix-blend-screen" />
                
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-md rounded-lg p-2">
                  <p className="text-xs text-white font-medium">Primary CTA is receiving 74% of interactions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
