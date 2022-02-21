import React from 'react';
import type { NetworkError } from '@rest-hooks/core';

import { router } from 'routing/index';

function isNetworkError(error: NetworkError | unknown): error is NetworkError {
  return Object.prototype.hasOwnProperty.call(error, 'status');
}

interface Props<E extends NetworkError> {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<{ error: E }>;
}
interface State<E extends NetworkError> {
  error?: E;
}
/**
 * Handles any networking errors from useResource()
 * @see https://resthooks.io/docs/api/NetworkErrorBoundary
 */
export default class ErrorBoundary<
  E extends NetworkError,
> extends React.Component<Props<E>, State<E>> {
  private declare unsubscribe: () => void;

  static defaultProps = {
    fallbackComponent: ({ error }: { error: NetworkError }) => (
      <div>
        {error.status} {error.response?.statusText}
      </div>
    ),
  };

  static getDerivedStateFromError(error: NetworkError | any) {
    if (isNetworkError(error)) {
      return { error };
    } else {
      throw error;
    }
  }

  state: State<E> = {};

  componentDidMount() {
    this.unsubscribe = router.history.listen(update => {
      if (this.state.error) this.setState({ error: undefined });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }
    return <this.props.fallbackComponent error={this.state.error} />;
  }
}
