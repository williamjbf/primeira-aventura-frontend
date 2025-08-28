#!/usr/bin/env docker
# Dockerfile para primeira-aventura frontend - Next.js

FROM node:20-alpine

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copiar package.json primeiro
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Alterar proprietário dos arquivos
RUN chown -R nextjs:nodejs /app

# Usar usuário não-root
USER root

# Expor porta do Next.js
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Executar aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]
