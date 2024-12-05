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
const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  speaker: z.number().nullish(),
  punctuated_word: z.string(),
});

const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
});

const SentimentSegmentSchema = z.object({
  text: z.string(),
  start_word: z.number(),
  end_word: z.number(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

const SentimentAverageSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

const SentimentsSchema = z.object({
  segments: z.array(SentimentSegmentSchema),
  average: SentimentAverageSchema,
});

const ChannelSchema = z.object({
  alternatives: z.array(AlternativeSchema),
});

const ResultsSchema = z.object({
  channels: z.array(ChannelSchema),
  sentiments: SentimentsSchema.nullish(),
});

const DeepgramResponseSchema = z.object({
  metadata: z.record(z.unknown()).nullish(),
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
 */
export const useDeepgramPreRecordedWithSentiment = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [sentiments, setSentiments] = useState<z.infer<typeof SentimentsSchema> | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

  const stopRecording = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    setIsRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const recordedBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" });

      setIsProcessing(true);
      try {
        const deepgram =  createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);
        const audioBuffer = Buffer.from(await recordedBlob.arrayBuffer());

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
