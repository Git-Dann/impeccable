# Changelog

Entries are grouped by component and version. Before cutting a release with
`node scripts/release.mjs <skill|cli|extension>`, add a matching
`## {label} v{version}` section here (`v{version}` for skill, `CLI v{version}`
for cli, `Extension v{version}` for extension) — the script refuses to
tag/publish without one. Bullets use `- **Headline.** Body text.`; the bold
lead is pulled out for the release tweet, the rest is release-notes-only.

## v3.9.1
- **Rebranded to Design Doctor.** Forked from the original Impeccable project as a Gitwork-owned tool — renamed throughout the skill, CLI, and browser extension, removed the marketing site and its Cloudflare Pages functions, and repointed distribution (install/update, the OpenAI/Codex plugin listing, and the GitHub sheriff bot) off Impeccable's infrastructure and identity.

## CLI v3.2.1
- **Rebranded to Design Doctor.** `design-doctor skills install`/`update` and `help` now pull the universal bundle and command list from this fork's own GitHub releases instead of the original project's server; the daily update-check is disabled by default until a Gitwork-hosted endpoint exists.

## Extension v1.2.1
- **Rebranded to Design Doctor.** Extension identifiers, manifest, popup, and store listing renamed to Design Doctor / Gitwork.
