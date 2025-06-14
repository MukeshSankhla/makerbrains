import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Cpu, Zap, Layers, Box, Code, Wifi, Monitor, Settings, Server } from "lucide-react";
import cover from "../images/cover.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RevealLinks = () => {
  return (
    <div className="relative overflow-hidden ">
      {/* Background Animations */}
      <CircuitBackground />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
  {/* Text content - will stack above image on mobile */}
  <div className="md:col-span-2 order-1 md:order-none">
    <h1 className="text-4xl md:text-6xl font-bold relative inline-block">Maker Brains</h1>
    <h2 className="text-xl md:text-2xl font-bold relative inline-block mt-2">Simplifying technology through hands-on learning.</h2>
    <h3 className="text-base md:text-lg mt-4">
      Creating high-quality tutorials, projects, and insights on electronics, IoT, robotics, CAD, 
      3D printing, and software development. Empowering students, professionals, and makers 
      with practical, accessible, and inspiring content.
    </h3>
    <div className="mt-6">
      <Link to="/contact">
        <Button size="lg" className="gap-2">
          Get in Touch
        </Button>
      </Link>
    </div>
  </div>
  
  {/* Image - will wrap below text on mobile */}
  <div className="col-span-1 p-4 md:p-6 order-2 md:order-none">
    <img 
      src={cover} 
      alt="Cover" 
      className="w-full h-auto md:h-full object-cover rounded-2xl shadow-lg" 
    />
  </div>
</div>
    </div>
  );
};

const DURATION = 0.1;

// Circuit background animation component
const CircuitBackground = () => {
  const [animationKey, setAnimationKey] = useState(0);

  // Refresh animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Nodes for circuit paths
  
  // Tech icons floating around
  const techIcons = [
    { Icon: Cpu, top: "15%", left: "40%", delay: 0, duration: 18 },
    { Icon: Zap, top: "25%", left: "65%", delay: 2, duration: 20 },
    { Icon: Layers, top: "65%", left: "45%", delay: 1, duration: 16 },
    { Icon: Box, top: "75%", left: "60%", delay: 3, duration: 22 },
    { Icon: Code, top: "45%", left: "30%", delay: 2.5, duration: 19 },
    { Icon: Wifi, top: "35%", left: "55%", delay: 1.5, duration: 17 },
    { Icon: Monitor, top: "55%", left: "70%", delay: 0.8, duration: 21 },
    { Icon: Settings, top: "85%", left: "35%", delay: 2.2, duration: 20 },
    { Icon: Server, top: "10%", left: "60%", delay: 1.8, duration: 19 }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden -z-10">
      {/* Floating tech icons */}
      {techIcons.map((item, i) => {
        const { Icon, top, left, delay, duration } = item;
        return (
          <motion.div
            key={`icon-${i}-${animationKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 0.7, 0.7, 0],
              y: [20, 0, 0, -20],
              x: [0, 20, -20, 0],
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute"
            style={{ top, left }}
          >
            <Icon className="opacity-70" size={28} />
          </motion.div>
        );
      })}
      
      {/* Binary code floating in background */}
      {Array(20).fill(0).map((_, i) => (
        <motion.div 
          key={`binary-${i}-${animationKey}`}
          className="absolute text-xs text-gray-400"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0],
            y: [0, -100]
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        >
          {Array(10).fill(0).map((_, j) => (
            <div key={j}>{Math.random() > 0.5 ? "1" : "0"}{Math.random() > 0.5 ? "0" : "1"}{Math.random() > 0.5 ? "1" : "0"}</div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default RevealLinks;