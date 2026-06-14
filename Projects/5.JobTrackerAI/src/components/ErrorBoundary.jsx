import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-8 dark:bg-zinc-950">
          <div className="max-w-md rounded-lg border border-rose-200 bg-white p-6 text-center shadow-soft dark:border-rose-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-400">Something went wrong</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              className="mt-4 h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
