import Link from 'next/link';
import { Bot, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg font-headline">Cognition</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The future of data science, delivered to your inbox.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/articles" className="text-muted-foreground hover:text-primary transition-colors">Articles</Link></li>
              <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Social</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="py-6 border-t border-border/40 flex justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Cognition. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
