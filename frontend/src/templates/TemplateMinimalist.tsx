import type { User } from '../store/authStore';
import { motion } from 'framer-motion';

export interface PortfolioProps { user: User; }

export default function TemplateMinimalist({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111] font-serif selection:bg-black selection:text-white pb-24">
      <div className="max-w-3xl mx-auto px-8 pt-32 space-y-24">
        
        {/* Header */}
        <header className="space-y-6">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl md:text-5xl font-normal tracking-tight">
            {user.name}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-gray-500 leading-relaxed font-sans max-w-xl">
            Software developer focused on simplicity and elegance. Based on the internet. <br/>
            Reach me at <a href={`mailto:${user.email}`} className="text-black underline decoration-1 underline-offset-4">{user.email}</a>.
          </motion.div>
        </header>

        {/* Projects */}
        {user.projects?.length > 0 && (
          <section className="space-y-10">
            <h2 className="text-xs font-sans uppercase tracking-widest text-gray-400">Selected Works</h2>
            <div className="space-y-12">
              {user.projects.map((project, i) => (
                <div key={i} className="group border-b border-gray-200 pb-10">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-medium group-hover:text-gray-500 transition-colors">{project.title}</h3>
                  </div>
                  <p className="text-gray-500 font-sans leading-relaxed mb-4">{project.description}</p>
                  <p className="text-xs font-sans text-gray-400">{project.technologies.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Certs (Two Columns) */}
        <section className="grid md:grid-cols-2 gap-12 font-sans">
          {user.skills?.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-serif">Expertise</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                {user.skills.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          {user.certifications?.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-serif">Certifications</h2>
              <ul className="space-y-4 text-sm text-gray-600">
                {user.certifications.map((cert, i) => (
                  <li key={i}>
                    <span className="text-black block mb-1">{cert.name}</span>
                    <span className="text-gray-400">{cert.issuer} • {cert.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
