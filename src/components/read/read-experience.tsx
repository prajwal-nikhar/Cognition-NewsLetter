'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { Article } from '@/lib/data';

function Page({ text }: { text: string }) {
  return (
    <div 
        className="w-full h-full bg-[#fdfaf1] shadow-lg overflow-y-auto p-8 md:p-12 hide-scrollbar select-none rounded-lg"
    >
       <div className="prose prose-lg dark:prose-invert max-w-none text-stone-800">
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {text}
          </p>
       </div>
    </div>
  );
}

function SinglePageView({ pages, article }: { pages: string[], article: Article | null }) {
  const router = useRouter();
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < pages.length) {
        setPage([newPage, newDirection]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'ArrowRight') paginate(1);
        if(e.key === 'ArrowLeft') paginate(-1);
        if (e.key === 'Escape') {
            const articleId = window.location.pathname.split('/').pop();
            router.push(`/articles/${articleId}`);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, pages.length, router]);
  
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {article && (
          <div className="absolute top-4 left-4 md:left-8 text-left z-10 text-foreground">
            <h1 className="text-xl md:text-2xl font-bold font-headline">{article.title}</h1>
            <p className="text-sm md:text-base text-muted-foreground">by {article.author}</p>
          </div>
        )}

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute w-full max-w-3xl h-[80vh]"
        >
          <Page text={pages[page]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 md:bottom-8 flex gap-4 z-10">
          <Button variant="outline" onClick={() => paginate(-1)} disabled={page === 0}>
              <ArrowLeft className="mr-2" /> Previous
          </Button>
          <div className="flex items-center justify-center px-4 text-sm text-muted-foreground">
            Page {page + 1} of {pages.length}
          </div>
          <Button variant="outline" onClick={() => paginate(1)} disabled={page >= pages.length - 1}>
              Next <ArrowRight className="ml-2" />
          </Button>
      </div>
    </div>
  );
}

function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-foreground font-body text-xl">Loading Experience...</p>
        </div>
    )
}

export function ReadExperience({ loading, pages, article }: { loading: boolean; pages: string[], article: Article | null}) {
  const router = useRouter();
  const articleId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  if (loading) {
    return <LoadingFallback />
  }

  return (
      <div className="w-full h-full relative bg-zinc-100 dark:bg-zinc-900">
        <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-12 z-50 rounded-full bg-background/50 hover:bg-background/80"
            onClick={() => router.push(`/articles/${articleId}`)}
            aria-label="Close reading mode"
        >
            <X className="h-6 w-6 text-foreground" />
        </Button>
        <Suspense fallback={<LoadingFallback />}>
            <SinglePageView pages={pages} article={article} />
        </Suspense>
    </div>
  )
}
