import Script from "next/script";

/**
 * Meta (Facebook) Pixel — carregado via next/script com strategy
 * "afterInteractive" pra não bloquear o LCP.
 *
 * Pixel ID hardcoded pra garantir que sempre renderize, mesmo se a env
 * NEXT_PUBLIC_META_PIXEL_ID não estiver no build. A env continua sendo um
 * override (útil pra apontar pra outro pixel em dev/preview).
 */
const PIXEL_ID_FALLBACK = "1884233408908633";

export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || PIXEL_ID_FALLBACK;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
