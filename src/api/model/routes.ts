export enum AppRoutes {
    orderPayment = '/order/:hash',
    careerumLoan = '/loan/:hash',
    careerumLoanPayment = '/loan/pay/:hash',
    authLayer = "https://web.careerum.com/check-in",
}

export enum StaticFilesRoutes {
    // additional script for platform user usage
    PageInsertJS = '/scripts/page-insert.js',
    PageFormHandlerJS = '/scripts/page-form-handler.js',
    // additional static page for silent login
    SilentCheckSSOPage = '/silent-check-sso.html',
    // apple domain verification
    AppleDomainVerification = '/.well-known/apple-developer-merchantid-domain-association'
}
