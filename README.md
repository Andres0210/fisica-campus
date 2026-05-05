# FisicaLab Campus Frontend

Frontend `Next.js` de la plataforma academica para recursos, simuladores y panel docente.

## Stack

- `Next.js 15`
- `React 19`
- `Tailwind CSS 4`
- despliegue objetivo: `Vercel`

## Variables de entorno

Usa las variables de [`.env.example`](/C:/Users/ing_a/OneDrive/Documentos/Playground/fisica-campus/.env.example).

Minimo requerido:

```env
AUTH_SECRET=un-secreto-largo-y-seguro
TEACHER_NAME=Dra. Laura Mendoza
TEACHER_EMAIL=laura.mendoza@universidad.edu
TEACHER_PASSWORD=una-clave-segura
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

En produccion `NEXT_PUBLIC_API_BASE_URL` debe apuntar al backend desplegado en Google Cloud.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Despliegue

La guia de despliegue final esta en [docs/deployment.md](/C:/Users/ing_a/OneDrive/Documentos/Playground/fisica-campus/docs/deployment.md).
