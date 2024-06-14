import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ThemedCard from '~/elements/styled-card';


// declare global {
//   interface Window {
//       paypal: PayPalNamespace | null | undefined;
//   }
// }

interface IBraintreeClientTokenResponse {
  success: boolean;
  clientToken: string;
  message: string;
};

interface IBraintreePayResponse {
  success: boolean;
  trasnsactionResult: boolean;
  message: string;
};

interface IBraintreeProps {
  iconImgUrl: string;
  price: number;
  onSuccessfulCheckout: () => any;
  onError: (error: any, prefix: string) => any;
  orderId: number | string;
  clientId?: number | string;
  currency?: string;
  isSubscription?: boolean;
}

// Setup braintree scripts 

const BRAINTREE_SCRIPTS_CONTAINER_ID = 'braintree-scripts-container';
const braintreeScriptsContainer = document.getElementById(BRAINTREE_SCRIPTS_CONTAINER_ID);

if (!braintreeScriptsContainer) {
  const div = document.createElement('div');
  div.id = BRAINTREE_SCRIPTS_CONTAINER_ID;
  document.body.append(div);

  div.insertAdjacentHTML(
    'beforeend',
    `
    <script src="https://js.braintreegateway.com/web/3.78.2/js/client.min.js"></script>
    <script src="https://js.braintreegateway.com/web/3.78.2/js/paypal-checkout.min.js"></script>
    <script src="https://js.braintreegateway.com/web/3.78.2/js/data-collector.min.js"></script>
    `
  )
}

const Braintree = (
  {
    iconImgUrl,
    price,
    onSuccessfulCheckout,
    onError,
    currency,
    isSubscription,
    orderId,
    clientId
  }: IBraintreeProps
) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const bootstrapPaypal = async () => {
    // try {
    //   const {
    //     data:
    //     {
    //       success,
    //       clientToken
    //     }
    //   } = await axios.get<IBraintreeClientTokenResponse>(BRAINTREE_GET_CLIENT_TOKEN, { withCredentials: true });

    //   if (!success) {
    //     onError(t('PayPal.ErrorGettingToken'), 'PayPal');

    //     return;
    //   }

    //   let client: braintree.Client;
    //   let myDeviceData: string;

    //   braintree
    //     .client
    //     .create({
    //       authorization: clientToken
    //     })
    //     .then(clientInstance => {
    //       client = clientInstance;

    //       return braintree.dataCollector.create({
    //         client: clientInstance,
    //       });
    //     })
    //     .then(dataCollectorInstance => {
    //       myDeviceData = dataCollectorInstance.deviceData;

    //       // Create a PayPal Checkout component.
    //       return braintree.paypalCheckout.create({ client });
    //     })
    //     .then(paypalCheckoutInstance => paypalCheckoutInstance.loadPayPalSDK({ vault: true }))
    //     .then((paypalCheckoutInstance: any) => {
    //       return window.paypal.Buttons({
    //         fundingSource: "PayPal", // window.paypal.FUNDING.PAYPAL,

    //         createBillingAgreement: () => {
    //           return paypalCheckoutInstance.createPayment({
    //             flow: 'vault'
    //           });
    //         },

    //         onApprove: (data: any, _actions: any) => {
    //           return paypalCheckoutInstance.tokenizePayment(data).then(async (payload: any) => {
    //             try {
    //               const { data: { success, trasnsactionResult, message } } = await axios.post<IBraintreePayResponse>(ORDER_BRAINTREE_PAY_URL, {
    //                 nonce: payload.nonce,
    //                 deviceData: myDeviceData,
    //                 paypalOrderId: data.orderID,
    //                 price,
    //                 currency,
    //                 isSubscription,
    //                 orderId,
    //                 clientId
    //               },
    //                 {
    //                   withCredentials: true,
    //                 });

    //               if (!success) {
    //                 onError(message, 'PayPal');

    //                 return;
    //               }

    //               if (!trasnsactionResult) {
    //                 onError(t('PaymentProccessError'), 'PayPal');

    //                 return;
    //               }
    //               else {
    //                 onSuccessfulCheckout();
    //               }

    //             }
    //             catch (error) {
    //               onError(error, 'PayPal');
    //             }
    //           });
    //         },

    //         onCancel: (data: any) => {
    //           onError(`PayPal payment canceled, ${JSON.stringify(data)}`, 'PayPal');
    //         },

    //         onError: (err: any) => {
    //           onError(err, 'PayPal');
    //         }
    //       })
    //         .render('#braintree-button');
    //     })
    //     .then(() => setLoading(false)) // PayPal button is ready
    //     .catch(err => {
    //       setLoading(false);
    //       setError(true);
    //       onError(err, 'PayPal');
    //     });
    // }
    // catch (error) {
    //   onError(error, 'PayPal');
    //   setError(true);
    // }
  };

  useEffect(() => {
    setLoading(true);

    // Bootstrap PayPal only once
    const bootstrapTimeout = setTimeout(bootstrapPaypal, 1000);

    return () => clearTimeout(bootstrapTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {
        !error
        && <ThemedCard
          className="payment-system-card"
          hoverable
          cover={<img className="payment-system-icon" alt="payment-system-icon" src={iconImgUrl} />}
        >
          {loading && t('LoadingAndDots')}
          <div id="braintree-button"></div>
        </ThemedCard>
      }
    </>
  );
};

export default Braintree;
