<p align="center">
  <img src="https://github.com/itsyoboieltr/bender-stack/assets/72046715/9b20eaa6-5e01-4b12-aa01-afc56c90d7d5" width="250" alt="BENDER stack">
</p>

<h1 align="center">
  BENDER stack
</h1>

The `BENDER` stack is a bun-based 🔥 `BLAZINGLY FAST` 🔥 full-stack `100% type-safe` native and web development solution that provides `everything` you need to build `production-ready` native and web apps. It consists of:

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

## Getting started

Once the project is created and the dependencies are installed, the environment variables need to be set up. The following environment variables can be configured:

[.env.example](.env.example)

```bash
DATABASE_URL="postgresql://postgres:xxxx@database:5432/bender"
EXPO_PUBLIC_HOST_URL="http://localhost:3000"
COMPOSE_APP_PORT="3000"
COMPOSE_DATABASE_PORT="5432"
COMPOSE_DATABASE_USER="postgres"
COMPOSE_DATABASE_PASSWORD="xxxx"
COMPOSE_DATABASE_NAME="bender"
COMPOSE_DATABASE_BACKUP_PATH="$HOME/backup"
COMPOSE_PROFILES="development"
```

It is recommended to use a `.env` file to configure the environment variables.

- For local development `.env.local` should be used, as this is ignored by docker compose.
- For production deployment `.env` should be used, as this is used by docker compose.

The most important thing to configure is the database connection, as running the app without a database connection will result in an instant error.

In case your database schema does not match the schema defined by `drizzle`, then the database needs to be synchronized. This can be done by running the following command:

```bash
bun push
```

In addition, `drizzle studio` can be used to connect to the database and browse, add, delete and update data based on the declared `drizzle schema`.

```bash
bun studio
```

## Developing

If everything is set up correctly, you can start the `development server` with:

```bash
bun dev
```

<p style="color: red">ATTENTION!</p>

Unless you are running the development server and the app on the same device locally, you need to set the `EXPO_PUBLIC_HOST_URL` environment variable to the `public url` of your server. This is required for the app to do API calls, as your computer's `localhost` is not accessible from external devices (such as your phone), even if they are on the same network.

```bash
EXPO_PUBLIC_HOST_URL="http://..."
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

## Running (work in progress)

Run in `production` by running the following command:

```bash
bun start
```

## Deployment (work in progress)

Using the [Dockerfile](Dockerfile) or the [compose.yaml](compose.yaml) file, the application can be deployed to any `docker host`. The following command will build the `docker image` and start the application.

```bash
docker compose up
```

Important notes for production use:

1. In a production setting, you might want to enable `backups for the database`. This can be done by setting the `COMPOSE_PROFILES` environment variable to `production`.

```bash
COMPOSE_PROFILES="production"
```

2. The `COMPOSE_DATABASE_BACKUP_PATH` environment variable can be used to `customize` the path where the `database backups` are stored.

```bash
COMPOSE_DATABASE_BACKUP_PATH="$HOME/backup"
```
