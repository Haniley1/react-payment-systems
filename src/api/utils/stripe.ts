import { PaymentIntent, StripeError } from "@stripe/stripe-js";

export enum StripeSubscriptionsStatus {
  Active = 'active',
  Incomplete = 'incomplete'
}

export const handleStripeSubscription = async (
  subscription: any, /* Should be Stripe Subscription object */
  onConfirmCardPayment: () => Promise<{paymentIntent?: PaymentIntent; error?: StripeError}>,
  onSuccess: () => any,
  onError: (err?: Error | string) => any
) => {
  switch(subscription.status) {
    case StripeSubscriptionsStatus.Active: {
      onSuccess();

      break;
    }
    case StripeSubscriptionsStatus.Incomplete: {
      const { error } = await onConfirmCardPayment();

      if (error) {
        onError(error.message)
      }
      else {
        onSuccess();
      }

      break;
    }
    default: {
      onError(subscription.status);
    }
  }
};
