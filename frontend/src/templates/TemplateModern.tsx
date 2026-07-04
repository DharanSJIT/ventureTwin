import type { User } from './../store/authStore';

export interface PortfolioProps { user: User; }
import { motion } from 'framer-motion';
import { Link as LinkIcon, Mail, ExternalLink } from 'lucide-react';

export default function TemplateModern({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Hi, I'm {user.name}.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed mb-10">
            A software engineer building beautiful, modern digital experiences.
          </p>
          <div className="flex gap-4">
            <a href={`mailto:${user.email}`} className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
              <Mail className="w-5 h-5" /> Contact Me
            </a>
            <a href="#" className="px-6 py-3 bg-slate-100 text-slate-900 rounded-full font-medium hover:bg-slate-200 transition-colors flex items-center gap-2">
              <LinkIcon className="w-5 h-5" /> Portfolio
            </a>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      {user.skills?.length > 0 && (
        <section className="bg-slate-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 font-medium text-sm shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {user.projects?.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-12">Selected Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {user.projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  <p className="text-slate-500 mb-6 flex-1 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech: string, j: number) => (
                      <span key={j} className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {tech}{j < Math.min(project.technologies.length, 4) - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-blue-600">
                    View Project <ExternalLink className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100 flex justify-between items-center text-slate-500">
        <p>© {new Date().getFullYear()} {user.name}. All rights reserved.</p>
        <p className="text-sm">Powered by VentureTwin</p>
      </footer>
    </div>
  );
}
