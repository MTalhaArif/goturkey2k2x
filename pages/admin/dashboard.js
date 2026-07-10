import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, getDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { uploadFile } from '@/lib/uploadFile';
import { STAGES, STAGE_LABELS, STAGE_COLORS } from '@/lib/applicationStages';

export default function AdminDashboard() {
  const router = useRouter();
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

      if (offerFile) {
        updates.offerLetterUrl = await uploadFile(offerFile, 'documents/offers');
      }

      await updateDoc(appRef, updates);
      alert('Application updated successfully!');

      setOfferFile(null);
      setAdminNotes('');
      setExpandedRow(null);
    } catch (err) {
      console.error(err);
      alert('Error updating application.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading || (user && profile?.role === 'admin' && dataLoading)) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  }
  if (!user || profile?.role !== 'admin') return null;

  return (
    <>
      <Head>
        <title>Admin Dashboard | GoTurkey 2k2x</title>
      </Head>
      <div style={{ padding: '0', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1400px', padding: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>Applications</h1>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>Student Info</th>
                  <th style={{ padding: '12px' }}>Program / Level</th>
                  <th style={{ padding: '12px' }}>Payment Slip</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No applications found.</td>
                  </tr>
                ) : (
                  applications.map((app) => {
                    const studentProfile = profiles[app.studentUid] || {};
                    return (
                      <React.Fragment key={app.id}>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ display: 'block' }}>{studentProfile.firstName} {studentProfile.lastName}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{studentProfile.email} | {studentProfile.nationality || 'N/A'}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ display: 'block' }}>{app.programName}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.level} · {app.universityName}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {app.paymentSlipUrl ? (
                              <a href={app.paymentSlipUrl} target="_blank" rel="noreferrer" style={{ padding: '4px 8px', background: '#8b5cf6', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>View Slip</a>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', color: STAGE_COLORS[app.stage], borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', border: `1px solid ${STAGE_COLORS[app.stage] || '#64748b'}` }}>
                              {STAGE_LABELS[app.stage] || app.stage}
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
                              {expandedRow === app.id ? 'Close' : 'Review & Act'}
                            </button>
                          </td>
                        </tr>

                        {expandedRow === app.id && (
                          <tr style={{ background: 'rgba(15, 26, 60, 0.02)' }}>
                            <td colSpan="5" style={{ padding: '1.5rem', borderBottom: '2px solid var(--border)' }}>
                              <div className="admin-action-row" style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Application Details</h4>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>DOB:</strong> {studentProfile.dob || 'N/A'} | <strong>Phone:</strong> {studentProfile.phone || 'N/A'}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Reference:</strong> {studentProfile.reference || 'N/A'}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>Documentation Services:</strong> {(studentProfile.documentationServices || []).map((s) => (s === 'Other' ? (studentProfile.documentationOther || 'Other') : s)).join(', ') || 'None requested'}
                                  </p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>Accommodation:</strong> {(studentProfile.accommodationTypes || []).join(', ') || 'None requested'}
                                  </p>
                                  {app.googleDriveLink && (
                                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                      <strong>Google Drive:</strong> <a href={app.googleDriveLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Open Folder</a>
                                    </p>
                                  )}

                                  <h5 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Student Documents:</h5>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {Object.entries(app.documents || {}).filter(([, url]) => url).map(([key, url]) => (
                                      <a key={key} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--secondary)', color: 'white', borderRadius: '4px' }}>{key}</a>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Admin Actions</h4>

                                  <div className="form-group">
                                    <label className="form-label">Update Status</label>
                                    <select className="form-select" value={stageAction} onChange={(e) => setStageAction(e.target.value)}>
                                      {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                                    </select>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label">Admin Note (Visible to Student)</label>
                                    <textarea className="form-input" rows="3" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Write a note or instructions for the student..."></textarea>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label">Upload Offer Letter / Document</label>
                                    <input type="file" className="form-input" onChange={(e) => setOfferFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg" />
                                    {app.offerLetterUrl && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--primary)' }}>* An offer letter was already uploaded previously.</p>}
                                  </div>

                                  <button
                                    onClick={() => handleUpdateApplication(app.id)}
                                    disabled={processingId === app.id}
                                    className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                    {processingId === app.id ? 'Saving...' : 'Save Updates & Notify Student'}
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
