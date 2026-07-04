import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BookOpen, Map, Target, CheckCircle2, PlayCircle, Loader2, Lock, Trash2, ChevronRight, Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

export default function Learning() {
  const token = useAuthStore((state) => state.user?.token);
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/users/learning/roadmaps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data.roadmaps || []);
        if (data.roadmaps && data.roadmaps.length > 0 && !selectedRoadmap) {
          setSelectedRoadmap(data.roadmaps[data.roadmaps.length - 1]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch roadmaps:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/users/learning/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate roadmap");

      setRoadmaps(data);
      setSelectedRoadmap(data[data.length - 1]);
      setShowModal(false);
      setGoal("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Delete this roadmap?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/learning/roadmaps/${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmaps(data);
        if (selectedRoadmap && roadmaps.indexOf(selectedRoadmap) === index) {
          setSelectedRoadmap(data.length > 0 ? data[data.length - 1] : null);
        }
      }
    } catch (err) {
      console.error("Failed to delete roadmap:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-7xl mx-auto relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Learning Center</h1>
          <p className="text-slate-500 mt-1">AI-generated roadmaps to master the skills you need for your goals.</p>
        </div>
        <Button 
          className="bg-primary text-white hover:bg-blue-700 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Map className="w-4 h-4 mr-2" /> Generate New Roadmap
        </Button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle>Create Learning Roadmap</CardTitle>
              <CardDescription>Tell the AI what you want to learn or the role you want to achieve.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="text-rose-500 text-sm font-medium">{error}</div>}
              <Input 
                placeholder="e.g. Senior Cloud Architect, Advanced React Patterns..." 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={generating}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <div className="flex gap-3 justify-end mt-4">
                <Button variant="ghost" onClick={() => setShowModal(false)} disabled={generating}>Cancel</Button>
                <Button onClick={handleGenerate} disabled={generating || !goal.trim()}>
                  {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : "Generate AI Roadmap"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : roadmaps.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 shadow-none text-center py-20">
          <CardContent className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Map className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Roadmaps Yet</h3>
            <p className="text-slate-500 max-w-sm mb-6">Generate your first AI-powered learning roadmap to start mastering new skills structured step-by-step.</p>
            <Button onClick={() => setShowModal(true)}>Create Your First Roadmap</Button>
          </CardContent>
        </Card>
      ) : selectedRoadmap ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Main Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Roadmap Selector horizontally above */}
            {roadmaps.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {roadmaps.map((r, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className={`cursor-pointer whitespace-nowrap px-3 py-1.5 ${selectedRoadmap === r ? 'bg-primary text-white border-primary hover:bg-blue-700' : 'bg-white hover:bg-slate-50'}`}
                    onClick={() => setSelectedRoadmap(r)}
                  >
                    {r.title}
                  </Badge>
                ))}
              </div>
            )}

            <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50" onClick={() => handleDelete(roadmaps.indexOf(selectedRoadmap))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary hover:bg-primary">Active Roadmap</Badge>
                  <span className="text-xs text-slate-500 font-medium ml-auto pr-8">Target: {selectedRoadmap.targetRole}</span>
                </div>
                <CardTitle className="text-2xl pr-8">{selectedRoadmap.title}</CardTitle>
                <CardDescription className="text-base">{selectedRoadmap.description}</CardDescription>
                
                <div className="pt-6">
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                    <span>Overall Progress</span>
                    <span>{selectedRoadmap.overallProgress}%</span>
                  </div>
                  <Progress value={selectedRoadmap.overallProgress} className="h-2.5" />
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-4">
                  {selectedRoadmap.steps?.map((step: any, idx: number) => {
                    const isMastered = step.status === 'mastered';
                    const isLearning = step.status === 'learning';
                    const isLocked = step.status === 'locked';
                    
                    return (
                      <div key={idx} className="relative pl-8">
                        {isMastered ? (
                          <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center shadow-sm z-10">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          </span>
                        ) : isLearning ? (
                          <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-blue-50 border-2 border-primary flex items-center justify-center shadow-sm z-10">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </span>
                        ) : (
                          <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                            <Lock className="w-3 h-3 text-slate-300" />
                          </span>
                        )}

                        <div className={`flex justify-between items-start ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                          <div className="pr-4">
                            <h4 className={`text-base font-bold ${isLearning ? 'text-primary' : 'text-slate-900'}`}>
                              {step.title}
                            </h4>
                            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{step.description}</p>
                            
                            {isMastered && <p className="text-xs font-semibold text-green-600 mt-2">✓ Mastered</p>}
                            {isLocked && <p className="text-xs font-semibold text-slate-400 mt-2">Locked • Complete previous steps</p>}
                          </div>
                          {isLearning && (
                            <Button size="sm" className="h-8 shrink-0 bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-0">
                              <PlayCircle className="w-4 h-4 mr-2"/> Continue
                            </Button>
                          )}
                        </div>

                        {isLearning && step.recommendedResources && step.recommendedResources.length > 0 && (
                          <div className="mt-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Recommended Resources</span>
                            <ul className="space-y-2.5">
                              {step.recommendedResources.map((res: any, rIdx: number) => (
                                <li key={rIdx} className="text-sm text-primary hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-2 font-medium">
                                  {res.type === 'video' ? <Video className="w-4 h-4"/> : <FileText className="w-4 h-4"/>} 
                                  {res.title}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Skill Goals</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {selectedRoadmap.skillGoals?.map((skill: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-slate-800">{skill.name}</span>
                        <span className="text-slate-500 font-medium">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-1.5" />
                    </div>
                  ))}
                  {(!selectedRoadmap.skillGoals || selectedRoadmap.skillGoals.length === 0) && (
                    <p className="text-sm text-slate-500">No skill goals generated for this roadmap.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-blue-50/40 border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary"/> AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                  Based on your new target role as <strong>{selectedRoadmap.targetRole}</strong>, I recommend practicing these skills with hands-on projects immediately after completing the first module.
                </p>
                <Button className="w-full text-xs h-9 bg-primary hover:bg-blue-700 font-semibold" onClick={() => window.open('/builder', '_self')}>
                  Go to Portfolio Builder
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
