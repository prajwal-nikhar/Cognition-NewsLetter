'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Image from 'next/image';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
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
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-transparent">
          <motion.div 
            className="container mx-auto px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-4xl mx-auto">
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <Bot className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold font-headline">About Cognition</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Your source for curated insights and breakthroughs in AI, machine learning, and beyond.
                </p>
              </motion.div>

              <motion.div className="prose prose-lg dark:prose-invert mx-auto max-w-none text-foreground" variants={itemVariants}>
                <p>
                  Cognition was founded on the principle that knowledge in the rapidly-evolving field of data science should be accessible, insightful, and forward-thinking. We are a team of data scientists, researchers, and writers passionate about demystifying the complexities of artificial intelligence, big data, and machine learning.
                </p>
                <p>
                  Our mission is to provide our readers with a curated stream of high-quality articles that not only inform but also inspire. Whether you're a seasoned professional, a student just starting your journey, or simply a curious mind, Cognition is your guide to navigating the frontier of data science.
                </p>
              </motion.div>
                
              <motion.div className="relative my-12 h-64 md:h-80 rounded-lg overflow-hidden" variants={itemVariants}>
                  <Image
                      src="https://picsum.photos/seed/about-us/1200/400"
                      alt="Our team at work"
                      fill
                      style={{ objectFit: 'cover' }}
                      data-ai-hint="team collaboration"
                  />
              </motion.div>

              <motion.div className="prose prose-lg dark:prose-invert mx-auto max-w-none text-foreground" variants={itemVariants}>
                <h2 className="font-headline text-3xl">Our Vision</h2>
                <p>
                  We envision a future where data-driven decisions are made ethically and effectively, where the potential of AI is harnessed for the betterment of society. Through our publication, we aim to foster a community of learners and innovators who are equipped to tackle the challenges and seize the opportunities of the digital age.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
