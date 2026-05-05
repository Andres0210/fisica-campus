# Despliegue final

## Arquitectura objetivo

- `fisica-campus` -> frontend en `Vercel`
- `fisica-campus-backend` -> backend en `Google Cloud Run`
- `Supabase Postgres` -> base de datos
- `Supabase Storage` -> videos y PDFs

## 1. Frontend en Vercel

### Variables

Configura en Vercel:

```env
AUTH_SECRET=un-secreto-largo-y-seguro
TEACHER_NAME=Dra. Laura Mendoza
TEACHER_EMAIL=laura.mendoza@universidad.edu
TEACHER_PASSWORD=una-clave-segura
NEXT_PUBLIC_API_BASE_URL=https://tu-backend.run.app/api
```

### Configuracion

- Framework: `Next.js`
- Root Directory: `.`
- Build Command: `npm run build`

## 2. Backend en Google Cloud Run

### Variables

Configura en Cloud Run:

```env
PORT=8080
DATABASE_URL=postgresql://...
FRONTEND_URL=https://tu-frontend.vercel.app
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-dominio.com
TEACHER_NAME=Dra. Laura Mendoza
TEACHER_EMAIL=laura.mendoza@universidad.edu
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_STORAGE_BUCKET=fisica-campus-assets
```

### Build local del contenedor

```bash
cd fisica-campus-backend
npm run docker:build
```

El backend ya incluye:

- Dockerfile multi-stage
- Prisma generate en build
- `prisma migrate deploy` al arrancar
- soporte de CORS para multiples origenes

## 3. Base de datos y archivos

### Supabase Postgres

- usa la cadena completa en `DATABASE_URL`
- confirma que Prisma pueda ejecutar `migrate deploy`

### Supabase Storage

- usa un bucket publico, por ejemplo `fisica-campus-assets`
- el backend puede intentar crearlo automaticamente si no existe

## 4. Orden recomendado

1. desplegar backend en Cloud Run
2. validar `GET /api/health`
3. configurar `NEXT_PUBLIC_API_BASE_URL` en Vercel
4. desplegar frontend
5. probar login, CRUD y visor interno de videos/PDF

## 5. Checklist

- frontend consume el backend por `NEXT_PUBLIC_API_BASE_URL`
- backend responde con CORS al dominio de Vercel
- `DATABASE_URL` apunta a Supabase
- `SUPABASE_SERVICE_ROLE_KEY` solo vive en backend
- PDFs y videos cargan en Supabase Storage
- visores internos abren dentro de la plataforma

## 6. Seguridad

- rota cualquier `SUPABASE_SERVICE_ROLE_KEY` que haya quedado expuesta antes
- no subas `.env` reales al repositorio
- usa un `AUTH_SECRET` distinto y fuerte en produccion
