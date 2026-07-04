import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, MoreVertical, LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Projects() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your active projects and let AI track your progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-md border border-slate-200 p-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 bg-slate-100 text-slate-900"><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-500 hover:text-slate-900"><List className="w-4 h-4" /></Button>
          </div>
          <Button className="bg-primary text-white hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Project Card 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                <FolderKanban className="w-5 h-5 text-primary" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="mt-4 text-lg">VentureTwin AI</CardTitle>
            <CardDescription className="line-clamp-2">The stateful AI operating system for managing career, learning, and projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Progress</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-1.5" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">React</Badge>
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">Node.js</Badge>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Card 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <FolderKanban className="w-5 h-5 text-emerald-600" />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="mt-4 text-lg">FinTech Dashboard</CardTitle>
            <CardDescription className="line-clamp-2">A clean enterprise dashboard for tracking stock and crypto portfolios.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                  <span>Progress</span>
                  <span>90%</span>
                </div>
                <Progress value={90} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">Next.js</Badge>
                  <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">Tailwind</Badge>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Review</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
