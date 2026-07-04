import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Key, LogOut, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'GU';
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/api/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok && user) {
        // Update global state with new profile image URL
        login({ ...user, profileImage: data.profileImage });
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500">Manage your profile, security preferences, and VentureTwin configurations.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Nav (Simulated) */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-blue-50 text-primary font-medium hover:bg-blue-100/50">
            <User className="w-4 h-4" /> Profile Details
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <Shield className="w-4 h-4" /> Security & Privacy
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <Bell className="w-4 h-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <Key className="w-4 h-4" /> API Keys
          </Button>
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm rounded-[16px] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6">
              <CardTitle className="text-lg">Public Profile</CardTitle>
              <CardDescription>This is how others will see you on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border border-slate-200 shadow-sm">
                  <AvatarImage src={user?.profileImage || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    disabled={isUploading}
                  />
                  <Button 
                    variant="outline" 
                    className="mb-2 border-slate-200"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Change Avatar
                  </Button>
                  <p className="text-xs text-slate-500">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">Display Name</label>
                  <Input 
                    defaultValue={user?.name || ''} 
                    className="bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      readOnly
                      value={user?.email || ''} 
                      className="pl-9 bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button className="bg-primary hover:bg-blue-700 text-white rounded-xl shadow-sm px-6">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-sm rounded-[16px] overflow-hidden">
            <CardHeader className="bg-red-50/50 border-b border-red-100 pb-4">
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Logging out will clear your active session. Deleting your account will permanently erase your Digital Twin.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-slate-200 text-slate-700 rounded-xl" onClick={() => { logout(); window.location.href = '/login'; }}>
                  <LogOut className="w-4 h-4 mr-2" /> Log out of all devices
                </Button>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 rounded-xl shadow-sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
