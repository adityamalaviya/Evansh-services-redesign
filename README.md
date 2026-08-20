# Evansh Services — Redesign

Full-stack redesign of [evanshservices.com](https://evanshservices.com) — an IT training and digital services business based in Gandhidham, Gujarat.

**Live site:** [evansh-services-redesign.vercel.app](https://evansh-services-redesign.vercel.app)

---

## About the Business

Evansh Services empowers students through concept-based learning and expert guidance. It offers:

- **IT Training & Internships** — concept-based courses with personal attention, doubt sessions, and flexible batches
- **Digital Services** — web/app development, Android apps, domain & hosting, bulk SMS/email, digital marketing, logo & banner design, thesis/report writing, printing, research, training & placement
- **Faculty** — led by Vimal Vaniya (15+ years of teaching & development experience)

Address: SDB-82, Ward 2A, 1st Floor, Above Yuva Collection, Adipur, Gandhidham, Gujarat 370205

---

## Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Frontend  | Next.js 14 + TypeScript + Tailwind CSS (Vercel)   |
| BFF       | Node.js/Express — port 3001 (Render)              |
| Pipeline  | FastAPI Python 3.12 — port 8000 (Render)          |
| Database  | Appwrite Cloud                                    |
| Auth      | JWT + OAuth (Google, GitHub, Facebook)            |
| Email     | Resend                                            |
| CI/CD     | GitHub Actions → GHCR → Docker                   |

> **Architecture rule:** Next.js never calls Appwrite directly — all data flows through BFF → Pipeline → Appwrite.

---

## Quick Start

### Prerequisites
- Docker Desktop, Git, Node.js 20+, pnpm

### Run locally

```bash
git clone https://github.com/adityamalaviya/Evansh-services-redesign.git
cd Evansh-services-redesign

cp .env.example .env
cp pipeline/.env.example pipeline/.env
# fill in values from team lead

docker compose -f docker-compose.ghcr.yml up -d   # starts BFF + Pipeline
pnpm install && pnpm dev                           # starts Next.js at localhost:3000
```

| Service  | URL                          |
| -------- | ---------------------------- |
| Frontend | http://localhost:3000        |
| BFF      | http://localhost:3001        |
| Pipeline | http://localhost:8000        |

---

## Environment Variables

See `.env.example` and `pipeline/.env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APPWRITE_*` | Appwrite project config (browser-safe) |
| `NEXT_PUBLIC_BFF_URL` | BFF URL for frontend |
| `APPWRITE_API_KEY` | Server-only Appwrite key — **rotate before production** |
| `PIPELINE_SERVICE_TOKEN` | Shared secret between BFF and Pipeline |
| `RESEND_API_KEY` | Transactional email |
| `REVALIDATE_SECRET` | Next.js ISR secret |

---

## Contributing

```bash
git checkout -b feature/your-feature
# make changes
git commit -m "feat: your feature"
git push --set-upstream origin feature/your-feature
# open PR — CodeRabbit reviews automatically
# merge to main → Docker images rebuild and deploy
```

See [`handoff.md`](./handoff.md) for implementation status and known blockers.

---

## License

Private — Evansh Services © 2026
