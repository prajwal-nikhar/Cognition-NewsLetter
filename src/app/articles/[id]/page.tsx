'use client';

import { notFound, useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { Article } from '@/lib/data';
import Image from 'next/image';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useState, use } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { BookOpen, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

function formatDate(date: any) {
    if (!date) return '';
    if (date instanceof Timestamp) {
        return format(date.toDate(), 'MMMM d, yyyy');
    }
    if (typeof date === 'string') {
        return format(new Date(date), 'MMMM d, yyyy');
    }
    return format(date, 'MMMM d, yyyy');
}


export default function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const db = useFirestore();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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
    if (!db || !id) return;
    const fetchArticle = async () => {
      setLoading(true);
      const docRef = doc(db, 'articles', id);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() } as Article);
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
  
  const handleReadClick = () => {
    router.push(`/read/${id}`);
  };

  const handleDeleteArticle = async () => {
    if (!db || !article) return;
    const docRef = doc(db, 'articles', article.id);
    try {
        await deleteDoc(docRef);
        toast({
            title: "Article Deleted",
            description: "The article has been successfully deleted.",
        });
        router.push('/articles');
    } catch (error) {
        console.error("Error deleting article: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not delete the article.",
        });
    }
  }


  if (loading) {
    return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
             <header className="py-12 md:py-20 bg-secondary/30">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <Skeleton className="h-6 w-24 mx-auto" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                     <div className="mt-8 flex justify-center items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className='space-y-2'>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </div>
             </header>
             <div className="container mx-auto px-4 py-8 md:py-12">
                <Skeleton className="w-full h-[300px] md:h-[500px] mb-8 md:mb-12 rounded-lg" />
                <div className="prose prose-lg dark:prose-invert mx-auto max-w-4xl space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
             </div>
          </main>
          <Footer />
        </div>
    )
  }

  if (!article) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.header 
            className="py-12 md:py-20 bg-secondary/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="container mx-auto px-4 text-center">
              <div className="mb-4">
                <Badge variant="outline">{article.category}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto font-headline">
                {article.title}
              </h1>
              <div className="mt-8 flex justify-center items-center space-x-4">
                <Avatar>
                  <AvatarImage src={article.authorAvatar?.url} alt={article.author} data-ai-hint={article.authorAvatar?.hint}/>
                  <AvatarFallback>{article.author?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{article.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(article.date)}
                  </p>
                </div>
              </div>
            </div>
          </motion.header>
          
          <div className="container mx-auto px-4 py-8 md:py-12">
            <motion.div 
                className="relative w-full h-[300px] md:h-[500px] mb-8 md:mb-12 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Image
                src={article.image.url}
                alt={article.title}
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint={article.image.hint}
                priority
              />
            </motion.div>
            
            <motion.div 
                className="max-w-4xl mx-auto space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <p className="text-lg text-muted-foreground font-light tracking-wide">{article.excerpt}</p>
                
                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={handleReadClick}>
                        <BookOpen className="mr-2 h-5 w-5" />
                        Enter Reading Mode
                    </Button>
                    {isAdmin && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" variant="destructive">
                                    <Trash2 className="mr-2 h-5 w-5" />
                                    Delete Article
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this article
                                        and remove its data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteArticle}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
                
                <div className="mt-12">
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </motion.div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
