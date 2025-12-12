import { useState, useEffect, useRef } from 'react';
import { Phone, Home, User, Upload, Send, Activity } from 'lucide-react';
import { scrollToTop } from './ScrollToTop';
import { motion } from 'framer-motion'; // 1. Import motion
import MicrophoneIcon from './icon/microphone';
import Vidbox from './icon/vid_box';
import ShareIcon from './icon/shareIcon';
import FolderIcon from './icon/folderIcon';
import LogoIcon from './icon/logo';

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

// 2. Define Variants for clean, reusable animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1 // Fast stagger for a snappy feel
    }
  },
  exit: {
    opacity: 0,
    transition: { ease: 'easeInOut' }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Dashboard({ onNavigate, caseData, onStartAnalysis, isSubmitting, initialSymptoms }: DashboardProps) {
  const [symptoms, setSymptoms] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const hasSubmittedRef = useRef(false);
  const initialSymptomsRef = useRef<string>('');
  scrollToTop();

  useEffect(() => {
    if (initialSymptoms &&
      initialSymptoms.trim() &&
      !hasSubmittedRef.current &&
      initialSymptoms !== initialSymptomsRef.current &&
      !caseData.analyzing) {

      console.log('Auto-submitting symptoms:', initialSymptoms);
      setSymptoms(initialSymptoms);
      hasSubmittedRef.current = true;
      initialSymptomsRef.current = initialSymptoms;

      const timer = setTimeout(() => {
        onStartAnalysis(initialSymptoms, "low");
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [initialSymptoms, onStartAnalysis, caseData.analyzing]);

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
    // 3. Wrap main container in motion.div to handle page enter/exit
    <motion.div
      className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #29516a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #29516a 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>

      {/* Glassmorphic Header - Slides Down */}
      <motion.header
        variants={headerVariants}
        className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon />
            <div>
              <span className="text-2xl text-[#29516a]">Tulip</span>
              <p className="text-xs text-gray-600">Patient Portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-gray-700 hover:text-[#29516a] transition-colors"
            >
              <Home size={20} />
              Home
            </button>
            <button className="flex items-center gap-2 text-[#29516a]">
              <Activity size={20} />
              My Cases
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-[#29516a] transition-colors">
              <User size={20} />
              Profile
            </button>
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('voice')}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Phone size={20} />
            Emergency
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content - Staggered Entry */}
      <motion.div
        variants={containerVariants}
        className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-6"
      >
        {/* Analysis Card */}
        {(caseData.analyzing || caseData.complete) && (
          <motion.div
            variants={itemVariants} // Pop in using the item variant
            className={`backdrop-blur-xl p-8 rounded-3xl border shadow-2xl ${caseData.complete
                ? 'bg-gradient-to-br from-green-400/30 to-emerald-400/30 border-green-300/40'
                : 'bg-white/40 border-white/30'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {caseData.analyzing ? (
                  <>
                    <h3 className="text-2xl mb-2 text-[#29516a]">AI Analysis in Progress...</h3>
                    <p className="text-gray-700 mb-4">Case #{caseData.caseId} • Processing your medical data</p>
                    <div className="relative w-full h-3 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#29516a] via-teal-400 to-[#29516a] animate-pulse"></div>
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
                        <h3 className="text-2xl text-[#29516a]">Analysis Complete</h3>
                        <p className="text-gray-700">Case #{caseData.caseId}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('results')}
                      className="mt-4 px-8 py-3 bg-[#29516a] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      View Diagnosis Report
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* New Case Submission Form */}
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-white/40 p-10 rounded-3xl border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-[#29516a] to-teal-500 rounded-xl flex items-center justify-center">
              <Send className="text-white" size={24} />
            </div> */}
            <ShareIcon />
            <h2 className="text-3xl text-[#29516a]">Submit New Case</h2>
          </div>

          <div className="space-y-6">
            {/* Symptoms Input */}
            <div>
              <label className="block mb-3 text-gray-800">Describe Your Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Tell us what you're experiencing... When did it start? How does it feel? Any other relevant details?"
                className="w-full p-5 backdrop-blur-sm bg-white/50 border-2 border-white/40 rounded-2xl resize-none outline-none focus:border-[#29516a] transition-colors placeholder:text-gray-500 shadow-inner"
                rows={6}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block mb-3 text-gray-800">Upload Medical Files</label>
              <motion.div
                whileHover={{ borderColor: "#29516a", backgroundColor: "rgba(255,255,255,0.6)" }}
                className="relative backdrop-blur-sm bg-white/50 border-2 border-dashed border-white/60 rounded-2xl p-10 text-center transition-colors cursor-pointer shadow-inner"
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* <Upload className="mx-auto mb-3 text-[#29516a]" size={48} /> */}
                <FolderIcon />
                <p className="text-gray-700 mb-1">Drop files here or click to browse</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG formats accepted</p>

                {files.length > 0 && (
                  <div className="mt-6 space-y-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-[#29516a] bg-teal-100/50 backdrop-blur-sm py-3 px-5 rounded-xl border border-teal-200/50">
                        <span>📎</span>
                        <span className="flex-1 text-left">{file}</span>
                        <span className="text-xs text-gray-600">Uploaded</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!symptoms.trim() || caseData.analyzing || isSubmitting}
              className="w-full py-5 bg-gradient-to-r from-[#29516a] to-teal-500 text-white rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              <Send size={24} />
              {isSubmitting ? 'Submitting...' : 'Start AI Analysis'}
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('video')}
            className="backdrop-blur-xl bg-linear-to-br from-[#29516a]-400/30 to-cyan-400/30 p-8 rounded-2xl border border-white/40 shadow-lg cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Vidbox />
            </div>
            <h3 className="text-xl mb-2 text-[#29516a]">Video Consultation</h3>
            <p className="text-sm text-gray-700">Connect with an AI specialist now</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onNavigate('voice')}
            className="backdrop-blur-xl bg-linear-to-br from-[#29516a]-400/30 to-cyan-400/30 p-8 rounded-2xl border border-white/40 shadow-lg cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MicrophoneIcon />
            </div>
            <h3 className="text-xl mb-2 text-[#29516a]">Voice Triage</h3>
            <p className="text-sm text-gray-700">Speak directly with a nurse</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
