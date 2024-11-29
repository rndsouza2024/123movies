import React, { useEffect, useRef,useState } from "react";
import path from "path";
import fs from "fs/promises";
import { useRouter } from "next/router";
import Head from "next/head";
import SocialSharing from "../../components/SocialSharing";
import hindiDubbedStyles from "@styles/styles.module.css";
import Link from "next/link"; // Ensure you import Link from Next.js
// Helper function to create a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}

// This function generates the paths for static generation
export async function getStaticPaths() {
  try {
    const filePath = path.join(process.cwd(), "public", "hindiDubbed.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const hindiDubbedData = JSON.parse(jsonData);

    // Generate slugs and create paths for each hindiDubbed item
    const paths = hindiDubbedData.map((hindiDubbedItem) => ({
      params: { id: generateSlug(hindiDubbedItem.title) }, // Use the slug as the dynamic route part
    }));

    return {
      paths,
      fallback: false, // Set to false to return 404 if the slug doesn't exist
    };
  } catch (error) {
    console.error("Error reading hindiDubbed.json", error);
    return { paths: [], fallback: false };
  }
}

// Fetching specific hindiDubbed data based on the dynamic slug (id)
export async function getStaticProps({ params }) {
  try {
    const filePath = path.join(process.cwd(), "public", "hindiDubbed.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const hindiDubbedData = JSON.parse(jsonData);

    // Find the hindiDubbed item based on the slug in the URL
    const hindiDubbedItem = hindiDubbedData.find(
      (item) => generateSlug(item.title) === params.id
    );

    if (!hindiDubbedItem) {
      return { notFound: true }; // Return 404 if the hindiDubbed item is not found
    }

    return {
      props: {
        hindiDubbedItem, // Pass the hindiDubbed item as a prop to the page
      },
    };
  } catch (error) {
    console.error("Error fetching hindiDubbed item", error);
    return { notFound: true };
  }
}

const NewsSchema = (hindiDubbedItem) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        "@id": `${hindiDubbedItem.siteurl || ''}/#movie`,
        name: hindiDubbedItem.title || 'Untitled',
        url: hindiDubbedItem.siteurl || '',
        description: hindiDubbedItem.description || 'No description available.',
        image: {
          "@type": "ImageObject",
          url: hindiDubbedItem.image1 || '',
          width: 1280,
          height: 720,
        },
        datePublished: hindiDubbedItem.datePublished || '',
        genre: Array.isArray(hindiDubbedItem.genre)
          ? hindiDubbedItem.genre.map((g) => g.replace(/,/g, '').trim())
          : [],
        aggregateRating:
          hindiDubbedItem.aggregateRating || undefined, // Add only if present
        director: {
          "@type": "Person",
          name: (hindiDubbedItem.directorname || 'Unknown').trim(),
        },
        actor: Array.isArray(hindiDubbedItem.starring)
          ? hindiDubbedItem.starring.map((actor) => ({
              "@type": "Person",
              name: actor.replace(/,/g, '').trim(),
            }))
          : [],
        creator: {
          "@type": "Organization",
          name: (hindiDubbedItem.Originalnetwork || 'Unknown').trim(),
        },
        keywords: hindiDubbedItem.keywords || '',
      },
      {
        "@type": "WebPage",
        "@id": `${hindiDubbedItem.siteurl || ''}/#webpage`,
        url: hindiDubbedItem.siteurl || '',
        name: hindiDubbedItem.title || 'Untitled',
        isPartOf: {
          "@id": `${hindiDubbedItem.siteurl || ''}/#website`,
        },
        primaryImageOfPage: {
          "@id": `${hindiDubbedItem.siteurl || ''}/#primaryimage`,
        },
        datePublished: hindiDubbedItem.datePublished || '',
        dateModified: hindiDubbedItem.dateModified || '',
        breadcrumb: {
          "@id": `${hindiDubbedItem.siteurl || ''}/#breadcrumb`,
        },
        potentialAction: {
          "@type": "WatchAction",
          target: [`${hindiDubbedItem.siteurl || ''}`],
        },
        inLanguage: "en-US",
      },
      {
        "@type": "WebSite",
        "@id": `${hindiDubbedItem.siteurl || ''}/#website`,
        url: hindiDubbedItem.siteurl || '',
        name: "Just Watch Free™ - Explore. Discover. Online.",
        publisher: {
          "@type": "Organization",
          "@id": `${hindiDubbedItem.siteurl || ''}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${hindiDubbedItem.siteurl || ''}/?s={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${hindiDubbedItem.siteurl || ''}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${hindiDubbedItem.siteurl || ''}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: hindiDubbedItem.title || 'Untitled',
            item: `${hindiDubbedItem.siteurl || ''}`,
          },
        ],
      },
    ],
  });
  
export default function hindiDubbedArticle({ hindiDubbedItem, videoSources = [] }) {
  const schemaData = NewsSchema(hindiDubbedItem);
  const router = useRouter();
  const [accordionExpanded, setAccordionExpanded] = useState(false); // Added state for the accordion
  const [seconds, setSeconds] = useState(10);
  const [showTimer, setShowTimer] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const { movie1, hindiDubbed2, image1, downloadlink, dailyhindiDubbed } =
    hindiDubbedItem || {}; // Ensure `hindiDubbedItem` is defined

  // Fetch current video and ID
  const currentVideoId = Array.isArray(movie1)
    ? movie1[currentEpisodeIndex] || ""
    : "";
  Array.isArray(dailyhindiDubbed) ? dailyhindiDubbed[currentEpisodeIndex] || "" : "";
  const id = Array.isArray(hindiDubbed2) ? hindiDubbed2[currentEpisodeIndex] || "" : "";

  // Get video sources for the current episode
  const currentVideoData = videoSources?.[currentEpisodeIndex] || {};
  const currentVideoSources = currentVideoData?.urls || [];
  const src = currentVideoSources?.[currentPlayerIndex] || ""; // Default to an empty string

  // Define URLs for different players
  const urls = [
    `https://short.ink/${currentVideoId}?thumbnail=${image1}`,
    `https://geo.dailymotion.com/player/xjrxe.html?video=${dailyhindiDubbed}&mute=true&Autoquality=1080p`,
    `https://vidsrc.me/embed/movie?imdb=${id}`,
    `https://embed.su/embed/movie/${id}`,
    `https://vidsrc.cc/v2/embed/movie/${id}`,
    `https://ffhindiDubbed.lol/hindiDubbed/?imdb=${id}`,
    `https://autoembed.co/movie/imdb/${id}`,
    `https://multiembed.mov/directstream.php?video_id=${id}`,
  ];

  // Handle navigating to the next episode
  const handleNextEpisode = () => {
    setCurrentEpisodeIndex(
      (prevIndex) => (prevIndex + 1) % videoSources.length
    );
  };

  // Handle navigating to the previous episode
  const handlePreviousEpisode = () => {
    setCurrentEpisodeIndex(
      (prevIndex) => (prevIndex - 1 + videoSources.length) % videoSources.length
    );
  };

  // Handle selecting a specific player
  const handlePlayerSelect = (index) => {
    setCurrentPlayerIndex(index);
  };

  // Handle navigation back to main news section
  const goBackToMain = () => {
    router.push("/hindiDubbed");
  };

  const handleStartTimer = () => {
    setShowTimer(true);
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleAccordion = () => {
    setAccordionExpanded(!accordionExpanded); // Toggle the accordion state
  };

  const [imageSize, setImageSize] = useState({
    width: "200px",
    height: "200px",
  });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 768) {
        setImageSize({ width: "150px", height: "150px" });
      } else {
        setImageSize({ width: "200px", height: "200px" });
      }
    };

    updateSize(); // Set size on initial render
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // useEffect(() => {
  //   const loadYouTubeAPI = () => {
  //     return new Promise((resolve) => {
  //       if (window.YT && window.YT.Player) {
  //         resolve();
  //       } else {
  //         const tag = document.createElement("script");
  //         tag.src = "https://www.youtube.com/iframe_api";
  //         tag.onload = () => {
  //           window.onYouTubeIframeAPIReady = resolve;
  //         };
  //         document.body.appendChild(tag);
  //       }
  //     });
  //   };

  //   loadYouTubeAPI().then(() => {
  //     // Initialize first video player
  //     if (hindiDubbedItem.source && hindiDubbedItem.source !== "#") {
  //       new window.YT.Player("player-0", {
  //         videoId: hindiDubbedItem.source,
  //         playerVars: {
  //           playsinline: 1,
  //           autoplay: 1,
  //           mute: 1,
  //           loop: 1,
  //           playlist: hindiDubbedItem.source,
  //         },
  //       });
  //     }

  //     // Initialize second video player
  //     if (hindiDubbedItem.source1 && hindiDubbedItem.source1 !== "#") {
  //       new window.YT.Player("player-1", {
  //         videoId: hindiDubbedItem.source1,
  //         playerVars: {
  //           playsinline: 1,
  //           autoplay: 1,
  //           mute: 1,
  //           loop: 1,
  //           playlist: hindiDubbedItem.source1,
  //         },
  //       });
  //     }
  //   });
  // },
  //  [hindiDubbedItem]);

  const loadYouTubeAPI = () => {
    if (typeof window !== "undefined" && typeof window.YT === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => setPlayerReady(true);
    } else if (window.YT) {
      setPlayerReady(true);
    }
  };

  useEffect(() => {
    loadYouTubeAPI();
  }, []);

  useEffect(() => {
    if (playerReady && hindiDubbedItem.source && hindiDubbedItem.source.length === 11) {
      if (playerRef.current) {
        // Destroy the existing player if it exists
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        width: "100%",
        height: "100%",
        videoId: hindiDubbedItem.source,
        playerVars: {
          playsinline: 1,
          autoplay: 1,
          mute: 1,
          enablejsapi: 1,
          modestbranding: 1,
          loop: 1,
          playlist: hindiDubbedItem.source, // Repeat the same video for looping
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    }
  }, [playerReady, hindiDubbedItem.source]);

  return (
    <>
      <Head>
        <title>Movies Free™ – {hindiDubbedItem.title || "Default Title"}</title>

        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="https://moviefree.vercel.app/sitemap.xml"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="googlebot" content="index,follow" />
        <meta name="revisit-after" content="1 days" />
        <meta name="referrer" content="origin" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="keywords"
          content="moviefree, hindiDubbed, watch movie online, free hindiDubbed, free hindiDubbed online, free movie streaming, moviefree hindiDubbed free streaming, download free" 
        />
        <meta
          property="og:description"
          content="Stream HD hindiDubbed and TV series for free on hindiDubbedFree™. Explore, stream, and download full-length hindiDubbed and shows in HD quality without registration."
        />
        <meta
          name="description"
          content="Stream HD hindiDubbed and TV series for free on hindiDubbedFree™. Explore, stream, and download full-length hindiDubbed and shows in HD quality without registration."
        />
        <link rel="canonical" href={hindiDubbedItem.siteurl} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content=" hindiDubbed Free™ – Online. Stream. Download. "
        />
        <meta property="og:url" content={hindiDubbedItem.siteurl} />

        <meta
          property="og:site_name"
          content=" hindiDubbed Free™ – Online. Stream. Download. "
        />
        <meta
          property="og:image"
          content="https://moviefree.vercel.app/og_image.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpg" />
        <meta
          name="application-name"
          content=" hindiDubbed Free™ – Online. Stream. Download. "
        />
        <meta
          property="article:modified_time"
          content="2024-01-01T13:13:13+00:00"
        />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="https://moviefree.vercel.app/sitemap.xml"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content=" hindiDubbed Free™ – Online. Stream. Download."
        />
        <meta
          name="twitter:description"
          content="Stream HD hindiDubbed and TV series for free on hindiDubbedFree™. Explore, stream, and download full-length hindiDubbed and shows in HD quality without registration."
        />
        <meta
          name="twitter:image"
          content="https://moviefree.vercel.app/og_image.jpg"
        />
        <meta
          name="google-site-verification"
          content="4gdbnCGat0T4Ow3Y_RYzPM4vwtsXvhUel5Q-2yULK6k"
        />

        <meta
          name="facebook-domain-verification"
          content="du918bycikmo1jw78wcl9ih6ziphd7"
        />
        <meta
          name="dailymotion-domain-verification"
          content="dm3bs67ukdegz9qik"
        />
        <meta name="monetag" content="98a412cb5612b9188cd76b9744304b6c" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaData }}
        />
      </Head>
      <SocialSharing />

    
        {/* Pagination Button to Return to Main Section */}
        <div style={styles.paginationContainer}>
          <button onClick={goBackToMain} style={styles.pageButton}>
            Back to Hindi Dubbed Section
          </button>
        </div>
        <div style={styles.container}>
        <h1 style={styles.title}>{hindiDubbedItem.title}</h1>
        {/* <p style={styles.date}>
        {hindiDubbedItem.date} - {hindiDubbedItem.time}
      </p>
      <p style={styles.courtesy}>Courtesy: {hindiDubbedItem.courtesy}</p> */}

        {/* Description Section */}
        {/* {hindiDubbedItem.description && <p style={styles.description}>{hindiDubbedItem.description}</p>} */}

        {/* Image Section */}
       {hindiDubbedItem.image && (
          <img
            src={hindiDubbedItem.image}
            alt={hindiDubbedItem.title}
            style={styles.image}
          />
        )}
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "1px 1px 0px #000",
          }}
        >
           </div>
           {/* <p className={styles.year}>
            <strong className=" text-xl font-semibold mt-2">
              Released Date: {hindiDubbedItem.year}
            </strong>
          </p>
          <p className={styles.rating}>
            <strong className=" text-xl font-semibold mt-2">
              {" "}
              IDBM Rating: {hindiDubbedItem.rating}{" "}
            </strong>
          </p>
          <p className={styles.genre}>
            <strong className=" text-xl font-semibold mt-2">
              {" "}
              Genre: {hindiDubbedItem.genre}
            </strong>
          </p>
          <p className={styles.Originalnetwork}>
            <strong className=" text-xl font-semibold mt-2">
              {" "}
              Original Network: {hindiDubbedItem.Originalnetwork}
            </strong>
          </p>
          <p className={styles.directorname}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Director: {hindiDubbedItem.directorname}
            </strong>
          </p>
          <p className={styles.starring}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Starring: {hindiDubbedItem.starring}
            </strong>
          </p>
          <p className={styles.country}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Country: {hindiDubbedItem.country}
            </strong>
          </p>
          <p className={styles.language}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Language: {hindiDubbedItem.language}
            </strong>
          </p>
          <p className={styles.avgTime}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Duration: {hindiDubbedItem.avgTime}
            </strong>
          </p>
          <p className={styles.synopsis}>
            <strong className="text-xl font-semibold mt-2">
              {" "}
              Synopsis: {hindiDubbedItem.synopsis}{" "}
            </strong>
          </p>
        </div> */}
        {/* <div className={`${hindiDubbedStyles.imageGrid} mt-5`}> */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"> */}
        {/* <div className="flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 items-center justify-center">
            <img
              className={` img-fluid lazyload `}
              src={hindiDubbedItem.directorimg}
              alt={hindiDubbedItem.directorname}
              title={hindiDubbedItem.directorname}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
            <img
              className={` img-fluid lazyload`}
              src={hindiDubbedItem.actor1img}
              alt={hindiDubbedItem.actor1}
              title={hindiDubbedItem.actor1}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
            <img
              className={` img-fluid lazyload`}
              src={hindiDubbedItem.actor2img}
              alt={hindiDubbedItem.actor2}
              title={hindiDubbedItem.actor2}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
            <img
              className={` img-fluid lazyload`}
              src={hindiDubbedItem.actor3img}
              alt={hindiDubbedItem.actor3}
              title={hindiDubbedItem.actor3}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
            <img
              className={` img-fluid lazyload`}
              src={hindiDubbedItem.actor4img}
              alt={hindiDubbedItem.actor4}
              title={hindiDubbedItem.actor4}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
            <img
              className={` img-fluid lazyload`}
              src={hindiDubbedItem.actor5img}
              alt={hindiDubbedItem.actor5}
              title={hindiDubbedItem.actor5}
              style={{
                ...imageSize,
                objectFit: "cover",
                boxShadow: "0 0 10px 0 #000",
                filter:
                  "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
                borderRadius: "50%",
              }}
              loading="lazy"
              layout="responsive"
            />
          </div>
        </div> */}

        {/* first Description */}
        {/* {hindiDubbedItem.description1 && <p style={styles.description1}>{hindiDubbedItem.description1}</p>} */}

        {/* First YouTube Video */}
        {hindiDubbedItem.source && hindiDubbedItem.source !== "#" && (
          <div style={styles.source}>
            <h2
              className="text-3xl mt-2"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: "bold",
                textAlign: "center",
                textShadow: "1px 1px 0px #000",
              }}
            >
              {" "}
              Watch Official Trailer.
            </h2>
            {/* <div id="player-0" style={styles.youtubePlayer}></div> */}
            
                 <div
      id="youtube-player" style={styles.youtubePlayer}
     
    />
          </div>
        )}

        {/* Image 1 Section */}
        {/* {hindiDubbedItem.image1 && <img src={hindiDubbedItem.image1} alt="Additional" style={styles.image} />} */}

        {/* Second YouTube Video */}
        {/* {hindiDubbedItem.source1 && hindiDubbedItem.source1 !== "#" && (
          <div style={styles.source}>
            <div id="player-1" style={styles.youtubePlayer}></div>
          </div>
        )} */}
        {/* second Description */}
        {/* {hindiDubbedItem.description2 && <p style={styles.description2}>{hindiDubbedItem.description2}</p>} */}
        {/* Embed MP3 Player and Podcast Indicator */}
        {(hindiDubbedItem.pod || hindiDubbedItem.mp3) && (
          <div style={styles.podcastContainer}>
            {/* Podcast Indicator and YouTube Player */}
            {hindiDubbedItem.pod && (
              <div style={styles.podcastWrapper}>
                <div style={styles.podcastIndicator}>
                  <span
                    role="img"
                    className="animate-pulse"
                    aria-label="Podcast"
                    style={styles.podcastIcon}
                  >
                    🎙️
                  </span>
                  Podcast
                </div>
                <iframe
                  width="50%"
                  height="80"
                  src={`https://www.youtube.com/embed/${new URL(
                    hindiDubbedItem.pod
                  ).searchParams.get("v")}?list=${new URL(
                    hindiDubbedItem.pod
                  ).searchParams.get("list")}&controls=1`}
                  frameBorder="0"
                  allow="encrypted-media"
                  allowFullScreen
                  style={styles.youtubeEmbed}
                />
              </div>
            )}

            {/* MP3 Player */}
            {hindiDubbedItem.mp3 && (
              <div style={styles.audioWrapper}>
                <div style={styles.podcastIndicator}>
                  <span
                    role="img"
                    className="animate-pulse"
                    aria-label="Podcast"
                    style={styles.podcastIcon}
                  >
                    🎙️
                  </span>
                  Podcast
                </div>
                {/* <audio controls style={styles.audioPlayer}>
                <source src={hindiDubbedItem.mp3} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio> */}
                {/* MP3 Player */}
                <audio controls width="100%" height="50">
                  <source src={hindiDubbedItem.mp3} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        <div style={styles.iframeContainer}>
          <iframe
            style={styles.iframe}
            src={urls[currentPlayerIndex] || ""}
            allowFullScreen
            scrolling="no"
            title="Video Player"
          ></iframe>
        </div>

        {/* Episode navigation buttons */}
        {/* <div style={styles.buttonContainer}>
  <button
    onClick={handlePreviousEpisode}
    style={styles.episodeButton}
  >
    Previous Episode
  </button>
  <button
    onClick={handleNextEpisode}
    style={styles.episodeButton}
  >
    Next Episode
  </button>
</div> */}

        {/* Player selection buttons */}
        <div style={styles.playerButtonContainer}>
          {urls.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePlayerSelect(index)}
              style={{
                ...styles.playerButton,
                ...(currentPlayerIndex === index
                  ? styles.activePlayerButton
                  : {}),
              }}
            >
              Player {index + 1}
            </button>
          ))}
        </div>
        {/* Episode navigation buttons */}
        {/* <div className="flex justify-center gap-4 mt-4">
        <button onClick={handlePreviousEpisode} className="px-4 py-2 bg-gray-300 rounded">
          Previous Episode
        </button>
        <button onClick={handleNextEpisode} className="px-4 py-2 bg-gray-300 rounded">
          Next Episode
        </button>
      </div> */}

        {/* Player selection buttons */}
        {/* <div className="flex justify-center gap-2 mt-4">
        {urls.map((_, index) => (
          <button
            key={index}
            onClick={() => handlePlayerSelect(index)}
            className={`px-4 py-2 rounded ${
              currentPlayerIndex === index ? "bg-red-500 text-white" : "bg-gray-300 text-black"
            }`}
          >
            Player {index + 1}
          </button>
        ))}
      </div> */}
      </div>
   
      {/* Download Section */}
      <div className={styles.container}>
        <h2
          className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Click to Download {hindiDubbedItem?.name}
        </h2>

        <div
          className="flex flex-col items-center justify-center"
          style={{
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {!showTimer ? (
            // Initial Download Now button, starts countdown
            <button
              onClick={handleStartTimer} // Starts countdown
              className="animate-pulse bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-xl mb-4"
              style={{
                marginBottom: "20px",
              }}
            >
              Download Now
            </button>
          ) : (
            <>
              {/* Countdown display after button is clicked */}
              {seconds > 0 ? (
                <p
                  className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl font-bold mb-4"
                  style={{ marginTop: "50px" }}
                >
                  Your download link will be ready in {seconds} seconds...
                </p>
              ) : (
                <p
                  className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl font-bold mb-4"
                  style={{ marginTop: "50px" }}
                >
                  Your download links are ready.
                </p>
              )}

              {/* Display all the download links after countdown finishes */}
              {seconds === 0 && downloadlink && (
                <div className="flex flex-col items-center w-full">
                  {/* Iterate through the downloadlink array and display each link as a button */}
                  {Array.isArray(downloadlink) && downloadlink.length > 0 ? (
                    downloadlink.map((link, index) => (
                      <Link
                        key={index}
                        href={link}
                        target="_blank"
                        className="bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 mb-4 w-full sm:w-auto"
                      >
                        Download Link
                      </Link>
                    ))
                  ) : (
                    <p className="text-xl font-bold text-red-500">
                      No download links available.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "20px",
    color: "#007bff",
    fontWeight: "bold",
    textShadow: "1px 1px 0px #000",
  },
  date: {
    fontSize: "1.3rem",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.5rem",
    textShadow: "1px 1px 0px #000",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
  },
  courtesy: {
    fontSize: "1.3rem",
    textAlign: "center",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
    marginBottom: "30px",
    fontWeight: "bold",
    textShadow: "1px 1px 0px #000",
  },
  description: {
    fontSize: "1.5rem",
    lineHeight: "1.6",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
  },
  description1: {
    fontSize: "1.3rem",
    lineHeight: "1.6",
    marginBottom: "20px",
    fontWeight: "bold",
    textShadow: "1px 1px 0px #000",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
  },
  description2: {
    fontSize: "1.3rem",
    lineHeight: "1.6",
    marginBottom: "20px",
    fontWeight: "bold",
    textShadow: "1px 1px 0px #000",
    color: "var(--text-secondary-color)", // Dynamic secondary text color
  },
  image: {
    // width: "100%",
    height: "400px",
    maxWidth: "800px",
    margin: "20px auto",
    display: "block",
    borderRadius: "8px",
    boxShadow: "0 0 10px 0 #000",
    filter: "contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)",
  },
  image1: {
    width: "100%",
    maxWidth: "800px",
    margin: "20px auto",
    display: "block",
    borderRadius: "8px",
    boxShadow: "0 0 10px 0 #000",
    filter: "contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)",
  },
  source: {
    marginBottom: "40px",
  },
  youtubePlayer: {
    width: "100%",
    maxWidth: "800px",
    margin: "20px auto",
    display: "block",
    borderRadius: "8px",
    height: "450px",
    boxShadow: "0 0 10px 0 #000",
    filter: "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
  },
  podcastContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  podcastWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "10px",
  },
  podcastIndicator: {
    display: "flex",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    marginRight: "15px",
    marginLeft: "15px",
  },
  podcastIcon: {
    fontSize: "36px",
    marginRight: "8px",
  },
  youtubeEmbed: {
    borderRadius: "5px",
    marginLeft: "10px",
    boxShadow: "0 0 10px 0 #000",
    filter: "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
  },
  audioWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "20px",
  },
  iframeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    aspectRatio: "16/9", // Maintain the 16:9 aspect ratio
    position: "relative",
    backgroundColor: "#000", // Optional: black background for the iframe area
    borderRadius: "8px", // Add a rounded corner effect
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Add a subtle shadow for aesthetics
    overflow: "hidden", // Ensures the iframe doesn't overflow its container
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    position: "absolute",
    top: 0,
    left: 0,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap", // Ensures buttons wrap on smaller screens
  },

  episodeButton: {
    padding: "10px 20px",
    backgroundColor: "#e0e0e0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
  },

  playerButtonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap", // Wrap buttons for smaller screens
  },

  playerButton: {
    padding: "10px 20px",
    backgroundColor: "#d6d6d6",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
    cursor: "pointer",
    transition: "all 0.3s",
  },

  activePlayerButton: {
    backgroundColor: "#f44336",
    color: "#fff",
  },
  audioPlayer: {
    width: "100%",
    maxWidth: "600px",
    display: "block",
    margin: "0 auto",
  },
  paginationContainer: { marginTop: "30px", textAlign: "center" },
  pageButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    textShadow: "1px 1px 0px #000",
    fontSize: "20px",
    fontWeight: "bold",
  },
};
