"use client";

import { useState, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/app/_hooks/useAutoResizeTextArea";
import { RecordingButton } from "./RecordingButton";
import { z } from "zod";
import { SentimentsSchema } from "@/app/_schemas/deepgram";
import { motion, AnimatePresence } from "framer-motion";

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 200;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

interface UserInputFormProps {
  onSubmit: (
    content: string,
    sentiment: z.infer<typeof SentimentsSchema> | null
  ) => Promise<void>;
}

export default function UserInputForm({ onSubmit }: UserInputFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<z.infer<
    typeof SentimentsSchema
  > | null>(null);

  // Flag to determine which mode we are in: voice-first (false) or text mode (true)
  const [isTextMode, setIsTextMode] = useState(false);

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

  const handleTranscriptChange = useCallback(
    (text: string, sentiments: z.infer<typeof SentimentsSchema> | null) => {
      setInputValue(text);
      setCurrentSentiment(sentiments);
      adjustHeight();
    },
    [adjustHeight]
  );

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    try {
      await onSubmit(inputValue, currentSentiment);
      setInputValue("");
      setCurrentSentiment(null);
      adjustHeight(true);
    } catch (error) {
      console.error("Error submitting entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRecordingStatusChange = (recording: boolean) => {
    setIsRecording(recording);
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex flex-col gap-4 items-center">
        <AnimatePresence mode="wait">
          {/* Voice-first mode */}
          {!isTextMode && (
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 w-full"
            >
              <RecordingButton
                isDisabled={isLoading}
                onTranscriptChange={handleTranscriptChange}
                onRecordingStatusChange={onRecordingStatusChange}
              />

              <AnimatePresence>
                {isRecording && (
                  <motion.div
                    key="recording-status"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "font-mono text-sm transition-opacity duration-300",
                        "text-black/70 dark:text-white/70"
                      )}
                    >
                      {formatTime(time)}
                    </span>
                    <motion.div
                      className="h-4 w-64 flex items-center justify-center gap-0.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {[...Array(48)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={cn(
                            "w-0.5 rounded-full",
                            "bg-black/50 dark:bg-white/50"
                          )}
                          style={
                            isClient
                              ? {
                                  height: `${20 + Math.random() * 80}%`,
                                }
                              : undefined
                          }
                          initial={{ opacity: 0.5 }}
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            transition: {
                              repeat: Infinity,
                              duration: 1.5,
                              delay: i * 0.05,
                              ease: "easeInOut",
                            },
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Real-time transcript preview during or after recording */}
              {inputValue && (
                <motion.div
                  key="transcript-preview"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full max-w-lg mt-4 flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-full bg-black/5 dark:bg-white/5 p-3 rounded-lg border-none dark:text-white text-black",
                      "text-sm"
                    )}
                  >
                    {inputValue}
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading || !inputValue.trim()}
                      className={cn(
                        "rounded-lg p-2 flex items-center gap-2 transition-colors",
                        isLoading
                          ? "bg-none"
                          : inputValue.trim()
                          ? "bg-sky-500/15 text-sky-500 hover:bg-sky-500/20"
                          : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                      )}
                      whileHover={{
                        scale: !isLoading && inputValue.trim() ? 1.05 : 1,
                      }}
                    >
                      {isLoading ? (
                        <div
                          className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin"
                          style={{ animationDuration: "3s" }}
                        />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span className="text-xs">Send</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Status message */}
              <p className="h-4 text-xs text-black/70 dark:text-white/70 mt-2">
                {isLoading
                  ? "Your friend is thinking..."
                  : isRecording
                  ? "Listening..."
                  : "Ready to listen!"}
              </p>

              {/* Option to switch to text input mode */}
              {!isRecording && (
                <motion.button
                  type="button"
                  onClick={() => setIsTextMode(true)}
                  className="text-sm text-sky-500 underline hover:text-sky-400"
                  whileHover={{ scale: 1.05 }}
                >
                  I prefer to write this
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Text mode */}
          {isTextMode && (
            <motion.div
              key="text-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative w-full flex flex-col"
            > 
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
                {/* Button to go back to voice mode */}
                <button
                  type="button"
                  onClick={() => setIsTextMode(false)}
                  className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                >
                  Back to voice
                </button>

                {/* Send button */}
                <motion.button
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
                  whileHover={{
                    scale: !isLoading && inputValue.trim() ? 1.05 : 1,
                  }}
                >
                  {isLoading ? (
                    <div
                      className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Status message */}
              <p className="h-4 text-xs text-black/70 dark:text-white/70 mt-2">
                {isLoading
                  ? "Your friend is thinking..."
                  : "Ready to submit or speak"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
