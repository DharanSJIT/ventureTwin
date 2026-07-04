import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, TrendingUp, Lightbulb, Target, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate network fetch for Digital Twin Data
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is the latest intelligence on your Digital Twin.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-slate-200 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse" />
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="h-8 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-slate-200 rounded mt-2 animate-pulse" />
                  <div className="h-1.5 w-full bg-slate-200 rounded mt-4 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
              <Card className="border-slate-200 shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Career Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">84/100</div>
                  <p className="text-xs text-green-600 font-medium mt-1">+2% from last month</p>
                  <Progress value={84} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
              <Card className="border-slate-200 shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Knowledge Index</CardTitle>
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">1,248</div>
                  <p className="text-xs text-slate-500 mt-1">Concepts mastered</p>
                  <Progress value={65} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
              <Card className="border-slate-200 shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Ideas</CardTitle>
                  <Lightbulb className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">12</div>
                  <p className="text-xs text-slate-500 mt-1">3 ready for Startup Studio</p>
                  <div className="flex gap-1 mt-3">
                    <Badge variant="secondary" className="bg-blue-50 text-primary hover:bg-blue-100">SaaS</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">AI</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
              <Card className="border-slate-200 shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Goal Completion</CardTitle>
                  <Target className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">42%</div>
                  <p className="text-xs text-slate-500 mt-1">Q3 Objectives</p>
                  <Progress value={42} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
            <CardDescription>Generated based on your recent activity across all modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Skill Gap Detected</h4>
                  <p className="text-sm text-slate-600 mt-1">Your recent Startup Idea involves "Vector Databases", but your Knowledge Base lacks entries on this topic. Should I generate a learning roadmap for pgvector and Pinecone?</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100">
                  <Briefcase className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Resume Optimization</h4>
                  <p className="text-sm text-slate-600 mt-1">You completed the "Advanced React" project. I recommend updating your Resume module to include this to increase your ATS score by estimated 4%.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your Digital Twin's latest memories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Updated Project", target: "VentureTwin AI", time: "2 hours ago" },
                { action: "Added Note", target: "Meeting with Investors", time: "5 hours ago" },
                { action: "Completed Task", target: "Design Database Schema", time: "Yesterday" },
                { action: "Uploaded Certificate", target: "AWS Solutions Architect", time: "2 days ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-primary/20">
                      <span className="block w-1 h-1 m-0.5 rounded-full bg-primary"></span>
                    </span>
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-slate-500">{activity.target}</span>
                  </div>
                  <span className="text-slate-400 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
