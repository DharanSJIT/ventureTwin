import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hi! Tell me about a new project, skill, or certification you want to add to your portfolio.' }
  ]);
  const { login, user } = useAuthStore();

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsSending(true);

    try {
      const token = user?.token;
      const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });

      const data = await res.json();
      
      if (res.ok && user) {
        if (data.user) {
          login({ ...user, ...data.user });
          toast.success('Portfolio updated dynamically!');
        }
        setChatHistory(prev => [...prev, { role: 'ai', text: data.message }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', text: data.message || 'Error updating portfolio.' }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Network error occurred.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center z-50 hover:bg-primary/90 transition-colors"
      >
        <Bot className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 z-50"
          >
            <Card className="flex flex-col h-[500px] shadow-2xl border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                <div className="flex items-center gap-2 font-semibold">
                  <Bot className="w-5 h-5" />
                  Portfolio AI Builder
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <Input 
                  placeholder="I just built a new React app..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 focus-visible:ring-primary/20"
                />
                <Button onClick={handleSend} disabled={isSending || !message.trim()} size="icon" className="shrink-0 bg-primary hover:bg-primary/90 text-white">
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
