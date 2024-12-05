// types.ts
export interface DeepgramWord {
    word: string;
    start: number;
    end: number;
    confidence: number;
    speaker?: number;
    punctuated_word: string;
  }
  
  export interface TranscriptionAlternative {
    transcript: string;
    confidence: number;
    words: DeepgramWord[];
  }
  
  // THIS IS THE HIGH LEVEL TYPE YOU GET BACK!
  export interface TranscriptionResponse {
    alternatives: TranscriptionAlternative[];  
  }
  
  // mapper.ts
  export class TranscriptionMapper {
    static extractWords(response: TranscriptionResponse): DeepgramWord[] {
      return response.alternatives[0]?.words || [];
    }
  
    static getFullTranscript(response: TranscriptionResponse): string {
      return response.alternatives[0]?.transcript || '';
    }
  
    static getConfidentWords(response: TranscriptionResponse, confidenceThreshold = 0.9): DeepgramWord[] {
      return this.extractWords(response).filter(word => word.confidence >= confidenceThreshold);
    }
  
    static formatTimestamp(seconds: number): string {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  
    static mapToTimelineFormat(words: DeepgramWord[]): Array<{ time: string; text: string }> {
      return words.map(word => ({
        time: this.formatTimestamp(word.start),
        text: word.punctuated_word
      }));
    }
  }
  
  // Usage example:
  /*
  const handleTranscriptionData = (response: TranscriptionResponse) => {
    // Get all words
    const allWords = TranscriptionMapper.extractWords(response);
    
    // Get just highly confident words
    const confidentWords = TranscriptionMapper.getConfidentWords(response, 0.95);
    
    // Get full transcript text
    const transcript = TranscriptionMapper.getFullTranscript(response);
    
    // Get timeline format
    const timeline = TranscriptionMapper.mapToTimelineFormat(allWords);
    
    return {
      transcript,
      timeline,
      wordCount: allWords.length,
      averageConfidence: allWords.reduce((acc, word) => acc + word.confidence, 0) / allWords.length
    };
  };
  */