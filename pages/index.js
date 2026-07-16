import Link from "next/link";
import StudyFinder from "@/components/StudyFinder";
import Reveal from "@/components/Reveal";
import Seo from "@/components/Seo";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  const students = [
    { key: 'student1', quote: t('home.student1Quote'), faculty: t('home.student1Faculty'), country: t('home.student1Country'), name: "Ekrem Zajmi" },
    { key: 'student2', quote: t('home.student2Quote'), faculty: t('home.student2Faculty'), country: t('home.student2Country'), name: "Meriem Amrane" },
    { key: 'student3', quote: t('home.student3Quote'), faculty: t('home.student3Faculty'), country: t('home.student3Country'), name: "Soo Yeon Park" },
  ];

  return (
    <>
      <Seo title={t('home.metaTitle')} description={t('home.metaDescription')} path="/" />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-slides-wrap" style={{ background: "linear-gradient(135deg, rgba(15, 26, 60, 0.8) 0%, rgba(227, 28, 37, 0.6) 100%), url('/hero.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="hero-content" style={{ margin: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
            <h1 style={{ color: "white" }}>{t('home.heroTitle')}</h1>
            <p style={{ fontWeight: 500, color: "white" }}>{t('home.heroSubtitle')}</p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/register" className="btn-primary" style={{ backgroundColor: "var(--accent)", color: "var(--text-main)" }}>{t('home.applyNow')}</Link>
              <Link href="/universities" className="btn-secondary" style={{ color: "white", borderColor: "white" }}>{t('home.exploreUniversities')}</Link>
            </div>
          </div>
        </div>
      </section>

      <StudyFinder />

      {/* WHY TÜRKIYE / WHY US SECTION */}
      <section className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>{t('home.whyTitle')}</h2>
            <p>{t('home.whySubtitle')}</p>
          </Reveal>
          <div className="grid-4">
            {[
              { icon: "🌉", title: t('home.why1Title'), desc: t('home.why1Desc') },
              { icon: "🎓", title: t('home.why2Title'), desc: t('home.why2Desc') },
              { icon: "✅", title: t('home.why3Title'), desc: t('home.why3Desc') },
              { icon: "🤝", title: t('home.why4Title'), desc: t('home.why4Desc') },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="card text-center">
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-text">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TURKISH LANGUAGE COURSE SECTION */}
      <section className="section" style={{ background: "linear-gradient(to right, #0F1A3C, #1a2a5c)", color: "white" }}>
        <div className="container">
          <div className="responsive-2col" style={{ gap: "4rem", alignItems: "center" }}>
            <Reveal>
              <div style={{ background: "var(--primary)", display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>{t('home.courseBadge')}</div>
              <h2 style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: "1.1" }}>{t('home.courseTitleLine1')}<br/><span style={{ color: "var(--accent)" }}>{t('home.courseTitleLine2')}</span></h2>
              <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "rgba(255,255,255,0.8)" }}>{t('home.courseDesc')}</p>

              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", background: "rgba(255,255,255,0.1)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div>
                  <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.5)", fontSize: "1.2rem", display: "block" }}>{t('home.priceOld')}</span>
                  <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--accent)", lineHeight: "1" }}>{t('home.priceNew')}</span>
                </div>
                <div style={{ borderLeft: "2px solid rgba(255,255,255,0.2)", paddingLeft: "1.5rem" }}>
                  <h4 style={{ color: "var(--accent)", fontSize: "1.1rem", marginBottom: "0.2rem" }}>{t('home.priceGuarantee')}</h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>{t('home.priceDesc')}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                 <a href="https://whatsapp.com/channel/0029VbDH6rm0wajxEpZrUB0b" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#25D366" }}>
                    {t('home.whatsappUs')}
                 </a>
                 <a href="https://www.instagram.com/goturkey2k2x" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    {t('home.dmInstagram')}
                 </a>
              </div>
            </Reveal>

            <Reveal delay={150} className="responsive-2col" style={{ gap: "1rem" }}>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t('home.course1Title')}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t('home.course1Desc')}</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t('home.course2Title')}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t('home.course2Desc')}</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t('home.course3Title')}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t('home.course3Desc')}</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t('home.course4Title')}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t('home.course4Desc')}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5 STEPS */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <Reveal className="section-header">
            <h2>{t('home.stepsTitle')}</h2>
            <p>{t('home.stepsSubtitle')}</p>
          </Reveal>
          <div className="grid-3">
            {[
              { num: 1, title: t('home.step1Title'), desc: t('home.step1Desc') },
              { num: 2, title: t('home.step2Title'), desc: t('home.step2Desc') },
              { num: 3, title: t('home.step3Title'), desc: t('home.step3Desc') },
              { num: 4, title: t('home.step4Title'), desc: t('home.step4Desc') },
              { num: 5, title: t('home.step5Title'), desc: t('home.step5Desc') },
            ].map((step, i) => (
              <Reveal key={step.num} delay={(i % 3) * 90}>
                <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "3rem", fontWeight: "900", color: "var(--primary)", opacity: 0.3, lineHeight: 1 }}>{step.num}</div>
                  <div>
                    <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>{step.title}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENTS SAY */}
      <section className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>{t('home.studentsTitle')}</h2>
            <p>{t('home.studentsSubtitle')}</p>
          </Reveal>
          <div className="grid-3">
            {students.map((s, i) => (
              <Reveal key={s.key} delay={i * 100}>
                <div className="card" style={{ position: "relative", paddingTop: "2.5rem" }}>
                  <div style={{ position: "absolute", top: "10px", left: "20px", fontSize: "4rem", color: "var(--primary)", opacity: 0.1, fontFamily: "serif", lineHeight: 1 }}>&quot;</div>
                  <p style={{ fontStyle: "italic", color: "var(--text-muted)", marginBottom: "1.5rem" }}>{s.quote}</p>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                     <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--secondary)", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                        {s.name.charAt(0)}
                     </div>
                     <div>
                        <h4 style={{ color: "var(--secondary)", fontSize: "1rem" }}>{s.name}</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{s.faculty} | {s.country}</p>
                     </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section text-center" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #a01010 60%, var(--secondary) 100%)", color: "white" }}>
        <Reveal as="div" className="container">
          <h2 style={{ color: "white", marginBottom: "1rem" }}>{t('home.ctaTitle')}</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>{t('home.ctaSubtitle')}</p>
          <Link href="/register" className="btn-primary" style={{ fontSize: "1.1rem", padding: "12px 32px", background: "white", color: "var(--primary) !important" }}>{t('home.ctaButton')}</Link>
        </Reveal>
      </section>
    </>
  );
}
