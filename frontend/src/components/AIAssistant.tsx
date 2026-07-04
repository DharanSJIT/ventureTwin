import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { Bot, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);

  const { login, user } = useAuthStore();

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        // Optional: auto-send after voice recognition
        // handleSendWithText(transcript); 
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        toast.error("Microphone access denied or unavailable.");
      }
    }
  };

  const speak = (text: string) => {
    if (!isVoiceOutputEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

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
        let updatedUser = data.user;
        let triggersConfetti = !!updatedUser;

        // Failsafe: If backend returned raw function string instead of processing it
        console.log("[AI Raw Message]:", data.message);
        
        // Let's try a more robust regex that finds any JSON looking thing after update_ui_state
        const functionMatch = data.message ? data.message.match(/<function>\s*update_ui_state\s*\(?\s*({[\s\S]*?})\s*\)?\s*<\/function>/s) : null;
        console.log("[Regex Match]:", functionMatch);
        
        if (functionMatch && !updatedUser) {
          try {
            let jsonStr = functionMatch[1].trim();
            // In case it's wrapped in backticks
            if (jsonStr.startsWith('`')) {
               jsonStr = jsonStr.replace(/^`+|`+$/g, '').trim();
               if (jsonStr.startsWith('json')) jsonStr = jsonStr.slice(4).trim();
            }
            console.log("[Parsed JSON String]:", jsonStr);
            
            const payload = JSON.parse(jsonStr);
            updatedUser = { ...user };
            
            if (payload.action === 'ADD_SKILL' && payload.payload?.skills) {
              updatedUser.skills = [...new Set([...(updatedUser.skills || []), ...payload.payload.skills])];
              triggersConfetti = true;
            }
          } catch (e) {
            console.error("Failed to parse local function call", e);
          }
        }

        if (updatedUser) {
          login({ ...user, ...updatedUser });
          toast.success('Portfolio updated dynamically!');
          
          if (triggersConfetti) {
            // Trigger Level-Up Particles
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.8 },
              colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
            });
          }
        }
        
        let finalMessage = (data.message || "").replace(/<function>[\s\S]*?<\/function>/g, '').trim();
        if (!finalMessage) {
           finalMessage = "I've successfully updated your portfolio!";
        }
        setChatHistory(prev => [...prev, { role: 'ai', text: finalMessage }]);
        speak(finalMessage);
      } else {
        const errorMsg = data.message || 'Error updating portfolio.';
        setChatHistory(prev => [...prev, { role: 'ai', text: errorMsg }]);
        speak(errorMsg);
      }
    } catch (err) {
      const networkError = 'Network error occurred.';
      setChatHistory(prev => [...prev, { role: 'ai', text: networkError }]);
      speak(networkError);
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
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${!isVoiceOutputEnabled ? 'text-primary-foreground/50' : 'text-primary-foreground'} hover:bg-primary-foreground/20`}
                    onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)}
                    title={isVoiceOutputEnabled ? "Mute voice output" : "Enable voice output"}
                  >
                    {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
                {chatHistory.map((msg, i) => {
                  const safeText = msg.text || '';
                  const cleanText = safeText.replace(/<function>[\s\S]*?<\/function>/g, '').trim();
                  if (!cleanText) return null; // Don't render empty bubbles
                  
                  return (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'}`}>
                        {cleanText}
                      </div>
                    </div>
                  );
                })}
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
                <Button 
                  onClick={toggleListening} 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className={`shrink-0 ${isListening ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  title={isListening ? "Stop listening" : "Start speaking"}
                >
                  {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
                </Button>
                
                <Input 
                  placeholder={isListening ? "Listening..." : "I just built a new React app..."} 
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
