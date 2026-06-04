#!/usr/bin/env node
import http from 'http';
import { URL } from 'url';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

function json(res, body, status = 200) {
  const s = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(s),
  });
  res.end(s);
}

function handleOptions(res) {
  res.writeHead(204);
  res.end();
}

function sampleUser(id = 'user_1') {
  return {
    id,
    email: `${id}@example.com`,
    fullName: 'Test User',
    displayName: 'Test',
    username: 'testuser',
    phone: '03001234567',
    city: 'Karachi',
    gender: 'male',
    level: 1,
    xp: 0,
    streak: 0,
    balance: 100,
    totalEarned: 100,
    pending: 0,
    referralCode: 'ABC123',
    role: 'USER',
    isAdmin: false,
    joinedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    avatarUrl: null,
  };
}

// In-memory user store for simulated state changes
const users = new Map();
users.set('user_1', sampleUser('user_1'));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const path = url.pathname.replace(/\/+$/, '');

  // Set CORS headers per-request and echo Origin for credentialed requests
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return handleOptions(res);

  // Support mounting under /backend/api
  const apiPrefix = '/backend/api';
  let route = path;
  if (path.startsWith(apiPrefix)) route = path.slice(apiPrefix.length) || '/';

  // Normalize
  route = route.replace(/^\//, '');

  if (route === 'heartbeat.php' || route === '') {
    return json(res, { ok: true });
  }

  if (route === 'me.php') {
    // Simulate an authenticated user for UI flows.
    return json(res, { ok: true, user: sampleUser('user_1') });
  }

  if (route === 'quiz.php') {
    return json(res, {
      ok: true,
      attempted: false,
      question: {
        id: 'q1',
        category: 'GENERAL',
        question: 'What is 1+1?',
        options: ['1', '2', '3', '4'],
        correctIndex: 1,
        explanation: 'Basic math',
      },
    });
  }

  if (route === 'quiz-submit.php') {
    // read body
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const data = JSON.parse(body || '{}');
      const picked = Number(data.pickedIndex ?? data.picked ?? -1);
      const correctIndex = 1;
      const correct = picked === correctIndex;
      const reward = correct ? 30 : 0;
      const u = users.get('user_1');
      if (u && reward > 0) {
        u.balance = (u.balance || 0) + reward;
        u.totalEarned = (u.totalEarned || 0) + reward;
      }
      return json(res, {
        ok: true,
        correct,
        reward,
        correctIndex,
        newBalance: u ? u.balance : 0,
      });
    } catch (e) {
      return json(res, { ok: false, error: 'invalid_body' }, 400);
    }
  }

  if (route === 'finance.php') {
    const u = users.get('user_1');
    return json(res, {
      ok: true,
      totals: {
        balance: u ? u.balance : 0,
        pending: u ? u.pending : 0,
        totalEarned: u ? u.totalEarned : 0,
      },
      transactions: [],
    });
  }

  if (route.startsWith('friends.php')) {
    const users = [sampleUser('user_2'), sampleUser('user_3')];
    return json(res, { ok: true, users });
  }

  if (route === 'profile.php') {
    if (req.method === 'POST') return json(res, { ok: true });
    return json(res, { ok: true, profile: sampleUser() });
  }

  if (route === 'login.php' || route === 'signup.php') {
    return json(res, { ok: true, kind: 'existing', user: sampleUser('user_1') });
  }

  // Default 404
  json(res, { ok: false, error: 'not_found' }, 404);
});

server.listen(port, () => {
  console.log(`Mock API server listening on http://127.0.0.1:${port}`);
  console.log('Mount your API base at /backend/api');
});
