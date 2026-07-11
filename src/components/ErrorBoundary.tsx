import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fullScreen?: boolean; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={`p-8 flex items-center justify-center ${this.props.fullScreen ? 'min-h-screen' : 'h-full'} w-full bg-red-50 text-red-900`}>
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
            <p className="text-sm opacity-80 mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 text-white rounded shadow text-sm">Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
