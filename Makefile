.PHONY: up build restart stop down logs ps check-env-dev help

FILE := compose.yml
ENV  := .env

DC := docker compose -f $(FILE) --env-file $(ENV)

# ── Dev ───────────────────────────────────────────────────────────────────────

up: check-env-dev ## поднять стек в фоне
	$(DC) up -d

build: check-env-dev ## пересобрать образы и поднять стек
	$(DC) up -d --build

restart: check-env-dev ## перезапустить стек целиком или сервис (s=gateway)
	$(DC) restart $(s)

stop: ## остановить контейнеры, не удаляя их (s=web — только сервис)
	$(DC) stop $(s)

down: ## остановить и удалить контейнеры и сеть стека
	$(DC) down

logs: ## логи стека, следом за выводом (s=auth-service)
	$(DC) logs -f $(s)

ps: ## статус контейнеров стека
	$(DC) ps

check-env-dev:
	@test -f .env || { echo "Нет .env — создайте его: cp .env.example .env"; exit 1; }

help: ## показать список команд
	@echo "Использование: make <команда>"
	@echo
	@grep -hE '^[a-z0-9-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
