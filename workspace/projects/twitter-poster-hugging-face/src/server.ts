import { createServer } from "node:http";
import { getServerConfig } from "./config.js";
import { generateAndPost, generateOnly } from "./service.js";

type RequestBody = {
  topic?: string;
  dryRun?: boolean;
};

function sendJson(
  res: import("node:http").ServerResponse,
  statusCode: number,
  body: unknown,
) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

async function readJsonBody(
  req: import("node:http").IncomingMessage,
): Promise<RequestBody> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }
  return JSON.parse(raw) as RequestBody;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return sendJson(res, 405, { ok: false, error: "Method not allowed" });
    }

    if (!req.url) {
      return sendJson(res, 400, { ok: false, error: "Invalid URL" });
    }

    const body = await readJsonBody(req);
    const topic = body.topic?.trim();

    if (!topic) {
      return sendJson(res, 400, {
        ok: false,
        error: "Missing 'topic' in request body",
      });
    }

    if (req.url === "/generate") {
      const result = await generateOnly(topic);
      return sendJson(res, 200, { ok: true, ...result });
    }

    if (req.url === "/generate-and-post") {
      const result = await generateAndPost(topic, {
        dryRun: Boolean(body.dryRun),
      });
      return sendJson(res, 200, { ok: true, ...result });
    }

    return sendJson(res, 404, { ok: false, error: "Not found" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return sendJson(res, 500, { ok: false, error: message });
  }
});

const { port } = getServerConfig();

server.listen(port, () => {
  console.log(
    JSON.stringify({
      ok: true,
      message: `Server running on http://localhost:${port}`,
    }),
  );
});
