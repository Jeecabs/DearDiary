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
      <div className="flex justify-center">
        <button
          className={cn(
            "w-32 h-32 rounded-full relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900",
            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            className
          )}
          onClick={handleMicClick}
          disabled={isDisabled}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {/* Layered circular backgrounds */}
          <div className="absolute inset-0 bg-lime-200 rounded-full"></div>
          <div className="absolute inset-3 bg-green-200 rounded-full"></div>
          <div className="absolute inset-5 bg-white rounded-full"></div>
          <div className="absolute inset-7 bg-emerald-900 rounded-full flex items-center justify-center">
            {isRecording ? (
              <div className="w-8 h-8 rounded-sm bg-white animate-spin" 
                   style={{ animationDuration: "3s" }} />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default RecordingButton;