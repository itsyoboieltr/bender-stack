FROM imbios/bun-node:1.3.1-24.11.0-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG EXPO_PUBLIC_HOST_URL
ENV EXPO_PUBLIC_HOST_URL=$EXPO_PUBLIC_HOST_URL

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

CMD ["bun", "start"]
