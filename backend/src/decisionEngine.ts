export type DecisionStatus = "GO" | "WAIT" | "DONT_GO";

export interface DecisionInput {
  missingRequirements: string[];
  queueAhead: number;
  estimatedWaitMinutes: number;
  travelMinutes: number;
  serviceMinutes: number;
  closingTime: string;
}

export interface DecisionResult {
  status: DecisionStatus;
  reason: string;
  recommendedDeparture: string;
  estimatedCompletion: string;
}

function minutesFromTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function calculateVisitDecision(
  input: DecisionInput,
  currentMinutes: number
): DecisionResult {
  if (input.missingRequirements.length > 0) {
    return {
      status: "DONT_GO",
      reason: `Missing required item: ${input.missingRequirements[0]}`,
      recommendedDeparture: timeFromMinutes(currentMinutes),
      estimatedCompletion: timeFromMinutes(currentMinutes),
    };
  }

  const arrivalMinutes = currentMinutes + input.travelMinutes;

  const estimatedTurnMinutes =
    arrivalMinutes + input.estimatedWaitMinutes;

  const completionMinutes =
    estimatedTurnMinutes + input.serviceMinutes;

  const closingMinutes = minutesFromTime(input.closingTime);

  if (completionMinutes >= closingMinutes) {
    return {
      status: "DONT_GO",
      reason: "Estimated completion is after office closing time.",
      recommendedDeparture: timeFromMinutes(currentMinutes),
      estimatedCompletion: timeFromMinutes(completionMinutes),
    };
  }

  if (
    input.queueAhead > 20 ||
    input.estimatedWaitMinutes > 45
  ) {
    const targetWaitMinutes = 20;

    const departureMinutes = Math.max(
      currentMinutes,
      currentMinutes +
        input.estimatedWaitMinutes -
        targetWaitMinutes
    );

    return {
      status: "WAIT",
      reason: "The current queue is too long to justify leaving now.",
      recommendedDeparture: timeFromMinutes(departureMinutes),
      estimatedCompletion: timeFromMinutes(completionMinutes),
    };
  }

  return {
    status: "GO",
    reason: "You are ready and the estimated visit can be completed before closing.",
    recommendedDeparture: timeFromMinutes(currentMinutes),
    estimatedCompletion: timeFromMinutes(completionMinutes),
  };
}