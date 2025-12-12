import { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Calendar, TrendingUp, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Screen } from '../lib/types';
import { BaseRequest } from '../lib';
import { scrollToTop } from './ScrollToTop';

interface AuditRequestProps {
  onNavigate: (screen: Screen) => void;
  caseData: {
    caseId: string;
    condition: string;
    confidence: number;
  };
}

interface PastDiagnosis {
  id: number;
  diagnosis: string;
  case: string;
  created_at: string;
  time_taken: number;
}

interface DiagnosisDetail {
  id: number;
  diagnosis: string;
  case: string;
  created_at: string;
  time_taken: number;
  reasoning_chain: string;
}

export function AuditRequest({ onNavigate }: AuditRequestProps) {
  const [diagnoses, setDiagnoses] = useState<PastDiagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  scrollToTop();

  useEffect(() => {
    fetchPastDiagnoses();
  }, []);
  scrollToTop();

  const fetchPastDiagnoses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await BaseRequest.get<PastDiagnosis[]>('/audit/', {
        params: { skip: 0, limit: 20 }
      });
      
      setDiagnoses(response || []);
    } catch (err: any) {
      console.error('Error fetching diagnoses:', err);
      setError(err.message || 'Failed to load past diagnoses');
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnosisDetail = async (diagnosisId: number) => {
    setLoadingDetail(true);
    
    try {
      const response = await BaseRequest.get<DiagnosisDetail>(`/audit/${diagnosisId}`);
      setSelectedDiagnosis(response);
    } catch (err: any) {
      console.error('Error fetching diagnosis detail:', err);
      setError(err.message || 'Failed to load diagnosis details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDiagnosisClick = (diagnosisId: number) => {
    fetchDiagnosisDetail(diagnosisId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeTaken = (seconds: number) => {
    return `${seconds.toFixed(2)}s`;
  };

  // Detail View
  if (selectedDiagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, #29516a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #29516a 2%, transparent 0%)',
              backgroundSize: '100px 100px'
            }}
          ></div>
        </div>

        <header className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSelectedDiagnosis(null)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#29516a] transition-colors backdrop-blur-sm bg-white/40 px-4 py-2 rounded-full"
            >
              <ArrowLeft size={20} />
              Back to List
            </button>

            <div className="flex items-center gap-3">
                <span className="text-white text-2xl">🌷</span>
              <div>
                <span className="text-2xl text-[#29516a]">Tulip</span>
                <p className="text-xs text-gray-600">Diagnosis Details</p>
              </div>
            </div>

            <div className="w-32"></div>
          </div>
        </header>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-8 space-y-6">
          {/* Diagnosis Header */}
          <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl mb-2 text-[#29516a]">{selectedDiagnosis.diagnosis}</h2>
                <p className="text-gray-600">Case ID: #{selectedDiagnosis.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Diagnosed on</p>
                <p className="text-lg text-[#29516a]">{formatDate(selectedDiagnosis.created_at)}</p>
              </div>
            </div>

            <div className="backdrop-blur-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <p className="text-sm text-gray-600 mb-1">Patient Symptoms</p>
              <p className="text-gray-800">{selectedDiagnosis.case}</p>
            </div>
          </div>

          {/* Reasoning Chain */}
          <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-2xl">
            <h3 className="text-xl mb-4 text-[#29516a] flex items-center gap-2">
              <TrendingUp size={20} />
              AI Reasoning Chain
            </h3>
            <div className="backdrop-blur-sm bg-white/50 p-6 rounded-2xl border border-white/40">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                {selectedDiagnosis.reasoning_chain}
              </pre>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>Analysis completed in {formatTimeTaken(selectedDiagnosis.time_taken)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #29516a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #29516a 2%, transparent 0%)',
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>

      <header className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-[#29516a] transition-colors backdrop-blur-sm bg-white/40 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
              <span className="text-white text-2xl">🌷</span>
            <div>
              <span className="text-2xl text-[#29516a]">Tulip</span>
              <p className="text-xs text-gray-600">Past Diagnoses</p>
            </div>
          </div>

          <div className="w-32"></div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[#29516a] to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Shield className="text-white" size={40} />
          </div>
          <h1 className="text-4xl mb-4 text-[#29516a]">Past Diagnoses Audit</h1>
          <p className="text-gray-700 text-lg">
            Review your previous AI diagnoses and their reasoning chains
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="backdrop-blur-xl bg-white/40 p-12 rounded-3xl border border-white/30 shadow-xl text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-[#29516a]" size={48} />
            <p className="text-gray-600">Loading past diagnoses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="backdrop-blur-xl bg-red-50/50 p-8 rounded-3xl border border-red-200/50 shadow-xl">
            <div className="flex items-center gap-4 text-red-700">
              <AlertCircle size={32} />
              <div>
                <h3 className="text-lg font-semibold mb-1">Error Loading Diagnoses</h3>
                <p>{error}</p>
              </div>
            </div>
            <button
              onClick={fetchPastDiagnoses}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Diagnoses List */}
        {!loading && !error && diagnoses.length === 0 && (
          <div className="backdrop-blur-xl bg-white/40 p-12 rounded-3xl border border-white/30 shadow-xl text-center">
            <p className="text-gray-600 text-lg">No past diagnoses found</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-[#29516a] to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Start New Diagnosis
            </button>
          </div>
        )}

        {!loading && !error && diagnoses.length > 0 && (
          <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl border border-white/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-[#29516a]">Your Diagnosis History</h2>
              <span className="text-sm text-gray-600">{diagnoses.length} total records</span>
            </div>

            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                onClick={() => handleDiagnosisClick(diagnosis.id)}
                className="backdrop-blur-sm bg-white/50 p-6 rounded-2xl border border-white/40 hover:bg-white/70 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#29516a] to-teal-500 text-white text-xs rounded-full">
                        #{diagnosis.id}
                      </span>
                      <h3 className="text-xl text-[#29516a] font-semibold">{diagnosis.diagnosis}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{diagnosis.case}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(diagnosis.created_at)}
                      </span>
                      <span>•</span>
                      <span>Analysis time: {formatTimeTaken(diagnosis.time_taken)}</span>
                    </div>
                  </div>
                  
                  <ChevronRight 
                    className="text-[#29516a] group-hover:translate-x-1 transition-transform flex-shrink-0" 
                    size={24} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading Detail Overlay */}
        {loadingDetail && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <Loader2 className="animate-spin mx-auto mb-4 text-[#29516a]" size={48} />
              <p className="text-gray-600">Loading diagnosis details...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}