import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Script from "next/script";
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/DashboardLayout";
import ChatWidget from "@/components/ChatWidget";
import { AuthProvider } from "@/lib/AuthContext";
import { useRouter } from "next/router";
import { GA_MEASUREMENT_ID, pageview } from "@/lib/gtag";

const isProduction = process.env.NODE_ENV === 'production';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/admin') || router.pathname.startsWith('/student');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && isProduction) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!isProduction) return;
    const handleRouteChange = (url) => pageview(url);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <AuthProvider>
      {isProduction && (
        <>
          <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
      {isDashboard ? (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <ChatWidget />
    </AuthProvider>
  );
}
