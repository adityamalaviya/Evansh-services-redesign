import { account } from "@/backend/services/appwrite";
import { publicEnv } from '@/lib/env';

const BFF_BASE = publicEnv.bffUrl;

interface ApiError {
  error: { code: string; message: string; fields?: Record<string, string[]> };
}

// ── Cache JWT to avoid generating it multiple times in quick succession ─────
let cachedJwt: string | null = null;
let cacheExpiry = 0;

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const now = Date.now();
    if (cachedJwt && now < cacheExpiry) {
      return { Authorization: `Bearer ${cachedJwt}` };
    }

    const session = await account.get().catch(() => null);
    if (session) {
      const { jwt } = await account.createJWT();
      cachedJwt = jwt;
      cacheExpiry = now + 4 * 60 * 1000; // JWT is valid for 15 mins, cache it for 4 mins
      return { Authorization: `Bearer ${jwt}` };
    }
  } catch (err) {
    // Guest or unauthenticated
  }
  return {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BFF_BASE}${path}`, {
    ...options,
    credentials: 'include', // forward session cookie to BFF if any
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      error: { code: 'NETWORK_ERROR', message: 'A network error occurred.' },
    }));
    throw Object.assign(new Error(err.error.message), {
      code: err.error.code,
      fields: err.error.fields,
      status: res.status,
    });
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Multipart (file upload) helper ──────────────────────────────────────────
async function requestForm<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const res = await fetch(`${BFF_BASE}${path}`, {
    method,
    credentials: 'include',
    body: formData,
    headers: {
      ...authHeaders,
      // Do NOT set Content-Type — browser sets it with boundary for multipart
    },
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      error: { code: 'NETWORK_ERROR', message: 'A network error occurred.' },
    }));
    throw Object.assign(new Error(err.error.message), {
      code: err.error.code,
      status: res.status,
    });
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Public API ───────────────────────────────────────────────────────────────
export const api = {
  // Courses
  getCourses: () => request<{ total: number; courses: any[] }>('/api/courses'),
  getCourseBySlug: (slug: string) => request<any>(`/api/courses/${slug}`),

  // Services
  getServices: () => request<{ total: number; services: any[] }>('/api/services'),

  // Projects
  getProjects: (category?: '3d') =>
    request<{ total: number; projects: any[] }>(
      `/api/projects${category ? `?category=${category}` : ''}`
    ),

  // Contact
  submitContact: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => request<{ success: boolean; message: string }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Admin — Dashboard
  getAdminStats: () => request<any>('/api/admin/stats'),

  // Admin — Courses
  adminGetCourses: () => request<{ total: number; courses: any[] }>('/api/admin/courses'),
  adminGetCourse: (id: string) => request<any>(`/api/admin/courses/${id}`),
  adminCreateCourse: (data: any) =>
    request<any>('/api/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateCourse: (id: string, data: any) =>
    request<any>(`/api/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteCourse: (id: string) =>
    request<void>(`/api/admin/courses/${id}`, { method: 'DELETE' }),

  // Admin — Services
  adminGetServices: () => request<{ total: number; services: any[] }>('/api/admin/services'),
  adminGetService: (id: string) => request<any>(`/api/admin/services/${id}`),
  adminCreateService: (data: any) =>
    request<any>('/api/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateService: (id: string, data: any) =>
    request<any>(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteService: (id: string) =>
    request<void>(`/api/admin/services/${id}`, { method: 'DELETE' }),

  // Admin — Projects (multipart for file uploads)
  adminGetProjects: (category?: '3d') =>
    request<{ total: number; projects: any[] }>(
      `/api/admin/projects${category ? `?category=${category}` : ''}`
    ),
  adminGetProject: (id: string) => request<any>(`/api/admin/projects/${id}`),
  adminCreateProject: (formData: FormData) => requestForm<any>('/api/admin/projects', formData),
  adminUpdateProject: (id: string, formData: FormData) =>
    requestForm<any>(`/api/admin/projects/${id}`, formData, 'PUT'),
  adminDeleteProject: (id: string) =>
    request<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),
};
