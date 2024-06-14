import axios from "axios";
import { useMemo, useState } from "react";
import { Button, message, Divider, Popconfirm } from "antd";
import { ORDER_STRIPE_PAY_URL, ORDER_STRIPE_WITH_SUB_PAY_URL } from "~/api/model";
import { ThemedButton, ThemedCard } from '~/elements';
import { useTranslation } from "react-i18next";
import { handleStripeSubscription } from "~/api/utils/stripe";
import { STRIPE_WITH_SUBSCRIPTION_MODE, STRIPE_DEFAULT_MODE } from "~/components/order-payment/constants";
import ArrowRightOutlined from "@ant-design/icons/lib/icons/ArrowRightOutlined";
import { IStripePayResponse } from "~/shared/stripe-checkout-form/stripe-checkout-form";
import { StripeAuthRequiredMessage } from "../order-payment.utils";
import { useConfirmStripeCardPayment } from "./stripe.hooks";
import React from "react";
import { IPaymentToken } from "~/api/services/payment-service";
import VisaCardImg from '~/media/visa-card.png';
import MastercardImg from '~/media/mastercard.png';
import { CloseOutlined } from '@ant-design/icons';

interface ISavedCardsListProps {
  paymentTokens: IPaymentToken[];
  loading: boolean;
  onDeleteSavedCard: (id: number) => any;
  onSavedCardClick: (paymentToken: IPaymentToken) => any;
}

interface IStripeSavedCardPaymentModalProps {
  price: number;
  onSuccess: () => any,
  onError: (error: any) => any,
  currency: string;
  stripeMode: typeof STRIPE_WITH_SUBSCRIPTION_MODE | typeof STRIPE_DEFAULT_MODE;
  customerId?: string,
  paymentMethod?: string,
  isSubscription?: boolean;
  paymentMetadata?: Record<string, string | number | undefined>;
}

const SavedCardsList = ({ paymentTokens, loading, onDeleteSavedCard, onSavedCardClick }: ISavedCardsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      {
        paymentTokens.map((paymentToken: IPaymentToken, index: number) => (
          <React.Fragment key={paymentToken.id}>
            <ThemedCard
              className="payment-system-card saved-card"
              hoverable
              loading={loading}
              extra={
                <Popconfirm
                  title={t('DeleteCard')}
                  okText={t('Yes')}
                  cancelText={t('No')}
                  onConfirm={() => onDeleteSavedCard(paymentToken.id)}
                >
                  <ThemedButton type="text" icon={<CloseOutlined />} />
                </Popconfirm>
              }
            >
              <div className="saved-card-info-container">
                <p style={{ margin: 0 }}>**** {paymentToken.cardLast4}</p>
                <img className="saved-card-icon" alt="payment-system-icon" src={paymentToken.cardBrand === 'visa' ? VisaCardImg : MastercardImg} />
              </div>
              <ThemedButton
                block
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => onSavedCardClick(paymentToken)}
              >
                {t('Pay')}
              </ThemedButton>
            </ThemedCard>
            {index !== paymentTokens.length && <Divider />}
          </React.Fragment>
        ))
      }
    </>
  );
}

const StripeSavedCardPaymentModal = ({
  price,
  onSuccess,
  onError,
  currency,
  stripeMode,
  customerId,
  paymentMethod,
  isSubscription,
  paymentMetadata,
}: IStripeSavedCardPaymentModalProps) => {
  const { t } = useTranslation();

  const [isProcessing, setProcessingTo] = useState(false);

  const confirmStripeCardPayment = useConfirmStripeCardPayment();

  const payUrl = useMemo(() => stripeMode === STRIPE_WITH_SUBSCRIPTION_MODE ? ORDER_STRIPE_WITH_SUB_PAY_URL : ORDER_STRIPE_PAY_URL, [stripeMode]);

  const handleStripeSinglePay = async (success: boolean, message: string, paymentMethodID: string, clientSecret: string) => {

    if (success) {
      onSuccess();
    }
    else {
      if (message === StripeAuthRequiredMessage) {
        const { error } = await confirmStripeCardPayment(clientSecret, {
          payment_method: paymentMethodID,
        });

        if (error) {
          onError(error?.message);
        }
        else {
          onSuccess();
        }
        setProcessingTo(false);
      }
      else {
        onError(t(message));
      }
    }
    setProcessingTo(false);
  };

  const stripeSavedCardPay = async () => {
    setProcessingTo(true);

    try {
      const {
        data: {
          success,
          message,
          clientSecret,
          paymentMethodID,
          subscription
        }
        // TODO: FIX URLS HERE
      } = await axios.post<IStripePayResponse>(payUrl, {
        amount: price * 100,
        currency,
        customerId,
        paymentMethod,
        metadata: paymentMetadata
      },
      {
        withCredentials: true,
      });

      if (subscription) {
        handleStripeSubscription(
          subscription,
          () => confirmStripeCardPayment(subscription.latest_invoice.payment_intent.client_secret),
          () => {
            onSuccess();
            setProcessingTo(false);
          },
          (err?: Error | string) => {
            onError(err);
            setProcessingTo(false);
          }
        );
      }
      else {
        handleStripeSinglePay(success, message, paymentMethodID, clientSecret);
      }
    }
    catch (error) {
      message.error(t('SomethingWentWrong'));
      setProcessingTo(false);
    }
  }

  return (
    <>
      <Button
        size="large"
        type="primary"
        disabled={isProcessing}
        onClick={stripeSavedCardPay}
      >
        {isProcessing ? t('Processing') : `${t(isSubscription ? 'Subscribe' : 'Pay')} ${price} ${currency || ''}`}
      </Button>
    </>
  );
};

export { SavedCardsList, StripeSavedCardPaymentModal };
