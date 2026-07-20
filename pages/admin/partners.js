import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AdminPartnerLeads() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { user, profile, loading } = useAuth();

  const [leads, setLeads] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [loading, user, profile, router]);

  useEffect(() => {
    if (!(user && profile?.role === 'admin')) return;

    const q = query(collection(db, 'partnerLeads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setLeads(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setDataLoading(false);
      },
      (error) => {
        console.error('Error fetching partner leads:', error);
        setDataLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, profile]);

  if (loading || (user && profile?.role === 'admin' && dataLoading)) {
    return (
      <>
        <Head>
          <title>{t('admin.partners.metaTitle')}</title>
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
        <title>{t('admin.partners.metaTitle')}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div style={{ padding: '0', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1400px', padding: '0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--secondary)' }}>{t('admin.partners.title')}</h1>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: locale === 'ar' ? 'right' : 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px' }}>{t('admin.partners.colName')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.partners.colAgency')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.partners.colContact')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.partners.colLocation')}</th>
                  <th style={{ padding: '12px' }}>{t('admin.partners.colDate')}</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('admin.partners.noLeads')}</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px' }}>
                        <strong>{lead.name || t('admin.dashboard.notAvailable')}</strong>
                      </td>
                      <td style={{ padding: '12px' }}>{lead.agencyName || t('admin.dashboard.notAvailable')}</td>
                      <td style={{ padding: '12px' }}>
                        <a href={`mailto:${lead.email}`} style={{ display: 'block', color: 'var(--primary)' }}>{lead.email}</a>
                        <a href={`tel:${lead.phone}`} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lead.phone}</a>
                      </td>
                      <td style={{ padding: '12px' }}>{lead.location || t('admin.dashboard.notAvailable')}</td>
                      <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : t('admin.dashboard.notAvailable')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
