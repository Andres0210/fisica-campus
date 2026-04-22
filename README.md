# FisicaLab Campus

Prototipo inicial de una plataforma web para una profesora universitaria de Fisica.

## Incluye

- propuesta visual con navbar y sidebar
- seccion de arquitectura
- recomendacion de stack tecnologico
- lineamientos para simulaciones, videos y PDFs

## Ejecutar

```bash
npm install
npm run db:up
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

## Estructura

- `app/`: interfaz principal
- `components/`: navbar y componentes base
- `docs/architecture.md`: arquitectura recomendada
- `prisma/`: esquema, migraciones y seed

## Base de datos local

El proyecto incluye `docker-compose.yml` para levantar PostgreSQL local en `localhost:5433`.
