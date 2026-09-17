import { tool } from "@strands-agents/sdk";
import { z } from "zod";
import { demoUser, services } from "../campusData.js";

export const checkUserReadiness = tool({
  name: "check_user_readiness",

  description:
    "Check whether the student has all documents required for the requested campus service.",

  inputSchema: z.object({
    serviceId: z.string().describe("The service ID"),
  }),

  callback: (input) => {
    const service = services.find((s) => s.id === input.serviceId);

    if (!service) {
      return {
        ready: false,
        error: `Unknown service: ${input.serviceId}`,
      };
    }

    const available = new Set(demoUser.documents);

    const missing = service.requirements.filter(
      (requirement) => !available.has(requirement)
    );

    return {
      ready: missing.length === 0,
      required: service.requirements,
      available: demoUser.documents,
      missing,
    };
  },
});