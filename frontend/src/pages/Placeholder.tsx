import { useLocation } from 'react-router-dom';
import { Bot, Hammer } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Placeholder() {
  const location = useLocation();
  const pageName = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-blue-100"
      >
        <Hammer className="w-10 h-10 text-primary" />
      </motion.div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
        {pageName} Module
      </h1>
      <p className="text-xl text-slate-500 max-w-lg mb-8 leading-relaxed">
        This section of VentureTwin is currently under active construction by your AI agents. Check back soon!
      </p>
      <div className="flex items-center gap-2 text-sm font-medium text-primary bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
        <Bot className="w-4 h-4" />
        AI is writing the code for this...
      </div>
    </div>
  );
}
