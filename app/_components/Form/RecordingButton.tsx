"use client";

import { useEffect } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeepgramPreRecordedWithSentiment } from "@/app/_hooks/useDeepgram";
import { z } from "zod";
import { SentimentsSchema } from "@/app/_schemas/deepgram";

interface RecordingButtonProps {
  isDisabled?: boolean;
  onTranscriptChange?: (
    text: string,
    sentiments: z.infer<typeof SentimentsSchema> | null
  ) => void;
  onRecordingStatusChange: (isRecording: boolean) => void;
  className?: string;
}

export function RecordingButton({
  isDisabled = false,
  onTranscriptChange,
  onRecordingStatusChange,
  className,
}: RecordingButtonProps) {
  const {
    isRecording,
    transcript: transcriptText,
    sentiments,
    startRecording,
    stopRecording,
  } = useDeepgramPreRecordedWithSentiment();

  // Notify parent component of transcript and sentiment changes
  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcriptText, sentiments);
    }
  }, [transcriptText, sentiments, onTranscriptChange]);

  // Notify parent component of recording status changes
  useEffect(() => {
    onRecordingStatusChange(isRecording);
  }, [isRecording, onRecordingStatusChange]);

  const handleMicClick = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={cn(
          "group w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
          isRecording
            ? "bg-none"
            : "bg-none hover:bg-black/10 dark:hover:bg-white/10",
          className
        )}
        type="button"
        onClick={handleMicClick}
        disabled={isDisabled}
      >
        {isRecording ? (
          <div
            className="w-4 h-4 rounded-sm animate-spin bg-black dark:bg-white"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <Mic className="w-4 h-4 text-black/70 dark:text-white/70" />
        )}
      </button>
    </div>
  );
}
