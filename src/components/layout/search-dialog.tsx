'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Article } from '@/lib/data';
import { useFirestore } from '@/firebase';
import { collection, getDocs, limit, query, where, or } from 'firebase/firestore';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = useFirestore();
  const debouncedQuery = useDebounce(queryText, 300);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!db) return;

    const performSearch = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      setLoading(true);
      
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        // This is a basic search. For more advanced search, you might need a third-party service like Algolia.
        // Firestore doesn't support native full-text search on multiple fields in this manner.
        // This query searches for keywords in title and tags array.
        // A more robust solution might involve creating a 'keywords' field in your documents.
        or(
            where('title', '>=', debouncedQuery),
            where('title', '<=', debouncedQuery + '\uf8ff'),
            where('tags', 'array-contains', debouncedQuery.toLowerCase())
        ),
        limit(10)
      );

      try {
        const querySnapshot = await getDocs(q);
        const articles: Article[] = [];
        querySnapshot.forEach((doc) => {
          articles.push({ id: doc.id, ...doc.data() } as Article);
        });
        
        // Manual filtering for excerpt and category as Firestore doesn't support 'or' on multiple fields efficiently.
        if (articles.length < 10) {
            const allArticlesSnapshot = await getDocs(collection(db, "articles"));
            const allArticles = allArticlesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}) as Article);
            const lowerQuery = debouncedQuery.toLowerCase();

            const additionalMatches = allArticles.filter(article => {
                const titleMatch = article.title.toLowerCase().includes(lowerQuery);
                const excerptMatch = article.excerpt.toLowerCase().includes(lowerQuery);
                const categoryMatch = article.category.toLowerCase().includes(lowerQuery);
                const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

                return (titleMatch || excerptMatch || categoryMatch || tagMatch) && !articles.find(a => a.id === article.id);
            });

            setResults([...articles, ...additionalMatches].slice(0, 10));

        } else {
            setResults(articles);
        }

      } catch (error) {
        console.error("Error searching articles: ", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, db]);
    
  const handleSelectArticle = (articleId: string) => {
    setOpen(false);
    setQueryText('');
    router.push(`/articles/${articleId}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search articles...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Search Articles</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Type to search for title, tag, or category..."
              className="pl-10"
            />
          </div>
          <div className="mt-4 max-h-[400px] overflow-y-auto">
            {loading && <div className="text-center text-muted-foreground py-8">Searching...</div>}
            {!loading && queryText && results.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>No results found.</p>
                </div>
            )}
            {results.map((article) => (
              <div
                key={article.id}
                onClick={() => handleSelectArticle(article.id)}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{article.title}</span>
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {article.excerpt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
