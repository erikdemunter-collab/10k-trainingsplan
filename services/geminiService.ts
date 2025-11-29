import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TrainingPlan, RunType, UserProfile } from "../types";

// Helper to get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key not found via process.env.API_KEY");
    // In a real scenario, handle this gracefully. For this demo, we assume it's injected.
    return "";
  }
  return key;
};

export const generateTrainingPlan = async (
  profile: UserProfile,
  historyData: string
): Promise<TrainingPlan> => {
  const ai = new GoogleGenAI({ apiKey: getApiKey() });

  const exerciseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Naam van de oefening" },
      setsReps: { type: Type.STRING, description: "Bijv. '3x12' of '30 sec'" },
      instructions: { type: Type.STRING, description: "Stap-voor-stap uitleg hoe de oefening uit te voeren." },
      visualCue: { type: Type.STRING, description: "Korte Engelse beschrijving van de oefening voor een afbeelding generator (bijv. 'Person doing lunges in gym')" },
    },
    required: ["name", "setsReps", "instructions", "visualCue"],
  };

  const workoutSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING, description: "Dag van de week (Maandag, Dinsdag...)" },
      type: { 
        type: Type.STRING, 
        enum: [
          RunType.Easy, 
          RunType.Tempo, 
          RunType.Interval, 
          RunType.Long, 
          RunType.Rest, 
          RunType.Recovery,
          RunType.Strength
        ],
        description: "Type training" 
      },
      distanceKm: { type: Type.NUMBER, description: "Afstand in kilometers (0 voor rustdag of kracht training)" },
      description: { type: Type.STRING, description: "Algemene beschrijving van de sessie" },
      targetPace: { type: Type.STRING, description: "Doeltempo indien van toepassing (bijv. 5:30/km)" },
      exercises: { 
        type: Type.ARRAY, 
        items: exerciseSchema, 
        description: "Lijst met specifieke oefeningen, VERPLICHT voor type Strength" 
      }
    },
    required: ["day", "type", "distanceKm", "description"],
  };

  const weekSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      weekNumber: { type: Type.INTEGER },
      focus: { type: Type.STRING, description: "Focus van deze week (bijv. Volume, Snelheid)" },
      totalDistanceKm: { type: Type.NUMBER },
      sessions: {
        type: Type.ARRAY,
        items: workoutSchema,
      },
    },
    required: ["weekNumber", "focus", "totalDistanceKm", "sessions"],
  };

  const planSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      summary: { type: Type.STRING, description: "Een motiverende samenvatting van het plan" },
      estimatedCompletionTime: { type: Type.STRING, description: "Geschatte eindtijd op de 10k" },
      weeks: {
        type: Type.ARRAY,
        items: weekSchema,
      },
    },
    required: ["title", "summary", "weeks", "estimatedCompletionTime"],
  };

  const prompt = `
    Je bent een professionele hardloopcoach en fitness instructeur.
    Maak een persoonlijk trainingsplan voor de 10km.
    
    Profiel van de loper:
    - Huidige 10k tijd: ${profile.current10kTime}
    - Doeltijd: ${profile.goalTime}
    - Gewenst aantal loopdagen per week: ${profile.runsPerWeek}
    - Aantal weken beschikbaar: ${profile.weeksToTrain}
    - Huidig weekvolume: ${profile.currentWeeklyDistance} km
    
    Loopgeschiedenis (uit geüpload bestand):
    ${historyData ? historyData.substring(0, 10000) : "Geen geschiedenis beschikbaar."}
    
    Instructies:
    1. Analyseer de geschiedenis (indien aanwezig) en het huidige weekvolume. 
    2. Bouw het volume veilig op (maximaal 10% toename per week).
    3. Loopdagen: Plan ${profile.runsPerWeek} loopdagen gericht op interval (snelheid) en duurlopen (uithouding).
    4. Fitness: Plan EXACT 3 fitness sessies per week. Gebruik type '${RunType.Strength}'.
       - Voor elke fitness sessie, genereer een lijst van 4-6 specifieke oefeningen in de 'exercises' array.
       - Geef voor elke oefening:
         - Naam
         - Sets en Reps
         - Een gedetailleerde, stap-voor-stap instructie hoe de oefening uit te voeren (in het Nederlands).
         - Een 'visualCue': een korte Engelse beschrijving van de actie (bijv. "woman doing kettlebell swings gym") die gebruikt zal worden om een afbeelding te genereren.
       - Varieer de focus per sessie (bijv. Benen, Core, Full Body).
    5. Rustdag: MAANDAG is altijd een vaste rustdag.
    6. Taal: Nederlands.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as TrainingPlan;
    }
    throw new Error("Geen tekst ontvangen van Gemini.");
  } catch (error) {
    console.error("Fout bij genereren plan:", error);
    throw error;
  }
};