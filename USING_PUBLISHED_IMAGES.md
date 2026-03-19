# Using Published Docker Images from GitHub

Your `docker-compose.yml` now pulls from GitHub Container Registry (GHCR) instead of building locally.

## Setup

1. **Already configured:**

   Your `docker-compose.yml` is configured to pull from:
   ```yaml
   image: ghcr.io/az2oo1/nlp-massage-scanner-:latest
   ```

   Or use a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

   The `.env` file contains:
   ```env
   GITHUB_REPOSITORY=az2oo1/nlp-massage-scanner-
   IMAGE_TAG=latest
   NODE_ENV=production
   ```

2. **Authenticate with GitHub Container Registry (if private):**

   ```bash
   docker login ghcr.io
   # Username: YOUR_GITHUB_USERNAME
   # Password: YOUR_GITHUB_TOKEN (GitHub Personal Access Token with `read:packages` scope)
   ```

## Usage

### Using docker-compose with published image

```bash
# Pull and run the latest image
docker-compose up -d

# Or specify a specific version
IMAGE_TAG=v1.0.0 docker-compose up -d

# Or use a specific branch tag
IMAGE_TAG=develop docker-compose up -d
```

### Direct docker run

```bash
# Latest from main
docker run -p 11434:11434 ghcr.io/az2oo1/nlp-massage-scanner-:latest

# Specific version
docker run -p 11434:11434 ghcr.io/az2oo1/nlp-massage-scanner-:v1.0.0

# Development branch
docker run -p 11434:11434 ghcr.io/az2oo1/nlp-massage-scanner-:develop
```

## Available Tags

Images are automatically tagged when pushed to GitHub:

| Tag | Source |
|-----|--------|
| `latest` | main branch |
| `develop` | develop branch |
| `v1.0.0` | git tag v1.0.0 |
| `main-abc123de` | main branch commit SHA |
| `develop-abc123de` | develop branch commit SHA |

## Pulling from GitHub Container Registry

```bash
# Pull the latest image
docker pull ghcr.io/az2oo1/nlp-massage-scanner-:latest

# View available tags
# Visit: https://github.com/az2oo1/nlp-massage-scanner-/pkgs/container/nlp-massage-scanner-
```

## Local Development (Optional)

If you want to build locally during development, use the dev compose file:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This still uses the local `Dockerfile` for development with hot-reload.

## Production Deployment

For production, the published image approach gives you:

✅ **Consistency** - Same image tested in CI/CD
✅ **Versioning** - Track exact image versions deployed
✅ **Security** - Images scanned for vulnerabilities
✅ **Speed** - No build time, just pull and run
✅ **Distribution** - Easy to share across environments

## Troubleshooting

**"image not found" error:**
```bash
# Verify repository and tag exist
docker pull ghcr.io/az2oo1/nlp-massage-scanner-:latest

# Check GitHub Packages page
# https://github.com/az2oo1/nlp-massage-scanner-/pkgs/container/nlp-massage-scanner-
```

**Authentication errors:**
```bash
# Re-authenticate with GitHub token
docker login ghcr.io
# Provide GitHub Personal Access Token with read:packages scope
```

**Want to go back to local builds?**

Replace in `docker-compose.yml`:
```yaml
# From:
image: ghcr.io/az2oo1/nlp-massage-scanner-:latest

# To:
build: .
```

Then run:
```bash
docker-compose up -d
```
