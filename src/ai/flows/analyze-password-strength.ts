'use server';

/**
 * @fileOverview Analyzes the strength of a password, suggests improvements, and identifies potentially compromised credentials.
 *
 * - analyzePasswordStrength - A function that handles the password analysis process.
 * - AnalyzePasswordStrengthInput - The input type for the analyzePasswordStrength function.
 * - AnalyzePasswordStrengthOutput - The return type for the analyzePasswordStrength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePasswordStrengthInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
});
export type AnalyzePasswordStrengthInput = z.infer<typeof AnalyzePasswordStrengthInputSchema>;

const AnalyzePasswordStrengthOutputSchema = z.object({
  strength: z.string().describe('The strength of the password (e.g., weak, moderate, strong).'),
  suggestions: z.array(z.string()).describe('Suggestions for improving the password strength.'),
  compromised: z.boolean().describe('Whether the password may be compromised.'),
  reasoning: z.string().describe('Explanation of why the password might be considered weak.'),
});
export type AnalyzePasswordStrengthOutput = z.infer<typeof AnalyzePasswordStrengthOutputSchema>;

export async function analyzePasswordStrength(input: AnalyzePasswordStrengthInput): Promise<AnalyzePasswordStrengthOutput> {
  return analyzePasswordStrengthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePasswordStrengthPrompt',
  input: {schema: AnalyzePasswordStrengthInputSchema},
  output: {schema: AnalyzePasswordStrengthOutputSchema},
  prompt: `You are an AI-powered password analysis tool. You will analyze the provided password and provide feedback on its strength, suggestions for improvement, whether it may be compromised, and reasoning for your analysis.

Password: {{{password}}}

Analyze the password and provide the following information:
- strength: The strength of the password (e.g., weak, moderate, strong).
- suggestions: Suggestions for improving the password strength.
- compromised: Whether the password may be compromised.
- reasoning: Explanation of why the password might be considered weak.`, 
});

const analyzePasswordStrengthFlow = ai.defineFlow(
  {
    name: 'analyzePasswordStrengthFlow',
    inputSchema: AnalyzePasswordStrengthInputSchema,
    outputSchema: AnalyzePasswordStrengthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
