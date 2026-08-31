# 🚀 JobHuntingU Developer Handbook

Welcome to the **JobHuntingU** codebase! This guide is designed to help you understand the architecture, deployment, and day-to-day maintenance of the platform.

---

## 🏗️ High-Level Architecture

The project is fully containerized and consists of four main services orchestrated by Docker Compose:

1.  **Frontend (React/Vite)**: A modern UI built with Tailwind CSS and shadcn/ui.
2.  **Backend (Node.js/Express)**: The main API handling authentication, leads, jobs, and blog management.
3.  **Chatbot Backend (Python/FastAPI)**: A RAG (Retrieval-Augmented Generation) system using Gemini AI and ChromaDB for vector storage.
4.  **Database (MySQL)**: Persistent storage for leads, content overrides, jobs, and blog posts.
5.  **Reverse Proxy (Traefik)**: Automatically handles SSL (Let's Encrypt) and routes traffic to the correct containers.

---

## 💻 Local Development

### 1. Prerequisites
- Docker & Docker Desktop
- Node.js (v18+)
- Python (3.11+)

### 2. Setup
1.  Clone the repository.
2.  Create a `.env` file in the root based on `.env.example`.
3.  Install dependencies for local linting/tooling:
    ```bash
    npm install
    cd frontend && npm install
    cd ../backend && npm install
    ```
4.  Start the entire stack:
    ```bash
    docker compose up --build
    ```
    - Website: `http://localhost:3000`
    - API: `http://localhost:3001`
    - Chatbot: `http://localhost:8000`

---

## 🚀 Deployment Workflow

We use **GitHub Actions** for CI/CD.

1.  **The Trigger**: Any push to the `main` branch.
2.  **The Process**:
    - GitHub Actions connects to the VPS via SSH.
    - It runs `git pull` on the server.
    - It triggers `docker compose up --build -d` to rebuild and restart containers.
3.  **Verification**: You will see a green checkmark on your GitHub commit once the deployment is successful.

### Manual Server Maintenance
If you need to change environment variables or perform manual updates:
1.  **Get Access**: The password for the VPS is not stored in the repo. You can generate a new one anytime via the **Hostinger VPS Overview** dashboard.
2.  **SSH into the server**: `ssh root@187.77.31.244`.
3.  **Navigate to the project**: `cd /home/Website`.
4.  **Edit the .env file**: `nano .env`.
5.  **Restart the containers**: `docker compose up -d`.

---

## 🤖 Chatbot & Knowledge Base

The chatbot's "brain" is fueled by documents in `chatbot-backend/knowledge_base_jhu/`.

- **Adding Knowledge**: Place new PDF, TXT, or MD files in that folder.
- **Updating the Index**: When you push to GitHub, the Docker build automatically runs `ingest.py` to rebuild the vector database (`jhu_vectordb`).
- **Local Testing**: If working on the RAG logic, run `python ingest.py` inside the `chatbot-backend` folder to update your local DB.

---

## 🛠️ Common Tasks

### Adding a New Admin
To create a new admin user manually, use the seed script:
```bash
docker exec -it jhu-backend node scripts/seed_admin.js email@example.com password123
```

### Database Migrations
If you change the DB schema, add a new script in `backend/scripts/` and run it via `docker exec`.

### SEO & Meta Tags
- The website uses **Google Jobs SEO** (JSON-LD) for career postings.
- Sitemap and Robots.txt are located in `frontend/public/`.

### Analytics & Monitoring
- **Microsoft Clarity**: Used for session recordings and heatmaps. [Access Clarity](https://clarity.microsoft.com/)
- **Google Search Console**: Used for tracking search performance and indexing status. [Access Search Console](https://search.google.com/search-console)

---

## 📂 Project Structure
- `/frontend`: React application.
- `/backend`: Node.js API & Scripts.
- `/chatbot-backend`: Python RAG API.
- `/docker-compose.yml`: Global orchestration.
- `/ADMIN_GUIDE.md`: Instructions for non-technical users.
