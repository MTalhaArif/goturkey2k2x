import { useState, useEffect } from 'react';
import Head from 'next/head';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';

// List of all countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function StudentDashboard() {
  const router = useRouter();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [slipFile, setSlipFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form State for Incomplete Applications
  const [formData, setFormData] = useState({
    level: 'Undergraduate',
    faculty: '',
    dob: '',
    nationality: '',
    motherName: '',
    phone: '',
    googleDriveLink: '',
  });

  const [files, setFiles] = useState({
    highschoolCert: null,
    highschoolMarks: null,
    bsTranscript: null,
    bsDegree: null,
    passport: null,
    photo: null,
    cv: null,
    englishCert: null,
    recommendationLetter: null,
  });

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

  // -----------------------------------------------------
  // APPLICATION SUBMISSION LOGIC (WHEN STATUS === INCOMPLETE)
  // -----------------------------------------------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.warn(`Failed to upload ${file.name}:`, error);
      return null; // Graceful fallback
    }
  };

  const handleCompleteApplication = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const docs = {
        highschoolCert: await uploadFile(files.highschoolCert, 'documents/hs_certs'),
        highschoolMarks: await uploadFile(files.highschoolMarks, 'documents/hs_marks'),
        passport: await uploadFile(files.passport, 'documents/passports'),
        photo: await uploadFile(files.photo, 'documents/photos'),
        cv: await uploadFile(files.cv, 'documents/cvs'),
      };

      if (formData.level === "Master's" || formData.level === "Ph.D.") {
        docs.bsTranscript = await uploadFile(files.bsTranscript, 'documents/bs_transcripts');
        docs.bsDegree = await uploadFile(files.bsDegree, 'documents/bs_degrees');
      }

      if (files.englishCert) docs.englishCert = await uploadFile(files.englishCert, 'documents/english_certs');
      if (files.recommendationLetter) docs.recommendationLetter = await uploadFile(files.recommendationLetter, 'documents/rec_letters');

      const appRef = doc(db, 'applications', appData.id);
      const updates = {
        ...formData,
        documents: { ...(appData.documents || {}), ...docs }, // Merge existing docs
        status: 'Pending'
      };

      await updateDoc(appRef, updates);
      setAppData(prev => ({ ...prev, ...updates }));
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const docs = {};
      if (files.highschoolCert) docs.highschoolCert = await uploadFile(files.highschoolCert, 'documents/hs_certs');
      if (files.highschoolMarks) docs.highschoolMarks = await uploadFile(files.highschoolMarks, 'documents/hs_marks');
      if (files.passport) docs.passport = await uploadFile(files.passport, 'documents/passports');
      if (files.photo) docs.photo = await uploadFile(files.photo, 'documents/photos');
      if (files.cv) docs.cv = await uploadFile(files.cv, 'documents/cvs');
      if (files.bsTranscript) docs.bsTranscript = await uploadFile(files.bsTranscript, 'documents/bs_transcripts');
      if (files.bsDegree) docs.bsDegree = await uploadFile(files.bsDegree, 'documents/bs_degrees');
      if (files.englishCert) docs.englishCert = await uploadFile(files.englishCert, 'documents/english_certs');
      if (files.recommendationLetter) docs.recommendationLetter = await uploadFile(files.recommendationLetter, 'documents/rec_letters');

      const appRef = doc(db, 'applications', appData.id);
      const updates = {
        ...formData,
        documents: { ...(appData.documents || {}), ...docs },
        status: 'Incomplete' // Kept as incomplete
      };

      await updateDoc(appRef, updates);
      setAppData(prev => ({ ...prev, ...updates }));
      alert('Draft saved successfully! You can return later to complete it.');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('There was an error saving your draft. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------------------------------
  // PAYMENT SLIP LOGIC
  // -----------------------------------------------------
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

  const isPostgrad = formData.level === "Master's" || formData.level === "Ph.D.";

  return (
    <>
      <Head>
        <title>Student Dashboard | GoTurkey 2k2x</title>
      </Head>

      <div className="section section-bg" style={{ minHeight: '80vh', borderRadius: '12px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>Welcome to your Dashboard!</h1>
          </div>

          {appData.status === 'Incomplete' ? (
            <div className="card">
              <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '2rem' }}>
                <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>Action Required: Complete Your Profile</h3>
                <p style={{ fontSize: '0.9rem' }}>Please fill out all mandatory fields below and upload your documents to formally submit your application.</p>
              </div>

              <form onSubmit={handleCompleteApplication}>
                <div className="form-group mb-8">
                  <label className="form-label">Application Level *</label>
                  <select className="form-select" name="level" value={formData.level} onChange={handleInputChange} required>
                    <option value="Vocational School">Vocational School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Master's">Master's</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>

                <div className="form-group mb-8">
                  <label className="form-label">Desired Program / Department *</label>
                  <input type="text" className="form-input" name="faculty" value={formData.faculty} onChange={handleInputChange} placeholder="e.g. Computer Engineering" required />
                </div>

                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Personal Information</h3>
                <div className="grid-3" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Date of Birth *</label>
                    <input type="date" className="form-input" name="dob" value={formData.dob} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nationality *</label>
                    <select className="form-select" name="nationality" value={formData.nationality} onChange={handleInputChange} required>
                      <option value="">Select a country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mother's Name *</label>
                    <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Phone *</label>
                    <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Upload Documents</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>If file uploads fail due to server issues, please paste a Google Drive folder link containing all your documents below.</p>
                
                <div className="form-group mb-8">
                  <label className="form-label">Google Drive Folder Link (Alternative)</label>
                  <input type="url" className="form-input" name="googleDriveLink" value={formData.googleDriveLink} onChange={handleInputChange} placeholder="https://drive.google.com/..." />
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">High School Certificate</label>
                    <input type="file" className="form-input" name="highschoolCert" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">High School Marks / Transcript</label>
                    <input type="file" className="form-input" name="highschoolMarks" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  
                  {isPostgrad && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Bachelor's Degree (For Postgraduate)</label>
                        <input type="file" className="form-input" name="bsDegree" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Bachelor's Transcript (For Postgraduate)</label>
                        <input type="file" className="form-input" name="bsTranscript" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label className="form-label">Passport</label>
                    <input type="file" className="form-input" name="passport" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">White Background Picture</label>
                    <input type="file" className="form-input" name="photo" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CV / Resume</label>
                    <input type="file" className="form-input" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Optional Documents</h3>
                <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">English Certificate (Optional)</label>
                    <input type="file" className="form-input" name="englishCert" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Recommendation Letter (Optional)</label>
                    <input type="file" className="form-input" name="recommendationLetter" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                  </div>
                </div>

                <div className="mt-4 text-center" style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={handleSaveDraft} className="btn-secondary" disabled={uploading} style={{ flex: 1, fontSize: '1.1rem', padding: '14px', background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)' }}>
                    {uploading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button type="submit" className="btn-primary" disabled={uploading} style={{ flex: 2, fontSize: '1.2rem', padding: '14px' }}>
                    {uploading ? 'Uploading Documents & Submitting...' : 'Submit Final Application'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Application Tracking View */}
              <div className="card text-center" style={{ marginBottom: '2rem', borderTop: '4px solid var(--accent)' }}>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Application Status: <span style={{ color: 'var(--primary)' }}>{appData.status}</span></h3>
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
            </>
          )}

        </div>
      </div>
    </>
  );
}
