import { useState, useEffect, useRef } from 'react';
import { Phone, Home, User, Upload, Send, Activity } from 'lucide-react';
import { scrollToTop } from './ScrollToTop';

interface DashboardProps {
  onNavigate: (screen: 'landing' | 'dashboard' | 'results' | 'audit' | 'video' | 'voice', symptoms?: string) => void;
  caseData: {
    caseId: string;
    analyzing: boolean;
    complete: boolean;
  };
  onStartAnalysis: (symptoms: string, urgency: string) => Promise<void>;
  isSubmitting: boolean;
  initialSymptoms?: string;
}

export function Dashboard({ onNavigate, caseData, onStartAnalysis, isSubmitting, initialSymptoms }: DashboardProps) {
  const [symptoms, setSymptoms] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const hasSubmittedRef = useRef(false);
  const initialSymptomsRef = useRef<string>('');
  scrollToTop();

  // Set initial symptoms and auto-submit if provided
  useEffect(() => {
    // Only process if we have new initialSymptoms that haven't been submitted
    if (initialSymptoms && 
        initialSymptoms.trim() && 
        !hasSubmittedRef.current && 
        initialSymptoms !== initialSymptomsRef.current &&
        !caseData.analyzing) {  // Don't submit if already analyzing
      
      console.log('Auto-submitting symptoms:', initialSymptoms);
      setSymptoms(initialSymptoms);
      hasSubmittedRef.current = true;
      initialSymptomsRef.current = initialSymptoms;
      
      // Auto-submit after a brief delay to allow UI to render
      const timer = setTimeout(() => {
        onStartAnalysis(initialSymptoms, "low");
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [initialSymptoms, onStartAnalysis, caseData.analyzing]);
  
  // Reset the submission flag when analysis completes or when navigating to dashboard without symptoms
  useEffect(() => {
    if (caseData.complete) {
      console.log('Analysis complete, resetting flags');
      hasSubmittedRef.current = false;
    }
    
    if (!initialSymptoms) {
      hasSubmittedRef.current = false;
      initialSymptomsRef.current = '';
    }
  }, [initialSymptoms, caseData.complete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleSubmit = () => {
    onStartAnalysis(symptoms, "low");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #016064 2%, transparent 0%), radial-gradient(circle at 75px 75px, #016064 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>

      {/* Glassmorphic Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <span className="text-white text-2xl">🌷</span>
            <div>
              <span className="text-2xl text-[#016064]">Tulip</span>
              <p className="text-xs text-gray-600">Patient Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#016064] transition-colors"
            >
              <Home size={20} />
              Home
            </button>
            <button className="flex items-center gap-2 text-[#016064]">
              <Activity size={20} />
              My Cases
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-[#016064] transition-colors">
              <User size={20} />
              Profile
            </button>
          </nav>

          <button 
            onClick={() => onNavigate('voice')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Phone size={20} />
            Emergency
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Analysis Card */}
        {(caseData.analyzing || caseData.complete) && (
          <div className={`backdrop-blur-xl p-8 rounded-3xl border shadow-2xl ${
            caseData.complete 
              ? 'bg-gradient-to-br from-green-400/30 to-emerald-400/30 border-green-300/40' 
              : 'bg-white/40 border-white/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {caseData.analyzing ? (
                  <>
                    <h3 className="text-2xl mb-2 text-[#016064]">AI Analysis in Progress...</h3>
                    <p className="text-gray-700 mb-4">Case #{caseData.caseId} • Processing your medical data</p>
                    <div className="relative w-full h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#016064] via-teal-400 to-[#016064] animate-pulse"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[slide_2s_ease-in-out_infinite]"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <h3 className="text-2xl text-[#016064]">Analysis Complete</h3>
                        <p className="text-gray-700">Case #{caseData.caseId}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('results')}
                      className="mt-4 px-8 py-3 bg-gradient-to-r from-[#016064] to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      View Diagnosis Report
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* New Case Submission Form */}
        <div className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl border border-white/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#016064] to-teal-500 rounded-xl flex items-center justify-center">
              <Send className="text-white" size={24} />
            </div>
            <h2 className="text-3xl text-[#016064]">Submit New Case</h2>
          </div>

          <div className="space-y-6">
            {/* Symptoms Input */}
            <div>
              <label className="block mb-3 text-gray-800">Describe Your Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Tell us what you're experiencing... When did it start? How does it feel? Any other relevant details?"
                className="w-full p-5 backdrop-blur-sm bg-white/50 border-2 border-white/40 rounded-2xl resize-none outline-none focus:border-[#016064] transition-colors placeholder:text-gray-500 shadow-inner"
                rows={6}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-3 text-gray-800">Upload Medical Files</label>
              <div className="relative backdrop-blur-sm bg-white/50 border-2 border-dashed border-white/60 rounded-2xl p-10 text-center hover:border-[#016064] transition-colors cursor-pointer shadow-inner">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto mb-3 text-[#016064]" size={48} />
                <p className="text-gray-700 mb-1">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG formats accepted</p>
                
                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-[#016064] bg-teal-100/50 backdrop-blur-sm py-3 px-5 rounded-xl border border-teal-200/50">
                        <span>📎</span>
                        <span className="flex-1 text-left">{file}</span>
                        <span className="text-xs text-gray-600">Uploaded</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!symptoms.trim() || caseData.analyzing || isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-[#016064] to-teal-500 text-white rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              <Send size={24} />
              {isSubmitting ? 'Submitting...' : 'Start AI Analysis'}
            </button>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div
            onClick={() => onNavigate('video')}
            className="backdrop-blur-xl bg-gradient-to-br from-blue-400/30 to-cyan-400/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">📹</span>
            </div>
            <h3 className="text-xl mb-2 text-[#016064]">Video Consultation</h3>
            <p className="text-sm text-gray-700">Connect with an AI specialist now</p>
          </div>

          <div
            onClick={() => onNavigate('voice')}
            className="backdrop-blur-xl bg-gradient-to-br from-purple-400/30 to-pink-400/30 p-8 rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-4xl">🎤</span>
            </div>
            <h3 className="text-xl mb-2 text-[#016064]">Voice Triage</h3>
            <p className="text-sm text-gray-700">Speak directly with a nurse</p>
          </div>
        </div>
      </div>
    </div>
  );
}
