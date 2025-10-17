'use server';

/**
 * @fileOverview A Genkit flow for parsing text content from a PDF file.
 *
 * - parsePdf - A function that handles the PDF parsing process.
 * - ParsePdfInput - The input type for the parsePdf function.
 * - ParsePdfOutput - The return type for the parsePdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import pdf from 'pdf-parse';

const ParsePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
type ParsePdfInput = z.infer<typeof ParsePdfInputSchema>;

const ParsePdfOutputSchema = z.object({
  text: z.string().describe('The extracted text content from the PDF.'),
});
type ParsePdfOutput = z.infer<typeof ParsePdfOutputSchema>;


export async function parsePdf(input: ParsePdfInput): Promise<ParsePdfOutput> {
    return parsePdfFlow(input);
}


const parsePdfFlow = ai.defineFlow(
  {
    name: 'parsePdfFlow',
    inputSchema: ParsePdfInputSchema,
    outputSchema: ParsePdfOutputSchema,
  },
  async ({ pdfDataUri }) => {
    try {
      const base64Data = pdfDataUri.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid data URI format for PDF.');
      }
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const data = await pdf(pdfBuffer);
      return { text: data.text };
    } catch (error: any) {
      console.error('Error parsing PDF in flow:', error);
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
  }
);
