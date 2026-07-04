import type { User } from './../store/authStore';

export interface PortfolioProps { user: User; }
import { motion } from 'framer-motion';

export default function TemplateGlass({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden relative selection:bg-fuchsia-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-600 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-indigo-600 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-12">
        
        {/* Header Glass Panel */}
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 md:p-16 rounded-[2rem] shadow-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {user.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl font-light">
            Crafting digital experiences through elegant code and thoughtful design.
          </p>
          <div className="mt-8 flex gap-4">
            <a href={`mailto:${user.email}`} className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 rounded-full font-medium transition-all">
              Say Hello
            </a>
          </div>
        </motion.header>

        {/* Two Column Layout for Skills & Projects */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Skills Column */}
          {user.skills?.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 space-y-4"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem]">
                <h2 className="text-2xl font-bold mb-6 text-white/90">Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/10 border border-white/5 rounded-lg text-sm font-medium text-white/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Projects Column */}
          {user.projects?.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2rem]">
                <h2 className="text-2xl font-bold mb-8 text-white/90">Selected Work</h2>
                <div className="space-y-8">
                  {user.projects.map((project, i) => (
                    <div key={i} className="group relative">
                      <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                      <div className="relative">
                        <h3 className="text-xl font-bold mb-2 text-white/90">{project.title}</h3>
                        <p className="text-white/60 mb-4 leading-relaxed font-light">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string, j: number) => (
                            <span key={j} className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400/80">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
