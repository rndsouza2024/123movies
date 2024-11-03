// components/DownloadButton.js
import { useState } from 'react';

function DownloadButton({ magnetLink }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Call the API to download the movie
      const response = await fetch(`/api/download?magnetLink=${encodeURIComponent(magnetLink)}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'movie.mp4'; // Change this to the desired file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Download failed:', await response.json());
      }
    } catch (error) {
      console.error('Error during download:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? 'Downloading...' : 'Download Movie'}
    </button>
  );
}

export default DownloadButton;







