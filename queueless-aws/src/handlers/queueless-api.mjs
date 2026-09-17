import {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({});
const TABLE_NAME = process.env.SERVICES_TABLE;

const DEFAULT_SERVICES = [
  {
    id: "migration-cert",
    name: "Migration Certificate",
    office: "Academic Administration",
    queueAhead: 7,
    averageServiceMinutes: 10,
    closingTime: "17:00",
    travelMinutes: 14,
    requirements: [
      "Student ID",
      "Application Form",
      "Fee Receipt",
      "Passport Photograph",
    ],
  },
  {
    id: "bonafide-cert",
    name: "Bonafide Certificate",
    office: "Student Service Centre",
    queueAhead: 4,
    averageServiceMinutes: 7,
    closingTime: "17:30",
    travelMinutes: 8,
    requirements: ["Student ID", "Application Form"],
  },
  {
    id: "fee-payment",
    name: "Fee Payment",
    office: "Finance Office",
    queueAhead: 18,
    averageServiceMinutes: 5,
    closingTime: "16:30",
    travelMinutes: 10,
    requirements: ["Student ID", "Fee Amount"],
  },
  {
    id: "id-replacement",
    name: "Student ID Replacement",
    office: "Student Service Centre",
    queueAhead: 6,
    averageServiceMinutes: 8,
    closingTime: "17:30",
    travelMinutes: 8,
    requirements: ["Student ID", "Application Form"],
  },
  {
    id: "transcript-request",
    name: "Transcript Request",
    office: "Registrar Records Wing",
    queueAhead: 5,
    averageServiceMinutes: 10,
    closingTime: "17:00",
    travelMinutes: 12,
    requirements: [
      "Student ID",
      "Application Form",
      "Fee Receipt",
    ],
  },
];

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(totalMinutes) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

function getCurrentMinutesIST() {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value ?? 0
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0
  );

  return hour * 60 + minute;
}

async function getAllServices() {
  const result = await dynamo.send(
    new ScanCommand({
      TableName: TABLE_NAME,
    })
  );

  return (result.Items ?? []).map((item) => ({
    id: item.id.S,
    name: item.name.S,
    office: item.office.S,
    queueAhead: Number(item.queueAhead.N),
    averageServiceMinutes: Number(item.averageServiceMinutes.N),
    closingTime: item.closingTime.S,
    travelMinutes: Number(item.travelMinutes.N),
    requirements: JSON.parse(item.requirements.S),
  }));
}

async function ensureSeeded() {
  const existing = await getAllServices();

  if (existing.length > 0) {
    // Add queue-token state to existing DynamoDB records
    // without overwriting it if it already exists.
    for (const service of existing) {
      const queueAhead = Math.max(
        0,
        Number(service.queueAhead ?? 0)
      );

      const waitingTokens = Array.from(
        { length: queueAhead },
        (_, index) => 41 + index
      );

      await dynamo.send(
        new UpdateItemCommand({
          TableName: TABLE_NAME,
          Key: {
            id: { S: service.id },
          },
          UpdateExpression:
            "SET currentServing = if_not_exists(currentServing, :currentServing), waitingTokens = if_not_exists(waitingTokens, :waitingTokens)",
          ExpressionAttributeValues: {
            ":currentServing": {
              N: "40",
            },
            ":waitingTokens": {
              S: JSON.stringify(waitingTokens),
            },
          },
        })
      );
    }

    return existing;
  }

  for (const service of DEFAULT_SERVICES) {
    await dynamo.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
  id: { S: service.id },
  name: { S: service.name },
  office: { S: service.office },

  queueAhead: {
    N: String(service.queueAhead),
  },

  currentServing: {
    N: "40",
  },

  waitingTokens: {
    S: JSON.stringify(
      Array.from(
        { length: service.queueAhead },
        (_, index) => 41 + index
      )
    ),
  },

  averageServiceMinutes: {
    N: String(service.averageServiceMinutes),
  },

  closingTime: {
    S: service.closingTime,
  },

  travelMinutes: {
    N: String(service.travelMinutes),
  },

  requirements: {
    S: JSON.stringify(service.requirements),
  },
},
      })
    );
  }

  return DEFAULT_SERVICES;
}

async function getService(serviceId) {
  const result = await dynamo.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: serviceId },
      },
    })
  );

  if (!result.Item) {
    return null;
  }

  return {
    id: result.Item.id.S,
    name: result.Item.name.S,
    office: result.Item.office.S,
    queueAhead: Number(result.Item.queueAhead.N),
    averageServiceMinutes: Number(
      result.Item.averageServiceMinutes.N
    ),
    closingTime: result.Item.closingTime.S,
    travelMinutes: Number(result.Item.travelMinutes.N),
    requirements: JSON.parse(result.Item.requirements.S),
  };
}

function calculateDecision({
  missingRequirements,
  queueAhead,
  estimatedWaitMinutes,
  travelMinutes,
  serviceMinutes,
  closingTime,
  currentMinutes,
}) {
  if (missingRequirements.length > 0) {
    return {
      status: "DONT_GO",
      reason: `Missing required item: ${missingRequirements[0]}`,
      recommendedDeparture: timeFromMinutes(currentMinutes),
      estimatedCompletion: timeFromMinutes(currentMinutes),
    };
  }

  const arrivalMinutes = currentMinutes + travelMinutes;

  const completionMinutes =
    arrivalMinutes +
    estimatedWaitMinutes +
    serviceMinutes;

  const closingMinutes = minutesFromTime(closingTime);

  if (completionMinutes >= closingMinutes) {
    return {
      status: "DONT_GO",
      reason: "Estimated completion is after office closing time.",
      recommendedDeparture: timeFromMinutes(currentMinutes),
      estimatedCompletion: timeFromMinutes(completionMinutes),
    };
  }

  if (queueAhead > 20 || estimatedWaitMinutes > 45) {
  const targetWaitMinutes = 20;

  const departureMinutes = Math.max(
    currentMinutes,
    currentMinutes +
      estimatedWaitMinutes -
      targetWaitMinutes
  );

  const delayedArrivalMinutes =
    departureMinutes + travelMinutes;

  const delayedTurnMinutes =
    delayedArrivalMinutes + targetWaitMinutes;

  const delayedCompletionMinutes =
    delayedTurnMinutes + serviceMinutes;

  return {
    status: "WAIT",
    reason: "The current queue is too long to justify leaving now.",
    recommendedDeparture: timeFromMinutes(departureMinutes),
    estimatedCompletion: timeFromMinutes(
      delayedCompletionMinutes
    ),
  };
}

  return {
    status: "GO",
    reason:
      "You are ready and the estimated visit can be completed before closing.",
    recommendedDeparture: timeFromMinutes(currentMinutes),
    estimatedCompletion: timeFromMinutes(completionMinutes),
  };
}

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(200, { ok: true });
    }

    await ensureSeeded();

    const method =
      event.requestContext?.http?.method ||
      event.httpMethod ||
      "GET";

    const path =
      event.rawPath ||
      event.path ||
      "/";

    if (method === "GET" && path.endsWith("/health")) {
      return response(200, {
        ok: true,
        service: "QueueLess AWS Lambda",
        database: "DynamoDB",
      });
    }

    if (method === "GET" && path.endsWith("/api/services")) {
      const services = await getAllServices();

      return response(200, {
        services,
      });
    }

    if (
      method === "GET" &&
      path.includes("/api/services/")
    ) {
      const serviceId =
        event.pathParameters?.serviceId;

      const service = await getService(serviceId);

      if (!service) {
        return response(404, {
          error: "Service not found",
        });
      }

      return response(200, service);
    }

    if (
      method === "POST" &&
      path.endsWith("/api/decision")
    ) {
      const body = event.body
        ? JSON.parse(event.body)
        : {};

      const {
        serviceId,
        documents = [],
        simulatedTime,
      } = body;

      if (!serviceId) {
        return response(400, {
          error: "serviceId is required",
        });
      }

      const service = await getService(serviceId);

      if (!service) {
        return response(404, {
          error: `Unknown service: ${serviceId}`,
        });
      }

      const availableDocuments = new Set(documents);

      const missingRequirements =
        service.requirements.filter(
          (requirement) =>
            !availableDocuments.has(requirement)
        );

      const estimatedWaitMinutes =
        service.queueAhead *
        service.averageServiceMinutes;

      const currentMinutes =
        typeof simulatedTime === "number"
          ? simulatedTime
          : getCurrentMinutesIST();

      const decision = calculateDecision({
        missingRequirements,
        queueAhead: service.queueAhead,
        estimatedWaitMinutes,
        travelMinutes: service.travelMinutes,
        serviceMinutes:
          service.averageServiceMinutes,
        closingTime: service.closingTime,
        currentMinutes,
      });

     

return response(200, {
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
    }

   if (
  method === "POST" &&
  path.includes("/api/queue/")
) {
  const serviceId =
    event.pathParameters?.serviceId;

  if (!serviceId) {
    return response(400, {
      error: "serviceId is required",
    });
  }

  const body = event.body
    ? JSON.parse(event.body)
    : {};

  const requestedQueueAhead = Math.max(
    0,
    Number(body.queueAhead)
  );

  const currentServiceResult = await dynamo.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: serviceId },
      },
    })
  );

  if (!currentServiceResult.Item) {
    return response(404, {
      error: `Unknown service: ${serviceId}`,
    });
  }

  const currentServing = Number(
    currentServiceResult.Item.currentServing?.N ?? "40"
  );

  const waitingTokens = JSON.parse(
    currentServiceResult.Item.waitingTokens?.S ?? "[]"
  );

  const nextServing =
    waitingTokens.length > 0
      ? Number(waitingTokens[0])
      : currentServing + 1;

  const updatedWaitingTokens =
    waitingTokens.length > 0
      ? waitingTokens.slice(1)
      : [];

  const updatedQueueAhead = updatedWaitingTokens.length;

  await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: serviceId },
      },
      UpdateExpression:
        "SET queueAhead = :queueAhead, currentServing = :currentServing, waitingTokens = :waitingTokens",
      ExpressionAttributeValues: {
        ":queueAhead": {
          N: String(updatedQueueAhead),
        },
        ":currentServing": {
          N: String(nextServing),
        },
        ":waitingTokens": {
          S: JSON.stringify(updatedWaitingTokens),
        },
      },
    })
  );

  return response(200, {
    ok: true,
    serviceId,
    queueAhead: updatedQueueAhead,
    currentServing: nextServing,
    waitingTokens: updatedWaitingTokens,
  });
}
if (
  method === "GET" &&
  path.includes("/api/queue/")
) {
  const serviceId =
    event.pathParameters?.serviceId;

  if (!serviceId) {
    return response(400, {
      error: "serviceId is required",
    });
  }

  const result = await dynamo.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: {
        id: { S: serviceId },
      },
    })
  );

  if (!result.Item) {
    return response(404, {
      error: `Unknown service: ${serviceId}`,
    });
  }

  const currentServing = Number(
    result.Item.currentServing?.N ?? "40"
  );

  const waitingTokens = JSON.parse(
    result.Item.waitingTokens?.S ?? "[]"
  );

  const queueAhead = waitingTokens.length;

  return response(200, {
    serviceId,
    currentServing,
    waitingTokens,
    queueAhead,
  });
}
    return response(404, {
      error: "Route not found",
    });
  } catch (error) {
    console.error("QueueLess Lambda error:", error);

    return response(500, {
      error: "Internal QueueLess server error",
    });
  }
};