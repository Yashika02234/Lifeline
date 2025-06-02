
'use server';
/**
 * @fileOverview An AI-powered emergency chat assistant for blood requests.
 *
 * - chatWithEmergencyAssistant - A function to interact with the AI assistant.
 * - EmergencyChatInput - The input type for the chat assistant.
 * - EmergencyChatOutput - The return type from the chat assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { BloodType } from '@/types';

const EmergencyChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI assistant.'),
  currentBloodTypeFilter: z.string().describe("The user's current blood type filter setting on the dashboard (e.g., 'A+', 'all')."),
});
export type EmergencyChatInput = z.infer<typeof EmergencyChatInputSchema>;

const EmergencyChatOutputSchema = z.object({
  reply: z.string().describe('The AI assistant friendly reply to the user.'),
});
export type EmergencyChatOutput = z.infer<typeof EmergencyChatOutputSchema>;

export async function chatWithEmergencyAssistant(input: EmergencyChatInput): Promise<EmergencyChatOutput> {
  return emergencyChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emergencyChatAssistantPrompt',
  input: {schema: EmergencyChatInputSchema},
  output: {schema: EmergencyChatOutputSchema},
  prompt: `You are an AI assistant for Lifeline, a blood donor app. Your primary role is to help users during blood-related emergencies and answer simple questions about blood donation. Be empathetic, clear, and concise.

User's current blood type filter on the dashboard is: '{{currentBloodTypeFilter}}'.

If the user's message clearly indicates an URGENT NEED FOR BLOOD:
1. Acknowledge the emergency with empathy (e.g., "I understand this is urgent, I'm here to help.")
2. If they specify a blood type in their message, confirm that you've noted it (e.g., "I see you need [Blood Type] blood.").
3. If they DON'T specify a blood type:
    - And '{{currentBloodTypeFilter}}' is a specific type (not 'all'), ask if they need '{{currentBloodTypeFilter}}' or another type (e.g., "Do you need {{currentBloodTypeFilter}} blood, or a different type?").
    - And '{{currentBloodTypeFilter}}' is 'all', ask them to specify the required blood type (e.g., "Please specify the blood type you need.").
4. Inform them that you are INITIATING AN ALERT to suitable donors (e.g., "I am now alerting nearby donors who match this request."). This is a key action.
5. If a blood type was identified or confirmed, end with a supportive message like "Help should be on the way soon." If blood type is still needed, say "Once you provide the blood type, I can refine the alert."

If the user asks a GENERAL QUESTION about blood donation (e.g., "How often can I donate?", "What is O-negative blood?", "Can I donate if I have a cold?"):
1. Provide a brief, accurate, and helpful answer.
2. If the question is complex or medical advice is needed, suggest they consult a healthcare professional.

If the message is a GREETING, CASUAL CHAT, or UNRELATED to blood donation or emergencies:
1. Politely state that you are an emergency assistant for blood requests and can also answer general blood donation questions. (e.g., "Hello! I'm Lifeline's emergency assistant. I can help with urgent blood requests or answer questions about blood donation. How can I assist you today?")

User message: {{{message}}}

Produce a single, coherent 'reply' field in your JSON output.`,
});

const emergencyChatAssistantFlow = ai.defineFlow(
  {
    name: 'emergencyChatAssistantFlow',
    inputSchema: EmergencyChatInputSchema,
    outputSchema: EmergencyChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
