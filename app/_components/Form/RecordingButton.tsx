"use client";

import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeepgram } from "@/app/_hooks/useDeepgram";

interface RecordingButtonProps {
  isDisabled?: boolean;
  onTranscriptChange?: (text: string) => void;
  className?: string;
}

export default function RecordingButton({
  isDisabled = false,
  onTranscriptChange,
  className,
}: RecordingButtonProps) {
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const { isRecording, transcriptText, startRecording, stopRecording } =
    useDeepgram();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Timer for recording duration
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRecording) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [isRecording]);

  // Notify parent component of transcript changes
  useEffect(() => {
    if (isRecording && onTranscriptChange) {
      onTranscriptChange(transcriptText);
    }
  }, [transcriptText, isRecording, onTranscriptChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
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

      {isRecording && (
        <>
          <span
            className={cn(
              "font-mono text-sm transition-opacity duration-300",
              "text-black/70 dark:text-white/70"
            )}
          >
            {formatTime(time)}
          </span>
          <div className="h-4 w-64 flex items-center justify-center gap-0.5">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-all duration-300",
                  "bg-black/50 dark:bg-white/50 animate-pulse"
                )}
                style={
                  isClient
                    ? {
                        height: `${20 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.05}s`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}