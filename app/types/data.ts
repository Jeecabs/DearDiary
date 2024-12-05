import { TranscriptionResponse } from './deepgram';

export const dummyDeepgramResponse: TranscriptionResponse = {
    alternatives: [
    {
      transcript: "Hello world. This is a test transcription.",
      confidence: 0.98,
      words: [
        {
          word: "Hello",
          start: 0.0,
          end: 0.5,
          confidence: 0.99,
          punctuated_word: "Hello"
        },
        {
          word: "world",
          start: 0.6,
          end: 1.0,
          confidence: 0.98,
          punctuated_word: "world."
        },
        {
          word: "This",
          start: 1.1,
          end: 1.4,
          confidence: 0.97,
          punctuated_word: "This"
        },
        {
          word: "is",
          start: 1.5,
          end: 1.6,
          confidence: 0.96,
          punctuated_word: "is"
        },
        {
          word: "a",
          start: 1.7,
          end: 1.8,
          confidence: 0.95,
          punctuated_word: "a"
        },
        {
          word: "test",
          start: 1.9,
          end: 2.2,
          confidence: 0.94,
          punctuated_word: "test"
        },
        {
          word: "transcription",
          start: 2.3,
          end: 3.0,
          confidence: 0.93,
          punctuated_word: "transcription."
        }
      ]
    }
  ]
};