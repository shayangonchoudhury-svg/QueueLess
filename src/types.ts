export type DecisionStatus = 'GO' | 'WAIT' | 'DONT_GO';

export interface ServiceRequirement {
  id: string;
  name: string;
  isMandatory: boolean;
  description?: string;
}

export interface CampusService {
  id: string;
  name: string;
  category: 'academic' | 'student_services' | 'finance' | 'records';
  office: string;
  building: string;
  block: string;
  counterNumber?: string;
  iconName: string;
  requirements: ServiceRequirement[];
  queueCount: number;
  averageServiceTimeMinutes: number;
  closingTime: string; // "17:00"
  travelTimeMinutes: number;
  activeCounters: number;
  alternativeServiceId?: string;
  alternativeName?: string;
  alternativeOffice?: string;
  alternativeSavingsMinutes?: number;
}

export interface DecisionReasonDetail {
  label: string;
  status: 'pass' | 'warn' | 'fail';
  detail: string;
}

export interface VisitDecision {
  status: DecisionStatus;
  headline: string;
  reason: string;
  reasonsList: DecisionReasonDetail[];
  queueAhead: number;
  estimatedWait: number;
  travelTime: number;
  serviceTime: number;
  currentTime: string;
  recommendedDeparture: string;
  estimatedArrival: string;
  estimatedTurn: string;
  estimatedCompletion: string;
  closingTime: string;
  isClosingRisk: boolean;
  missingRequirements: string[];
}

export interface QueueTicket {
  ticketId: string;
  tokenNumber: number;
  serviceId: string;
  serviceName: string;
  officeName: string;
  building: string;
  issuedAt: string;
  initialQueuePosition: number;
  currentServingToken: number;
  estimatedWaitMinutes: number;
  recommendedDeparture: string;
  status: 'waiting' | 'serving' | 'completed';
}

export interface CampusPulseHub {
  id: string;
  name: string;
  building: string;
  currentWaiting: number;
  estimatedWaitMinutes: number;
  status: 'optimal' | 'moderate' | 'congested';
  trend: 'rising' | 'falling' | 'stable';
  activeCounters: number;
}

export type ViewScreen =
  | 'home'
  | 'service_detail'
  | 'requirements'
  | 'decision'
  | 'timeline'
  | 'alternative'
  | 'queue_confirmation'
  | 'live_queue'
  | 'my_visits'
  | 'staff_portal'
  | 'services_catalog';
