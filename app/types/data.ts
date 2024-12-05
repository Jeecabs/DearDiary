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
    },
    {
      transcript: "Another example with more variance.",
      confidence: 0.85,
      words: [
        {
          word: "Another",
          start: 0.0,
          end: 0.7,
          confidence: 0.88,
          punctuated_word: "Another"
        },
        {
          word: "example",
          start: 0.8,
          end: 1.5,
          confidence: 0.82,
          punctuated_word: "example"
        },
        {
          word: "with",
          start: 1.6,
          end: 2.0,
          confidence: 0.79,
          punctuated_word: "with"
        },
        {
          word: "more",
          start: 2.1,
          end: 2.5,
          confidence: 0.76,
          punctuated_word: "more"
        },
        {
          word: "variance",
          start: 2.6,
          end: 3.3,
          confidence: 0.73,
          punctuated_word: "variance."
        }
      ]
    }
  ]
};


export const dummyDeepgramResponse2 = {
  "entries": [
      {
          "id": "1733368548975",
          "date": "2024-12-05T03:15:48.975Z",
          "content": "test",
          "sentiment": null
      },
      {
          "id": "1733368552198",
          "date": "2024-12-05T03:15:52.198Z",
          "content": "Hmmm",
          "sentiment": null
      },
      {
          "id": "1733368553965",
          "date": "2024-12-05T03:15:53.965Z",
          "content": "asdf",
          "sentiment": null
      },
      {
          "id": "1733368555093",
          "date": "2024-12-05T03:15:55.093Z",
          "content": "asdf",
          "sentiment": null
      },
      {
          "id": "1733368556023",
          "date": "2024-12-05T03:15:56.023Z",
          "content": "asdf",
          "sentiment": null
      },
      {
          "id": "1733368556843",
          "date": "2024-12-05T03:15:56.843Z",
          "content": "asdf",
          "sentiment": null
      },
      {
          "id": "1733368566809",
          "date": "2024-12-05T03:16:06.809Z",
          "content": "9. So Yeah. So you're thinking more from the. Yeah. But yeah. I think like",
          "sentiment": {
              "segments": [
                  {
                      "text": "9. So Yeah. So you're thinking more from the. Yeah.",
                      "start_word": 0,
                      "end_word": 9,
                      "sentiment": "neutral",
                      "sentiment_score": 0.1571044921875
                  },
                  {
                      "text": "But yeah. I think like",
                      "start_word": 10,
                      "end_word": 14,
                      "sentiment": "positive",
                      "sentiment_score": 0.461669921875
                  }
              ],
              "average": {
                  "sentiment": "neutral",
                  "sentiment_score": 0.24404761904761904
              }
          }
      }
  ]
}

export const dummyDeepgramResponse3 = {
  "entries": [
      {
          "id": "1193085725416",
          "date": "2024-12-05T03:38:52.049729Z",
          "content": "Today was a good day. I stuck to my meal plan and managed to walk for 30 minutes in the evening. Feeling proud of myself for staying on track.",
          "sentiment": {
              "segments": [
                  {
                      "text": "Today was a good day.",
                      "start_word": 0,
                      "end_word": 4,
                      "sentiment": "positive",
                      "sentiment_score": 0.875
                  },
                  {
                      "text": "I stuck to my meal plan and managed to walk for 30 minutes in the evening.",
                      "start_word": 5,
                      "end_word": 15,
                      "sentiment": "positive",
                      "sentiment_score": 0.645
                  },
                  {
                      "text": "Feeling proud of myself for staying on track.",
                      "start_word": 16,
                      "end_word": 21,
                      "sentiment": "positive",
                      "sentiment_score": 0.931
                  }
              ],
              "average": {
                  "sentiment": "positive",
                  "sentiment_score": 0.817
              }
          }
      },
      {
          "id": "1069055064482",
          "date": "2024-12-04T03:38:52.049791Z",
          "content": "Felt a bit tired today but still managed to avoid snacking between meals. Didn't get my steps in, but tomorrow's a new day.",
          "sentiment": {
              "segments": [
                  {
                      "text": "Felt a bit tired today but still managed to avoid snacking between meals.",
                      "start_word": 0,
                      "end_word": 13,
                      "sentiment": "neutral",
                      "sentiment_score": 0.423
                  },
                  {
                      "text": "Didn't get my steps in, but tomorrow's a new day.",
                      "start_word": 14,
                      "end_word": 20,
                      "sentiment": "positive",
                      "sentiment_score": 0.612
                  }
              ],
              "average": {
                  "sentiment": "neutral",
                  "sentiment_score": 0.5175
              }
          }
      },
      {
          "id": "1305172813853",
          "date": "2024-12-03T03:38:52.049826Z",
          "content": "Overate at dinner, but it was a celebration with friends. Feeling a bit guilty, but I’ll make up for it tomorrow.",
          "sentiment": {
              "segments": [
                  {
                      "text": "Overate at dinner, but it was a celebration with friends.",
                      "start_word": 0,
                      "end_word": 10,
                      "sentiment": "neutral",
                      "sentiment_score": 0.340
                  },
                  {
                      "text": "Feeling a bit guilty, but I’ll make up for it tomorrow.",
                      "start_word": 11,
                      "end_word": 18,
                      "sentiment": "neutral",
                      "sentiment_score": 0.412
                  }
              ],
              "average": {
                  "sentiment": "neutral",
                  "sentiment_score": 0.376
              }
          }
      },
      {
          "id": "1590398829117",
          "date": "2024-12-02T03:38:52.049846Z",
          "content": "Hit the gym for the first time in weeks! Felt exhausted but proud. Excited to keep building this habit.",
          "sentiment": {
              "segments": [
                  {
                      "text": "Hit the gym for the first time in weeks!",
                      "start_word": 0,
                      "end_word": 8,
                      "sentiment": "positive",
                      "sentiment_score": 0.833
                  },
                  {
                      "text": "Felt exhausted but proud.",
                      "start_word": 9,
                      "end_word": 13,
                      "sentiment": "positive",
                      "sentiment_score": 0.713
                  },
                  {
                      "text": "Excited to keep building this habit.",
                      "start_word": 14,
                      "end_word": 19,
                      "sentiment": "positive",
                      "sentiment_score": 0.894
                  }
              ],
              "average": {
                  "sentiment": "positive",
                  "sentiment_score": 0.813
              }
          }
      },
      {
          "id": "1722228680906",
          "date": "2024-12-01T03:38:52.049862Z",
          "content": "Struggled with cravings today and ended up eating some sweets. Feeling disappointed but determined to do better tomorrow.",
          "sentiment": {
              "segments": [
                  {
                      "text": "Struggled with cravings today and ended up eating some sweets.",
                      "start_word": 0,
                      "end_word": 10,
                      "sentiment": "negative",
                      "sentiment_score": -0.523
                  },
                  {
                      "text": "Feeling disappointed but determined to do better tomorrow.",
                      "start_word": 11,
                      "end_word": 19,
                      "sentiment": "neutral",
                      "sentiment_score": 0.216
                  }
              ],
              "average": {
                  "sentiment": "neutral",
                  "sentiment_score": -0.1535
              }
          }
      }
  ]
}