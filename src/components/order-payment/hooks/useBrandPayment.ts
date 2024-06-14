import { useStripe } from "@stripe/react-stripe-js";
import { PaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Order, STRIPE_CREATE_PAYMENT_INTENT_URL, STRIPE_PAY_WITH_SUBSCRIPTION_URL, STRIPE_WITH_SUB_CREATE_PAYMENT_INTENT_URL, STRIPE_WITH_SUB_PAY_WITH_SUBSCRIPTION_URL } from "~/api/model";
import { handleStripeSubscription } from "~/api/utils/stripe";
import { STRIPE_DEFAULT_MODE, STRIPE_WITH_SUBSCRIPTION_MODE } from "~/components/order-payment/constants";

interface StripePaymentRequestButtonProps {
  price: number,
  stripeMode: typeof STRIPE_WITH_SUBSCRIPTION_MODE | typeof STRIPE_DEFAULT_MODE,
  order?: Order,
  paymentMetadata?: Record<string, string | number | undefined>,
  onSuccessfulCheckout: () => any,
  onError: (error: any) => any,
}

interface IStripePayWithSubscriptionResponse {
  success: boolean,
  message: string,
  subscription: any
}

export interface IStripeCreatePaymentIntentResponse {
  success: boolean,
  message: string,
  clientSecret: string
}

const STRIPE_REQUIRES_ACTION = 'requires_action';

export default function useBrandPayment({
  price,
  onSuccessfulCheckout,
  onError,
  order,
  paymentMetadata = {},
  stripeMode
}: StripePaymentRequestButtonProps) {
  const stripe = useStripe();

  const paymentIntentUrl = useMemo(() => stripeMode === STRIPE_WITH_SUBSCRIPTION_MODE ? STRIPE_WITH_SUB_CREATE_PAYMENT_INTENT_URL : STRIPE_CREATE_PAYMENT_INTENT_URL, [stripeMode]);
  const payUrl = useMemo(() => stripeMode === STRIPE_WITH_SUBSCRIPTION_MODE ? STRIPE_WITH_SUB_PAY_WITH_SUBSCRIPTION_URL : STRIPE_PAY_WITH_SUBSCRIPTION_URL, [stripeMode]);

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  const [isApplePay, setIsApplePay] = useState(false);

  const paymentMethodHandler = useCallback(async (event: PaymentRequestPaymentMethodEvent) => {

    if (!stripe) return;

    const paymentMethodId = event.paymentMethod.id;

    if (order?.isSubscription && stripeMode === STRIPE_WITH_SUBSCRIPTION_MODE) {
      const { data: { subscription, success, message } } = await axios.post<IStripePayWithSubscriptionResponse>(payUrl, {
        amount: price * 100,
        currency: order.currency.code,
        paymentMethodId,
        metadata: { ...paymentMetadata, EVENT_TYPE: 'GOODLE_PAY/APPLE_PAY' }
      }, { withCredentials: true });

      if (!success || !subscription) {
        event.complete('fail');
        onError(message);

        return;
      }
      else {
        event.complete('success');

        handleStripeSubscription(
          subscription,
          () => stripe!.confirmCardPayment(subscription.latest_invoice.payment_intent.client_secret),
          () => onSuccessfulCheckout(),
          (err?: Error | string) => onError(err)
        );
      }

      return;
    }

    const {
      data: { clientSecret, success, message }
    } = await axios.post<IStripeCreatePaymentIntentResponse>(paymentIntentUrl, {
      amount: price * 100,
      currency: order?.currency.code,
      metadata: { ...paymentMetadata, EVENT_TYPE: 'GOODLE_PAY/APPLE_PAY' }
    }, { withCredentials: true });

    if (!success) {
      onError(message);

      return;
    }

    try {
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: paymentMethodId, setup_future_usage: 'off_session' },
        { handleActions: false }
      );

      if (confirmError) {
        event.complete('fail');
        onError(confirmError.message || confirmError);
      }
      else {
        event.complete('success');

        if (paymentIntent?.status === STRIPE_REQUIRES_ACTION) {
          const { error } = await stripe.confirmCardPayment(clientSecret);

          if (error) {
            onError(error.message || error);
          }
          else {
            onSuccessfulCheckout();
          }
        }
        else {
          onSuccessfulCheckout();
        }
      }
    }
    catch (error) {
      onError(error);
    }
  }, [onError, onSuccessfulCheckout, order?.currency.code, order?.isSubscription, payUrl, paymentIntentUrl, paymentMetadata, price, stripe, stripeMode]);

  useEffect(() => {
    if (!stripe) return;

    if (!paymentRequest) {
      const paymentRequest = stripe.paymentRequest({
        country: 'US', // Read this value from user's setting or use default option 'US'
        currency: order?.currency.code.toLowerCase() || 'usd',
        total: {
          label: order?.title || '',
          amount: price * 100,
        },
        requestPayerEmail: false,
      });

      paymentRequest.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(paymentRequest);
          setIsApplePay(result.applePay);
        }
      });
    }
    else {
      paymentRequest.update({ total: { label: order?.title || '', amount: price * 100 } });

      setPaymentRequest(paymentRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, price]);

  useEffect(() => {
    if (!paymentRequest) return;

    paymentRequest.on('paymentmethod', paymentMethodHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentRequest, paymentMethodHandler]);

  return {
    paymentRequest,
    paymentMethodHandler,
    isApplePay
  }
}