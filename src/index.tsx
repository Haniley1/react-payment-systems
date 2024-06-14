import { ConfigProvider as AntConfigProvider } from 'antd';
import 'moment/locale/ru';
import React, { Suspense, useEffect } from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { interceptors } from '~/interceptors';
import ErrorBoundary from '~/shared/error-boundary/error-boundary';
import { AppRoutes, LANDING_URL, StaticFilesRoutes } from './api/model';
import { antThemeConfig } from './api/model/ant';
import OrderPaymentPage from './components/order-payment/';
import i18n from './i18n';
import './index.scss';
import { PageLoader } from './shared/loader';

const OrderLoanPage = React.lazy(() => import('./components/careerum-loan/'));
const OrderLoanPaymentPage = React.lazy(() => import('./components/order-payment/loan'));

function BaseComponent() {

  // http interceptors
  useEffect(interceptors, []);

  const reloadPage = () => <>{window.location.reload()}</>;
  const redirectToLanding = () => {
    if (process.env.NODE_ENV === "production") {
      return <>{window.location.replace(LANDING_URL)}</>
    }
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <Switch>
          <Route path={AppRoutes.orderPayment}>
            <OrderPaymentPage />
          </Route>
          <Route exact path={AppRoutes.careerumLoan}>
            <OrderLoanPage />
          </Route>
          <Route exact path={AppRoutes.careerumLoanPayment}>
            <OrderLoanPaymentPage />
          </Route>
          <Route path="/" render={redirectToLanding} />
          <Route path={StaticFilesRoutes.PageInsertJS} render={reloadPage} />
          <Route path={StaticFilesRoutes.PageFormHandlerJS} render={reloadPage} />
          <Route path={StaticFilesRoutes.AppleDomainVerification} render={reloadPage} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <I18nextProvider i18n={i18n}>
      <AntConfigProvider theme={antThemeConfig}>
        <ErrorBoundary>
          <BaseComponent />
        </ErrorBoundary>
      </AntConfigProvider>
    </I18nextProvider>
  );
}
