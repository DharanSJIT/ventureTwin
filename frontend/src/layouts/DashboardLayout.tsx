import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitMerge, 
  Crosshair, 
  FolderKanban, 
  Trophy,
  FileCode2,
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
  LogOut,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
  BriefcaseBusiness,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAiStore } from '../store/aiStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
  { name: 'Startup Studio', path: '/startup', icon: Rocket },
  { name: 'Decisions', path: '/decisions', icon: GitMerge },
  { 
    name: 'Portfolio', 
    icon: BriefcaseBusiness,
    children: [
      { name: 'Skills', path: '/skills', icon: Crosshair },
      { name: 'Projects', path: '/projects', icon: FolderKanban },
      { name: 'Certifications', path: '/certifications', icon: Award },
      { name: 'Achievements', path: '/achievements', icon: Trophy },
      { name: 'Builder', path: '/builder', icon: FileCode2 },
    ]
  },
  { name: 'Opportunities', path: '/opportunities', icon: Trophy },
  { name: 'Career Graph', path: '/career-graph', icon: Map },
  { name: 'Insights', path: '/insights', icon: Activity },
  { name: 'Timeline', path: '/timeline', icon: Map },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Resume', path: '/resume', icon: FileText },
  { name: 'Learning', path: '/learning', icon: GraduationCap },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

function DynamicUIEngine({ uiState }: { uiState: any }) {
  if (!uiState) return null;

  if (uiState.action === 'SHOW_ALERT') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-4 mb-2 shadow-sm animate-in fade-in zoom-in duration-300">
        <h4 className="font-bold">{uiState.payload.title}</h4>
        <p className="text-sm">{uiState.payload.message}</p>
      </div>
    );
  }

  if (uiState.action === 'ADD_SKILL') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mt-4 mb-2 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h4 className="font-bold flex items-center gap-2"><Crosshair className="w-4 h-4"/> Skills Added Successfully!</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {uiState.payload.skills?.map((skill: string) => (
            <span key={skill} className="bg-green-100 px-2 py-1 rounded-md text-xs font-bold shadow-sm">{skill}</span>
          ))}
        </div>
      </div>
    );
  }

  if (uiState.action === 'RENDER_CHART') {
    const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
    return (
      <div className="bg-white border border-slate-200 p-4 rounded-xl mt-4 mb-2 shadow-sm animate-in fade-in zoom-in duration-300 h-64">
        <h4 className="font-bold text-slate-800 text-sm mb-2 text-center">Skill Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={uiState.payload.data || [{name: 'HTML', value: 40}, {name: 'CSS', value: 30}, {name: 'JS', value: 30}]}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {(uiState.payload.data || [1,2,3]).map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Dynamic user data
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.user?.token);
  const logout = useAuthStore((state) => state.logout);
  
  // AI Store
  const { messages, isThinking, isOpen: isAiOpen, setIsOpen: setIsAiOpen, addMessage, setThinking, uiState, setUiState } = useAiStore();
  const [inputValue, setInputValue] = useState('');
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({ 'Portfolio': false });
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const userName = user?.name || 'Guest User';
  const userPlan = 'Free Plan';
  const userInitials = userName.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, uiState]);

  // Apply Global Theme Based on Career Path
  useEffect(() => {
    const path = user?.careerPath || 'software_engineering';
    document.documentElement.setAttribute('data-theme', path);
  }, [user?.careerPath]);

  const updateUser = useAuthStore((state) => state.updateUser);

  const handlePathChange = async (path: string) => {
    if (!user || !token) return;
    
    console.log("handlePathChange fired with path:", path);
    // Optimistic Update
    updateUser({ careerPath: path });
    document.documentElement.setAttribute('data-theme', path);
    
    try {
      const res = await fetch('http://localhost:3000/api/users/career-path', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ careerPath: path })
      });
      if (!res.ok) {
        console.error("Failed to persist theme on server");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    addMessage({ id: Date.now().toString(), role: 'user', text: userMsg });
    setThinking(true);
    setUiState(null); // Clear previous UI state on new request

    try {
      const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await res.json();
      
      if (data.action) {
        setUiState({ action: data.action, payload: data.payload });
      }

      addMessage({ id: (Date.now() + 1).toString(), role: 'model', text: data.message });
    } catch (error) {
      console.error('Chat error:', error);
      addMessage({ id: (Date.now() + 1).toString(), role: 'model', text: 'Sorry, I encountered an error connecting to my core systems.' });
    } finally {
      setThinking(false);
    }
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
            if (item.children) {
              const isOpen = openMenus[item.name];
              const toggleMenu = () => setOpenMenus(prev => ({ ...prev, [item.name]: !prev[item.name] }));
              
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={toggleMenu}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-slate-400" />
                      {item.name}
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 pl-4"
                      >
                        {item.children.map((child) => {
                          const isActive = location.pathname.startsWith(child.path);
                          return (
                            <Link
                              key={child.name}
                              to={child.path}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                                isActive 
                                  ? "bg-primary/10 text-primary shadow-sm" 
                                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              <child.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                              {child.name}
                            </Link>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const isActive = item.path && location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
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
                  <AvatarImage src={user?.profileImage || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 truncate max-w-[100px]">{userName}</span>
                  <span className="text-xs text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded w-fit mt-0.5">{userPlan}</span>
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
            {/* Career Path Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-bold rounded-xl hidden md:flex items-center gap-2">
                  <Map className="w-4 h-4" /> 
                  {user?.careerPath === 'startup_founder' ? 'Founder' : 
                   user?.careerPath === 'product_design' ? 'Design' : 
                   user?.careerPath === 'data_science' ? 'Data Science' : 'Engineering'}
                  <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 text-slate-700 shadow-xl rounded-xl">
                <DropdownMenuLabel className="font-normal text-xs uppercase tracking-wider text-slate-500">
                  Switch Global Theme & Mentor
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-slate-50 rounded-lg" onClick={() => handlePathChange('software_engineering')}>
                  Software Engineering (Default)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-slate-50 rounded-lg" onClick={() => handlePathChange('startup_founder')}>
                  Startup Founder
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-slate-50 rounded-lg" onClick={() => handlePathChange('product_design')}>
                  Product Design
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer font-medium hover:bg-slate-50 rounded-lg" onClick={() => handlePathChange('data_science')}>
                  Data Science
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto relative overflow-x-hidden">
          <div className="p-8 mx-auto max-w-7xl h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating AI Assistant Toggle */}
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ 
              scale: isAiOpen ? 1 : [1, 1.05, 1],
              boxShadow: isAiOpen 
                ? "0px 10px 30px rgba(37, 99, 235, 0.3)" 
                : ["0px 0px 0px rgba(37, 99, 235, 0)", "0px 0px 20px rgba(37, 99, 235, 0.4)", "0px 0px 0px rgba(37, 99, 235, 0)"]
            }}
            transition={!isAiOpen ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 border border-primary/20"
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
                className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-[24px] shadow-2xl shadow-primary/10 border border-slate-200 flex flex-col z-50 overflow-hidden"
              >
                <div className="p-4 bg-primary border-b border-primary flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-white tracking-tight text-lg">VentureTwin AI</span>
                </div>
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 max-w-[85%] border border-slate-100 font-medium leading-relaxed">
                    Hello {userName}! 👋<br/><br/>I'm your Digital Twin AI. I can dynamically update your resume, render charts, and answer questions. Try asking: <br/><b>"Add HTML and CSS to my skills"</b> or <b>"Show me a pie chart"</b>.
                  </div>
                  
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "p-4 rounded-2xl shadow-sm text-sm font-medium leading-relaxed max-w-[85%]",
                        msg.role === 'user' 
                          ? "bg-primary text-white rounded-tr-sm" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isThinking && (
                    <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-500 max-w-[85%] border border-slate-100 font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      Thinking...
                    </div>
                  )}

                  <DynamicUIEngine uiState={uiState} />
                  
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative">
                    <Input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything..." 
                      className="pr-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary rounded-xl h-12 shadow-sm font-medium"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isThinking || !inputValue.trim()}
                      size="icon" 
                      className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary hover:bg-primary/90 rounded-lg text-white shadow-sm disabled:opacity-50"
                    >
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
