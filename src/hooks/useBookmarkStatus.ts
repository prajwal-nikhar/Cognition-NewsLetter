'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useBookmarkStatus(articleId: string) {
  const { user } = useUser();
  const db = useFirestore();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db || !articleId) {
      setLoading(false);
      setIsBookmarked(false);
      return;
    }

    setLoading(true);
    const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', articleId);

    const unsubscribe = onSnapshot(
      bookmarkRef,
      (docSnap) => {
        setIsBookmarked(docSnap.exists());
        setLoading(false);
      },
      async (error) => {
        console.error('Error listening to bookmark status:', error);
        const permissionError = new FirestorePermissionError({
          path: bookmarkRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, db, articleId]);

  return { isBookmarked, loading };
}
