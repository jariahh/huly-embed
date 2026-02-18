require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

const VALID_COMPONENTS = ['create-issue', 'issue-list', 'issue-detail', 'kanban', 'comments'];

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
}));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get('/api/huly/embed-token', (req, res) => {
  const { component } = req.query;

  if (!component || !VALID_COMPONENTS.includes(component)) {
    return res.status(400).json({
      error: `Invalid component. Must be one of: ${VALID_COMPONENTS.join(', ')}`,
    });
  }

  const { HULY_SERVER_SECRET, HULY_WORKSPACE_UUID, HULY_ACCOUNT_UUID } = process.env;

  if (!HULY_SERVER_SECRET || !HULY_WORKSPACE_UUID || !HULY_ACCOUNT_UUID) {
    return res.status(500).json({ error: 'Server not configured. Check .env file.' });
  }

  const token = jwt.sign(
    {
      account: HULY_ACCOUNT_UUID,
      workspace: HULY_WORKSPACE_UUID,
      extra: { service: 'alchemy-embed' },
    },
    HULY_SERVER_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, expiresIn: 3600 });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Huly embed API server running on http://localhost:${port}`);
  console.log(`Token endpoint: http://localhost:${port}/api/huly/embed-token`);
});
