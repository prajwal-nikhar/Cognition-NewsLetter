'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useFirestore, useUser } from '@/firebase';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import type { Article } from '@/lib/data';
import ArticleCard from '@/components/shared/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArticlesPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && db) {
      const checkAdminRole = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      };
      checkAdminRole();
    } else {
      setIsAdmin(false);
    }
  }, [user, db]);

  useEffect(() => {
    if (!db) return;
    const fetchArticles = async () => {
      setLoading(true);
      const articlesRef = collection(db, 'articles');
      const q = query(articlesRef, orderBy('date', 'desc'));
      try {
        const querySnapshot = await getDocs(q);
        const fetchedArticles: Article[] = [];
        querySnapshot.forEach((doc) => {
          fetchedArticles.push({ id: doc.id, ...doc.data() } as Article);
        });
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
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

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div 
                className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-center sm:text-left font-headline">
                All Articles
              </h1>
              {isAdmin && (
                <Link href="/admin/create-article" passHref>
                  <Button>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Publish New Article
                  </Button>
                </Link>
              )}
            </motion.div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[450px] w-full" />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
