'use client';

import { useEffect, useState, use } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ArticleCard from '@/components/shared/article-card';
import { notFound } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Article } from '@/lib/data';
import { CATEGORIES } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const db = useFirestore();
  const resolvedParams = use(params);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const decodedCategory = decodeURIComponent(resolvedParams.category as string);
  const categoryName = CATEGORIES.find(c => c.toLowerCase() === decodedCategory) || decodedCategory;

  useEffect(() => {
    if (!db) return;

    // Check if the category is valid
    if (!CATEGORIES.map(c => c.toLowerCase()).includes(decodedCategory)) {
        notFound();
        return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      const articlesRef = collection(db, 'articles');
      const q = query(articlesRef, where('category', '==', categoryName));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedArticles: Article[] = [];
        querySnapshot.forEach((doc) => {
          fetchedArticles.push({ id: doc.id, ...doc.data() } as Article);
        });
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles by category: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [db, decodedCategory, categoryName]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <p className="text-sm text-primary font-semibold uppercase tracking-wider">Category</p>
              <h1 className="text-4xl font-bold font-headline capitalize">
                {categoryName}
              </h1>
            </motion.div>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-[450px] w-full" />
                    ))}
                </div>
            ) : articles.length > 0 ? (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    className="text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p>No articles found in this category yet.</p>
                </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
