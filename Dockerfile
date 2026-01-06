# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Expose port (default NestJS port)
EXPOSE 3000

# Set environment variables (example, override in deployment)
ENV NODE_ENV=production

# Start the NestJS app
CMD ["npm", "run", "start:prod"]
