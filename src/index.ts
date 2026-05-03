import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { loggerMiddleware } from './middleware/appToken';
import { originGuard } from './middleware/originGuard';
import userRoutes from './app/user/route/user.route';
import roleRoutes from './app/role/route/role.route';
import jurusanRoutes from './app/jurusan/route/jurusan.route';
import mahasiswaRoutes from './app/mahasiswa/route/mahasiswa.route';
import dosenRoutes from './app/dosen/route/dosen.route';
import instansiRoutes from './app/instansi/route/instansi.route';
import instansiPenilaiRoutes from './app/instansi_penilai/route/instansi-penilai.route';
import kklPeriodeRoutes from './app/kkl_periode/route/kkl-periode.route';
import kklKlpRoutes from './app/kkl_klp/route/kkl-klp.route';
import kklAgtRoutes from './app/kkl_agt/route/kkl-agt.route';
import penilaianRoutes from './app/penilaian/route/penilaian.route';
import laporanRoutes from './app/laporan/route/laporan.route';
import menuRoutes from './app/menu/route/menu.route';
import rolePermissionRoutes from './app/role_permission/route/role-permission.route';
import uploadRoutes from './app/upload/route/upload.route';
import {
  createOpenApiDocument,
  getServerUrl,
  renderScalarReference,
} from './docs/openapi';

const app = new Hono();
const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.ALLOWED_APP_URL ?? "")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// Global Middleware
app.use(cors({
  origin: (origin) => {
    if (!origin) {
      return "";
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.length === 0) {
      return normalizedOrigin;
    }

    return allowedOrigins.includes(normalizedOrigin) ? normalizedOrigin : "";
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-App-Token'],
  credentials: true,
}));

app.use('*', originGuard);
app.use(logger());
app.use(loggerMiddleware);

// Welcome endpoint (Public)
app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Hono Backend Starter API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (Public)
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// OpenAPI and Scalar reference (Public)
app.get('/openapi.json', (c) => {
  const baseUrl = getServerUrl(c.req.url);
  return c.json(createOpenApiDocument(baseUrl));
});

app.get('/docs', (c) => {
  return c.html(renderScalarReference('/openapi.json'));
});

// API Routes - Feature based
// Note: User routes have public login endpoint, others require JWT
app.route('/api/users', userRoutes);
app.route('/api/roles', roleRoutes);
app.route('/api/jurusans', jurusanRoutes);
app.route('/api/mahasiswas', mahasiswaRoutes);
app.route('/api/dosens', dosenRoutes);
app.route('/api/instansis', instansiRoutes);
app.route('/api/instansi-penilais', instansiPenilaiRoutes);
app.route('/api/kkl-periodes', kklPeriodeRoutes);
app.route('/api/kkl-klps', kklKlpRoutes);
app.route('/api/kkl-agts', kklAgtRoutes);
app.route('/api/penilaians', penilaianRoutes);
app.route('/api/laporans', laporanRoutes);
app.route('/api/menus', menuRoutes);
app.route('/api/role-permissions', rolePermissionRoutes);
app.route('/api/uploads', uploadRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Route not found',
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('[Error]', err);
  return c.json({
    success: false,
    message: err.message || 'Internal server error',
  }, 500);
});

export default app;
