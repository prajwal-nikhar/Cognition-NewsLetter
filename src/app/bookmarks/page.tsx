'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useUser } from '@/firebase';
import { useBookmarks } from '@/hooks/useBookmarks';
import ArticleCard from '@/components/shared/article-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookmarksPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const { bookmarkedArticles, loading: areBookmarksLoading } = useBookmarks();
  const router = useRouter();

  const isLoading = isUserLoading || areBookmarksLoading;

  if (isUserLoading) {
    return <div>Loading user...</div>;
  }
  
  if (!user && !isUserLoading) {
    router.push('/login');
    return null;
  }

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
                My Bookmarks
              </h1>
            </motion.div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-[450px] w-full" />
                ))}
              </div>
            ) : bookmarkedArticles.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {bookmarkedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16 border-2 border-dashed rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No Bookmarks Yet</h3>
                <p className="mt-2 text-muted-foreground">
                  You haven't bookmarked any articles. Start exploring and save your favorites!
                </p>
                <Button asChild className="mt-6">
                  <Link href="/articles">Explore Articles</Link>
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
