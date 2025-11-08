# Basketball Substitution Manager

A React-based web application for managing basketball team substitutions with an intuitive drag-and-drop interface.

## Features

- **Player Management**: Add and remove players from your team
- **Drag & Drop Interface**: Easily move players between bench and court positions
- **5 Court Positions**: Point Guard, Shooting Guard, Small Forward, Power Forward, and Center
- **Substitution Tracking**: Queue up multiple substitutions and execute them all at once
- **Visual Court Layout**: Clear visualization of who's on the court and in which position
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BBall-sub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## How to Use

### Adding Players

1. In the left panel, enter a player's name in the "Add Player" input field
2. Click "Add to Team" to add the player to your bench

### Moving Players to Court

**Method 1: Drag and Drop**
1. Click and hold on a player in the bench
2. Drag them to one of the 5 court positions
3. Release to place them on the court

**Method 2: Direct Placement**
1. Simply drag any bench player to an empty court position
2. If you drag a player to an occupied position, they will swap

### Managing Substitutions

**Quick Substitution:**
1. Click the "Sub" button on any player currently on the court
2. Select a bench player from the dropdown menu
3. The substitution will be added to the "Pending Substitutions" panel

**Execute Substitutions:**
1. After adding one or more substitutions to the queue
2. Click "Execute All Substitutions" in the right panel
3. All pending substitutions will be completed simultaneously

### Removing Players

**From Bench:**
- Click the "×" button on any bench player to remove them from the team

**From Court:**
- Click the "×" button on any court player to move them back to the bench

## Project Structure

```
BBall-sub/
├── src/
│   ├── components/
│   │   ├── AddPlayer.jsx        # Component for adding new players
│   │   ├── AddPlayer.css
│   │   ├── Bench.jsx             # Bench display with draggable players
│   │   ├── Bench.css
│   │   ├── Court.jsx             # Court with 5 positions and drop zones
│   │   ├── Court.css
│   │   ├── SubstitutionManager.jsx  # Pending substitutions tracker
│   │   └── SubstitutionManager.css
│   ├── App.jsx                   # Main application component
│   ├── App.css
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── package.json
└── README.md
```

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Docker Deployment

### Building the Docker Image

The application includes a multi-stage Dockerfile that builds the React app and serves it with nginx.

```bash
# Build using Docker directly
docker build -t basketball-sub:latest .

# Or use the Makefile
make build-image

# Build with custom tag
make build-image IMAGE_TAG=v1.0.0
```

### Running the Container Locally

```bash
# Run on port 8080
docker run --rm -p 8080:80 basketball-sub:latest

# Or use the Makefile
make docker-run
```

Visit http://localhost:8080 to access the application.

### Pushing to a Registry

```bash
# Using Docker
docker tag basketball-sub:latest myregistry.com/basketball-sub:v1.0.0
docker push myregistry.com/basketball-sub:v1.0.0

# Or use the Makefile
make push-image REPO_NAME=myregistry.com/basketball-sub IMAGE_TAG=v1.0.0
```

## Kubernetes Deployment with Helm

### Prerequisites

- Kubernetes cluster (v1.19+)
- Helm 3.x installed
- kubectl configured to access your cluster

### Helm Chart Structure

The Helm chart supports multiple service exposure methods:
- **ClusterIP**: Internal cluster access only (default)
- **NodePort**: Expose on each node's IP at a static port
- **LoadBalancer**: Expose using a cloud provider's load balancer
- **Ingress**: HTTP/HTTPS routing with Ingress controller
- **Gateway API**: Modern service mesh routing

### Quick Start

```bash
# Build the Helm chart
make build-chart

# Install with default values (ClusterIP)
helm install basketball-sub helm/basketball-sub

# Install with custom values
helm install basketball-sub helm/basketball-sub \
  --set image.repository=myregistry.com/basketball-sub \
  --set image.tag=v1.0.0
```

### Exposure Methods

#### 1. NodePort

```bash
helm install basketball-sub helm/basketball-sub \
  --set service.type=NodePort \
  --set service.nodePort=30080
```

Access via: `http://<node-ip>:30080`

#### 2. LoadBalancer

```bash
helm install basketball-sub helm/basketball-sub \
  --set service.type=LoadBalancer
```

Get the LoadBalancer IP:
```bash
kubectl get svc basketball-sub
```

#### 3. Ingress

```bash
helm install basketball-sub helm/basketball-sub \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.hosts[0].host=basketball-sub.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix
```

With TLS:
```bash
helm install basketball-sub helm/basketball-sub \
  --set ingress.enabled=true \
  --set ingress.className=nginx \
  --set ingress.hosts[0].host=basketball-sub.example.com \
  --set ingress.hosts[0].paths[0].path=/ \
  --set ingress.hosts[0].paths[0].pathType=Prefix \
  --set ingress.tls[0].secretName=basketball-sub-tls \
  --set ingress.tls[0].hosts[0]=basketball-sub.example.com
```

#### 4. Gateway API (for Service Mesh)

```bash
helm install basketball-sub helm/basketball-sub \
  --set gateway.enabled=true \
  --set gateway.gatewayName=default-gateway \
  --set gateway.gatewayNamespace=gateway-system \
  --set gateway.hostnames[0]=basketball-sub.example.com
```

### Custom Values File

Create a `values-prod.yaml` file:

```yaml
replicaCount: 3

image:
  repository: myregistry.com/basketball-sub
  tag: "v1.0.0"
  pullPolicy: Always

service:
  type: LoadBalancer

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: basketball-sub.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: basketball-sub-tls
      hosts:
        - basketball-sub.example.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 200m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
```

Deploy with custom values:
```bash
helm install basketball-sub helm/basketball-sub -f values-prod.yaml
```

### Helm Chart Operations

```bash
# List installed releases
helm list

# Upgrade an existing release
helm upgrade basketball-sub helm/basketball-sub -f values-prod.yaml

# Rollback to previous version
helm rollback basketball-sub

# Uninstall
helm uninstall basketball-sub

# View rendered templates
helm template basketball-sub helm/basketball-sub

# Push chart to OCI registry
make push-chart HELM_REGISTRY=oci://registry.example.com/charts
```

## Makefile Commands

The project includes a comprehensive Makefile for building and deploying:

```bash
# Show all available commands
make help

# Docker operations
make build-image                          # Build Docker image
make push-image REPO_NAME=my/repo        # Push to registry
make docker-run                           # Run container locally

# Helm operations
make build-chart                          # Package Helm chart
make push-chart HELM_REGISTRY=oci://...  # Push chart to registry
make lint                                 # Lint Helm charts

# Development
make install-dev                          # Install npm dependencies
make dev                                  # Start dev server
make build                                # Build production bundle

# Combined operations
make all                                  # Build image and chart
make release                              # Build and push everything
make clean                                # Clean build artifacts
```

### Makefile Variables

All Makefile targets support customization via variables:

```bash
make build-image \
  IMAGE_NAME=basketball-sub \
  IMAGE_TAG=v1.0.0 \
  REGISTRY=ghcr.io \
  REPO_NAME=ghcr.io/myorg/basketball-sub

make push-chart \
  CHART_VERSION=1.0.0 \
  HELM_REGISTRY=oci://ghcr.io/myorg/charts
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and development server
- **HTML5 Drag and Drop API**: For drag-and-drop functionality
- **CSS3**: For styling and animations

## Browser Support

This application works best on modern browsers that support:
- HTML5 Drag and Drop API
- CSS Grid and Flexbox
- ES6+ JavaScript features

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
