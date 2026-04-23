import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

function getRequired(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function toNumber(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getHfConfig() {
  return {
    hfApiKey: getRequired("HF_API_KEY"),
    hfModelId: getRequired("HF_MODEL_ID"),
    hfTimeoutMs: toNumber(process.env.HF_TIMEOUT_MS, 30000),
  };
}

export function getTwitterConfig() {
  return {
    twitterApiKey: getRequired("TWITTER_API_KEY"),
    twitterApiSecret: getRequired("TWITTER_API_SECRET"),
    twitterAccessToken: getRequired("TWITTER_ACCESS_TOKEN"),
    twitterAccessSecret: getRequired("TWITTER_ACCESS_SECRET"),
  };
}

export function getServerConfig() {
  return {
    port: toNumber(process.env.PORT, 8787),
  };
}
