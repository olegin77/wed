#!/usr/bin/env node
const { execSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

function resolveRepo() {
  const fallback = process.env.GITHUB_REPOSITORY || 'wed/wed';
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    if (!remote) {
      console.warn('origin remote empty, falling back to %s', fallback);
      return fallback;
    }
    if (remote.startsWith('https://github.com/')) {
      return remote.slice('https://github.com/'.length).replace(/\.git$/, '');
    }
    if (remote.startsWith('git@github.com:')) {
      return remote.slice('git@github.com:'.length).replace(/\.git$/, '');
    }
    console.warn('origin remote %s not recognized, falling back to %s', remote, fallback);
    return fallback;
  } catch (error) {
    console.warn('unable to read origin remote (%s), falling back to %s', error.message || error, fallback);
    return fallback;
  }
}

const repo = resolveRepo();
const spec = `name: weddingtech-uz
services:
  - name: svc-website
    github:
      repo: ${repo}
      branch: main
      deploy_on_push: true
      source_dir: apps/svc-website
    http_port: 8080
    run_command: "pnpm start:migrate"
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
  - name: svc-enquiries
    github:
      repo: ${repo}
      branch: main
      deploy_on_push: true
      source_dir: apps/svc-enquiries
    http_port: 8080
    run_command: "pnpm start:migrate"
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
`;

const outDir = path.join('infra', 'do');
mkdirSync(outDir, { recursive: true });
const target = path.join(outDir, 'app.yaml');
writeFileSync(target, spec, 'utf8');
console.log(`Generated ${target} for repo ${repo}`);
