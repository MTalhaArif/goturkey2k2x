import Head from "next/head";
import Reveal from "@/components/Reveal";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('about.metaTitle')}</title>
      </Head>

      <section className="section section-bg" style={{ minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <Reveal className="section-header">
            <h2>{t('about.title')}</h2>
            <p>{t('about.subtitle')}</p>
          </Reveal>

          <Reveal delay={100} style={{ marginBottom: "4rem", textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem auto" }}>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-main)" }}>
              {t('about.mission')}
            </p>
          </Reveal>

          <div className="section-header">
            <h2 style={{ fontSize: "2rem" }}>{t('about.leadershipTitle')}</h2>
          </div>

          <div className="responsive-2col" style={{ gap: "3rem" }}>
            {/* CEO Profile */}
            <Reveal>
              <div className="card text-center" style={{ borderTop: "4px solid var(--primary)" }}>
                <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#e2e8f0", margin: "0 auto 1.5rem auto", overflow: "hidden" }}>
                  <img src="/talha.jpg" alt="Muhammad Talha Arif" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>Muhammad Talha Arif</h3>
                <h4 style={{ color: "var(--primary)", fontSize: "1rem", marginBottom: "1rem" }}>{t('about.ceoTitle')}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  {t('about.ceoBio')}
                </p>
                <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="https://www.instagram.com/goturkey2k2x?igsh=N2ZzODBhYmQzZWZn&utm_source=qr" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem" }}>{t('about.viewInstagram')}</a>
                  <a href="https://www.upwork.com/freelancers/trproductions" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem" }}>{t('about.viewUpwork')}</a>
                </div>
              </div>
            </Reveal>

            {/* Creative Director Profile */}
            <Reveal delay={120}>
              <div className="card text-center" style={{ borderTop: "4px solid var(--accent)" }}>
                <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#e2e8f0", margin: "0 auto 1.5rem auto", overflow: "hidden" }}>
                   <img src="https://ui-avatars.com/api/?name=Seemab+Kanwal&background=FFD700&color=0F1A3C&size=150" alt="Seemab Kanwal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>Seemab Kanwal</h3>
                <h4 style={{ color: "var(--primary)", fontSize: "1rem", marginBottom: "1rem" }}>{t('about.creativeDirectorTitle')}</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  {t('about.creativeDirectorBio')}
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <a href="https://www.instagram.com/theturkgirl_" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem" }}>{t('about.viewInstagram')}</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
