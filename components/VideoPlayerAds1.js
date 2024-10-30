import React, { useEffect, useRef, useState } from "react";
import youtubeStyles from "@styles/MovieDetail.module.css"; // Import CSS for the MovieDetail component

const VideoPlayerWithAds = ({ adTagUrl, src }) => {
  const adOverlayRef = useRef(null);
  const playerRef = useRef(null);
  const [isAdPlaying, setIsAdPlaying] = useState(true);
  const [countdown, setCountdown] = useState(10); // 10-second countdown for skip option
  const [showSkipButton, setShowSkipButton] = useState(false);

  const fetchVastAd = async () => {
    try {
      const response = await fetch(adTagUrl);
      const xml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      // Extract media file URL from VAST XML
      const mediaFileUrl = xmlDoc.getElementsByTagName("MediaFile")[0].textContent;
      playAd(mediaFileUrl);
    } catch (error) {
      console.error("Error fetching VAST:", error);
    }
  };

  const playAd = (adUrl) => {
    adOverlayRef.current.style.display = "flex";
    const adVideo = document.createElement("video");
    adVideo.src = adUrl;
    adVideo.controls = true;
    adVideo.autoplay = true;
    adVideo.style.position = "absolute";
    adVideo.style.zIndex = "1";
    adVideo.onended = () => {
      adOverlayRef.current.style.display = "none";
      setIsAdPlaying(false);
      adVideo.remove();
    };
    adOverlayRef.current.appendChild(adVideo);
  };

  useEffect(() => {
    fetchVastAd();

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          setShowSkipButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
      if (adOverlayRef.current) {
        adOverlayRef.current.innerHTML = "";
      }
    };
  }, [adTagUrl]);

  const handleSkipAd = () => {
    setIsAdPlaying(false);
    if (adOverlayRef.current) {
      adOverlayRef.current.style.display = "none";
      adOverlayRef.current.innerHTML = "";
    }
  };

  return (
    <div
      className={`${youtubeStyles.videoPlayerContainer} ${youtubeStyles.responsivePlayer}`}
      style={{ marginTop: "30px", position: "relative" }}
    >
      {/* Ad Overlay */}
      {isAdPlaying && (
        <div
          ref={adOverlayRef}
          className={youtubeStyles.adOverlay}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            marginTop:"365px",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", zIndex: 3 }}>
            {!showSkipButton ? (
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  textShadow: "1px 1px 0px #000",
                }}
              >
                Skip in {countdown} seconds
              </p>
            ) : (
              <button
                onClick={handleSkipAd}
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  padding: "8px 16px",
                  marginTop:"365px",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textShadow: "1px 1px 0px #000",
                  zIndex: 4,
                  position: "relative",
                }}
              >
                Skip Ad
              </button>
            )}
          </div>
        </div>
      )}

      {!isAdPlaying && src && (
        <iframe
          ref={playerRef}
          src={src}
          width="100%"
          height="100%"
          allowFullScreen
          allow="fullscreen; picture-in-picture"
          webkitAllowFullScreen={true}
          mozAllowFullScreen={true}
          style={{ borderRadius: "15px",  marginTop:"365px", zIndex: 1 }}
        />
      )}
    </div>
  );
};

export default VideoPlayerWithAds;
