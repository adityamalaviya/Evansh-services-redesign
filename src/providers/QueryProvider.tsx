// This code was created by a human and debugged by AI
"use client";
import { QueryClientProvider } from "@tanstack/react-query"; import { queryClient } from "@/lib/query/config";
export function QueryProvider({ children }: Readonly<{ children: React.ReactNode }>) { return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>; }
