'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Article } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark, Loader2 } from 'lucide-react';
import { Timestamp, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useBookmarkStatus } from '@/hooks/useBookmarkStatus';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

type ArticleCardProps = {
  article: Article;
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const ArticleCard = ({ article }: ArticleCardProps) => {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { isBookmarked, loading: bookmarkLoading } = useBookmarkStatus(article.id);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const getDate = () => {
    if (article.date instanceof Timestamp) {
      return article.date.toDate();
    }
    return new Date(article.date as string);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !db || isSubmitting) return;

    if (!user) {
        toast({ variant: 'destructive', title: 'Please log in to bookmark articles.' });
        return;
    }
    
    setIsSubmitting(true);
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', article.id);

    if (isBookmarked) {
        deleteDoc(bookmarkRef)
          .then(() => {
            toast({ title: 'Bookmark removed' });
          })
          .catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                path: bookmarkRef.path,
                operation: 'delete',
              });
              errorEmitter.emit('permission-error', permissionError);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
    } else {
        const bookmarkData = { bookmarkedAt: serverTimestamp() };
        setDoc(bookmarkRef, bookmarkData)
          .then(() => {
            toast({ title: 'Article bookmarked!' });
          })
          .catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                path: bookmarkRef.path,
                operation: 'create',
                requestResourceData: bookmarkData,
              });
              errorEmitter.emit('permission-error', permissionError);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
    }
  }

  const isLoading = bookmarkLoading || isSubmitting;

  return (
    <motion.div
      variants={cardVariants}
      className="h-full"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="p-0">
        <Link href={`/articles/${article.id}`} className="block overflow-hidden">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
            <Image
              src={article.image.url}
              alt={article.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              data-ai-hint={article.image.hint}
            />
          </motion.div>
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="outline" className="mb-2">{article.category}</Badge>
        <CardTitle className="text-lg mb-2 leading-tight font-headline">
          <Link href={`/articles/${article.id}`} className="hover:text-primary transition-colors">
            {article.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={article.authorAvatar.url} alt={article.author} data-ai-hint={article.authorAvatar.hint}/>
            <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{article.author}</p>
            <p className="text-xs text-muted-foreground">
              {format(getDate(), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        {user && (
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleBookmarkToggle} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Bookmark className={`h-5 w-5 ${isBookmarked ? 'text-primary fill-primary' : ''}`} />}
            </Button>
        )}
      </CardFooter>
    </Card>
    </motion.div>
  );
};

export default ArticleCard;
