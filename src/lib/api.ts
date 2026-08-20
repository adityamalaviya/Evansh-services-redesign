import { account } from "@/lib/appwrite/client";
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

// ponytail: unified fetch handler handles JSON and FormData without duplicated error parsing
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders();
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${BFF_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const requestForm = <T>(path: string, formData: FormData, method = 'POST'): Promise<T> =>
  request<T>(path, { method, body: formData });

export function formatApiError(err: any, fallback: string): string {
  if (err?.status === 401) {
    return "Session expired. Please log in again.";
  }
  if (!err?.status) {
    // Network failure (fetch threw without HTTP status response)
    return fallback;
  }
  const fields = err?.fields as Record<string, string[]> | undefined;
  if (fields) {
    const details = Object.entries(fields)
      .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`))
      .join("; ");
    if (details) return `${err?.message || fallback} (${details})`;
  }
  return err?.message ? `${err.message} (status ${err.status})` : `Something went wrong (status ${err.status}).`;
}

// ── Public API ───────────────────────────────────────────────────────────────
export const api = {
  // Courses
  getCourses: () => request<{ total: number; courses: any[] }>('/api/courses'),
  getCourseBySlug: (slug: string) => request<any>(`/api/courses/${slug}`),

  // Services
  getServices: () => request<{ total: number; services: any[] }>('/api/services'),

  // Projects
  getProjects: () =>
    request<{ total: number; projects: any[] }>('/api/projects'),

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
  submitEnrollment: (data: {
    id: string; full_name: string; email: string; phone_number: string; age: number;
    city: string; qualification: string; prior_experience: 'beginner' | 'intermediate' | 'advanced'; additional_message?: string;
  }) => request<{ success: boolean; message: string }>('/api/enrollments', {
    method: 'POST', body: JSON.stringify(data),
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
  adminGetProjects: () =>
    request<{ total: number; projects: any[] }>('/api/admin/projects'),
  adminGetProject: (id: string) => request<any>(`/api/admin/projects/${id}`),
  adminCreateProject: (formData: FormData) => requestForm<any>('/api/admin/projects', formData),
  adminUpdateProject: (id: string, formData: FormData) =>
    requestForm<any>(`/api/admin/projects/${id}`, formData, 'PUT'),
  adminDeleteProject: (id: string) =>
    request<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Admin — Contact Messages
  adminGetContacts: () =>
    request<{ total: number; messages: any[] }>('/api/admin/contact'),
  adminDeleteContact: (id: string) =>
    request<void>(`/api/admin/contact/${id}`, { method: 'DELETE' }),

  adminUploadImage: (entity: 'courses' | 'portfolio' | 'services', file: File) => {
    const form = new FormData();
    form.append('file', file);
    return requestForm<{ file_id: string; image_url: string }>(`/api/admin/media/${entity}/upload-image`, form);
  },
  adminUpdateImage: (entity: 'courses' | 'portfolio' | 'services', file: File, oldFileId?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (oldFileId) form.append('old_file_id', oldFileId);
    return requestForm<{ file_id: string; image_url: string }>(`/api/admin/media/${entity}/update-image`, form, 'PUT');
  },
  adminDeleteImage: (entity: 'courses' | 'portfolio' | 'services', fileId: string) => {
    const form = new FormData();
    form.append('file_id', fileId);
    return requestForm<{ deleted: boolean }>(`/api/admin/media/${entity}/delete-image`, form, 'DELETE');
  },
};
