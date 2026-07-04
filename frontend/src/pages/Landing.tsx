import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight, BrainCircuit, Rocket, Target, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">VentureTwin</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={() => navigate('/login')}
              className="bg-primary text-white hover:bg-blue-700 shadow-sm"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4" />
            The Universal Stateful AI Operating System
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-8">
            Build Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Before It Happens.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            VentureTwin is not just a chatbot. It's a living Digital Twin that continuously remembers your ideas, analyzes your skills, and proactively generates roadmaps for your career and startups.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-blue-700 w-full sm:w-auto" onClick={() => navigate('/login')}>
              Start Building Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50 w-full sm:w-auto">
              View Documentation
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 mt-32 text-left"
        >
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-blue-600" />}
            title="Continuous Memory"
            description="Your digital twin remembers every project, every skill, and every conversation to provide compounding value over time."
          />
          <FeatureCard 
            icon={<Rocket className="w-6 h-6 text-blue-600" />}
            title="Startup Studio"
            description="Instantly convert one-sentence ideas into comprehensive business models, financial forecasts, and pitch decks."
          />
          <FeatureCard 
            icon={<Target className="w-6 h-6 text-blue-600" />}
            title="Proactive Roadmaps"
            description="AI anticipates your career trajectory and automatically generates learning paths to bridge your skill gaps."
          />
        </motion.div>

        {/* Dashboard Preview Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-32 w-full max-w-5xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-50"
        >
          <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            </div>
            <div className="ml-4 flex-1">
              <div className="h-6 max-w-sm rounded bg-slate-100 border border-slate-200 flex items-center px-3">
                <span className="text-xs text-slate-400">venturetwin.ai/dashboard</span>
              </div>
            </div>
          </div>
          <div className="p-8 grid md:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              <div className="h-32 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="h-4 w-1/3 bg-slate-100 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-blue-50 rounded"></div>
              </div>
              <div className="h-32 bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="h-4 w-1/3 bg-slate-100 rounded mb-4"></div>
                <div className="h-8 w-1/2 bg-blue-50 rounded"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 mt-20 text-center text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-slate-400" />
          <span className="font-semibold text-slate-700 tracking-tight">VentureTwin</span>
        </div>
        <p>© 2026 VentureTwin AI. Built to scale your potential.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
