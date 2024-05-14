<p align="center">
  <img src="https://github.com/itsyoboieltr/bender-stack/assets/72046715/9b20eaa6-5e01-4b12-aa01-afc56c90d7d5" width="250" alt="BENDER stack">
</p>

<h1 align="center">
  BENDER stack
</h1>

The `BENDER` 🤖 stack is a bun-based 🔥 `BLAZINGLY FAST` 🔥 full-stack `100% type-safe` native and web development solution that provides `everything` you need to build `production-ready` native and web apps. It consists of:

- [Bun](https://bun.sh)
- [Elysia](https://elysiajs.com)
- [NativeWind](https://www.nativewind.dev/)
- [Drizzle](https://orm.drizzle.team)
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)

## Creating a project

Create a new project

```bash
bun create itsyoboieltr/bender-stack
```

Optionally specify a name for the destination folder. If no destination is specified, the name `bender-stack` will be used.

```bash
bun create itsyoboieltr/bender-stack my-app
```

Bun will perform the following steps:

- Download the `template`
- Copy all template files into the `destination folder`
- Install dependencies with `bun i`.
- Initialize a fresh Git repo. Opt out with the `--no-git` flag.

## Developing

You can start the `development server` with:

```bash
bun dev
```

Unless you are running the development server and the app on the same device, you need to set the `EXPO_PUBLIC_HOST_URL` environment variable to the `public url` of your server. This is required for the app to do API calls, as your computer's `localhost` is not accessible from external devices (such as your phone), even if they are on the same network.

```bash
EXPO_PUBLIC_HOST_URL="..."
```

One of the easiest ways to get a public url for your development server is by using [ngrok](https://ngrok.com/). After installing `ngrok`, you can start the development server and expose it to the internet with the following command:

```bash
ngrok http 3000
```

## Building

Build for `production` by running the following command:

```bash
bun run build
```

## Running

Run in `production` by running the following command:

```bash
bun start
```

## Database

In case your database schema does not match the schema defined by `drizzle`, then the database needs to be synchronized. This can be done by running the following command:

```bash
bun push
```

In addition, `drizzle studio` can be used to connect to the database and browse, add, delete and update data based on the declared `drizzle schema`.

```bash
bun studio
```

## Environment variables ([.env](.env.example))

- `PORT`: port that the application runs on.

- `EXPO_PUBLIC_HOST_URL`: host URL for the application.

- `DATABASE_USER`: database user for Postgres.

- `DATABASE_PASSWORD`: database password for Postgres.

- `DATABASE_NAME`: database name for Postgres.

- `DATABASE_URL`: database connection URL for Postgres.

- `DATABASE_BACKUP_PATH`: path where the database backups are stored.

- `COMPOSE_PROFILES`: profiles for `docker compose`. Default: `development`
  - In a production setting, you might want to enable backups for the database. This can be done by setting the `COMPOSE_PROFILES` environment variable to `production`.

## Deployment

Using the [Dockerfile](Dockerfile) or the [docker-compose.yml](docker-compose.yml) file, the application can be deployed to any `docker host`. The following command will build the `docker image` and start the application.

```bash
docker compose up -d
```

To stop the application, run the following command:

```bash
docker compose down
```
