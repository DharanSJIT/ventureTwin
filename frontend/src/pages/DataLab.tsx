import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, LineChart, Server, Binary, Terminal, Play, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const trainingData = [
  { epoch: 1, loss: 2.4, accuracy: 0.35 },
  { epoch: 2, loss: 1.8, accuracy: 0.52 },
  { epoch: 3, loss: 1.2, accuracy: 0.68 },
  { epoch: 4, loss: 0.9, accuracy: 0.79 },
  { epoch: 5, loss: 0.6, accuracy: 0.86 },
  { epoch: 6, loss: 0.4, accuracy: 0.91 },
  { epoch: 7, loss: 0.3, accuracy: 0.94 },
  { epoch: 8, loss: 0.25, accuracy: 0.96 },
];

export default function DataLab() {
  const { user } = useAuthStore();
  const [training, setTraining] = useState(false);

  const startTraining = () => {
    setTraining(true);
    setTimeout(() => setTraining(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-br from-emerald-900 to-teal-900 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl -mb-20 pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md">
            <Database className="w-4 h-4 text-emerald-300" /> Data Lab
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Data Science Lab</h1>
          <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed">
            Train models, analyze large datasets, and monitor hyperparameter tuning runs.
          </p>
        </div>

        <div className="relative z-10 flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg shadow-emerald-900/50 h-12 px-6 font-bold"
            onClick={startTraining}
            disabled={training}
          >
            {training ? <Cpu className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
            {training ? 'Training Model...' : 'Start Training Run'}
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Jupyter Mock & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineChart className="w-5 h-5 text-teal-500" /> Training Metrics</CardTitle>
              <CardDescription>Real-time validation accuracy and loss over epochs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trainingData}>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="epoch" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                    <Area type="monotone" dataKey="loss" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorLoss)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Notebook Mock */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-slate-800"><Terminal className="w-5 h-5 text-orange-500" /> Jupyter Notebook environment</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b border-slate-100 flex items-start gap-4">
                <div className="text-slate-400 font-mono text-sm pt-1">In [1]:</div>
                <div className="flex-1 font-mono text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <span className="text-purple-600">import</span> pandas <span className="text-purple-600">as</span> pd<br/>
                  <span className="text-purple-600">from</span> sklearn.ensemble <span className="text-purple-600">import</span> RandomForestClassifier<br/>
                  <br/>
                  df = pd.read_csv(<span className="text-green-600">'/data/user_behavior_v2.csv'</span>)<br/>
                  df.head()
                </div>
              </div>
              <div className="p-4 flex items-start gap-4">
                <div className="text-slate-400 font-mono text-sm pt-1">Out[1]:</div>
                <div className="flex-1 text-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-2 font-bold text-slate-700">user_id</th>
                        <th className="py-2 font-bold text-slate-700">session_time</th>
                        <th className="py-2 font-bold text-slate-700">churn</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600 font-mono">
                      <tr className="border-b border-slate-100"><td className="py-2">9384</td><td className="py-2">120.4</td><td className="py-2">0</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-2">1029</td><td className="py-2">45.2</td><td className="py-2">1</td></tr>
                      <tr><td className="py-2">4492</td><td className="py-2">310.8</td><td className="py-2">0</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Datasets & Compute */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Binary className="w-5 h-5 text-indigo-500" /> Datasets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">customer_churn_2026.csv</h4>
                    <p className="text-xs text-slate-500 mt-1">1.2 GB • Updated today</p>
                  </div>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:bg-slate-50 cursor-pointer">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">image_net_subset_v4.tfrecord</h4>
                    <p className="text-xs text-slate-500 mt-1">45 GB • Updated last week</p>
                  </div>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-emerald-500" /> Compute Cluster</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">GPU Usage (4x H100)</span>
                    <span className="font-bold text-emerald-600">{training ? '98%' : '12%'}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-1000 ${training ? 'bg-emerald-500 w-[98%]' : 'bg-emerald-300 w-[12%]'}`} />
                  </div>
                </li>
                <li>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">RAM (512GB)</span>
                    <span className="font-bold text-blue-600">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[45%]" />
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
