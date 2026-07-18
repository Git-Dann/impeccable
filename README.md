# Design Doctor

Design guidance for AI coding agents. 1 skill, 23 commands, live browser iteration, and 46 deterministic detector rules for AI-generated frontend design.

> **Quick start:** From your project root, run `npx design-doctor install`, then run `/design-doctor init` inside your AI coding tool.

## Why Design Doctor?

Every model trained on the same SaaS templates. Skip the guidance and you get the same handful of tells on every project: Inter for everything, purple-to-blue gradients, cards nested in cards, gray text on colored backgrounds, the rounded-square icon tile above every heading.

Design Doctor adds:
- **One setup flow.** `/design-doctor init` writes `PRODUCT.md` and offers `DESIGN.md`, so later commands know the audience, brand/product lane, voice, anti-references, colors, type, and components.
- **23 commands.** A shared design vocabulary with your AI: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and more.
- **46 deterministic detector rules** plus LLM-only critique checks. The CLI and browser extension run the deterministic rules with no LLM and no API key.

## What's Included

### The Skill: design-doctor

The skill installs as one command:

```bash
/design-doctor <command> <target>
```

Start every new project with:

```bash
/design-doctor init
```

`init` asks whether the surface is brand (marketing, landing, portfolio) or product (app UI, dashboard, tool), then writes design context that every later command reads.

### 23 Commands

All commands are accessed through `/design-doctor`:

| Command | What it does |
|---------|--------------|
| `/design-doctor craft` | Full shape-then-build flow with visual iteration |
| `/design-doctor init` | One-time setup: gather design context, write PRODUCT.md and DESIGN.md, configure live mode, recommend next steps |
| `/design-doctor document` | Generate root DESIGN.md from existing project code |
| `/design-doctor extract` | Pull reusable components and tokens into the design system |
| `/design-doctor shape` | Plan UX/UI before writing code |
| `/design-doctor critique` | UX design review: hierarchy, clarity, emotional resonance |
| `/design-doctor audit` | Run technical quality checks (a11y, performance, responsive) |
| `/design-doctor polish` | Final pass, design system alignment, and shipping readiness |
| `/design-doctor bolder` | Amplify boring designs |
| `/design-doctor quieter` | Tone down overly bold designs |
| `/design-doctor distill` | Strip to essence |
| `/design-doctor harden` | Error handling, i18n, text overflow, edge cases |
| `/design-doctor onboard` | First-run flows, empty states, activation paths |
| `/design-doctor animate` | Add purposeful motion |
| `/design-doctor colorize` | Introduce strategic color |
| `/design-doctor typeset` | Fix font choices, hierarchy, sizing |
| `/design-doctor layout` | Fix layout, spacing, visual rhythm |
| `/design-doctor delight` | Add moments of joy |
| `/design-doctor overdrive` | Add technically extraordinary effects |
| `/design-doctor clarify` | Improve unclear UX copy |
| `/design-doctor adapt` | Adapt for different devices |
| `/design-doctor optimize` | Performance improvements |
| `/design-doctor live` | Visual variant mode: iterate on elements in the browser |

Use `/design-doctor pin <command>` to create standalone shortcuts (e.g., `pin audit` creates `/audit`).

#### Usage Examples

```
/design-doctor audit blog           # Audit blog hub + post pages
/design-doctor critique landing     # UX design review
/design-doctor polish settings      # Final pass before shipping
/design-doctor harden checkout      # Add error handling + edge cases
```

Or use `/design-doctor` directly with a description:
```
/design-doctor redo this hero section
```

### Anti-Patterns

The skill includes explicit guidance on what to avoid:

- Don't use overused fonts (Arial, Inter, system defaults)
- Don't use gray text on colored backgrounds
- Don't use pure black/gray (always tint)
- Don't wrap everything in cards or nest cards inside cards
- Don't use bounce/elastic easing (feels dated)

## Installation

### Option 1: CLI installer (Recommended)

From the root of your project, run:

```bash
npx design-doctor install
```

This shows the harness folders it detected (for example `~/.claude`, `~/.codex`, or project-local `.cursor`), lets you keep the detected set or customize providers, then asks whether to install into the current project or globally. Use `--providers=claude,codex,cursor` and `--scope=project|global` to skip those choices in scripts. On Claude Code, Cursor, and Codex, it also installs the provider-native hook manifest for the current project. Works with Cursor, Claude Code, Gemini CLI, Codex CLI, Grok Build, and every other supported tool. Reload your harness afterward.

To refresh an existing install, run:

```bash
npx design-doctor update
```

Codex users should open `/hooks` after install or update and approve the project hook when prompted. Codex tracks trust by hook definition, so updates that change `.codex/hooks.json` can require approval again.

### Option 2: Git Submodule

For teams that want to keep Design Doctor vendored and updated through Git, add this repo as a submodule and link the compiled provider build into your harness folders:

```bash
git submodule add https://github.com/git-dann/impeccable .design-doctor
npx design-doctor link --source=.design-doctor --providers=claude,cursor
git add .gitmodules .design-doctor .claude .cursor
git commit -m "Add Design Doctor skills"
```

Use the providers your project needs, for example `claude`, `cursor`, `gemini`, `codex`, `github`, `opencode`, `pi`, `qoder`, `trae`, `trae-cn`, or `rovo-dev`. The command links individual skill folders from `.design-doctor/dist/universal/` and leaves existing real skill directories untouched unless you pass `--force`.

To update later:

```bash
git submodule update --remote .design-doctor
npx design-doctor link --source=.design-doctor --providers=claude,cursor
```

### Option 3: Plugin install

**Claude Code:**
```bash
/plugin marketplace add git-dann/impeccable
```

> Claude Code only. After adding the marketplace, open `/plugin` and install Design Doctor from the list.

**Grok Build:**
```bash
grok plugin install git-dann/impeccable --trust
```

> Grok Build only. Then run `/design-doctor init` in a Grok session.

### Option 4: Copy from Repository

**Cursor:**
```bash
cp -r dist/cursor/.cursor your-project/
```

> **Note:** Cursor skills require setup:
> 1. Switch to Nightly channel in Cursor Settings → Beta
> 2. Enable Agent Skills in Cursor Settings → Rules
>
> [Learn more about Cursor skills](https://cursor.com/docs/context/skills)

**Claude Code:**
```bash
# Project-specific
cp -r dist/claude-code/.claude your-project/

# Or global (applies to all projects)
cp -r dist/claude-code/.claude/* ~/.claude/
```

**OpenCode:**
```bash
cp -r dist/opencode/.opencode your-project/
```

**Pi:**
```bash
cp -r dist/pi/.pi your-project/
```

**Gemini CLI:**
```bash
cp -r dist/gemini/.gemini your-project/
```

> **Note:** Gemini CLI skills require setup:
> 1. Install preview version: `npm i -g @google/gemini-cli@preview`
> 2. Run `/settings` and enable "Skills"
> 3. Run `/skills list` to verify installation
>
> [Learn more about Gemini CLI skills](https://geminicli.com/docs/cli/skills/)

**Codex CLI:**
```bash
# Project-local
cp -r dist/agents/.agents your-project/
mkdir -p your-project/.codex
cp dist/codex/.codex/hooks.json your-project/.codex/hooks.json

# Or install the skill user-wide. Copy .codex/hooks.json into each project
# where you want the design hook to run.
mkdir -p ~/.agents/skills
cp -r dist/agents/.agents/skills/* ~/.agents/skills/
```

> The asset-producer subagent ships nested inside the skill's own `agents/` folder, which Codex auto-discovers. No separate `.codex/agents/` copy is needed. The hook is project-local because Codex discovers hooks from `.codex/hooks.json` next to trusted project config.

**GitHub Copilot:**
```bash
cp -r dist/github/.github your-project/
```

**Trae:**
```bash
# Trae China (domestic version)
cp -r dist/trae/.trae-cn/skills/* ~/.trae-cn/skills/

# Trae International
cp -r dist/trae/.trae/skills/* ~/.trae/skills/
```

> **Note:** Trae has two versions with different config directories:
> - **Trae China**: `~/.trae-cn/skills/`
> - **Trae International**: `~/.trae/skills/`
>
> After copying, restart Trae IDE to activate the skills.

**Rovo Dev:**
```bash
# Project-specific
cp -r dist/rovo-dev/.rovodev your-project/

# Or global (applies to all projects)
cp -r dist/rovo-dev/.rovodev/skills/* ~/.rovodev/skills/
```

**Qoder:**
```bash
# Project-specific
cp -r dist/qoder/.qoder your-project/

# Or global (applies to all projects)
cp -r dist/qoder/.qoder/skills/* ~/.qoder/skills/
```

## Usage

Once installed, every command runs through the single `/design-doctor` skill:

```
/design-doctor audit        # Find issues
/design-doctor polish       # Final cleanup
/design-doctor distill      # Remove complexity
/design-doctor critique     # Full design review
```

Type `/design-doctor` alone to see the full command list.

Most commands accept an optional argument to focus on a specific area:

```
/design-doctor audit the header
/design-doctor polish the checkout form
```

If you reach for one command often, pin it with `/design-doctor pin audit` to get `/audit` as a standalone shortcut.

**Note:** Codex uses skills here, not `/prompts:` commands. Open `/skills` or type `$design-doctor`. Repo-local installs live in `.agents/skills/`; user-wide installs live in `~/.agents/skills/`. GitHub Copilot uses `.github/skills/`. Restart the tool if a newly installed skill does not appear.

## Keeping `.design-doctor` out of git

As you run commands, Design Doctor writes working files under `.design-doctor/`: critique and polish screenshots, live-mode session and preview state, runtime caches, and per-developer config. Most of it is ephemeral and should not be committed, while a few files are shared project artifacts that belong in the repo. Add this block to your project's `.gitignore`:

```gitignore
# design-doctor-ignore-start
# Ephemeral output, runtime state, and per-dev overrides.
# Unanchored: .design-doctor may sit at the repo root or under a nested
# workspace (apps/web/.design-doctor/...); anchored patterns would miss it.
# Shared artifacts stay tracked: config.json, live/config.json,
# design.json, critique/*.md.
.design-doctor/config.local.json
.design-doctor/hook.cache.json
.design-doctor/hook.pending.json
.design-doctor/*.png
.design-doctor/live/server.json
.design-doctor/live/sessions/
.design-doctor/live/previews/
.design-doctor/live/annotations/
.design-doctor/live/cache/
.design-doctor/live/manual-edit-apply-transaction.json
.design-doctor/live/manual-edit-events.jsonl
.design-doctor/live/manual-edit-evidence/
.design-doctor/live/pending-manual-edits.json
.design-doctor/live/deferred-svelte-component-accepts.json
.design-doctor/live/*.png
# design-doctor-ignore-end
```

The block is wrapped in `# design-doctor-ignore-start` / `# design-doctor-ignore-end` markers so you can recognize and refresh it later. Patterns are unanchored on purpose: in a monorepo the active project (and its `.design-doctor/` directory) often lives under a nested workspace path like `apps/web/`, and a root-anchored pattern would miss it.

**Keep these tracked** (they are shared project artifacts, do not add them to `.gitignore`):

- `.design-doctor/config.json` (unified shared config)
- `.design-doctor/live/config.json` (live-mode framework wiring)
- `.design-doctor/design.json` (shared design spec)
- `.design-doctor/critique/*.md` (review reports)

If an ephemeral file (a screenshot, `config.local.json`) was committed before you added the block, `.gitignore` will not untrack it automatically. Run `git rm --cached <path>` to stop tracking it without deleting your local copy.

## Design hook

On Claude Code, GitHub Copilot, Codex, and Cursor, `npx design-doctor install` and `npx design-doctor update` install a provider-native hook manifest along with the skill payload. The hook runs the Design Doctor design detector on direct UI file edits and surfaces findings back into the agent flow. Claude Code, GitHub Copilot, and Codex surface findings after the edit. Cursor blocks bad proposed writes before they land.

Installed hook surfaces:

- Claude Code: `.claude/settings.local.json` (gitignored, machine-local) runs `${CLAUDE_PROJECT_DIR}/.claude/skills/design-doctor/scripts/hook.mjs`. A hook moved into the shared `settings.json` is honored in place.
- GitHub Copilot: `.github/hooks/design-doctor.json` (committed, shared by the Copilot CLI and the cloud agent) runs `.github/skills/design-doctor/scripts/hook.mjs`. The Copilot CLI activates it once the file is on the repository's default branch and the folder is trusted.
- Cursor: `.cursor/hooks.json` runs `.cursor/skills/design-doctor/scripts/hook-before-edit.mjs`.
- Codex: `.codex/hooks.json` runs `.agents/skills/design-doctor/scripts/hook.mjs`.

The installer preserves unrelated hook entries and settings. If a hook manifest is malformed, install/update aborts by default; rerun with `--force` to back up the malformed file as `.bak` and replace it.

On an interactive `install`/`update`, Design Doctor explains the hook and offers to install it (default yes). Your choice is remembered per-developer in the gitignored `.design-doctor/config.local.json`, so you are not asked again; `--no-hooks` skips it for that run without recording anything. Hook lifecycle settings live under the `hook` key of `.design-doctor/config.json`; detector ignores live under `detector`, shared by `/design-doctor hooks` and `npx design-doctor detect`.

For debugging, set `hook.auditLog` in `.design-doctor/config.json` to a path (or the legacy `DESIGN_DOCTOR_HOOK_LOG` env var) to write one NDJSON line per hook invocation. Leave it unset for normal use.

Codex requires one platform step that Design Doctor cannot safely skip: open `/hooks` after install or update and approve the project hook. There is no Codex marketplace/plugin install flow for this hook.

Manual copy commands are fallback/debug instructions. The normal path is:

```bash
npx design-doctor install
npx design-doctor update
```

## CLI

Design Doctor includes a standalone CLI for detecting anti-patterns without an AI harness:

```bash
npx design-doctor detect src/                   # scan a directory
npx design-doctor detect index.html             # scan an HTML file
npx design-doctor detect https://example.com    # scan a URL (Puppeteer)
npx design-doctor detect --json .               # CI-friendly JSON output
npx design-doctor detect --no-config src/       # raw scan, ignoring project config/context
npx design-doctor ignores list                  # show detector ignores
npx design-doctor ignores add-file "src/legacy/**"
npx design-doctor ignores add-value overused-font Inter --reason "Brand font"
```

The detector catches 46 deterministic issues across AI slop (side-tab borders, purple gradients, bounce easing, dark glows) and general design quality (line length, cramped padding, small touch targets, skipped headings, and more).

By default, `detect` respects the same `.design-doctor/config.json` and `.design-doctor/config.local.json` detector config as the design hook: `detector.ignoreRules`, `detector.ignoreFiles`, `detector.ignoreValues`, and `detector.designSystem.enabled`. Hook lifecycle settings such as `hook.enabled` only affect automatic hook execution.

For a waiver that should travel with one file instead of the repo config, add an inline comment in the file: `<!-- design-doctor-disable overused-font: exported brand doc -->`. The marker works in any comment syntax, scopes to the whole file (or one line with `design-doctor-disable-line` / `design-doctor-disable-next-line`), and is bypassed by `--no-inline-ignores` or `--no-config`.

## Supported Tools

- [Cursor](https://cursor.com)
- [Claude Code](https://claude.ai/code)
- [GitHub Copilot](https://github.com/features/copilot)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Codex CLI](https://github.com/openai/codex)
- [Grok Build](https://x.ai/cli)
- [OpenCode](https://opencode.ai)
- [Pi](https://pi.dev)
- [Kiro](https://kiro.dev)
- [Trae](https://trae.ai)
- [Rovo Dev](https://www.atlassian.com/software/rovo)
- [Qoder](https://qoder.com)

## Contributing

See [DEVELOP.md](docs/DEVELOP.md) for contributor guidelines and build instructions.

## License

Apache 2.0. See [LICENSE](LICENSE).

---

Built by Gitwork
