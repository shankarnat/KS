# Knowledge Spaces - Healthcare Assistant

A minimal, clean knowledge spaces assistant for healthcare workflows that manages personal and organizational knowledge spaces.

## Features

- **Personal Knowledge Spaces**: My Clinical Notes, Saved Research, Case Studies
- **Organizational Knowledge Spaces**: Emergency Medicine Protocols, Critical Care Guidelines, Pharmacy Treatment Standards
- **Chat-driven workflow**: All interactions happen through natural conversation
- **Source attribution**: Clear indication of information sources
- **Progressive disclosure**: Organizational resources only appear when explicitly included

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Docker for containerization

## Quick Start with Docker

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd knowledge-spaces

# Start the application
docker-compose up -d

# Access the application
open http://localhost:3000
```

### Option 2: Docker Build and Run

```bash
# Build the Docker image
docker build -t knowledge-spaces .

# Run the container
docker run -p 3000:80 knowledge-spaces

# Access the application
open http://localhost:3000
```

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Commands

```bash
# Build and start services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build --force-recreate
```

## Production Deployment

For production deployment with reverse proxy:

```bash
# Start with production profile
docker-compose --profile production up -d
```

This will start both the main application and an nginx reverse proxy.

## Environment Variables

- `NODE_ENV`: Set to 'production' for production builds
- `PORT`: Port for the application (default: 80 in container)

## Health Checks

The Docker container includes health checks that verify the application is running correctly:

```bash
# Check container health
docker-compose ps
```

## Architecture

The application follows a clean, minimal design:

- **Left Sidebar**: Visual indicator of knowledge spaces (personal vs organizational)
- **Center Chat Interface**: All user interactions happen here
- **No sidebar interactions**: Users interact only through chat
- **Progressive workflow**: Personal → organizational resources as needed

## Usage

1. **Start a conversation**: Type questions about healthcare protocols or treatments
2. **Personal search first**: System searches your personal knowledge spaces
3. **Organizational suggestion**: System suggests including organizational resources when helpful
4. **Choose resources**: Select which organizational spaces to include
5. **Get comprehensive results**: Receive detailed protocols with source attribution

## Example Workflow

1. Type: "What are the current diabetes management protocols?"
2. System shows limited personal space results
3. System suggests organizational resources
4. Click "Include All" to access comprehensive protocols
5. Receive detailed diabetes management guidelines with proper attribution

## Support

For issues or questions, please check the logs:

```bash
# View application logs
docker-compose logs knowledge-spaces

# View all service logs
docker-compose logs
```