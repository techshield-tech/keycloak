## Code Understanding — IMPORTANT

**YOU MUST use `codebase-memory` tools FIRST** whenever you need to understand the project.

Before running any Grep, Glob, or file search, call `codebase-memory` for:
- "How does X work?"
- "Where is Y defined?"
- "What calls Z?"
- Tracing paths between components
- Architecture questions

**Only fall back to Grep/Glob if `codebase-memory` returns no result or the repo is not indexed.**

This is a hard rule, not a preference.
## Comment & tài liệu

- **KHÔNG** thêm comment vào code khi không được yêu cầu.
- **KHÔNG** tạo mới hoặc sửa `README.md` (hay bất kỳ file tài liệu `.md` nào) khi không được yêu cầu.
- **KHÔNG** code unit test khi chưa có yêu cầu


## Agent Routing

Use subagents (via the `Agent` tool) for these task types. Do not handle them entirely inline when they are non-trivial.

| Task           | Agent    | When to use                                                                      |
| -------------- | -------- | -------------------------------------------------------------------------------- |
| Implementation | `coder`  | Writing new features, fixing bugs, refactoring code                              |
| Code review    | `review` | Reviewing diffs, PRs, or any code for correctness, style, and issues             |
| Testing        | `tester` | Writing unit/integration tests, verifying test coverage, debugging failing tests |
| Cli-command    | `cli-command` | Running shell commands, CLI operations, npm/package manager commands, git operations, and any terminal-based tasks |

**Routing rules:**

- If the user asks to **implement or fix** something → delegate to `coder`.
- If the user asks to **review** code, a PR, or a diff → delegate to `review`.
- If the user asks to **write tests** or **verify behavior** → delegate to `tester`.
- For multi-step tasks (e.g. implement then test), chain agents sequentially: `coder` → `tester`.
- For simple, one-liner questions or lookups, handle inline — no need to spawn a subagent.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **admin-service** (4550 symbols, 8118 relationships, 313 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/admin-service/context` | Codebase overview, check index freshness |
| `gitnexus://repo/admin-service/clusters` | All functional areas |
| `gitnexus://repo/admin-service/processes` | All execution flows |
| `gitnexus://repo/admin-service/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
