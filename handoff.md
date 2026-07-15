# Evansh Services — Engineering Handoff

## Project context

Evansh Services is a web application composed of:

- A Next.js frontend using the App Router and React.
- A Node.js/TypeScript BFF that exposes frontend-facing API routes and integrates with Appwrite.
- A FastAPI pipeline service for internal validation and processing.
- Appwrite for database, storage, authentication, and server-side administration.
- Docker Compose for local orchestration of the BFF and pipeline services.

The current work is limited to build, dependency, wiring, testing, configuration, and credential-hygiene fixes. UI pages, components, styles, copy, routes, and API response shapes must not be changed without an explicit product decision.

## Goal

Make the project buildable, correctly configured, testable, and safer to operate while preserving the existing UI and public behavior.

## Done

### BFF build configuration

- Updated `bff/tsconfig.json`:
  - `module`: `NodeNext`
  - `moduleResolution`: `NodeNext`
- Preserved the existing CommonJS output behavior because `bff/package.json` does not declare `"type": "module"`.
- Verified that `npm run build` succeeds in `bff/`.

### Pipeline dependency and wiring status

- Confirmed `email-validator==2.2.0` is present in `pipeline/requirements.txt` for the `EmailStr` schema field.
- Added a clear `TODO(unwired)` comment at `bff/src/lib/fastapi.ts`.
- Added a non-UI smoke test at `bff/src/lib/fastapi.test.ts` for `callPipeline` request construction and JSON handling.
- `callPipeline` was intentionally not wired into a route.

### FastAPI service investigation

- Confirmed `pipeline/` contains the real FastAPI implementation, including:
  - `pipeline/app/main.py`
  - validation and slug routes
  - middleware and schemas
  - `pipeline/requirements.txt`
  - `pipeline/Dockerfile`
- Confirmed Docker Compose defines `pipeline` as the internal FastAPI service.
- Confirmed `fastapi-backend/` contains only cached bytecode and a Windows virtual environment, with no real source, Dockerfile, requirements file, or Compose service.
- No FastAPI scaffolding was added.

### Credential hygiene

- `.env` files are covered by `.gitignore`.
- Local environment files are not currently tracked.
- No history entry containing `APPWRITE_API_KEY=` was found.
- The live-looking Appwrite API key in `bff/.env` was identified for immediate rotation.

## In process / blocked

### Next.js dependency and SWC verification

- Cache cleanup was attempted for `.next` and `node_modules/.next-cache`.
- The root dependency reinstall stalled and was interrupted.
- After the interrupted reinstall, `next` was temporarily unavailable, so the final root `next build` could not complete.
- Before reinstall, the environment was Linux x64 with glibc 2.43 and the matching GNU SWC package was present. No arm64/musl mismatch was found.

### BFF smoke test verification

- The smoke test was added and its initial TypeScript issues were corrected.
- The Jest process did not produce a reliable completion result in the current environment and was terminated after hanging. Re-run after dependencies are stable:

```bash
cd bff
npm test -- --runInBand
```

### Python import verification

- Import verification was blocked because the active shell has no installed Python `pydantic` package and no `python` executable.
- Install the pipeline requirements in a Linux-compatible environment, then run:

```bash
cd pipeline
python3 -m pip install -r requirements.txt
python3 -c "from app.schemas.contact import ContactValidateRequest; print('contact schema import: ok')"
```

## Remaining work and decisions

1. Decide whether `pipeline/` is the canonical FastAPI service and whether `fastapi-backend/` should be archived or removed. Do not scaffold either service until this is confirmed.
2. Decide whether `callPipeline()` should be wired into an existing route, such as contact submission, or removed as dead code.
3. Restore root dependencies with a functioning npm registry/cache, then run:

```bash
npm ci
npm run build
```

4. Re-run the BFF Jest smoke test after dependencies are stable.
5. Install Python dependencies and verify the contact schema import.
6. Rotate the Appwrite API key from `bff/.env` in the Appwrite console.
7. Replace the development pipeline service token before production deployment.
8. Do not commit any local `.env` files or live credentials.

## Files intentionally not changed

No files under the frontend UI scope were modified, including:

- `src/app/`
- `src/components/`
- `src/frontend/`
- UI styles, JSX/TSX markup, page routes, copy, or component props

These areas remain protected by the no-UI-change requirement.

## Handoff commands

From the project root:

```bash
# BFF
cd bff && npm run build
cd ..

# Root Next.js application
npm ci
npm run build

# Pipeline
cd pipeline
python3 -m pip install -r requirements.txt
python3 -c "from app.schemas.contact import ContactValidateRequest; print('contact schema import: ok')"
```
