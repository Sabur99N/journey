const fs = require('fs');
const https = require('https');

const download = (url, path) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      res.pipe(fs.createWriteStream(path)).on('close', resolve);
    });
  });
};

(async () => {
  await download('https://dummyimage.com/192x192/03030b/00f0ff.png&text=SJ', 'public/pwa-192x192.png');
  await download('https://dummyimage.com/512x512/03030b/00f0ff.png&text=SJ', 'public/pwa-512x512.png');
  console.log('Icons downloaded');
})();
