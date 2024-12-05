"use client";
import { useEffect, useRef, useState } from "react";
import { Caveat, Lora } from "next/font/google";
import UserInputForm from "./Form/UserInputForm";
import { useJournalStore } from "../_store/journalStore";
import { SentimentsSchema } from "../_schemas/deepgram";
import { useCompletion } from 'ai/react';
import { z } from "zod";

const caveat = Caveat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });

export default function JournalInterface() {
  const { entries, addEntry } = useJournalStore();
  const entriesEndRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI completion setup
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/coach',
    onResponse: () => {
      // TODO: Need to put coaches response in the journal store  
      setIsProcessing(false);
    },
    onError: (err) => {
      console.error('AI Coach error:', err);
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const handleNewEntry = async (
    content: string,
    sentiment: z.infer<typeof SentimentsSchema> | null
  ) => {
    setIsProcessing(true);
    addEntry(content, sentiment);
    
    // Generate coach response
    try {
      const prompt = `The average sentiment of the following journal entry is ${sentiment?.average.sentiment}: The content of the journal entry is "${content}"
      `;
      
      await complete(prompt);
    } catch (error) {
      console.error('Error generating coach response:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${lora.className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="transform rotate-1 hover:rotate-0 transition-all duration-200"
            >
              {/* User Entry Sticky Note */}
              <div className="bg-[#dfffb7] p-6 rounded shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#e8ffcc] transform rotate-[-10deg] translate-x-2 -translate-y-2"></div>
                <div className="relative">
                  <div className={`text-sm text-gray-600 mb-3 ${caveat.className}`}>
                    {new Date(entry.date).toLocaleDateString()} at{" "}
                    {new Date(entry.date).toLocaleTimeString()}
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>

              {/* Coach Response Sticky Note */}
              {completion && (
                <div className="mt-4 transform -rotate-1 hover:rotate-0 transition-all duration-200">
                  <div className="bg-[#ffd1dc] p-6 rounded shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffb6c1] to-transparent opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ffb6c1] to-transparent opacity-40"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#ffe4e8] transform rotate-[-10deg] translate-x-2 -translate-y-2"></div>
                    <div className="relative">
                      <div className={`text-sm text-gray-600 mb-3 ${caveat.className}`}>
                        Juniper&apos;s Response
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {completion}
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

      {/* Input area */}
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