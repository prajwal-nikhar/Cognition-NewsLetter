'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Article } from '@/lib/data';
import ArticleCard from '@/components/shared/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const RecentArticles = () => {
  const db = useFirestore();
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const fetchRecentArticles = async () => {
      setLoading(true);
      const articlesRef = collection(db, 'articles');
      const q = query(articlesRef, orderBy('date', 'desc'), limit(6));
      try {
        const querySnapshot = await getDocs(q);
        const articles: Article[] = [];
        querySnapshot.forEach((doc) => {
          articles.push({ id: doc.id, ...doc.data() } as Article);
        });
        setRecentArticles(articles);
      } catch (error) {
        console.error('Error fetching recent articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentArticles();
  }, [db]);

  const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: {
              staggerChildren: 0.1
          }
      }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Latest Publications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[450px] w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
        className="py-16 md:py-24 bg-secondary/30"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-headline">
          Latest Publications
        </h2>
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RecentArticles;
