"use client";

import {
  createClient,
  LiveClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";
import { useQueue } from "@uidotdev/usehooks";
import { useState, useRef, useCallback, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";

if (!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_DEEPGRAM_API_KEY");
}

// TODO: Seems like this needs a soft rework at some point the deepgram websocket is clearly not designed to stay open this long unless it's nextjs bug??
// ^ Going to investigate this lol

/**
 * Schema for a single word in the transcription.
 */
const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  // This field is only present if you pass "diarize: true" to the Deepgram API
  speaker: z.number().optional(),
  punctuated_word: z.string(),
});

/**
 * Schema for an alternative transcription.
 */
const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
});

/**
 * Schema for the overall transcript.
 */
const TranscriptSchema = z.object({
  alternatives: z.array(AlternativeSchema),
});

/**
 * Custom hook for integrating with Deepgram's live transcription service.
 *
 * This hook manages the state and functionality related to recording audio, processing it through
 * the Deepgram API, and handling the transcription results. It provides a simple interface for
 * starting, stopping, pausing, and resuming the audio recording and transcription process.
 *
 * Usage:
 * ```
 * const {
 *   isRecording,
 *   isPaused,
 *   numVoices,
 *   transcriptEntries,
 *   startRecording,
 *   stopRecording,
 *   pauseRecording,
 *   resumeRecording,
 * } = useDeepgram();
 * ```
 *
 * @returns An object containing the current state and functions to control the transcription process.
 * - `isRecording`: A boolean indicating whether the recording is currently active.
 * - `isPaused`: A boolean indicating whether the recording is paused.
 * - `numVoices`: The number of unique voices detected in the transcription.
 * - `transcriptEntries`: An array of `TranscriptEntry` objects representing the processed transcript.
 * - `startRecording`: A function to start the audio recording and transcription process.
 * - `stopRecording`: A function to stop the audio recording and transcription process.
 * - `pauseRecording`: A function to pause the audio recording.
 * - `resumeRecording`: A function to resume the audio recording.
 *
 * The hook internally manages the connection to the Deepgram API, handles the audio recording using
 * the `MediaRecorder` API, and processes the audio data through the Deepgram live transcription
 * service. It listens for transcription events and updates the state accordingly.
 *
 * The transcription results are provided as an array of `TranscriptEntry` objects, each containing
 * the corresponding transcribed text. The hook also keeps track of the number
 * of unique voices detected in the transcription.
 *
 * Note: The hook requires the `NEXT_PUBLIC_DEEPGRAM_API_KEY` environment variable to be set with a
 * valid Deepgram API key.
 *
 * **/
export const useDeepgram = () => {
  const { add, remove, first, size } = useQueue<Blob>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const connectionRef = useRef<LiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isProcessing, setProcessing] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string>("");

  const initializeConnection = useCallback(() => {
    const newConnection = createClient(
      process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!
    ).listen.live({
      model: "nova-2",
      language: "en-US",
      smart_format: true,
      diarize: false,
    });

    newConnection.on(LiveTranscriptionEvents.Close, (e) => {
      console.log("Connection closed.");
      console.error({ e });

      initializeConnection();
    });

    newConnection.on(LiveTranscriptionEvents.Open, () => {
      newConnection.keepAlive();

      console.info("Connection opened.");

      newConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const result = TranscriptSchema.parse(data.channel);
        const alternative = result.alternatives[0];

        setTranscriptText(
          (prevText) => prevText + " " + alternative.transcript
        );
      });

      newConnection.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log("Meta data");
        console.log({ data });
      });

      newConnection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
      });
    });

    connectionRef.current = newConnection;
  }, []);

  useEffect(() => {
    if (isRecording) {
      initializeConnection();
    } else {
      closeConnection();
    }
  }, [initializeConnection, isRecording]);

  /**
   * Closes the current Deepgram connection.
   */
  const closeConnection = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current?.finish();
    }
  }, []);

  /**
   * Cleanup the connection when the component unmounts.
   */
  useEffect(() => {
    return () => {
      console.log("Is this being invoked some how???");
      // closeConnection();
    };
  }, []);

  /**
   * Starts the audio recording and transcription process.3
   */
  const startRecording = useCallback(async () => {
    try {
      // If the media recorder is not initialized, create a new one
      if (!mediaRecorderRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;

        mediaRecorderRef.current.ondataavailable = (event) => {
          add(event.data);
        };
      }
      // Reset the transcript text
      setTranscriptText("");

      mediaRecorderRef.current.start(500);
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  }, [add]);

  /**
   * Stops the audio recording and transcription process.
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  /**
   * Pauses the audio recording.
   */
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.pause();
    }
    setIsPaused(true);
  }, []);

  /**
   * Resumes the audio recording.
   */
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.resume();
    }
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      if (size > 0 && !isProcessing) {
        setProcessing(true);

        if (isRecording) {
          try {
            const blob = first;
            if (!blob) {
              // TODO: Capture even in sentry
              console.error("No blob found");
              return;
            }
            if (!connectionRef.current?.send) {
              initializeConnection();
              return;
            }

            connectionRef.current?.send(blob);
            remove();
          } catch (error) {
            console.error("Failed to send blob to Deepgram:", error);
            toast("Error transcribing audio");
          }
        }

        const waiting = setTimeout(() => {
          clearTimeout(waiting);
          setProcessing(false);
        }, 250);
      }
    };

    processQueue();
  }, [isProcessing, isRecording, first, remove, size]);

  return {
    isRecording,
    isPaused,
    transcriptText,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  };
};
