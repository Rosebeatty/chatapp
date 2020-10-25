build: ## Build the container
	docker build -t $(FRONTEND_NAME) .
	docker build -t $(BACKEND_NAME) .

up: docker-compose up ## Run the container 

down: ## Stop and remove a running container
	docker stop $(APP_NAME); docker rm $(APP_NAME)
