"use client";

import { createClient } from "@deepgram/sdk";
import { useState, useCallback, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";

// Ensure the API key is set
if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_DEEPGRAM_API_KEY");
}

/**
 * Schema definitions for Deepgram response
 */

// Word-level schema
const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  speaker: z.number().optional(),
  punctuated_word: z.string(),
});

// Alternatives schema
const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
});

// Sentiment segment schema
const SentimentSegmentSchema = z.object({
  text: z.string(),
  start_word: z.number(),
  end_word: z.number(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

// Average sentiment schema
const SentimentAverageSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

// Sentiments schema
const SentimentsSchema = z.object({
  segments: z.array(SentimentSegmentSchema),
  average: SentimentAverageSchema,
});

// Channels schema
const ChannelSchema = z.object({
  alternatives: z.array(AlternativeSchema),
});

// Results schema (including sentiments)
const ResultsSchema = z.object({
  channels: z.array(ChannelSchema),
  sentiments: SentimentsSchema.optional(),
});

// Full Deepgram response schema
const DeepgramResponseSchema = z.object({
  metadata: z.record(z.unknown()).optional(),
  results: ResultsSchema,
});

/**
 * Hook: useDeepgramPreRecordedWithSentiment
 *
 * Provides:
 * - startRecording: Begin recording audio from the user's microphone
 * - stopRecording: Stop recording and transcribe the recorded audio using Deepgram with sentiment analysis
 * - isRecording: Boolean indicating if currently recording
 * - isProcessing: Boolean indicating if currently processing/transcribing
 * - transcript: Transcribed text
 * - sentiments: The sentiment analysis results (segments + averages)
 *
 * Usage:
 * const {
 *   startRecording,
 *   stopRecording,
 *   isRecording,
 *   isProcessing,
 *   transcript,
 *   sentiments
 * } = useDeepgramPreRecordedWithSentiment();
 */
export const useDeepgramPreRecordedWithSentiment = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [sentiments, setSentiments] = useState<z.infer<typeof SentimentsSchema> | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  /**
   * Start recording audio from the user's microphone.
   */
  const startRecording = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setTranscript("");
      setSentiments(null);
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast("Failed to start recording. Please check your microphone permissions.");
    }
  }, []);

  /**
   * Stop the recording and send the recorded audio to Deepgram for transcription.
   */
  const stopRecording = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    setIsRecording(false);
    mediaRecorderRef.current.stop();

    // Wait for recording to stop
    mediaRecorderRef.current.onstop = async () => {
      // Combine all recorded chunks into a single Blob
      const recordedBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });

      // Send to Deepgram
      setIsProcessing(true);
      try {
        const client = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

        // Convert Blob to ArrayBuffer
        const audioBuffer = await recordedBlob.arrayBuffer();

        // Call Deepgram’s preRecorded transcription with sentiment analysis enabled
        const response = await client.transcription.preRecorded(
          { buffer: audioBuffer, mimetype: "audio/webm" },
          {
            model: "nova-2",
            language: "en-US",
            smart_format: true,
            diarize: false,
            sentiment: true, // Enable sentiment analysis
          }
        );

        // Parse response with Zod
        const parsed = DeepgramResponseSchema.parse(response);
        const firstAlternative = parsed.results.channels[0].alternatives[0];

        setTranscript(firstAlternative.transcript);
        setSentiments(parsed.results.sentiments ?? null);
      } catch (error) {
        console.error("Failed to transcribe pre-recorded file:", error);
        toast("Error transcribing audio");
        setTranscript("");
        setSentiments(null);
      } finally {
        setIsProcessing(false);
      }
    };
  }, [isRecording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    transcript,
    sentiments,
  };
};

/**
 * Example usage in a component:
 *
 * import React from 'react';
 * import { useDeepgramPreRecordedWithSentiment } from './useDeepgramPreRecordedWithSentiment';
 *
 * export function RecordAndTranscribeComponent() {
 *   const { startRecording, stopRecording, isRecording, isProcessing, transcript, sentiments } =
 *     useDeepgramPreRecordedWithSentiment();
 *
 *   return (
 *     <div>
 *       {!isRecording && <button onClick={startRecording}>Start Recording</button>}
 *       {isRecording && <button onClick={stopRecording}>Stop Recording</button>}
 *       {isProcessing && <p>Transcribing...</p>}
 *       {transcript && (
 *         <div>
 *           <h3>Transcript:</h3>
 *           <p>{transcript}</p>
 *         </div>
 *       )}
 *       {sentiments && (
 *         <div>
 *           <h3>Sentiment Analysis</h3>
 *           <h4>Average:</h4>
 *           <p>Sentiment: {sentiments.average.sentiment}</p>
 *           <p>Score: {sentiments.average.sentiment_score}</p>
 *           <h4>Segments:</h4>
 *           {sentiments.segments.map((seg, idx) => (
 *             <div key={idx}>
 *               <p>Text: {seg.text}</p>
 *               <p>Sentiment: {seg.sentiment}</p>
 *               <p>Score: {seg.sentiment_score}</p>
 *             </div>
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 */
