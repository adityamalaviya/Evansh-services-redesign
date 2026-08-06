# Dead Code Duplicate Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead code, consolidate duplicated helper logic, and document the single auth source of truth without changing business logic, UI behavior, or API contracts.

**Architecture:** This plan keeps the existing Next.js frontend plus FastAPI/BFF shape intact and limits changes to deletion, import cleanup, and mechanical extractions into shared helpers/hooks. Work is split into the same phase boundaries as the spec so every risky refactor has a compile gate, a build gate, and its own commit.

**Tech Stack:** Next.js App Router, React, TypeScript, FastAPI BFF routes, Git, npm, ripgrep

## Global Constraints

- Do NOT change any business logic, UI behavior, or API contracts.
- Run `npx tsc --noEmit` after every single phase and do not continue with errors.
- Run `npm run build` after Phase 4 and after Phase 9.
- Do not combine phases into one commit.
- If a shared extraction is introduced, preserve existing runtime behavior exactly.
- Treat dynamic imports as a hard stop: if they reference a Phase 1 deletion target, do not delete and wait for a human decision.
- Work on branch `remove-dead-and-duplicate-code`, not `main`.
- Pre-existing generated dirt exists in `tsconfig.tsbuildinfo`; do not include it in cleanup commits unless the user explicitly asks.

---

## File Structure

**Files deleted in this plan**
- `src/lib/api/client.ts`
- `src/lib/api/auth.ts`
- `src/lib/api/contact.ts`
- `src/lib/api/client/portal.ts`
- `src/lib/api/server/courses.ts`
- `src/lib/api/server/projects.ts`
- `src/lib/api/server/services.ts`
- `src/lib/store/authStore.ts`
- `src/providers/QueryProvider.tsx`
- `src/app/footer-demo/page.tsx`
- `src/app/portal/dashboard/page.tsx`
- `src/app/portal/profile/page.tsx`
- `src/app/portal/projects/page.tsx`
- `src/app/portal/projects/[id]/page.tsx`

**Files created in this plan**
- `src/lib/utils/generateSlug.ts`
- `src/lib/utils/isAdminEmail.ts`
- `src/hooks/useQueryModal.ts`
- `src/hooks/useBffData.ts`
- `src/hooks/useAdminSubmit.ts`

**Files modified in this plan**
- `src/components/ErrorBoundary.tsx`
- `src/frontend/modules/About/AboutPage.tsx`
- `src/frontend/modules/About/Components/TeamMemberCard.tsx`
- `src/frontend/modules/Admin/AdminDashboard.tsx`
- `src/frontend/modules/Admin/AdminLoginPage.tsx`
- `src/frontend/modules/Admin/Courses/AdminCoursesPage.tsx`
- `src/frontend/modules/Admin/Courses/CoursesAdminPage.tsx`
- `src/frontend/modules/Admin/Courses/EditCoursePage.tsx`
- `src/frontend/modules/Admin/Projects/AdminProjectsPage.tsx`
- `src/frontend/modules/Admin/Projects/EditProjectPage.tsx`
- `src/frontend/modules/Admin/Projects/NewProjectPage.tsx`
- `src/frontend/modules/Admin/Services/AdminServicesPage.tsx`
- `src/frontend/modules/Admin/Services/EditServicePage.tsx`
- `src/frontend/modules/Admin/Services/ServicesAdminPage.tsx`
- `src/frontend/modules/Auth/AuthLoginPage.tsx`
- `src/frontend/modules/Contact/ContactPage.tsx`
- `src/frontend/modules/Courses/Components/Courses.tsx`
- `src/frontend/modules/Courses/Components/EnrollmentModal.tsx`
- `src/frontend/modules/Services/ServicesPage.tsx`
- `src/frontend/modules/Works/Components/Works.tsx`
- `src/frontend/modules/Works/WorksPage.tsx`
- `src/app/auth/oauth-callback/page.tsx`
- `src/backend/contexts/AuthContext.tsx`
- `bff/src/routes/admin/contact.ts`
- `bff/src/routes/admin/dashboard.ts`
- `bff/src/routes/admin/projects.ts`
- `bff/src/routes/public/courses.ts`
- `bff/src/routes/public/projects.ts`

**Responsibilities**
- `src/lib/utils/*.ts`: shared pure helpers only, no behavior changes.
- `src/hooks/*.ts`: shared client-side hook scaffolding extracted verbatim from live duplicated logic.
- `src/lib/api.ts`: single active frontend API entry point after redundant sub-layer deletion.
- `src/backend/contexts/AuthContext.tsx`: documented auth source of truth.

### Task 1: Preflight And Safety Checks

**Files:**
- Modify: none
- Test: repo state, branch state, import scans

**Interfaces:**
- Consumes: existing branch `remove-dead-and-duplicate-code`
- Produces: verified preflight state for all later tasks

- [ ] **Step 1: Confirm the branch is current with main**

```bash
git fetch origin
git log remove-dead-and-duplicate-code..origin/main --oneline
git checkout remove-dead-and-duplicate-code
git status --short --branch
```

- [ ] **Step 2: Run the dynamic import stop-check**

```bash
rg -n "import\\(" src -g "*.ts" -g "*.tsx"
```

Then manually verify there are no matches containing:

```text
lib/api/client
lib/api/auth
lib/api/contact
lib/api/server
lib/store/authStore
QueryProvider
footer-demo
portal/
```

- [ ] **Step 3: Snapshot import counts for deletion targets**

```bash
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/client" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/auth" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/contact" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/client/portal" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/server/courses" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/server/projects" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/api/server/services" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "lib/store/authStore" src
rg -n --glob "*.ts" --glob "*.tsx" --fixed-strings "QueryProvider" src
```

- [ ] **Step 4: Stop if any hit is a live consumer**

```text
Allowed: self-references inside files that are themselves being deleted.
Blocked: any import/reference from a surviving file.
```

- [ ] **Step 5: Record manual baseline pages**

```text
Home
Services
Courses
Works / Portfolio
Contact
Admin login + dashboard
```

- [ ] **Step 6: Do not commit in this task**

```text
This task only establishes safety conditions for the rest of the plan.
```

### Task 2: Phase 1 Delete Fully Dead Files

**Files:**
- Modify: all files listed in “Files deleted in this plan”
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: zero-live-consumer result from Task 1
- Produces: dead modules removed, no remaining imports to deleted paths

- [ ] **Step 1: Delete the dead files**

```text
Delete:
src/lib/api/client.ts
src/lib/api/auth.ts
src/lib/api/contact.ts
src/lib/api/client/portal.ts
src/lib/api/server/courses.ts
src/lib/api/server/projects.ts
src/lib/api/server/services.ts
src/lib/store/authStore.ts
src/providers/QueryProvider.tsx
src/app/footer-demo/page.tsx
src/app/portal/dashboard/page.tsx
src/app/portal/profile/page.tsx
src/app/portal/projects/page.tsx
src/app/portal/projects/[id]/page.tsx
```

- [ ] **Step 2: Remove any surviving imports to deleted paths**

```bash
rg -n "lib/api/client|lib/api/auth|lib/api/contact|lib/api/client/portal|lib/api/server|lib/store/authStore|QueryProvider|footer-demo|portal/dashboard|portal/profile|portal/projects" src -g "*.ts" -g "*.tsx"
```

- [ ] **Step 3: Delete only import lines or dead references found in surviving files**

```text
Allowed edit shape:
- remove import lines
- remove dead re-exports
- do not rewrite logic
```

- [ ] **Step 4: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit Phase 1**

```bash
git add src
git commit -m "chore: delete dead api layer and unused modules"
```

### Task 3: Phase 2 Remove Unused Imports

**Files:**
- Modify: the 12 files named in the spec for unused import cleanup
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: current branch after Phase 1
- Produces: import-only cleanup with no logic changes

- [ ] **Step 1: Remove only the listed imports**

```text
src/components/ErrorBoundary.tsx: remove `import React from 'react'`
src/frontend/modules/About/AboutPage.tsx: remove `import React from 'react'`
src/frontend/modules/About/Components/TeamMemberCard.tsx: remove `import React from 'react'`
src/frontend/modules/Admin/AdminDashboard.tsx: remove `import React from 'react'` and `Cube`
src/frontend/modules/Admin/Courses/AdminCoursesPage.tsx: remove `import React from 'react'`
src/frontend/modules/Admin/Courses/EditCoursePage.tsx: remove `GraduationCap`
src/frontend/modules/Admin/Projects/AdminProjectsPage.tsx: remove `import React from 'react'`
src/frontend/modules/Admin/Services/AdminServicesPage.tsx: remove `import React from 'react'`
src/frontend/modules/Auth/AuthLoginPage.tsx: remove `loginWithGoogle`
src/frontend/modules/Contact/ContactPage.tsx: remove `databases`, `DB_ID`, `CONTACT_COLLECTION_ID`, `ID`
src/frontend/modules/Services/ServicesPage.tsx: remove `import React from 'react'`, Appwrite imports, and `Query`
src/frontend/modules/Works/Components/Works.tsx: remove `Link`
src/frontend/modules/Works/WorksPage.tsx: remove `import React from 'react'`
```

- [ ] **Step 2: Verify no extra edits leaked in**

```bash
git diff -- src/components/ErrorBoundary.tsx src/frontend/modules/About/AboutPage.tsx src/frontend/modules/About/Components/TeamMemberCard.tsx src/frontend/modules/Admin/AdminDashboard.tsx src/frontend/modules/Admin/Courses/AdminCoursesPage.tsx src/frontend/modules/Admin/Courses/EditCoursePage.tsx src/frontend/modules/Admin/Projects/AdminProjectsPage.tsx src/frontend/modules/Admin/Services/AdminServicesPage.tsx src/frontend/modules/Auth/AuthLoginPage.tsx src/frontend/modules/Contact/ContactPage.tsx src/frontend/modules/Services/ServicesPage.tsx src/frontend/modules/Works/Components/Works.tsx src/frontend/modules/Works/WorksPage.tsx
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit Phase 2**

```bash
git add src
git commit -m "chore: remove unused imports across components"
```

### Task 4: Phase 3 Remove Unused Variables And Constants

**Files:**
- Modify: `src/frontend/modules/Admin/Courses/EditCoursePage.tsx`, `src/frontend/modules/Admin/Projects/EditProjectPage.tsx`, `src/frontend/modules/Admin/Projects/NewProjectPage.tsx`, `src/frontend/modules/Courses/Components/EnrollmentModal.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: current branch after Phase 2
- Produces: declaration-only cleanup

- [ ] **Step 1: Delete only the listed declarations**

```text
src/frontend/modules/Admin/Courses/EditCoursePage.tsx: delete `defaultFeatures`
src/frontend/modules/Admin/Projects/EditProjectPage.tsx: delete `currentImageId`
src/frontend/modules/Admin/Projects/NewProjectPage.tsx: delete `imageId`
src/frontend/modules/Courses/Components/EnrollmentModal.tsx: delete `inputStyle`
```

- [ ] **Step 2: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit Phase 3**

```bash
git add src
git commit -m "chore: remove unused variables and constants"
```

### Task 5: Phase 4 Prefix Unused BFF Route Params

**Files:**
- Modify: `bff/src/routes/admin/contact.ts`, `bff/src/routes/admin/dashboard.ts`, `bff/src/routes/admin/projects.ts`, `bff/src/routes/public/courses.ts`, `bff/src/routes/public/projects.ts`
- Test: `npx tsc --noEmit`, `npm run build`

**Interfaces:**
- Consumes: current branch after Phase 3
- Produces: no-unused-parameters cleanup in BFF route handlers

- [ ] **Step 1: Rename only unused handler params**

```text
req -> _req
```

- [ ] **Step 2: Apply the rename in the five specified route files only**

```text
bff/src/routes/admin/contact.ts
bff/src/routes/admin/dashboard.ts
bff/src/routes/admin/projects.ts
bff/src/routes/public/courses.ts
bff/src/routes/public/projects.ts
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Run Checkpoint A build gate**

```bash
npm run build
```

- [ ] **Step 5: Re-run manual page checks from Task 1**

```text
Home
Services
Courses
Works / Portfolio
Contact
Admin login + dashboard
```

- [ ] **Step 6: Commit Phase 4**

```bash
git add bff/src
git commit -m "chore: prefix unused req params with underscore in bff routes"
```

### Task 6: Phase 5 Extract generateSlug Utility

**Files:**
- Create: `src/lib/utils/generateSlug.ts`
- Modify: `src/frontend/modules/Admin/Services/ServicesAdminPage.tsx`, `src/frontend/modules/Admin/Services/EditServicePage.tsx`, `src/frontend/modules/Admin/Courses/CoursesAdminPage.tsx`, `src/frontend/modules/Admin/Courses/EditCoursePage.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: duplicated inline slug generation blocks
- Produces: `generateSlug(name: string): string`

- [ ] **Step 1: Add the shared utility**

```ts
/**
 * Converts a display name into a URL-safe slug.
 * e.g. "My Course Title" → "my-course-title"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

- [ ] **Step 2: Replace inline slug logic with the utility call**

```text
Import `generateSlug` and swap only the repeated normalization block.
Do not change validation, side effects, or surrounding submit logic.
```

- [ ] **Step 3: Verify the utility output matches the previous inline logic**

```text
Compare old and new transformations for representative values:
"My Course Title"
"  spaced   value  "
"Hello!!! World"
```

- [ ] **Step 4: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit Phase 5**

```bash
git add src/lib/utils/generateSlug.ts src/frontend/modules/Admin/Services/ServicesAdminPage.tsx src/frontend/modules/Admin/Services/EditServicePage.tsx src/frontend/modules/Admin/Courses/CoursesAdminPage.tsx src/frontend/modules/Admin/Courses/EditCoursePage.tsx
git commit -m "refactor: extract generateSlug utility and replace inline copies"
```

### Task 7: Phase 6 Extract isAdminEmail Helper

**Files:**
- Create: `src/lib/utils/isAdminEmail.ts`
- Modify: `src/frontend/modules/Auth/AuthLoginPage.tsx`, `src/frontend/modules/Admin/AdminLoginPage.tsx`, `src/app/auth/oauth-callback/page.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: repeated admin-email normalization and equality checks
- Produces: `isAdminEmail(email: string): boolean`

- [ ] **Step 1: Add the shared helper**

```ts
/**
 * Returns true if the given email belongs to the admin account.
 * Reads NEXT_PUBLIC_ADMIN_EMAIL from env (normalised to lowercase).
 */
export function isAdminEmail(email: string): boolean {
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '').toLowerCase().trim();
  return email.toLowerCase().trim() === adminEmail;
}
```

- [ ] **Step 2: Replace inline admin-email comparisons with `isAdminEmail()`**

```text
Keep existing redirect branches and error behavior unchanged.
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit Phase 6**

```bash
git add src/lib/utils/isAdminEmail.ts src/frontend/modules/Auth/AuthLoginPage.tsx src/frontend/modules/Admin/AdminLoginPage.tsx src/app/auth/oauth-callback/page.tsx
git commit -m "refactor: extract isAdminEmail helper and replace inline copies"
```

### Task 8: Phase 7 Extract useQueryModal Hook

**Files:**
- Create: `src/hooks/useQueryModal.ts`
- Modify: `src/frontend/modules/Courses/Components/Courses.tsx`, `src/frontend/modules/Works/Components/Works.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: duplicated query-param modal state bootstrap logic
- Produces: `useQueryModal(paramName: string): readonly [string | null, Dispatch, boolean, Dispatch]`

- [ ] **Step 1: Add the shared hook**

```ts
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Reads a query param on mount, opens the modal if present,
 * then scrubs the param from the URL so a refresh doesn't re-open it.
 *
 * @param paramName  The query param to watch (e.g. 'course')
 * @returns [selectedId, setSelectedId, isOpen, setIsOpen]
 */
export function useQueryModal(paramName: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const value = searchParams.get(paramName);
    if (value) {
      setSelectedId(value);
      setIsOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(paramName);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, []);

  return [selectedId, setSelectedId, isOpen, setIsOpen] as const;
}
```

- [ ] **Step 2: Replace the duplicate modal bootstrap blocks**

```text
Swap only the state-init and URL-scrub logic.
Do not change modal open handlers, selected item handling, or JSX structure.
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit Phase 7**

```bash
git add src/hooks/useQueryModal.ts src/frontend/modules/Courses/Components/Courses.tsx src/frontend/modules/Works/Components/Works.tsx
git commit -m "refactor: extract useQueryModal hook and replace inline copies"
```

### Task 9: Phase 8 Extract useBffData Hook

**Files:**
- Create: `src/hooks/useBffData.ts`
- Modify: `src/frontend/modules/Courses/Components/Courses.tsx`, `src/frontend/modules/Works/Components/Works.tsx`, `src/frontend/modules/Services/ServicesPage.tsx`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: duplicated fetch, map, warn, fallback scaffolding
- Produces: `useBffData<T>({ url, map, warningLabel }): { data: T[]; loading: boolean; error: string | null }`

- [ ] **Step 1: Add the shared hook**

```ts
import { useEffect, useState } from 'react';

interface UseBffDataOptions<T> {
  url: string;
  map: (raw: unknown) => T[];
  warningLabel: string;
}

/**
 * Fetches data from the BFF, maps the response, and falls back to []
 * with a console.warn on failure.
 */
export function useBffData<T>({ url, map, warningLabel }: UseBffDataOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(raw => setData(map(raw)))
      .catch(err => {
        console.warn(`[${warningLabel}] BFF fetch failed, falling back to []:`, err);
        setError(String(err));
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

- [ ] **Step 2: Preserve the existing `map()` logic exactly in each caller**

```text
Only move fetch/warn/fallback scaffolding into the hook.
Do not normalize or reshape mapped data differently.
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit Phase 8**

```bash
git add src/hooks/useBffData.ts src/frontend/modules/Courses/Components/Courses.tsx src/frontend/modules/Works/Components/Works.tsx src/frontend/modules/Services/ServicesPage.tsx
git commit -m "refactor: extract useBffData hook and replace inline fetch/map/fallback copies"
```

### Task 10: Phase 9 Extract useAdminSubmit Hook

**Files:**
- Create: `src/hooks/useAdminSubmit.ts`
- Modify: `src/frontend/modules/Admin/Services/ServicesAdminPage.tsx`, `src/frontend/modules/Admin/Courses/CoursesAdminPage.tsx`, `src/frontend/modules/Admin/Projects/NewProjectPage.tsx`
- Test: `npx tsc --noEmit`, `npm run build`

**Interfaces:**
- Consumes: repeated admin submit boilerplate
- Produces: `useAdminSubmit<T>({ onSubmit, redirectTo, formatError }): { handleSubmit, submitting, error }`

- [ ] **Step 1: Add the shared hook**

```ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseAdminSubmitOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  redirectTo: string;
  formatError?: (err: unknown) => string;
}

/**
 * Handles the standard admin create/edit submit flow:
 * clear error → set submitting → call API → redirect on success → format error on failure.
 */
export function useAdminSubmit<T>({
  onSubmit,
  redirectTo,
  formatError,
}: UseAdminSubmitOptions<T>) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: T) => {
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(data);
      router.push(redirectTo);
    } catch (err) {
      setError(formatError ? formatError(err) : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return { handleSubmit, submitting, error };
}
```

- [ ] **Step 2: Replace only the submit scaffolding in the three admin pages**

```text
Keep validation, API call bodies, redirects, and error strings identical.
```

- [ ] **Step 3: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Run Checkpoint B build gate**

```bash
npm run build
```

- [ ] **Step 5: Re-run manual page checks from Task 1**

```text
Home
Services
Courses
Works / Portfolio
Contact
Admin login + dashboard
```

- [ ] **Step 6: Commit Phase 9**

```bash
git add src/hooks/useAdminSubmit.ts src/frontend/modules/Admin/Services/ServicesAdminPage.tsx src/frontend/modules/Admin/Courses/CoursesAdminPage.tsx src/frontend/modules/Admin/Projects/NewProjectPage.tsx
git commit -m "refactor: extract useAdminSubmit hook and replace inline create-submit copies"
```

### Task 11: Phases 10 Through 12 Consolidation And Documentation

**Files:**
- Modify: `src/backend/contexts/AuthContext.tsx`, `src/frontend/modules/Services/ServicesPage.tsx`, `src/frontend/modules/Contact/ContactPage.tsx`
- Delete: any remaining files under `src/lib/api/`
- Test: `npx tsc --noEmit`

**Interfaces:**
- Consumes: dead sub-layer removed, shared hooks in place
- Produces: consolidated API surface, documented auth source of truth, no stray Appwrite imports in BFF-backed pages

- [ ] **Step 1: Verify `src/lib/api/` has no surviving dead files**

```bash
Get-ChildItem src/lib/api -Recurse -ErrorAction SilentlyContinue
```

- [ ] **Step 2: Remove any remaining dead files in `src/lib/api/` and the directory if empty**

```text
Keep `src/lib/api.ts` as the single active API entry point.
Delete only files under `src/lib/api/` that are not live.
```

- [ ] **Step 3: Confirm `authStore` has no surviving references**

```bash
rg -n "authStore" src -g "*.ts" -g "*.tsx"
```

- [ ] **Step 4: Add the auth source-of-truth comment**

```ts
// Single source of truth for auth state. Do not create parallel auth stores.
```

- [ ] **Step 5: Remove stray Appwrite imports and dead unreachable Appwrite code**

```text
Target files:
src/frontend/modules/Services/ServicesPage.tsx
src/frontend/modules/Contact/ContactPage.tsx

Allowed cleanup:
- remove imports from 'appwrite'
- remove imports from '@/lib/appwrite'
- remove dead unreachable Appwrite calls
- keep BFF fetch paths intact
```

- [ ] **Step 6: Run TypeScript gate**

```bash
npx tsc --noEmit
```

- [ ] **Step 7: Commit Phase 10**

```bash
git add src/lib src/backend/contexts/AuthContext.tsx
git commit -m "refactor: remove redundant api sub-layer, consolidate into src/lib/api.ts"
```

- [ ] **Step 8: Commit Phase 11**

```bash
git add src/backend/contexts/AuthContext.tsx
git commit -m "chore: confirm authStore deleted, document AuthContext as auth source of truth"
```

- [ ] **Step 9: Commit Phase 12**

```bash
git add src/frontend/modules/Services/ServicesPage.tsx src/frontend/modules/Contact/ContactPage.tsx
git commit -m "chore: remove stray appwrite imports from bff-backed pages"
```

### Task 12: Final Verification

**Files:**
- Modify: none unless verification reveals a real issue
- Test: full suite from the spec

**Interfaces:**
- Consumes: all prior commits
- Produces: final proof bundle for merge decision

- [ ] **Step 1: Run TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 2: Run production build**

```bash
npm run build
```

- [ ] **Step 3: Confirm all dead files are gone**

```bash
Get-ChildItem src/lib/api/client.ts,src/lib/api/auth.ts,src/lib/api/contact.ts,src/lib/api/client/portal.ts,src/lib/api/server/courses.ts,src/lib/api/server/projects.ts,src/lib/api/server/services.ts,src/lib/store/authStore.ts,src/providers/QueryProvider.tsx,src/app/footer-demo/page.tsx,src/app/portal/dashboard/page.tsx,src/app/portal/profile/page.tsx,src/app/portal/projects/page.tsx,"src/app/portal/projects/[id]/page.tsx" -ErrorAction SilentlyContinue
```

- [ ] **Step 4: Confirm all five shared utilities/hooks exist**

```bash
Get-ChildItem src/lib/utils/generateSlug.ts,src/lib/utils/isAdminEmail.ts,src/hooks/useQueryModal.ts,src/hooks/useBffData.ts,src/hooks/useAdminSubmit.ts
```

- [ ] **Step 5: Confirm no stray Appwrite imports remain in BFF-backed pages**

```bash
rg -n "from 'appwrite'|from '@/lib/appwrite'" src/frontend/modules/Services/ServicesPage.tsx src/frontend/modules/Contact/ContactPage.tsx
```

- [ ] **Step 6: Confirm `authStore` has no remaining references**

```bash
rg -n "authStore" src -g "*.ts" -g "*.tsx"
```

- [ ] **Step 7: Re-run the six manual page checks**

```text
Home
Services
Courses
Works / Portfolio
Contact
Admin login + dashboard
```

- [ ] **Step 8: Prepare merge only after all checks pass**

```bash
git log --oneline --decorate -12
```

## Self-Review

**Spec coverage:** The plan covers preflight branch sync and dynamic-import checks, all 12 cleanup phases, both build checkpoints, per-phase `npx tsc --noEmit`, separate commits per phase, final verification, and the merge handoff conditions. The only non-automated requirement is manual browser page checks, which are explicitly repeated at both checkpoints and final verification.

**Placeholder scan:** No `TODO`, `TBD`, or “similar to Task N” placeholders remain. Each task names exact files, commands, or code to add.

**Type consistency:** Shared artifacts are defined once and then referenced with the same names and signatures: `generateSlug(name: string): string`, `isAdminEmail(email: string): boolean`, `useQueryModal(paramName: string)`, `useBffData<T>({ url, map, warningLabel })`, and `useAdminSubmit<T>({ onSubmit, redirectTo, formatError })`.

Plan complete and saved to `docs/superpowers/plans/2026-08-05-dead-code-duplicate-cleanup.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
