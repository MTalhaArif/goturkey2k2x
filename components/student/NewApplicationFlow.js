import { useMemo, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { universities } from '@/lib/universities';
import { filterUniversities } from '@/lib/universityFilters';
import { useTranslation } from '@/lib/i18n/useTranslation';

const LEVELS = ['Vocational School', 'Undergraduate', "Master's", 'Ph.D.'];

const emptyDocuments = {
  picture: null, passport: null, highSchool1: null, highSchool2: null,
  bachelorDegree: null, bachelorTranscript: null, masterDegree: null, masterTranscript: null,
  languageProficiency: null, cv: null, recommendationLetter: null, other: null,
};

export default function NewApplicationFlow({ uid, onCreated, onCancel }) {
  const { t, locale } = useTranslation();
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
      alert(t('student.newApplicationFlow.errorCreating'));
    } finally {
      setCreating(false);
    }
  };

  if (!selectedUniversity) {
    return (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>{t('student.newApplicationFlow.chooseUniversity')}</h2>
          <button onClick={onCancel} className="btn-secondary" style={{ padding: '8px 16px' }}>{t('student.newApplicationFlow.cancel')}</button>
        </div>

        <input
          type="text"
          className="form-input"
          placeholder={t('student.newApplicationFlow.searchPlaceholder')}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <input type="checkbox" checked={privateOnly} onChange={(e) => setPrivateOnly(e.target.checked)} />
          {t('student.newApplicationFlow.privateOnly')}
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
          {results.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>{t('student.newApplicationFlow.noMatches')}</p>
          ) : (
            results.map((uni) => (
              <button
                key={uni.id}
                onClick={() => setSelectedUniversity(uni)}
                style={{ textAlign: locale === 'ar' ? 'right' : 'left', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
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
        <button onClick={() => setSelectedUniversity(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>{t('student.newApplicationFlow.changeUniversity')}</button>
      </div>

      <form onSubmit={handleCreate}>
        <div className="form-group mb-8">
          <label className="form-label">{t('student.newApplicationFlow.applicationLevel')}</label>
          <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)} required>
            {LEVELS.map((l) => <option key={l} value={l}>{t(`levelOptions.${l}`)}</option>)}
          </select>
        </div>

        <div className="form-group mb-8">
          <label className="form-label">{t('student.newApplicationFlow.program')}</label>
          <select className="form-select" value={programName} onChange={(e) => setProgramName(e.target.value)} required>
            <option value="">{t('student.newApplicationFlow.selectProgram')}</option>
            {selectedUniversity.programs.map((p) => <option key={p} value={p}>{p}</option>)}
            <option value="__other__">{t('student.newApplicationFlow.otherNotListed')}</option>
          </select>
        </div>

        {programName === '__other__' && (
          <div className="form-group mb-8">
            <label className="form-label">{t('student.newApplicationFlow.programName')}</label>
            <input type="text" className="form-input" value={customProgram} onChange={(e) => setCustomProgram(e.target.value)} placeholder={t('student.newApplicationFlow.programNamePlaceholder')} required />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
          {creating ? t('student.newApplicationFlow.startingApplication') : t('student.newApplicationFlow.startApplication')}
        </button>
      </form>
    </div>
  );
}
