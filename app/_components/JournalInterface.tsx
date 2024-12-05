"use client";

import { useEffect, useRef } from "react";
import { Caveat, Lora } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle, Bot } from "lucide-react";
import UserInputForm from "./Form/UserInputForm";
import { useJournalStore } from "../_store/journalStore";
import { SentimentsSchema } from "../_schemas/deepgram";
import { z } from "zod";

const caveat = Caveat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });

export default function JournalInterface() {
  const { entries, addEntry } = useJournalStore();
  const entriesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    entriesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const handleNewEntry = async (
    content: string,
    sentiment: z.infer<typeof SentimentsSchema> | null
  ) => {
    addEntry(content, sentiment);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-[url('/paper-texture.png')] bg-repeat ${lora.className}`}
    >
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="mb-8 flex justify-between items-start animate-fade-in"
          >
            <div className="w-[48%] flex items-start space-x-2">
              <UserCircle className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <div
                  className={`text-sm text-gray-600 mb-1 ${caveat.className}`}
                >
                  {new Date(entry.date).toLocaleDateString()}{" "}
                  {new Date(entry.date).toLocaleTimeString()}
                </div>
                <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-blue-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>
            </div>
            {entry?.sentiment && (
              <div className="w-[48%] flex items-start space-x-2 justify-end">
                <Card className="flex-grow bg-amber-50 bg-opacity-80 shadow-sm border-amber-200">
                  <CardContent className="p-3">
                    <h3 className="text-sm font-semibold text-amber-700 mb-1">
                      Sentiment Analysis
                    </h3>
                    <p className="text-xs text-gray-700">
                      Sentiment: {entry.sentiment.average.sentiment}
                    </p>
                  </CardContent>
                </Card>
                <Bot className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
              </div>
            )}
          </div>
        ))}
        <div ref={entriesEndRef} />
      </div>
      <form className="sticky bottom-0 bg-white bg-opacity-90 border-t border-gray-200 p-4 md:p-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          <UserInputForm onSubmit={handleNewEntry} />
        </div>
      </form>
    </div>
  );
}
