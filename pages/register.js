import { useState } from 'react';
import Head from 'next/head';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/router';

// List of all countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    level: 'Undergraduate',
    faculty: '',
    firstName: '',
    lastName: '',
    dob: '',
    nationality: '',
    motherName: '',
    email: '',
    phone: '',
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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload mandatory documents
      const docs = {
        highschoolCert: await uploadFile(files.highschoolCert, 'documents/hs_certs'),
        highschoolMarks: await uploadFile(files.highschoolMarks, 'documents/hs_marks'),
        passport: await uploadFile(files.passport, 'documents/passports'),
        photo: await uploadFile(files.photo, 'documents/photos'),
        cv: await uploadFile(files.cv, 'documents/cvs'),
      };

      // Conditionally upload Masters docs
      if (formData.level === "Master's" || formData.level === "Ph.D.") {
        docs.bsTranscript = await uploadFile(files.bsTranscript, 'documents/bs_transcripts');
        docs.bsDegree = await uploadFile(files.bsDegree, 'documents/bs_degrees');
      }

      // Upload optional documents
      if (files.englishCert) docs.englishCert = await uploadFile(files.englishCert, 'documents/english_certs');
      if (files.recommendationLetter) docs.recommendationLetter = await uploadFile(files.recommendationLetter, 'documents/rec_letters');

      // Save to Firestore
      const docData = {
        ...formData,
        documents: docs,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'applications'), docData);
      
      // Save application ID to localStorage to simulate being logged in as this student
      localStorage.setItem('student_app_id', docRef.id);
      
      setSuccess(true);
      setTimeout(() => router.push('/student/dashboard'), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section section-bg text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Application Submitted Successfully!</h2>
          <p>Thank you for applying to GoTurkey 2k2x. We will review your application and contact you soon.</p>
        </div>
      </div>
    );
  }

  const isPostgrad = formData.level === "Master's" || formData.level === "Ph.D.";

  return (
    <>
      <Head>
        <title>Apply Now | GoTurkey 2k2x</title>
      </Head>
      <div className="section section-bg">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header">
            <h2>International Student Registration</h2>
            <p>Please fill out the form carefully. All fields marked with * are required.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            
            {/* Level Selection */}
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
                <label className="form-label">Name *</label>
                <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Surname *</label>
                <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
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
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Phone *</label>
                <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required />
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Mandatory Documents</h3>
            <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">High School Certificate *</label>
                <input type="file" className="form-input" name="highschoolCert" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="form-group">
                <label className="form-label">High School Marks / Transcript *</label>
                <input type="file" className="form-input" name="highschoolMarks" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              
              {isPostgrad && (
                <>
                  <div className="form-group">
                    <label className="form-label">Bachelor's Degree * (For Postgraduate)</label>
                    <input type="file" className="form-input" name="bsDegree" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required={isPostgrad} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bachelor's Transcript * (For Postgraduate)</label>
                    <input type="file" className="form-input" name="bsTranscript" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required={isPostgrad} />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Passport *</label>
                <input type="file" className="form-input" name="passport" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" required />
              </div>
              <div className="form-group">
                <label className="form-label">White Background Picture *</label>
                <input type="file" className="form-input" name="photo" onChange={handleFileChange} accept=".jpg,.jpeg,.png" required />
              </div>
              <div className="form-group">
                <label className="form-label">CV / Resume *</label>
                <input type="file" className="form-input" name="cv" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Optional Documents</h3>
            <div className="grid-3" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">English Certificate (Optional)</label>
                <input type="file" className="form-input" name="englishCert" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>e.g. TOEFL, IELTS</span>
              </div>
              <div className="form-group">
                <label className="form-label">Recommendation Letter (Optional)</label>
                <input type="file" className="form-input" name="recommendationLetter" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
              </div>
            </div>

            <div className="mt-4 text-center">
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.2rem', padding: '14px' }}>
                {loading ? 'Submitting Application...' : 'Complete Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
