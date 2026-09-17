import { tool } from "@strands-agents/sdk";
import { z } from "zod";
import { calculateVisitDecision } from "../decisionEngine.js";

export const calculateDecision = tool({
  name: "calculate_visit_decision",

  description:
    "Deterministically decide whether the student should GO, WAIT, or DON'T GO based on requirements, queue, timing, and office closing time.",

  inputSchema: z.object({
    missingRequirements: z
      .array(z.string())
      .describe("Required items the student is missing"),

    queueAhead: z
      .number()
      .describe("Number of people currently ahead"),

    estimatedWaitMinutes: z
      .number()
      .describe("Estimated waiting time in minutes"),

    travelMinutes: z
      .number()
      .describe("Estimated travel time in minutes"),

    serviceMinutes: z
      .number()
      .describe("Estimated service duration in minutes"),

    closingTime: z
      .string()
      .describe("Office closing time in HH:MM format"),

    currentMinutes: z
      .number()
      .describe("Current time represented as minutes since midnight"),
  }),

  callback: (input) => {
    return calculateVisitDecision(input, input.currentMinutes);
  },
});