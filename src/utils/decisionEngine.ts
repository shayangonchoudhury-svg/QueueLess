import { CampusService, VisitDecision, DecisionReasonDetail } from '../types';

/**
 * Utility functions for time arithmetic in HH:mm 24-hour format
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export function formatTo12Hour(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const h = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const m = (minutes || 0).toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number): string {
  const currentTotal = parseTimeToMinutes(timeStr);
  return formatMinutesToTime(currentTotal + minutesToAdd);
}

/**
 * QueueLess Decision Logic
 *
 * Evaluates:
 * 1. Missing mandatory requirements -> DON'T GO
 * 2. Estimated completion >= office closing time -> DON'T GO
 * 3. Queue > 20 OR estimated wait > 45 mins -> WAIT
 * 4. Otherwise -> GO
 */
export function calculateVisitDecision(
  service: CampusService,
  userDocuments: Record<string, boolean>,
  currentTime24: string = '15:20' // Default realistic demo time: 3:20 PM
): VisitDecision {
  // 1. Evaluate required documents
  const missingRequirements: string[] = [];
  service.requirements.forEach((req) => {
    if (req.isMandatory && !userDocuments[req.id]) {
      missingRequirements.push(req.name);
    }
  });

  // Calculate estimated wait time based on queue and service rate
  // Account for active counters (e.g. 7 people with 2 counters = ~3.5 turns)
  const activeCounters = Math.max(1, service.activeCounters || 1);
  const estimatedWaitMinutes = Math.round(
    (service.queueCount * service.averageServiceTimeMinutes) / activeCounters
  );

  const travelTimeMinutes = service.travelTimeMinutes;
  const serviceDurationMinutes = service.averageServiceTimeMinutes;

  // Time calculations
  const arrivalTime24 = addMinutesToTime(currentTime24, travelTimeMinutes);
  const turnTime24 = addMinutesToTime(arrivalTime24, estimatedWaitMinutes);
  const completionTime24 = addMinutesToTime(turnTime24, serviceDurationMinutes);

  const completionTotalMinutes = parseTimeToMinutes(completionTime24);
  const closingTotalMinutes = parseTimeToMinutes(service.closingTime);
  const isClosingRisk = completionTotalMinutes >= closingTotalMinutes;

  // Recommended departure calculation:
  // For GO: Leave now or within 10-15 mins
  // For WAIT: Delay departure by 25-35 minutes until queue drains
  let recommendedDeparture24 = currentTime24;
  if (service.queueCount > 20 || estimatedWaitMinutes > 45) {
    recommendedDeparture24 = addMinutesToTime(currentTime24, 25);
  }

  // --- RULE 1: Missing Required Document ---
  if (missingRequirements.length > 0) {
    const reasonsList: DecisionReasonDetail[] = [
      {
        label: 'Required requirement missing',
        status: 'fail',
        detail: `Missing: ${missingRequirements.join(', ')}. The counter strictly requires all mandatory documents.`,
      },
      {
        label: 'Queue status',
        status: service.queueCount > 20 ? 'warn' : 'pass',
        detail: `${service.queueCount} people in line (${estimatedWaitMinutes} min estimated wait)`,
      },
      {
        label: 'Office hours',
        status: isClosingRisk ? 'fail' : 'pass',
        detail: `Office closes at ${formatTo12Hour(service.closingTime)}`,
      },
    ];

    return {
      status: 'DONT_GO',
      headline: "You're missing a required document.",
      reason: `You cannot complete this visit yet because you are missing ${missingRequirements.join(' & ')}.`,
      reasonsList,
      queueAhead: service.queueCount,
      estimatedWait: estimatedWaitMinutes,
      travelTime: travelTimeMinutes,
      serviceTime: serviceDurationMinutes,
      currentTime: formatTo12Hour(currentTime24),
      recommendedDeparture: formatTo12Hour(recommendedDeparture24),
      estimatedArrival: formatTo12Hour(arrivalTime24),
      estimatedTurn: formatTo12Hour(turnTime24),
      estimatedCompletion: formatTo12Hour(completionTime24),
      closingTime: formatTo12Hour(service.closingTime),
      isClosingRisk,
      missingRequirements,
    };
  }

  // --- RULE 2: Office closes before completion ---
  if (isClosingRisk) {
    const reasonsList: DecisionReasonDetail[] = [
      {
        label: 'Estimated completion is after office closing time',
        status: 'fail',
        detail: `Estimated finish at ${formatTo12Hour(completionTime24)}, but ${service.office} locks doors at ${formatTo12Hour(service.closingTime)}.`,
      },
      {
        label: 'Requirements ready',
        status: 'pass',
        detail: `All ${service.requirements.length} mandatory documents verified.`,
      },
      {
        label: 'Travel time risk',
        status: 'warn',
        detail: `${travelTimeMinutes} min walk from your current campus location.`,
      },
    ];

    return {
      status: 'DONT_GO',
      headline: 'You are unlikely to be served before the office closes.',
      reason: `By the time you walk ${travelTimeMinutes} min and wait for ${service.queueCount} people ahead, the office will be closed.`,
      reasonsList,
      queueAhead: service.queueCount,
      estimatedWait: estimatedWaitMinutes,
      travelTime: travelTimeMinutes,
      serviceTime: serviceDurationMinutes,
      currentTime: formatTo12Hour(currentTime24),
      recommendedDeparture: formatTo12Hour(recommendedDeparture24),
      estimatedArrival: formatTo12Hour(arrivalTime24),
      estimatedTurn: formatTo12Hour(turnTime24),
      estimatedCompletion: formatTo12Hour(completionTime24),
      closingTime: formatTo12Hour(service.closingTime),
      isClosingRisk: true,
      missingRequirements: [],
    };
  }

  // --- RULE 3: Queue Congestion (>20 in queue OR >45 min wait) ---
  if (service.queueCount > 20 || estimatedWaitMinutes > 45) {
    const reasonsList: DecisionReasonDetail[] = [
      {
        label: 'Queue currently congested',
        status: 'warn',
        detail: `${service.queueCount} people currently waiting (${estimatedWaitMinutes} min wait).`,
      },
      {
        label: 'Requirements ready',
        status: 'pass',
        detail: 'All documents verified and ready in your pack.',
      },
      {
        label: 'Waiting before departure reduces idle time',
        status: 'pass',
        detail: `Departing at ${formatTo12Hour(recommendedDeparture24)} avoids standing in high-density queue.`,
      },
      {
        label: 'Office remains open',
        status: 'pass',
        detail: `Open until ${formatTo12Hour(service.closingTime)} (plenty of buffer).`,
      },
    ];

    return {
      status: 'WAIT',
      headline: "It's too early to leave.",
      reason: `The queue is currently congested with ${service.queueCount} people. Waiting before departure significantly reduces your standing time.`,
      reasonsList,
      queueAhead: service.queueCount,
      estimatedWait: estimatedWaitMinutes,
      travelTime: travelTimeMinutes,
      serviceTime: serviceDurationMinutes,
      currentTime: formatTo12Hour(currentTime24),
      recommendedDeparture: formatTo12Hour(recommendedDeparture24),
      estimatedArrival: formatTo12Hour(arrivalTime24),
      estimatedTurn: formatTo12Hour(turnTime24),
      estimatedCompletion: formatTo12Hour(completionTime24),
      closingTime: formatTo12Hour(service.closingTime),
      isClosingRisk: false,
      missingRequirements: [],
    };
  }

  // --- RULE 4: Green Light (GO) ---
  const reasonsList: DecisionReasonDetail[] = [
    {
      label: 'Requirements ready',
      status: 'pass',
      detail: 'All mandatory forms and IDs verified.',
    },
    {
      label: 'Queue is moving normally',
      status: 'pass',
      detail: `${service.queueCount} waiting (${estimatedWaitMinutes} min wait, ${activeCounters} counters open).`,
    },
    {
      label: 'Estimated arrival before your turn',
      status: 'pass',
      detail: `Arrive at ${formatTo12Hour(arrivalTime24)} (${travelTimeMinutes} min walk) smoothly in sync.`,
    },
    {
      label: 'Office remains open',
      status: 'pass',
      detail: `Estimated finish at ${formatTo12Hour(completionTime24)}, well before closing at ${formatTo12Hour(service.closingTime)}.`,
    },
  ];

  return {
    status: 'GO',
    headline: "You're ready to visit.",
    reason: `All conditions are optimal: documents ready, normal queue of ${service.queueCount} people, and plenty of time before closing.`,
    reasonsList,
    queueAhead: service.queueCount,
    estimatedWait: estimatedWaitMinutes,
    travelTime: travelTimeMinutes,
    serviceTime: serviceDurationMinutes,
    currentTime: formatTo12Hour(currentTime24),
    recommendedDeparture: formatTo12Hour(currentTime24), // Leave now
    estimatedArrival: formatTo12Hour(arrivalTime24),
    estimatedTurn: formatTo12Hour(turnTime24),
    estimatedCompletion: formatTo12Hour(completionTime24),
    closingTime: formatTo12Hour(service.closingTime),
    isClosingRisk: false,
    missingRequirements: [],
  };
}
