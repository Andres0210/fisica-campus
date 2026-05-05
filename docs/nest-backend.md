# Backend separado

El backend ya no vive dentro de este proyecto.

## Ubicacion actual

- frontend: [fisica-campus](/C:/Users/ing_a/OneDrive/Documentos/Playground/fisica-campus)
- backend: [fisica-campus-backend](/C:/Users/ing_a/OneDrive/Documentos/Playground/fisica-campus-backend)

## Integracion

Este frontend consume la API unicamente por HTTP a traves de:

- [lib/api-client.ts](/C:/Users/ing_a/OneDrive/Documentos/Playground/fisica-campus/lib/api-client.ts)

La URL base se controla con:

- `NEXT_PUBLIC_API_BASE_URL`

Ejemplo local:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

Ejemplo produccion:

```env
NEXT_PUBLIC_API_BASE_URL=https://tu-backend.run.app/api
```
