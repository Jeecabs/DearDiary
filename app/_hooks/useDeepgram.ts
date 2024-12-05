"use client";

import { useState, useRef } from "react";
import { transcribeAudio } from "../actions";
import { z } from "zod";
import { SentimentsSchema } from "../_schemas/deepgram";

interface UseDeepgramPreRecordedWithSentimentReturn {
  isRecording: boolean;
  transcript: string;
  sentiments: z.infer<typeof SentimentsSchema> | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
}

/**
 * Hook that records audio from the user, sends it to a server action for
 * transcription and sentiment analysis using Deepgram, and returns the results.
 * This preserves the original behavior of your hook while pushing the Deepgram logic server-side.
 */
export function useDeepgramPreRecordedWithSentiment(): UseDeepgramPreRecordedWithSentimentReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sentiments, setSentiments] =
    useState<UseDeepgramPreRecordedWithSentimentReturn["sentiments"]>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const base64Audio = await blobToBase64(blob);

      // Call server action for transcription
      const result = await transcribeAudio(base64Audio);

      // Extract transcript and sentiments
      const { channels } = result.results;
      const { sentiments: sentimentsData } = result.results;

      // Usually only one channel
      const firstChannel = channels[0];
      const firstAlternative = firstChannel.alternatives[0];
      setTranscript(firstAlternative.transcript);
      setSentiments(
        sentimentsData
          ? {
              segments: sentimentsData.segments,
              average: sentimentsData.average,
            }
          : null
      );
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    transcript,
    sentiments,
    startRecording,
    stopRecording,
  };
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read blob."));
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64String = dataUrl.split(",")[1];
      resolve(base64String);
    };
    reader.readAsDataURL(blob);
  });
}
