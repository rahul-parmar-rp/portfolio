async function runOllama(prompt) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-oss:20b",
      prompt,
      stream: false,
    }),
  });

  const data = await res.json();
  console.log(data.response);
}

runOllama("Explain micro-frontends in simple terms.");
