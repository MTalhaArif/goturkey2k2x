import { useMemo, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { universities } from '@/lib/universities';
import { filterUniversities } from '@/lib/universityFilters';

const LEVELS = ['Vocational School', 'Undergraduate', "Master's", 'Ph.D.'];

const emptyDocuments = {
  picture: null, passport: null, highSchool1: null, highSchool2: null,
  bachelorDegree: null, bachelorTranscript: null, masterDegree: null, masterTranscript: null,
  languageProficiency: null, cv: null, recommendationLetter: null, other: null,
};

export default function NewApplicationFlow({ uid, onCreated, onCancel }) {
  const [term, setTerm] = useState('');
  const [privateOnly, setPrivateOnly] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [programName, setProgramName] = useState('');
  const [customProgram, setCustomProgram] = useState('');
  const [level, setLevel] = useState('Undergraduate');
  const [creating, setCreating] = useState(false);

  const results = useMemo(() => filterUniversities(universities, { term, privateOnly }), [term, privateOnly]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const finalProgram = programName === '__other__' ? customProgram : programName;
    if (!selectedUniversity || !finalProgram) return;

    setCreating(true);
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'applications'), {
        studentUid: uid,
        universityId: String(selectedUniversity.id),
        universityName: selectedUniversity.name,
        universityType: selectedUniversity.type,
        programName: finalProgram,
        level,
        stage: 'documents_pending',
        documents: emptyDocuments,
        googleDriveLink: '',
        adminNotes: '',
        offerLetterUrl: null,
        paymentSlipUrl: null,
        createdAt: now,
        updatedAt: now,
      });
      onCreated(docRef.id);
    } catch (error) {
      console.error('Error creating application:', error);
      alert('There was an error starting your application. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (!selectedUniversity) {
    return (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>Choose a University</h2>
          <button onClick={onCancel} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
        </div>

        <input
          type="text"
          className="form-input"
          placeholder="Search by university, city, or program..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={privateOnly} onChange={(e) => setPrivateOnly(e.target.checked)} />
          Private universities only
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
          {results.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No universities match your search.</p>
          ) : (
            results.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setSelectedUniversity(uni)}
                style={{ textAlign: 'left', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
              >
                <strong style={{ color: 'var(--secondary)' }}>{uni.name}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{uni.city} · {uni.type}</div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>{selectedUniversity.name}</h2>
        <button onClick={() => setSelectedUniversity(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>Change University</button>
      </div>

      <form onSubmit={handleCreate}>
        <div className="form-group mb-8">
          <label className="form-label">Application Level *</label>
          <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)} required>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="form-group mb-8">
          <label className="form-label">Program *</label>
          <select className="form-select" value={programName} onChange={(e) => setProgramName(e.target.value)} required>
            <option value="">Select a program</option>
            {selectedUniversity.programs.map((p) => <option key={p} value={p}>{p}</option>)}
            <option value="__other__">Other / not listed</option>
          </select>
        </div>

        {programName === '__other__' && (
          <div className="form-group mb-8">
            <label className="form-label">Program Name *</label>
            <input type="text" className="form-input" value={customProgram} onChange={(e) => setCustomProgram(e.target.value)} placeholder="e.g. Computer Engineering" required />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
          {creating ? 'Starting Application...' : 'Start Application'}
        </button>
      </form>
    </div>
  );
}
