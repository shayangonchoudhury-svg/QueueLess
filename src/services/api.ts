import { CampusService, VisitDecision } from '../types';
import { INITIAL_SERVICES, INITIAL_USER_DOCUMENTS } from '../data/mockData';
import { addMinutesToTime, formatTo12Hour } from '../utils/decisionEngine';

const BACKEND_URL =
  'https://cn4f7pe60d.execute-api.us-east-1.amazonaws.com/Prod';

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
  const response = await fetch(`${BACKEND_URL}/api/services`);

  if (!response.ok) {
    throw new Error(
      `QueueLess services API error (${response.status})`
    );
  }

  const data = await response.json();

  const liveServices = data.services as Array<{
    id: string;
    name: string;
    office: string;
    queueAhead: number;
    averageServiceMinutes: number;
    closingTime: string;
    travelMinutes: number;
    requirements: string[];
  }>;

  return INITIAL_SERVICES.map((localService) => {
    const liveService = liveServices.find(
      (service) => service.id === localService.id
    );

    if (!liveService) {
      return localService;
    }

    return {
      ...localService,
      queueCount: liveService.queueAhead,
      averageServiceTimeMinutes:
        liveService.averageServiceMinutes,
      closingTime: liveService.closingTime,
      travelTimeMinutes: liveService.travelMinutes,
    };
  });
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

export async function getQueue(
  serviceId: string
): Promise<QueueStatusResponse> {
  const response = await fetch(
    `${BACKEND_URL}/api/queue/${serviceId}`
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `QueueLess queue API error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  const service = mockServicesCache.find(
    (svc) => svc.id === serviceId
  );

  return {
    serviceId,
    currentServing: data.currentServing,
    waitingCount: data.queueAhead,
    tokensAhead: data.waitingTokens,
    averageServiceTimeMinutes:
      service?.averageServiceTimeMinutes ?? 10,
    activeCounters: service?.activeCounters ?? 1,
    lastUpdated: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

function toBackendServiceId(serviceId: string): string {
  return serviceId;
}

function normalizeRequirementName(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes('student id')) return 'Student ID';
  if (lower.includes('application form')) return 'Application Form';
  if (lower.includes('fee receipt')) return 'Fee Receipt';
  if (
    lower.includes('passport photograph') ||
    lower.includes('passport photo')
  ) {
    return 'Passport Photograph';
  }
  if (lower.includes('fee amount')) return 'Fee Amount';

  return name;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export async function calculateDecision(
  service: CampusService,
  userDocs: Record<string, boolean>,
  currentTime: string = '15:20'
): Promise<VisitDecision> {
  const backendServiceId = toBackendServiceId(service.id);

  const availableDocuments = service.requirements
    .filter((requirement) => userDocs[requirement.id])
    .map((requirement) => normalizeRequirementName(requirement.name));

  const response = await fetch(`${BACKEND_URL}/api/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      serviceId: backendServiceId,
      documents: availableDocuments,
      simulatedTime: timeToMinutes(currentTime),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `QueueLess backend error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  const estimatedArrival = addMinutesToTime(
    currentTime,
    data.timing.travelMinutes
  );

  const estimatedTurn = addMinutesToTime(
    estimatedArrival,
    data.queue.estimatedWaitMinutes
  );

  const isClosingRisk =
    timeToMinutes(data.decision.estimatedCompletion) >=
    timeToMinutes(data.timing.closingTime);

  const headlineMap: Record<string, string> = {
    GO: 'GO NOW',
    WAIT: 'WAIT',
    DONT_GO: "DON'T GO",
  };

  const requirementsReady = data.readiness.missing.length === 0;

  return {
    status: data.decision.status,
    headline: headlineMap[data.decision.status] ?? data.decision.status,
    reason: data.decision.reason,

    reasonsList: [
      {
        label: 'Requirements',
        status: requirementsReady ? 'pass' : 'fail',
        detail: requirementsReady
          ? 'All required documents are ready.'
          : `Missing: ${data.readiness.missing.join(', ')}`,
      },
      {
        label: 'Queue',
        status:
          data.decision.status === 'GO'
            ? 'pass'
            : data.decision.status === 'WAIT'
              ? 'warn'
              : 'fail',
        detail: `${data.queue.peopleAhead} people ahead • ${data.queue.estimatedWaitMinutes} min estimated wait`,
      },
      {
        label: 'Timing',
        status: isClosingRisk
          ? 'fail'
          : data.decision.status === 'WAIT'
            ? 'warn'
            : 'pass',
        detail: `Travel ${data.timing.travelMinutes} min • Service ${data.timing.serviceMinutes} min • Closes ${formatTo12Hour(data.timing.closingTime)}`,
      },
    ],

    queueAhead: data.queue.peopleAhead,
    estimatedWait: data.queue.estimatedWaitMinutes,
    travelTime: data.timing.travelMinutes,
    serviceTime: data.timing.serviceMinutes,

    currentTime: formatTo12Hour(currentTime),
    recommendedDeparture: formatTo12Hour(
      data.decision.recommendedDeparture
    ),
    estimatedArrival: formatTo12Hour(estimatedArrival),
    estimatedTurn: formatTo12Hour(estimatedTurn),
    estimatedCompletion: formatTo12Hour(
      data.decision.estimatedCompletion
    ),

    closingTime: formatTo12Hour(data.timing.closingTime),
    isClosingRisk,

    missingRequirements: data.readiness.missing,
  };
}

export async function updateMockServiceQueue(
  serviceId: string,
  newQueueCount: number
): Promise<void> {
  const queueAhead = Math.max(0, newQueueCount);

  // Keep local cache in sync for the current browser session.
  mockServicesCache = mockServicesCache.map((svc) =>
    svc.id === serviceId
      ? { ...svc, queueCount: queueAhead }
      : svc
  );

  // Persist the queue change in AWS DynamoDB.
  const response = await fetch(
    `${BACKEND_URL}/api/queue/${serviceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queueAhead,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Queue update failed (${response.status}): ${errorText}`
    );
  }
}
