import { Hono } from 'hono';
import type { Env } from './types';
import { authMiddleware } from './auth';
import { fail } from './response';
import authRoutes from './routes/auth';
import groupRoutes from './routes/groups';
import accountRoutes from './routes/accounts';
import emailRoutes from './routes/emails';
import settingRoutes from './routes/settings';
import tempEmailRoutes from './routes/tempEmails';
import oauthRoutes from './routes/oauth';
import externalRoutes from './routes/external';

const app = new Hono<{ Bindings: Env }>();

// Global error handler: turn opaque 500s into actionable JSON so the frontend
// can surface a real message (and so misconfigured deployments self-explain).
app.onError((err, c) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('Unhandled error:', msg);

  // Most common deploy mistake: remote D1 not migrated → tables missing
  if (/no such table|D1_ERROR|no such column|not authorized/i.test(msg)) {
    return fail(
      'DB_NOT_READY',
      '数据库未就绪：远程库可能没迁移。请运行 wrangler d1 migrations apply outlook-email-db --remote',
      500
    );
  }
  // Web Crypto throws when COOKIE_SECRET is empty/unset
  if (/key|HMAC|crypto|importKey/i.test(msg)) {
    return fail(
      'CONFIG_MISSING',
      '服务端密钥未配置：请用 wrangler secret put 设置 COOKIE_SECRET（和 ADMIN_PASSWORD）',
      500
    );
  }
  return fail('INTERNAL_ERROR', '服务器内部错误，请检查部署配置（数据库迁移 / Secrets）', 500);
});

// Auth routes (no middleware)
app.route('/api/auth', authRoutes);

// OAuth callback (no auth middleware - handles redirect from Microsoft)
app.route('/api/oauth', oauthRoutes);

// External API (no cookie auth - uses its own API-key check)
app.route('/api/external', externalRoutes);

// Protected API routes
app.use('/api/*', authMiddleware());
app.route('/api/groups', groupRoutes);
app.route('/api/accounts', accountRoutes);
app.route('/api/accounts/:id/emails', emailRoutes);
app.route('/api/settings', settingRoutes);
app.route('/api/temp-emails', tempEmailRoutes);

export default app;
