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

## Setup Instructions

### Option 1: Docker Setup (Recommended)

#### Quick Start with Docker Compose
```bash
# Clone the repository
git clone <repository-url>
cd knowledge-spaces

# Start the application
docker-compose up --build -d

# Access the application
open http://localhost:3000
```

#### Alternative Docker Build
```bash
# Build the Docker image
docker build -t knowledge-spaces .

# Run the container
docker run -p 3000:80 knowledge-spaces

# Access the application
open http://localhost:3000
```

### Option 2: Local Development Setup

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
docker-compose logs -f knowledge-spaces

# Rebuild and restart
docker-compose up --build --force-recreate

# Check container health
docker-compose ps
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
- `PORT`: Port for the application (default: 80 in container, exposed as 3000)

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

## Key Features

### Chat-Driven Workflow
- All user interactions happen through natural conversation
- No need to manually configure sidebar settings
- Progressive disclosure of organizational resources

### Source Attribution
- Clear indication of which knowledge spaces provided information
- Color-coded relevance indicators (red=low, yellow=medium, green=high)
- Transparent sourcing from personal vs organizational data

### Healthcare Focus
- Realistic medical scenarios and protocols
- Professional healthcare terminology
- Evidence-based clinical guidelines

## Troubleshooting

### Docker Issues
```bash
# View application logs
docker-compose logs knowledge-spaces

# View all service logs
docker-compose logs

# Restart services
docker-compose restart

# Clean rebuild
docker-compose down && docker-compose up --build
```

### Development Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Support

For issues or questions:
1. Check the logs using the commands above
2. Ensure all dependencies are properly installed
3. Verify Docker is running (for containerized setup)
4. Check that ports 3000 (or 5173 for dev) are available

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both local and Docker setups
5. Submit a pull request

## License

[Add your license information here]