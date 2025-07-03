start:
	docker compose up --build -d
	docker exec bender-stack-app-1 bun db:migrate
	docker exec bender-stack-app-1 bun db:seed
	docker logs bender-stack-app-1 --follow
stop:
	docker compose down -v
start-dev:
	docker compose -f docker-compose.dev.yml up --build -d
	docker exec bender-stack-app-1 bun db:migrate
	docker exec bender-stack-app-1 bun db:seed
	docker logs bender-stack-app-1 --follow
stop-dev:
	docker compose -f docker-compose.dev.yml down -v
start-postgres:
	docker compose -f docker-compose.dev.yml up -d postgres
	@echo "Waiting for Postgres to be healthy..."
	@until docker inspect --format='{{.State.Health.Status}}' bender-stack-postgres-1 2>/dev/null | grep -q "healthy"; do \
		sleep 1; \
	done
	bun db:migrate
	bun db:seed
stop-postgres:
	docker compose -f docker-compose.dev.yml down -v postgres
exec:
	docker exec -it bender-stack-app-1 sh
