import { CampusService, VisitDecision } from '../types';
import { INITIAL_SERVICES, INITIAL_USER_DOCUMENTS } from '../data/mockData';
import { calculateVisitDecision } from '../utils/decisionEngine';

/**
 * QueueLess API Client (Mock Layer)
 *
 * This abstraction isolates data fetching from React UI components.
 * Later, this file can be swapped to communicate with REST APIs or
 * AWS API Gateway without touching component code.
 */

export interface UserProfile {
  id: string;
  name: string;
  studentId: string;
  major: string;
  currentLocation: string;
  documents: Record<string, boolean>;
}

export interface QueueStatusResponse {
  serviceId: string;
  currentServing: number;
  waitingCount: number;
  tokensAhead: number[];
  averageServiceTimeMinutes: number;
  activeCounters: number;
  lastUpdated: string;
}

// In-memory mock store for demo
let mockServicesCache: CampusService[] = [...INITIAL_SERVICES];
let mockUserDocsCache: Record<string, boolean> = { ...INITIAL_USER_DOCUMENTS };

export async function getServices(): Promise<CampusService[]> {
  // Simulates network latency if needed, returns local clone
  return Promise.resolve([...mockServicesCache]);
}

export async function getService(id: string): Promise<CampusService | undefined> {
  const service = mockServicesCache.find((s) => s.id === id);
  return Promise.resolve(service ? { ...service } : undefined);
}

export async function getUser(): Promise<UserProfile> {
  return Promise.resolve({
    id: 'usr_2026_948',
    name: 'Alex Rivera',
    studentId: 'ST-882910',
    major: 'Computer Science & Design',
    currentLocation: 'Library Commons, Block E',
    documents: { ...mockUserDocsCache },
  });
}

export async function updateUserDocument(docId: string, isReady: boolean): Promise<Record<string, boolean>> {
  mockUserDocsCache = {
    ...mockUserDocsCache,
    [docId]: isReady,
  };
  return Promise.resolve({ ...mockUserDocsCache });
}

export async function getQueue(serviceId: string): Promise<QueueStatusResponse> {
  const service = mockServicesCache.find((s) => s.id === serviceId);
  const queueCount = service ? service.queueCount : 7;
  const currentServing = 40;
  const tokensAhead: number[] = [];
  for (let i = 1; i <= queueCount; i++) {
    tokensAhead.push(currentServing + i);
  }

  return Promise.resolve({
    serviceId,
    currentServing,
    waitingCount: queueCount,
    tokensAhead,
    averageServiceTimeMinutes: service?.averageServiceTimeMinutes || 10,
    activeCounters: service?.activeCounters || 2,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
}

export async function calculateDecision(
  service: CampusService,
  userDocs: Record<string, boolean>,
  currentTime?: string
): Promise<VisitDecision> {
  return Promise.resolve(calculateVisitDecision(service, userDocs, currentTime));
}

export function updateMockServiceQueue(serviceId: string, newQueueCount: number) {
  mockServicesCache = mockServicesCache.map((svc) =>
    svc.id === serviceId ? { ...svc, queueCount: Math.max(0, newQueueCount) } : svc
  );
}
