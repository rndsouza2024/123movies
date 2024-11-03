// import React, { useEffect, useRef, useState } from "react";
// import youtubeStyles from "@styles/MovieDetail.module.css"; // Import CSS for the MovieDetail component

// const VideoPlayerWithAds = ({ adTagUrl, src }) => {
//   const adOverlayRef = useRef(null);
//   const playerRef = useRef(null);
//   const [isAdPlaying, setIsAdPlaying] = useState(true); // Start with ad playing
//   const [countdown, setCountdown] = useState(10); // 10-second countdown for skip option
//   const [showSkipButton, setShowSkipButton] = useState(false);

//   const fetchVastAd = async () => {
//     try {
//       const response = await fetch(adTagUrl);
//       const xml = await response.text();
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(xml, "application/xml");

//       // Extract media file URL from VAST XML
//       const mediaFileUrl = xmlDoc.getElementsByTagName("MediaFile")[0].textContent;
//       playAd(mediaFileUrl);
//     } catch (error) {
//       console.error("Error fetching VAST:", error);
//     }
//   };

//   const playAd = (adUrl) => {
//     adOverlayRef.current.style.display = "flex"; // Show overlay
//     const adVideo = document.createElement("video"); // Create ad video dynamically
//     adVideo.src = adUrl;
//     adVideo.controls = true;
//     adVideo.autoplay = true;
//     adVideo.style.position = "absolute"; // Ensure ad video stays in overlay
//     adVideo.style.zIndex = "1"; // Place video below overlay content
//     adVideo.onended = () => {
//       adOverlayRef.current.style.display = "none"; // Hide overlay when ad ends
//       setIsAdPlaying(false); // Show main video player
//       adVideo.remove(); // Remove ad video element from DOM
//     };
//     adOverlayRef.current.appendChild(adVideo);
//   };

//   useEffect(() => {
//     fetchVastAd(); // Fetch ad when component mounts

//     // Start countdown
//     const countdownTimer = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev <= 1) {
//           clearInterval(countdownTimer);
//           setShowSkipButton(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(countdownTimer); // Clear countdown timer on unmount
//       if (adOverlayRef.current) {
//         adOverlayRef.current.innerHTML = ""; // Clear overlay content only if ref is defined
//       }
//     };
//   }, [adTagUrl]);

//   const handleSkipAd = () => {
//     setIsAdPlaying(false); // Hide ad player
//     if (adOverlayRef.current) {
//       adOverlayRef.current.style.display = "none"; // Hide overlay
//       adOverlayRef.current.innerHTML = ""; // Clear overlay content
//     }
//   };

//   return (
//     <div className={youtubeStyles.videoPlayerContainer} style={{ marginTop: "30px", position: "relative" }}>

//       {/* Ad Overlay */}
//       {isAdPlaying && (
//         <div ref={adOverlayRef} style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           marginTop:"300px",
//           justifyContent: "center",
//           alignItems: "center",
//           color: "white",
//           backgroundColor: "rgba(0, 0, 0, 0.7)",
//           zIndex: 2,
//         }}>
//           <div style={{ textAlign: "center", zIndex: 3 }}>
//             {/* <p style={{
//               fontWeight: "bold",
//               fontSize: "20px",
//               marginTop:"60px",
//               textShadow: "1px 1px 0px #000",
//             }}>Ad is playing...</p>
//             <br /> */}
//             {!showSkipButton ? (
//               <p style={{
//                 fontWeight: "bold",
//                 fontSize: "20px",
//                 textShadow: "1px 1px 0px #000",
//               }}>Skip in {countdown} seconds</p>
//             ) : (
//                 <button
//                 onClick={handleSkipAd}
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "20px", // Reduced font size
//                   padding: "8px 16px", // Reduced padding for smaller button
//                   backgroundColor: "rgba(0, 0, 0, 0.8)",
//                   marginTop:"50px",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                   textShadow: "1px 1px 0px #000",
//                   zIndex: 4, // Ensure button is on top of everything
//                   position: "relative", // Ensure it stays above the ad video
//                 }}
//               >Skip Ad</button>
//             )}
//           </div>
//         </div>
//       )}

//       {!isAdPlaying && src && (
//         <iframe
//           ref={playerRef}
//           src={src}
//           width="100%"
//           height="100%"
//           allowFullScreen
//           allow="fullscreen; picture-in-picture"
//           webkitAllowFullScreen={true}
//           mozAllowFullScreen={true}
//           style={{ borderRadius: "15px", zIndex: 1 }}
//         />
//       )}
//     </div>
//   );
// };

// export default VideoPlayerWithAds;


























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
            marginTop:"300px",
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
                  marginTop:"300px",
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
          style={{ borderRadius: "15px",  marginTop:"300px", zIndex: 1 }}
        />
      )}
    </div>
  );
};

export default VideoPlayerWithAds;
