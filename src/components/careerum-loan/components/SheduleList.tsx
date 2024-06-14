import moment from "moment";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Currency } from "~/api/model";
import { classnames } from "~/api/utils/strings";
import { ReactComponent as ArrowLeftSvg } from "~/assets/svg/arrow-left-1.svg";
import { ReactComponent as ArrowRightSvg } from "~/assets/svg/arrow-right-1.svg";
import { getBeautifyPrice } from "~/components/order-payment/order-payment.utils";

const SHEDULE_SCROLL_STEP = 150
const CURRENT_DATE = new Date()

interface SheduleListProps {
  items?: Array<number>
  currency?: Currency
}

export default function SheduleList({ items = [], currency }: SheduleListProps) {
  const { t, i18n } = useTranslation()
  const [scrollWrapperRef, setScrollWrapperRef] = useState<HTMLDivElement | null>(null)

  const hideSheduleScroll = useMemo(() => {
    if (!scrollWrapperRef) return true

    return scrollWrapperRef.scrollWidth <= scrollWrapperRef.clientWidth
  }, [scrollWrapperRef])

  const arrowsClassname = classnames({
    "shedule__arrows": true,
    "hide": hideSheduleScroll
  })

  const wrapperClassname = classnames({
    "shedule__wrapper": true,
    "no-scroll": hideSheduleScroll
  })

  const scrollLeft = () => {
    if (!scrollWrapperRef || scrollWrapperRef.scrollLeft === undefined) return

    scrollWrapperRef.scrollLeft -= SHEDULE_SCROLL_STEP
  }

  const scrollRight = () => {
    if (!scrollWrapperRef || scrollWrapperRef?.scrollLeft === undefined) return

    scrollWrapperRef.scrollLeft += SHEDULE_SCROLL_STEP
  }

  const getSheduleDate = (daysStep: number) => {
    return moment(CURRENT_DATE, "", i18n.language).add(daysStep, "days").format("DD MMMM[\r\n]YYYY")
  }

  return (
    <>
      <div className={wrapperClassname} ref={(ref) => setScrollWrapperRef(ref)}>
        <div className="shedule__items six-month">
          {items.map((price, index) => (
            <div key={index} className={`shedule__item ${index === 0 ? "item-current" : ""}`}>
              {index === 0 ? (
                <p className="item__header" children={t("CareerumLoan.FirstPayment")} />
              ) : (
                <p className="item__date" children={getSheduleDate(index * 30)} />
              )}
              <p className="item__amount" children={getBeautifyPrice(price, currency?.sign || "")} />
              <div className="separator" />
            </div>
          ))}
        </div>
      </div>
      <div className={arrowsClassname}>
        <div className="shedule__arrow-left" onClick={scrollLeft}>
          <ArrowLeftSvg />
        </div>
        <div className="shedule__arrow-right" onClick={scrollRight}>
          <ArrowRightSvg />
        </div>
      </div>
    </>
  )
}
