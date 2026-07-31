import React, { useMemo, useState } from "react";

import styles from "./styles.module.css";

// Local Function Tree & Code Graph Visualizer
// Fully offline: no parser dependencies. It uses a lightweight tokenizer to
// find function declarations and which functions call which, then renders an
// interactive SVG call graph. Good enough for TS/JS demos without pulling in
// ts-morph or the TypeScript compiler.

type FnNode = {
  name: string;
  calls: Set<string>;
};

type Edge = {
  from: string;
  to: string;
};

type GraphModel = {
  nodes: string[];
  edges: Edge[];
  hotspots: string[]; // most called
  deadCode: string[]; // no inbound edges
};

const SAMPLE = `function main() {
  const data = loadData();
  const cleaned = clean(data);
  render(cleaned);
}

function loadData() {
  return fetchLocal();
}

function fetchLocal() {
  return [1, 2, 3];
}

function clean(items) {
  return items.map(normalize);
}

function normalize(x) {
  return x * 2;
}

function render(items) {
  console.log(items);
}

function unusedHelper() {
  return normalize(10);
}`;

// Strip strings and comments so we do not treat their contents as code.
function stripNoise(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ") // block comments
    .replace(/\/\/[^\n]*/g, " ") // line comments
    .replace(/`(?:\\.|[^`\\])*`/g, '""') // template literals
    .replace(/"(?:\\.|[^"\\])*"/g, '""') // double-quoted strings
    .replace(/'(?:\\.|[^'\\])*'/g, '""'); // single-quoted strings
}

function extractFunctions(source: string): Map<string, FnNode> {
  const clean = stripNoise(source);
  const nodes = new Map<string, FnNode>();

  const declRegexes = [
    /function\s+([A-Za-z_$][\w$]*)\s*\(/g, // function foo(
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(?[^)]*\)?\s*=>/g, // const foo = () =>
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function/g, // const foo = function
  ];

  for (const regex of declRegexes) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(clean)) !== null) {
      const name = match[1];
      if (!nodes.has(name)) {
        nodes.set(name, { name, calls: new Set() });
      }
    }
  }

  // For each function, capture its body by brace matching and find calls.
  const declared = new Set(nodes.keys());

  for (const name of declared) {
    const body = extractBody(clean, name);
    if (!body) {
      continue;
    }
    const callRegex = /([A-Za-z_$][\w$]*)\s*\(/g;
    let call: RegExpExecArray | null;
    while ((call = callRegex.exec(body)) !== null) {
      const callee = call[1];
      if (callee !== name && declared.has(callee)) {
        nodes.get(name)!.calls.add(callee);
      }
    }
  }

  return nodes;
}

// Find the body of a named function via naive brace matching.
function extractBody(source: string, name: string): string | null {
  const patterns = [
    new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*{`),
    new RegExp(
      `(?:const|let|var)\\s+${name}\\s*=\\s*(?:async\\s*)?\\([^)]*\\)\\s*=>\\s*{`,
    ),
    new RegExp(
      `(?:const|let|var)\\s+${name}\\s*=\\s*(?:async\\s*)?function[^{]*{`,
    ),
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(source);
    if (!match) {
      continue;
    }
    const start = match.index + match[0].length - 1; // at the '{'
    let depth = 0;
    for (let i = start; i < source.length; i += 1) {
      if (source[i] === "{") {
        depth += 1;
      } else if (source[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          return source.slice(start + 1, i);
        }
      }
    }
  }
  return null;
}

function buildGraph(nodes: Map<string, FnNode>): GraphModel {
  const names = Array.from(nodes.keys());
  const edges: Edge[] = [];
  const inbound = new Map<string, number>();

  names.forEach((n) => inbound.set(n, 0));

  for (const node of nodes.values()) {
    for (const callee of node.calls) {
      edges.push({ from: node.name, to: callee });
      inbound.set(callee, (inbound.get(callee) ?? 0) + 1);
    }
  }

  const hotspots = names
    .slice()
    .sort((a, b) => (inbound.get(b) ?? 0) - (inbound.get(a) ?? 0))
    .filter((n) => (inbound.get(n) ?? 0) > 0)
    .slice(0, 3);

  const deadCode = names.filter(
    (n) => (inbound.get(n) ?? 0) === 0 && n !== "main",
  );

  return { nodes: names, edges, hotspots, deadCode };
}

// Simple circular layout so we avoid a physics engine and stay offline.
function layout(names: string[], width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 60;
  const positions = new Map<string, { x: number; y: number }>();

  names.forEach((name, index) => {
    const angle = (index / Math.max(names.length, 1)) * Math.PI * 2;
    positions.set(name, {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  });

  return positions;
}

const WIDTH = 640;
const HEIGHT = 460;

export default function CodeGraph() {
  const [source, setSource] = useState(SAMPLE);
  const [selected, setSelected] = useState<string | null>(null);

  const graph = useMemo(() => {
    const nodes = extractFunctions(source);
    return buildGraph(nodes);
  }, [source]);

  const positions = useMemo(
    () => layout(graph.nodes, WIDTH, HEIGHT),
    [graph.nodes],
  );

  const relatedEdges = useMemo(() => {
    if (!selected) {
      return new Set<string>();
    }
    const set = new Set<string>();
    graph.edges.forEach((e) => {
      if (e.from === selected || e.to === selected) {
        set.add(`${e.from}->${e.to}`);
      }
    });
    return set;
  }, [selected, graph.edges]);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <span className={styles.badge}>Offline · no dependencies</span>
        <h2>Function Call Graph Visualizer</h2>
        <p>
          Paste TypeScript/JavaScript. It finds functions and their call
          relationships, then draws an interactive graph. Click a node to
          highlight its connections. Runs entirely in your browser.
        </p>
      </div>

      <textarea
        className={styles.editor}
        value={source}
        spellCheck={false}
        onChange={(e) => setSource(e.target.value)}
        rows={12}
      />

      <div className={styles.stats}>
        <span>
          <strong>{graph.nodes.length}</strong> functions
        </span>
        <span>
          <strong>{graph.edges.length}</strong> calls
        </span>
        <span>
          Hotspots: {graph.hotspots.length ? graph.hotspots.join(", ") : "—"}
        </span>
        <span>
          Dead code: {graph.deadCode.length ? graph.deadCode.join(", ") : "—"}
        </span>
      </div>

      {graph.nodes.length === 0 ? (
        <p className={styles.muted}>
          No functions detected. Paste code that declares functions.
        </p>
      ) : (
        <svg
          className={styles.canvas}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Function call graph"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a8a8a" />
            </marker>
          </defs>

          {graph.edges.map((edge) => {
            const from = positions.get(edge.from);
            const to = positions.get(edge.to);
            if (!from || !to) {
              return null;
            }
            const key = `${edge.from}->${edge.to}`;
            const active = !selected || relatedEdges.has(key);
            return (
              <line
                key={key}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? "#5b8def" : "#d0d0d0"}
                strokeWidth={active ? 2 : 1}
                markerEnd="url(#arrow)"
              />
            );
          })}

          {graph.nodes.map((name) => {
            const pos = positions.get(name);
            if (!pos) {
              return null;
            }
            const isSelected = selected === name;
            const isHotspot = graph.hotspots.includes(name);
            const isDead = graph.deadCode.includes(name);
            const fill = isSelected
              ? "#1d4ed8"
              : isHotspot
                ? "#f59e0b"
                : isDead
                  ? "#ef4444"
                  : "#334155";
            return (
              <g
                key={name}
                className={styles.node}
                onClick={() => setSelected(isSelected ? null : name)}
              >
                <circle cx={pos.x} cy={pos.y} r={18} fill={fill} />
                <text
                  x={pos.x}
                  y={pos.y - 24}
                  textAnchor="middle"
                  className={styles.nodeLabel}
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <div className={styles.legend}>
        <span>
          <i className={styles.dotHot} /> hotspot (most called)
        </span>
        <span>
          <i className={styles.dotDead} /> dead-code candidate
        </span>
        <span>
          <i className={styles.dotSel} /> selected
        </span>
      </div>
    </div>
  );
}
