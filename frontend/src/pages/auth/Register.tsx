import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Oops, something went wrong creating your account.");
      
      login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-100 selection:text-primary font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full max-w-[1000px] bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row-reverse"
      >
        {/* Right Side - Humanized Branding */}
        <div className="md:w-5/12 bg-primary p-12 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
          {/* Soft animated background pattern */}
          <motion.div 
            animate={{ 
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="absolute inset-0 opacity-[0.07]" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '32px 32px' }}
          ></motion.div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ x: 20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-12"
            >
              <motion.div 
                whileHover={{ rotate: -15, scale: 1.1 }}
                className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner cursor-pointer"
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-bold text-2xl tracking-tight">VentureTwin</span>
            </motion.div>
            
            <motion.h2 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="text-4xl font-extrabold leading-tight mb-5"
            >
              Let's build something amazing together. 
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="text-blue-100 text-lg leading-relaxed font-medium"
            >
              Join thousands of friendly professionals and founders who are accelerating their growth with their own Digital Twins.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6 }}
            className="relative z-10 flex items-center gap-3 text-sm text-blue-200 font-medium bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              {/* <Sparkles className="w-5 h-5 text-blue-100" /> */}
            </motion.div>
            Takes less than 30 seconds to set up.
          </motion.div>
        </div>

        {/* Left Side - Humanized Form */}
        <div className="md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white relative z-20">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="md:hidden flex items-center gap-2 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900">VentureTwin</span>
            </div>
            
            <motion.h3 variants={itemVariants} className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Join VentureTwin today</motion.h3>
            <motion.p variants={itemVariants} className="text-slate-500 mb-10 text-base">Tell us a little bit about yourself so we can tailor your twin to your unique goals.</motion.p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium flex items-center gap-2 overflow-hidden"
                  >
                    <span className="text-xl">🤔</span> {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div variants={itemVariants} className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1">What should we call you?</label>
                <div className="relative">
                  <motion.div className="absolute left-4 top-3.5">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </motion.div>
                  <Input 
                    type="text" 
                    required 
                    placeholder="Enter your name.."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl text-base shadow-sm transition-all focus:bg-white focus:shadow-md"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1">Your Email Address</label>
                <div className="relative">
                  <motion.div className="absolute left-4 top-3.5">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </motion.div>
                  <Input 
                    type="email" 
                    required 
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl text-base shadow-sm transition-all focus:bg-white focus:shadow-md"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1">Create a Password</label>
                <div className="relative">
                  <motion.div className="absolute left-4 top-3.5">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </motion.div>
                  <Input 
                    type="password" 
                    required 
                    placeholder="Make it a strong one!"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl text-base shadow-sm transition-all focus:bg-white focus:shadow-md"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2 group">
                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <motion.div className="absolute left-4 top-3.5">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </motion.div>
                  <Input 
                    type="password" 
                    required 
                    placeholder="Type your password again"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary rounded-xl text-base shadow-sm transition-all focus:bg-white focus:shadow-md"
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-blue-700 text-white text-base font-semibold rounded-xl shadow-md shadow-blue-900/20 mt-4 transition-all">
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Bot className="w-5 h-5" />
                    </motion.div>
                  ) : "Create my AI Twin account"}
                </Button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center">
              <div className="relative flex py-6 items-center w-full">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Already have a twin?</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors rounded-xl font-semibold text-base shadow-sm" onClick={() => navigate('/login')}>
                  Sign in to your account
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
