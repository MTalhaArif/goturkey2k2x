import { useMemo, useState } from "react";
import Head from "next/head";
import { universities } from "@/lib/universities";
import { filterUniversities } from "@/lib/universityFilters";
import Reveal from "@/components/Reveal";

export default function Universities() {
  const [term, setTerm] = useState('');
  const [privateOnly, setPrivateOnly] = useState(true);

  const results = useMemo(
    () => filterUniversities(universities, { term, privateOnly }),
    [term, privateOnly]
  );

  return (
    <>
      <Head>
        <title>Universities in Türkiye | GoTurkey 2k2x</title>
      </Head>

      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>Universities in Türkiye</h2>
            <p>Explore {universities.length} universities across Türkiye, from top private institutions to state universities, offering globally recognized degrees.</p>
          </Reveal>

          <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by university, city, or program..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              style={{ fontSize: '1.05rem', padding: '14px 18px' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={privateOnly} onChange={(e) => setPrivateOnly(e.target.checked)} />
              Private universities only ({results.filter((u) => u.type === 'Foundation').length} shown)
            </label>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {results.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No universities match your search.</p>
            ) : (
              results.map((uni, i) => (
                <Reveal key={uni.id} delay={(i % 5) * 80}>
                  <div style={{ background: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", borderLeft: "4px solid var(--primary)" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: "var(--secondary)", fontSize: "1.5rem" }}>{uni.name}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{uni.city}</span>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>· {uni.type}</span>
                      </div>
                    </div>
                    {uni.website && (
                      <a href={`https://${uni.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                        {uni.website} ↗
                      </a>
                    )}
                    <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginTop: '1rem', marginBottom: "0.5rem" }}>Programs:</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {uni.programs.map((program) => (
                        <span key={program} style={{ background: "var(--bg-color)", padding: "8px 12px", borderRadius: "6px", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
}
