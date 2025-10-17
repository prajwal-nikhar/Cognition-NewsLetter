'use client';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';
import ThreeVisualization from "./three-visualization";

const HeroSection = () => {

    const handleSubscribeClick = () => {
        const newsletterSection = document.getElementById('newsletter-signup');
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

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

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
                <motion.div 
                    className="container mx-auto px-4 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-headline tracking-tighter"
                        variants={itemVariants}
                    >
                        The Frontier of Data Science
                    </motion.h1>
                    <motion.p 
                        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                        variants={itemVariants}
                    >
                        Stay ahead of the curve with Cognition, your source for curated insights and breakthroughs in AI, machine learning, and beyond.
                    </motion.p>
                    <motion.div 
                        className="flex justify-center gap-4"
                        variants={itemVariants}
                    >
                        <Link href="/articles">
                            <Button size="lg">
                                Explore Articles
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" onClick={handleSubscribeClick}>
                            Subscribe Now
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
