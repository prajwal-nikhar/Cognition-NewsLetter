'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot } from "lucide-react";
import { motion } from 'framer-motion';

const NewsletterSignup = () => {
    return (
        <motion.section 
            id="newsletter-signup" 
            className="py-16 md:py-24 bg-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <Bot className="mx-auto h-12 w-12 text-primary mb-4" />
                    <h2 className="text-3xl font-bold mb-4 font-headline">
                        Stay on the Bleeding Edge
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Subscribe to our newsletter and get the latest data science news, articles, and resources delivered directly to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="h-12 text-base"
                            required 
                        />
                        <Button type="submit" size="lg" className="h-12">
                            Subscribe
                        </Button>
                    </form>
                </div>
            </div>
        </motion.section>
    );
};

export default NewsletterSignup;
