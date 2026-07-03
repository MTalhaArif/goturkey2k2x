import "@/styles/globals.css";
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/admin') || router.pathname.startsWith('/student');

  if (isDashboard) {
    return (
      <DashboardLayout>
        <Component {...pageProps} />
      </DashboardLayout>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
