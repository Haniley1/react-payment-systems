import { useStripe } from "@stripe/react-stripe-js";
import { ConfirmCardPaymentData, PaymentIntentResult, PaymentRequest } from "@stripe/stripe-js";
import { useCallback, useEffect, useState } from "react";
import { Order } from "~/api/model";

export function useConfirmStripeCardPayment(): (clientSecret: string, data?: ConfirmCardPaymentData) => Promise<PaymentIntentResult> {
  const stripe = useStripe();

  const confirmStripeCardPayment = useCallback((clientSecret: string, data: ConfirmCardPaymentData = {}) => (
    stripe!.confirmCardPayment(clientSecret, data)
  ), [stripe]);

  return confirmStripeCardPayment;
}

interface useStripePaymentRequestProps {
  price: number;
  order?: Order;
}
export function useStripePaymentRequest({ price, order }: useStripePaymentRequestProps) {
  const stripe = useStripe()
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null)
  const [isApplePay, setIsApplePay] = useState(false)

  useEffect(() => {
    if (!stripe || !order) return;

    if (!paymentRequest) {
      const paymentRequest = stripe.paymentRequest({
        country: 'US', // Read this value from user's setting or use default option 'US'
        currency: order.currency.code.toLowerCase(),
        total: {
          label: order.title,
          amount: price * 100,
        },
        requestPayerEmail: false,
      });

      paymentRequest.canMakePayment().then(async result => {
        console.log(result)
        if (result) {
          setPaymentRequest(paymentRequest);
          setIsApplePay(result.applePay);
        }
      });
    } else {
      paymentRequest.update({
        total: {
          label: order.title,
          amount: price * 100,
        },
      });

      setPaymentRequest(paymentRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, price]);

  return {
    paymentRequest
  }
}
