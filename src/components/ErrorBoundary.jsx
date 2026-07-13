import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo: errorInfo?.componentStack || "" });
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-lg mx-auto text-center py-20 px-4">
          <span className="text-5xl">😕</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Something went wrong</h2>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-mono text-red-700 dark:text-red-400 break-all">
              {this.state.error?.message || "Unknown error"}
            </p>
            {this.state.errorInfo && (
              <details className="mt-2">
                <summary className="text-xs text-red-500 cursor-pointer">Stack trace</summary>
                <pre className="text-[10px] text-red-400 mt-1 overflow-auto max-h-32">{this.state.errorInfo}</pre>
              </details>
            )}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
              🔄 Refresh
            </button>
            <button onClick={() => { window.location.href = "/"; }}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer border-0">
              🏠 Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
