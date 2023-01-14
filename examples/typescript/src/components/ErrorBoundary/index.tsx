import { Spin } from 'antd';
import classNames from 'classnames';
import { lazy, Suspense, Component } from 'react';
import type { ReactChild } from 'react';

import ErrorLoggerContext from 'lib/ErrorLoggerContext';
import { history } from 'navigation';

import { ReactComponent as BigAlertIcon } from './big-alert.svg';
import styles from './index.scss';

function handleRefresh() {
  window.location.reload(true);
}

const RedBox = lazy(
  () =>
    import(
      /* webpackChunkName: 'redbox' */ /* webpackPreload: true */ 'redbox-react'
    ),
);

interface NetworkError extends Error {
  status: number;
}

interface Props {
  children: ReactChild;
}
interface State {
  error: Error | NetworkError | null;
  errorInfo: object | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  private cb?: ReturnType<typeof history.listen>;

  static contextType = ErrorLoggerContext;
  static getDerivedStateFromError(error: Error | null) {
    return { error };
  }

  state: State = { error: null, errorInfo: null };

  componentDidCatch(error: Error | null, errorInfo: object) {
    this.setState({ errorInfo });
    this.context(error, {
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  componentDidMount() {
    this.cb = history.listen(() => {
      if (this.state.error) this.setState({ error: null, errorInfo: null });
    });
  }

  componentWillUnmount() {
    this.cb?.();
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }
    if (process.env.NODE_ENV !== 'production' && !('status' in error)) {
      return (
        <div className="center">
          <Suspense fallback={<Spin size="large" />}>
            <h1>{error.toString()}</h1>
            {/*<RedBox error={error} />*/}
            <button onClick={this.handleReset}>Dismiss</button>
          </Suspense>
        </div>
      );
    }
    let mainMessage: string;
    if ('status' in error) {
      mainMessage = `${error.status}`;
    } else {
      mainMessage = 'Uh oh. Something went wrong.';
    }
    return (
      <div className={classNames('center', 'up', styles.errorBoundary)}>
        <BigAlertIcon style={{ width: '96px', height: '96px' }}>
          <title>alert</title>
        </BigAlertIcon>
        <header>
          <h1>{mainMessage}</h1>
          <h3>Please refresh the page.</h3>
        </header>
        <button className="btn btn-primary" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
    );
  }
}
