"use server";

import { createClient } from "@deepgram/sdk";
import { DeepgramResponseSchema } from "./_schemas/deepgram";

const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || "";
const deepgram = createClient(deepgramApiKey);

/**
 * This server action receives audio data from the client (as a Blob in base64 form),
 * sends it to Deepgram for transcription, and returns the transcript text.
 */
export async function transcribeAudio(base64Audio: string) {
  // Convert base64 to Buffer
  const audioBuffer = Buffer.from(base64Audio, "base64");

  // THIS IS v3 SDK DO NOT CHANGE
  const response = await deepgram.listen.prerecorded.transcribeFile(
    audioBuffer,
    {
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      diarize: false,
      sentiment: true,
    }
  );

  console.log({ response });

  return DeepgramResponseSchema.parse(response);
}
