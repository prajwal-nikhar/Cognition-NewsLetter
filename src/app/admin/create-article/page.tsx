'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/lib/data';
import { Loader, Sparkles, UploadCloud, FileText } from 'lucide-react';
import { generateArticleSummary } from '@/ai/flows/article-summary-generation';
import { parsePdf } from '@/ai/flows/parse-pdf-flow';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author name is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().min(1, 'Tags are required'),
  image: z.string().min(1, 'Image is required'),
  featured: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateArticlePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      featured: false,
    },
  });

  const articleContent = watch('content');
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
        });
        return;
      }
      
      setFileName(file.name);
      setIsParsing(true);
      
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const pdfDataUri = reader.result as string;
          try {
            const result = await parsePdf({ pdfDataUri });
            setValue('content', result.text, { shouldValidate: true });
            toast({
              title: "PDF Parsed",
              description: `Extracted text from ${file.name}.`,
            });
          } catch (error) {
             console.error("Failed to parse PDF via flow:", error);
            toast({
              variant: "destructive",
              title: "PDF Parsing Failed",
              description: "Could not extract text from the PDF.",
            });
            setValue('content', '', { shouldValidate: true });
            setFileName('');
          } finally {
             setIsParsing(false);
          }
        };
        reader.onerror = (error) => {
            console.error("Failed to read file:", error);
            toast({
              variant: "destructive",
              title: "File Read Failed",
              description: "Could not read the selected file.",
            });
            setIsParsing(false);
            setFileName('');
        }
      } catch (error) {
        console.error("Failed to process file:", error);
        toast({
          variant: "destructive",
          title: "File Processing Failed",
          description: "An unexpected error occurred.",
        });
        setValue('content', '', { shouldValidate: true });
        setFileName('');
        setIsParsing(false);
      }
    }
  };


  const handleGenerateSummary = async () => {
    if (!articleContent) {
        toast({
            variant: "destructive",
            title: "Content required",
            description: "Please upload and parse a PDF to generate a summary.",
        });
        return;
    }
    setIsAiLoading(true);
    try {
        const result = await generateArticleSummary({ articleContent });
        if (result.summary) {
            setValue('excerpt', result.summary);
        }
        if (result.tags && result.tags.length > 0) {
            setValue('tags', result.tags.join(', '));
        }
        toast({
            title: "AI Generation Complete",
            description: "Summary and tags have been populated.",
        });
    } catch (error) {
        console.error("AI summary generation failed:", error);
        toast({
            variant: "destructive",
            title: "AI Generation Failed",
            description: "Could not generate summary and tags.",
        });
    } finally {
        setIsAiLoading(false);
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!user || !db) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create an article.',
      });
      return;
    }
    setLoading(true);

    const articlesCollection = collection(db, 'articles');
    const imageHint = PlaceHolderImages.find(p => p.imageUrl === data.image)?.imageHint || 'abstract';
    const newArticleData = {
      ...data,
      tags: data.tags.split(',').map((tag) => tag.trim().toLowerCase()),
      author: data.author,
      authorId: user.uid,
      authorAvatar: {
        url: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
        hint: 'person portrait',
      },
      image: {
        url: data.image,
        hint: imageHint,
      },
      date: serverTimestamp(),
    };

    addDoc(articlesCollection, newArticleData)
      .then(() => {
        toast({
          title: 'Article Published!',
          description: 'Your new article is now live.',
        });
        router.push('/admin');
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: articlesCollection.path,
          operation: 'create',
          requestResourceData: newArticleData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Create New Article</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register('title')} />
                  {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="author">Author Name</Label>
                      <Input id="author" {...register('author')} />
                      {errors.author && (
                          <p className="text-sm text-destructive">{errors.author.message}</p>
                      )}
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-upload">Article Content (PDF)</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="content-upload" className="cursor-pointer">
                      <UploadCloud className="mr-2" />
                      Upload PDF
                      <input id="content-upload" type="file" className="sr-only" accept="application/pdf" onChange={handleFileChange} disabled={isParsing} />
                    </label>
                  </Button>
                  {isParsing && <Loader className="animate-spin" />}
                  {fileName && !isParsing && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
                <input type="hidden" {...register('content')} />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <Label htmlFor="excerpt">Excerpt / Summary</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleGenerateSummary} disabled={isAiLoading || !articleContent}>
                          {isAiLoading ? <Loader className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Generate with AI
                      </Button>
                  </div>
                <Textarea id="excerpt" {...register('excerpt')} rows={3} />
                {errors.excerpt && (
                  <p className="text-sm text-destructive">{errors.excerpt.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                  {CATEGORIES.map((category) => (
                                  <SelectItem key={category} value={category}>
                                      {category}
                                  </SelectItem>
                                  ))}
                              </SelectContent>
                              </Select>
                          )}
                      />
                      {errors.category && (
                          <p className="text-sm text-destructive">{errors.category.message}</p>
                      )}
                  </div>

                  <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input id="tags" {...register('tags')} />
                      {errors.tags && (
                          <p className="text-sm text-destructive">{errors.tags.message}</p>
                      )}
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                 <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an image" />
                      </SelectTrigger>
                      <SelectContent>
                        {PlaceHolderImages.filter(img => !img.id.startsWith('avatar')).map((image) => (
                          <SelectItem key={image.id} value={image.imageUrl}>
                            {image.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.image && (
                  <p className="text-sm text-destructive">{errors.image.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...register('featured')}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="featured">Feature this article</Label>
              </div>

              <Button type="submit" disabled={loading || isParsing} className="w-full">
                {loading ? 'Publishing...' : 'Publish Article'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
