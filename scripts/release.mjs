#!/usr/bin/env node
// Tags and publishes a GitHub release for one of three independently versioned
// components: skill, cli, extension.
//
// Usage: node scripts/release.mjs <skill|cli|extension> [--dry-run]
//
// Refuses on a dirty tree, an unpushed HEAD, or a missing changelog entry.
// For the skill component, also reruns `bun run build:release` and refuses if the
// regenerated harness directories drift from what is committed.

import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const COMPONENTS = {
  skill: {
    manifest: '.claude-plugin/plugin.json',
    sibling: '.claude-plugin/marketplace.json',
    siblingVersion: (m) => m.plugins?.[0]?.version,
    tagPrefix: 'skill-v',
    label: 'Skill',
    changelogLabel: 'v',
    buildCmd: 'bun run build:release',
    artifacts: ['dist/universal.zip'],
    postReleaseHint: null,
    tweetHeader: (v) => `Design Doctor v${v} is out.`,
    tweetCta: 'Install / update: npx design-doctor install',
  },
  cli: {
    manifest: 'package.json',
    tagPrefix: 'cli-v',
    label: 'CLI',
    changelogLabel: 'CLI v',
    buildCmd: null,
    artifacts: [],
    postReleaseHint: 'Run `npm publish` next to push the package to the npm registry.',
    tweetHeader: (v) => `Design Doctor CLI v${v} is out.`,
    tweetCta: 'npm i -g design-doctor',
  },
  extension: {
    manifest: 'extension/manifest.json',
    tagPrefix: 'ext-v',
    label: 'Extension',
    changelogLabel: 'Extension v',
    buildCmd: 'bun run build:extension',
    artifacts: ['dist/extension.zip', 'dist/extension-firefox.zip'],
    postReleaseHint:
      'Upload `dist/extension.zip` to the Chrome Web Store dashboard, and `dist/extension-firefox.zip` to addons.mozilla.org (AMO), to publish.',
    tweetHeader: (v) => `Design Doctor browser extension v${v} is out.`,
    tweetCta: null,
  },
};

const REPO_URL = 'https://github.com/git-dann/impeccable';
const TWEET_LIMIT = 280;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const component = args.find((a) => !a.startsWith('--'));

if (!component || !COMPONENTS[component]) {
  console.error('usage: release.mjs <skill|cli|extension> [--dry-run]');
  process.exit(1);
}
const cfg = COMPONENTS[component];

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}
function ok(msg) {
  console.log(`✓ ${msg}`);
}
function step(msg) {
  console.log(`\n→ ${msg}`);
}
function run(cmd) {
  return execSync(cmd, { cwd: repoRoot, encoding: 'utf8' }).trim();
}
function runMutating(cmd) {
  if (dryRun) {
    console.log(`  [dry-run] ${cmd}`);
    return;
  }
  execSync(cmd, { cwd: repoRoot, stdio: 'inherit' });
}

step(`Reading version from ${cfg.manifest}`);
const manifest = JSON.parse(readFileSync(path.join(repoRoot, cfg.manifest), 'utf8'));
const version = manifest.version;
if (!version) fail(`No version field in ${cfg.manifest}`);
ok(`${cfg.label} ${version}`);

if (cfg.sibling) {
  const sibling = JSON.parse(readFileSync(path.join(repoRoot, cfg.sibling), 'utf8'));
  const siblingVersion = cfg.siblingVersion(sibling);
  if (siblingVersion !== version) {
    fail(`${cfg.manifest} (${version}) and ${cfg.sibling} (${siblingVersion}) disagree. Bump both.`);
  }
  ok(`${cfg.sibling} agrees`);
}

const tag = `${cfg.tagPrefix}${version}`;

step('Checking working tree is clean');
const status = run('git status --porcelain');
if (status) fail(`Working tree is dirty. Commit or stash first:\n${status}`);
ok('clean');

if (cfg.buildCmd) {
  step(`Rebuilding outputs (${cfg.buildCmd})`);
  if (dryRun) {
    console.log(`  [dry-run] ${cfg.buildCmd}`);
  } else {
    execSync(cfg.buildCmd, { cwd: repoRoot, stdio: 'inherit' });
    const postBuild = run('git status --porcelain');
    if (postBuild) {
      fail(`Build produced uncommitted changes. Run \`${cfg.buildCmd}\`, commit the result, then re-run.\n${postBuild}`);
    }
    ok('build outputs match source');
  }
}

step('Checking HEAD is pushed to origin');
const branch = run('git rev-parse --abbrev-ref HEAD');
const head = run('git rev-parse HEAD');
let remoteHead;
try {
  remoteHead = run(`git rev-parse origin/${branch}`);
} catch {
  fail(`No tracking branch origin/${branch}. Push first.`);
}
if (head !== remoteHead) fail(`HEAD is ahead of origin/${branch}. Push your commits first.`);
ok(`origin/${branch} matches HEAD`);

step(`Verifying tag ${tag} does not already exist`);
let localTagExists = false;
try {
  run(`git rev-parse -q --verify "refs/tags/${tag}"`);
  localTagExists = true;
} catch {}
if (localTagExists) fail(`Tag ${tag} already exists locally.`);
const remoteTags = run('git ls-remote --tags origin');
if (remoteTags.split('\n').some((line) => line.endsWith(`refs/tags/${tag}`))) {
  fail(`Tag ${tag} already exists on origin.`);
}
ok('tag is free');

step(`Extracting changelog entry for "${cfg.changelogLabel}${version}"`);
const changelogSource = path.join(repoRoot, 'CHANGELOG.md');
if (!existsSync(changelogSource)) fail('CHANGELOG.md not found at repo root.');
const changelogText = readFileSync(changelogSource, 'utf8');
// Entries are plain markdown sections: `## {changelogLabel}{version}` followed
// by `- **Headline.** body` bullets, ending at the next `## ` heading or EOF.
const headingRe = new RegExp(`^## ${escapeRegExp(cfg.changelogLabel + version)}\\s*$`, 'm');
const headingMatch = headingRe.exec(changelogText);
if (!headingMatch) {
  fail(`No changelog entry found for "${cfg.changelogLabel}${version}" in CHANGELOG.md. Add a "## ${cfg.changelogLabel}${version}" section before releasing.`);
}
const bodyStart = headingMatch.index + headingMatch[0].length;
const rest = changelogText.slice(bodyStart);
const nextHeadingMatch = /^## /m.exec(rest);
const bodyEnd = nextHeadingMatch ? bodyStart + nextHeadingMatch.index : changelogText.length;
const notes = changelogText.slice(bodyStart, bodyEnd).trim();
if (!notes) fail('Changelog entry is empty.');
ok('extracted');

step('Verifying release artifacts exist');
for (const artifact of cfg.artifacts) {
  const abs = path.join(repoRoot, artifact);
  if (!existsSync(abs)) fail(`Missing artifact: ${artifact}`);
  ok(artifact);
}

console.log('\n--- Release notes preview ---');
console.log(notes);
console.log('--- end preview ---\n');

step(`Creating annotated tag ${tag}`);
const tagMessageFile = path.join(repoRoot, '.release-tag-msg.tmp');
const releaseNotesFile = path.join(repoRoot, '.release-notes.tmp.md');
if (!dryRun) {
  writeFileSync(tagMessageFile, `${cfg.label} ${version}\n\n${notes}\n`);
  writeFileSync(releaseNotesFile, notes);
}
try {
  runMutating(`git tag -a ${tag} -F "${tagMessageFile}"`);
  runMutating(`git push origin ${tag}`);

  step(`Creating GitHub release ${tag}`);
  const artifactArgs = cfg.artifacts.map((a) => `"${a}"`).join(' ');
  const title = `${cfg.label} ${version}`;
  runMutating(
    `gh release create ${tag} --title "${title}" --notes-file "${releaseNotesFile}"${artifactArgs ? ' ' + artifactArgs : ''}`
  );

} finally {
  if (!dryRun) {
    try { unlinkSync(tagMessageFile); } catch {}
    try { unlinkSync(releaseNotesFile); } catch {}
  }
}

console.log(`\n✓ ${cfg.label} ${version} released as ${tag}`);
if (cfg.postReleaseHint) {
  console.log(`\n→ Next step: ${cfg.postReleaseHint}`);
}

const tweet = renderTweet(cfg, version, notes, tag);
console.log(`\n--- Tweet (${tweet.length}/${TWEET_LIMIT} chars) for @design_doctor_ai ---`);
console.log(tweet);
console.log('--- end tweet ---');

// Pull the bold lead text from each changelog bullet. Each bullet reads
// "- **Headline.** Body...", so the bold text alone is a tweet-grade
// summary. Returns a list ordered by appearance.
function extractHighlights(notes) {
  const highlights = [];
  const bulletRe = /^-\s+\*\*(.+?)\*\*/gm;
  let match;
  while ((match = bulletRe.exec(notes))) {
    const text = match[1].replace(/\s+/g, ' ').replace(/[.!?]+\s*$/, '').trim();
    if (text) highlights.push(text);
  }
  return highlights;
}

function renderTweet(cfg, version, notes, tag) {
  const releaseUrl = `${REPO_URL}/releases/tag/${tag}`;
  const header = cfg.tweetHeader(version);
  const highlights = extractHighlights(notes);
  const tail = [cfg.tweetCta, releaseUrl].filter(Boolean).join('\n');

  // Greedy: include as many highlights as fit. Always include the URL.
  let bullets = '';
  const bulletPrefix = '• ';
  for (const h of highlights) {
    const candidate = bullets + bulletPrefix + h + '\n';
    const draft = [header, '', candidate.trimEnd(), '', tail].join('\n');
    if (draft.length > TWEET_LIMIT) break;
    bullets = candidate;
  }

  // Fallback if even the first highlight overflows: drop bullets entirely.
  if (!bullets) {
    return [header, '', tail].join('\n');
  }
  return [header, '', bullets.trimEnd(), '', tail].join('\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
