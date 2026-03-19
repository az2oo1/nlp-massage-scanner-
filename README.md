# NLP Massage Scanner

An NLP-powered API service built with Node.js and Express that analyzes text using custom Arabic language models. The service provides text classification and intent recognition through a REST API.

## 🚀 Features

- **Arabic NLP Support** - Trained models for Arabic language processing
- **Custom Intent Recognition** - Classify text into custom categories
- **Docker Ready** - Production and development Docker configurations
- **CI/CD Pipeline** - Automated builds and publishing to GitHub Container Registry
- **Health Checks** - Built-in health monitoring
- **Environment Configuration** - Easy setup with environment variables

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 3.8+

## 🚀 Quick Start with Docker Compose

1. **Clone the repository:**
   ```bash
   git clone https://github.com/az2oo1/nlp-massage-scanner-.git
   cd nlp-massage-scanner-
   ```

2. **Create `.env` file (optional):**
   ```bash
   cp .env.example .env
   ```

3. **Start the service:**
   ```bash
   docker-compose up -d
   ```

4. **Verify the service is running:**
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "مرحبا"}'
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f nlp-api
   ```

6. **Stop the service:**
   ```bash
   docker-compose down
   ```

## 📡 API Endpoints

### POST `/api/generate`

Analyzes text and returns the detected intent/category.

**Request:**
```json
{
  "prompt": "النص العربي هنا"
}
```

**Response:**
```json
{
  "response": "category_name"
}
```

**Example:**
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "مرحبا بك"}' \
  -w "\n"
```

## 🐳 Docker Compose Commands

### Start Services
```bash
# Start in background
docker-compose up -d

# Start and watch logs
docker-compose up
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f nlp-api
```

### Manage Services
```bash
# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Stop services
docker-compose stop

# Remove services and volumes
docker-compose down
```

### Development with Auto-Reload
```bash
# Start with development image (hot-reload enabled)
docker-compose -f docker-compose.dev.yml up -d

# Follow development logs
docker-compose -f docker-compose.dev.yml logs -f
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
GITHUB_REPOSITORY=az2oo1/nlp-massage-scanner-
IMAGE_TAG=latest
NODE_ENV=production
```

### Available Docker Tags

| Tag | Source | Usage |
|-----|--------|-------|
| `latest` | main branch | `docker pull ghcr.io/az2oo1/nlp-massage-scanner-:latest` |
| `develop` | develop branch | `docker pull ghcr.io/az2oo1/nlp-massage-scanner-:develop` |
| `v1.0.0` | version tags | `docker pull ghcr.io/az2oo1/nlp-massage-scanner-:v1.0.0` |
| `main-abc123` | commit SHA | Latest develop build |

## 📁 Project Structure

```
nlp-massage-scanner-/
├── server.js                          # Main Express server
├── train.js                           # NLP model training script
├── dataset.js                         # Training dataset
├── model.nlp                          # Trained NLP model
├── package.json                       # Node dependencies
├── Dockerfile                         # Production Docker image
├── Dockerfile.dev                     # Development Docker image
├── docker-compose.yml                 # Production compose config
├── docker-compose.dev.yml             # Development compose config
├── .dockerignore                      # Docker build exclusions
├── .github/workflows/
│   ├── docker-build-publish.yml       # GHCR CI/CD workflow
│   └── docker-publish-dockerhub.yml   # Docker Hub CI/CD workflow
├── README.md                          # This file
├── README.docker.md                   # Docker setup guide
├── USING_PUBLISHED_IMAGES.md          # Published images guide
└── WORKFLOW_SETUP.md                  # CI/CD workflow guide
```

## 🔄 CI/CD Pipeline

Automatic building and publishing to GitHub Container Registry on:
- Push to `main` or `develop` branches
- Git tags (`v1.0.0`)
- Pull requests (builds only)

See [WORKFLOW_SETUP.md](WORKFLOW_SETUP.md) for details.

## 📚 Documentation

- [Docker Setup Guide](README.docker.md) - Detailed Docker configuration
- [Using Published Images](USING_PUBLISHED_IMAGES.md) - How to pull and run published images
- [CI/CD Workflow Setup](WORKFLOW_SETUP.md) - GitHub Actions workflow documentation

## 🚀 Deployment

### Production Deployment with Docker Compose

1. **Clone repository:**
   ```bash
   git clone https://github.com/az2oo1/nlp-massage-scanner-.git
   cd nlp-massage-scanner-
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   GITHUB_REPOSITORY=az2oo1/nlp-massage-scanner-
   IMAGE_TAG=latest
   NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

4. **Monitor health:**
   ```bash
   docker-compose ps
   ```
   
   You should see the container with status `healthy` or `Up`.

5. **Test the API:**
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "مرحبا"}'
   ```

### Scaling with Multiple Instances

```bash
# Start with multiple replicas
docker-compose up -d --scale nlp-api=3
```

### Using Specific Image Tags

```bash
# Use development image
IMAGE_TAG=develop docker-compose up -d

# Use specific version
IMAGE_TAG=v1.0.0 docker-compose up -d

# Use specific commit
IMAGE_TAG=main-abc123 docker-compose up -d
```

## 🔧 Development

### Local Development with Hot-Reload

For development with automatic reload on file changes, use the dev docker-compose:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Files in the project directory will be mounted and watched for changes. Edit files locally, and the container will automatically reload.

### Retraining the NLP Model

To retrain the model with new data:

```bash
# Build development image with all tools
docker-compose -f docker-compose.dev.yml up -d

# Run training script
docker exec nlp-massage-scanner-dev node train.js

# Verify updated model
docker exec nlp-massage-scanner-dev ls -la model.nlp
```

### Running in Interactive Mode

```bash
# Access container shell
docker exec -it nlp-massage-scanner-dev bash

# Run commands inside container
docker exec nlp-massage-scanner-dev npm test
```

## 🐛 Troubleshooting

### Port Already in Use

If port 11434 is already in use:

```bash
# Option 1: Change port in docker-compose.yml
# Edit the ports section:
# ports:
#   - "8080:11434"

docker-compose down
docker-compose up -d
```

```bash
# Option 2: Find and stop the process using port 11434
# On Windows:
netstat -ano | findstr :11434

# On Linux/Mac:
lsof -i :11434
```

### Container Won't Start

```bash
# View error logs
docker-compose logs nlp-api

# Rebuild the image
docker-compose down
docker-compose up --build -d

# Check image validity
docker images | grep nlp-massage-scanner
```

### Model Loading Issues

```bash
# Verify model file exists locally
ls -la model.nlp

# Check volume mounts
docker inspect nlp-massage-scanner

# Verify volumes in docker-compose
docker volume ls
```

### Health Check Failures

```bash
# View health check status
docker-compose ps

# If unhealthy, restart
docker-compose restart nlp-api

# Check health logs
docker logs nlp-massage-scanner
```

### Out of Disk Space

```bash
# Clean up unused images and volumes
docker system prune -a --volumes

# Rebuild from scratch
docker-compose down -v
docker-compose up --build -d
```

### Permission Issues

```bash
# On Linux, run with proper permissions
sudo docker-compose up -d

# Or add user to docker group
sudo usermod -aG docker $USER
```

### Test API Connectivity

```bash
# From host machine
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "مرحبا"}'

# From inside container
docker exec nlp-massage-scanner curl http://localhost:11434/api/generate
```

## 📦 Dependencies

- **express** ^5.2.1 - Web framework
- **node-nlp** ^5.0.0-alpha.5 - NLP processing library

## 🌐 API Response Codes

| Code | Meaning |
|------|---------|
| 200 | Successful analysis |
| 400 | Missing or invalid prompt |
| 500 | Server error |

## 🔐 Security Notes

- Never commit `.env` files with sensitive data
- Use GitHub Personal Access Tokens for private registries
- Keep container images updated
- Use environment variables for configuration

## 📝 License

ISC

## 👤 Author

az2oo1

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on [GitHub](https://github.com/az2oo1/nlp-massage-scanner-/issues).

## 🔗 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [node-nlp GitHub](https://github.com/axa-group/nlp.js)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
