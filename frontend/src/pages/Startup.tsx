import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Rocket, Users, Coins, Sparkles, TrendingUp, Loader2, ArrowLeft, CheckCircle, LayoutGrid, LineChart, Wallet, Trash2, PieChart, MessagesSquare, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Fallbacks for older blueprints generated before dynamic data was added
const fallbackRevenueData = [
  { month: 'M1', revenue: 0 },
  { month: 'M3', revenue: 15000 },
  { month: 'M6', revenue: 120000 },
  { month: 'M9', revenue: 250000 },
  { month: 'M12', revenue: 580000 },
  { month: 'M18', revenue: 1200000 },
  { month: 'M24', revenue: 3500000 },
];

const fallbackCompetitorData = [
  { name: 'Your Startup', score: 95, fill: '#3b82f6' },
  { name: 'Incumbents', score: 45, fill: '#94a3b8' },
  { name: 'New Entrants', score: 65, fill: '#cbd5e1' },
];

export default function Startup() {
  const token = useAuthStore((state) => state.user?.token);
  const [idea, setIdea] = useState("");
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBlueprint, setSelectedBlueprint] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/startup/blueprints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBlueprints(data.blueprints || []);
      }
    } catch (error) {
      console.error("Error fetching blueprints", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/startup/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ idea })
      });
      if (res.ok) {
        const data = await res.json();
        setBlueprints(prev => [...prev, data.blueprint]);
        setIdea("");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to generate blueprint");
      }
    } catch (error) {
      console.error("Error generating blueprint", error);
      alert("Error generating blueprint");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this blueprint?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/startup/blueprints/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBlueprints(prev => prev.filter((_, i) => i !== index));
        if (selectedBlueprint && blueprints.indexOf(selectedBlueprint) === index) {
          setSelectedBlueprint(null);
        }
      } else {
        alert("Failed to delete blueprint");
      }
    } catch (error) {
      console.error("Error deleting blueprint", error);
    }
  };

  if (selectedBlueprint) {
    const details = selectedBlueprint.details || {};
    
    const tabs = [
      { id: 'overview', label: 'Overview', icon: PieChart },
      { id: 'market', label: 'Market Validation', icon: CheckCircle },
      { id: 'business', label: 'Business Model', icon: LayoutGrid },
      { id: 'financials', label: 'Financials', icon: LineChart },
      { id: 'investors', label: 'Investors', icon: MessagesSquare },
      { id: 'funding', label: 'Funding Readiness', icon: Wallet },
    ];

    const revenueChartData = (selectedBlueprint.revenueData && selectedBlueprint.revenueData.length > 0)
      ? selectedBlueprint.revenueData
      : fallbackRevenueData;

    const competitorChartData = (selectedBlueprint.competitorData && selectedBlueprint.competitorData.length > 0)
      ? selectedBlueprint.competitorData.map((item: any, idx: number) => ({
          ...item,
          fill: idx === 0 ? '#3b82f6' : idx === 1 ? '#94a3b8' : '#cbd5e1'
        }))
      : fallbackCompetitorData;

    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto">
        <Button variant="ghost" className="text-slate-500 mb-2 pl-0 hover:text-primary hover:bg-transparent transition-colors" onClick={() => setSelectedBlueprint(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Studio
        </Button>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -mb-20 pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                <Rocket className="w-8 h-8 text-blue-300" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30 backdrop-blur-md">{selectedBlueprint.status}</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{selectedBlueprint.title}</h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">{selectedBlueprint.description}</p>
          </div>
          
          <div className="relative z-10 flex gap-3 w-full md:w-auto">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl w-full md:w-auto">Export Deck</Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 pt-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-6 flex flex-col gap-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Dashboard Menu</div>
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {tab.label}
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Market Size</span>
                      <span className="text-xl font-bold text-slate-900">{selectedBlueprint.marketSize}</span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                        <Coins className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Est. MRR</span>
                      <span className="text-xl font-bold text-slate-900">{selectedBlueprint.estMRR}</span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Competitors</span>
                      <span className="text-xl font-bold text-slate-900">{selectedBlueprint.competitors}</span>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm border-slate-200 bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Innovation</span>
                      <span className="text-xl font-bold text-slate-900">{selectedBlueprint.innovationScore}</span>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-blue-500" /> Executive Summary
                    </h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                        {details.validation ? details.validation.split('\n')[0] : 'Validation summary not available.'}
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <Button onClick={() => setActiveTab('market')} variant="outline">Read Full Market Analysis</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="flex items-center gap-2"><CheckCircle className="text-blue-500 w-5 h-5"/> Market Validation & Opportunity</CardTitle>
                    <CardDescription>Deep dive into problem-solution fit and target audience.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="h-[250px] mb-8 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={competitorChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 600}} width={120} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32} />
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-center text-sm text-slate-400 font-medium mt-2">Innovation & Market Capture Potential vs Competitors</p>
                    </div>
                    
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                      {details.validation || 'Analysis not available.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="flex items-center gap-2"><LayoutGrid className="text-purple-500 w-5 h-5"/> Business Model Canvas</CardTitle>
                    <CardDescription>Monetization strategy, pricing, and cost structures.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                      {details.businessModel || 'Analysis not available.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                    <CardTitle className="flex items-center gap-2"><LineChart className="text-emerald-500 w-5 h-5"/> Revenue Forecasting</CardTitle>
                    <CardDescription>3-Year projected growth trajectory and CAC/LTV analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="h-[300px] mb-8 w-full border border-slate-100 rounded-xl p-4 bg-slate-50/30">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `₹${val/1000}k`} />
                          <Tooltip 
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                      {details.revenueForecasting || 'Analysis not available.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'investors' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-sm border-t-4 border-t-amber-500">
                  <CardHeader className="bg-amber-50/30 pb-4">
                    <CardTitle className="flex items-center gap-2"><MessagesSquare className="text-amber-500 w-5 h-5"/> Investor Simulation</CardTitle>
                    <CardDescription>Tough questions VCs will ask and how to answer them.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                      {details.investorSimulation || 'Analysis not available.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'funding' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                  <CardHeader className="border-b border-slate-100 pb-4 relative z-10">
                    <CardTitle className="flex items-center gap-2"><Wallet className="text-rose-500 w-5 h-5"/> Funding Readiness Checklist</CardTitle>
                    <CardDescription>Are you ready for pre-seed/seed funding?</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 relative z-10">
                    
                    {/* Visual Timeline Element */}
                    <div className="flex justify-between items-center mb-10 pb-10 border-b border-slate-100 px-4">
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border-2 border-blue-200 z-10">1</div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Ideation</span>
                        <div className="absolute top-5 left-10 w-[calc(100vw/5)] max-w-[120px] h-0.5 bg-blue-200 -z-0"></div>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-200 z-10">2</div>
                        <span className="text-xs font-bold text-blue-600 uppercase">MVP</span>
                        <div className="absolute top-5 left-10 w-[calc(100vw/5)] max-w-[120px] h-0.5 bg-slate-200 -z-0"></div>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold border-2 border-slate-200 z-10">3</div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Traction</span>
                        <div className="absolute top-5 left-10 w-[calc(100vw/5)] max-w-[120px] h-0.5 bg-slate-200 -z-0"></div>
                      </div>
                      <div className="flex flex-col items-center gap-2 relative">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold border-2 border-slate-200 z-10">4</div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Seed</span>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium text-lg">
                      {details.fundingReadiness || 'Analysis not available.'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Startup Studio</h1>
          <p className="text-slate-500 mt-1">Convert your active ideas into fully generated startup blueprints using AI.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden bg-primary text-white relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <CardContent className="p-0 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 p-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none backdrop-blur-sm">Premium Feature</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight">Generate a Startup Empire</h2>
              <p className="text-blue-100 text-lg">Our AI agents will build a complete Business Model Canvas, Go-To-Market strategy, and Financial Forecast from a single sentence.</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full">
                <Input 
                  placeholder="Describe your startup idea (e.g., AI resume builder)..." 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  disabled={generating}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus-visible:ring-white h-12 text-base backdrop-blur-sm"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={generating || !idea.trim()} 
                  className="bg-white text-primary hover:bg-slate-100 h-12 px-8 font-bold shadow-lg"
                >
                  {generating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                  {generating ? 'Generating...' : 'Generate AI Blueprint'}
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <Rocket className="w-64 h-64 text-white/20 drop-shadow-2xl animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-12 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Active Blueprints</h2>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : blueprints.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 shadow-sm rounded-2xl">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Lightbulb className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl text-slate-900 font-bold mb-2">No blueprints yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">Describe a million-dollar idea in the input above and hit Generate to create your first startup blueprint dashboard.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((bp, i) => (
            <Card key={i} className="border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group cursor-pointer" onClick={() => setSelectedBlueprint(bp)}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Rocket className="w-5 h-5 text-blue-600 group-hover:text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider border px-2 py-0.5 ${bp.status === 'Evaluating' ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-green-50 text-emerald-700 border-emerald-200'}`}>
                      {bp.status || 'High Potential'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={(e) => { e.stopPropagation(); handleDelete(i); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">{bp.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-slate-500 text-sm mt-1">{bp.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3 h-3" /> Market</span>
                    <span className="text-sm font-bold text-slate-700 line-clamp-1">{bp.marketSize}</span>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Coins className="w-3 h-3" /> MRR</span>
                    <span className="text-sm font-bold text-slate-700 line-clamp-1">{bp.estMRR}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Button className="w-full text-sm h-10 bg-slate-900 hover:bg-blue-600 text-white font-semibold transition-colors shadow-md">Open Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
