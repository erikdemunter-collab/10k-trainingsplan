import React, { useState } from 'react';
import { TrainingPlan, RunType, TrainingWeek, Exercise } from '../types';
import { Calendar, ChevronDown, ChevronUp, Activity, Timer, TrendingUp, Dumbbell, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlanDisplayProps {
  plan: TrainingPlan;
  onReset: () => void;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  // Use a reliable placeholder service or AI generation service.
  // Pollinations.ai is great for dynamic prompts without keys.
  const imageUrl = `https://image.pollinations.ai/prompt/gym%20workout%20realistic%20photo%20${encodeURIComponent(exercise.visualCue)}?width=400&height=300&nologo=true&seed=${Math.random()}`;

  return (
    <div className="flex flex-col bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-40 w-full bg-slate-200 relative overflow-hidden group">
        <img 
            src={imageUrl} 
            alt={exercise.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=Fitness+Oefening";
            }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
             <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{exercise.name}</span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {exercise.setsReps}
            </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-2 flex-grow">
            {exercise.instructions}
        </p>
      </div>
    </div>
  );
};

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onReset }) => {
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? -1 : weekNum);
  };

  const chartData = plan.weeks.map(w => ({
    name: `Week ${w.weekNumber}`,
    km: w.totalDistanceKm
  }));

  const getTypeColor = (type: RunType) => {
    switch (type) {
      case RunType.Easy: return "bg-green-100 text-green-800 border-green-200";
      case RunType.Tempo: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case RunType.Interval: return "bg-red-100 text-red-800 border-red-200";
      case RunType.Long: return "bg-blue-100 text-blue-800 border-blue-200";
      case RunType.Rest: return "bg-slate-100 text-slate-500 border-slate-200";
      case RunType.Recovery: return "bg-purple-100 text-purple-800 border-purple-200";
      case RunType.Strength: return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{plan.title}</h2>
                    <p className="text-slate-600 max-w-2xl">{plan.summary}</p>
                </div>
                 <button onClick={onReset} className="hidden sm:block text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors bg-white px-4 py-2 border rounded-lg shadow-sm">
                    Nieuw Plan
                </button>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <Timer className="w-5 h-5 text-emerald-600 mr-2" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Geschatte Eindtijd</p>
                        <p className="font-bold text-slate-900">{plan.estimatedCompletionTime}</p>
                    </div>
                </div>
                <div className="flex items-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <TrendingUp className="w-5 h-5 text-emerald-600 mr-2" />
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Totaal Weken</p>
                        <p className="font-bold text-slate-900">{plan.weeks.length} weken</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-emerald-600" />
            Volume Progressie (km/week)
        </h3>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12}} 
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#64748b', fontSize: 12}} 
                    />
                    <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="km" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4 sm:hidden">
            <h3 className="text-xl font-bold text-slate-900">Jouw Schema</h3>
            <button onClick={onReset} className="text-sm font-medium text-emerald-600">
                Nieuw Plan
            </button>
        </div>

        {plan.weeks.map((week) => (
          <div key={week.weekNumber} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
            <button 
                onClick={() => toggleWeek(week.weekNumber)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold shadow-md">
                        {week.weekNumber}
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-slate-900">Week {week.weekNumber}</h4>
                        <p className="text-sm text-slate-500">{week.focus} • {week.totalDistanceKm} km</p>
                    </div>
                </div>
                {expandedWeek === week.weekNumber ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>

            {expandedWeek === week.weekNumber && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {week.sessions.map((session, idx) => (
                            <div key={idx} className={`bg-white rounded-lg border shadow-sm flex flex-col relative group transition-shadow ${session.type === RunType.Strength ? 'md:col-span-2 xl:col-span-3 border-orange-200' : 'border-slate-200 hover:shadow-md'}`}>
                                
                                {/* Session Header */}
                                <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-slate-900">{session.day}</span>
                                            {session.type === RunType.Strength && <Dumbbell className="w-4 h-4 text-orange-600" />}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getTypeColor(session.type)}`}>
                                            {session.type}
                                        </span>
                                    </div>
                                    
                                    {session.type !== RunType.Rest && session.type !== RunType.Strength && (
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-slate-900 block">{session.distanceKm} <span className="text-sm font-normal text-slate-500">km</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Session Content */}
                                <div className="p-4 flex-grow">
                                     <p className="text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-wrap">
                                        {session.description}
                                     </p>

                                     {/* Specific Rendering for Strength Sessions */}
                                     {session.type === RunType.Strength && session.exercises && session.exercises.length > 0 && (
                                         <div className="mt-4">
                                            <h5 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                                                <Info className="w-4 h-4 mr-1.5 text-orange-500" />
                                                Oefeningen
                                            </h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {session.exercises.map((ex, exIdx) => (
                                                    <ExerciseCard key={exIdx} exercise={ex} />
                                                ))}
                                            </div>
                                         </div>
                                     )}
                                     
                                     {session.targetPace && (
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500 font-medium">
                                            <Timer className="w-3 h-3 mr-1" />
                                            Target: {session.targetPace}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDisplay;