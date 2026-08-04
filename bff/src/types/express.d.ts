// Global Express Request type augmentation
// Must be a .d.ts file (not a .ts module) to apply globally without explicit imports.
declare namespace Express {
  interface Request {
    requestId: string;
    user?: {
      userId: string;
      email: string;
      name: string;
    };
  }
}
