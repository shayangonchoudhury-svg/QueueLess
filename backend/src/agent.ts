import "dotenv/config";

import { Agent } from "@strands-agents/sdk";
import { GoogleModel } from "@strands-agents/sdk/models/google";

import { checkServiceRequirements } from "./tools/requirements.js";
import { checkUserReadiness } from "./tools/readiness.js";
import { getQueueStatus } from "./tools/queue.js";
import { getOfficeTiming } from "./tools/timing.js";
import { calculateDecision } from "./tools/decision.js";

async function main() {
  console.log("Starting QueueLess AI agent...\n");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = new GoogleModel({
    apiKey,
    modelId: "gemini-2.5-flash",
    params: {
      temperature: 0.1,
      maxOutputTokens: 800,
    },
  });

  const agent = new Agent({
    model,

    systemPrompt: `
You are QueueLess, an intelligent campus visit decision assistant.

Your job is to answer one question:

"Should the student go now?"

You have access to tools that provide:
- service requirements
- student readiness
- current queue
- office timing
- travel time
- service duration

ALWAYS use the tools before making a decision.

Decision rules:

1. ALWAYS gather the relevant information using the QueueLess tools.

2. ALWAYS call calculate_visit_decision after gathering:
   - requirements/readiness
   - queue
   - office timing
   - travel time
   - service duration

3. The calculate_visit_decision tool is the authoritative source for:
   GO
   WAIT
   DON'T GO

4. Do NOT independently override the result of calculate_visit_decision.

5. Your job after receiving the tool result is to explain the decision clearly
   and give the student the next action.

Your final answer must clearly contain:

STATUS: GO / WAIT / DON'T GO

REASON:
A concise explanation.

DETAILS:
- Service
- Office
- Requirements status
- Queue
- Estimated wait
- Travel time
- Service time
- Closing time

NEXT ACTION:
Tell the student exactly what to do next.

Never invent queue data or requirements.
Use tool results.
`,

    tools: [
      checkServiceRequirements,
      checkUserReadiness,
      getQueueStatus,
      getOfficeTiming,
      calculateDecision,
    ],

    printer: false,
  });

  const result = await agent.invoke(`
A student says:

"I need a Migration Certificate. Should I go now?"

Use the QueueLess tools to analyze the request and give the student
a GO, WAIT, or DON'T GO decision.
`);

  console.log("\n=== QUEUELESS DECISION ===\n");

  console.log(result.lastMessage);
}

main().catch((error) => {
  console.error("\n=== AGENT ERROR ===");
  console.error(error);
  process.exit(1);
});