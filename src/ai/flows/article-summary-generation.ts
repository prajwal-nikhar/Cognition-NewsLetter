'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically generating summaries and tags for newsletter articles using AI.
 *
 * - generateArticleSummary - A function that generates a summary and tags for an article.
 * - ArticleSummaryInput - The input type for the generateArticleSummary function.
 * - ArticleSummaryOutput - The return type for the generateArticleSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArticleSummaryInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to summarize and tag.'),
});
export type ArticleSummaryInput = z.infer<typeof ArticleSummaryInputSchema>;

const ArticleSummaryOutputSchema = z.object({
  summary: z.string().describe('A short summary of the article.'),
  tags: z.array(z.string()).describe('An array of tags for the article.'),
});
export type ArticleSummaryOutput = z.infer<typeof ArticleSummaryOutputSchema>;

export async function generateArticleSummary(
  input: ArticleSummaryInput
): Promise<ArticleSummaryOutput> {
  return articleSummaryGenerationFlow(input);
}

const articleSummaryPrompt = ai.definePrompt({
  name: 'articleSummaryPrompt',
  input: {schema: ArticleSummaryInputSchema},
  output: {schema: ArticleSummaryOutputSchema},
  prompt: `You are an AI assistant that generates a summary and tags for a given article.

Article Content: {{{articleContent}}}

Summary:
Tags:`, // Removed the redundant newlines
});

const articleSummaryGenerationFlow = ai.defineFlow(
  {
    name: 'articleSummaryGenerationFlow',
    inputSchema: ArticleSummaryInputSchema,
    outputSchema: ArticleSummaryOutputSchema,
  },
  async input => {
    const {output} = await articleSummaryPrompt(input);
    return output!;
  }
);
