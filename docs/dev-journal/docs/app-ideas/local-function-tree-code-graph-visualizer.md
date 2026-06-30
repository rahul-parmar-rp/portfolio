# Draft Plan: Local Function Tree and Code Graph Visualizer

## Idea Summary

Build a local code-visualization tool that shows:

- function tree
- call graph
- module dependency graph

Think of it like an Obsidian-style graph view, but focused on source code symbols.

## Problem

Developers struggle to understand large codebases quickly, especially function-to-function flow and cross-file dependencies.

## Core MVP

- Parse project files (start with TypeScript/JavaScript)
- Extract symbols: functions, classes, exports, imports
- Build:
  - local file tree view
  - function-level call graph
  - module-level dependency graph
- Click node to open source location

## Suggested Technical Approach

- Parser: `ts-morph` or TypeScript compiler API
- Graph model: nodes and edges in JSON
- UI: React + Cytoscape.js or D3 force graph
- Optional desktop packaging: Electron/Tauri

## MVP Modes

### Mode A: Local Web App

- run on localhost
- select folder
- generate and browse graph

### Mode B: VS Code Extension

- command: "Generate Function Graph"
- side panel with interactive graph
- click graph node to jump to code

## Key Views

- Function Tree: file -> class/function -> nested calls
- Hotspot View: highly connected functions
- Dead Code Candidates: symbols with no inbound edges
- Change Impact View: if function X changes, what breaks?

## Milestones

1. Parse TS/JS and create symbol index
2. Generate call graph JSON
3. Visual graph UI with search/filter
4. Add export/import and dead code heuristics

## MVP Success Metrics

- graph generation under 15 seconds for medium repos
- accurate jump-to-definition for major symbols
- useful impact map for refactor planning
