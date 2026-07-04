import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, TrendingUp, Lightbulb, Target, Briefcase, 
  FolderKanban, Map, Award, Activity, Bell, Rocket, Clock,
  AlertTriangle, Sparkles, CheckCircle2, Circle
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const analyticsData = [
  { name: "Mon", focus: 60, tasks: 10 },
  { name: "Tue", focus: 78, tasks: 12 },
  { name: "Wed", focus: 55, tasks: 8 },
  { name: "Thu", focus: 89, tasks: 15 },
  { name: "Fri", focus: 75, tasks: 11 },
  { name: "Sat", focus: 40, tasks: 5 },
  { name: "Sun", focus: 35, tasks: 4 },
];

const CircularProgress = ({ value, label, subtitle, colorClass }: { value: number, label: string, subtitle: string, colorClass: string }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }} className="h-full">
      <Card className="border-slate-200 shadow-sm h-full p-4 flex items-center justify-between">
        <div className="relative w-[72px] h-[72px] flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="36" cy="36" r={radius} className="stroke-slate-100" strokeWidth="6" fill="transparent" />
            <motion.circle 
              cx="36" cy="36" r={radius} 
              className={colorClass} 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={circumference} 
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-slate-900">
            <span className="text-lg font-bold leading-none">{value}</span>
            <span className="text-[9px] text-slate-500 font-medium">/ 100</span>
          </div>
        </div>
        <div className="flex-1 ml-4 text-right">
          <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
          <p className="text-xs text-green-600 font-medium mt-1">{subtitle}</p>
        </div>
      </Card>
    </motion.div>
  );
};

const MiniStat = ({ value, label, icon: Icon, colorClass }: any) => (
  <motion.div whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" }} className="h-full">
    <Card className="border-slate-200 shadow-sm h-full">
      <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
        <div className="flex justify-between items-start">
          <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center text-white shadow-sm`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+4%</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900 leading-none">{value}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Heatmap = () => {
  return (
    <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-1 mt-6">
      {Array.from({ length: 16 * 7 }).map((_, i) => {
        const intensity = Math.random();
        let bgClass = "bg-slate-100";
        if (intensity > 0.85) bgClass = "bg-primary";
        else if (intensity > 0.6) bgClass = "bg-blue-500";
        else if (intensity > 0.4) bgClass = "bg-blue-300";
        else if (intensity > 0.2) bgClass = "bg-blue-200";
        
        return <div key={i} className={`w-full aspect-square rounded-[2px] ${bgClass}`} />
      })}
    </div>
  )
}

const TimelineItem = ({ title, date, subtitle, active }: any) => (
  <div className="flex gap-4 relative pb-6 last:pb-0">
    <div className="flex flex-col items-center">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 bg-white ${active ? 'border-primary' : 'border-slate-200'}`}>
        {active && <div className="w-2 h-2 rounded-full bg-primary" />}
      </div>
      <div className="w-0.5 h-full bg-slate-100 absolute top-5 bottom-0" />
    </div>
    <div className="flex-1 pb-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className={`text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-600'}`}>{title}</h4>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{date}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{subtitle}</p>
    </div>
  </div>
)

const NotificationItem = ({ title, time, subtitle, icon: Icon }: any) => (
  <div className="flex gap-4 items-start p-3 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group">
    <div className="bg-white border border-slate-200 p-2.5 rounded-full shadow-sm mt-0.5 group-hover:border-primary/30 transition-colors">
      <Icon className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <span className="text-xs text-slate-400">{time}</span>
      </div>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-500 mt-1">A real-time view of your career, learning, and startup trajectory.</p>
      </div>

      {/* Row 1: Circular Progress Scores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-[106px] border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
            </Card>
          ))
        ) : (
          <>
            <CircularProgress value={82} label="Career Score" subtitle="▲ +4% this month" colorClass="stroke-blue-600" />
            <CircularProgress value={74} label="Learning Score" subtitle="▲ +9% this month" colorClass="stroke-cyan-500" />
            <CircularProgress value={68} label="Startup Score" subtitle="▼ -2% this month" colorClass="stroke-pink-500" />
            <CircularProgress value={91} label="Knowledge Score" subtitle="▲ +6% this month" colorClass="stroke-emerald-500" />
          </>
        )}
      </div>

      {/* Row 2: Mini Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="h-28 border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
            </Card>
          ))
        ) : (
          <>
            <MiniStat value="14" label="Projects" icon={FolderKanban} colorClass="bg-indigo-500" />
            <MiniStat value="37" label="Ideas" icon={Lightbulb} colorClass="bg-amber-500" />
            <MiniStat value="128" label="Tasks" icon={CheckCircle2} colorClass="bg-blue-500" />
            <MiniStat value="9" label="Certificates" icon={Award} colorClass="bg-emerald-500" />
            <MiniStat value="5" label="Roadmaps" icon={Map} colorClass="bg-fuchsia-500" />
          </>
        )}
      </div>

      {/* Row 3: Analytics & Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Weekly Analytics</CardTitle>
              <div className="flex gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Focus</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400" /> Tasks</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="h-[250px] w-full bg-slate-100/50 rounded-xl animate-pulse mt-4" />
            ) : (
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="focus" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                    <Area type="monotone" dataKey="tasks" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <div className="h-20 bg-slate-100/50 rounded-xl animate-pulse" />
                <div className="h-20 bg-slate-100/50 rounded-xl animate-pulse" />
                <div className="h-20 bg-slate-100/50 rounded-xl animate-pulse" />
              </div>
            ) : (
              <div className="p-4 space-y-3 h-full flex flex-col justify-between">
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-900">Momentum building in Product Design</h4>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">Your skill velocity in UX research is up 34% this month — consider a portfolio case study.</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-bold text-amber-900">Roadmap milestone at risk</h4>
                  </div>
                  <p className="text-xs text-amber-700 leading-relaxed">"Launch MVP" is 3 days behind pace based on your current task completion rate.</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-blue-900">Suggested next step</h4>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">Founders with your profile typically validate pricing before scaling acquisition — run a pricing sprint.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Heatmap, Timeline, Notifications */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" /> Activity Heatmap
            </CardTitle>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              Less <div className="flex gap-0.5 mx-1"><div className="w-2 h-2 bg-slate-100 rounded-[1px]"/><div className="w-2 h-2 bg-blue-200 rounded-[1px]"/><div className="w-2 h-2 bg-blue-400 rounded-[1px]"/><div className="w-2 h-2 bg-primary rounded-[1px]"/></div> More
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-32 bg-slate-100/50 animate-pulse rounded-lg mt-4" /> : <Heatmap />}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-500" /> Roadmap Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="h-64 bg-slate-100/50 animate-pulse rounded-lg" />
            ) : (
              <div className="pl-2">
                <TimelineItem active={true} title="Idea Validation" date="Jan 2026" subtitle="Customer discovery interviews completed" />
                <TimelineItem active={false} title="MVP Build" date="Mar 2026" subtitle="Core product shipped to first 50 users" />
                <TimelineItem active={false} title="Seed Fundraise" date="Jun 2026" subtitle="Currently pitching to 12 investors" />
                <TimelineItem active={false} title="Series A" date="Q1 2027" subtitle="Target close based on growth metrics" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" /> Notifications
            </CardTitle>
            <Badge className="bg-primary hover:bg-blue-700">2 new</Badge>
          </CardHeader>
          <CardContent className="px-3">
            {isLoading ? (
               <div className="h-64 bg-slate-100/50 animate-pulse rounded-lg mx-3" />
            ) : (
              <div className="space-y-1">
                <NotificationItem icon={Award} title="Certificate issued" time="2m ago" subtitle='"Advanced Growth Strategy" added to your profile.' />
                <NotificationItem icon={Sparkles} title="New AI insight" time="38m ago" subtitle='Your twin generated 3 new recommendations.' />
                <NotificationItem icon={Clock} title="Task reminder" time="1h ago" subtitle='"Finalize investor deck" is due tomorrow.' />
                <NotificationItem icon={BrainCircuit} title="Comment received" time="3h ago" subtitle='Mira left feedback on your roadmap.' />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Recent Activity */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Recent Activity
          </CardTitle>
          <CardDescription>A chronological log of your Digital Twin's memories.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 bg-slate-100/50 animate-pulse rounded-lg" />
          ) : (
            <div className="space-y-4">
              {[
                { action: "Completed task", target: "Design onboarding flow v2", time: "10 minutes ago", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
                { action: "Added idea", target: "Async standups for remote teams", time: "1 hour ago", icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-100" },
                { action: "Earned certificate", target: "Lean Startup Fundamentals", time: "Yesterday", icon: Award, color: "text-emerald-600", bg: "bg-emerald-100" },
                { action: "Invited collaborator", target: "Priya Shah joined Roadmap", time: "2 days ago", icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-100" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 text-sm p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bg}`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 mr-1.5">{activity.action}</span>
                      <span className="font-semibold text-slate-900">{activity.target}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-medium">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
