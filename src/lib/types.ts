export type Screen = 'landing' | 'dashboard' | 'results' | 'audit' | 'video' | 'voice';

export interface DiagnosisResponse {
  diagnosed_issue: string;
  confidence_score: number;
  severity: string;
  extra_information: string;
  next_steps: string[];
  reasoning_chain: string;
}

export interface DashboardProps {
  onNavigate: (screen: Screen, symptoms?: string) => void;
  caseData: {
    caseId: string;
    analyzing: boolean;
    complete: boolean;
  };
  onStartAnalysis: (symptoms: string, urgency: string) => Promise<void>;
  isSubmitting: boolean;
  initialSymptoms?: string;
}