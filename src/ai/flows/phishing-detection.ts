'use server';

/**
 * @fileOverview This file implements the Genkit flow for phishing detection.
 *
 * - detectPhishing - A function that detects potential phishing attempts by analyzing URLs and login forms.
 * - PhishingDetectionInput - The input type for the detectPhishing function.
 * - PhishingDetectionOutput - The return type for the detectPhishing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PhishingDetectionInputSchema = z.object({
  url: z.string().describe('The URL to analyze.'),
  loginFormHtml: z.string().optional().describe('The HTML content of the login form (optional).'),
});
export type PhishingDetectionInput = z.infer<typeof PhishingDetectionInputSchema>;

const PhishingDetectionOutputSchema = z.object({
  isPhishing: z.boolean().describe('Whether the URL or login form is likely a phishing attempt.'),
  reason: z.string().describe('The reason why the URL or login form is considered phishing.'),
});
export type PhishingDetectionOutput = z.infer<typeof PhishingDetectionOutputSchema>;

export async function detectPhishing(input: PhishingDetectionInput): Promise<PhishingDetectionOutput> {
  return detectPhishingFlow(input);
}

const detectPhishingPrompt = ai.definePrompt({
  name: 'detectPhishingPrompt',
  input: {schema: PhishingDetectionInputSchema},
  output: {schema: PhishingDetectionOutputSchema},
  prompt: `You are an AI assistant specializing in detecting phishing attempts.
  Analyze the provided URL and login form (if available) to determine if it is a phishing attempt.
  Provide a detailed reason for your determination.

  URL: {{{url}}}
  Login Form HTML: {{{loginFormHtml}}}

  Consider factors such as:
  - Suspicious domain names or URL patterns
  - Request for sensitive information
  - Presence of security indicators (e.g., HTTPS)
  - Visual similarity to legitimate websites
  - Unusual requests (e.g. asking for bank details on a non-financial website)

  Output your reasoning, and a determination as to whether the URL is a phishing attempt or not. Set the isPhishing field appropriately.
  `,
});

const detectPhishingFlow = ai.defineFlow(
  {
    name: 'detectPhishingFlow',
    inputSchema: PhishingDetectionInputSchema,
    outputSchema: PhishingDetectionOutputSchema,
  },
  async input => {
    const {output} = await detectPhishingPrompt(input);
    return output!;
  }
);
