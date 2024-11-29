  // Wrap your code inside DOMContentLoaded event listener
  document.addEventListener("DOMContentLoaded", function () {
    

    // Your existing script
    const adVideo1 = document.getElementById('ad-video-1');
    const adVideo2 = document.getElementById('ad-video-2');
    const videoIframe1 = document.getElementById('video-iframe-1');
    const videoIframe2 = document.getElementById('video-iframe-2');
    const buyButton1 = document.getElementById('buyButton-1');
    const buyButton2 = document.getElementById('buyButton-2');

    adVideo1.addEventListener('ended', () => {
      adVideo1.style.display = 'none';
      videoIframe1.style.display = 'block';
      buyButton1.style.display = 'none';
      videoIframe1.contentWindow.postMessage('play', '*');
    });

    videoIframe1.addEventListener('ended', () => {
      videoIframe1.style.display = 'none';
      adVideo2.style.display = 'block';
      adVideo2.play();
    });

    adVideo2.addEventListener('ended', () => {
      adVideo2.style.display = 'none';
      videoIframe2.style.display = 'block';
      buyButton2.style.display = 'none';
      videoIframe2.contentWindow.postMessage('play', '*');
    });
  })
