import { tool } from "@strands-agents/sdk";
import { z } from "zod";
import { services } from "../campusData.js";

export const checkServiceRequirements = tool({
  name: "check_service_requirements",

  description:
    "Check which documents and requirements are needed for a campus service.",

  inputSchema: z.object({
    serviceId: z
      .string()
      .describe("The service ID, such as migration, bonafide, fee, or id-card"),
  }),

  callback: (input) => {
    const service = services.find((s) => s.id === input.serviceId);

    if (!service) {
      return {
        found: false,
        error: `Unknown service: ${input.serviceId}`,
      };
    }

    return {
      found: true,
      service: service.name,
      office: service.office,
      requiredDocuments: service.requirements,
    };
  },
});