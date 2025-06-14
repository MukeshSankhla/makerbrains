
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {Github, Linkedin, Instagram, Youtube } from "lucide-react";
import profileImage from "/src/images/profile.png";

const PortfolioHero = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Social media links
  const socialLinks = [
    { icon: <Github className="w-5 h-5" />, name: "GitHub", url: "https://github.com/MukeshSankhla" },
    { icon: <Linkedin className="w-5 h-5" />, name: "LinkedIn", url: "https://www.linkedin.com/in/mukeshsankhla/" },
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "https://www.instagram.com/makerbrains_official/" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", url: "https://www.youtube.com/@makerbrains" },
  ];

  return (
    <section className="relative overflow-hidden py-16">

      <div className="container relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Left content: Text and CTA */}
          <motion.div className="lg:col-span-3 space-y-6" variants={itemVariants}>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold" 
              variants={itemVariants}
            >
              Hi, I'm <span className="text-primary">Mukesh Sankhla</span>
            </motion.h1>
            <motion.p 
              className="text-xl"
              variants={itemVariants}
            >
              Full-Stack Developer | IoT Specialist | Maker | Educator | MVP Prototyping Expert
            </motion.p>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              variants={itemVariants}
            >
              I transform ideas into intelligent solutions through full-stack development, IoT innovations, and educational content. Building the future one project at a time.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  Get in Touch
                </Button>
              </Link>
              
              {/* Social Media Links */}
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <Button variant="outline" size="icon" className="rounded-full">
                      {link.icon}
                    </Button>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right content: Profile image with animated border */}
          <motion.div 
            className="lg:col-span-2 flex justify-center lg:justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Animated elements around profile */}
              <motion.div 
                className="absolute inset-0 border-2 border-primary/30 rounded-lg"
                style={{ margin: "-10px" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="absolute inset-0 border-2 border-secondary/20 rounded-lg"
                style={{ margin: "-20px" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Rectangular profile image */}
              <motion.div 
                className="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden rounded-lg border-4 border-white/20 dark:border-white/10 shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={profileImage} 
                  alt="Mukesh Sankhla" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioHero;
