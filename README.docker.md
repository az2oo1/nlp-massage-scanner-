# Docker Setup for NLP Massage Scanner

## Quick Start

### Production Build & Run
```bash
# Build the Docker image
docker build -t nlp-massage-scanner .

# Run the container
docker run -p 11434:11434 nlp-massage-scanner
```

### Using Docker Compose (Recommended)
```bash
# Build and start the service
docker-compose up -d

# View logs
docker-compose logs -f nlp-api

# Stop the service
docker-compose down
```

## Development Setup

For development with automatic reload on file changes:

```bash
# Start with development docker-compose
docker-compose -f docker-compose.dev.yml up -d

# View logs with auto-reload
docker-compose -f docker-compose.dev.yml logs -f nlp-api-dev
```

## Files Explained

- **Dockerfile** - Production image using Node.js 18 Alpine
- **Dockerfile.dev** - Development image with nodemon for auto-reload
- **docker-compose.yml** - Production service configuration with health checks
- **docker-compose.dev.yml** - Development configuration with volume mounts
- **.dockerignore** - Files/folders excluded from Docker build

## Port Mapping

The application runs on port **11434** inside the container.

## Environment Variables

You can set the following:
- `NODE_ENV` - Set to `production` or `development`

## Health Checks

The production docker-compose includes health checks that verify the API is responding. The service will be marked as "healthy" once it's ready to accept requests.

## Volume Mounts

**Production**: Model and dataset files are mounted to ensure persistence.

**Development**: The entire project directory is mounted for live code editing with automatic reload.

## Troubleshooting

### Container won't start
```bash
docker-compose logs nlp-api
```

### Port already in use
Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "8080:11434"  # external:internal
```

### Clear and rebuild
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```
