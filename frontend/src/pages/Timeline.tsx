import React from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Award, Briefcase, Code, GraduationCap, MapPin, Calendar, CircleDot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Timeline() {
  const { user } = useAuthStore();

  if (!user) return null;

  // Aggregate data for the timeline
  const timelineItems: any[] = [];

  if (user.timeline && user.timeline.length > 0) {
    user.timeline.forEach((item) => {
      let icon, color;
      if (item.type === 'project') {
        icon = <Code className="w-5 h-5 text-blue-600" />;
        color = 'bg-blue-100 border-blue-200 text-blue-800';
      } else if (item.type === 'skill') {
        icon = <Briefcase className="w-5 h-5 text-purple-600" />;
        color = 'bg-purple-100 border-purple-200 text-purple-800';
      } else {
        icon = <Award className="w-5 h-5 text-emerald-600" />;
        color = 'bg-emerald-100 border-emerald-200 text-emerald-800';
      }
      
      timelineItems.push({
        type: item.type,
        title: item.title,
        description: item.description,
        date: item.year, // "2021" or "Oct 2022"
        icon,
        color
      });
    });
    
    // Sort chronologically (newest first). Since dates might just be years or strings, we'll try a basic string sort, 
    // or convert to Date if possible. String reverse sort works for simple years like "2023", "2021".
    timelineItems.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    // Fallback: Add projects
    user.projects?.forEach((p: any) => {
      timelineItems.push({
        type: 'project',
        title: p.title,
        description: p.description,
        date: p.date || new Date().toISOString().split('T')[0],
        icon: <Code className="w-5 h-5 text-blue-600" />,
        color: 'bg-blue-100 border-blue-200 text-blue-800'
      });
    });

    // Add certifications
    user.certifications?.forEach((c: any) => {
      timelineItems.push({
        type: 'certification',
        title: c.name,
        description: `Issued by: ${c.issuer}`,
        date: c.date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: <Award className="w-5 h-5 text-emerald-600" />,
        color: 'bg-emerald-100 border-emerald-200 text-emerald-800'
      });
    });

    // Add achievements
    user.achievements?.forEach((a: any) => {
      timelineItems.push({
        type: 'achievement',
        title: a.title,
        description: a.description,
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
        color: 'bg-purple-100 border-purple-200 text-purple-800'
      });
    });

    // Sort chronologically (newest first)
    timelineItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <MapPin className="w-8 h-8 text-primary" /> Career Timeline
        </h1>
        <p className="text-slate-500 mt-1">A chronological overview of your projects, certifications, and achievements.</p>
      </div>

      {timelineItems.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-3xl">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900">Your timeline is empty</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Add projects, certifications, or achievements to your portfolio to start building your timeline.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-6 md:ml-12 pl-8 md:pl-12 space-y-12">
          {timelineItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[45px] md:-left-[61px] w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.color}`}>
                {item.icon}
              </div>

              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.color}`}>
                      {item.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> {item.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Bottom Dot */}
          <div className="absolute -left-[11px] bottom-0 transform translate-y-full pt-4">
            <CircleDot className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      )}
    </div>
  );
}
