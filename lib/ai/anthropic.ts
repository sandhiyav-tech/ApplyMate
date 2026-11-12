import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("placeholder") || !apiKey.startsWith("sk-ant-")) {
    return null;
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey,
    });
  }

  return anthropicClient;
}

export const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";

