import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { ORDER_PAYPAL_CREATE_ORDER_URL, Order, getOrderCompletedUrl } from "~/api/model";

interface PaypalComponentProps {
  show: boolean;
  order: Order;
  paymentReturnUrl: string;
  disabled?: boolean;
  onPaySuccess?: VoidFunction;
  onPayError?: (err: any) => void;
}

export default function PaypalComponent({ show, disabled, order, paymentReturnUrl, onPaySuccess = () => { }, onPayError = () => { } }: PaypalComponentProps) {
  const [successIntervalId, setSuccessIntervalId] = useState(0)

  const createPaypalOrder = async () => {
    const { data: { id } } = await axios.post<{ id: string }>(ORDER_PAYPAL_CREATE_ORDER_URL, {
      orderId: order.id,
      returnUrl: paymentReturnUrl
    });

    return id;
  }

  const isOrderCompleted = async () => {
    try {
      const response = await axios.get<boolean>(getOrderCompletedUrl(order.id!))
  
      if (response.data === true) {
        window.clearInterval(successIntervalId)
        onPaySuccess()
      }
    } catch (error) {
      
    }
  }

  const onPaypalApprove = async () => {
    if (successIntervalId) return

    const intervalId = window.setInterval(isOrderCompleted, 5_000)
    setSuccessIntervalId(intervalId)
  }

  const onPaypalError = (err: any) => {
    window.clearInterval(successIntervalId)
    setSuccessIntervalId(0)
    onPayError(err)
  }

  if (!show) return <></>

  return (
    <PayPalScriptProvider options={{ currency: "EUR", clientId: "test" }}>
      <PayPalButtons
        fundingSource='paypal'
        disabled={disabled}
        createOrder={createPaypalOrder}
        onApprove={onPaypalApprove}
        onError={onPaypalError}
        style={{ layout: "horizontal", color: "black", label: "pay", tagline: true, height: 48 }}
      />
    </PayPalScriptProvider>
  )
}