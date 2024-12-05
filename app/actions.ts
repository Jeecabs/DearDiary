"use server";

import { createClient } from "@deepgram/sdk";
import { DeepgramResponseSchema } from "./_schemas/deepgram";

const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY || "";
const deepgram = createClient(deepgramApiKey);

/**
 * This server action receives audio data from the client (as a Blob in base64 form),
 * sends it to Deepgram for transcription, and returns the transcript text.
 * Includes comprehensive logging for monitoring and debugging.
 */
export async function transcribeAudio(base64Audio: string) {
  const requestId = `trans_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  try {
    // Log initial request details
    console.log(`[${requestId}] Starting audio transcription request`);
    console.log(
      `[${requestId}] Audio data size: ${base64Audio.length * 0.75} bytes`
    );

    // Validate input
    if (!base64Audio) {
      console.error(`[${requestId}] Error: No audio data provided`);
      throw new Error("No audio data provided");
    }

    // Convert base64 to Buffer
    console.log(`[${requestId}] Converting base64 to buffer`);
    const audioBuffer = Buffer.from(base64Audio, "base64");
    console.log(`[${requestId}] Buffer size: ${audioBuffer.length} bytes`);

    // Log Deepgram request configuration
    console.log(`[${requestId}] Deepgram request configuration:`, {
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      diarize: false,
      sentiment: true,
    });

    // Make request to Deepgram
    console.time(`[${requestId}] Deepgram API call`);
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
    console.timeEnd(`[${requestId}] Deepgram API call`);

    // Log response details
    console.log(`[${requestId}] Deepgram response received`);
    console.log(`[${requestId}] Response details:`, {
      hasError: !!response.error,
      responseSize: JSON.stringify(response).length,
      timestamp: new Date().toISOString(),
    });

    // Handle potential errors
    if (response.error) {
      console.error(`[${requestId}] Deepgram transcription error:`, {
        error: response.error,
        timestamp: new Date().toISOString(),
      });
      throw new Error(response.error.message);
    }

    // Validate response schema
    console.log(`[${requestId}] Validating response schema`);
    const parsedResponse = DeepgramResponseSchema.parse(response.result);

    // Log successful completion
    console.log(`[${requestId}] Transcription completed successfully`, {
      transcriptLength:
        parsedResponse.results?.channels[0]?.alternatives[0]?.transcript
          ?.length || 0,
      processingTime: response.result.metadata?.duration || 0,
      timestamp: new Date().toISOString(),
    });

    return parsedResponse;
  } catch (error) {
    // Comprehensive error logging
    console.error(`[${requestId}] Error in transcribeAudio:`, {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      timestamp: new Date().toISOString(),
    });

    // Rethrow with additional context
    throw new Error(
      `Transcription failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
