"use client";
import { useEffect, useRef, useState } from "react";
import { Caveat, Lora } from "next/font/google";
import UserInputForm from "./Form/UserInputForm";
import { useJournalStore } from "../_store/journalStore";
import { SentimentsSchema } from "../_schemas/deepgram";
import { useCompletion } from "ai/react";
import { z } from "zod";
import EmptyState from "./EmptyState";
import { motion, AnimatePresence } from "framer-motion";

const caveat = Caveat({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });

const userCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    x: -20,
    scale: 0.95,
    rotate: -2
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotate: 1,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1],
      opacity: { duration: 0.3 },
      scale: { duration: 0.4 },
      rotate: { duration: 0.4 }
    }
  },
  hover: {
    rotate: 0,
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    rotate: 0,
    transition: {
      duration: 0.1
    }
  }
};

const coachCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    x: 20,
    scale: 0.95,
    rotate: 2
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    rotate: -1,
    transition: {
      duration: 0.5,
      ease: [0.645, 0.045, 0.355, 1],
      opacity: { duration: 0.3 },
      scale: { duration: 0.4 },
      rotate: { duration: 0.4 }
    }
  },
  hover: {
    rotate: 0,
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    rotate: 0,
    transition: {
      duration: 0.1
    }
  }
};

// Stagger child animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export default function JournalInterface() {
  const { entries, addEntry } = useJournalStore();
  const entriesEndRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      console.error("Error:", error);
      setIsProcessing(false);
    },
  });

  useEffect(() => {
    if (entries.length > 0) {
      entriesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    } else {
      window.scrollTo({ 
        top: 100,
        behavior: "smooth" 
      });
    }
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
    <div className={`min-h-screen bg-[#ECF6D8] ${lora.className}`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="popLayout">
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {entries.length === 0 && <EmptyState />}
            {entries.length > 0 && (
              <div className="min-h-screen">
                {entries.map((entry, index) => (
                  <motion.div
                    key={`${entry.id}-${index}`}
                    variants={entry.isCoach ? coachCardVariants : userCardVariants}
                    whileHover="hover"
                    whileTap="tap"
                    layout
                    className="origin-center mb-6"
                  >
                    {!entry.isCoach ? (
                      <div className="bg-[#dfffb7] p-6 rounded shadow-lg relative overflow-hidden backdrop-blur-sm">
                        <motion.div 
                          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                            transition: { 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        />
                        <motion.div 
                          className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c8e89e] to-transparent opacity-40"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                            transition: { 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1
                            }
                          }}
                        />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-[#e8ffcc] transform rotate-[-10deg] translate-x-2 -translate-y-2" />
                        <div className="relative">
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {entry.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#e4dceb] p-6 rounded shadow-lg relative overflow-hidden backdrop-blur-sm">
                        <motion.div 
                          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4cce0] to-transparent opacity-40"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                            transition: { 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        />
                        <motion.div 
                          className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4cce0] to-transparent opacity-40"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                            transition: { 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1
                            }
                          }}
                        />
                        <div className="absolute top-0 right-0 w-8 h-8 bg-[#f0eaf5] transform rotate-[-10deg] translate-x-2 -translate-y-2" />
                        <div className="relative">
                          <div className={`text-sm text-gray-600 mb-3 ${caveat.className}`}>
                            Juniper&apos;s Response
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {entry.content}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            <div ref={entriesEndRef} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 bg-[#E7F1D3]">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="bg-[#E7F1D3] rounded-lg p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <UserInputForm
              onSubmit={handleNewEntry}
              isWaitingOnAiResponse={isProcessing || isLoading}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}