# Arquitectura propuesta - Plataforma de Fisica

## Objetivo

Crear una web para una profesora universitaria donde pueda:

- subir videos
- publicar documentos PDF
- organizar contenidos por asignatura y tema
- ofrecer simulaciones interactivas de fisica
- navegar con navbar superior y sidebar lateral

## Stack recomendado

- Frontend: `Next.js 15`, `React 19`, `Tailwind CSS 4`
- Backend MVP: `Route Handlers` y `Server Actions`
- Base de datos: `PostgreSQL`
- ORM: `Prisma`
- Archivos: `Cloudinary` o `AWS S3`
- Autenticacion: `Auth.js` o `Clerk`
- Despliegue: `Vercel`

## Modulos principales

### 1. Simulaciones

El modulo mas importante.

Tecnologias sugeridas:

- `Canvas API` para simulaciones 2D
- `React Three Fiber` para experiencias mas complejas
- graficas con librerias como `Chart.js`

Ejemplos:

- ondas
- movimiento armonico simple
- tiro parabolico
- electrostatica
- optica geometrica

### 2. Videos

Cada video debe guardar:

- titulo
- descripcion
- url
- miniatura
- asignatura
- tema
- orden de visualizacion

### 3. Documentos PDF

Cada documento debe guardar:

- titulo
- tipo
- descripcion
- archivo
- asignatura
- tema
- fecha

## Base de datos

Si se necesita base de datos.

Tablas iniciales:

- `users`
- `courses`
- `topics`
- `resources`
- `simulations`
- `enrollments`
- `announcements`

## Diseno visual

- base azul profundo
- acentos cian
- apoyo ambar para resaltar datos
- tarjetas grandes y limpias
- atmosfera de laboratorio moderno

## Roadmap

1. Disenar dashboard y navegacion.
2. Implementar autenticacion.
3. Crear gestion de videos y PDFs.
4. Conectar almacenamiento en nube.
5. Construir la primera simulacion.
6. Desplegar y conectar GitHub.
