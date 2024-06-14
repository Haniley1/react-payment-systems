import { Result, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppRoutes, Offer, Order } from "~/api/model";
import { OrdersService } from "~/api/services/orders-service";

const { Text, Paragraph } = Typography;

export const ContactUsOnError = () => {
  const { t } = useTranslation();

  return (
    <Result status="error" title={t('PaymentCheckError')}>
      <Paragraph>
        <Text strong style={{ fontSize: 16 }}>
          {t('PaymentDoesNotExist')}
        </Text>
      </Paragraph>
      <Paragraph>
        <a href="mailto:hello@careerum.com">{t('PleaseContactUs')}</a>
      </Paragraph>
    </Result>
  );
}

export const OrderPaidSuccessfully = ({ order }: { order?: Order }) => {
  const { t } = useTranslation();

  const addOrderHashtoUrl = (url: string, order?: Order) => {
    if (!order?.hash) {
      return url
    }
  
    const urlJoiner = url.indexOf('?') === -1 ? `?` : `&`;
    return `${url}${urlJoiner}orderHash=${order.hash}`
  }

  const setPasswordAfterPayment = order?.offerPositions[0].offer.setPasswordAfterPayment
  const offerWithRedirectURL = order?.offerPositions?.find(({ offer }: { offer: Offer }) => !!offer.redirectURLAfterPayment);
  const redirectURL = setPasswordAfterPayment
    ? AppRoutes.authLayer
    : offerWithRedirectURL?.offer.redirectURLAfterPayment;

  return (
    redirectURL
      ? <div>{window.location.replace(addOrderHashtoUrl(redirectURL, order)) as any}</div>
      : <Result status="success" title={t('OrderSuccessPaid')} />
  );
}

export const OrderCancelled = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="error"
      title={t('OrderCancelled')}
    />
  );
}

export const OrderPayTimeExpired = ({ orderId }: { orderId?: number }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (orderId) {
      OrdersService.setOrderExpired(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Result status="error" title={t('OrderPayTimeExpired')} />
  );
}