import { CloseCircleOutlined } from "@ant-design/icons";
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { Result, notification } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Order } from '~/api/model';
import { OrdersService } from '~/api/services/orders-service';
import { definePageLang } from "~/api/utils";
import '~/assets/fonts/montserrat/index.scss';
import FetchErrorWithRetry from '~/shared/fetch-error-with-retry/fetch-error-with-retry';
import { PageLoader } from "~/shared/loader";

const OrderPaymentComponent = React.lazy(() => import('./order-payment-loan'));

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '')

export default React.memo(function () {
  const { t, i18n } = useTranslation()

  const [order, setOrder] = useState<Order>();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderPaid, setOrderPaid] = useState(false)
  const [orderPrice, setOrderPrice] = useState(1);

  const [error, setError] = useState(false);

  const { hash } = useParams<{ hash: string }>();

  const stripeOptions: StripeElementsOptions = {
    mode: "payment",
    currency: "eur",
    payment_method_types: ["card"],
    amount: orderPrice * 100,
    setup_future_usage: "off_session",
    appearance: {
      variables: { colorPrimary: "#0B70FE", focusBoxShadow: "none" }
    }
  }

  const currentPayment = useMemo(() => {
    const installmentOrder = order?.orderPaymentsForInnerInstallment
      ?.sort((a, b) => a.index - b.index)
      ?.find(item => item.paymentID === null)
    
    if (!installmentOrder) return null

    return installmentOrder
  }, [order])

  const getOrder = useCallback(() => {
    setOrderLoading(true);
    setError(false);

    OrdersService.getOne(hash)
      .then(({ data }) => {
        if (!data) {
          setError(true);
        }

        setOrder(data);
        setOrderPrice(parseFloat(data.price || '1'));
        i18n.changeLanguage(definePageLang(data))

        setOrderLoading(false);
      })
      .catch((e) => {
        alert(e);
        setOrderLoading(false);
        setError(true);
      });
  }, [hash, i18n]);

  const onPaySuccess = () => {
    setOrderPaid(true)
  };

  const onPayError = useCallback((err?: any, prefix: string = '') => {
    const title = prefix ? prefix + ": " : ""

    notification.open({
      message: <span>{`${title}${err?.message || err || t('SomethingWentWrong')}`}</span>,
      duration: 10,
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
    });
  }, [t]);

  useEffect(getOrder, [getOrder])

  if (error) {
    return <FetchErrorWithRetry retryFn={getOrder} />
  }

  if (orderPaid) {
    return <Result status="success" title={t('OrderSuccessPaid')} />
  }

  if (!order || orderLoading || !currentPayment) {
    return (
      <PageLoader />
    )
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <OrderPaymentComponent
        order={order}
        currentPayment={currentPayment}
        payedAmount={currentPayment.index}
        onPaySuccess={onPaySuccess}
        onPayError={onPayError}
      />
    </Elements>
  );
});
