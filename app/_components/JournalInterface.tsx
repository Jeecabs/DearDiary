"use client";
import { useEffect, useRef, useState } from "react";
import { Caveat, Lora } from "next/font/google";
import UserInputForm from "./Form/UserInputForm";
import { useJournalStore } from "../_store/journalStore";
import { SentimentsSchema } from "../_schemas/deepgram";
import { useCompletion } from "ai/react";
import { z } from "zod";
import EmptyState from "./EmptyState";

const caveat = Caveat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });

export default function JournalInterface() {
  const { entries, addEntry } = useJournalStore();
  const entriesEndRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI completion setup with proper typing and error handling
  const { complete, isLoading } = useCompletion({
    api: "/api/coach",
    onResponse: async (response) => {
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      try {
        const responseText = await response.text();
        console.log("Coach response:", responseText);

        if (responseText) {
          addEntry(responseText, null, true);
        }
      } catch (error) {
        console.error("Error processing coach response:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      console.log("Error:", error);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const handleNewEntry = async (
    content: string,
    sentiment: z.infer<typeof SentimentsSchema> | null
  ) => {
    setIsProcessing(true);
    addEntry(content, sentiment, false);

    try {
      const prompt = `The average sentiment of the following journal entry is ${
        sentiment?.average.sentiment ?? "neutral"
      }: The content of the journal entry is "${content}"`;

      await complete(prompt);
    } catch (error) {
      console.error("Error generating coach response:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${lora.className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          {entries.length === 0 && <EmptyState />}
          {entries.length > 0 &&
            entries.map((entry) => (
              <div
                key={entry.id}
                className="transform rotate-1 hover:rotate-0 transition-all duration-200"
              >
                {!entry.isCoach ? (
                  <div className="bg-[#dfffb7] p-6 rounded shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#e8ffcc] transform rotate-[-10deg] translate-x-2 -translate-y-2"></div>
                    <div className="relative">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 transform -rotate-1 hover:rotate-0 transition-all duration-200">
                    <div className="bg-[#e4dceb] p-6 rounded shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4cce0] to-transparent opacity-40"></div>
                      <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4cce0] to-transparent opacity-40"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 bg-[#f0eaf5] transform rotate-[-10deg] translate-x-2 -translate-y-2"></div>
                      <div className="relative">
                        <div
                          className={`text-sm text-gray-600 mb-3 ${caveat.className}`}
                        >
                          Juniper&apos;s Response
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          <div ref={entriesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-4">
            <UserInputForm
              onSubmit={handleNewEntry}
              isWaitingOnAiResponse={isProcessing || isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
