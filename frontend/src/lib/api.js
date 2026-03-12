const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function uploadVideo(file, onProgress) {
  const formData = new FormData();
  formData.append('video', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/detect/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText || 'Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}

export async function detectFrame(frameBase64) {
  const res = await fetch(`${API_BASE}/detect/webcam`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frame: frameBase64 }),
  });

  if (!res.ok) {
    throw new Error('Webcam detection failed');
  }
  return res.json();
}

export function reportUrl(reportId) {
  return `${API_BASE}/report/${reportId}`;
}
