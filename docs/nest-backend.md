# Backend Nest separado

## Estructura

- `backend/`: API NestJS independiente.
- `prisma/schema.prisma`: esquema compartido de base de datos.
- `lib/api-client.ts`: cliente base del frontend para consumir la API.

## Scripts utiles

Desde la raiz:

- `npm run backend:dev`
- `npm run backend:build`
- `npm run backend:prisma:generate`

Desde `backend/`:

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run prisma:generate`

## Variables

Frontend:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api`

Backend:

- `PORT=4000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/fisica_campus?schema=public`
- `FRONTEND_URL=http://localhost:3000`

## Endpoints principales

- `GET /api/health`
- `GET /api/authors`
- `POST /api/authors`
- `PATCH /api/authors/:id`
- `DELETE /api/authors/:id`
- `GET /api/courses`
- `POST /api/courses`
- `PATCH /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/topics`
- `POST /api/topics`
- `PATCH /api/topics/:id`
- `DELETE /api/topics/:id`
- `GET /api/resources`
- `POST /api/resources`
- `PATCH /api/resources/:id`
- `DELETE /api/resources/:id`
- `GET /api/resources/catalog/videos`
- `GET /api/resources/catalog/documentos`
- `GET /api/resources/catalog/libros`
- `GET /api/resources/catalog/cartillas`

## Modelo editorial

- `User`: cuenta interna, por ejemplo la profesora.
- `Author`: perfil publico del autor.
- `Resource`: unifica videos, documentos, libros y cartillas.

La separacion se hace con:

- `type`: `VIDEO` o `PDF`
- `category`: `VIDEO`, `DOCUMENT`, `BOOK`, `BOOKLET`
- `status`: `DRAFT`, `PUBLISHED`, `ARCHIVED`

## Siguiente paso recomendado

Conectar las vistas del frontend para leer y mutar datos exclusivamente por HTTP hacia Nest, retirando gradualmente el acceso directo a Prisma desde Next.
