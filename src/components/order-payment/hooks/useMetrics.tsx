import { useEffect, useState } from "react";

export default function useMetrics() {
  const [metricsAppended, setMetricsAppended] = useState(false)

  const appendHeaderMetrics = () => {
    const firstScript = document.createElement("script")
    firstScript.innerHTML = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-54HT44R');"

    const secondScript = document.createElement("script")
    secondScript.innerHTML = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="6G3S6qjLV8CIrJNIoVRRGflTqyaQDXK2";;analytics.SNIPPET_VERSION="4.15.3";analytics.load("6G3S6qjLV8CIrJNIoVRRGflTqyaQDXK2");analytics.page();}}();`

    const thirdScript = document.createElement("script")
    thirdScript.innerHTML = '(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");ym(49940842, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});'

    const noscript = document.createElement("noscript")
    noscript.innerHTML = "<div><img src='https://mc.yandex.ru/watch/49940842' style='position:absolute;left:-9999px;'></img></div>"

    document.head.appendChild(firstScript)
    document.head.appendChild(secondScript)
    document.head.appendChild(thirdScript)
    document.head.appendChild(noscript)
  }

  const appendTopBodyMetrics = () => {
    const noscriptEl = document.createElement("noscript")
    const iframeEl = document.createElement("iframe")

    iframeEl.src = "https://www.googletagmanager.com/ns.html?id=GTM-54HT44R"
    iframeEl.width = "0"
    iframeEl.height = "0"
    iframeEl.style.display = "none"
    iframeEl.style.visibility = "hidden"

    noscriptEl.appendChild(iframeEl)
    document.body.prepend(noscriptEl)
  }

  const appendFooterMetrics = () => {
    const firstScript = document.createElement("script")
    firstScript.innerHTML = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '162403264315817');fbq('track', 'PageView');"

    const noscript = document.createElement("noscript")
    noscript.innerHTML = `<img height="1" width="1" src="https://www.facebook.com/tr?id=162403264315817&ev=PageView&noscript=1" style="display:none;" />`

    const secondScript = document.createElement("script")
    secondScript.async = true
    secondScript.src = "https://www.googletagmanager.com/gtag/js?id=UA-102930620-2"

    const thirdScript = document.createElement("script")
    thirdScript.innerHTML = "window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-102930620-2');"

    document.body.appendChild(firstScript)
    document.body.appendChild(noscript)
    document.body.appendChild(secondScript)
    document.body.appendChild(thirdScript)
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && !metricsAppended) {
      appendHeaderMetrics()
      appendTopBodyMetrics()
      appendFooterMetrics()
      setMetricsAppended(true)
    }
  }, [metricsAppended])
}
