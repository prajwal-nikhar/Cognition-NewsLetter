'use client';

import { Suspense, useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import type { Article } from '@/lib/data';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReadExperience } from '@/components/read/read-experience';

const WORDS_PER_PAGE = 250;

function ProfileIcon() {
  const { user } = useUser();
  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background/80">
            <UserCircle className="h-6 w-6 text-foreground" />
          </Button>
        </Link>
      ) : (
         <Link href="/login">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/50 hover:bg-background/80">
            <UserCircle className="h-6 w-6 text-foreground" />
          </Button>
        </Link>
      )}
    </div>
  );
}

// This is now the primary Client Component for the page.
function ReadPageClient({ id }: { id: string }) {
  const db = useFirestore();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (!db || !id) return;
    const fetchArticle = async () => {
      setLoading(true);
      const docRef = doc(db, 'articles', id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const articleData = { id: docSnap.id, ...docSnap.data() } as Article;
          setArticle(articleData);

          const words = articleData.content.split(/\s+/);
          const paginated = [];
          for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
            paginated.push(words.slice(i, i + WORDS_PER_PAGE).join(' '));
          }
          setPages(paginated.length > 0 ? paginated : ['']);

        } else {
          notFound();
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [db, id]);

  return (
    <>
      <ProfileIcon />
      <ReadExperience loading={loading} pages={pages} article={article} />
    </>
  );
}

// This is the main page export - a Server Component.
export default function ReadPage({ params }: { params: { id: string }}) {
  const { id } = use(params);
  return (
    <div className="w-screen h-screen bg-zinc-100 dark:bg-zinc-900">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .prose p { 
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-foreground">Loading Article...</div>}>
         <ReadPageClient id={id} />
      </Suspense>
    </div>
  );
}
