'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Article } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useBookmarks() {
  const { user } = useUser();
  const db = useFirestore();
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const bookmarksCollectionRef = useMemo(() => {
      if (!user || !db) return null;
      return collection(db, 'users', user.uid, 'bookmarks');
  }, [user, db]);

  useEffect(() => {
    if (!bookmarksCollectionRef || !db) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(bookmarksCollectionRef, orderBy('bookmarkedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        const articlePromises = snapshot.docs.map(docSnap => {
            const articleId = docSnap.id;
            const articleRef = doc(db, 'articles', articleId);
            return getDoc(articleRef);
        });

        const articleDocs = await Promise.all(articlePromises);
        
        const articles = articleDocs
            .filter(docSnap => docSnap.exists())
            .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Article));

        setBookmarkedArticles(articles);
        setLoading(false);
    }, async (error) => {
        console.error("Error fetching bookmarks:", error);
        if (bookmarksCollectionRef) {
          const permissionError = new FirestorePermissionError({
            path: bookmarksCollectionRef.path,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        setLoading(false);
    });

    return () => unsubscribe();

  }, [bookmarksCollectionRef, db]);

  return { bookmarkedArticles, loading };
}
