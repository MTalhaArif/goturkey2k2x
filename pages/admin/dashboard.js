// Trigger Vercel Rebuild
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  
  // State for Admin Actions
  const [adminNote, setAdminNote] = useState('');
  const [offerFile, setOfferFile] = useState(null);
  const [statusAction, setStatusAction] = useState('Pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const q = query(collection(db, 'applications'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const apps = [];
      querySnapshot.forEach((d) => {
        apps.push({ id: d.id, ...d.data() });
      });
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (appId) => {
    setProcessingId(appId);
    try {
      const appRef = doc(db, 'applications', appId);
      const updates = { status: statusAction, adminNote };

      if (offerFile) {
        const storageRef = ref(storage, `documents/offers/${Date.now()}_${offerFile.name}`);
        await uploadBytes(storageRef, offerFile);
        updates.offerLetterUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(appRef, updates);
      alert('Application updated successfully!');
      
      // Reset forms and reload
      setOfferFile(null);
      setAdminNote('');
      setExpandedRow(null);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Error updating application.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Accepted') return '#10b981';
    if (status === 'Offer Sent') return '#3b82f6';
    if (status === 'Payment Received') return '#8b5cf6';
    if (status === 'Incomplete') return '#ef4444'; // Red/Warning for Incomplete
    return '#b8860b'; // Pending
  };

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

          {loading ? (
            <p>Loading applications...</p>
          ) : (
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
                    applications.map((app) => (
                      <React.Fragment key={app.id}>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px' }}>
                            <strong style={{ display: 'block' }}>{app.firstName} {app.lastName}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.email} | {app.nationality}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ display: 'block' }}>{app.faculty}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.level}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {app.paymentSlipUrl ? (
                              <a href={app.paymentSlipUrl} target="_blank" rel="noreferrer" style={{ padding: '4px 8px', background: '#8b5cf6', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>View Slip</a>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not uploaded</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.05)', color: getStatusColor(app.status), borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', border: `1px solid ${getStatusColor(app.status)}` }}>{app.status || 'Pending'}</span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <button 
                              onClick={() => {
                                setExpandedRow(expandedRow === app.id ? null : app.id);
                                setAdminNote(app.adminNote || '');
                                setStatusAction(app.status || 'Pending');
                              }}
                              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              {expandedRow === app.id ? 'Close' : 'Review & Act'}
                            </button>
                          </td>
                        </tr>

                        {/* EXPANDED ROW ACTIONS */}
                        {expandedRow === app.id && (
                          <tr style={{ background: 'rgba(15, 26, 60, 0.02)' }}>
                            <td colSpan="5" style={{ padding: '1.5rem', borderBottom: '2px solid var(--border)' }}>
                              <div className="admin-action-row" style={{ display: 'flex', gap: '2rem' }}>
                                {/* Left Side: Documents & Info */}
                                <div style={{ flex: 1 }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Application Details</h4>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Passport:</strong> {app.passportNo || 'N/A'} | <strong>DOB:</strong> {app.dob || 'N/A'}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>Reference:</strong> {app.reference || 'N/A'}</p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>Documentation Services:</strong> {(app.documentationServices || []).map((s) => (s === 'Other' ? (app.documentationOther || 'Other') : s)).join(', ') || 'None requested'}
                                  </p>
                                  <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <strong>Accommodation:</strong> {(app.accommodationTypes || []).join(', ') || 'None requested'}
                                  </p>

                                  <h5 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Student Documents:</h5>
                                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {Object.entries(app.documents || {}).map(([key, url]) => (
                                      <a key={key} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', padding: '4px 8px', background: 'var(--secondary)', color: 'white', borderRadius: '4px' }}>{key}</a>
                                    ))}
                                  </div>
                                </div>

                                {/* Right Side: Actions */}
                                <div style={{ flex: 1, background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                  <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Admin Actions</h4>
                                  
                                  <div className="form-group">
                                    <label className="form-label">Update Status</label>
                                    <select className="form-select" value={statusAction} onChange={(e) => setStatusAction(e.target.value)}>
                                      <option value="Incomplete">Incomplete</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Offer Sent">Offer Sent</option>
                                      <option value="Payment Received">Payment Received</option>
                                      <option value="Accepted">Accepted</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>

                                  <div className="form-group">
                                    <label className="form-label">Admin Note (Visible to Student)</label>
                                    <textarea className="form-input" rows="3" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Write a note or instructions for the student..."></textarea>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
