# Design Doctor CLI

Detect UI anti-patterns and design quality issues from the command line. Scans HTML, CSS, JSX, TSX, Vue, and Svelte files for 46 deterministic rules, including AI-generated UI tells, accessibility violations, and general design quality problems.

## Quick Start

```bash
# Install skills into your AI harness (Claude, Cursor, Gemini, etc.)
npx design-doctor skills install

# Non-interactive install for a specific scope
npx design-doctor skills install -y --providers=claude,codex --scope=project

# First command to run inside your AI harness
/design-doctor init

# Update skills to the latest version
npx design-doctor skills update

# Install or update skills without hook manifests
npx design-doctor skills install --no-hooks

# Link skills from a Git submodule checkout
npx design-doctor skills link --source=.design-doctor --providers=claude,cursor

# List all available commands
npx design-doctor skills help

# Scan files or directories for anti-patterns
npx design-doctor detect src/

# Scan a live URL (requires Puppeteer)
npx design-doctor detect https://example.com

# JSON output for CI/tooling
npx design-doctor detect --json src/

# Deprecated compatibility flag; full scan still runs
npx design-doctor detect --fast src/
```

## What It Detects

**AI Slop Tells**: patterns that scream "AI generated this":
- Side-tab accent borders, gradient text on headings
- Purple/violet gradients and cyan-on-dark palettes
- Dark mode with glowing accents, border + border-radius clashes

**Typography Issues**: overused fonts (Inter, Roboto), flat type hierarchy, single font families

**Color & Contrast**: WCAG AA violations, gray text on colored backgrounds, pure black/white

**Layout & Composition**: nested cards, monotonous spacing, everything-centered layouts

**Motion**: bounce/elastic easing, layout property transitions

**Quality**: tiny body text, cramped padding, long line lengths, small touch targets

46 deterministic detector rules in total.

## Exit Codes

- `0`: no issues found
- `2`: anti-patterns detected

## Options

```
design-doctor detect [options] [file-or-dir-or-url...]

  --fast    Regex-only mode (skip jsdom, faster but less accurate)
  --json    Output findings as JSON
  --help    Show help
```

## Requirements

- Node.js 22.12+
- `jsdom` (included as dependency, used for HTML scanning)
- `puppeteer` (optional, only needed for URL scanning)

## Part of Design Doctor

This CLI is part of Design Doctor, a cross-provider design skill pack for AI-powered development tools, built by Gitwork. The full suite includes 23 commands for Claude, Cursor, GitHub Copilot, Gemini, Codex, and more.

## License

[Apache 2.0](https://github.com/git-dann/impeccable/blob/main/LICENSE)
