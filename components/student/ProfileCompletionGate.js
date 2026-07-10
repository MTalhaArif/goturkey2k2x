import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { countries } from '@/lib/countries';

const DOCUMENTATION_OPTIONS = ['Residence Permit (İkamet)', 'Notarized Rental Contract', 'Health Insurance', 'Tax Number', 'Address Registration', 'Nüfus Registration'];
const ACCOMMODATION_OPTIONS = ['Shared Room', 'Private Room', 'Studio Apartment', 'Apartment'];

// The parent only ever mounts this component once the profile has finished
// loading, so it's safe to seed form state straight from it here rather than
// resyncing via an effect (which would either be a no-op or risk clobbering
// in-progress edits if the profile doc changes underneath the user).
function initialFormData(profile) {
  return {
    dob: profile?.dob || '',
    nationality: profile?.nationality || '',
    motherName: profile?.motherName || '',
    phone: profile?.phone || '',
    reference: profile?.reference || '',
    documentationServices: profile?.documentationServices || [],
    documentationOther: profile?.documentationOther || '',
    accommodationTypes: profile?.accommodationTypes || [],
  };
}

export default function ProfileCompletionGate({ profile, uid, onSaved, allowCancel, onCancel }) {
  const [formData, setFormData] = useState(() => initialFormData(profile));
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxToggle = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', uid), { ...formData, updatedAt: new Date().toISOString() });
      onSaved();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('There was an error saving your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '2rem' }}>
        <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>Complete Your Profile</h3>
        <p style={{ fontSize: '0.9rem' }}>These details are shared across all your university applications.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Personal Information</h3>
        <div className="responsive-2col" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input type="date" className="form-input" name="dob" value={formData.dob} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Nationality *</label>
            <select className="form-select" name="nationality" value={formData.nationality} onChange={handleInputChange} required>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Mother&apos;s Name *</label>
            <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Phone *</label>
            <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-group mb-8" style={{ marginTop: '1rem' }}>
          <label className="form-label">Reference</label>
          <input type="text" className="form-input" name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Agent name, friend, or how you heard about us (optional)" />
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Documentation Services (Optional)</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Do you need assistance with any of the following documentation services? (Select all that apply.)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {DOCUMENTATION_OPTIONS.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.documentationServices.includes(option)}
                onChange={() => handleCheckboxToggle('documentationServices', option)}
              />
              {option}
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.documentationServices.includes('Other')}
              onChange={() => handleCheckboxToggle('documentationServices', 'Other')}
            />
            Other:
          </label>
          {formData.documentationServices.includes('Other') && (
            <input
              type="text"
              className="form-input"
              name="documentationOther"
              value={formData.documentationOther}
              onChange={handleInputChange}
              placeholder="Please specify"
              style={{ maxWidth: '400px' }}
            />
          )}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>Accommodation Services (Optional)</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>What type of accommodation are you looking for?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {ACCOMMODATION_OPTIONS.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.accommodationTypes.includes(option)}
                onChange={() => handleCheckboxToggle('accommodationTypes', option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mt-4 text-center form-btn-row" style={{ display: 'flex', gap: '1rem' }}>
          {allowCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1, fontSize: '1.1rem', padding: '14px', background: 'transparent', border: '2px solid var(--secondary)', color: 'var(--secondary)' }}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={saving} style={{ flex: allowCancel ? 2 : 1, fontSize: '1.2rem', padding: '14px' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
