import type { User } from '../store/authStore';
import { motion } from 'framer-motion';

export interface PortfolioProps { user: User; }

export default function TemplateGrid({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{user.name}</h1>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed">
              Software Engineer building high-performance digital products and elegant user interfaces.
            </p>
          </div>
          <div className="mt-8 flex gap-3">
            <span className="px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium">Available for work</span>
            <a href={`mailto:${user.email}`} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm font-medium transition-colors">Contact</a>
          </div>
        </motion.div>

        {/* Skills Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 overflow-hidden relative group">
          <h2 className="text-xl font-bold mb-6">Core Skills</h2>
          <div className="flex flex-wrap gap-2 relative z-10">
            {user.skills?.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
        </motion.div>

        {/* Projects Area */}
        {user.projects?.map((project, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }} className="md:col-span-2 bg-neutral-900 text-white rounded-3xl p-8 shadow-sm flex flex-col justify-between group overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">{project.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 relative z-10">
              {project.technologies.slice(0,3).map((tech: string, j: number) => (
                <span key={j} className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-md text-neutral-300">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Achievements Card */}
        {user.achievements?.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Key Achievements</h2>
            <div className="space-y-4">
              {user.achievements.map((ach, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <h4 className="font-bold">{ach.title}</h4>
                  <p className="text-sm text-indigo-100 mt-1">{ach.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
