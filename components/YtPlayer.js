// YtPlayer.js
import React, { useEffect, useRef } from 'react';

const YtPlayer = ({ ytsource }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!ytsource) return; // Wait for ytsource to be available

    const loadYouTubeAPI = () => {
      const onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          width: '100%',
          height: '100%',
          videoId: ytsource,
          playerVars: {
            autoplay: 1,
            mute: 1,
            loop: 1,
            enablejsapi: 1,
            modestbranding: 1,
            playlist: ytsource,
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
            },
          },
        });
      };

      if (typeof window !== 'undefined' && typeof window.YT === 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      } else {
        onYouTubeIframeAPIReady();
      }
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [ytsource]);

  // Inline styles
  const playerContainerStyle = {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9 Aspect Ratio
    height: 0, // Set height to 0 to maintain aspect ratio
    overflow: 'hidden',
    borderRadius: '50px',
    boxShadow: '0 0 10px 0 #fff',
    marginBottom: '15px',
  };

  const playerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)',
  };

  return (
    <div style={playerContainerStyle}>
      <div id="youtube-player" style={playerStyle}></div>
    </div>
  );
};

export default YtPlayer;
