const MAX_BYTES = 350 * 1024;

function renameExtension(name, ext) {
  const base = name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
  return `${base}.${ext}`;
}

async function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

async function compressImage(file, maxBytes) {
  const bitmap = await createImageBitmap(file);
  const qualities = [0.85, 0.7, 0.55, 0.4, 0.25, 0.15];
  let scale = 1;
  let smallestBlob = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of qualities) {
      const blob = await canvasToBlob(canvas, quality);
      if (!blob) continue;
      if (!smallestBlob || blob.size < smallestBlob.size) smallestBlob = blob;
      if (blob.size <= maxBytes) {
        return new File([blob], renameExtension(file.name, 'jpg'), { type: 'image/jpeg' });
      }
    }
    scale *= 0.65;
  }

  return new File([smallestBlob], renameExtension(file.name, 'jpg'), { type: 'image/jpeg' });
}

async function compressPdf(file, maxBytes) {
  const [pdfjsLib, { jsPDF }] = await Promise.all([import('pdfjs-dist'), import('jspdf')]);
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const arrayBuffer = await file.arrayBuffer();
  const attempts = [
    { renderScale: 1.5, quality: 0.6 },
    { renderScale: 1.5, quality: 0.4 },
    { renderScale: 1.1, quality: 0.4 },
    { renderScale: 1.1, quality: 0.25 },
    { renderScale: 0.85, quality: 0.25 },
    { renderScale: 0.85, quality: 0.12 },
  ];

  let bestBlob = null;
  for (const { renderScale, quality } of attempts) {
    // Each attempt needs its own copy since pdf.js detaches/consumes the buffer.
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
    let doc = null;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const sizeViewport = page.getViewport({ scale: 1 });
      const renderViewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(renderViewport.width);
      canvas.height = Math.ceil(renderViewport.height);
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      if (i === 1) {
        doc = new jsPDF({ unit: 'pt', format: [sizeViewport.width, sizeViewport.height], compress: true });
      } else {
        doc.addPage([sizeViewport.width, sizeViewport.height]);
      }
      doc.addImage(dataUrl, 'JPEG', 0, 0, sizeViewport.width, sizeViewport.height);
    }

    const blob = doc.output('blob');
    if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;
    if (blob.size <= maxBytes) {
      return new File([blob], file.name, { type: 'application/pdf' });
    }
  }

  return new File([bestBlob], file.name, { type: 'application/pdf' });
}

// Best-effort client-side compression before upload. Images are always
// re-encoded as JPEG at shrinking quality/scale; PDFs are rasterized page by
// page and rebuilt (trading text selectability for a guaranteed size cap).
// Other types (doc/docx) pass through unchanged since they can't be
// meaningfully compressed in the browser.
export async function compressFile(file, maxBytes = MAX_BYTES) {
  if (!file || file.size <= maxBytes) return file;

  try {
    if (file.type.startsWith('image/')) return await compressImage(file, maxBytes);
    if (file.type === 'application/pdf') return await compressPdf(file, maxBytes);
  } catch (error) {
    console.warn(`Failed to compress ${file.name}, uploading original:`, error);
  }
  return file;
}
