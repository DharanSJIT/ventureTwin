import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, MoreVertical, LayoutGrid, List, Code2, ExternalLink, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";

export default function Projects() {
  const user = useAuthStore((state) => state.user);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 p-6 rounded-2xl border border-slate-200/60 backdrop-blur-sm shadow-sm">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            Projects Portfolio
          </h1>
          <p className="text-slate-500 font-medium ml-12">Manage your active projects and let AI track your progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100/80 rounded-lg p-1 border border-slate-200 shadow-inner">
            <Button variant="ghost" size="sm" className="h-8 px-2.5 bg-white text-slate-900 shadow-sm rounded-md"><LayoutGrid className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-slate-500 hover:text-slate-900 rounded-md"><List className="w-4 h-4" /></Button>
          </div>
          <Button className="bg-primary text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 rounded-lg font-semibold px-5 h-10 transition-all hover:scale-105 active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {user?.projects && user.projects.length > 0 ? (
          user.projects.map((project, index) => (
            <motion.div variants={item} key={index} className="h-full">
              <Card className="h-full flex flex-col border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 group cursor-pointer bg-white overflow-hidden rounded-[20px] relative">
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-primary to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3 rounded-xl border border-blue-100/50 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Code2 className="w-5 h-5 text-primary" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2 text-slate-500 text-sm leading-relaxed font-medium">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-2 flex-1 flex flex-col justify-end">
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-500" /> AI Extracted</span>
                        <span className="text-primary">100%</span>
                      </div>
                      <Progress value={100} className="h-1.5 bg-slate-200" indicatorClassName="bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap flex-1">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors px-2.5 py-0.5 rounded-md font-semibold">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 px-2 rounded-md font-bold">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors hover:bg-blue-50 rounded-full shrink-0 ml-2">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div variants={item} className="col-span-full">
            <div className="py-20 text-center bg-white border border-slate-200 border-dashed rounded-3xl shadow-sm hover:border-primary/50 transition-colors duration-300">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderKanban className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No active projects</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto font-medium">Upload your resume to automatically extract and populate your portfolio projects!</p>
              <Button className="bg-primary hover:bg-blue-700 text-white shadow-sm font-semibold px-6 rounded-xl transition-transform hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4 mr-2" /> Create First Project
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
