# GitHub Actions Workflow Setup Guide

## Overview

Two workflows have been created for building and publishing your Docker image:

1. **docker-build-publish.yml** - Publishes to GitHub Container Registry (GHCR)
2. **docker-publish-dockerhub.yml** - Publishes to Docker Hub

## Configuration

### For GitHub Container Registry (GHCR) - Recommended

The `docker-build-publish.yml` workflow works automatically without additional secrets:

1. **Workflows already use GITHUB_TOKEN** - No extra setup needed
2. **Push to triggers:**
   - Commits to `main` and `develop` branches
   - Any git tags starting with `v` (e.g., `v1.0.0`)
   - Pull requests (builds only, doesn't push)

3. **Image tags generated:**
   - `main` → `latest`
   - `develop` → `develop`
   - `v1.0.0` → `v1.0.0`, `1.0`, `1`
   - Commit SHA tags

### For Docker Hub - Optional

To use the Docker Hub workflow, add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:
   - `DOCKERHUB_USERNAME` - Your Docker Hub username
   - `DOCKERHUB_TOKEN` - Your Docker Hub access token (create at https://hub.docker.com/settings/security)

## Usage

### Automatic Publishing

Just push your code and tags:

```bash
# Push to trigger GHCR build
git push origin main

# Create a version tag to trigger both workflows
git tag v1.0.0
git push origin v1.0.0
```

### Manual Build

If needed, you can manually build and push locally:

```bash
# Build for production
docker build -t nlp-massage-scanner:latest .

# Push to GHCR (if logged in)
docker tag nlp-massage-scanner:latest ghcr.io/YOUR_USERNAME/nlp-massage-scanner:latest
docker push ghcr.io/YOUR_USERNAME/nlp-massage-scanner:latest

# Or push to Docker Hub
docker tag nlp-massage-scanner:latest YOUR_DOCKERHUB_USERNAME/nlp-massage-scanner:latest
docker push YOUR_DOCKERHUB_USERNAME/nlp-massage-scanner:latest
```

## Workflow Features

✅ **Auto-tagging** - Automatically tags based on branch/tag
✅ **Build caching** - Uses GitHub Actions cache for faster builds
✅ **PR testing** - Builds and tests images on pull requests (doesn't push)
✅ **Multi-platform** - Can be extended to build for ARM/x86 architectures
✅ **Security** - Uses GitHub token rotation and official Docker actions

## Versioning Strategy

- **Main branch** → `latest` tag
- **Develop branch** → `develop` tag
- **Git tags** → Semantic versioning (v1.0.0 → 1.0.0, 1.0, 1)
- **Commits** → Short SHA prefix

## Example Workflow

```
1. Make changes locally
2. git commit
3. git push origin main       # Triggers GHCR build (latest)
4. git tag v1.0.0
5. git push origin v1.0.0     # Triggers both workflows with version tags
```

## Viewing Published Images

### GHCR
```bash
docker pull ghcr.io/YOUR_USERNAME/nlp-massage-scanner:latest
```

### Docker Hub (if configured)
```bash
docker pull YOUR_DOCKERHUB_USERNAME/nlp-massage-scanner:latest
```

## Troubleshooting

**Workflow not running:**
- Ensure branch protection rules allow GitHub Actions
- Check that the workflow file is in `.github/workflows/`

**Push failed:**
- Verify secrets are correctly set for Docker Hub
- Check authentication tokens haven't expired

**Build failures:**
- Review workflow logs in Actions tab
- Ensure Dockerfile is valid and all dependencies install

## Monitoring Builds

1. Go to your repository's **Actions** tab
2. Select the workflow to view status
3. Click on runs to see detailed logs
4. All build artifacts are versioned and tagged
