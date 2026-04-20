import { NarrativeAngle } from '../types';

export class StrategistEngine {
  private currentAngle: NarrativeAngle | null = null;

  // Mocking the GPT Strategist defining the Narrative Angle of the Day
  async generateDailyAngle(): Promise<NarrativeAngle> {
    const today = new Date().toISOString().split('T')[0];
    
    // In a real scenario, this would call an LLM (e.g., Gemini) to generate the angle
    // based on trends, past performance, and catalog analysis to prevent cannibalization.
    const angles = [
      {
        date: today,
        angle: "Behind the Chords",
        description: "Focus on the raw emotion and the musical theory behind the creation process. Show the vulnerability of songwriting.",
        keywords: ["raw", "acoustic", "songwriting", "theory", "emotion"]
      },
      {
        date: today,
        angle: "Neon Nostalgia",
        description: "Highlight synth-heavy, retro-futuristic elements. Connect the music to 80s aesthetics and late-night drives.",
        keywords: ["synthwave", "retro", "neon", "night", "nostalgia"]
      },
      {
        date: today,
        angle: "The Drop Anatomy",
        description: "Break down the climax of the track. Focus on energy, bass, and crowd reaction potential.",
        keywords: ["edm", "bass", "drop", "energy", "festival"]
      }
    ];

    // Select a random angle for demonstration
    this.currentAngle = angles[Math.floor(Math.random() * angles.length)];
    return this.currentAngle;
  }

  getCurrentAngle(): NarrativeAngle | null {
    return this.currentAngle;
  }

  // Ensures generated assets align with the narrative angle
  alignAssetWithAngle(assetDescription: string): boolean {
    if (!this.currentAngle) return true;
    
    // Mock alignment check - in reality, an LLM would evaluate if the asset fits the angle
    const hasKeyword = this.currentAngle.keywords.some(kw => 
      assetDescription.toLowerCase().includes(kw.toLowerCase())
    );
    
    return hasKeyword;
  }
}

export const strategistEngine = new StrategistEngine();
