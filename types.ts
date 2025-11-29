export enum RunType {
  Easy = 'Rustig',
  Tempo = 'Tempo',
  Interval = 'Interval',
  Long = 'Duurloop',
  Rest = 'Rust',
  Recovery = 'Herstel',
  Strength = 'Kracht/Core'
}

export interface Exercise {
  name: string;
  setsReps: string;
  instructions: string;
  visualCue: string; // English description for image generation
}

export interface WorkoutSession {
  day: string;
  type: RunType;
  distanceKm: number;
  description: string;
  targetPace?: string; // e.g., "5:30 min/km"
  exercises?: Exercise[];
}

export interface TrainingWeek {
  weekNumber: number;
  focus: string; // e.g., "Base Building", "Speed", "Taper"
  totalDistanceKm: number;
  sessions: WorkoutSession[];
}

export interface TrainingPlan {
  title: string;
  summary: string;
  weeks: TrainingWeek[];
  estimatedCompletionTime: string;
}

export interface UserProfile {
  current10kTime: string; // e.g. "55:00" or "Nog nooit gelopen"
  goalTime: string; // e.g. "50:00"
  runsPerWeek: number;
  weeksToTrain: number;
  currentWeeklyDistance: number;
  historySummary?: string; // Summary of uploaded file
}