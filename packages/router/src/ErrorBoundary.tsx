import { ControllerContext } from '@anansi/router';
import { Component } from 'react';
import type { ReactNode, ComponentType, ContextType } from 'react';

import type { ErrorTypes } from './types';

interface Props<E extends ErrorTypes> {
  children: ReactNode;
  fallbackComponent: ComponentType<{ error: E }>;
}
interface State<E extends ErrorTypes> {
  error?: E;
}
/**
 * Handles any errors and resets state on history change
 */
export default class ErrorBoundary<E extends ErrorTypes> extends Component<
  Props<E>,
  State<E>
> {
  private declare unsubscribe: () => void;

  static defaultProps = {
    fallbackComponent: ({ error }: { error: ErrorTypes }) => {
      if (typeof error.status === 'string') {
        return (
          <div>
            <b>{error.status}</b>: {(error.response as any)?.statusText}
          </div>
        );
      }
      return <div>{error.message}</div>;
    },
  };

  static getDerivedStateFromError(error: ErrorTypes | any) {
    return { error };
  }

  static contextType = ControllerContext;

  state: State<E> = {};
  declare context: ContextType<typeof ControllerContext>;

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
