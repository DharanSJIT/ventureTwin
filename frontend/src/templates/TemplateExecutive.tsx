import type { User } from '../store/authStore';
import { motion } from 'framer-motion';

export interface PortfolioProps { user: User; }

export default function TemplateExecutive({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-16">
      
      {/* Top Bar */}
      <div className="bg-[#0f2027] text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="font-bold text-xl tracking-widest uppercase">{user.name}</div>
        <a href={`mailto:${user.email}`} className="text-sm font-medium hover:text-blue-300 transition-colors">Contact</a>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">
        
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm border border-slate-200 p-10 flex gap-10 items-center">
          <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center text-4xl text-slate-400 font-light flex-shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{user.name}</h1>
            <p className="text-xl text-slate-600 font-light mb-6">Senior Technology Executive & Software Architect</p>
            <div className="flex gap-4">
              <span className="text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded border border-slate-200">Executive Leadership</span>
              <span className="text-sm text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded border border-slate-200">System Architecture</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Left Column (Skills & Certs) */}
          <div className="md:col-span-1 space-y-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Core Expertise</h2>
              <div className="flex flex-col gap-3">
                {user.skills?.map((skill, i) => (
                  <div key={i} className="text-slate-700 font-medium text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {skill}
                  </div>
                ))}
              </div>
            </motion.div>

            {user.certifications?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Certifications</h2>
                <div className="space-y-4">
                  {user.certifications.map((cert, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-slate-800 text-sm">{cert.name}</h3>
                      <p className="text-xs text-slate-500">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (Projects & Achievements) */}
          <div className="md:col-span-2 space-y-8">
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Professional Experience</h2>
              <div className="space-y-10">
                {user.projects?.map((project, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-[#0f2027]">{project.title}</h3>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, j: number) => (
                        <span key={j} className="text-xs font-semibold px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {user.achievements?.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Notable Achievements</h2>
                <ul className="space-y-4">
                  {user.achievements.map((ach, i) => (
                    <li key={i} className="pl-4 border-l-2 border-blue-600">
                      <h4 className="font-bold text-slate-800 text-sm">{ach.title}</h4>
                      <p className="text-slate-600 text-sm mt-1">{ach.description}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
