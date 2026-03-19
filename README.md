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

### Local Development
- Node.js 18+
- npm

### Docker
- Docker Engine 20.10+
- Docker Compose 3.8+

## 🏃 Quick Start

### Using Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/az2oo1/nlp-massage-scanner-.git
   cd nlp-massage-scanner-
   ```

2. **Pull and run with docker-compose:**
   ```bash
   docker-compose up -d
   ```

3. **Verify the service is running:**
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt": "مرحبا"}'
   ```

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/az2oo1/nlp-massage-scanner-.git
   cd nlp-massage-scanner-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm start
   # or
   node server.js
   ```

4. **Access the API:**
   ```bash
   http://localhost:11434/api/generate
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

## 🐳 Docker Usage

### Build Locally
```bash
docker build -t nlp-massage-scanner .
docker run -p 11434:11434 nlp-massage-scanner
```

### Pull from GitHub Container Registry
```bash
docker pull ghcr.io/az2oo1/nlp-massage-scanner-:latest
docker run -p 11434:11434 ghcr.io/az2oo1/nlp-massage-scanner-:latest
```

### Using Docker Compose

**Production:**
```bash
docker-compose up -d
```

**Development (with hot-reload):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**View logs:**
```bash
docker-compose logs -f nlp-api
```

**Stop services:**
```bash
docker-compose down
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

### Production with Docker Compose

1. **Set environment variables in `.env`:**
   ```env
   GITHUB_REPOSITORY=az2oo1/nlp-massage-scanner-
   IMAGE_TAG=latest
   NODE_ENV=production
   ```

2. **Deploy:**
   ```bash
   docker-compose up -d
   ```

3. **Monitor health:**
   ```bash
   docker-compose ps
   # Should show healthy status
   ```

### Kubernetes (Optional)

Create a `k8s-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nlp-massage-scanner
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nlp-massage-scanner
  template:
    metadata:
      labels:
        app: nlp-massage-scanner
    spec:
      containers:
      - name: nlp-api
        image: ghcr.io/az2oo1/nlp-massage-scanner-:latest
        ports:
        - containerPort: 11434
        env:
        - name: NODE_ENV
          value: "production"
```

## 🔧 Development

### Training the NLP Model

The model is trained using the dataset in `dataset.js`. To retrain:

```bash
node train.js
```

This generates/updates the `model.nlp` file.

### Running Tests

```bash
npm test
```

### Hot Reload During Development

Using the dev docker-compose:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

This enables nodemon for automatic reload on file changes.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
# ports:
#   - "8080:11434"  # external:internal
docker-compose up -d
```

### Image Not Found
```bash
# Login to GitHub Container Registry
docker login ghcr.io

# Pull image
docker pull ghcr.io/az2oo1/nlp-massage-scanner-:latest
```

### Container Won't Start
```bash
# Check logs
docker-compose logs nlp-api

# Rebuild
docker-compose down
docker-compose up --build -d
```

### Model Loading Issues
```bash
# Verify model file exists
ls -la model.nlp

# Check volume mounts in docker-compose.yml
docker-compose ps -a
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
