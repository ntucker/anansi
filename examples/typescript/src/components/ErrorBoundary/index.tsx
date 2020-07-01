import React, { lazy, Suspense } from 'react';
import classNames from 'classnames';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';
import { Spin } from 'antd';

import styles from './index.scss';
import { ReactComponent as BigAlertIcon } from './big-alert.svg';

function handleRefresh() {
  window.location.reload(true);
}

const RedBox = lazy(() =>
  import(/* webpackChunkName: 'redbox' *//* webpackPreload: true */ 'redbox-react'),
);

interface NetworkError extends Error {
  status: number;
}

interface Props {
  children: React.ReactChild;
}
interface State {
  error: Error | NetworkError | null;
  errorInfo: object | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
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
            <RedBox error={error} />
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
        <BigAlertIcon
          style={{ width: '96px', height: '96px' }}
          alt="alert"
        />
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
