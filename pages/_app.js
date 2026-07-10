import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/DashboardLayout";
import { AuthProvider } from "@/lib/AuthContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/admin') || router.pathname.startsWith('/student');

  return (
    <AuthProvider>
      {isDashboard ? (
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </AuthProvider>
  );
}
