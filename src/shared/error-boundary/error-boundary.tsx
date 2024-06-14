import moment from "moment";
import React from "react";
import { withTranslation } from "react-i18next";
import FetchErrorWithRetry from '~/shared/fetch-error-with-retry/fetch-error-with-retry';

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    const errorStringToLog = `
      Date: ${moment(new Date()).format('DD.MM.YYYY hh:mm:ss')}

      Page URL: ${window.location.href}

      Error: ${error.message}

      Component stack: ${errorInfo.componentStack}
    `;

    console.error(errorStringToLog)
  }

  render() {
    if (this.state.hasError) {
      return <FetchErrorWithRetry
        status="error"
        title={this.props.t('UnknownErrorDescription')}
        tooltipTitle={this.props.t('Refresh')}
        retryFn={() => window.location.reload()}
      />;
    }

    return this.props.children; 
  }
}

export default withTranslation()(ErrorBoundary);
