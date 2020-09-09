CONTAINER_NAME:=frontend
COMPOSE:=docker-compose -f ./docker-compose.yml
develop:
	@ $(COMPOSE) up -d
	@ $(COMPOSE) exec $(CONTAINER_NAME) /bin/bash ||true
	@ $(COMPOSE) stop
	@ $(COMPOSE) down

build :
	@ $(COMPOSE) build 