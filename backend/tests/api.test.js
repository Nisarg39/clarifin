const http = require('http');
const app = require('../index');

const BASE_URL = 'http://localhost:5001';
let passed = 0;
let failed = 0;

function assert(label, condition, actual) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label} — got: ${JSON.stringify(actual)}`);
    failed++;
  }
}

async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const body = await res.json();
  return { status: res.status, body };
}

async function runTests() {
  console.log('\nRunning API tests...\n');

  // User routes
  console.log('GET /api/v1/user');
  const user = await get('/api/v1/user');
  assert('status 200', user.status === 200, user.status);
  assert('success: true', user.body.success === true, user.body);
  assert('returns message field', typeof user.body.message === 'string', user.body);
  assert('message = "User API operational"', user.body.message === 'User API operational', user.body.message);

  // Admin routes
  console.log('\nGET /api/v1/admin');
  const admin = await get('/api/v1/admin');
  assert('status 200', admin.status === 200, admin.status);
  assert('success: true', admin.body.success === true, admin.body);
  assert('returns message field', typeof admin.body.message === 'string', admin.body);
  assert('message = "Admin API operational"', admin.body.message === 'Admin API operational', admin.body.message);

  // Unknown route → 404 JSON
  console.log('\nGET /api/v1/unknown');
  const unknown = await get('/api/v1/unknown');
  assert('status 404', unknown.status === 404, unknown.status);
  assert('success: false', unknown.body.success === false, unknown.body);

  console.log(`\n${passed} passed, ${failed} failed\n`);
  app.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test runner error:', err.message);
  process.exit(1);
});
