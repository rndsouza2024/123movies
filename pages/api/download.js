// import WebTorrent from 'webtorrent';
// import fs from 'fs';
// import path from 'path';

// const client = new WebTorrent();

// export default async function handler(req, res) {
//   const magnetLink = req.query.magnetLink;

//   if (!magnetLink) {
//     return res.status(400).json({ error: 'Magnet link is required' });
//   }

//   client.add(magnetLink, { path: '/tmp/downloads' }, (torrent) => {
//     console.log(`Starting download of torrent: ${torrent.infoHash}`);
//     console.log('Torrent files:', torrent.files);

//     torrent.on('done', () => {
//       const file = torrent.files[0]; // Get the first file in the torrent
//       const filePath = path.join('/tmp/downloads', file.path);

//       res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
//       const stream = fs.createReadStream(filePath);

//       stream.pipe(res).on('finish', () => {
//         console.log('Download completed successfully.');
//         torrent.destroy();
//       }).on('error', (streamError) => {
//         console.error('Stream error:', streamError);
//         res.status(500).json({ error: 'Failed to stream file' });
//         torrent.destroy();
//       });
//     });

//     torrent.on('error', (error) => {
//       console.error('Torrent error:', error);
//       res.status(500).json({ error: 'Failed to download file' });
//       torrent.destroy();
//     });
//   });

//   setTimeout(() => {
//     if (!res.headersSent) {
//       console.log('Download process timed out.');
//       res.status(500).json({ error: 'Download process timed out' });
//     }
//   }, 30000); // Adjust the timeout duration as needed
// }


















// import WebTorrent from 'webtorrent';
// import fs from 'fs';
// import path from 'path';

// const client = new WebTorrent();

// export default async function handler(req, res) {
//   const magnetLink = req.query.magnetLink;

//   if (!magnetLink) {
//     return res.status(400).json({ error: 'Magnet link is required' });
//   }

//   // Start downloading the torrent
//   client.add(magnetLink, { path: '/tmp/downloads' }, (torrent) => {
//     console.log(`Starting download of torrent: ${torrent.infoHash}`);
//     console.log('Torrent files:', torrent.files);

//     // Wait until the torrent has downloaded at least one file
//     torrent.on('download', (bytes) => {
//       console.log(`Downloaded: ${bytes} bytes. Total downloaded: ${torrent.downloaded}`);
//     });

//     torrent.on('done', () => {
//       console.log('Torrent download finished.');

//       // Assuming you want to download the first file in the torrent
//       const file = torrent.files[0]; // Get the first file in the torrent
//       const filePath = path.join('/tmp/downloads', file.path);

//       // Check if the file exists
//       fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//           console.error('File not found:', err);
//           return res.status(404).json({ error: 'File not found' });
//         }

//         // Set headers for file download
//         res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
//         res.setHeader('Content-Type', 'application/octet-stream'); // or the appropriate mime type

//         // Stream the file to the user
//         const stream = fs.createReadStream(filePath);
//         stream.pipe(res).on('finish', () => {
//           console.log('Download completed successfully.');
//           torrent.destroy(); // Clean up after the download
//         }).on('error', (streamError) => {
//           console.error('Stream error:', streamError);
//           res.status(500).json({ error: 'Failed to stream file' });
//           torrent.destroy(); // Clean up on error
//         });
//       });
//     });

//     torrent.on('error', (error) => {
//       console.error('Torrent error:', error);
//       res.status(500).json({ error: 'Failed to download file' });
//       torrent.destroy(); // Clean up on error
//     });
//   });

//   // Handle timeout if needed
//   setTimeout(() => {
//     if (!res.headersSent) {
//       console.log('Download process timed out.');
//       res.status(500).json({ error: 'Download process timed out' });
//     }
//   }, 30000); // Adjust the timeout duration as needed
// }









import WebTorrent from 'webtorrent';
import fs from 'fs';
import path from 'path';

const client = new WebTorrent();

export default async function handler(req, res) {
  const magnetLink = req.query.magnetLink;

  if (!magnetLink) {
    return res.status(400).json({ error: 'Magnet link is required' });
  }

  // Start downloading the torrent
  client.add(magnetLink, { path: '/tmp/downloads' }, (torrent) => {
    console.log(`Starting download of torrent: ${torrent.infoHash}`);
    console.log('Torrent files:', torrent.files);

    // Track total size and limit
    let totalSize = 0;

    torrent.files.forEach((file) => {
      totalSize += file.length; // Accumulate the size of all files in the torrent
    });

    const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB in bytes
    if (totalSize > MAX_SIZE) {
      console.error(`Total size of torrent exceeds limit: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`);
      torrent.destroy();
      return res.status(413).json({ error: 'Total size of torrent exceeds the 5 GB limit' });
    }

    console.log(`Total size of torrent: ${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`);

    torrent.on('download', (bytes) => {
      console.log(`Downloaded: ${bytes} bytes. Total downloaded: ${torrent.downloaded}`);
    });

    // Listen for when the torrent has finished downloading
    torrent.on('done', () => {
      console.log('Torrent download finished.');
      
      // Serve the first file or modify logic to select a specific file
      const file = torrent.files[0]; // Modify as needed to serve a different file
      const filePath = path.join('/tmp/downloads', file.path);

      // Ensure the file exists before attempting to stream
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File not found:', err);
          return res.status(404).json({ error: 'File not found' });
        }

        // Set headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream'); // or the appropriate mime type

        // Stream the file to the user
        const stream = fs.createReadStream(filePath);
        stream.pipe(res).on('finish', () => {
          console.log('Download completed successfully.');
          torrent.destroy(); // Clean up after the download
        }).on('error', (streamError) => {
          console.error('Stream error:', streamError);
          res.status(500).json({ error: 'Failed to stream file' });
          torrent.destroy(); // Clean up on error
        });
      });
    });

    // Handle errors
    torrent.on('error', (error) => {
      console.error('Torrent error:', error);
      res.status(500).json({ error: 'Failed to download file' });
      torrent.destroy(); // Clean up on error
    });
  });

  // Handle timeout if needed
  setTimeout(() => {
    if (!res.headersSent) {
      console.log('Download process timed out.');
      res.status(500).json({ error: 'Download process timed out' });
    }
  }, 30000); // Adjust the timeout duration as needed
}


































