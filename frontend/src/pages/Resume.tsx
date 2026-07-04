import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Resume() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  
  const [activeTab, setActiveTab] = useState<'document' | 'text'>('document');
  const [resumeText, setResumeText] = useState(user?.resumeText || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);

  const parsingSteps = [
    "Scanning document...",
    "Extracting skills...",
    "Analyzing experience...",
    "Building Digital Twin..."
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setParsingStep(0);

    // Simulate parsing steps visually while uploading
    const stepInterval = setInterval(() => {
      setParsingStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:3000/api/users/resume/file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      let data;
      const isJson = response.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: `Server error: ${response.statusText}` };
      }

      if (response.ok && user) {
        login({ ...user, resumeUrl: data.resumeUrl });
        toast.success('Resume uploaded successfully!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('An error occurred during upload');
    } finally {
      clearInterval(stepInterval);
      setIsUploading(false);
    }
  };

  const handleDeleteResume = () => {
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/resume/file', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      const data = await response.json();
      if (response.ok && user) {
        login({ ...user, resumeUrl: '' });
        toast.success('Resume deleted successfully');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!resumeText.trim()) return;

    setIsUploading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/resume/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ text: resumeText })
      });

      const data = await response.json();
      if (response.ok && user) {
        login({ ...user, resumeText: data.resumeText });
        toast.success('Text resume saved successfully!');
      } else {
        toast.error(data.message || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving text resume:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Resume & Experience</h1>
        <p className="text-slate-500">Upload your PDF resume or paste your experience text to train your Digital Twin.</p>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('document')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'document' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Document Upload (PDF)
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'text' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Raw Text Entry
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'document' && (
          <motion.div
            key="document"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                <CardTitle className="text-lg">Upload PDF Resume</CardTitle>
                <CardDescription>We will parse this document to build your AI knowledge base.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {user?.resumeUrl ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Active Resume PDF</h4>
                        <p className="text-sm text-slate-500">Successfully uploaded and parsed.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3" onClick={handleDeleteResume} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" className="border-slate-200 bg-white" onClick={() => window.open(user.resumeUrl, '_blank')}>
                        View File
                      </Button>
                    </div>
                  </div>
                ) : isUploading ? (
                  <div className="border border-slate-200 rounded-2xl flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50">
                    <div className="w-full max-w-sm space-y-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-primary relative">
                          <Loader2 className="w-6 h-6 animate-spin text-primary relative z-10" />
                          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {parsingSteps[parsingStep]}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((parsingStep + 1) / 4) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <span>Step {parsingStep + 1} of 4</span>
                          <span>{Math.round(((parsingStep + 1) / 4) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center py-16 px-4 bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Click to upload or drag and drop</h3>
                    <p className="text-sm text-slate-500 text-center max-w-xs">PDF format only. Maximum file size is 5MB.</p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'text' && (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
                <CardTitle className="text-lg">Paste Resume Text</CardTitle>
                <CardDescription>Don't have a PDF? Just paste your LinkedIn summary or raw resume text here.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Textarea 
                  placeholder="Paste your experience, education, and skills here..." 
                  className="min-h-[300px] bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl p-4 resize-y text-slate-700 leading-relaxed"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <div className="flex items-center justify-end pt-2">
                  <Button 
                    className="bg-primary hover:bg-blue-700 text-white rounded-xl shadow-sm px-8" 
                    onClick={handleTextSubmit}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Text Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Delete Resume?</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to permanently delete your resume? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full pt-6">
                  <Button variant="outline" className="flex-1 border-slate-200" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={executeDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
