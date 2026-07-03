import { useState, useEffect } from 'react';
import Head from 'next/head';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function StudentDashboard() {
  const router = useRouter();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [slipFile, setSlipFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const appId = localStorage.getItem('student_app_id');
    if (!appId) {
      router.push('/login');
      return;
    }

    const fetchApp = async () => {
      try {
        const docRef = doc(db, 'applications', appId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAppData({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert('Application not found');
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_app_id');
    router.push('/');
  };

  const handleUploadSlip = async (e) => {
    e.preventDefault();
    if (!slipFile) return alert('Please select a file first.');
    setUploading(true);

    try {
      const storageRef = ref(storage, `documents/payments/${Date.now()}_${slipFile.name}`);
      await uploadBytes(storageRef, slipFile);
      const url = await getDownloadURL(storageRef);

      const appRef = doc(db, 'applications', appData.id);
      await updateDoc(appRef, { paymentSlipUrl: url, status: 'Payment Received' });
      
      setAppData(prev => ({ ...prev, paymentSlipUrl: url, status: 'Payment Received' }));
      setSlipFile(null);
      alert('Payment proof uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error uploading payment slip.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading Dashboard...</div>;
  if (!appData) return null;

  return (
    <>
      <Head>
        <title>Student Dashboard | GoTurkey 2k2x</title>
      </Head>
      
      <div className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>Student Portal - {appData.firstName} {appData.lastName}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </div>

      <div className="section section-bg" style={{ minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>Welcome to your Dashboard!</h1>
          </div>
          
          <div className="card text-center" style={{ marginBottom: '2rem', borderTop: '4px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Application Status: <span style={{ color: 'var(--primary)' }}>{appData.status || 'Pending'}</span></h3>
            <p>Your application for <strong>{appData.faculty}</strong> is currently tracked here.</p>
          </div>

          {/* Admin Messages & Offer Letter Section */}
          <div className="card" style={{ marginBottom: '2rem', background: '#f8fafc' }}>
            <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Updates from Administration</h3>
            
            {appData.adminNote ? (
              <div style={{ padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', borderLeft: '4px solid var(--accent)', marginBottom: '1rem' }}>
                <p><strong>Message from Admission Office:</strong></p>
                <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{appData.adminNote}</p>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No new messages from administration.</p>
            )}

            {appData.offerLetterUrl && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                <p><strong>🎉 Congratulations! Your Offer Letter is ready.</strong></p>
                <a href={appData.offerLetterUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Download Offer Letter</a>
              </div>
            )}
          </div>

          {/* Payment Slip Upload (only show if they have an offer letter) */}
          {appData.offerLetterUrl && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Submit Proof of Payment</h3>
              
              {appData.paymentSlipUrl ? (
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                  <p>✅ You have successfully submitted your proof of payment.</p>
                  <a href={appData.paymentSlipUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 'bold' }}>View Submitted Slip</a>
                </div>
              ) : (
                <form onSubmit={handleUploadSlip}>
                  <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Please upload the bank receipt or proof of payment for your university deposit to secure your seat.</p>
                  <div className="form-group">
                    <input type="file" className="form-input" onChange={(e) => setSlipFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" required />
                  </div>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Submit Payment Proof'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
