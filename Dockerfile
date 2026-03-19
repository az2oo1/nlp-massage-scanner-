# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your server runs on
EXPOSE 11434

# Set environment to production (optional)
ENV NODE_ENV=production

# Command to run your server
CMD ["node", "server.js"]
