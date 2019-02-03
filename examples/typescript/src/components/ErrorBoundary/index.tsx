import React, { lazy, Suspense } from 'react';
import classNames from 'classnames';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';
import CircularProgress from '@material-ui/core/CircularProgress';

//import { settings } from '../../settings'
import styles from './index.scss';
import BigAlertIcon from './big-alert.svg';

function handleRefresh() {
  window.location.reload(true);
}

const RedBox = lazy(() =>
  import(/* webpackChunkName: 'redbox' */ 'redbox-react'),
);

interface Props {
  children: React.ReactChild;
}
interface State {
  error: Error | null;
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
    if (!this.state.error) {
      return this.props.children;
    }
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="center">
          <Suspense
            fallback={
              <div className="center">
                <CircularProgress />
              </div>
            }
            maxDuration={200}
          >
            <h1>{this.state.error?.toString()}</h1>
            <RedBox error={this.state.error} />
          </Suspense>
        </div>
      );
    }
    return (
      <div className={classNames('center', 'up', styles.errorBoundary)}>
        <img
          src={BigAlertIcon}
          style={{ width: '96px', height: '96px' }}
          alt="alert"
        />
        <header>
          <h1>Uh oh. Something went wrong.</h1>
          <h3>Please refresh the page.</h3>
        </header>
        <button className="btn btn-primary" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
    );
  }
}
