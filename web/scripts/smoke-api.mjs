#!/usr/bin/env node
// Simple smoke-test script for the PHP REST API.
// Usage:
//   node scripts/smoke-api.mjs --base http://127.0.0.1:8000/backend/api
// or set env SMOKE_BASE.

const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] ?? null;
}

const base = process.env.SMOKE_BASE || arg('--base') || 'http://127.0.0.1:8000/backend/api';

async function fetchJson(path, opts = {}) {
  const url = `${base}/${path}`.replace(/([^:]\/)\//g, '$1');
  try {
    const res = await fetch(url, { credentials: 'include', ...opts });
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }
    return { ok: res.ok, status: res.status, body: json };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function run() {
  console.log('API base:', base);
  const endpoints = [
    'heartbeat.php',
    'me.php',
    'quiz.php',
    'friends.php?maxItems=5',
    'profile.php',
  ];

  for (const ep of endpoints) {
    process.stdout.write(`Checking ${ep} ... `);
    const r = await fetchJson(ep);
    if (r.ok) {
      console.log('OK', r.status);
    } else {
      console.log('FAIL', r.status ?? '', r.error ?? r.body ?? '');
    }
  }
}

run();
