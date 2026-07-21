import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import ProfileCompletionGate from '@/components/student/ProfileCompletionGate';
import ApplicationsList from '@/components/student/ApplicationsList';
import NewApplicationFlow from '@/components/student/NewApplicationFlow';
import ApplicationDetail from '@/components/student/ApplicationDetail';
import { useTranslation } from '@/lib/i18n/useTranslation';

const isProfileComplete = (profile) =>
  Boolean(profile?.dob && profile?.nationality && profile?.motherName && profile?.fatherName && profile?.phone);

export default function StudentDashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, profile, loading } = useAuth();

  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail' | 'editProfile'
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    // Sorted client-side rather than via Firestore orderBy: combining an
    // equality filter (studentUid) with orderBy on a different field
    // (createdAt) requires a composite index that doesn't exist for this
    // collection, which made this query fail silently on every load.
    const q = query(collection(db, 'applications'), where('studentUid', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const apps = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        apps.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setApplications(apps);
        setApplicationsLoading(false);
      },
      (err) => {
        console.error('Error fetching applications:', err);
        setApplicationsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  if (loading || (user && applicationsLoading)) {
    return (
      <>
        <Head>
          <title>{t('student.dashboard.metaTitle')}</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div style={{ textAlign: 'center', padding: '4rem' }}>{t('student.dashboard.loading')}</div>
      </>
    );
  }
  if (!user) return null;

  const selectedApplication = applications.find((a) => a.id === selectedId) || null;

  return (
    <>
      <Head>
        <title>{t('student.dashboard.metaTitle')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="section section-bg" style={{ minHeight: '80vh', borderRadius: '12px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>{t('student.dashboard.welcome', { name: profile?.firstName || t('student.dashboard.fallbackName') })}</h1>
          </div>

          {!isProfileComplete(profile) ? (
            <ProfileCompletionGate profile={profile} uid={user.uid} allowCancel={false} onSaved={() => {}} />
          ) : view === 'editProfile' ? (
            <ProfileCompletionGate
              profile={profile}
              uid={user.uid}
              allowCancel
              onCancel={() => setView('list')}
              onSaved={() => setView('list')}
            />
          ) : view === 'new' ? (
            <NewApplicationFlow
              uid={user.uid}
              onCancel={() => setView('list')}
              onCreated={(id) => { setSelectedId(id); setView('detail'); }}
            />
          ) : view === 'detail' && selectedApplication ? (
            <ApplicationDetail
              application={selectedApplication}
              onBack={() => setView('list')}
              studentName={[profile?.firstName, profile?.lastName].filter(Boolean).join(' ')}
              studentEmail={user?.email}
            />
          ) : view === 'detail' ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>{t('student.dashboard.loadingApplication')}</div>
          ) : (
            <ApplicationsList
              applications={applications}
              onSelect={(id) => { setSelectedId(id); setView('detail'); }}
              onStartNew={() => setView('new')}
              onEditProfile={() => setView('editProfile')}
            />
          )}
        </div>
      </div>
    </>
  );
}
