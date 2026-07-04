import type { User } from '../store/authStore';
import { motion } from 'framer-motion';

export interface PortfolioProps { user: User; }

export default function TemplateNeobrutalism({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#FFF0E5] text-black font-mono p-4 md:p-12 overflow-x-hidden">
      
      {/* Hero Section */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="border-4 border-black bg-[#FFE500] p-8 md:p-16 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">{user.name}</h1>
        <p className="text-xl md:text-3xl font-bold mb-8 max-w-3xl border-l-4 border-black pl-6">
          I build unignorable digital experiences.
        </p>
        <a href={`mailto:${user.email}`} className="inline-block bg-[#FF4911] text-white font-black text-xl uppercase px-8 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all">
          Hire Me Right Now
        </a>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Skills */}
        <section>
          <div className="bg-[#4DFF8A] border-4 border-black p-4 inline-block mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase">Technical Arsenal</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {user.skills?.map((skill, i) => (
              <span key={i} className="bg-white border-4 border-black px-4 py-2 font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-8">
          <div className="bg-[#FF90E8] border-4 border-black p-4 inline-block mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-3xl font-black uppercase">Battle Tested Work</h2>
          </div>
          {user.projects?.map((project, i) => (
            <div key={i} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black uppercase mb-3">{project.title}</h3>
              <p className="text-lg font-medium mb-6 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, j: number) => (
                  <span key={j} className="text-sm font-bold bg-gray-200 px-2 py-1 border-2 border-black">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
