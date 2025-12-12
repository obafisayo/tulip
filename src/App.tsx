import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { DiagnosisResults } from './components/DiagnosisResults';
import { AuditRequest } from './components/AuditRequest';
import { VideoCall } from './components/VideoCall';
import { VoiceCall } from './components/VoiceCall';
import { DiagnosisResponse, Screen } from './lib/types';
import { BaseRequest } from './lib';

interface GlobalCaseData {
  caseId: string;
  analyzing: boolean;
  complete: boolean;
  result?: DiagnosisResponse;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialSymptoms, setInitialSymptoms] = useState<string>('');
  
  const [caseData, setCaseData] = useState<GlobalCaseData>({
    caseId: 'PENDING',
    analyzing: false,
    complete: false,
    result: undefined
  });

  const handleNavigate = (screen: Screen, symptoms?: string) => {
    if (symptoms) {
      setInitialSymptoms(symptoms);
    } else {
      setInitialSymptoms('');
    }
    setCurrentScreen(screen);
  };

  const handleStartAnalysis = useCallback(async (symptoms: string, urgency: string) => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setIsSubmitting(true);
    setCaseData(prev => {
      if (prev.analyzing) {
        return prev;
      }
      return {
        ...prev,
        analyzing: true,
        complete: false,
        result: undefined
      };
    });

    try {
      const response = await BaseRequest.post<DiagnosisResponse>('/diagosis/', { 
        case: symptoms 
      });

      const diagnosisData = response;

      console.log('Diagnosis data received:', diagnosisData);

      if (diagnosisData) {
        toast.success("Diagnosis received successfully");
        
        const newCaseData: any = {
          caseId: '402A',
          analyzing: false,
          complete: true,
          result: diagnosisData
        };
        
        console.log('Setting caseData to:', newCaseData);
        setCaseData(newCaseData);
        
        setInitialSymptoms('');
        
        setTimeout(() => {
          setCurrentScreen('results');
        }, 1500);
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit diagnosis request");
      
      setCaseData(prev => ({
        ...prev,
        analyzing: false,
        complete: false,
        result: undefined
      }));
      
      setInitialSymptoms('');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {currentScreen === 'landing' && (
        <LandingPage onNavigate={handleNavigate} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard 
          onNavigate={handleNavigate} 
          caseData={caseData}
          onStartAnalysis={handleStartAnalysis}
          isSubmitting={isSubmitting}
          initialSymptoms={initialSymptoms}
        />
      )}
      {currentScreen === 'results' && (
        <DiagnosisResults 
          onNavigate={handleNavigate}
          caseData={caseData}
        />
      )}
      {currentScreen === 'audit' && (
        <AuditRequest 
          onNavigate={handleNavigate}
          caseData={{
            caseId: caseData.caseId,
            condition: caseData.result?.diagnosed_issue || 'Unknown',
            confidence: (caseData.result?.confidence_score || 0) * 100
          }}
        />
      )}
      {currentScreen === 'video' && (
        <VideoCall onNavigate={handleNavigate} />
      )}
      {currentScreen === 'voice' && (
        <VoiceCall onNavigate={handleNavigate} />
      )}
    </div>
  );
}
