'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CATEGORIES } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoriesPage() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.h1 
                className="text-4xl font-bold text-center mb-12 font-headline"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              Categories
            </motion.h1>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
              {CATEGORIES.map((category) => (
                <motion.div key={category} variants={itemVariants}>
                    <Link href={`/categories/${encodeURIComponent(category.toLowerCase())}`}>
                    <Card className="h-full transform hover:-translate-y-1 transition-transform duration-300 ease-in-out group">
                        <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {category}
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-muted-foreground text-sm">
                            Explore articles in the {category} category.
                        </p>
                        </CardContent>
                    </Card>
                    </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
