# Project Context MCO

A VS Code extension that provides intelligent project context and navigation for your workspace.

## Features

- 📊 **Project Overview**: Get instant insights about your project's structure
- 📁 **File & Folder Analysis**: Automatically count and analyze project files
- 🚀 **Framework Detection**: Automatically detect the frameworks used in your project (Next.js, React, Vue, etc.)
- 📋 **Context to Clipboard**: Copy formatted project context to clipboard
- 🌳 **Visual Tree View**: Browse project information in the sidebar

## Commands

This extension contributes the following commands:

- `Project Context MCO: Show Project Context` - Opens a detailed view of your project context
- `Project Context MCO: Analyze Project Structure` - Analyzes and displays project statistics
- `Project Context MCO: Copy Project Context to Clipboard` - Copies project context as markdown

## Usage

1. Open any workspace in VS Code
2. Open the Command Palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows/Linux)
3. Type "Project Context" to see available commands
4. Click the Project Context icon in the Activity Bar to see the sidebar view

## Extension Settings

This extension currently works out of the box with no configuration needed.

## Requirements

- VS Code 1.75.0 or higher

## Installation

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 to open a new VS Code window with the extension loaded

### Package as VSIX

```bash
npm install -g @vscode/vsce
vsce package
```

Then install the `.vsix` file in VS Code.

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Run tests
npm test
```

## Release Notes

### 0.0.1

Initial release of Project Context MCO:
- Project overview and statistics
- Framework detection
- File tree visualization
- Context export to clipboard

## License

MIT

---

**Enjoy!** 🚀
