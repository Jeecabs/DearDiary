"use client";

import { lazy, useState } from "react";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/app/_hooks/useAutoResizeTextArea";
const RecordingButton = lazy(() => import("./RecordingButton"));

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 200;

export default function UserInputForm() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

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
            {/* Recording button ~ Broken on dev server */}
            {process.env.NODE_ENV === "development" ? (
              <div />
            ) : (
              <RecordingButton
                isDisabled={isLoading}
                onTranscriptChange={handleTranscriptChange}
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
