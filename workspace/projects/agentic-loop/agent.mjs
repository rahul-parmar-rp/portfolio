// The agentic loop: think -> act -> observe -> repeat.
// The model returns one JSON action per turn. We execute the tool and feed
// the observation back until it calls `finish` or we hit max steps.

import { chat } from "./ollama-client.mjs";

function toolReference(tools) {
  return Object.entries(tools)
    .map(([name, t]) => {
      const args = Object.entries(t.args || {})
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return `- ${name}(${args}) — ${t.description}`;
    })
    .join("\n");
}

function systemPrompt(tools) {
  return `You are a local coding agent running in an agentic loop.
You solve the user's coding task step by step using tools.

Available tools:
${toolReference(tools)}
- finish(summary: string) — call when the task is complete.

RULES:
- Respond with EXACTLY ONE JSON object and nothing else.
- Shape: {"thought": "short reasoning", "tool": "tool_name", "args": { ... }}
- Use one tool per turn. Wait for the observation before the next step.
- Prefer reading files before editing. Keep edits minimal and correct.
- When done, use {"thought": "...", "tool": "finish", "args": {"summary": "..."}}.
- Do not wrap JSON in markdown fences.`;
}

// Robust JSON extraction: the model sometimes adds prose or fences.
function parseAction(raw) {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function runAgent({
  task,
  model,
  tools,
  maxSteps = 15,
  log = console.log,
}) {
  const messages = [
    { role: "system", content: systemPrompt(tools) },
    { role: "user", content: `TASK:\n${task}` },
  ];

  for (let step = 1; step <= maxSteps; step += 1) {
    log(`\n─── Step ${step}/${maxSteps} ───`);

    const raw = await chat({ model, messages, format: "json" });
    const action = parseAction(raw);

    if (!action || !action.tool) {
      log("⚠ Could not parse a valid action. Raw output:");
      log(raw.slice(0, 500));
      messages.push({ role: "assistant", content: raw });
      messages.push({
        role: "user",
        content:
          "That was not valid JSON with a 'tool'. Respond with a single JSON action.",
      });
      continue;
    }

    if (action.thought) log(`💭 ${action.thought}`);
    log(`🔧 ${action.tool} ${JSON.stringify(action.args || {})}`);

    if (action.tool === "finish") {
      log(`\n✅ Done: ${action.args?.summary || "(no summary)"}`);
      return { ok: true, steps: step, summary: action.args?.summary };
    }

    const tool = tools[action.tool];
    let observation;
    if (!tool) {
      observation = `Unknown tool '${action.tool}'.`;
    } else {
      try {
        observation = await tool.run(action.args || {});
      } catch (err) {
        observation = `Tool error: ${err.message}`;
      }
    }

    log(`👁 ${String(observation).slice(0, 600)}`);

    messages.push({ role: "assistant", content: raw });
    messages.push({
      role: "user",
      content: `OBSERVATION:\n${observation}`,
    });
  }

  log(`\n⏹ Reached max steps (${maxSteps}) without finishing.`);
  return { ok: false, steps: maxSteps };
}
