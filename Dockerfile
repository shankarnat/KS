# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to host static files
RUN npm install -g serve

# Copy built files
COPY --from=build /app/dist ./dist

ENV PORT 5000

EXPOSE 5000

# Heroku assigns the port dynamically
CMD serve -s dist -l $PORT