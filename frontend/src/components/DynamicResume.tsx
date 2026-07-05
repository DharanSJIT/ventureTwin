import React from 'react';

interface DynamicResumeProps {
  user: any;
}

export const DynamicResume = React.forwardRef<HTMLDivElement, DynamicResumeProps>(
  ({ user }, ref) => {
    if (!user) return null;

    return (
      <div 
        ref={ref}
        className="w-[800px] min-h-[1100px] bg-white p-12 shadow-sm text-slate-800 mx-auto"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight">
            {user.name || 'Your Name'}
          </h1>
          <div className="flex gap-4 mt-2 text-sm text-slate-600">
            {user.email && <span>{user.email}</span>}
            {user.location && <span>• {user.location}</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="col-span-2 space-y-8">
            
            {/* Experience or Summary placeholder (since we don't have structured experience yet, we can use resumeText snippet if needed, or projects) */}
            {user.projects && user.projects.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">
                  Projects & Experience
                </h2>
                <div className="space-y-6">
                  {user.projects.map((project: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {project.title || project.name || 'Project'}
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-2 text-sm text-slate-500">
                          <span className="font-semibold text-slate-700">Tech:</span> {project.technologies.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Achievements */}
            {user.achievements && user.achievements.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">
                  Achievements
                </h2>
                <ul className="list-disc list-outside ml-4 space-y-2">
                  {user.achievements.map((achievement: any, index: number) => (
                    <li key={index} className="text-sm text-slate-700 leading-relaxed pl-1">
                      {typeof achievement === 'string' ? achievement : achievement.title || achievement.description}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="col-span-1 space-y-8">
            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill: string, index: number) => (
                    <span 
                      key={index} 
                      className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {user.certifications && user.certifications.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wider">
                  Certifications
                </h2>
                <div className="space-y-4">
                  {user.certifications.map((cert: any, index: number) => (
                    <div key={index}>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {cert.name || cert.title}
                      </h3>
                      {cert.issuer && (
                        <p className="text-xs text-slate-500">{cert.issuer}</p>
                      )}
                      {cert.year && (
                        <p className="text-xs text-slate-500">{cert.year}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DynamicResume.displayName = 'DynamicResume';
