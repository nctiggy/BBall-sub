.PHONY: help build-image push-image build-chart push-chart clean lint test install-dev

# Default values - can be overridden via command line
IMAGE_NAME ?= basketball-sub
IMAGE_TAG ?= latest
REGISTRY ?= docker.io
REPO_NAME ?= $(REGISTRY)/$(IMAGE_NAME)
CHART_NAME ?= basketball-sub
CHART_VERSION ?= 1.0.0
HELM_REGISTRY ?= oci://registry-1.docker.io
HELM_REPO ?= $(HELM_REGISTRY)/$(IMAGE_NAME)

# Color output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Display this help message
	@echo "$(GREEN)Basketball Substitution Manager - Build System$(NC)"
	@echo ""
	@echo "$(YELLOW)Available targets:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Variables (override with VAR=value):$(NC)"
	@echo "  IMAGE_NAME    = $(IMAGE_NAME)"
	@echo "  IMAGE_TAG     = $(IMAGE_TAG)"
	@echo "  REGISTRY      = $(REGISTRY)"
	@echo "  REPO_NAME     = $(REPO_NAME)"
	@echo "  CHART_NAME    = $(CHART_NAME)"
	@echo "  CHART_VERSION = $(CHART_VERSION)"
	@echo "  HELM_REGISTRY = $(HELM_REGISTRY)"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make build-image"
	@echo "  make push-image REPO_NAME=myrepo/basketball-sub IMAGE_TAG=v1.0.0"
	@echo "  make build-chart"
	@echo "  make push-chart HELM_REGISTRY=oci://ghcr.io/myorg"

build-image: ## Build Docker image
	@echo "$(GREEN)Building Docker image: $(REPO_NAME):$(IMAGE_TAG)$(NC)"
	docker build -t $(REPO_NAME):$(IMAGE_TAG) .
	@echo "$(GREEN)✓ Image built successfully$(NC)"
	@docker images | grep $(IMAGE_NAME) | head -n 1

push-image: ## Push Docker image to registry (use REPO_NAME= to specify registry)
	@echo "$(GREEN)Pushing Docker image: $(REPO_NAME):$(IMAGE_TAG)$(NC)"
	@if [ -z "$(REPO_NAME)" ]; then \
		echo "$(RED)Error: REPO_NAME is required$(NC)"; \
		echo "Usage: make push-image REPO_NAME=registry/repo-name"; \
		exit 1; \
	fi
	docker push $(REPO_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)✓ Image pushed successfully$(NC)"

tag-image: ## Tag image for different registry (use REPO_NAME= and IMAGE_TAG=)
	@echo "$(GREEN)Tagging image: $(IMAGE_NAME):latest -> $(REPO_NAME):$(IMAGE_TAG)$(NC)"
	docker tag $(IMAGE_NAME):latest $(REPO_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)✓ Image tagged successfully$(NC)"

build-chart: ## Build Helm chart package
	@echo "$(GREEN)Building Helm chart: $(CHART_NAME) version $(CHART_VERSION)$(NC)"
	@if [ ! -d "helm/$(CHART_NAME)" ]; then \
		echo "$(RED)Error: Chart directory helm/$(CHART_NAME) not found$(NC)"; \
		exit 1; \
	fi
	helm lint helm/$(CHART_NAME)
	helm package helm/$(CHART_NAME) --version $(CHART_VERSION) --destination ./dist
	@echo "$(GREEN)✓ Chart packaged successfully$(NC)"
	@ls -lh ./dist/$(CHART_NAME)-$(CHART_VERSION).tgz

push-chart: build-chart ## Push Helm chart to OCI registry (use HELM_REGISTRY= to specify)
	@echo "$(GREEN)Pushing Helm chart to: $(HELM_REPO)$(NC)"
	@if [ -z "$(HELM_REGISTRY)" ]; then \
		echo "$(RED)Error: HELM_REGISTRY is required$(NC)"; \
		echo "Usage: make push-chart HELM_REGISTRY=oci://registry.example.com/charts"; \
		exit 1; \
	fi
	helm push ./dist/$(CHART_NAME)-$(CHART_VERSION).tgz $(HELM_REPO)
	@echo "$(GREEN)✓ Chart pushed successfully$(NC)"

install-dev: ## Install npm dependencies for development
	@echo "$(GREEN)Installing development dependencies$(NC)"
	npm install
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

dev: install-dev ## Run development server
	@echo "$(GREEN)Starting development server$(NC)"
	npm run dev

build: ## Build production bundle
	@echo "$(GREEN)Building production bundle$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build complete - check dist/ directory$(NC)"

test: ## Run tests
	@echo "$(YELLOW)No tests configured yet$(NC)"

lint: ## Lint Helm charts
	@echo "$(GREEN)Linting Helm charts$(NC)"
	helm lint helm/$(CHART_NAME)
	@echo "$(GREEN)✓ Lint passed$(NC)"

clean: ## Clean build artifacts
	@echo "$(YELLOW)Cleaning build artifacts$(NC)"
	rm -rf dist/
	rm -rf node_modules/
	rm -rf .vite/
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@echo "$(GREEN)✓ Cleaned$(NC)"

docker-run: ## Run Docker container locally for testing
	@echo "$(GREEN)Running container locally on port 8080$(NC)"
	docker run --rm -p 8080:80 $(REPO_NAME):$(IMAGE_TAG)

all: build-image build-chart ## Build both Docker image and Helm chart
	@echo "$(GREEN)✓ All artifacts built successfully$(NC)"

release: build-image push-image build-chart push-chart ## Build and push both image and chart
	@echo "$(GREEN)✓ Release complete!$(NC)"
	@echo "Image: $(REPO_NAME):$(IMAGE_TAG)"
	@echo "Chart: $(HELM_REPO)/$(CHART_NAME):$(CHART_VERSION)"

.DEFAULT_GOAL := help
