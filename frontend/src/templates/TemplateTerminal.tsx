import type { User } from './../store/authStore';

export interface PortfolioProps { user: User; }
import { motion } from 'framer-motion';

export default function TemplateTerminal({ user }: PortfolioProps) {
  const prompt = <span className="text-green-500 mr-2">➜</span>;
  const dir = <span className="text-blue-400 mr-2">~/{user.username || 'guest'}</span>;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto border border-slate-700 rounded-lg overflow-hidden bg-[#010409] shadow-2xl">
        {/* Mac OS Window Header */}
        <div className="flex items-center px-4 py-3 bg-[#161b22] border-b border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto text-xs text-slate-400 font-sans">bash - {user.username || 'guest'}@portfolio</div>
        </div>

        <div className="p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed">
          
          {/* Header Command */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            <div className="flex">
              {prompt}{dir} <span className="text-white">whoami</span>
            </div>
            <div className="mt-2 text-slate-300">
              <h1 className="text-2xl font-bold text-white mb-2">{user.name}</h1>
              <p>Software Engineer | Contact: {user.email}</p>
            </div>
          </motion.div>

          {/* Skills Command */}
          {user.skills?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.2 }}>
              <div className="flex mt-6">
                {prompt}{dir} <span className="text-white">cat skills.json</span>
              </div>
              <div className="mt-2 text-yellow-300">
                [ {user.skills.map(s => `"${s}"`).join(', ')} ]
              </div>
            </motion.div>
          )}

          {/* Projects Command */}
          {user.projects?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.2 }}>
              <div className="flex mt-6">
                {prompt}{dir} <span className="text-white">ls -la ./projects</span>
              </div>
              <div className="mt-4 space-y-6">
                {user.projects.map((project, i) => (
                  <div key={i} className="pl-4 border-l-2 border-slate-700">
                    <h3 className="text-blue-400 font-bold text-lg mb-1">{project.title}</h3>
                    <p className="text-slate-400 mb-2">{project.description}</p>
                    <div className="text-xs text-slate-500">
                      tech: {project.technologies.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Blinking Cursor */}
          <div className="flex mt-6">
            {prompt}{dir} <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 h-5 bg-white inline-block ml-1" />
          </div>

        </div>
      </div>
    </div>
  );
}
