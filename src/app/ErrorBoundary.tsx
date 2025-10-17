import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message ?? 'Unknown error' };
  }

  componentDidCatch(err: any, info: any) {
    console.error('ErrorBoundary caught an error:', err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800">
          エラーが発生しました: {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}
