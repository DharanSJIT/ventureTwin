import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Map, Target, CheckCircle2, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Learning() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Learning Center</h1>
          <p className="text-slate-500 mt-1">AI-generated roadmaps to master the skills you need for your goals.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-blue-700 shadow-sm">
          <Map className="w-4 h-4 mr-2" /> Generate Roadmap
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Main Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary hover:bg-primary">Active Roadmap</Badge>
                <span className="text-xs text-slate-500 font-medium ml-auto">Target: Senior Full Stack Engineer</span>
              </div>
              <CardTitle className="text-xl">Advanced Cloud Architecture</CardTitle>
              <CardDescription>Mastering distributed systems and AWS serverless ecosystem.</CardDescription>
              
              <div className="pt-4">
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Overall Progress</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l border-slate-200 ml-3 space-y-8 pb-4">
                {/* Step 1 */}
                <div className="relative pl-6">
                  <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">Containerization & Docker</h4>
                  <p className="text-sm text-slate-500 mt-1">Mastered on Feb 12</p>
                </div>
                
                {/* Step 2 */}
                <div className="relative pl-6">
                  <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-blue-50 border-2 border-primary flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 text-primary">AWS Serverless (Lambda, API Gateway)</h4>
                      <p className="text-sm text-slate-600 mt-1">Currently learning • Estimated 2 weeks remaining</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8"><PlayCircle className="w-4 h-4 mr-2"/> Continue</Button>
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">Recommended Resources:</span>
                    <ul className="space-y-2">
                      <li className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-2"><BookOpen className="w-3 h-3"/> AWS Serverless Documentation</li>
                      <li className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-2"><PlayCircle className="w-3 h-3"/> Build a Serverless API (Video)</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-6">
                  <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center" />
                  <h4 className="text-sm font-semibold text-slate-400">Event-Driven Architecture (EventBridge, SQS)</h4>
                  <p className="text-sm text-slate-400 mt-1">Locked • Complete previous step to unlock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Skill Goals</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">System Design</span>
                    <span className="text-slate-500">80%</span>
                  </div>
                  <Progress value={80} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">React Performance</span>
                    <span className="text-slate-500">45%</span>
                  </div>
                  <Progress value={45} className="h-1.5" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">Vector Databases</span>
                    <span className="text-slate-500">10%</span>
                  </div>
                  <Progress value={10} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-blue-50/50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">AI Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 mb-4">
                Based on your recent Startup Studio blueprint "Eco-Logistics API", I highly recommend generating a roadmap for <strong>GraphQL and Apollo Server</strong> to handle complex logistics data fetching efficiently.
              </p>
              <Button className="w-full text-xs h-8 bg-primary hover:bg-blue-700">Generate GraphQL Roadmap</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
