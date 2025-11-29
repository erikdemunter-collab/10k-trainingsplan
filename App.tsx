import React, { useState } from 'react';
import { UserProfile, TrainingPlan } from './types';
import { generateTrainingPlan } from './services/geminiService';
import HistoryUpload from './components/HistoryUpload';
import PlanDisplay from './components/PlanDisplay';
import { Play, Loader2, Footprints } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [historyData, setHistoryData] = useState<string>("");
  
  // Form State
  const [currentTime, setCurrentTime] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [runsPerWeek, setRunsPerWeek] = useState(3);
  const [weeksToTrain, setWeeksToTrain] = useState(8);
  const [currentWeeklyDistance, setCurrentWeeklyDistance] = useState<number>(20);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profile: UserProfile = {
      current10kTime: currentTime || "Onbekend",
      goalTime: goalTime || "Sneller worden",
      runsPerWeek,
      weeksToTrain,
      currentWeeklyDistance,
      historySummary: historyData
    };

    try {
      const generatedPlan = await generateTrainingPlan(profile, historyData);
      setPlan(generatedPlan);
    } catch (error) {
      alert("Er ging iets mis bij het genereren van het plan. Controleer je API key of probeer het later opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setHistoryData("");
  };

  if (plan) {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <PlanDisplay plan={plan} onReset={handleReset} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="text-center mb-12 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4 shadow-sm ring-4 ring-white">
          <Footprints className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          10k RenCoach <span className="text-emerald-600">Pro</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Genereer een wetenschappelijk onderbouwd trainingsschema met AI, gebaseerd op jouw persoonlijke doelen, volume en hardloopgeschiedenis.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900">Je coach is aan het denken...</h3>
                    <p className="text-slate-500">Analyseren van historie en opstellen schema</p>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* Section 1: Times */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Jouw Niveau & Doelen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Huidige 10k Tijd
                            </label>
                            <input
                                type="text"
                                placeholder="bijv. 55:00 of 'Nooit gelopen'"
                                value={currentTime}
                                onChange={(e) => setCurrentTime(e.target.value)}
                                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Doel Tijd
                            </label>
                            <input
                                type="text"
                                placeholder="bijv. 50:00"
                                value={goalTime}
                                onChange={(e) => setGoalTime(e.target.value)}
                                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Huidig weekvolume (km)
                            </label>
                            <input
                                type="number"
                                placeholder="bijv. 20"
                                value={currentWeeklyDistance}
                                onChange={(e) => setCurrentWeeklyDistance(Number(e.target.value))}
                                className="w-full rounded-lg border-slate-300 border px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Availability */}
                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Beschikbaarheid</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Loopdagen per week: <span className="font-bold text-emerald-600">{runsPerWeek}</span>
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="6"
                                value={runsPerWeek}
                                onChange={(e) => setRunsPerWeek(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>2 dagen</span>
                                <span>6 dagen</span>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-2">
                                Duur van schema: <span className="font-bold text-emerald-600">{weeksToTrain} weken</span>
                            </label>
                             <input
                                type="range"
                                min="4"
                                max="16"
                                value={weeksToTrain}
                                onChange={(e) => setWeeksToTrain(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>4 weken</span>
                                <span>16 weken</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: History Upload */}
                <div className="space-y-4">
                     <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">Historiek (Integratie)</h2>
                     <HistoryUpload onDataLoaded={setHistoryData} />
                     <p className="text-xs text-slate-400 italic">
                        De geüploade data wordt niet opgeslagen, maar enkel eenmalig naar de AI gestuurd om je basisniveau te bepalen.
                     </p>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-slate-900 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-[1.01]"
                    >
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Genereer Mijn Plan
                    </button>
                </div>
            </form>
        )}
      </div>
      
      <footer className="mt-12 text-center text-sm text-slate-400">
        <p>Powered by Google Gemini 2.5 • Bouw langzaam op om blessures te voorkomen.</p>
      </footer>
    </div>
  );
};

export default App;