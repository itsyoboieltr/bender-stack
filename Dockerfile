FROM imbios/bun-node:latest-iron-alpine

ARG EXPO_PUBLIC_HOST_URL

ENV EXPO_PUBLIC_HOST_URL=$EXPO_PUBLIC_HOST_URL

WORKDIR /app
COPY . .

RUN bun i
RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
