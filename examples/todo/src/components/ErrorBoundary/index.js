import { lazy } from 'react'
import classNames from 'classnames'
import ErrorLoggerContext from 'lib/ErrorLoggerContext'

//import { settings } from '../../settings'
import styles from './index.scss'
import BigAlertIcon from './big-alert.svg'


function handleRefresh() {
  window.location.reload(true)
}

const RedBox = lazy(() => import(/* webpackChunkName: 'redbox' */'redbox-react'))

export default class ErrorBoundary extends React.Component {
  static contextType = ErrorLoggerContext
  static getDerivedStateFromError(error) {
    return { error }
  }

  state = { error: null, errorInfo: null }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    this.context(
      error,
      {
        errorInfo,
      }
    )
  }


  render() {
    if (!this.state.error) {
      return this.props.children
    }
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="center">
          <h1>{this.state.error?.toString()}</h1>
          <RedBox error={this.state.error} />
        </div>
      )
    }
    return (
      <div className={classNames('center', 'up', styles.errorBoundary)}>
        <img src={BigAlertIcon} style={{ width: '96px', height: '96px' }} alt="alert" />
        <header>
          <h1>Uh oh. Something went wrong.</h1>
          <h3>Please refresh the page.</h3>
        </header>
        <button
          className="btn btn-primary"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
    )
  }
}

