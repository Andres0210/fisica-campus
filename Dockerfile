# ---------- BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔥 IMPORTANTE: generar Prisma antes del build
RUN npx prisma generate

# build de Next
RUN npm run build

# ---------- PRODUCTION ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# copiar build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# 🔥 copiar prisma
COPY --from=builder /app/prisma ./prisma

# 🔥 copiar engines (CLAVE)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["npm", "start"]