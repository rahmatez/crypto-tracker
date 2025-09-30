#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const shouldSkip = () => {
  const skipFlags = [];

  const skipEnv = process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD;
  if (skipEnv && skipEnv.toLowerCase() !== '0' && skipEnv.toLowerCase() !== 'false') {
    skipFlags.push('PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD');
  }

  if (process.env.VERCEL === '1' || process.env.VERCEL === 'true') {
    skipFlags.push('VERCEL');
  }

  if (!skipFlags.length) {
    return { skip: false };
  }

  return {
    skip: true,
    reason: `Skipping Playwright browser download (${skipFlags.join(', ')})`
  };
};

const { skip, reason } = shouldSkip();

if (skip) {
  console.log(reason);
  process.exit(0);
}

const args = ['exec', 'playwright', 'install', '--with-deps'];
let result;

if (process.env.npm_execpath && process.env.npm_execpath.includes('pnpm')) {
  result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], {
    stdio: 'inherit',
    env: process.env
  });
} else {
  const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  result = spawnSync(pnpmBin, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env
  });
}

if (result.error) {
  console.error('Failed to launch Playwright install process:', result.error);
  process.exit(result.status ?? 1);
}

process.exit(result.status ?? 0);
