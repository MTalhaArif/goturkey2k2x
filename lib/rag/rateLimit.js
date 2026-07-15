import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const DAILY_MESSAGE_CAP = 40;

function sanitizeIp(ip) {
  return String(ip || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
}

export async function checkAndIncrement(ip) {
  const today = new Date().toISOString().slice(0, 10);
  const docId = `${today}_${sanitizeIp(ip)}`;
  const ref = doc(db, 'chatLimits', docId);

  const allowed = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    const count = snap.exists() ? snap.data().count || 0 : 0;
    if (count >= DAILY_MESSAGE_CAP) {
      return false;
    }
    transaction.set(ref, { count: count + 1, date: today, updatedAt: new Date().toISOString() });
    return true;
  });

  return allowed;
}
