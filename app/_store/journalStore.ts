import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SentimentsSchema } from "../_schemas/deepgram";
import { z } from "zod";

interface JournalState {
  entries: Array<{
    id: string;
    date: Date;
    content: string;
    sentiment: z.infer<typeof SentimentsSchema> | null;
  }>;
  addEntry: (
    content: string,
    sentiment: z.infer<typeof SentimentsSchema> | null
  ) => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (content, sentiment) => {
        const newEntry = {
          id: Date.now().toString(),
          date: new Date(),
          content: content.trim(),
          sentiment,
        };
        set((state) => ({
          entries: [...state.entries, newEntry],
        }));
      },
    }),
    {
      name: "journal-storage",
    }
  )
);
