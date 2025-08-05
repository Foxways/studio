'use server';

/**
 * @fileOverview An AI-powered tool that generates secure passwords based on user-defined criteria and complexity levels.
 *
 * - generateAdvancedPassword - A function that handles the password generation process.
 * - GenerateAdvancedPasswordInput - The input type for the generateAdvancedPassword function.
 * - GenerateAdvancedPasswordOutput - The return type for the generateAdvancedPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdvancedPasswordInputSchema = z.object({
  length: z.number().min(8).max(128).describe('The desired length of the password (between 8 and 128 characters).'),
  useUppercase: z.boolean().describe('Whether to include uppercase characters in the password.'),
  useLowercase: z.boolean().describe('Whether to include lowercase characters in the password.'),
  useNumbers: z.boolean().describe('Whether to include numbers in the password.'),
  useSymbols: z.boolean().describe('Whether to include symbols in the password.'),
  complexityLevel: z.enum(['low', 'medium', 'high']).default('medium').describe('The desired complexity level of the password.'),
  additionalCriteria: z.string().optional().describe('Any additional criteria or preferences for the password.'),
});
export type GenerateAdvancedPasswordInput = z.infer<typeof GenerateAdvancedPasswordInputSchema>;

const GenerateAdvancedPasswordOutputSchema = z.object({
  password: z.string().describe('The generated secure password.'),
  reasoning: z.string().describe('Explanation of why the generated password is considered strong.'),
});
export type GenerateAdvancedPasswordOutput = z.infer<typeof GenerateAdvancedPasswordOutputSchema>;

export async function generateAdvancedPassword(input: GenerateAdvancedPasswordInput): Promise<GenerateAdvancedPasswordOutput> {
  return generateAdvancedPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdvancedPasswordPrompt',
  input: {schema: GenerateAdvancedPasswordInputSchema},
  output: {schema: GenerateAdvancedPasswordOutputSchema},
  prompt: `You are a password generation expert. Generate a strong and secure password based on the following criteria:\n\nDesired Length: {{{length}}} characters\nUse Uppercase: {{#if useUppercase}}Yes{{else}}No{{/if}}\nUse Lowercase: {{#if useLowercase}}Yes{{else}}No{{/if}}\nUse Numbers: {{#if useNumbers}}Yes{{else}}No{{/if}}\nUse Symbols: {{#if useSymbols}}Yes{{else}}No{{/if}}\nComplexity Level: {{{complexityLevel}}}\nAdditional Criteria: {{{additionalCriteria}}}\n\nExplain why the generated password is considered strong and secure, considering the provided criteria. Make sure to include what character types it contains and the overall randomness of the password. Do not include the generated password in your explanation.\n\nPassword:`, // The AI will append the password to this prompt; this is intentional.
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateAdvancedPasswordFlow = ai.defineFlow(
  {
    name: 'generateAdvancedPasswordFlow',
    inputSchema: GenerateAdvancedPasswordInputSchema,
    outputSchema: GenerateAdvancedPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const password = output!.password;
    const reasoning = output!.reasoning;
    return {
      password,
      reasoning,
    };
  }
);
