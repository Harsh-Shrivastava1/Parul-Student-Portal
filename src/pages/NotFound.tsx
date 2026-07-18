import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Page Not Found</h1>
        <p className="text-zinc-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2 border-zinc-300">
            <ArrowLeft size={16} />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Home size={16} />
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
