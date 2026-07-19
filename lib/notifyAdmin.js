import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ADMIN_EMAIL = 'talhasays94@gmail.com';

// Writes to the `mail` collection watched by the Firebase "Trigger Email"
// extension, which relays it via the configured SMTP connection. If the
// extension isn't installed yet, this write just sits unused — it never
// blocks or fails the student's submit flow.
export async function notifyAdminOfSubmission({ application, studentName, studentEmail }) {
  try {
    await addDoc(collection(db, 'mail'), {
      to: [ADMIN_EMAIL],
      message: {
        subject: `New Application Submitted: ${application.universityName}`,
        text: [
          'A student has submitted a new application.',
          '',
          `Student: ${studentName || 'Unknown'}`,
          `Email: ${studentEmail || 'Unknown'}`,
          `University: ${application.universityName}`,
          `Program: ${application.programName}`,
          `Level: ${application.level}`,
          '',
          'Review it in the admin dashboard: https://goturkey2k2x.com/admin/dashboard',
        ].join('\n'),
      },
    });
  } catch (error) {
    console.error('Error queuing admin notification email:', error);
  }
}
