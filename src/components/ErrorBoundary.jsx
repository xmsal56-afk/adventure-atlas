import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("ErrorBoundary caught:", error?.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto text-center py-20">
          <span className="text-5xl">😕</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <p className="text-xs text-gray-400 mb-6">
            This might be a temporary network issue. Try refreshing.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors cursor-pointer border-0">
              🔄 Refresh
            </button>
            <Link to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors no-underline">
              🏠 Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
