import { STAGE_COLORS } from '@/lib/applicationStages';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ApplicationsList({ applications, onSelect, onStartNew, onEditProfile }) {
  const { t } = useTranslation();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--secondary)', fontSize: '1.4rem' }}>{t('student.applicationsList.title')}</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={onEditProfile} className="btn-secondary" style={{ padding: '10px 18px' }}>{t('student.applicationsList.editProfile')}</button>
          <button onClick={onStartNew} className="btn-primary" style={{ padding: '10px 18px' }}>{t('student.applicationsList.startNew')}</button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('student.applicationsList.emptyState')}</p>
          <button onClick={onStartNew} className="btn-primary">{t('student.applicationsList.startFirst')}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--secondary)', fontSize: '1.1rem' }}>{app.universityName}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{app.programName} · {app.level}{app.universityType ? ` · ${app.universityType}` : ''}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                  color: STAGE_COLORS[app.stage] || '#64748b',
                  border: `1px solid ${STAGE_COLORS[app.stage] || '#64748b'}`,
                  background: 'rgba(0,0,0,0.03)',
                }}>
                  {t(`stages.${app.stage}`)}
                </span>
                <button onClick={() => onSelect(app.id)} className="btn-secondary" style={{ padding: '8px 16px' }}>{t('student.applicationsList.view')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
