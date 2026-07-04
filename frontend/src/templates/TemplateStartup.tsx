import type { User } from '../store/authStore';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface PortfolioProps { user: User; }

export default function TemplateStartup({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero */}
      <section className="bg-white border-b border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Available for new opportunities
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            I help startups build scaleable software and ship products faster.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center gap-4">
            <a href={`mailto:${user.email}`} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 transition-all flex items-center gap-2">
              Get in touch <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Skills / Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Competencies</h2>
            <p className="text-slate-500">Everything needed to take a product from zero to one.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {user.skills?.map((skill, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{skill}</h3>
                  <p className="text-slate-500 text-sm mt-1">Production-ready implementation and architecture.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Products</h2>
          <div className="space-y-12">
            {user.projects?.map((project, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 bg-slate-100 rounded-3xl aspect-[4/3] w-full border border-slate-200 flex items-center justify-center">
                  <span className="text-slate-400 font-medium font-mono text-sm">[Project Preview Placeholder]</span>
                </div>
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold">{project.title}</h3>
                  <p className="text-lg text-slate-500 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, j: number) => (
                      <span key={j} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
