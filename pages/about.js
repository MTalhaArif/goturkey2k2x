import Head from "next/head";
import Reveal from "@/components/Reveal";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | GoTurkey 2k2x</title>
      </Head>

      <section className="section section-bg" style={{ minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "1000px" }}>
          <Reveal className="section-header">
            <h2>About GoTurkey 2k2x</h2>
            <p>Your trusted partner for educational consulting and admissions in Turkey.</p>
          </Reveal>

          <Reveal delay={100} style={{ marginBottom: "4rem", textAlign: "center", maxWidth: "800px", margin: "0 auto 4rem auto" }}>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-main)" }}>
              At GoTurkey 2k2x, we believe in breaking down borders and building futures.
              Our mission is to seamlessly connect international students with top-tier Turkish universities,
              providing guaranteed acceptance and comprehensive post-landing services.
              We handle the complexities of university applications, visas, and relocation so you can focus on your education.
            </p>
          </Reveal>

          <div className="section-header">
            <h2 style={{ fontSize: "2rem" }}>Our Leadership Team</h2>
          </div>

          <div className="responsive-2col" style={{ gap: "3rem" }}>
            {/* CEO Profile */}
            <Reveal>
              <div className="card text-center" style={{ borderTop: "4px solid var(--primary)" }}>
                <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "var(--secondary)", color: "white", margin: "0 auto 1.5rem auto", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "3rem", fontWeight: "bold" }}>
                  MA
                </div>
                <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>Muhammad Talha Arif</h3>
                <h4 style={{ color: "var(--primary)", fontSize: "1rem", marginBottom: "1rem" }}>Chief Executive Officer (CEO)</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  As the CEO and visionary behind GoTurkey 2k2x, Muhammad Talha Arif leads the strategic direction of the company. With a profound understanding of international education dynamics and technology, he has built a robust network of Turkish university partnerships, ensuring students receive premium consulting and guaranteed pathways to their dream careers.
                </p>
              </div>
            </Reveal>

            {/* Creative Director Profile */}
            <Reveal delay={120}>
              <div className="card text-center" style={{ borderTop: "4px solid var(--accent)" }}>
                <div style={{ width: "150px", height: "150px", borderRadius: "50%", background: "#e2e8f0", margin: "0 auto 1.5rem auto", overflow: "hidden" }}>
                   <img src="https://ui-avatars.com/api/?name=Seemab+Kanwal&background=FFD700&color=0F1A3C&size=150" alt="Seemab Kanwal" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>Seemab Kanwal</h3>
                <h4 style={{ color: "var(--primary)", fontSize: "1rem", marginBottom: "1rem" }}>Creative Director & Marketing</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  Seemab Kanwal is the Creative Director and Marketing Lead at GoTurkey 2k2x, widely recognized online as &apos;@theturkgirl_&apos; with a dedicated community of over 14,000 followers. With her deep expertise in Turkish culture, education, and tourism, she designs engaging digital campaigns that showcase student life and university opportunities in Turkey, playing a key role in connecting international applicants with their future.
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <a href="https://www.instagram.com/theturkgirl_" target="_blank" rel="noreferrer" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.9rem" }}>View on Instagram →</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
