import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, MessageCircle, X, Maximize2 } from 'lucide-react';
import { Screen } from '../lib/types';

interface VideoCallProps {
  onNavigate: (screen: Screen) => void;
}

export function VideoCall({ onNavigate }: VideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onNavigate('dashboard');
  };

  return (
    <div className="relative h-screen w-screen bg-gradient-to-br from-gray-900 to-slate-800 overflow-hidden">
      {/* Main Video Feed - AI Doctor */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1758691461916-dc7894eb8f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY29uc3VsdGF0aW9uJTIwdmlkZW8lMjBjYWxsfGVufDF8fHx8MTc2NTQ2MDM5Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI Doctor Consultation"
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
      </div>

      {/* Top Bar - Glassmorphic */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-white">{formatTime(callDuration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg"></div>
          <span className="text-white text-sm ml-2 backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full">Excellent Connection</span>
        </div>
      </div>

      {/* Doctor Info Overlay - Glassmorphic */}
      <div className="absolute top-24 left-6 backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-5 rounded-2xl text-white z-20 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#29516a] to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">👨‍⚕️</span>
          </div>
          <div>
            <h2 className="text-2xl mb-1">Dr. Aria</h2>
            <p className="text-sm text-gray-300">AI Medical Specialist • General Medicine</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-green-300">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Self View (Picture-in-Picture) - Glassmorphic */}
      <div className="absolute top-24 right-6 w-48 h-64 backdrop-blur-xl bg-white/10 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl z-20">
        {isVideoOff ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-slate-900 flex flex-col items-center justify-center">
            <VideoOff className="text-gray-400 mb-3" size={40} />
            <p className="text-sm text-gray-400">Camera Off</p>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#29516a] to-teal-700 flex flex-col items-center justify-center relative">
            <span className="text-6xl mb-2">👤</span>
            <span className="text-sm text-white/80">You</span>
            <button className="absolute top-3 right-3 p-2 backdrop-blur-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <Maximize2 size={16} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Control Bar - Glassmorphic */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="max-w-2xl mx-auto backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-8">
            {/* Mute/Unmute */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110 ${isMuted
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
                  : 'backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30'
                }`}
            >
              {isMuted ? (
                <MicOff className="text-white" size={28} />
              ) : (
                <Mic className="text-white" size={28} />
              )}
            </button>

            {/* End Call */}
            <button
              onClick={handleEndCall}
              className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center hover:from-red-600 hover:to-red-700 transition-all shadow-2xl shadow-red-500/50 transform hover:scale-110"
            >
              <Phone className="text-white rotate-[135deg]" size={32} />
            </button>

            {/* Video On/Off */}
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110 ${isVideoOff
                  ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
                  : 'backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30'
                }`}
            >
              {isVideoOff ? (
                <VideoOff className="text-white" size={28} />
              ) : (
                <Video className="text-white" size={28} />
              )}
            </button>

            {/* Transcript Toggle */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all transform hover:scale-110 ${showTranscript
                  ? 'bg-[#29516a] shadow-lg shadow-teal-500/50'
                  : 'backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30'
                }`}
            >
              <MessageCircle className="text-white" size={28} />
            </button>
          </div>

          <div className="mt-4 text-center text-white/60 text-sm">
            Tap icons to control your call
          </div>
        </div>
      </div>

      {/* Live Transcript Sidebar - Glassmorphic */}
      {showTranscript && (
        <div className="absolute right-0 top-0 bottom-0 w-96 backdrop-blur-2xl bg-white/95 shadow-2xl z-30 transform transition-transform border-l border-white/40">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200/50 flex items-center justify-between backdrop-blur-sm bg-white/50">
              <div>
                <h3 className="text-xl text-[#29516a]">Live Transcript</h3>
                <p className="text-xs text-gray-600">Real-time conversation</p>
              </div>
              <button
                onClick={() => setShowTranscript(false)}
                className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="backdrop-blur-sm bg-teal-50/80 border border-teal-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 mb-2">Dr. Aria • {formatTime(callDuration - 45)}</p>
                <p className="text-sm text-gray-800">Hello! I've reviewed your case file regarding the bronchitis symptoms. How are you feeling today?</p>
              </div>
              <div className="backdrop-blur-sm bg-gray-100/80 border border-gray-200 p-4 rounded-2xl ml-8">
                <p className="text-xs text-gray-500 mb-2">You • {formatTime(callDuration - 38)}</p>
                <p className="text-sm text-gray-800">I'm still experiencing some chest discomfort when breathing deeply.</p>
              </div>
              <div className="backdrop-blur-sm bg-teal-50/80 border border-teal-100 p-4 rounded-2xl">
                <p className="text-xs text-gray-500 mb-2">Dr. Aria • {formatTime(callDuration - 30)}</p>
                <p className="text-sm text-gray-800">Based on your symptoms and the AI analysis, this is expected with acute bronchitis. Let's discuss your treatment plan and what you can do to feel better...</p>
              </div>
              <div className="backdrop-blur-sm bg-gray-100/80 border border-gray-200 p-4 rounded-2xl ml-8">
                <p className="text-xs text-gray-500 mb-2">You • {formatTime(callDuration - 15)}</p>
                <p className="text-sm text-gray-800">Should I be concerned about the persistent cough?</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
