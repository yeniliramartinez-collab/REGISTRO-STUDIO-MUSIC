export interface ProsodyResult {
  ssml: string;
  timingMap: WordTiming[];
  stats: {
    totalSyllables: number;
    bars: number;
    breaths: number;
  };
}

export interface WordTiming {
  word: string;
  start: number;
  duration: number;
  barIndex: number;
}

export class ProsodyEngine {
  
  /**
   * Calculates the duration of a single bar in seconds.
   */
  static calculateBarDuration(bpm: number, timeSignature: [number, number] = [4, 4]): number {
    const beatsPerBar = timeSignature[0];
    const secondsPerBeat = 60 / bpm;
    return beatsPerBar * secondsPerBeat;
  }

  /**
   * Heuristic syllable counter for Spanish/English text.
   */
  static countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    // Simple vowel cluster counting
    const syllableMatch = word.match(/[aeiouáéíóúüy]+/g);
    return syllableMatch ? syllableMatch.length : 1;
  }

  /**
   * Processes raw lyrics into production-ready SSML with timing data.
   */
  static processLyrics(lyrics: string, bpm: number = 90): ProsodyResult {
    const barDuration = this.calculateBarDuration(bpm);
    const words = lyrics.split(/\s+/);
    const timingMap: WordTiming[] = [];
    let ssmlParts: string[] = [];
    
    let currentBarSyllables = 0;
    let currentBarIndex = 1;
    let currentTime = 0;
    let totalSyllables = 0;
    let breathCount = 0;

    // Recommended max syllables per bar (7-9)
    const MAX_SYLLABLES_PER_BAR = 9; 

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const syllables = this.countSyllables(word);
      totalSyllables += syllables;
      
      // Calculate timing (distribute syllables within the bar)
      // This is a simplification; real alignment would use phoneme duration tables.
      const estimatedDuration = (syllables / MAX_SYLLABLES_PER_BAR) * barDuration;
      
      timingMap.push({
        word,
        start: parseFloat(currentTime.toFixed(2)),
        duration: parseFloat(estimatedDuration.toFixed(2)),
        barIndex: currentBarIndex
      });

      currentTime += estimatedDuration;
      currentBarSyllables += syllables;
      ssmlParts.push(word);

      // Logic for inserting breaths/breaks
      const isEndOfPhrase = word.match(/[.,;!?]$/);
      const isBarFull = currentBarSyllables >= MAX_SYLLABLES_PER_BAR;

      if (isBarFull || isEndOfPhrase) {
        // Insert breath
        ssmlParts.push(`<break time="300ms"/>`);
        breathCount++;
        
        // Reset for next bar/phrase
        currentBarSyllables = 0;
        currentBarIndex++;
        
        // Adjust time for breath (simulated pause in flow, though usually eats into next bar or is a rest)
        currentTime += 0.3; 
      }
    }

    return {
      ssml: `<speak>${ssmlParts.join(' ')}</speak>`,
      timingMap,
      stats: {
        totalSyllables,
        bars: currentBarIndex,
        breaths: breathCount
      }
    };
  }
}
