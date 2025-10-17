'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { Article } from '@/lib/data';
import ArticleCard from '@/components/shared/article-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const FeaturedArticles = () => {
  const db = useFirestore();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const fetchFeaturedArticles = async () => {
      setLoading(true);
      const articlesRef = collection(db, 'articles');
      const q = query(articlesRef, where('featured', '==', true), limit(5));
      try {
        const querySnapshot = await getDocs(q);
        const articles: Article[] = [];
        querySnapshot.forEach((doc) => {
          articles.push({ id: doc.id, ...doc.data() } as Article);
        });
        setFeaturedArticles(articles);
      } catch (error) {
        console.error('Error fetching featured articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, [db]);

  if (loading) {
    return (
        <section className="py-16 md:py-24 bg-transparent">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 font-headline">
                    Featured Insights
                </h2>
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-1">
                                <Skeleton className="h-[450px] w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
  }
  
  if (featuredArticles.length === 0) {
    return null; // Don't show the section if there are no featured articles
  }

  return (
    <motion.section 
        className="py-16 md:py-24 bg-transparent"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">
          Featured Insights
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: featuredArticles.length > 1,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredArticles.map((article, index) => (
               <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                 <motion.div 
                    className="p-1 h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                   <ArticleCard article={article} />
                 </motion.div>
               </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </motion.section>
  );
};

export default FeaturedArticles;
