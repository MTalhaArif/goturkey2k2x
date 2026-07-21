import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { uploadFile } from '@/lib/uploadFile';
import { STAGES, STAGE_COLORS } from '@/lib/applicationStages';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AdminDashboard() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { user, profile, loading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [profiles, setProfiles] = useState({}); // uid -> user profile doc
  const [dataLoading, setDataLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // State for Admin Actions
  const [adminNotes, setAdminNotes] = useState('');
  const [offerFile, setOfferFile] = useState(null);
  const [stageAction, setStageAction] = useState('documents_pending');
  const [processingId, setProcessingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [zippingId, setZippingId] = useState(null);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!(user && profile?.role === 'admin')) return;

    const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setApplications(apps);

        const uniqueUids = [...new Set(apps.map((a) => a.studentUid).filter(Boolean))];
        const profileEntries = await Promise.all(
          uniqueUids.map(async (uid) => {
            const snap = await getDoc(doc(db, 'users', uid));
            return [uid, snap.exists() ? snap.data() : null];
          })
        );
        setProfiles(Object.fromEntries(profileEntries));
        setDataLoading(false);
      },
      (error) => {
        console.error('Error fetching applications: ', error);
        setDataLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, profile]);

  const handleUpdateApplication = async (appId) => {
    setProcessingId(appId);
    try {
      const appRef = doc(db, 'applications', appId);
      const updates = { stage: stageAction, adminNotes, updatedAt: new Date().toISOString() };

      let offerUploadFailed = false;
      if (offerFile) {
        const url = await uploadFile(offerFile, 'documents/offers');
        if (url) {
          updates.offerLetterUrl = url;
        } else {
          offerUploadFailed = true;
        }
      }

      await updateDoc(appRef, updates);

      if (offerUploadFailed) {
        alert(t('admin.dashboard.alertOfferFailed'));
      } else {
        alert(t('admin.dashboard.alertSuccess'));
      }

      setOfferFile(null);
      setAdminNotes('');
      setExpandedRow(null);
    } catch (err) {
      console.error(err);
      alert(t('admin.dashboard.alertError'));
    } finally {
      setProcessingId(null);
    }
  };

  const buildPartnerPortalText = (app, studentProfile) => {
    const lines = [
      `${t('admin.dashboard.studentInfoLabel')}: ${studentProfile.firstName || ''} ${studentProfile.lastName || ''}`.trim(),
      `${t('login.email')}: ${studentProfile.email || t('admin.dashboard.notAvailable')}`,
      `${t('student.profileGate.nationality').replace(' *', '')}: ${studentProfile.nationality || t('admin.dashboard.notAvailable')}`,
      `${t('admin.dashboard.dob')} ${studentProfile.dob || t('admin.dashboard.notAvailable')}`,
      `${t('admin.dashboard.phone')} ${studentProfile.phone || t('admin.dashboard.notAvailable')}`,
      `${t('admin.dashboard.motherName')} ${studentProfile.motherName || t('admin.dashboard.notAvailable')}`,
      `${t('admin.dashboard.fatherName')} ${studentProfile.fatherName || t('admin.dashboard.notAvailable')}`,
      '',
      `${t('admin.dashboard.university')} ${app.universityName || t('admin.dashboard.notAvailable')}`,
      `${t('admin.dashboard.program')} ${app.programName || t('admin.dashboard.notAvailable')} (${app.level || t('admin.dashboard.notAvailable')})`,
      `${t('admin.dashboard.applicationDate')} ${app.createdAt ? new Date(app.createdAt).toLocaleDateString() : t('admin.dashboard.notAvailable')}`,
      '',
      `${t('admin.dashboard.studentDocuments')}`,
    ];
    const docs = Object.entries(app.documents || {}).filter(([, url]) => url);
    if (docs.length === 0) {
      lines.push(`- ${t('admin.dashboard.notUploaded')}`);
    } else {
      docs.forEach(([key, url]) => lines.push(`- ${t(`documentLabels.${key}`)}: ${url}`));
    }
    if (app.googleDriveLink) {
      lines.push(`- ${t('admin.dashboard.googleDrive')} ${app.googleDriveLink}`);
    }
    return lines.join('\n');
  };

  const handleDownloadZip = async (app, studentProfile) => {
    const files = Object.entries(app.documents || {})
      .filter(([, url]) => url)
      .map(([key, url]) => ({ label: t(`documentLabels.${key}`), url }));
    if (app.paymentSlipUrl) files.push({ label: t('admin.dashboard.paymentSlipLabel'), url: app.paymentSlipUrl });
    if (app.offerLetterUrl) files.push({ label: t('admin.dashboard.offerLetterLabel'), url: app.offerLetterUrl });

    if (files.length === 0) {
      alert(t('admin.dashboard.zipEmpty'));
      return;
    }

    const studentName = [studentProfile.firstName, studentProfile.lastName].filter(Boolean).join(' ') || 'Student';
    setZippingId(app.id);
    try {
      const response = await fetch('/api/admin/zip-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, files }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Zip request failed');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName.replace(/[/\\:*?"<>|]/g, '')}_Documents.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document zip:', err);
      alert(t('admin.dashboard.zipError'));
    } finally {
      setZippingId(null);
    }
  };

  const handleCopy = async (app, studentProfile) => {
    try {
      await navigator.clipboard.writeText(buildPartnerPortalText(app, studentProfile));
      setCopiedId(app.id);
      setTimeout(() => setCopiedId((id) => (id === app.id ? null : id)), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
      alert(t('admin.dashboard.copyError'));
    }
  };

  if (loading || (user && profile?.role === 'admin' && dataLoading)) {
    return (
      <>
        <Head>
          <title>{t('admin.dashboard.metaTitle')}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div style={{ textAlign: 'center', padding: '4rem' }}>{t('admin.dashboard.loading')}</div>
      </>
    );
  }
  if (!user || profile?.role !== 'admin') return null;

  return (
    <>
      <Head>
        <title>{t('admin.dashboard.metaTitle')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ padding: '0', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1400px', padding: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>{t('admin.dashboard.title')}</h1>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>{t('admin.dashboard.colStudent')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.dashboard.colProgram')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.dashboard.colPayment')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.dashboard.colStatus')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.dashboard.colAction')}</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('admin.dashboard.noApplications')}</td>
                  </tr>
                ) : (
                  applications.map((app) => {
                    const studentProfile = profiles[app.studentUid] || {};
                    return (
                      <React.Fragment key={app.id}>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ display: 'block' }}>{studentProfile.firstName} {studentProfile.lastName}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{studentProfile.email} | {studentProfile.nationality || t('admin.dashboard.notAvailable')}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ display: 'block' }}>{app.programName}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.level} · {app.universityName}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {app.paymentSlipUrl ? (
                              <a href={app.paymentSlipUrl} target="_blank" rel="noreferrer" style={{ padding: '4px 8px', background: '#8b5cf6', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>{t('admin.dashboard.viewSlip')}</a>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('admin.dashboard.notUploaded')}</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', color: STAGE_COLORS[app.stage], borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', border: `1px solid ${STAGE_COLORS[app.stage] || '#64748b'}` }}>
                              {t(`stages.${app.stage}`)}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <button
                              onClick={() => {
                                setExpandedRow(expandedRow === app.id ? null : app.id);
                                setAdminNotes(app.adminNotes || '');
                                setStageAction(app.stage || 'documents_pending');
                              }}
                              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              {expandedRow === app.id ? t('admin.dashboard.close') : t('admin.dashboard.reviewAndAct')}
                            </button>
                          </td>
                        </tr>

                        {expandedRow === app.id && (
                          <tr style={{ background: 'rgba(15, 26, 60, 0.02)' }}>
                            <td colSpan="5" style={{ padding: '1.5rem', borderBottom: '2px solid var(--border)' }}>
                              <div className="admin-action-row" style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>{t('admin.dashboard.applicationDetails')}</h4>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.program')}</strong> {app.programName || t('admin.dashboard.notAvailable')} ({app.level || t('admin.dashboard.notAvailable')})</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.university')}</strong> {app.universityName || t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.applicationDate')}</strong> {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.dob')}</strong> {studentProfile.dob || t('admin.dashboard.notAvailable')} | <strong>{t('admin.dashboard.phone')}</strong> {studentProfile.phone || t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.motherName')}</strong> {studentProfile.motherName || t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.fatherName')}</strong> {studentProfile.fatherName || t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{t('admin.dashboard.reference')}</strong> {studentProfile.reference || t('admin.dashboard.notAvailable')}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>{t('admin.dashboard.documentationServices')}</strong> {(studentProfile.documentationServices || []).map((s) => (s === 'Other' ? (studentProfile.documentationOther || t('student.profileGate.other')) : t(`documentationOptions.${s}`))).join(', ') || t('admin.dashboard.noneRequested')}
                                  </p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>{t('admin.dashboard.accommodation')}</strong> {(studentProfile.accommodationTypes || []).map((a) => t(`accommodationOptions.${a}`)).join(', ') || t('admin.dashboard.noneRequested')}
                                  </p>
                                  {app.googleDriveLink && (
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                      <strong>{t('admin.dashboard.googleDrive')}</strong> <a href={app.googleDriveLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{t('admin.dashboard.openFolder')}</a>
                                    </p>
                                  )}

                                  <h5 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>{t('admin.dashboard.studentDocuments')}</h5>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {Object.entries(app.documents || {}).filter(([, url]) => url).map(([key, url]) => (
                                      <a key={key} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--secondary)', color: 'white', borderRadius: '4px' }}>{t(`documentLabels.${key}`)}</a>
                                    ))}
                                  </div>

                                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadZip(app, studentProfile)}
                                      disabled={zippingId === app.id}
                                      className="btn-primary"
                                      style={{ flex: 1 }}
                                    >
                                      {zippingId === app.id ? t('admin.dashboard.zipping') : t('admin.dashboard.downloadZip')}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(app, studentProfile)}
                                      className="btn-secondary"
                                      style={{ flex: 1 }}
                                    >
                                      {copiedId === app.id ? t('admin.dashboard.copied') : t('admin.dashboard.copyForPortal')}
                                    </button>
                                  </div>
                                </div>

                                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>{t('admin.dashboard.adminActions')}</h4>

                                  <div className="form-group">
                                    <label className="form-label">{t('admin.dashboard.updateStatus')}</label>
                                    <select className="form-select" value={stageAction} onChange={(e) => setStageAction(e.target.value)}>
                                      {STAGES.map((s) => <option key={s} value={s}>{t(`stages.${s}`)}</option>)}
                                    </select>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label">{t('admin.dashboard.adminNoteLabel')}</label>
                                    <textarea className="form-input" rows="3" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder={t('admin.dashboard.adminNotePlaceholder')}></textarea>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label">{t('admin.dashboard.uploadOfferLabel')}</label>
                                    <input type="file" className="form-input" onChange={(e) => setOfferFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg" />
                                    {app.offerLetterUrl && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--primary)' }}>{t('admin.dashboard.offerAlreadyUploaded')}</p>}
                                  </div>

                                  <button
                                    onClick={() => handleUpdateApplication(app.id)}
                                    disabled={processingId === app.id}
                                    className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                    {processingId === app.id ? t('admin.dashboard.saving') : t('admin.dashboard.saveUpdates')}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
