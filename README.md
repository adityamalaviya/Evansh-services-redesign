# Evansh Services — Redesign

Full-stack redesign of [evanshservices.com](https://evanshservices.com) — an IT services, courses, and 3D printing business based in Gandhidham.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| BFF | Node.js (Express) — port 3001 |
| Pipeline | FastAPI (Python 3.12) — port 8000 |
| Database / Storage | Appwrite Cloud |
| Auth | JWT |
| CI/CD | GitHub Actions → GHCR |
| Infra | Docker, Nginx, Certbot (VPS) |

> **Architecture rule:** Next.js never calls Appwrite directly. All data access goes through the BFF → Pipeline → Appwrite.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/)
- [Node.js 20+](https://nodejs.org/) — only needed for frontend dev
- [Python 3.11+](https://www.python.org/) — only needed for local pipeline dev

---

## Project Structure

```
Evansh-services-redesign/
├── src/                        # Next.js frontend
├── bff/                        # Node.js BFF (Express)
├── pipeline/                   # FastAPI Python backend
├── public/
├── .github/workflows/          # CI/CD — auto builds Docker images on push to main
├── docker-compose.yml          # Build locally
├── docker-compose.ghcr.yml     # Pull pre-built images from GHCR (recommended for team)
├── .env                        # Root env (not committed)
└── pipeline/.env               # Pipeline env (not committed)
```

---

## Quick Start (Recommended for Team Members)

Pre-built Docker images are published automatically to GHCR on every push to `main`. No need to build anything locally.

### 1. Clone the repository

```bash
git clone https://github.com/adityamalaviya/Evansh-services-redesign.git
cd Evansh-services-redesign
```

### 2. Create environment files

```bash
cp pipeline/.env.example pipeline/.env
```

Fill in `pipeline/.env` with values shared by the team lead:

```env
PIPELINE_SERVICE_TOKEN=
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
ADMIN_EMAIL=
```

### 3. Pull images and start

```bash
docker compose -f docker-compose.ghcr.yml up -d
```

Both containers should show **Healthy** / **Started**:

```
✔ Container evansh-services-redesign-pipeline-1  Healthy
✔ Container evansh-services-redesign-bff-1       Started
```

### 4. Run the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Local Development (Build from Source)

Use this if you're making changes to the BFF or Pipeline and want to test before pushing.

### 1. Create environment files

```bash
cp .env.example .env
cp pipeline/.env.example pipeline/.env
# fill in values
```

### 2. Build and start

```bash
docker compose up -d bff pipeline
```

### 3. Rebuild after code changes

```bash
docker compose up -d --build bff pipeline
```

---

## CI/CD

Every push to `main` triggers the **Build & Publish Docker Images** GitHub Actions workflow which:

1. Builds the `bff` and `pipeline` Docker images
2. Publishes them to GHCR:
   - `ghcr.io/adityamalaviya/evansh-bff:latest`
   - `ghcr.io/adityamalaviya/evansh-pipeline:latest`

Team members can pull the latest images anytime:

```bash
docker compose -f docker-compose.ghcr.yml pull
docker compose -f docker-compose.ghcr.yml up -d
```

---

## Services

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| BFF (Express) | http://localhost:3001 |
| Pipeline (FastAPI) | http://localhost:8000 |
| Pipeline Health | http://localhost:8000/health |

---

## Debugging

**Check container logs:**

```bash
docker compose logs pipeline
docker compose logs bff
```

**Restart containers:**

```bash
docker compose down
docker compose up -d bff pipeline
```

---

## Local Pipeline Development (optional)

If you want to run the pipeline locally without Docker:

```bash
cd pipeline
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Environment Variables Reference

### Root `.env`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BFF_URL` | BFF URL for frontend |
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite endpoint |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `NEXT_PUBLIC_APPWRITE_DB_ID` | Appwrite database ID |
| `NEXT_PUBLIC_APPWRITE_BUCKET_ID` | Appwrite storage bucket ID |
| `ADMIN_EMAIL` | Admin email address |
| `RESEND_API_KEY` | Resend API key for emails |
| `REVALIDATE_SECRET` | Next.js ISR revalidation secret |

### `pipeline/.env`

| Variable | Description |
|---|---|
| `PIPELINE_SERVICE_TOKEN` | Shared secret between BFF and pipeline |
| `APPWRITE_ENDPOINT` | Appwrite endpoint |
| `APPWRITE_PROJECT_ID` | Appwrite project ID |
| `APPWRITE_API_KEY` | Appwrite server API key |
| `ADMIN_EMAIL` | Admin email address |

---

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push: `git push --set-upstream origin feature/your-feature`
4. Open a Pull Request on GitHub
5. Once merged to `main`, Docker images are automatically rebuilt

---

## License

Private — Evansh Services © 2026
