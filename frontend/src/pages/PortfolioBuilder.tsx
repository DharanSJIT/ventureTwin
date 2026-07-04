import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { templates } from '../templates/TemplateRegistry';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PortfolioBuilder() {
  const { user, login } = useAuthStore();
  const [activeTemplate, setActiveTemplate] = useState(user?.activeTemplate || 'modern');
  const [username, setUsername] = useState(user?.username || '');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isSavingUsername, setIsSavingUsername] = useState(false);

  // Preview component based on selection (safely fallback to modern if not found)
  const safeTemplateId = templates[activeTemplate] ? activeTemplate : 'modern';
  const PreviewComponent = templates[safeTemplateId].component;

  const saveTemplate = async (templateId: string) => {
    setActiveTemplate(templateId);
    setIsSavingTemplate(true);
    try {
      const token = user?.token;
      const res = await fetch('http://localhost:3000/api/users/template', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });
      if (res.ok && user) {
        login({ ...user, activeTemplate: templateId });
        toast.success('Template saved successfully!');
      } else {
        toast.error('Failed to save template');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const saveUsername = async () => {
    if (!username.trim()) return toast.error('Username cannot be empty');
    setIsSavingUsername(true);
    try {
      const token = user?.token;
      const res = await fetch('http://localhost:3000/api/users/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: username.trim().toLowerCase() })
      });
      const data = await res.json();
      if (res.ok && user) {
        login({ ...user, username: data.username });
        toast.success('Username claimed successfully!');
      } else {
        toast.error(data.message || 'Failed to claim username');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setIsSavingUsername(false);
    }
  };

  const publicUrl = user?.username ? `http://localhost:5173/p/${user.username}` : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Portfolio Builder</h1>
          <p className="text-slate-500 mt-1">Select a template to instantly publish your live portfolio.</p>
        </div>
      </div>

      {/* Claim URL Settings */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Your Live URL</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Claim your unique username</Label>
              <div className="flex relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-medium">venturetwin.com/p/</span>
                <Input 
                  className="pl-[145px] bg-slate-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                />
              </div>
            </div>
            <Button onClick={saveUsername} disabled={isSavingUsername} className="bg-slate-900 text-white w-full sm:w-32">
              {isSavingUsername ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save URL'}
            </Button>
          </div>
          
          {publicUrl && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <LinkIcon className="w-4 h-4" />
                <a href={publicUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {publicUrl}
                </a>
              </div>
              <Badge variant="outline" className="bg-white text-blue-700 border-blue-200">Live</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Template Selection Panel */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Select Theme</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(templates).map(([id, template]) => (
              <div 
                key={id}
                onClick={() => saveTemplate(id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  activeTemplate === id 
                    ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900">{template.name}</h4>
                  {activeTemplate === id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-t-xl p-3 flex items-center gap-2 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="mx-auto text-xs text-slate-400 font-mono tracking-wider">Live Preview</div>
          </div>
          <div className="border-x border-b border-slate-200 rounded-b-xl overflow-hidden h-[800px] relative overflow-y-auto bg-white shadow-inner">
             {/* Render the selected template and pass the user's current data */}
             {user && <PreviewComponent user={user} />}
          </div>
        </div>

      </div>
    </div>
  );
}

// Inline badge component for missing imports
const Badge = ({ children, className }: any) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);
