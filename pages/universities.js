import Head from "next/head";
import { universities } from "@/lib/universities";

export default function Universities() {
  return (
    <>
      <Head>
        <title>Private Universities in Istanbul | GoTurkey 2k2x</title>
      </Head>
      
      <div className="section section-bg">
        <div className="container">
          <div className="section-header">
            <h2>Private Universities in Istanbul</h2>
            <p>Explore top-tier private institutions offering world-class education, modern campuses, and globally recognized degrees.</p>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {universities.map((uni, index) => (
              <div key={index} style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--primary)" }}>
                <h3 style={{ color: "var(--secondary)", fontSize: "1.5rem", marginBottom: "1rem" }}>{uni.name}</h3>
                <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>Available Departments / Faculties:</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {uni.departments.map((dept, i) => (
                    <span key={i} style={{ background: "var(--bg-color)", padding: "8px 12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                      {dept}
                    </span>
                  ))}
                  <span style={{ background: "var(--bg-color)", padding: "8px 12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--border)", fontStyle: "italic" }}>
                    + Many more associate and undergraduate programs...
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
