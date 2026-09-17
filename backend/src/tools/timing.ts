import { tool } from "@strands-agents/sdk";
import { z } from "zod";
import { services } from "../campusData.js";

export const getOfficeTiming = tool({
  name: "get_office_timing",

  description:
    "Get office closing time, travel time, and service duration for a campus service.",

  inputSchema: z.object({
    serviceId: z.string().describe("The service ID"),
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
      office: service.office,
      closingTime: service.closingTime,
      travelMinutes: service.travelMinutes,
      serviceMinutes: service.averageServiceMinutes,
    };
  },
});