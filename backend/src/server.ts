import "dotenv/config";

import express from "express";
import cors from "cors";

import { services, demoUser } from "./campusData.js";
import { calculateVisitDecision } from "./decisionEngine.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function getCurrentMinutesIST(): number {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "QueueLess backend",
  });
});

app.post("/api/decision", (req, res) => {
  try {
    const {
  serviceId,
  documents = demoUser.documents,
  simulatedTime,
} = req.body ?? {};

    if (!serviceId) {
      return res.status(400).json({
        error: "serviceId is required",
      });
    }

    const service = services.find((item) => item.id === serviceId);

    if (!service) {
      return res.status(404).json({
        error: `Unknown service: ${serviceId}`,
      });
    }

    const availableDocuments = new Set<string>(documents);

    const missingRequirements = service.requirements.filter(
      (requirement) => !availableDocuments.has(requirement)
    );

    const estimatedWaitMinutes =
      service.queueAhead * service.averageServiceMinutes;

    const currentMinutes =
  typeof simulatedTime === "number"
    ? simulatedTime
    : getCurrentMinutesIST();

    const decision = calculateVisitDecision(
      {
        missingRequirements,
        queueAhead: service.queueAhead,
        estimatedWaitMinutes,
        travelMinutes: service.travelMinutes,
        serviceMinutes: service.averageServiceMinutes,
        closingTime: service.closingTime,
      },
      currentMinutes
    );

    return res.json({
      service: {
        id: service.id,
        name: service.name,
        office: service.office,
      },

      readiness: {
        required: service.requirements,
        available: documents,
        missing: missingRequirements,
      },

      queue: {
        peopleAhead: service.queueAhead,
        estimatedWaitMinutes,
      },

      timing: {
        travelMinutes: service.travelMinutes,
        serviceMinutes: service.averageServiceMinutes,
        closingTime: service.closingTime,
      },

      decision,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to calculate QueueLess decision",
    });
  }
});

app.listen(PORT, () => {
  console.log(`QueueLess backend running at http://localhost:${PORT}`);
});