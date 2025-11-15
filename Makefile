COMPOSE_PROJECT_NAME := $(shell grep -E '^COMPOSE_PROJECT_NAME=' .env | cut -d '=' -f2 | tr -d '"')

start:
	docker compose up --build -d
	docker exec ${COMPOSE_PROJECT_NAME}-app-1 bun db:migrate
	docker exec ${COMPOSE_PROJECT_NAME}-app-1 bun db:seed
	docker logs ${COMPOSE_PROJECT_NAME}-app-1 --follow
stop:
	docker compose down -v
start-dev:
	docker compose -f docker-compose.dev.yml up --build -d
	docker exec ${COMPOSE_PROJECT_NAME}-app-1 bun db:migrate
	docker exec ${COMPOSE_PROJECT_NAME}-app-1 bun db:seed
	docker logs ${COMPOSE_PROJECT_NAME}-app-1 --follow
stop-dev:
	docker compose -f docker-compose.dev.yml down -v
start-postgres:
	docker compose -f docker-compose.dev.yml up -d postgres
	@echo "Waiting for Postgres to be healthy..."
	@until docker inspect --format='{{.State.Health.Status}}' ${COMPOSE_PROJECT_NAME}-postgres-1 2>/dev/null | grep -q "healthy"; do \
		sleep 1; \
	done
	bun db:migrate
	bun db:seed
stop-postgres:
	docker compose -f docker-compose.dev.yml down -v postgres
logs:
	docker logs ${COMPOSE_PROJECT_NAME}-app-1 --follow
exec:
	docker exec -it ${COMPOSE_PROJECT_NAME}-app-1 sh
