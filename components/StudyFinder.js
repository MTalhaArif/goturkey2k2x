import { useMemo, useState } from 'react';
import Link from 'next/link';
import { universities } from '@/lib/universities';

export default function StudyFinder() {
  const [term, setTerm] = useState('');

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];

    return universities
      .map((uni) => {
        const nameMatches = uni.name.toLowerCase().includes(q);
        const matchedDepartments = uni.departments.filter((d) => d.toLowerCase().includes(q));
        if (!nameMatches && matchedDepartments.length === 0) return null;
        return {
          ...uni,
          matchedDepartments: nameMatches ? uni.departments : matchedDepartments,
        };
      })
      .filter(Boolean)
      .slice(0, 8);
  }, [term]);

  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <div className="section-header">
          <h2>Find Your University & Program</h2>
          <p>Search by university name or the program you want to study, e.g. &quot;Medicine&quot; or &quot;Koç&quot;.</p>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search universities or programs..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={{ fontSize: '1.05rem', padding: '16px 20px' }}
          />

          {term.trim() && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matches found. Try a different program or university name.
                </p>
              ) : (
                results.map((uni) => (
                  <div key={uni.name} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                    <h3 style={{ color: 'var(--secondary)', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{uni.name}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {uni.matchedDepartments.map((dept) => (
                        <span key={dept} style={{ background: 'var(--bg-color)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <Link href="/universities" className="btn-secondary" style={{ marginRight: '1rem' }}>Browse All Universities</Link>
            <Link href="/register" className="btn-primary">Apply Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
