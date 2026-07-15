import Head from "next/head";
import Reveal from "@/components/Reveal";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    { title: t('services.s1Title'), desc: t('services.s1Desc') },
    { title: t('services.s2Title'), desc: t('services.s2Desc') },
    { title: t('services.s3Title'), desc: t('services.s3Desc') },
    { title: t('services.s4Title'), desc: t('services.s4Desc') },
    { title: t('services.s5Title'), desc: t('services.s5Desc') },
    { title: t('services.s6Title'), desc: t('services.s6Desc') },
    { title: t('services.s7Title'), desc: t('services.s7Desc') },
    { title: t('services.s8Title'), desc: t('services.s8Desc') },
  ];

  return (
    <>
      <Head>
        <title>{t('services.metaTitle')}</title>
      </Head>
      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>{t('services.title')}</h2>
            <p>{t('services.subtitle')}</p>
          </Reveal>
          <div className="grid-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 90}>
                <div className="card">
                  <h3 className="card-title">{s.title}</h3>
                  <p className="card-text">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
