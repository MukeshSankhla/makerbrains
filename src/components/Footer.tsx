
import { Youtube, Github, Linkedin, Instagram, Mail } from "lucide-react"; 
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-8 border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            <span>© Maker Brains | {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6">
            <a href="https://www.youtube.com/@makerbrains" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-transform hover:scale-110">
              <Youtube className="w-5 h-5 hover:text-red-600 transition-colors" />
            </a>
            <a href="https://github.com/MukeshSankhla" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-transform hover:scale-110">
              <Github className="w-5 h-5 hover:text-maker-darkgray transition-colors" />
            </a>
            <a href="https://www.linkedin.com/in/mukeshsankhla/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-transform hover:scale-110">
              <Linkedin className="w-5 h-5 hover:text-blue-500 transition-colors" />
            </a>
            <a href="https://www.instagram.com/makerbrains_official/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-transform hover:scale-110">
              <Instagram className="w-5 h-5 hover:text-pink-600 transition-colors" />
            </a>
            <Link to="/contact" aria-label="Contact" className="transition-transform hover:scale-110">
              <Mail className="w-5 h-5 hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
