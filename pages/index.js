import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const students = [
    { name: "Ekrem Zajmi", faculty: "Faculty of Political Sciences", country: "KOSOVO", quote: "Studying in Türkiye has been a transformative experience. The academic environment is world-class, and the Turkish people are incredibly welcoming." },
    { name: "Meriem Amrane", faculty: "Faculty of Engineering", country: "ALGERIA", quote: "The quality of education here is outstanding. My professors are highly knowledgeable and the facilities are modern." },
    { name: "Soo Yeon Park", faculty: "Faculty of Languages History and Geography", country: "KOREA", quote: "Türkiye is a perfect blend of East and West. As a language student, immersing myself in Turkish culture while studying has been invaluable." }
  ];

  return (
    <>
      <Head>
        <title>GoTurkey 2k2x | Your Gateway to a Better Tomorrow</title>
        <meta name="description" content="Study in Turkey with guaranteed acceptance. Bachelors and Masters programs in top public and private universities." />
      </Head>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-slides-wrap" style={{ background: "linear-gradient(135deg, rgba(15, 26, 60, 0.8) 0%, rgba(227, 28, 37, 0.6) 100%), url('/hero.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="hero-content" style={{ margin: "auto", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white" }}>
            <h1 style={{ color: "white" }}>September 2026 Intake is Open!</h1>
            <p style={{ fontWeight: 500, color: "white" }}>High-Quality Higher Education Opportunities in Worldwide Known Universities</p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/register" className="btn-primary" style={{ backgroundColor: "var(--accent)", color: "var(--text-main)" }}>Apply Now</Link>
              <Link href="/universities" className="btn-secondary" style={{ color: "white", borderColor: "white" }}>Explore Universities</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TÜRKIYE / WHY US SECTION */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Türkiye & GoTurkey 2k2x?</h2>
            <p>We provide a seamless transition to your dream education in Turkey.</p>
          </div>
          <div className="grid-4">
            <div className="card text-center">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌉</div>
              <h3 className="card-title">Bridge to the World</h3>
              <p className="card-text">Sitting at the crossroads of two continents, Europe and Asia, it offers a diverse cultural experience like no other.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎓</div>
              <h3 className="card-title">Quality Education</h3>
              <p className="card-text">Learn at 21st-century technological campuses and choose from nearly 45,000 degree programs globally recognized.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
              <h3 className="card-title">Guaranteed Acceptance</h3>
              <p className="card-text">We secure your university acceptance within 15 days through our extensive partner network.</p>
            </div>
            <div className="card text-center">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🤝</div>
              <h3 className="card-title">Post-Landing Services</h3>
              <p className="card-text">Airport pickup, accommodation, SIM card, transport card, residency, and bank account setup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TURKISH LANGUAGE COURSE SECTION */}
      <section className="section" style={{ background: "linear-gradient(to right, #0F1A3C, #1a2a5c)", color: "white" }}>
        <div className="container">
          <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div style={{ background: "var(--primary)", display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "1rem", letterSpacing: "1px" }}>BATCH 1 - 2026 • STARTING SOON</div>
              <h2 style={{ fontSize: "3rem", marginBottom: "1rem", lineHeight: "1.1" }}>1 Month of<br/><span style={{ color: "var(--accent)" }}>Turkish Learning</span></h2>
              <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "rgba(255,255,255,0.8)" }}>Are you coming to Türkiye on a Study Visa or for a Visit? Your journey starts with a word! Learn the language to feel like a local on your first day.</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", background: "rgba(255,255,255,0.1)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div>
                  <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.5)", fontSize: "1.2rem", display: "block" }}>100 USD</span>
                  <span style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--accent)", lineHeight: "1" }}>35 USD</span>
                </div>
                <div style={{ borderLeft: "2px solid rgba(255,255,255,0.2)", paddingLeft: "1.5rem" }}>
                  <h4 style={{ color: "var(--accent)", fontSize: "1.1rem", marginBottom: "0.2rem" }}>Best Price Guarantee</h4>
                  <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>Quality learning at the best value.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                 <a href="https://whatsapp.com/channel/0029VbDH6rm0wajxEpZrUB0b" target="_blank" rel="noreferrer" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#25D366" }}>
                    WhatsApp Us
                 </a>
                 <a href="https://www.instagram.com/goturkey2k2x" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", borderColor: "rgba(255,255,255,0.3)" }}>
                    DM on Instagram
                 </a>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>📹 Online Classes on Zoom</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Learn from anywhere, anytime with interactive sessions.</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>🗓️ Weekend Classes</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Flexible and convenient schedule for students and workers.</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>🎓 Expert Native Teachers</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Speak with confidence and understand with ease.</p>
              </div>
              <div style={{ background: "white", color: "var(--secondary)", padding: "1.5rem", borderRadius: "12px" }}>
                <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>📜 Certificate of Completion</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Add value to your future with official certification.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 STEPS */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="section-header">
            <h2>APPLY IN 5 STEPS</h2>
            <p>Your journey to studying in Türkiye is simple and straightforward.</p>
          </div>
          <div className="grid-3">
            {[
              { num: 1, title: "Explore Programs", desc: "Use our tools to find the perfect university and degree program." },
              { num: 2, title: "Prepare Documents", desc: "Gather your diploma, transcripts, passport, CV, and photos." },
              { num: 3, title: "Submit Application", desc: "Fill out our quick registration form online." },
              { num: 4, title: "Get Acceptance", desc: "Receive your acceptance letter within 15 days." },
              { num: 5, title: "Visa & Travel", desc: "Apply for your student visa and let us handle your post-landing needs." }
            ].map((step, i) => (
              <div key={i} className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ fontSize: "3rem", fontWeight: "900", color: "var(--primary)", opacity: 0.3, lineHeight: 1 }}>{step.num}</div>
                <div>
                  <h3 style={{ color: "var(--secondary)", marginBottom: "0.5rem" }}>{step.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENTS SAY */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2>What Our Students Say</h2>
            <p>Read about the experiences of international students currently studying in Türkiye.</p>
          </div>
          <div className="grid-3">
            {students.map((s, i) => (
              <div key={i} className="card" style={{ position: "relative", paddingTop: "2.5rem" }}>
                <div style={{ position: "absolute", top: "10px", left: "20px", fontSize: "4rem", color: "var(--primary)", opacity: 0.1, fontFamily: "serif", lineHeight: 1 }}>"</div>
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
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA SECTION */}
      <section className="section text-center" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #a01010 60%, var(--secondary) 100%)", color: "white" }}>
        <div className="container">
          <h2 style={{ color: "white", marginBottom: "1rem" }}>Ready to Start Your Journey?</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem" }}>Join thousands of students who have trusted us with their future.</p>
          <Link href="/register" className="btn-primary" style={{ fontSize: "1.1rem", padding: "12px 32px", background: "white", color: "var(--primary) !important" }}>Start Your Application</Link>
        </div>
      </section>
    </>
  );
}
