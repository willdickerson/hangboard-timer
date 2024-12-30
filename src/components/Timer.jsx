import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronDown, ChevronUp, Volume2, VolumeX, Info } from 'lucide-react';

const WORKOUT_STEPS = [
    { name: "Warm-up: Hang on Jug", duration: 10, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: Hang on Jug", duration: 10, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: 6 Pull-ups", duration: 20, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: 6 Pull-ups", duration: 20, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: Chisel Grip", duration: 10, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: Half Crimp", duration: 10, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: Three Finger Drag", duration: 10, sound: "start" },
    { name: "Warm-up: Rest", duration: 60, sound: "rest" },
    { name: "Warm-up: Half Crimp", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Chisel Grip", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Chisel Grip", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Chisel Grip", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Half Crimp", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Half Crimp", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Half Crimp", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Three Finger Drag", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Three Finger Drag", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: Three Finger Drag", duration: 10, sound: "start" },
    { name: "Main: Rest", duration: 120, sound: "rest" },
    { name: "Main: 12 Pull-ups", duration: 40, sound: "start" },
];

const sounds = {
  begin: new Audio("sounds/begin.mp3"),
  start: new Audio("sounds/start.mp3"),
  rest: new Audio("sounds/stop.mp3")
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WorkoutPreview = ({ steps, currentStep, isExpanded, onToggle }) => {
  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700">
      <button 
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-gray-200 hover:bg-gray-700/50 transition-colors"
      >
        <span className="font-medium">Workout Overview</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="p-4 max-h-96 overflow-y-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex justify-between py-3 px-4 rounded-lg mb-2 transition-colors ${
                index === currentStep 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'text-gray-300 hover:bg-gray-700/30'
              }`}
            >
              <span>{step.name}</span>
              <span className="font-mono">{formatTime(step.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-700/50 rounded-full h-2.5">
      <div 
        className="bg-green-500 h-2.5 rounded-full transition-all duration-300 relative overflow-hidden"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 animate-pulse" />
      </div>
    </div>
  );
};

const Timer = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  useEffect(() => {
    let interval = null;
    
    if (isStarted && (currentStepIndex >= -1) && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentStepIndex, isPaused, timeLeft, isStarted]);
  
  useEffect(() => {
    if (isStarted && timeLeft === 0) {
      if (currentStepIndex === -1) {
        setCurrentStepIndex(0);
        setTimeLeft(WORKOUT_STEPS[0].duration);
        playSound(WORKOUT_STEPS[0].sound);
      } else {
        nextStep();
      }
    }
  }, [timeLeft, isStarted, currentStepIndex]);
  
  const startTimer = () => {
    if (currentStepIndex === -1) {
      setIsStarted(true);
      setTimeLeft(15);
      setCurrentStepIndex(-1);
      playSound('begin');
    }
  };
  
  const nextStep = () => {
    if (currentStepIndex + 1 < WORKOUT_STEPS.length) {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      setTimeLeft(WORKOUT_STEPS[nextStepIndex].duration);
      playSound(WORKOUT_STEPS[nextStepIndex].sound);
    } else {
      // Workout complete
      setCurrentStepIndex(-2);
      setIsStarted(false);
      playSound('rest');
    }
  };
  
  const resetTimer = () => {
    setCurrentStepIndex(-1);
    setTimeLeft(15);
    setIsPaused(false);
    setIsStarted(false);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  const getCurrentStepName = () => {
    if (currentStepIndex === -1) return "Get Ready!";
    if (currentStepIndex === -2) return "Workout Complete!";
    return WORKOUT_STEPS[currentStepIndex].name;
  };
  
  const getNextStepName = () => {
    if (currentStepIndex === -1) return WORKOUT_STEPS[0].name;
    if (currentStepIndex >= WORKOUT_STEPS.length - 1) return "";
    return WORKOUT_STEPS[currentStepIndex + 1].name;
  };

  const playSound = (type) => {
    if (sounds[type] && !isMuted) {
      sounds[type].currentTime = 0;
      sounds[type].play().catch(error => {
        console.log('Error playing sound:', error);
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-4 py-2">
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <Info size={20} />
        </button>
      </div>

      {showInfo && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 text-sm text-gray-300">
          <h3 className="font-medium text-white mb-2">About this workout</h3>
          <p>This hangboard workout is designed for intermediate climbers to improve finger strength and endurance. 
             Always warm up properly and listen to your body. Stop if you experience any pain.</p>
        </div>
      )}
      
      <WorkoutPreview 
        steps={WORKOUT_STEPS}
        currentStep={currentStepIndex}
        isExpanded={isPreviewExpanded}
        onToggle={() => setIsPreviewExpanded(!isPreviewExpanded)}
      />
      
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          {getCurrentStepName()}
        </h1>
        
        <div className="text-7xl font-bold my-6 font-mono tabular-nums">
          {formatTime(timeLeft)}
        </div>
        
        {getNextStepName() && (
          <div className="text-gray-400 mb-4">
            Next: {getNextStepName()}
          </div>
        )}
        
        <ProgressBar 
          current={currentStepIndex + 1} 
          total={WORKOUT_STEPS.length} 
        />
        
        <div className="flex justify-center gap-4 mt-6">
          {!isStarted && currentStepIndex === -1 ? (
            <button
              onClick={startTimer}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       text-white px-8 py-4 rounded-xl flex items-center gap-2 font-medium shadow-lg 
                       transition-all duration-300 transform hover:scale-105"
            >
              <Play size={24} /> Start Workout
            </button>
          ) : (
            <>
              <button
                onClick={togglePause}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-all duration-300 
                         ${isPaused 
                           ? 'bg-green-600 hover:bg-green-700' 
                           : 'bg-yellow-600 hover:bg-yellow-700'}`}
                disabled={currentStepIndex === -2}
              >
                {isPaused ? <Play size={20} /> : <Pause size={20} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetTimer}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 
                         font-medium transition-colors"
              >
                <RotateCcw size={20} /> Reset
              </button>
            </>
          )}
        </div>
      </div>

      <div className="text-gray-400 text-sm text-center">
        Workout adapted from Dave MacLeod's&nbsp;
        <a
          href="https://www.youtube.com/watch?v=PebF3NyEGPc"
          className="text-green-400 hover:text-green-300 underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          follow along workout
        </a>.
      </div>
    </div>
  );
};

export default Timer;