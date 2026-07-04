import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Rocket, Users, Coins, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Startup() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Startup Studio</h1>
          <p className="text-slate-500 mt-1">Convert your active ideas into fully generated startup blueprints using AI.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-primary text-white">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6 p-8 items-center">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">New Feature</Badge>
              <h2 className="text-2xl font-bold">Generate a Business Model</h2>
              <p className="text-blue-100">Our AI agents will build a complete Business Model Canvas, Go-To-Market strategy, and Financial Forecast from a single sentence.</p>
              <div className="flex gap-3 pt-4 w-full">
                <Input 
                  placeholder="Describe your startup idea..." 
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus-visible:ring-white"
                />
                <Button className="bg-white text-primary hover:bg-slate-100">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end">
              <Rocket className="w-48 h-48 text-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold text-slate-900 mt-10">Active Blueprints</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Startup Card */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <Badge variant="outline" className="ml-auto text-[10px] uppercase bg-green-50 text-green-700 border-green-200">High Potential</Badge>
            </div>
            <CardTitle className="text-lg">AI Resume Builder</CardTitle>
            <CardDescription className="line-clamp-2">B2C SaaS platform that optimizes resumes for ATS algorithms in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1 p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Market Size</span>
                <span className="text-sm font-semibold text-slate-900">$2.4B</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Coins className="w-3.5 h-3.5" /> Est. MRR</span>
                <span className="text-sm font-semibold text-slate-900">$50k in Y1</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="w-full text-xs h-8">View Pitch Deck</Button>
              <Button className="w-full text-xs h-8 bg-primary hover:bg-blue-700">Open Studio</Button>
            </div>
          </CardContent>
        </Card>

        {/* Startup Card 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <Badge variant="outline" className="ml-auto text-[10px] uppercase bg-slate-50 text-slate-600 border-slate-200">Evaluating</Badge>
            </div>
            <CardTitle className="text-lg">Eco-Logistics API</CardTitle>
            <CardDescription className="line-clamp-2">B2B API for supply chains to track and offset carbon footprints automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1 p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Competitors</span>
                <span className="text-sm font-semibold text-slate-900">High (12)</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-md bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Innovation</span>
                <span className="text-sm font-semibold text-slate-900">8/10</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="w-full text-xs h-8 text-slate-500" disabled>Generating...</Button>
              <Button className="w-full text-xs h-8 bg-primary hover:bg-blue-700">Open Studio</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
