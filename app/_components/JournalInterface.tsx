"use client";

import { useEffect, useRef } from "react";
import { Caveat, Lora } from "next/font/google";
import UserInputForm from "./Form/UserInputForm";
import { useJournalStore } from "../_store/journalStore";
import { SentimentsSchema } from "../_schemas/deepgram";
import { z } from "zod";

const caveat = Caveat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });

export default function JournalInterface() {
  const { entries, addEntry } = useJournalStore();
  const entriesEndRef = useRef(null);

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
    <div className={`min-h-screen bg-gray-50 ${lora.className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          {entries.map((entry) => (
            <div 
              key={entry.id} 
              className="transform rotate-1 hover:rotate-0 transition-all duration-200"
            >
              {/* Sticky Note */}
              <div className="bg-[#dfffb7] p-6 rounded shadow-lg relative overflow-hidden">
                {/* Scuffed edges effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"></div>
                
                {/* Dog-eared corner */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-[#e8ffcc] transform rotate-[-10deg] translate-x-2 -translate-y-2"></div>
                
                {/* Content */}
                <div className="relative">
                  <div className={`text-sm text-gray-600 mb-3 ${caveat.className}`}>
                    {new Date(entry.date).toLocaleDateString()} at {" "}
                    {new Date(entry.date).toLocaleTimeString()}
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={entriesEndRef} />
        </div>
      </div>

      {/* Input area styled like the reference */}
      <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-4">

            {/* Text input form */}
            <UserInputForm onSubmit={handleNewEntry} />
          </div>
        </div>
      </div>
    </div>
  );
}