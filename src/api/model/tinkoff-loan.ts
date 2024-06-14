export interface TinkoffLoanParams {
  sum: number
  items: TinkoffLoanItems[]
  values?: TinkoffLoanValues
  failURL?: string
  successURL?: string
  returnURL?: string
}

export interface TinkoffLoanItems {
  name: string
  quantity: number
  price: number
  category?: string
  vendorCode?: string
}

export interface TinkoffLoanValues {
  contact?: {
    fio?: {
      lastName?: string
      firstName?: string
      middleName?: string
    }
    mobilePhone?: string
    email?: string
  }
}
