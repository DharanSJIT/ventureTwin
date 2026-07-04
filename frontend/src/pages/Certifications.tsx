import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Award, AlertCircle, Building2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Certifications() {
  const user = useAuthStore((state) => state.user);
  const certifications = user?.certifications || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Certifications</h1>
        <p className="text-slate-500">Your extracted professional certifications and courses.</p>
      </div>

      {!certifications.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-slate-200 shadow-sm bg-amber-50/50">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Certifications Found</h3>
                <p className="text-slate-500 max-w-md mt-2">
                  We haven't extracted any certifications yet. Upload a resume or paste your text profile to auto-generate this section.
                </p>
              </div>
              <Link
                to="/resume"
                className="mt-4 px-6 py-2 bg-primary text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 transition-colors"
              >
                Go to Resume
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full border-slate-200 shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-slate-900 leading-tight">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col justify-end space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {cert.issuer}
                  </div>
                  {cert.date && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {cert.date}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
