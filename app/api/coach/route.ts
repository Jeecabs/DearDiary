import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';



// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the prompt from the body
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await streamText({
    model: openai('gpt-4o'),    
    messages: [
      {
        role: 'system',
        content: `You are a compassionate obesity coach with expertise in physical and mental health. 
        Your responses should be:
        - Empathetic and understanding
        - Focused on both physical and emotional well-being
        - Specific and actionable when giving advice
        - Positive and encouraging
        - Free from judgment or criticism
        - Concise but meaningful`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
  });


  // Respond with the stream
  return response.toDataStreamResponse();
}