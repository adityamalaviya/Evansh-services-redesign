"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { Warning } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4">
            <div className="flex justify-center">
              <Warning size={40} className="text-red-500" weight="duotone" />
            </div>
            <h2 className="text-lg font-black text-red-700">Something went wrong</h2>
            <p className="text-red-600 text-sm">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
