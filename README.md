Express app with a full CI/CD pipeline: Jenkins, Docker, GitHub webhook auto-deploy.

## Pipeline stages
Checkout → Install → Lint + Test (parallel) → Build Docker Image → Deploy (main branch only)

## Run locally
npm install
npm start
