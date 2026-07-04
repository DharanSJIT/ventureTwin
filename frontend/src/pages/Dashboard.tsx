import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, TrendingUp, Lightbulb, Target, Briefcase, 
  FolderKanban, Map, Award, Activity, Bell, Rocket, Clock,
  AlertTriangle, Sparkles, CheckCircle2, Circle, Code, Trophy,
  Users, Banknote, Presentation, PenTool, Database, Binary, Bug, BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuthStore } from '../store/authStore';

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
          <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
        </div>
      </Card>
    </motion.div>
  );
};

const MiniStat = ({ value, label, icon: Icon, colorClass, suffix = "" }: any) => (
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
          <div className="text-2xl font-bold text-slate-900 leading-none">{value}{suffix}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Heatmap = ({ title }: { title: string }) => {
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

// Fallback icon for Layers (since it's not exported above)
const Layers = Map; 

// Dynamic Configurations based on Career Path
const PATH_CONFIGS: Record<string, any> = {
  software_engineering: {
    welcome: "A real-time view of your engineering metrics and repositories.",
    circular: [
      { label: "Algorithm Mastery", subtitle: "LeetCode Stats", color: "stroke-blue-600", baseScore: 82 },
      { label: "System Design", subtitle: "Architecture", color: "stroke-cyan-500", baseScore: 75 },
      { label: "Code Quality", subtitle: "Lint & SonarQube", color: "stroke-indigo-500", baseScore: 94 },
      { label: "Test Coverage", subtitle: "Jest/Cypress", color: "stroke-emerald-500", baseScore: 88 }
    ],
    miniStats: [
      { label: "Lines of Code", icon: Code, color: "bg-blue-500", val: "142", suffix: "k" },
      { label: "PRs Merged", icon: FolderKanban, color: "bg-indigo-500", val: "128", suffix: "" },
      { label: "Bug Fixes", icon: Bug, color: "bg-amber-500", val: "84", suffix: "" },
      { label: "Certificates", icon: Award, color: "bg-emerald-500", val: "3", suffix: "" }
    ],
    chart: {
      title: "GitHub Activity",
      line1: { key: "commits", color: "#2563eb", name: "Commits" },
      line2: { key: "lines", color: "#22d3ee", name: "Lines Added" },
      data: [
        { name: "Mon", commits: 12, lines: 450 }, { name: "Tue", commits: 24, lines: 1200 },
        { name: "Wed", commits: 8, lines: 300 }, { name: "Thu", commits: 35, lines: 2100 },
        { name: "Fri", commits: 18, lines: 800 }, { name: "Sat", commits: 4, lines: 150 },
        { name: "Sun", commits: 0, lines: 0 }
      ]
    },
    aiInsights: [
      { title: "Code Quality Alert", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", text: "Test coverage dropped below 80% in the auth module. Consider adding more Jest unit tests." },
      { title: "Momentum in React", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", text: "Your recent commits show heavy usage of React Hooks. Great job modernizing the codebase!" },
      { title: "Next Milestone", icon: Target, color: "text-blue-600", bg: "bg-blue-50", text: "You're 2 PRs away from achieving the 'Open Source Contributor' badge." }
    ],
    heatmapTitle: "Commit History",
    timelineTitles: ["Code Pushed to Prod", "PR Approved", "Critical Bug Fixed", "Repo Initialized"]
  },
  startup_founder: {
    welcome: "A real-time view of your startup's growth, revenue, and runway.",
    circular: [
      { label: "PMF Score", subtitle: "Product-Market Fit", color: "stroke-emerald-600", baseScore: 68 },
      { label: "Investor Ready", subtitle: "Pitch Deck & Metrics", color: "stroke-blue-500", baseScore: 85 },
      { label: "User Growth", subtitle: "WoW Acquisition", color: "stroke-indigo-500", baseScore: 72 },
      { label: "Team Building", subtitle: "Culture & Hiring", color: "stroke-amber-500", baseScore: 90 }
    ],
    miniStats: [
      { label: "MRR", icon: Banknote, color: "bg-emerald-500", val: "₹12", suffix: "k" },
      { label: "Active Users", icon: Users, color: "bg-blue-500", val: "4.2", suffix: "k" },
      { label: "Burn Rate", icon: TrendingUp, color: "bg-rose-500", val: "₹8", suffix: "k" },
      { label: "Runway", icon: Clock, color: "bg-indigo-500", val: "14", suffix: " mo" }
    ],
    chart: {
      title: "Growth Metrics",
      line1: { key: "revenue", color: "#10b981", name: "Revenue (₹)" },
      line2: { key: "users", color: "#3b82f6", name: "Active Users" },
      data: [
        { name: "Jan", revenue: 2000, users: 500 }, { name: "Feb", revenue: 4500, users: 1200 },
        { name: "Mar", revenue: 6000, users: 2100 }, { name: "Apr", revenue: 8500, users: 3200 },
        { name: "May", revenue: 10500, users: 3800 }, { name: "Jun", revenue: 12000, users: 4200 }
      ]
    },
    aiInsights: [
      { title: "Runway Warning", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", text: "Your AWS bill spiked by 30% this month. Consider optimizing cloud costs to extend runway." },
      { title: "Conversion Spike", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", text: "Sign-ups increased by 15% after your recent Product Hunt launch. Capitalize on this momentum!" },
      { title: "Fundraising Prep", icon: Presentation, color: "text-indigo-600", bg: "bg-indigo-50", text: "You have 3 VC meetings next week. Review your Cohort Analysis slides." }
    ],
    heatmapTitle: "Customer Discovery Calls",
    timelineTitles: ["Seed Round Closed", "1,000th User Signed Up", "Launched Beta", "Incorporated C-Corp"]
  },
  product_design: {
    welcome: "A real-time view of your design iterations and user testing.",
    circular: [
      { label: "UI/UX Mastery", subtitle: "Figma & Framer", color: "stroke-fuchsia-500", baseScore: 92 },
      { label: "Prototyping", subtitle: "Interactions", color: "stroke-pink-500", baseScore: 88 },
      { label: "User Research", subtitle: "Interviews", color: "stroke-blue-500", baseScore: 78 },
      { label: "Accessibility", subtitle: "WCAG Compliance", color: "stroke-amber-500", baseScore: 85 }
    ],
    miniStats: [
      { label: "Figma Files", icon: PenTool, color: "bg-fuchsia-500", val: "47", suffix: "" },
      { label: "Prototypes", icon: Layers, color: "bg-pink-500", val: "12", suffix: "" },
      { label: "User Tests", icon: Users, color: "bg-blue-500", val: "34", suffix: "" },
      { label: "Dribbble Views", icon: Activity, color: "bg-rose-500", val: "12", suffix: "k" }
    ],
    chart: {
      title: "Design Iterations",
      line1: { key: "iterations", color: "#d946ef", name: "Iterations" },
      line2: { key: "score", color: "#3b82f6", name: "Usability Score" },
      data: [
        { name: "V1", iterations: 5, score: 60 }, { name: "V2", iterations: 12, score: 75 },
        { name: "V3", iterations: 8, score: 82 }, { name: "V4", iterations: 4, score: 89 },
        { name: "V5", iterations: 2, score: 95 }
      ]
    },
    aiInsights: [
      { title: "Accessibility Check", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", text: "Contrast ratio on your primary buttons fails WCAG AA standards. Adjust the hex values." },
      { title: "Usability Success", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", text: "Your latest prototype reduced task completion time by 40%. Great UX improvement!" },
      { title: "Portfolio Ready", icon: Sparkles, color: "text-fuchsia-600", bg: "bg-fuchsia-50", text: "Your 'FinTech App' case study has enough data to be published to your portfolio." }
    ],
    heatmapTitle: "Figma Activity",
    timelineTitles: ["Design System Published", "Usability Testing Finished", "V1 Wireframes Done", "User Personas Created"]
  },
  data_science: {
    welcome: "A real-time view of your model training, datasets, and accuracy.",
    circular: [
      { label: "Machine Learning", subtitle: "Scikit & XGBoost", color: "stroke-emerald-600", baseScore: 89 },
      { label: "Data Wrangling", subtitle: "Pandas & SQL", color: "stroke-blue-500", baseScore: 95 },
      { label: "NLP / Vision", subtitle: "PyTorch", color: "stroke-indigo-500", baseScore: 72 },
      { label: "Statistics", subtitle: "A/B Testing", color: "stroke-rose-500", baseScore: 84 }
    ],
    miniStats: [
      { label: "Models Trained", icon: BrainCircuit, color: "bg-emerald-500", val: "24", suffix: "" },
      { label: "Datasets", icon: Database, color: "bg-blue-500", val: "18", suffix: "" },
      { label: "Accuracy", icon: Target, color: "bg-indigo-500", val: "94", suffix: "%" },
      { label: "Kaggle Rank", icon: Trophy, color: "bg-amber-500", val: "Top 5", suffix: "%" }
    ],
    chart: {
      title: "Model Training",
      line1: { key: "accuracy", color: "#10b981", name: "Validation Accuracy" },
      line2: { key: "loss", color: "#ef4444", name: "Training Loss" },
      data: [
        { name: "Ep 10", accuracy: 50, loss: 90 }, { name: "Ep 20", accuracy: 65, loss: 70 },
        { name: "Ep 30", accuracy: 78, loss: 50 }, { name: "Ep 40", accuracy: 85, loss: 30 },
        { name: "Ep 50", accuracy: 92, loss: 15 }, { name: "Ep 60", accuracy: 94, loss: 10 }
      ]
    },
    aiInsights: [
      { title: "Overfitting Warning", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", text: "Your latest Deep Learning model shows signs of overfitting. Consider adding Dropout layers." },
      { title: "Data Pipeline", icon: Database, color: "text-blue-600", bg: "bg-blue-50", text: "Your SQL query optimization reduced data extraction time by 60 seconds." },
      { title: "Kaggle Momentum", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50", text: "You moved up 200 spots in the Titanic dataset competition. Keep tuning hyperparameters!" }
    ],
    heatmapTitle: "Jupyter Notebook Activity",
    timelineTitles: ["Model Deployed via API", "94% Accuracy Reached", "Data Cleaned & Scaled", "Dataset Downloaded"]
  }
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user?.careerPath]); // Re-trigger loading on path change

  const currentPath = user?.careerPath || 'software_engineering';
  const config = PATH_CONFIGS[currentPath] || PATH_CONFIGS['software_engineering'];

  // Real data integrations where possible
  const projectsCount = user?.projects?.length || 0;
  const certsCount = user?.certifications?.length || 0;
  
  // Mix static config with some real user data boosts
  const scoreBoost = Math.min(10, projectsCount * 2 + certsCount * 2);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-slate-500 mt-1">{config.welcome}</p>
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
          config.circular.map((circ: any, i: number) => (
            <CircularProgress 
              key={i} 
              value={Math.min(100, circ.baseScore + scoreBoost)} 
              label={circ.label} 
              subtitle={circ.subtitle} 
              colorClass={circ.color} 
            />
          ))
        )}
      </div>

      {/* Row 2: Mini Stat Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-28 border-slate-200 shadow-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-100/50 animate-pulse" />
            </Card>
          ))
        ) : (
          config.miniStats.map((stat: any, i: number) => (
            <MiniStat 
              key={i} 
              value={stat.val} 
              suffix={stat.suffix}
              label={stat.label} 
              icon={stat.icon} 
              colorClass={stat.color} 
            />
          ))
        )}
      </div>

      {/* Row 3: Analytics & Insights */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">{config.chart.title}</CardTitle>
              <div className="flex gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.chart.line1.color }} /> {config.chart.line1.name}</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.chart.line2.color }} /> {config.chart.line2.name}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            {isLoading ? (
               <div className="h-[250px] w-full bg-slate-100/50 rounded-xl animate-pulse mt-4" />
            ) : (
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={config.chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.chart.line1.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={config.chart.line1.color} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="color2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={config.chart.line2.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={config.chart.line2.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey={config.chart.line1.key} stroke={config.chart.line1.color} strokeWidth={3} fillOpacity={1} fill="url(#color1)" />
                    <Area type="monotone" dataKey={config.chart.line2.key} stroke={config.chart.line2.color} strokeWidth={3} fillOpacity={1} fill="url(#color2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-4 border-b border-slate-100">
            <CardTitle className="text-base flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" /> Specialized Agent Insights
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
                {config.aiInsights.map((insight: any, i: number) => (
                  <div key={i} className={`${insight.bg} border border-slate-100 p-4 rounded-xl`}>
                    <div className="flex items-center gap-2 mb-2">
                      <insight.icon className={`w-4 h-4 ${insight.color}`} />
                      <h4 className={`text-sm font-bold ${insight.color.replace('text-', 'text-').replace('600', '900')}`}>{insight.title}</h4>
                    </div>
                    <p className={`text-xs ${insight.color.replace('text-', 'text-').replace('600', '700')} leading-relaxed`}>{insight.text}</p>
                  </div>
                ))}
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
              <Activity className="w-4 h-4 text-slate-500" /> {config.heatmapTitle}
            </CardTitle>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              Less <div className="flex gap-0.5 mx-1"><div className="w-2 h-2 bg-slate-100 rounded-[1px]"/><div className="w-2 h-2 bg-blue-200 rounded-[1px]"/><div className="w-2 h-2 bg-blue-400 rounded-[1px]"/><div className="w-2 h-2 bg-primary rounded-[1px]"/></div> More
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-32 bg-slate-100/50 animate-pulse rounded-lg mt-4" /> : <Heatmap title={config.heatmapTitle} />}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Map className="w-4 h-4 text-slate-500" /> Milestone Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="h-64 bg-slate-100/50 animate-pulse rounded-lg" />
            ) : (
              <div className="pl-2 mt-2">
                <TimelineItem active={true} title={config.timelineTitles[0]} date="Today" subtitle="Latest milestone reached in your career path." />
                <TimelineItem active={false} title={config.timelineTitles[1]} date="Last Week" subtitle="Consistent progress over time." />
                <TimelineItem active={false} title={config.timelineTitles[2]} date="Last Month" subtitle="Major achievement unlocked." />
                <TimelineItem active={false} title={config.timelineTitles[3]} date="Start" subtitle="When you started this journey." />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" /> Notifications
            </CardTitle>
            <Badge className="bg-primary hover:bg-blue-700">New</Badge>
          </CardHeader>
          <CardContent className="px-3">
            {isLoading ? (
               <div className="h-64 bg-slate-100/50 animate-pulse rounded-lg mx-3" />
            ) : (
              <div className="space-y-1">
                <NotificationItem icon={Sparkles} title="New AI insight" time="1h ago" subtitle={`Agent generated new advice for your ${currentPath.replace('_', ' ')} path.`} />
                <NotificationItem icon={Activity} title="Streak maintained" time="3h ago" subtitle="You logged in 5 days in a row!" />
                <NotificationItem icon={BrainCircuit} title="System update" time="1d ago" subtitle="VentureTwin AI is now fully stateful." />
                {projectsCount > 0 && <NotificationItem icon={FolderKanban} title="Project indexed" time="2d ago" subtitle="Your portfolio has been synced." />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
