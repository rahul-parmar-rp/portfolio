import React, { useMemo, useState } from "react";

import styles from "./styles.module.css";

type NotebookCell = {
  id: string;
  title: string;
  code: string;
};

type CellOutput = {
  status: "idle" | "success" | "error";
  lines: string[];
};

const INITIAL_CELLS: NotebookCell[] = [
  {
    id: "fib-function",
    title: "Cell 1: Define Fibonacci Function",
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    id: "fib-run",
    title: "Cell 2: Run Fibonacci Snippet",
    code: `const values = [];
for (let i = 0; i < 10; i += 1) {
  values.push(fibonacci(i));
}
console.log("First 10 fibonacci numbers:", values.join(", "));
values;`,
  },
];

const IDLE_OUTPUT: CellOutput = {
  status: "idle",
  lines: ["Run a cell to see output."],
};

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function runNotebook(cells: NotebookCell[], lastCellIndex: number): CellOutput[] {
  const outputs: CellOutput[] = cells.map(() => ({ ...IDLE_OUTPUT }));
  let scope = "";

  for (let index = 0; index <= lastCellIndex; index += 1) {
    const lines: string[] = [];

    const print = (...args: unknown[]) => {
      lines.push(args.map(formatValue).join(" "));
    };

    const notebookConsole = {
      log: (...args: unknown[]) => print(...args),
      error: (...args: unknown[]) => print("ERROR:", ...args),
      warn: (...args: unknown[]) => print("WARN:", ...args),
    };

    scope = `${scope}\n${cells[index].code}`;

    try {
      const result = new Function(
        "console",
        "print",
        `${scope}\nreturn typeof values !== \"undefined\" ? values : undefined;`,
      )(notebookConsole, print);

      if (typeof result !== "undefined") {
        lines.push(`Result: ${formatValue(result)}`);
      }

      outputs[index] = {
        status: "success",
        lines: lines.length > 0 ? lines : ["Executed successfully."],
      };
    } catch (error) {
      outputs[index] = {
        status: "error",
        lines: [error instanceof Error ? error.message : String(error)],
      };
      break;
    }
  }

  return outputs;
}

export default function JsMiniNotebook() {
  const [cells, setCells] = useState(INITIAL_CELLS);
  const [outputs, setOutputs] = useState<CellOutput[]>(
    INITIAL_CELLS.map(() => ({ ...IDLE_OUTPUT })),
  );

  const notebookHint = useMemo(
    () =>
      "This notebook-style demo executes JavaScript cells in order. Cell 2 can use functions declared in Cell 1.",
    [],
  );

  function updateCell(cellIndex: number, code: string) {
    setCells((previous) =>
      previous.map((cell, index) =>
        index === cellIndex ? { ...cell, code } : cell,
      ),
    );
  }

  function runCell(cellIndex: number) {
    setOutputs(runNotebook(cells, cellIndex));
  }

  function runAllCells() {
    setOutputs(runNotebook(cells, cells.length - 1));
  }

  function resetNotebook() {
    setCells(INITIAL_CELLS);
    setOutputs(INITIAL_CELLS.map(() => ({ ...IDLE_OUTPUT })));
  }

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <span className={styles.badge}>Interactive MDX Notebook</span>
        <h2>JavaScript Mini Notebook: Fibonacci</h2>
        <p>{notebookHint}</p>
      </div>

      <div className={styles.toolbar}>
        <button
          className={`${styles.button} ${styles.primary}`}
          onClick={runAllCells}
          type="button"
        >
          Run All Cells
        </button>
        <button className={styles.button} onClick={resetNotebook} type="button">
          Reset
        </button>
      </div>

      <div className={styles.cells}>
        {cells.map((cell, index) => (
          <section className={styles.cell} key={cell.id}>
            <div className={styles.cellTop}>
              <strong>{cell.title}</strong>
              <button
                className={styles.button}
                onClick={() => runCell(index)}
                type="button"
              >
                Run Cell
              </button>
            </div>

            <textarea
              className={styles.editor}
              onChange={(event) => updateCell(index, event.target.value)}
              spellCheck={false}
              value={cell.code}
            />

            <div
              className={`${styles.output} ${
                outputs[index]?.status === "error" ? styles.error : ""
              }`}
            >
              <div className={styles.outputTitle}>Output</div>
              <pre>{(outputs[index]?.lines || IDLE_OUTPUT.lines).join("\n")}</pre>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
