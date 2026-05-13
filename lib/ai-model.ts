/** Default model when using Vercel AI Gateway (`AI_GATEWAY_MODEL` overrides). */
export const DEFAULT_GATEWAY_MODEL = "anthropic/claude-sonnet-4.6";

export function getGatewayModel(): string {
  return process.env.AI_GATEWAY_MODEL ?? DEFAULT_GATEWAY_MODEL;
}
