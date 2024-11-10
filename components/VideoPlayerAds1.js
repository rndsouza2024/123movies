
import React, { useEffect, useRef, useState } from "react";
import youtubeStyles from "@styles/MovieDetail.module.css"; // Import CSS for the MovieDetail component

const VideoPlayerWithAds1 = ({ adTagUrl, src }) => {
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
      const mediaFileUrl =
        xmlDoc.getElementsByTagName("MediaFile")[0].textContent;
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
    adVideo.muted = true; // Add muted to enable autoplay in most browsers
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
            marginTop: "141px",
            zIndex: 2,
          }}
        >
          <div style={{ textAlign: "center", zIndex: 2 }}>
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
              // <button
              //   onClick={handleSkipAd}
              //   style={{
              //     fontWeight: "bold",
              //     fontSize: "20px",
              //     padding: "8px 16px",
              //     marginTop: "300px",
              //     color: "white",
              //     border: "none",
              //     borderRadius: "5px",
              //     cursor: "pointer",
              //     textShadow: "1px 1px 0px #000",
              //     zIndex: 4,
              //     position: "relative",
              //   }}
              // >
              //   Skip Ad
              // </button>
              <button
              onClick={handleSkipAd}
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                padding: "8px 16px",
                // marginTop: "300px",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                textShadow: "1px 1px 0px #000",
                // zIndex: 2,
                // position: "relative",
              }}
            >
              Skip Ad
            </button>
            )}
             <a
              href="https://www.amazon.in/JBL-130NC-Active-Cancellation-Earbuds/dp/B09HGSD4TD?crid=GWDPS7LEBLA9&dib=eyJ2IjoiMSJ9.M6O91hr-Aeegum3J8TgcDgF-GS4ug9Qxzn-RolTSIv3GtakQ8r-lZd6Vam0cF4tPv__OHZbWTVeblSfDQFp9xA270oWGNW39Zi8r00Va4Jk3dYktXoq_YLpr5FjY-BfdGt-jJK_SzrqCIRmR1lyAI4s1BA3151kqmTi_vzFIp3iEXfFxTW-QPDuriUMY3U3LhiWbTSIl50J3eS8xTnIIkV44lJ2Qnus0JlqSm62SgmzrftyoEe1UD91ykqJBtFGTIfzrWV2PSX4P2eJExqtPaxGyvDdC9V7yg4g9ZrMYjD4.H5GALnNJEKZtKRh-S29gz2nSyu_4D0KsL8L4Vsu_XFE&dib_tag=se&keywords=headphones%2BBUDS%2Bnoise%2Bcancellation&qid=1730945886&refinements=p_123%3A233043&rnid=91049095031&s=electronics&sprefix=headphones%2Bbuds%2Bnoise%2Bcancellation%2Celectronics%2C194&sr=1-1&th=1&linkCode=ll1&tag=rnd08c-21&linkId=4139e3dedaea1c1d00bac7faed0cf9f3&language=en_IN&ref_=as_li_ss_tl"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                // position: "relative",
                padding: "8px 16px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                // marginTop: "300px",
                borderRadius: "5px",
                fontWeight: "bold",
                fontSize: "20px",
                textDecoration: "none",
                // zIndex: 2,
                marginTop: "10px", // Added margin for spacing below "Skip Ad"
              }}
            >
              Click Now 2 BUY !!!
            </a>
       
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
            autoplay
            allow="fullscreen; picture-in-picture"
            webkitAllowFullScreen={true}
            mozAllowFullScreen={true}
            style={{ borderRadius: "15px", marginTop: "300px", zIndex: 1 }}
          />
          
      )}
    </div>
  );
};

export default VideoPlayerWithAds1;







// import React, { useEffect, useRef, useState } from "react";
// import youtubeStyles from "@styles/MovieDetail.module.css"; // Import CSS for the MovieDetail component

// const VideoPlayerWithAds1 = ({ adTagUrl, src }) => {
//   const adOverlayRef = useRef(null);
//   const playerRef = useRef(null);
//   const [isAdPlaying, setIsAdPlaying] = useState(true);
//   const [countdown, setCountdown] = useState(10); // 10-second countdown for skip option
//   const [showSkipButton, setShowSkipButton] = useState(false);

//   const fetchVastAd = async () => {
//     try {
//       const response = await fetch(adTagUrl);
//       const xml = await response.text();
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(xml, "application/xml");

//       // Extract media file URL from VAST XML
//       const mediaFileUrl =
//         xmlDoc.getElementsByTagName("MediaFile")[0].textContent;
//       playAd(mediaFileUrl);
//     } catch (error) {
//       console.error("Error fetching VAST:", error);
//     }
//   };

//   const playAd = (adUrl) => {
//     adOverlayRef.current.classList.add(youtubeStyles.active); // Show the ad overlay
//     const adVideo = document.createElement("video");
//     adVideo.src = adUrl;
//     adVideo.controls = true;
//     adVideo.autoplay = true;
//     adVideo.muted = true; // Add muted to enable autoplay in most browsers
//     adVideo.style.position = "absolute";
//     adVideo.style.zIndex = "1";
//     adVideo.onended = () => {
//       adOverlayRef.current.classList.remove(youtubeStyles.active); // Hide the ad overlay when ad ends
//       setIsAdPlaying(false);
//       adVideo.remove();
//     };
//     adOverlayRef.current.appendChild(adVideo);
//   };

//   useEffect(() => {
//     fetchVastAd();

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
//       clearInterval(countdownTimer);
//       if (adOverlayRef.current) {
//         adOverlayRef.current.innerHTML = "";
//       }
//     };
//   }, [adTagUrl]);

//   const handleSkipAd = () => {
//     setIsAdPlaying(false);
//     if (adOverlayRef.current) {
//       adOverlayRef.current.classList.remove(youtubeStyles.active); // Hide the overlay when skipping
//       adOverlayRef.current.innerHTML = "";
//     }
//   };

//   return (
//     <div
//       className={`${youtubeStyles.videoPlayerContainer} ${youtubeStyles.responsivePlayer}`}
//       style={{ marginTop: "30px", position: "relative" }}
//     >
//       {/* Ad Overlay */}
//       {isAdPlaying && (
//         <div
//           ref={adOverlayRef}
//           className={`${youtubeStyles.adOverlay} ${showSkipButton ? "active" : ""}`}
//         >
//           <div style={{ textAlign: "center", zIndex: 3 }}>
//             {!showSkipButton ? (
//               <p
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "20px",
//                   textShadow: "1px 1px 0px #000",
//                 }}
//               >
//                 Skip in {countdown} seconds
//               </p>
//             ) : (
              // <button
              //   onClick={handleSkipAd}
              //   style={{
              //     fontWeight: "bold",
              //     fontSize: "20px",
              //     padding: "8px 16px",
              //     marginTop: "10px",
              //     color: "white",
              //     border: "none",
              //     borderRadius: "5px",
              //     cursor: "pointer",
              //     textShadow: "1px 1px 0px #000",
              //     zIndex: 4,
              //     position: "relative",
              //   }}
              // >
              //   Skip Ad
              // </button>
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
//           autoplay
//           allow="fullscreen; picture-in-picture"
//           webkitAllowFullScreen={true}
//           mozAllowFullScreen={true}
//           style={{ borderRadius: "15px", zIndex: 1 }}
//         />
//       )}
//     </div>
//   );
// };

// export default VideoPlayerWithAds1;
