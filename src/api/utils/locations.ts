import { Order } from "../model";
import { getCookie } from "./cookies";

// export enum Locations {
//     Russia = 'Russia',
//     Europe = 'Europe',
//     Other = 'Other',
// }

const locationCookieKey = "navlocation";

export const getLocationFromCookie = () => {
  const locationFromCookie = getCookie(locationCookieKey);
  return locationFromCookie;
};

export const definePageLang = (order: Order): "ru" | "en" => {
  const isInternational = !!order?.Client.international
  const browserLang = navigator.language.slice(0, 2)
  const queryLang = new URLSearchParams(window.location.search).get("lang")

  const lang = isInternational || queryLang === "en" || browserLang !== "ru"
    ? "en" 
    : "ru"
  
  return lang
}
