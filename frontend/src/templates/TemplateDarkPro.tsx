import type { User } from '../store/authStore';
import { motion } from 'framer-motion';
import { ExternalLink, Terminal } from 'lucide-react';

export interface PortfolioProps { user: User; }

export default function TemplateDarkPro({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-blue-500/30">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-6 py-24 space-y-32">
        
        {/* Header */}
        <header className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-blue-500 font-mono text-sm">
            <Terminal className="w-4 h-4" /> System.out.println("Hello World");
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight">
            I'm {user.name}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-[#A1A1AA] max-w-2xl leading-relaxed">
            Full-stack engineer building the infrastructure of tomorrow. Architecting scalable, robust, and performant systems.
          </motion.p>
        </header>

        {/* Skills */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#333]" /> Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            {user.skills?.map((skill, i) => (
              <div key={i} className="px-4 py-2 rounded-md bg-[#171717] border border-[#262626] text-sm text-[#A1A1AA] hover:text-white hover:border-[#333] transition-colors">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#333]" /> Shipments
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {user.projects?.map((project, i) => (
              <div key={i} className="group p-6 rounded-xl bg-[#171717] border border-[#262626] hover:border-blue-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <ExternalLink className="w-5 h-5 text-[#52525B] group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 h-16 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0,4).map((tech: string, j: number) => (
                    <span key={j} className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
