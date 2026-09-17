import { GoogleGenAI } from "@google/genai";
import { Agent } from "@strands-agents/sdk";
import { GoogleModel } from "@strands-agents/sdk/models/google";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const secretsClient = new SecretsManagerClient({});

let cachedAgent = null;

async function getGeminiApiKey() {
  const secretArn = process.env.GEMINI_SECRET_ARN;

  if (!secretArn) {
    throw new Error("GEMINI_SECRET_ARN is not configured.");
  }

  const result = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId: secretArn,
    })
  );

  if (!result.SecretString) {
    throw new Error("Gemini secret is empty.");
  }

  return result.SecretString.trim();
}

async function getAgent() {
  if (cachedAgent) {
    return cachedAgent;
  }

  const apiKey = await getGeminiApiKey();

  const client = new GoogleGenAI({
  apiKey,
});

const model = new GoogleModel({
  client,
  modelId: "gemini-2.5-flash",
  params: {
    temperature: 0.1,
    maxOutputTokens: 300,
  },
});

  cachedAgent = new Agent({
    model,

    systemPrompt: `
You are QueueLess, an intelligent campus visit assistant.

The application's deterministic decision engine is authoritative.

You MUST NOT change or override the supplied status:
GO
WAIT
DONT_GO

Your job is only to explain the result clearly to the student.

Use only the supplied information.
Never invent queue data, requirements, timing, or campus facts.

Return a concise explanation with:

SUMMARY:
One short sentence explaining the decision.

NEXT ACTION:
One short sentence telling the student what to do next.
`,
    printer: false,
  });

  return cachedAgent;
}

export async function explainDecision(decisionData) {
  try {
    const agent = await getAgent();

    const result = await agent.invoke(`
Explain this QueueLess decision.

STATUS: ${decisionData.status}

REASON:
${decisionData.reason}

SERVICE:
${decisionData.serviceName}

OFFICE:
${decisionData.office}

REQUIREMENTS STATUS:
${decisionData.requirementsStatus}

QUEUE:
${decisionData.queueAhead} people ahead

ESTIMATED WAIT:
${decisionData.estimatedWaitMinutes} minutes

TRAVEL TIME:
${decisionData.travelMinutes} minutes

SERVICE TIME:
${decisionData.serviceMinutes} minutes

CLOSING TIME:
${decisionData.closingTime}

RECOMMENDED DEPARTURE:
${decisionData.recommendedDeparture}

ESTIMATED COMPLETION:
${decisionData.estimatedCompletion}
`);

    const content = result.lastMessage?.content ?? [];

const text = content
  .map((block) => {
    if (typeof block?.text === "string") {
      return block.text;
    }

    if (
      block?.text &&
      typeof block.text === "object" &&
      typeof block.text.text === "string"
    ) {
      return block.text.text;
    }

    return "";
  })
  .filter(Boolean)
  .join("\n")
  .trim();

return text || null;
  } catch (error) {
    console.error("QueueLess Strands explanation error:", error);

    return null;
  }
}