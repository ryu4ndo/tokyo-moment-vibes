import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    const { error, errorInfo } = this.state;
    if (error) {
      return (
        <div className="rounded-[24px] border border-red-500/30 bg-red-950/40 p-6 my-4">
          <p className="text-red-300 text-xs font-bold tracking-widest uppercase mb-2">
            Runtime Error
          </p>
          <h2 className="text-lg font-bold text-white mb-2">
            {this.props.label ?? 'Something went wrong'}
          </h2>
          <pre className="text-sm text-red-200/90 whitespace-pre-wrap break-words mb-3">
            {error.message}
          </pre>
          {errorInfo?.componentStack && (
            <details className="text-xs text-white/40">
              <summary className="cursor-pointer mb-2">Component stack</summary>
              <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
            </details>
          )}
          <button
            type="button"
            onClick={() => this.setState({ error: null, errorInfo: null })}
            className="mt-3 px-4 py-2 rounded-full bg-white/10 text-sm font-semibold hover:bg-white/15"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
