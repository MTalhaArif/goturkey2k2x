import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { countries } from '@/lib/countries';
import { useTranslation } from '@/lib/i18n/useTranslation';

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
  const { t } = useTranslation();
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
      alert(t('student.profileGate.errorSaving'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b', marginBottom: '2rem' }}>
        <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>{t('student.profileGate.completeTitle')}</h3>
        <p style={{ fontSize: '0.9rem' }}>{t('student.profileGate.completeSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.profileGate.personalInfo')}</h3>
        <div className="responsive-2col" style={{ gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">{t('student.profileGate.dob')}</label>
            <input type="date" className="form-input" name="dob" value={formData.dob} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('student.profileGate.nationality')}</label>
            <select className="form-select" name="nationality" value={formData.nationality} onChange={handleInputChange} required>
              <option value="">{t('student.profileGate.selectCountry')}</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">{t('student.profileGate.motherName')}</label>
            <input type="text" className="form-input" name="motherName" value={formData.motherName} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">{t('student.profileGate.phone')}</label>
            <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleInputChange} required />
          </div>
        </div>

        <div className="form-group mb-8" style={{ marginTop: '1rem' }}>
          <label className="form-label">{t('student.profileGate.reference')}</label>
          <input type="text" className="form-input" name="reference" value={formData.reference} onChange={handleInputChange} placeholder={t('student.profileGate.referencePlaceholder')} />
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.profileGate.docServicesTitle')}</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('student.profileGate.docServicesSubtitle')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {DOCUMENTATION_OPTIONS.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.documentationServices.includes(option)}
                onChange={() => handleCheckboxToggle('documentationServices', option)}
              />
              {t(`documentationOptions.${option}`)}
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.documentationServices.includes('Other')}
              onChange={() => handleCheckboxToggle('documentationServices', 'Other')}
            />
            {t('student.profileGate.other')}
          </label>
          {formData.documentationServices.includes('Other') && (
            <input
              type="text"
              className="form-input"
              name="documentationOther"
              value={formData.documentationOther}
              onChange={handleInputChange}
              placeholder={t('student.profileGate.otherPlaceholder')}
              style={{ maxWidth: '400px' }}
            />
          )}
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>{t('student.profileGate.accommodationTitle')}</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('student.profileGate.accommodationSubtitle')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
          {ACCOMMODATION_OPTIONS.map((option) => (
            <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.accommodationTypes.includes(option)}
                onChange={() => handleCheckboxToggle('accommodationTypes', option)}
              />
              {t(`accommodationOptions.${option}`)}
            </label>
          ))}
        </div>

        <div className="mt-4 text-center form-btn-row" style={{ display: 'flex', gap: '1rem' }}>
          {allowCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary" style={{ flex: 1, fontSize: '1.1rem', padding: '14px', background: 'transparent', border: '2px solid var(--secondary)', color: 'var(--secondary)' }}>
              {t('student.profileGate.cancel')}
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={saving} style={{ flex: allowCancel ? 2 : 1, fontSize: '1.2rem', padding: '14px' }}>
            {saving ? t('student.profileGate.saving') : t('student.profileGate.saveProfile')}
          </button>
        </div>
      </form>
    </div>
  );
}
