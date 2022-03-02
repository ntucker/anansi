import React from 'react';
import type { NetworkError } from '@rest-hooks/core';
import { ControllerContext } from '@anansi/router';

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
> extends React.Component<Props<E>, State<E>, typeof ControllerContext> {
  private declare unsubscribe: () => void;

  static defaultProps = {
    fallbackComponent: ({ error }: { error: NetworkError }) => (
      <div>
        {error.status} {error.response?.statusText}
      </div>
    ),
  };

  static getDerivedStateFromError(error: NetworkError | any) {
    return { error };
  }

  static contextType = ControllerContext;

  state: State<E> = {};

  componentDidMount() {
    this.unsubscribe = this.context.history.listen(() => {
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
