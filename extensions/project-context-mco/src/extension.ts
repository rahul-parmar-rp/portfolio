import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Project Context MCO is now active!');

    // Register tree data provider for the sidebar view
    const projectContextProvider = new ProjectContextProvider(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '');
    vscode.window.registerTreeDataProvider('projectContextView', projectContextProvider);

    // Show Project Context command
    let showContextDisposable = vscode.commands.registerCommand('project-context-mco.showContext', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const context = await generateProjectContext(workspaceFolder.uri.fsPath);
        const panel = vscode.window.createWebviewPanel(
            'projectContext',
            'Project Context',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent(context);
    });

    // Analyze Project Structure command
    let analyzeStructureDisposable = vscode.commands.registerCommand('project-context-mco.analyzeStructure', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Analyzing project structure...",
            cancellable: false
        }, async () => {
            const structure = await analyzeProjectStructure(workspaceFolder.uri.fsPath);
            vscode.window.showInformationMessage(
                `Project has ${structure.fileCount} files, ${structure.folderCount} folders`
            );
            return Promise.resolve();
        });
    });

    // Copy Context to Clipboard command
    let copyContextDisposable = vscode.commands.registerCommand('project-context-mco.copyContext', async () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const context = await generateProjectContext(workspaceFolder.uri.fsPath);
        await vscode.env.clipboard.writeText(context.markdown);
        vscode.window.showInformationMessage('Project context copied to clipboard!');
    });

    context.subscriptions.push(showContextDisposable);
    context.subscriptions.push(analyzeStructureDisposable);
    context.subscriptions.push(copyContextDisposable);
}

class ProjectContextProvider implements vscode.TreeDataProvider<ProjectItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProjectItem | undefined | null | void> = new vscode.EventEmitter<ProjectItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ProjectItem | undefined | null | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string) {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: ProjectItem): Promise<ProjectItem[]> {
        if (!this.workspaceRoot) {
            return [];
        }

        if (!element) {
            // Root level items
            return this.getRootItems();
        }

        return [];
    }

    private async getRootItems(): Promise<ProjectItem[]> {
        const items: ProjectItem[] = [];
        
        // Check for package.json
        const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            items.push(new ProjectItem(
                `📦 ${packageJson.name || 'Project'}`,
                vscode.TreeItemCollapsibleState.None,
                { command: 'vscode.open', title: 'Open', arguments: [vscode.Uri.file(packageJsonPath)] }
            ));
        }

        // Count files and folders
        const structure = await analyzeProjectStructure(this.workspaceRoot);
        items.push(new ProjectItem(
            `📁 ${structure.folderCount} folders`,
            vscode.TreeItemCollapsibleState.None
        ));
        items.push(new ProjectItem(
            `📄 ${structure.fileCount} files`,
            vscode.TreeItemCollapsibleState.None
        ));

        // Detect framework
        const framework = detectFramework(this.workspaceRoot);
        if (framework) {
            items.push(new ProjectItem(
                `⚡ ${framework}`,
                vscode.TreeItemCollapsibleState.None
            ));
        }

        return items;
    }
}

class ProjectItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }
}

interface ProjectContext {
    name: string;
    framework?: string;
    fileCount: number;
    folderCount: number;
    structure: string;
    markdown: string;
}

interface ProjectStructure {
    fileCount: number;
    folderCount: number;
}

async function generateProjectContext(rootPath: string): Promise<ProjectContext> {
    const structure = await analyzeProjectStructure(rootPath);
    const framework = detectFramework(rootPath);
    const fileTree = await generateFileTree(rootPath);
    
    let name = 'Unknown Project';
    const packageJsonPath = path.join(rootPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        name = packageJson.name || name;
    }

    const markdown = `# Project Context: ${name}

## Overview
- **Framework**: ${framework || 'Not detected'}
- **Files**: ${structure.fileCount}
- **Folders**: ${structure.folderCount}

## Project Structure
\`\`\`
${fileTree}
\`\`\`
`;

    return {
        name,
        framework,
        fileCount: structure.fileCount,
        folderCount: structure.folderCount,
        structure: fileTree,
        markdown
    };
}

async function analyzeProjectStructure(rootPath: string): Promise<ProjectStructure> {
    let fileCount = 0;
    let folderCount = 0;

    const shouldIgnore = (name: string): boolean => {
        const ignorePatterns = ['node_modules', '.git', 'dist', 'out', 'build', '.next'];
        return ignorePatterns.includes(name);
    };

    const traverse = (dir: string) => {
        try {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                if (shouldIgnore(item)) continue;
                
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    folderCount++;
                    traverse(fullPath);
                } else {
                    fileCount++;
                }
            }
        } catch (err) {
            // Skip directories we can't read
        }
    };

    traverse(rootPath);
    return { fileCount, folderCount };
}

function detectFramework(rootPath: string): string | undefined {
    const packageJsonPath = path.join(rootPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        return undefined;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (deps['next']) return 'Next.js';
    if (deps['react']) return 'React';
    if (deps['vue']) return 'Vue.js';
    if (deps['@angular/core']) return 'Angular';
    if (deps['svelte']) return 'Svelte';
    if (deps['express']) return 'Express';
    if (deps['gatsby']) return 'Gatsby';

    return undefined;
}

async function generateFileTree(rootPath: string, prefix: string = '', maxDepth: number = 3, currentDepth: number = 0): Promise<string> {
    if (currentDepth >= maxDepth) {
        return '';
    }

    const shouldIgnore = (name: string): boolean => {
        const ignorePatterns = ['node_modules', '.git', 'dist', 'out', 'build', '.next', 'coverage'];
        return ignorePatterns.includes(name) || name.startsWith('.');
    };

    let result = '';
    try {
        const items = fs.readdirSync(rootPath).filter(item => !shouldIgnore(item)).sort();
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const fullPath = path.join(rootPath, item);
            const isLast = i === items.length - 1;
            const stat = fs.statSync(fullPath);
            
            const connector = isLast ? '└── ' : '├── ';
            result += prefix + connector + item;
            
            if (stat.isDirectory()) {
                result += '/\n';
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                result += await generateFileTree(fullPath, newPrefix, maxDepth, currentDepth + 1);
            } else {
                result += '\n';
            }
        }
    } catch (err) {
        // Skip directories we can't read
    }

    return result;
}

function getWebviewContent(context: ProjectContext): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Context</title>
    <style>
        body {
            padding: 20px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
        }
        h1 {
            color: var(--vscode-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
        }
        h2 {
            color: var(--vscode-foreground);
            margin-top: 30px;
        }
        .stats {
            display: flex;
            gap: 30px;
            margin: 20px 0;
        }
        .stat {
            padding: 15px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 5px;
        }
        .stat-label {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
        }
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            margin-top: 5px;
        }
        pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
        }
    </style>
</head>
<body>
    <h1>📂 Project Context: ${context.name}</h1>
    
    <div class="stats">
        <div class="stat">
            <div class="stat-label">Framework</div>
            <div class="stat-value">${context.framework || 'N/A'}</div>
        </div>
        <div class="stat">
            <div class="stat-label">Files</div>
            <div class="stat-value">${context.fileCount}</div>
        </div>
        <div class="stat">
            <div class="stat-label">Folders</div>
            <div class="stat-value">${context.folderCount}</div>
        </div>
    </div>

    <h2>Project Structure</h2>
    <pre><code>${context.structure}</code></pre>
</body>
</html>`;
}

export function deactivate() {}
