import { tool } from "@strands-agents/sdk";
import { z } from "zod";
import { services } from "../campusData.js";

export const getQueueStatus = tool({
  name: "get_queue_status",

  description:
    "Get the current estimated queue position and waiting time for a campus service.",

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

    const estimatedWait = service.queueAhead * service.averageServiceMinutes;

    return {
      found: true,
      service: service.name,
      peopleAhead: service.queueAhead,
      averageServiceMinutes: service.averageServiceMinutes,
      estimatedWaitMinutes: estimatedWait,
    };
  },
});