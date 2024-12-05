import { z } from "zod";

/**
 * Schema definitions for Deepgram response
 */
export const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  speaker: z.number().nullish(),
  punctuated_word: z.string(),
});

export const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
});

export const SentimentSegmentSchema = z.object({
  text: z.string(),
  start_word: z.number(),
  end_word: z.number(),
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

export const SentimentAverageSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative"]),
  sentiment_score: z.number(),
});

export const SentimentsSchema = z.object({
  segments: z.array(SentimentSegmentSchema),
  average: SentimentAverageSchema,
});

export const ChannelSchema = z.object({
  alternatives: z.array(AlternativeSchema),
});

export const ResultsSchema = z.object({
  channels: z.array(ChannelSchema),
  sentiments: SentimentsSchema.nullish(),
});

export const DeepgramResponseSchema = z.object({
  metadata: z.record(z.unknown()).nullish(),
  results: ResultsSchema,
});
