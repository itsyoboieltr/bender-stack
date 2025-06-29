FROM imbios/bun-node:latest-iron-alpine

ARG EXPO_PUBLIC_HOST_URL

ENV EXPO_PUBLIC_HOST_URL=$EXPO_PUBLIC_HOST_URL

WORKDIR /app

COPY package.json .

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
