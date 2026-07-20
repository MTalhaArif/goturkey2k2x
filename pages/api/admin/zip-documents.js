import JSZip from 'jszip';

export const config = {
  api: {
    bodyParser: { sizeLimit: '100kb' },
  },
};

const MAX_FILES = 30;
const ALLOWED_HOST_SUFFIXES = ['firebasestorage.googleapis.com', 'storage.googleapis.com'];

function isAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && ALLOWED_HOST_SUFFIXES.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function extractExtension(url) {
  try {
    const parsed = new URL(url);
    const encodedPath = parsed.pathname.split('/o/')[1];
    if (!encodedPath) return '';
    const lastSegment = decodeURIComponent(encodedPath).split('/').pop() || '';
    const dotIndex = lastSegment.lastIndexOf('.');
    return dotIndex > -1 ? lastSegment.slice(dotIndex) : '';
  } catch {
    return '';
  }
}

function sanitizeFilenamePart(str) {
  return String(str || '')
    .replace(/[/\\:*?"<>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'file';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { studentName, files } = req.body || {};

  if (!Array.isArray(files) || files.length === 0 || files.length > MAX_FILES) {
    res.status(400).json({ error: 'Invalid request.' });
    return;
  }

  const validFiles = files.filter(
    (f) => f && typeof f.label === 'string' && typeof f.url === 'string' && isAllowedUrl(f.url)
  );

  if (validFiles.length === 0) {
    res.status(400).json({ error: 'No valid documents to zip.' });
    return;
  }

  try {
    const zip = new JSZip();
    const usedNames = new Set();
    let successCount = 0;

    for (const file of validFiles) {
      try {
        const response = await fetch(file.url);
        if (!response.ok) continue;
        const arrayBuffer = await response.arrayBuffer();

        let baseName = sanitizeFilenamePart(file.label);
        let name = `${baseName}${extractExtension(file.url)}`;
        let counter = 2;
        while (usedNames.has(name)) {
          name = `${baseName} (${counter})${extractExtension(file.url)}`;
          counter += 1;
        }
        usedNames.add(name);

        zip.file(name, arrayBuffer);
        successCount += 1;
      } catch (err) {
        console.error(`Error fetching document "${file.label}":`, err);
      }
    }

    if (successCount === 0) {
      res.status(502).json({ error: 'Could not retrieve any of the documents. Please try again.' });
      return;
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    const zipFilename = `${sanitizeFilenamePart(studentName || 'Student')}_Documents.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);
    res.status(200).send(zipBuffer);
  } catch (error) {
    console.error('Error building document zip:', error);
    res.status(500).json({ error: 'There was an error creating the zip file. Please try again.' });
  }
}
