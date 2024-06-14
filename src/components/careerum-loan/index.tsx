import { CloseCircleOutlined } from "@ant-design/icons";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { notification } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Order } from "~/api/model";
import { OrdersService } from "~/api/services/orders-service";
import { definePageLang } from "~/api/utils";
import FetchErrorWithRetry from "~/shared/fetch-error-with-retry/fetch-error-with-retry";
import { PageLoader } from "~/shared/loader";
import { OrderCancelled, OrderPaidSuccessfully } from "../order-payment/containers";
import { isLoanOrderPaid, isOrderCancelled } from "../order-payment/order-payment.utils";
import OrderCareerumLoan from "./careerum-loan";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '')
const stripeOptions: StripeElementsOptions = {
  mode: "payment",
  currency: "eur",
  payment_method_types: ["card"],
  amount: 100,
  setup_future_usage: "off_session",
  appearance: {
    variables: { colorPrimary: "#0B70FE", focusBoxShadow: "none" }
  }
}

export default React.memo(function () {
  const { t, i18n } = useTranslation()
  const { hash } = useParams<{ hash: string }>();

  const [order, setOrder] = useState<Order | null>(null)
  const [orderLoading, setOrderLoading] = useState(true)
  const [orderError, setOrderError] = useState(false)
  const [orderPaid, setOrderPaid] = useState(false)
  const [orderCancelled, setOrderCancelled] = useState(false)

  const offer = order?.offerPositions[0].offer

  const getOrder = useCallback(() => {
    setOrderLoading(true);
    setOrderError(false);

    OrdersService.getOne(hash)
      .then(({ data }) => {
        if (!data || !data.offerPositions[0].offer.innerInstallmentEnabled) {
          setOrderError(true);
        }

        setOrder(data);
        i18n.changeLanguage(definePageLang(data))
        setOrderLoading(false);
        setOrderPaid(isLoanOrderPaid(data))
        setOrderCancelled(isOrderCancelled(data))
      }).catch((e) => {
        alert(e);
        setOrderLoading(false);
        setOrderError(true);
      });
  }, [i18n, hash]);

  useEffect(getOrder, [getOrder])

  const handleErrorPayment = (err: string | any, prefix?: string) => {
    const title = prefix ? prefix + ": " : ""

    notification.open({
      message: <span>{`${title}${err?.message || err || t('SomethingWentWrong')}`}</span>,
      duration: 10,
      icon: <CloseCircleOutlined style={{ color: 'red' }} />,
    });
  }

  if (orderLoading || !order || !offer) {
    return (
      <PageLoader />
    )
  }

  if (orderPaid) {
    return <OrderPaidSuccessfully order={order} />
  }

  if (orderCancelled) {
    return <OrderCancelled />
  }

  if (orderError || !order || !offer) {
    return <FetchErrorWithRetry retryFn={getOrder} />
  }

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      <OrderCareerumLoan
        order={order}
        onSuccess={() => setOrderPaid(true)}
        onError={handleErrorPayment}
      />
    </Elements>
  )
})
