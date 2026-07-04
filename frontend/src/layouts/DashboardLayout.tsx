import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Lightbulb,
  GraduationCap,
  Bell,
  Settings,
  Search,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const sidebarItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Career', path: '/career', icon: Briefcase },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Startup Studio', path: '/startup', icon: Lightbulb },
  { name: 'Learning', path: '/learning', icon: GraduationCap },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900">VentureTwin AI</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-500")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>VT</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">John Doe</span>
              <span className="text-xs text-slate-500">Free Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div className="flex-1 max-w-xl flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search anything (Cmd+K)..."
                className="w-full pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50 relative">
          <div className="p-8 mx-auto max-w-7xl h-full">
            <Outlet />
          </div>

          {/* Floating AI Assistant Toggle */}
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-blue-700"
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
                className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50"
              >
                <div className="p-4 bg-primary text-white flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <span className="font-medium">VentureTwin Assistant</span>
                </div>
                <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
                  <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-slate-700 max-w-[85%] border border-slate-100">
                    Hello! I'm your Digital Twin AI. I remember all your goals, skills, and projects. How can I help you today?
                  </div>
                </div>
                <div className="p-3 bg-white border-t border-slate-200">
                  <div className="relative">
                    <Input
                      placeholder="Ask me anything..."
                      className="pr-10"
                    />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-7 w-7 text-primary">
                      {/* Send icon placeholder */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
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
