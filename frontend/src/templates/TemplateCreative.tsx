import type { User } from '../store/authStore';
import { motion } from 'framer-motion';

export interface PortfolioProps { user: User; }

export default function TemplateCreative({ user }: PortfolioProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C363F] font-serif overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="fixed top-[-20vw] right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-[#E8F0E5] mix-blend-multiply opacity-70 pointer-events-none" />
      <div className="fixed bottom-[-20vw] left-[-10vw] w-[50vw] h-[50vw] rounded-full bg-[#F3E8E6] mix-blend-multiply opacity-70 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 border-b-2 border-[#2C363F] pb-12">
          <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-6xl md:text-9xl font-normal italic tracking-tighter mb-6 md:mb-0">
            {user.name}
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-right max-w-sm">
            <p className="text-lg font-sans uppercase tracking-widest text-[#899878]">Creative Developer</p>
            <p className="text-sm font-sans mt-2 leading-relaxed">Bridging the gap between design and engineering to build memorable digital experiences.</p>
            <a href={`mailto:${user.email}`} className="inline-block mt-4 text-sm font-sans underline decoration-2 underline-offset-4 hover:text-[#899878] transition-colors">Contact Me</a>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-12 gap-16">
          
          {/* Skills Column */}
          <div className="md:col-span-4 space-y-16">
            <section>
              <h2 className="text-4xl italic mb-8">Competencies</h2>
              <div className="flex flex-col gap-4 font-sans text-sm">
                {user.skills?.map((skill, i) => (
                  <div key={i} className="flex items-center gap-4 border-t border-[#2C363F]/20 pt-4">
                    <span className="text-[#899878]">0{i + 1}</span>
                    <span className="uppercase tracking-widest">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Projects Column */}
          <div className="md:col-span-8 space-y-24">
            <h2 className="text-4xl italic">Selected Works</h2>
            {user.projects?.map((project, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/9] w-full bg-[#E5E0D8] mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#2C363F] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out opacity-10" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-normal mb-3 group-hover:italic transition-all">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 font-sans text-xs uppercase tracking-widest text-[#899878]">
                      {project.technologies.join(' / ')}
                    </div>
                  </div>
                  <p className="font-sans text-sm max-w-sm text-right leading-relaxed text-[#2C363F]/70">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
