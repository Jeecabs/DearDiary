"use client";

// UserInputForm.tsx
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/app/_hooks/useAutoResizeTextArea";
import { RecordingButton } from "./RecordingButton";

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 200;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export default function UserInputForm() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  // Handle client-side rendering
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

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    // Simulate an async action
    setTimeout(() => {
      setInputValue("");
      adjustHeight(true);
      setIsLoading(false);
    }, 3000);
  };

  const handleTranscriptChange = (text: string) => {
    setInputValue(text);
    adjustHeight();
  };

  const onRecordingStatusChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex flex-col gap-2 items-center">
        {/* Input area */}
        <div className="relative w-full flex flex-col">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <Textarea
              id="user-input-form-textarea"
              ref={textareaRef}
              value={inputValue}
              placeholder="Type your message..."
              className={cn(
                "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]",
                `min-h-[${MIN_HEIGHT}px]`
              )}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!isLoading) {
                    handleSubmit();
                  }
                }
              }}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl relative flex items-center justify-between px-3">
            {/* Recording button */}
            {process.env.NODE_ENV === "development" ? (
              <div />
            ) : (
              <RecordingButton
                isDisabled={isLoading}
                onTranscriptChange={handleTranscriptChange}
                onRecordingStatusChange={onRecordingStatusChange}
              />
            )}
            {/* Send button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className={cn(
                "rounded-lg p-2 transition-colors",
                isLoading
                  ? "bg-none"
                  : inputValue.trim()
                  ? "bg-sky-500/15 text-sky-500"
                  : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
              )}
            >
              {isLoading ? (
                <div
                  className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Timer and bars if recording */}
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

        {/* Status message */}
        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isLoading
            ? "Your friend is thinking..."
            : "Ready to submit or click to speak"}
        </p>
      </div>
    </div>
  );
}
