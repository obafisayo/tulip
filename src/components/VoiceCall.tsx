import { useState, useEffect } from 'react';
import { Mic, Phone, MessageSquare, AlertCircle, ArrowLeft, User } from 'lucide-react';
import { Screen } from '../lib/types';

interface VoiceCallProps {
  onNavigate: (screen: Screen) => void;
}

export function VoiceCall({ onNavigate }: VoiceCallProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [pulseScale, setPulseScale] = useState(1);
  const [currentNurse] = useState({
    name: 'Sarah Mitchell',
    specialty: 'Triage Specialist',
    image: 'https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NTQ2MTYyNnww&ixlib=rb-4.1.0&q=80&w=1080'
  });

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseScale(prev => prev === 1 ? 1.15 : 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const handleToggleListen = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setTranscript("I've been experiencing severe headaches for the past two days, especially in the morning...");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#29516a] via-teal-600 to-cyan-700 relative overflow-hidden">
      {/* Glassmorphic Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        {/* Nurse Info Card */}
        <div className="mb-8 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 relative">
              <img
                src={currentNurse.image}
                alt={currentNurse.name}
                className="w-full h-full object-cover mix-blend-screen"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="text-white">
              <h3 className="text-xl">{currentNurse.name}</h3>
              <p className="text-sm text-white/70">{currentNurse.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Available Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-12">
          <h1 className="text-5xl text-white mb-4">
            {isListening ? 'Listening...' : 'Ready to Connect'}
          </h1>
          <p className="text-xl text-white/80">
            {isListening
              ? 'Speak clearly about your symptoms'
              : 'Tap the microphone to start speaking with the nurse'}
          </p>
        </div>

        {/* Microphone Button with Animations */}
        <div className="relative mb-12">
          {/* Animated Rings */}
          {isListening && (
            <>
              <div className="absolute inset-0 -m-12 rounded-full border-4 border-white/20 animate-ping"></div>
              <div className="absolute inset-0 -m-20 rounded-full border-4 border-white/15 animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-0 -m-28 rounded-full border-4 border-white/10 animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </>
          )}

          {/* Sound Wave Visualization */}
          {isListening && (
            <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white/70 rounded-full animate-pulse shadow-lg"
                  style={{
                    height: `${Math.random() * 50 + 30}px`,
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: '0.6s'
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Main Microphone Button */}
          <button
            onClick={handleToggleListen}
            className={`w-56 h-56 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isListening
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50'
                : 'backdrop-blur-xl bg-white/20 border-4 border-white/30 hover:bg-white/30'
              }`}
            style={{
              transform: isListening ? `scale(${pulseScale})` : 'scale(1)'
            }}
          >
            {isListening ? (
              <Phone className="text-white rotate-[135deg]" size={72} />
            ) : (
              <Mic className="text-white" size={72} />
            )}
          </button>
        </div>

        {/* Live Transcript Card */}
        {transcript && (
          <div className="w-full max-w-3xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-white" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60 mb-2">You said:</p>
                  <p className="text-white text-lg leading-relaxed">{transcript}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/20"></div>

            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span>👩‍⚕️</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60 mb-2">{currentNurse.name}:</p>
                  <p className="text-white text-lg leading-relaxed">
                    I understand you're experiencing severe headaches. Can you describe the pain level and tell me if you've taken any medication?
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Options */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all"
          >
            Switch to Text Chat
          </button>
          <button className="flex items-center gap-3 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-6 py-3 rounded-2xl border border-white/20">
            <AlertCircle size={20} />
            Emergency Numbers
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative z-10 text-center pb-8">
        <p className="text-white/50 text-sm backdrop-blur-sm bg-white/5 inline-block px-6 py-2 rounded-full">
          🔒 This call is encrypted and may be recorded for quality assurance
        </p>
      </div>
    </div>
  );
}
