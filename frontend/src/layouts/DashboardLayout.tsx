import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitMerge, 
  Crosshair, 
  FolderKanban, 
  Trophy,
  Activity,
  Map,
  Award,
  Briefcase,
  GraduationCap,
  LineChart,
  Settings,
  Search,
  Bell,
  Bot,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Decisions', path: '/decisions', icon: GitMerge },
  { name: 'Skills', path: '/skills', icon: Crosshair },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Opportunities', path: '/opportunities', icon: Trophy },
  { name: 'Insights', path: '/insights', icon: Activity },
  { name: 'Timeline', path: '/timeline', icon: Map },
  { name: 'Certifications', path: '/certifications', icon: Award },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Learning', path: '/learning', icon: GraduationCap },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Dynamic user data
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const userName = user?.name || 'Guest User';
  const userPlan = 'Free Plan';
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar - White/Blue Theme */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">VentureTwin</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          {sidebarItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-primary shadow-sm" 
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer outline-none bg-white border border-slate-200 shadow-sm">
                <Avatar className="h-9 w-9 border border-slate-200">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[100px]">{userName}</span>
                  <span className="text-xs text-primary font-semibold bg-blue-50 px-1.5 py-0.5 rounded w-fit mt-0.5">{userPlan}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white border-slate-200 text-slate-700 shadow-xl rounded-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none text-slate-900">{userName}</p>
                  <p className="text-xs leading-none text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 focus:bg-slate-50 rounded-lg" onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span className="font-medium">Account settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 rounded-lg" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-medium">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 z-10 bg-white/80 backdrop-blur-md shadow-sm sticky top-0">
          <div className="flex-1 max-w-xl flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Search anything (Cmd+K)..." 
                className="w-full pl-9 bg-slate-100/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary h-10 rounded-xl font-medium shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-blue-50 rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-blue-50 rounded-xl hidden sm:flex">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative">
          <div className="p-8 mx-auto max-w-7xl h-full">
            <Outlet />
          </div>

          {/* Floating AI Assistant Toggle */}
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-2xl shadow-blue-900/20 bg-primary hover:bg-blue-700 border border-primary/20"
              onClick={() => setIsAiOpen(!isAiOpen)}
            >
              <Bot className="h-6 w-6 text-white" />
            </Button>
          </motion.div>

          {/* Floating AI Chat Window */}
          <AnimatePresence>
            {isAiOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-[24px] shadow-2xl shadow-blue-900/10 border border-slate-200 flex flex-col z-50 overflow-hidden"
              >
                <div className="p-4 bg-primary border-b border-primary flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-white tracking-tight text-lg">VentureTwin AI</span>
                </div>
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 max-w-[85%] border border-slate-100 font-medium leading-relaxed">
                    Hello {userName}! 👋<br/><br/>I'm your Digital Twin AI. I remember all your goals, skills, and projects. How can I help you today?
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative">
                    <Input 
                      placeholder="Ask me anything..." 
                      className="pr-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary rounded-xl h-12 shadow-sm font-medium"
                    />
                    <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary hover:bg-blue-700 rounded-lg text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
