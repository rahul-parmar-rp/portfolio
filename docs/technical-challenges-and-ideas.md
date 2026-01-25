ESLint does not natively support applying specific rules only to newly saved files or only to the file currently being edited in an automatic or dynamic way. ESLint configuration typically applies rules globally to all files matching the configured patterns.

However, some approaches can approximate this behavior:

1. **Override Rules by File Path**: ESLint allows configuring overrides for specific files or folders in `.eslintrc` using the `"overrides"` field, so you can define stricter or additional rules only for newly created files if they are placed in specific directories or have naming conventions.

2. **Editor/IDE Integration**: Many editors like VS Code run ESLint on the currently opened file or on save, so you can manually enable or disable rules in the editor settings or ESLint config for that file. But this is not automatic per file unless combined with overrides.

3. **Custom Scripts or Hooks**: You may create custom pre-commit or git hooks, or scripts that detect newly added files and run ESLint with specific rule sets only on those files.

4. **Selective ESLint CLI Runs**: Run ESLint command manually or via scripts targeting only given files (e.g., newly added or currently edited files).

In summary, ESLint itself doesn't provide dynamic file-based rule application tied to edit/save state, but you can achieve something similar using overrides, editor configurations, and custom tooling workflows.

If needed, I can help with an example configuration using ESLint `"overrides"` or a script for selective linting.

How to Apply ESLint Rules Only to Newly Created or Currently Edited Files
ESLint is a popular tool for maintaining code quality and enforcing coding standards across JavaScript and TypeScript projects. Typically, ESLint configurations apply linting rules uniformly across all files in a project. But what if you want specific rules to apply only to newly added files, or dynamically to the file you're currently editing? This kind of selective linting can help introduce stricter standards gradually or give flexibility during development.

The Challenge: Dynamic File-Specific Rules in ESLint
Out of the box, ESLint doesn’t provide a way to automatically apply certain rules only to new or currently open files. ESLint configurations are static and target files by glob patterns or paths. This makes it tricky to:

Enforce new or experimental rules just on recently created files or,

Apply stricter checks progressively without overwhelming the entire codebase at once.

Possible Approaches to Solve This
While ESLint lacks built-in dynamic rules, you can approximate the behavior with a few techniques:

1. Use ESLint’s overrides Configuration
   ESLint allows you to define rules specifically for certain files or folders using the overrides field in your config file (e.g., .eslintrc.json or .eslintrc.js):

json
{
"overrides": [
{
"files": ["src/new-files/**/*.js"],
"rules": {
"no-console": "error",
"strict": ["error", "global"]
}
}
]
}
By organizing newly created files into a designated directory or naming pattern, you can apply stricter or additional rules selectively.

2. Editor or IDE Integration
   Modern code editors like VS Code run ESLint on files you are currently editing or saving. While this doesn't change ESLint's config dynamically, you can:

Use editor extensions to run different lint configs per workspace or folder.

Manually enable/disable certain rules during development.

3. Git or Pre-commit Hooks for Selective Linting
   You can write scripts that detect newly added files in a git commit (e.g., using git diff --cached --name-status) and run ESLint with a specific config or ruleset on those files only. This selective linting keeps code quality tight on new code without retrofitting legacy files immediately.

4. Running ESLint on Selected Files
   Instead of linting the whole codebase, you can call ESLint from command line or your npm scripts targeting specific files:

bash
eslint src/new-files/\*_/_.js

# or only lint staged files

lint-staged
This approach gives you control over what gets linted with which rules.

Summary
While ESLint itself does not natively support dynamic, per-file edit-time changes in rule application, combining ESLint's overrides feature with developer workflows such as directory structuring, git hooks, selective command runs, and editor configs can effectively achieve similar goals. This approach facilitates gradual adoption of new linting standards and helps teams maintain code quality with flexibility.
