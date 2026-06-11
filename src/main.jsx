import { createRoot } from 'react-dom/client';
import { Component } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import AppRouter from './app/AppRouter';

const queryClient = new QueryClient();

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ color: 'red', padding: 24, whiteSpace: 'pre-wrap' }}>
          {this.state.error?.message}\n{this.state.error?.stack}
        </pre>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary><AppRouter /></ErrorBoundary>
  </QueryClientProvider>
);
