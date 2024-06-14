import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Order } from '~/api/model';
import { OrdersService } from '~/api/services/orders-service';
import { IPaymentSystem, PaymentService } from '~/api/services/payment-service';
import { useQuery } from '~/api/utils';
import { getLocationFromCookie } from '~/api/utils/locations';
import FetchErrorWithRetry from '~/shared/fetch-error-with-retry/fetch-error-with-retry';
import { PageLoader } from '~/shared/loader';
import { CareerumPaymentSystem } from './constants';
import { OrderPaidSuccessfully } from './containers';
import { isOrderPaid } from './order-payment.utils';
import { PaymentTypes } from './types';

const OrderPaymentComponent = React.lazy(() => import('./order-payment'));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '')

export default React.memo(function () {
  const { t, i18n } = useTranslation()

  const [order, setOrder] = useState<Order>();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPaid, setOrderPaid] = useState(false)

  const [paymentSystems, setPaymentSystems] = useState<IPaymentSystem[]>([]);
  const [paymentSystemsloading, setPaymentSystemsLoading] = useState(false);

  const [error, setError] = useState(false);
  const [langInited, setLangInited] = useState(false)

  const { hash } = useParams<{ hash: string }>();
  const query = useQuery()

  const stripeOptions: StripeElementsOptions = {
    mode: "payment",
    payment_method_types: ["card"],
    currency: "eur",
    amount: 100,
    setup_future_usage: "off_session",
    appearance: {
      variables: { colorPrimary: "#0B70FE", focusBoxShadow: "none" }
    },
  }

  const getOrder = useCallback(() => {
    setOrderLoading(true);
    setError(false);

    OrdersService.getOne(hash)
      .then(({ data }: { data: Order }) => {
        if (!data) {
          setError(true);
        }

        setOrder(data);
        setOrderPaid(isOrderPaid(data));
        setOrderLoading(false);
      })
      .catch((e: any) => {
        setOrderLoading(false);
        setError(true);
      });
  }, [hash]);

  const getPaymentSystems = useCallback(() => {
    setPaymentSystemsLoading(true);
    setError(false);

    // if paymenttype set in order - it has priority in payment system selection
    const paymentTypeTitle = order?.paymentType?.title;

    PaymentService.getPaymentSystems({
      orderID: order?.id ? +order.id : undefined,
      location: paymentTypeTitle ? null : getLocationFromCookie()
    }).then(({ data: { rows } }: { data: { rows: IPaymentSystem[] } }) => {
      setPaymentSystemsLoading(false);
      setError(false);

      if (paymentTypeTitle) {
        // filter results matching url param
        rows = rows.filter(paymentSystem => paymentSystem.paymentType.title === paymentTypeTitle);
      }

      if (order && order.offerPositions.some(item => item.couponApplied)) {
        rows = rows.filter(paymentSystem => paymentSystem.paymentType.title !== PaymentTypes.CareerumLoan)
      }

      if (order?.offerPositions[0].offer.innerInstallmentEnabled) {
        rows.push(CareerumPaymentSystem)
      }

      setPaymentSystems(rows);
    }).catch(() => {
      setPaymentSystemsLoading(false);
      setError(true);
    });
  }, [order]);

  const initPageLang = useCallback(() => {
    const isInternational = !!order?.Client.international
    const browserLang = navigator.language.slice(0, 2)
    const queryLang = query.get("lang")

    const lang = isInternational || queryLang === "en" || browserLang !== "ru"
      ? "en" 
      : "ru"

    i18n.changeLanguage(lang)
    document.title = `${t("OrderPayment.Title")} - Careerum`
    document.documentElement.lang = lang
    setLangInited(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  useEffect(() => {
    getOrder()
  }, [getOrder])

  useEffect(() => {
    if (order) {
      getPaymentSystems()
      initPageLang()
    }
  }, [getPaymentSystems, initPageLang, order])

  if (!langInited) {
    return <></>
  }

  if (orderPaid) {
    return <OrderPaidSuccessfully order={order} />
  }

  if (!order || orderLoading || paymentSystemsloading) {
    return (
      <PageLoader />
    )
  }

  if (error) {
    return <FetchErrorWithRetry retryFn={getOrder} />
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <OrderPaymentComponent
        order={order}
        paymentSystems={paymentSystems}
      />
    </Elements>
  );
});
