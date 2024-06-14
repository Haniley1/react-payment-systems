export const API_PROTOCOL = process.env.REACT_APP_API_PROTOCOL;  // "https://" or "http://"
// export const API_PROTOCOL = "http://";
export const BASE_PLATFORM_API_URL = process.env.REACT_APP_PLATFORM_API_URL;  // "deva-backend.herokuapp.com/api/v1" or "localhost:3000/api/v1"
// export const BASE_PLATFORM_API_URL = "localhost:3000/api/v1";
export const DEVA_PAGEBUILDER_URL = process.env.REACT_APP_PAGEBUILDER_URL;  // "deva-pagebuilder.herokuapp.com" or "localhost:3002"
export const DEVA_LANDING_APP_URL = process.env.REACT_APP_LANDING_APP_URL;  // "deva-pagebuilder.herokuapp.com" or "localhost:3002"
export const MR_BIN_URL = process.env.REACT_APP_MR_BIN_API_URL // ""
export const PASSPORT_URL = "https://passport.careerum.com"
export const LANDING_URL = "https://careerum.com"

// Clients
export const ALL_CLIENTS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/`;
export const getClientUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/${id}`;
export const ADD_CLIENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/create/`;
export const UPDATE_CLIENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/update/`;
export const DELETE_CLIENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/delete/`;
export const MY_PERMISSIONS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/me/`;
export const SET_FIRST_PASSWORD_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/set-first-password/`;
export const CLIENT_HAS_ROLES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/has-roles/`;
export const RESET_PASSWORD_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/reset-password/`;
export const SEND_RESET_PASSWORD_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/send-reset-password-email/`;
export const LOGOUT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/logout`
export const getVerifyEmailUrl = (token: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/click/${token}`;
export const getHasPasswordUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/${id}/has-password`;
export const getHasPasswordByKcUrl = (kcId: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/${kcId}/has-password-by-keycloak-id`;
export const getSetFirstPasswordByKcUrl = (kcId: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/users/${kcId}/set-first-password-by-keycloak-id`;

// Pages
export const ALL_PAGES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/`;
export const UPDATE_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/update/`;
export const CREATE_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/create/`;
export const DELETE_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/delete/`;
export const PUBLISH_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/publish/`;
export const DUPLICATE_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/duplicate/`;
export const REMOVE_PAGE_PUBLISH_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/remove-publish/`;
export const GET_PAGE_FILE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/getpagefilebypath/`;
export const SYSTEM_PAGES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/system/`;
export const CHECKOUT_PAGE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/pages/system/checkout/`;

// Style Templates
export const ALL_STYLE_TEMPLATES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/style_templates/`;
export const CREATE_STYLE_TEMPLATES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/style_templates/create/`;
export const UPDATE_STYLE_TEMPLATES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/style_templates/update/`;
export const DELETE_STYLE_TEMPLATES_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/style_templates/delete/`;

// Analytics
export const ALL_SESSIONS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/sessions/`;
export const TRACK_SESSION_REQUEST_URl = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/sessions/track_request`;

// Products
export const ALL_PRODUCTS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/products/`;
export const CREATE_PRODUCT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/products/create/`;
export const UPDATE_PRODUCT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/products/update/`;
export const DELETE_PRODUCT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/products/delete/`;

// Orders
export const ALL_ORDERS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/`;
export const CREATE_ORDER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/create/`;
export const UPDATE_ORDER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/update/`;
export const DELETE_ORDER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/delete/`;
export const CHECKOUT_ORDER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/checkout/`;
export const getOneOrder = (id: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}`;
export const getOneOrderHash = (hash: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/hash/${hash}`;
export const getApplyOrderPromocodeUrl = (id: number, promocode: string) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}/apply-promo?coupon=${promocode}`;
export const getOrderExpirationUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}/checkout-expiration`;
export const getOrderSetBilling = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}/billing-address`;
export const getSendInnerInstallmentPayments = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}/inner-installment-payments`;
export const getOrderCompletedUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/orders/${id}/completed`;

// Payments

// Stripe default
export const ORDER_STRIPE_PAY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe/pay/`;
export const STRIPE_CREATE_PAYMENT_INTENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe/create-payment-intent/`;
export const STRIPE_PAY_WITH_SUBSCRIPTION_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe/pay-with-subscription/`;

// Stripe with subscription
export const ORDER_STRIPE_WITH_SUB_PAY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe-with-subscription/pay/`;
export const STRIPE_WITH_SUB_CREATE_PAYMENT_INTENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe-with-subscription/create-payment-intent/`;
export const STRIPE_WITH_SUB_PAY_WITH_SUBSCRIPTION_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/stripe-with-subscription/pay-with-subscription/`;

// SEPA
export const SEPA_CREATE_SETUP_INTENT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/sepa/create-setup-intent/`;

// Tinkoff
export const ORDER_TINKOFF_INIT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/tinkoff/init/`;
export const ORDER_TINKOFF_AUTOPAY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/tinkoff/autopay/`;
export const ORDER_TINKOFF_INIT_SPB_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/tinkoff/init-qr/`;
export const ORDER_TINKOFF_LOAN_INIT_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/tinkoff_loan/init/`;

// Braintree
export const ORDER_BRAINTREE_PAY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/braintree/pay/`;
export const BRAINTREE_GET_CLIENT_TOKEN = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/braintree/client-token/`;

// PayPal
export const ORDER_PAYPAL_SETUP_TOKEN_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/paypal/setup-token/`;
export const ORDER_PAYPAL_CREATE_ORDER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/paypal/create-order/`;
export const ORDER_PAYPAL_PAY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/paypal/pay/`;
export const ORDER_PAYPAL_PAY_WITH_SUBSCRIPTION_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_gateways/paypal/pay-with-subscription/`;

// Offers
export const ALL_OFFERS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/offers/`;
export const CREATE_OFFER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/offers/create/`;
export const UPDATE_OFFER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/offers/update/`;
export const DELETE_OFFER_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/offers/delete/`;

// Currency
export const ALL_CURRENCY_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/currencies/`;

// Payment systems
export const ALL_PAYMENT_SYSTEMS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_system/`;
export const ALL_PAYMENT_TOKENS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_tokens/`;
export const DELETE_PAYMENT_TOKEN_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_tokens/delete/`;

//Payment Cards
export const getAllPaymentCardsUrl = (clientId?: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_tokens/${clientId ? `user/${clientId}` : ""}`
export const SET_DEFAULT_PAYMENT_CARD_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_tokens/set-default`
export const DELETE_PAYMENT_CARD_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payment_tokens/delete`
export const PAYMENT_CARD_DESIGN_URL = `${API_PROTOCOL}mrbin.io/bins/display`

// Subscriptions
export const getAllSubscriptionsUrl = (clientId?: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/subscriptions/${clientId ? `user/${clientId}` : "my"}`
export const getChangeSubscriptionUrl = (id: number, userId?: string) =>  `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/subscriptions/${userId ? `${id}/user/${userId}` : `my/${id}`}`
export const getProlongSubscriptionUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/subscriptions/my/${id}/prolong`
export const getProlongWithParamsSubscriptionUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/subscriptions/my/${id}/custom-prolongation-order`
export const getProlongByNewCardSubscriptionUrl = (id: number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/subscriptions/my/${id}/prolongation-order`

// Payments History
export const ALL_PAYMENTS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/payments/my`

// Settings
export const ALL_SETTINGS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/settings/`;
export const GET_SHOP_STATUS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/settings/get-shop-status`;
export const DISABLE_SHOP_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/settings/disable-shop`;
export const ENABLE_SHOP_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/settings/enable-shop`;

// Roles and Permissions
export const ALL_PERMISSION_DEFINITIONS_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/roles/permission_definitions/`;

// Sales
export const getSaleOrdersUrl = (id: string | number) => `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/sales/${id}/orders/`;

// logging
export const LOG_CRM_ERROR_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/crm/logCrmError/`;

// update checking
export const CHECK_UPDATE_URL = `${API_PROTOCOL}${BASE_PLATFORM_API_URL}/crm/last-update/`;
