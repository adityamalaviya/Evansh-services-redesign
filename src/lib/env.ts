const required = [
  'HONO_API_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
] as const;

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});
