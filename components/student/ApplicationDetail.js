import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/uploadFile';
import { notifyAdminOfSubmission } from '@/lib/notifyAdmin';
import { STAGES } from '@/lib/applicationStages';
import { useTranslation } from '@/lib/i18n/useTranslation';

const PIPELINE_STAGES = STAGES.filter((s) => s !== 'rejected');

const DOCUMENT_SLOTS = [
  { key: 'picture', accept: '.jpg,.jpeg,.png', path: 'documents/photos' },
  { key: 'passport', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/passports' },
  { key: 'highSchool1', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/high_school' },
  { key: 'highSchool2', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/high_school' },
  { key: 'cv', accept: '.pdf,.doc,.docx', path: 'documents/cvs' },
];

const BACHELOR_SLOTS = [
  { key: 'bachelorDegree', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/bachelor' },
  { key: 'bachelorTranscript', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/bachelor' },
];

const MASTER_SLOTS = [
  { key: 'masterDegree', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/master' },
  { key: 'masterTranscript', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/master' },
];

const OPTIONAL_SLOTS = [
  { key: 'languageProficiency', accept: '.pdf,.jpg,.jpeg,.png', path: 'documents/language' },
  { key: 'recommendationLetter', accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx', path: 'documents/rec_letters' },
  { key: 'other', accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx', path: 'documents/other' },
];

export default function ApplicationDetail({ application, onBack, studentName, studentEmail }) {
  const { t } = useTranslation();
  const [files, setFiles] = useState({});
  const [googleDriveLink, setGoogleDriveLink] = useState(application.googleDriveLink || '');
  const [uploading, setUploading] = useState(false);
  const [slipFile, setSlipFile] = useState(null);

  const requiredSlots = [
    ...DOCUMENT_SLOTS,
    ...(application.level === "Master's" || application.level === 'Ph.D.' ? BACHELOR_SLOTS : []),
    ...(application.level === 'Ph.D.' ? MASTER_SLOTS : []),
  ];

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const saveDocuments = async (nextStage) => {
    setUploading(true);
    try {
      const uploadedDocs = {};
      const failedLabels = [];
      for (const slot of [...requiredSlots, ...OPTIONAL_SLOTS]) {
        if (files[slot.key]) {
          const url = await uploadFile(files[slot.key], slot.path);
          uploadedDocs[slot.key] = url;
          if (!url) failedLabels.push(t(`documentLabels.${slot.key}`));
        }
      }

      const appRef = doc(db, 'applications', application.id);
      const updates = {
        documents: { ...(application.documents || {}), ...uploadedDocs },
        googleDriveLink,
        updatedAt: new Date().toISOString(),
      };
      if (nextStage) updates.stage = nextStage;

      await updateDoc(appRef, updates);
      setFiles({});
      return { failedLabels };
    } catch (error) {
      console.error('Error saving documents:', error);
      alert(t('student.applicationDetail.errorSavingDocs'));
      return { failedLabels: [], hadError: true };
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    saveDocuments(null).then((result) => {
      if (!result || result.hadError) return;
      if (result.failedLabels.length > 0) {
        alert(t('student.applicationDetail.draftSavedWithFailures', { files: result.failedLabels.join(', ') }));
      } else {
        alert(t('student.applicationDetail.draftSaved'));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDocuments('submitted').then((result) => {
      window.scrollTo(0, 0);
      if (!result || result.hadError) return;
      notifyAdminOfSubmission({ application, studentName, studentEmail });
      if (result.failedLabels.length > 0) {
        alert(t('student.applicationDetail.submittedWithFailures', { files: result.failedLabels.join(', ') }));
      }
    });
  };

  const handleUploadSlip = async (e) => {
    e.preventDefault();
    if (!slipFile) return alert(t('student.applicationDetail.selectFileFirst'));
    setUploading(true);
    try {
      const url = await uploadFile(slipFile, 'documents/payments');
      if (!url) {
        alert(t('student.applicationDetail.slipUploadFailed'));
        return;
      }
      const appRef = doc(db, 'applications', application.id);
      const updates = { paymentSlipUrl: url, stage: 'payment_pending', updatedAt: new Date().toISOString() };
      await updateDoc(appRef, updates);
      setSlipFile(null);
      alert(t('student.applicationDetail.slipUploadSuccess'));
    } catch (err) {
      console.error(err);
      alert(t('student.applicationDetail.slipUploadError'));
    } finally {
      setUploading(false);
    }
  };

  const currentIndex = PIPELINE_STAGES.indexOf(application.stage);

  return (
    <div>
      <button onClick={onBack} className="btn-secondary" style={{ marginBottom: '1.5rem', padding: '8px 16px' }}>{t('student.applicationDetail.back')}</button>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--secondary)', marginBottom: '0.25rem' }}>{application.universityName}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{application.programName} · {application.level}</p>

        {application.stage === 'rejected' ? (
          <div style={{ padding: '1rem', background: '#fee2e2', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <strong style={{ color: '#b91c1c' }}>{t('student.applicationDetail.rejected')}</strong>
          </div>
        ) : (
          <div style={{ display: 'flex', overflowX: 'auto', gap: '0' }}>
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage} style={{ flex: 1, minWidth: '90px', textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 6px auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700,
                  background: i <= currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.08)',
                  color: i <= currentIndex ? 'white' : 'var(--text-muted)',
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: '0.7rem', color: i <= currentIndex ? 'var(--secondary)' : 'var(--text-muted)', fontWeight: i === currentIndex ? 700 : 400 }}>
                  {t(`stages.${stage}`)}
                </div>
                {i < PIPELINE_STAGES.length - 1 && (
                  <div style={{ position: 'absolute', top: '14px', left: '50%', width: '100%', height: '2px', background: i < currentIndex ? 'var(--primary)' : 'rgba(0,0,0,0.08)', zIndex: -1 }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', background: '#f8fafc' }}>
        <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.applicationDetail.updatesTitle')}</h3>
        {application.adminNotes ? (
          <div style={{ padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
            <p><strong>{t('student.applicationDetail.adminMessageLabel')}</strong></p>
            <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{application.adminNotes}</p>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>{t('student.applicationDetail.noMessages')}</p>
        )}

        {application.offerLetterUrl && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <p><strong>{t('student.applicationDetail.offerReady')}</strong></p>
            <a href={application.offerLetterUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>{t('student.applicationDetail.downloadOffer')}</a>
          </div>
        )}
      </div>

      {application.offerLetterUrl && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>{t('student.applicationDetail.paymentTitle')}</h3>
          {application.paymentSlipUrl ? (
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p>{t('student.applicationDetail.paymentSubmitted')}</p>
              <a href={application.paymentSlipUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 'bold' }}>{t('student.applicationDetail.viewSlip')}</a>
            </div>
          ) : (
            <form onSubmit={handleUploadSlip}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{t('student.applicationDetail.paymentInstructions')}</p>
              <div className="form-group">
                <input type="file" className="form-input" onChange={(e) => setSlipFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <button type="submit" className="btn-primary" disabled={uploading}>
                {uploading ? t('student.applicationDetail.uploading') : t('student.applicationDetail.submitPayment')}
              </button>
            </form>
          )}
        </div>
      )}

      <div className="card">
        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.applicationDetail.checklistTitle')}</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('student.applicationDetail.checklistNote')}</p>

        <div className="form-group mb-8">
          <label className="form-label">{t('student.applicationDetail.driveLink')}</label>
          <input type="url" className="form-input" value={googleDriveLink} onChange={(e) => setGoogleDriveLink(e.target.value)} placeholder="https://drive.google.com/..." />
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
          {requiredSlots.map((slot) => (
            <div className="form-group" key={slot.key}>
              <label className="form-label">
                {t(`documentLabels.${slot.key}`)}
                {application.documents?.[slot.key] && <span style={{ color: '#10b981', marginInlineStart: '0.5rem', fontSize: '0.8rem' }}>{t('student.applicationDetail.uploaded')}</span>}
              </label>
              <input type="file" className="form-input" name={slot.key} onChange={handleFileChange} accept={slot.accept} />
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.applicationDetail.optionalDocs')}</h3>
        <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
          {OPTIONAL_SLOTS.map((slot) => (
            <div className="form-group" key={slot.key}>
              <label className="form-label">
                {t(`documentLabels.${slot.key}`)} {t('student.applicationDetail.optionalSuffix')}
                {application.documents?.[slot.key] && <span style={{ color: '#10b981', marginInlineStart: '0.5rem', fontSize: '0.8rem' }}>{t('student.applicationDetail.uploaded')}</span>}
              </label>
              <input type="file" className="form-input" name={slot.key} onChange={handleFileChange} accept={slot.accept} />
            </div>
          ))}
        </div>

        <div className="mt-4 text-center form-btn-row" style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={handleSaveDraft} className="btn-secondary" disabled={uploading} style={{ flex: 1, fontSize: '1.1rem', padding: '14px', background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)' }}>
            {uploading ? t('student.applicationDetail.saving') : t('student.applicationDetail.saveDraft')}
          </button>
          <button type="button" onClick={handleSubmit} className="btn-primary" disabled={uploading} style={{ flex: 2, fontSize: '1.2rem', padding: '14px' }}>
            {uploading ? t('student.applicationDetail.uploadingSubmitting') : t('student.applicationDetail.submitApplication')}
          </button>
        </div>
      </div>
    </div>
  );
}
