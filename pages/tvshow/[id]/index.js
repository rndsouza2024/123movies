import { useState, useEffect, useRef } from "react"; // Import useState and useRef
import movies from "../../../public/tvshow.json"; // Ensure the correct path for your JSON file
// import styles from "../../../styles/MovieDetail.module.css"; // Import CSS for the MovieDetail component
import AdultSkipAds from "../../../components/AdultSkipAds";
import GoogleTranslate from "../../../components/GoogleTranslate";
import SocialSharing from "../../../components/SocialSharing";
import SearchComponent from "../../../components/SearchComponent";
import VideoPlayerAds from "../../../components/VideoPlayerAds";
import Rating from "../../../components/Rating";
import buttonStyles from "../../../styles/Button.module.css"; // Rename the import for the button styles
import HomeStyles from "@styles/styles.module.css";
import YtPlayer from "../../../components/YtPlayer";
// import Pagination from '../../../components/Pagination'
import moviesStyles from "@styles/styles.module.css";
import styles from "@styles/iframeStyles.module.css";
import Link from "next/link"; // Ensure you import Link from Next.js
import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";

// Fetch data from movies.json
const fetchmoviesData = async () => {
  const response = await fetch("https://moviefree.vercel.app/moviesfull.json");
  return await response.json();
};

const getRandomLinks = (movies, count = 3) => {
  const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

  const getRandomItems = (data, count) => {
    const shuffled = shuffleArray(data);
    return shuffled.slice(0, count);
  };

  return [...getRandomItems(movies, count)];
};

export default function MovieDetail({ movie }) {
  const router = useRouter();
  const [playerReady, setPlayerReady] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [seconds, setSeconds] = useState(30); // Example timer duration
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  // Show a loading state if page is not ready
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const adTagUrl =
    "https://raw.githubusercontent.com/veigasjeff/video-ads/main/vast.xml"; // VAST ad tag URL
  const [randommovies, setRandommovies] = useState([]);

  // Function to fetch data and set state
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://moviefree.vercel.app/moviesfull.json"
      );
      const data = await response.json();

      // Get 6 random TV Series s
      const randommoviesData = getRandomItems(data, 5);
      setRandommovies(randommoviesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchData(); // Initial fetch

    // Set interval to update trailers every 5 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Utility function to get random items from data
  const getRandomItems = (data, count) => {
    const shuffled = shuffleArray([...data]); // Create a copy and shuffle the array
    return shuffled.slice(0, count);
  };

  // Function to shuffle array items randomly
  const shuffleArray = (array) => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const handleDownloadClick = () => {
    setShowTimer(true);
    setSeconds(30); // Example timer duration
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

  const orgSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AtoZ tvshow™",
    url: "https://moviefree.vercel.app/",
    logo: {
      "@type": "ImageObject",
      url: "https://moviefree.vercel.app/logo.png",
      width: 280,
      height: 100,
    },
  });

  const webSiteSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://moviefree.vercel.app/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://moviefree.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AtoZ tvshow™",
        item: "https://moviefree.vercel.app/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: movie.name,
        item: movie.siteurl,
      },
    ],
  });

  const tvshowchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    url: movie.siteurl,
    description: movie.synopsis,
    image: movie.image,
    genre: movie.genre,
    datePublished: movie.datePublished,
    director: {
      "@type": "Person",
      name: movie.directorname,
    },
    actor: movie.starring.map((actor) => ({
      "@type": "Person",
      name: actor,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: movie.ratingValue ? String(movie.ratingValue) : "5.2",
      bestRating: "10",
      worstRating: "0",
      ratingCount: movie.ratingCount > 0 ? String(movie.ratingCount) : "1",
      reviewCount: movie.reviewCount > 0 ? String(movie.reviewCount) : "1",
    },
    potentialAction: {
      "@type": "WatchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: movie.siteurl,
      },
    },
  });

  const videoSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: movie.title,
    description: movie.synopsis,
    uploadDate: movie.datePublished,
    thumbnailUrl: movie.image1,
    duration: movie.duration,
    embedUrl: movie.videourl,
  });

  // Determine if the content is a TV show or adult material
  const isTVShow = movie.type === "TV"; // Update this condition based on your JSON structure
  const isAdult = movie.isAdult === true; // Update this condition based on your JSON structure

  const [iframeAccordionExpanded, setIframeAccordionExpanded] = useState(false);
  const playerRef = useRef(null);
  const currentIndexRef = useRef(0);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  if (!movie) return <div>Loading...</div>;

  const { videomovieitem, videomovies, image1, dailymovies } = movie;

  // Check if videomovies contains episode data
  const isMovies = videomovies[0] && videomovies[0].includes("/");

  // Extract current video data
  const currentVideoId = videomovieitem[currentEpisodeIndex];
  const currentVideoData = videomovies[currentEpisodeIndex] || {}; // Ensure currentEpisodeIndex is within bounds

  // Default to episode 1 and season 1 if not defined
  const episode = isMovies ? currentVideoData.episode || 1 : null;
  const season = isMovies ? currentVideoData.season || 1 : null;

  // Construct video sources based on whether it's a TV show or a movie
  const videoSources = videomovies.map((item) => {
    const isItemMovies = item.includes("/");
    const [id, itemSeason, itemEpisode] = isItemMovies
      ? item.split("/")
      : [item, null, null];

    return {
      name: isItemMovies ? `Episode ${itemEpisode}` : "Movie",
      urls: [
        `https://short.ink/${currentVideoId}?thumbnail=${image1}`,
        isItemMovies
          ? `https://geo.dailymotion.com/player/xjrxe.html?video=${dailymovies}&mute=true&Autoquality=1080p`
          : `https://geo.dailymotion.com/player/xjrxe.html?video=${dailymovies}&mute=true&Autoquality=1080p`,
        isItemMovies
          ? `https://vidsrc.me/embed/tv?imdb=${id}&season=${itemSeason}&episode=${itemEpisode}`
          : `https://vidsrc.me/embed/movie?imdb=${id}`,
        isItemMovies
          ? `https://embed.su/embed/tv/${id}/${itemSeason}/${itemEpisode}`
          : `https://embed.su/embed/movie/${id}`,
        isItemMovies
          ? `https://ffmovies.lol/series/?imdb=${id}/${itemSeason}/${itemEpisode}`
          : `https://ffmovies.lol/movies/?imdb=${id}`,
        isItemMovies
          ? `https://autoembed.co/tv/imdb/${id}-${itemSeason}-${itemEpisode}`
          : `https://autoembed.co/movie/imdb/${id}`,
        isItemMovies
          ? `https://multiembed.mov/directstream.php?video_id=${id}&s=${itemSeason}&e=${itemEpisode}`
          : `https://multiembed.mov/directstream.php?video_id=${id}`,
        isItemMovies
          ? `https://www.2embed.cc/embed/${id}`
          : `https://www.2embed.cc/embedtvfull/${id}`,
      ],
    };
  });

  const handleNextEpisode = () => {
    setCurrentEpisodeIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % videoSources.length;
      console.log("Next Episode Index:", nextIndex);
      return nextIndex;
    });
  };

  const handlePreviousEpisode = () => {
    setCurrentEpisodeIndex((prevIndex) => {
      const newIndex =
        (prevIndex - 1 + videoSources.length) % videoSources.length;
      console.log("Previous Episode Index:", newIndex);
      return newIndex;
    });
  };

  const handlePlayerSelect = (index) => {
    setCurrentPlayerIndex(index);
  };

  // Ensure currentVideoSources is always valid
  const currentVideoSources = videoSources[currentEpisodeIndex]?.urls || [];
  const src = currentVideoSources[currentPlayerIndex] || ""; // Default to an empty string if not available

  const prevEpisodeNumber = episode - 1 < 1 ? videoSources.length : episode - 1;
  const nextEpisodeNumber = (episode % videoSources.length) + 1;

  // const toggleIframeAccordion = () => {
  //   setIframeAccordionExpanded((prev) => !prev);
  // };

  // // State to manage the visibility of additional download links
  // const [showAdditionalLinks, setShowAdditionalLinks] = useState(false);

  // // Function to toggle additional download links
  // const handleToggleLinks = () => {
  //   setShowAdditionalLinks((prev) => !prev);
  // };

  useEffect(() => {
    let timer;
    if (showTimer && seconds > 0) {
      timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showTimer, seconds]);

  useEffect(() => {
    let timer;
    if (showTimer && accordionExpanded && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showTimer, accordionExpanded, seconds]);

  const toggleAccordion = () => {
    setAccordionExpanded((prevState) => !prevState);
    if (!accordionExpanded) {
      setSeconds(30); // Reset the timer when accordion is expanded
    }
  };

  const handleStartTimer = () => {
    setShowTimer(true);
    setAccordionExpanded(true);
  };

  return (
    <div>
      <Head>
        <title>{movie.title}</title>
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={movie.synopsis} />
        <link rel="canonical" href={movie.siteurl} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.synopsis} />
        <meta property="og:image" content={movie.image1} />
        <meta name="keywords" content={movie.keywords} />
        {/* <meta
          name="keywords"
           content="moviefree, movie free 2024, free movie, free tv shows, watch movie online, free movies online, free movie streaming, movie free streaming, download free"
        /> */}
        <meta
          name="keywords"
          content="moviefree, movies, watch movie online, free movies, free movies online, free movie streaming, moviefree movies free streaming, download free"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="MoviesFree™ - Explore. Discover. Online."
        />
        <meta
          property="og:description"
          content="Watch free movies and TV shows online—explore top titles, discover new releases, and start streaming now!"
        />
        <meta
          name="twitter:description"
          content="Stream HD movies and TV series for free on MoviesFree™. Online. Stream. Download. full-length movies and shows in HD quality without registration."
        />
        <meta name="twitter:image" content={`${movie.image1}`} />
        <meta name="twitter:label1" content="Est. reading time" />
        <meta name="twitter:data1" content="1 minute" />
        <meta
          name="google-site-verification"
          content="4gdbnCGat0T4Ow3Y_RYzPM4vwtsXvhUel5Q-2yULK6k"
        />
        <meta property="og:type" content="video.tv_show" />
        <meta property="fb:app_id" content="141280979243998" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: orgSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: webSiteSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbSchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: tvshowchema }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: videoSchema }}
        />
      </Head>
      <SocialSharing />
      {isAdult && <AdultSkipAds movie={movie} />}
      {/* <Script src="../../../propler/ads.js" defer /> */}
      <Script src="../../../propler/ads2.js" defer />
      <a
        href="https://t.me/watchmovietvshow/"
        target="_blank"
        rel="noopener noreferrer"
        className="telegram-link"
        style={{
          display: "block",
          textAlign: "center",
          margin: "0 auto",
          marginTop: "20px",
        }}
      >
        <p
          style={{ display: "inline-block" }}
          className=" title text-2xl font-bold"
        >
          For Request or Demand <br />
          Movies & TV Series Join Telegram
          <i
            className="fab fa-telegram telegram-icon"
            style={{ marginLeft: "8px" }}
          ></i>
        </p>
      </a>
      {/* <div
        className={`w-full`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          textAlign: 'center',
          // backgroundColor: '#D3D3D3'
          // backgroundColor: '#000'
        }}
      >
        <GoogleTranslate />
      </div> */}
      <span className="px-0 bg-clip-text text-sm text-black font-bold mt-2">
        <SearchComponent />
      </span>
      {/* <div className={buttonStyles.buttonContainer}>
        <button
          onClick={() => router.push("/home")} // Navigates to the home page
          className={buttonStyles.downloadButton}
        >
          Home Page
        </button>
      </div> */}
      {/* <div className='flex flex-col items-center justify-center'> */}
      <div
        // className={`w-full`}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // minHeight: "100vh",
          padding: "20px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          textAlign: "center",
          // backgroundColor: '#D3D3D3'
          // backgroundColor: '#000'
        }}
      >
        {!isTVShow && !isAdult && (
          <>
            <h2 className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl hover:text-blue-800 font-bold mt-2">
              {movie.title} Online - Stream Your Favorite TV Series
            </h2>
            <p className="text-lg text-yellow-500 mt-4">
              Explore the captivating world of <strong>{movie.title}</strong>,
              the TV series that has everyone talking. At
              <strong> MoviesFree™</strong>, you can stream{" "}
              <strong>{movie.title}</strong> and immerse yourself in its
              exciting episodes, whether you're catching up on past seasons or
              tuning in to the latest releases. Our platform offers a seamless
              streaming experience, making it easy to watch your favorite TV
              series online.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              Streaming <strong>{movie.title}</strong> on{" "}
              <strong>MoviesFree™</strong> ensures that you won't miss a single
              moment of the action, drama, or comedy that makes this TV series a
              must-watch. With high-quality streaming and user-friendly
              navigation, <strong>MoviesFree™</strong> provides everything you
              need to enjoy <strong>{movie.title}</strong>
              and other top TV series. Our library is frequently updated, so you
              can always find the latest episodes as soon as they air.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              Whether you're binge-watching or following along weekly,{" "}
              <strong>{movie.title}</strong> on <strong>MoviesFree™</strong> is
              your go-to destination for streaming TV series online. Join our
              community of viewers and start watching{" "}
              <strong>{movie.title}</strong> today. With{" "}
              <strong>MoviesFree™</strong>, your favorite TV series is just a
              click away.
            </p>
          </>
        )}

        {/* Adult Content Description */}
        {isAdult && (
          <>
            <h2 className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl hover:text-blue-800 font-bold mt-2">
              {movie.title} Online - Stream Premium Adult Content
            </h2>
            <p className="text-lg text-yellow-500 mt-4">
              Indulge in the finest selection of adult entertainment with{" "}
              <strong>{movie.title}</strong>. At <strong>MoviesFree™</strong>,
              we offer a vast library of premium adult content, including the
              latest and most popular titles like <strong>{movie.title}</strong>
              . Our platform is designed for those who seek high-quality,
              discreet streaming of adult films, ensuring a seamless and private
              viewing experience.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              Streaming <strong>{movie.title}</strong> on{" "}
              <strong>MoviesFree™</strong> provides you with a user-friendly
              interface and crystal-clear video quality. Our adult content is
              regularly updated, giving you access to new releases as soon as
              they become available. Whether you're exploring new genres or
              returning to your favorites, <strong>{movie.title}</strong>
              and other top titles are available at your fingertips.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              For a premium experience in adult entertainment, look no further
              than <strong>{movie.title}</strong> on{" "}
              <strong>MoviesFree™</strong>. Our platform ensures your privacy
              and security while you enjoy the content you love. Start streaming{" "}
              <strong>{movie.title}</strong> today and discover why{" "}
              <strong>MoviesFree™</strong> is the trusted choice for adult
              content.
            </p>
          </>
        )}

        {/* Movie Description (Default) */}
        {isTVShow && (
          <>
            <h2 className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl  font-bold mt-2">
              {movie.title} Online and Experience Top-Tier Streaming
            </h2>
            <p className="text-lg text-yellow-500 mt-4">
              Dive into the world of cinema with <strong>{movie.title}</strong>,
              available to stream right here. At <strong>MoviesFree™</strong>,
              we bring you the best in entertainment, offering an extensive
              library of movies and TV shows, including the latest blockbusters
              like <strong>{movie.title}</strong>. Whether you're a fan of
              action, drama, comedy, or any other genre, you'll find exactly
              what you're looking for.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              Streaming <strong>{movie.title}</strong> on{" "}
              <strong>MoviesFree™</strong> guarantees a seamless viewing
              experience with high-definition quality and uninterrupted
              playback. Our platform is designed to make it easy for you to
              discover and enjoy your favorite films. With regularly updated
              content, you???ll always have access to the newest releases,
              ensuring you can watch <strong>{movie.title}</strong> and other
              top titles as soon as they're available.
            </p>
            <p className="text-lg text-yellow-500 mt-4">
              Whether you're revisiting a classic or catching a new release,{" "}
              <strong>{movie.title}</strong> on <strong>MoviesFree™</strong> is
              the perfect way to enjoy your movie night. Join the countless
              users who trust us for their streaming needs and start watching{" "}
              <strong>{movie.title}</strong> online today. At{" "}
              <strong>MoviesFree™</strong>, your entertainment is just a click
              away.
            </p>
          </>
        )}
      </div>
      <div
        className="shadow-lg flex items-center justify-center"
        role="navigation"
      >
        <ul
          id="menu-header-menu"
          className="menu flex flex-wrap justify-center"
        >
          <button className="border border-orange-600 p-2 m-1 hover:bg-orange-100 rounded  w-36 h-14">
            <li id="menu-item-248" className="menu-operating-systems">
              <a
                href="../home/"
                className="text-black hover:px-0 text-bg font-black bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl"
              >
                Home<span className="p"></span>
              </a>
            </li>
          </button>
          <button className="border border-orange-600 p-2 m-1 hover:bg-orange-100 rounded  w-36 h-14">
            <li id="menu-item-248" className="menu-operating-systems">
              <a
                href="../movies/"
                className="text-black hover:px-0 text-bg font-black bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl"
              >
                Movies<span className="p"></span>
              </a>
            </li>
          </button>
          <button className="border border-orange-600 p-2 m-1 hover:bg-orange-100 rounded  w-36 h-14">
            <li id="menu-item-11605" className="menu-3dcad">
              <a
                href="../tvshow/"
                className="text-black hover:px-0 text-bg font-black bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl"
              >
                Tv Show<span className="p"></span>
              </a>
            </li>
          </button>
          <button className="border border-orange-600 p-2 m-1 hover:bg-orange-100 rounded  w-36 h-14">
            <li id="menu-item-11610" className="menu-graphicdesign">
              <a
                href="../adult/"
                className="text-black hover:px-0 text-bg font-black bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl"
              >
                Adult<span className="p"></span>
              </a>
            </li>
          </button>
        </ul>
      </div>

      <div className="flex-container">
        <div className="category-container">
          <Image
            src={movie.image}
            alt={movie.title}
            width={300}
            height={300}
            quality={90}
            loading="lazy"
            style={{
              width: "400px", // Ensures the image is displayed at this width
              height: "500px", // Ensures the image is displayed at this height
              objectFit: "cover",
              margin: "auto",
              marginTop: "50px",
              marginBottom: "20px",
              borderRadius: "50px",
              boxShadow: "0 0 10px 0 #000",
              filter:
                "contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)",
            }}
          />
          <div
            style={{ maxWidth: "800px", width: "100%", marginBottom: "20px" }}
          >
            <div className="flex flex-col items-center justify-center">
              <h1
                className="text-black bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-2xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "bold",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                {movie.title}
              </h1>
            </div>

            <div className="movie-info">
              <div className={styles.centeredDetails}>
                {/* <div className='flex flex-col items-center justify-center'> */}
                <div
                  // className={`w-full`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    textAlign: "center",
                    // backgroundColor: '#D3D3D3'
                    // backgroundColor: '#000'
                  }}
                >
                  <p className={styles.year}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      Released Date: {movie.year}
                    </strong>
                  </p>
                  <p className={styles.rating}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      IDBM Rating: {movie.rating}{" "}
                    </strong>
                  </p>
                  <p className={styles.genre}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Genre: {movie.genre}
                    </strong>
                  </p>
                  <p className={styles.Originalnetwork}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Original Network: {movie.Originalnetwork}
                    </strong>
                  </p>
                  <p className={styles.directorname}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Director: {movie.directorname}
                    </strong>
                  </p>
                  <p className={styles.starring}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Starring: {movie.starring}
                    </strong>
                  </p>
                  <p className={styles.country}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Country: {movie.country}
                    </strong>
                  </p>
                  <p className={styles.language}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Language: {movie.language}
                    </strong>
                  </p>
                  <p className={styles.avgTime}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Duration: {movie.avgTime}
                    </strong>
                  </p>
                  <p className={styles.synopsis}>
                    <strong className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-bg font-semibold mt-2">
                      {" "}
                      Synopsis: {movie.synopsis}{" "}
                    </strong>
                  </p>
                </div>
              </div>

              <div className={`${moviesStyles.imageGrid} mt-5`}>
                <img
                  className={`${moviesStyles.image} img-fluid lazyload `}
                  src={movie.directorimg}
                  alt={movie.directorname}
                  title={movie.directorname}
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
                  className={`${moviesStyles.image} img-fluid lazyload`}
                  src={movie.actor1img}
                  alt={movie.actor1}
                  title={movie.actor1}
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
                  className={`${moviesStyles.image} img-fluid lazyload`}
                  src={movie.actor2img}
                  alt={movie.actor2}
                  title={movie.actor2}
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
                  className={`${moviesStyles.image} img-fluid lazyload`}
                  src={movie.actor3img}
                  alt={movie.actor3}
                  title={movie.actor3}
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
                  className={`${moviesStyles.image} img-fluid lazyload`}
                  src={movie.actor4img}
                  alt={movie.actor4}
                  title={movie.actor4}
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
                  className={`${moviesStyles.image} img-fluid lazyload`}
                  src={movie.actor5img}
                  alt={movie.actor5}
                  title={movie.actor5}
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
              <div className="flex flex-col items-center justify-center relative z-10 mt-4 space-y-4 ">
                <h2
                  className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Official Trailer {movie.name}
                </h2>
              </div>
              {/* Container for the iframe */}
              <div
                className={styles.iframeContainer}
                style={{ margin: 0, padding: 0 }}
              >
                {movie?.ytsource ? (
                  <YtPlayer ytsource={movie.ytsource} />
                ) : movie.traileritem && movie.traileritem.length > 0 ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "0",
                      paddingBottom: "56.25%",
                    }}
                  >
                    <iframe
                      className={styles.iframe}
                      frameBorder="0"
                      src={`https://geo.dailymotion.com/player/xjrxe.html?video=${movie.traileritem[0]}&mute=true&Autoquality=1080p`}
                      allowFullScreen
                      title="Dailymotion Video Player"
                      allow="autoplay; encrypted-media"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50px",
                        boxShadow: "0 0 10px 0 #fff",
                        filter:
                          "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
                      }}
                    ></iframe>
                  </div>
                ) : (
                  <p>No trailer available for this movie.</p>
                )}
              </div>

              <div className="flex flex-col items-center justify-center relative z-10 mt-4 space-y-4 ">
                <h2
                  className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "15px",
                  }}
                >
                  {movie.title}
                </h2>
              </div>
              <div
                className={styles.videoPlayerContainer}
                style={{ marginTop: "15px" }}
              >
                {/* Video Player */}
                {/* Ad Overlay */}
                <VideoPlayerAds adTagUrl={adTagUrl} />

                <div className="flex flex-col items-center justify-center relative z-10 mt-4 space-y-4 ">
                  <button
                    onClick={handleNextEpisode}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    style={{
                      textShadow: "1px 1px 0px #000",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      marginBottom: "10px",
                    }}
                  >
                    Next Episode
                  </button>
                </div>
                {src ? (
                           <iframe
                           ref={playerRef}
                           src={src}
                           adTagUrl={adTagUrl}
                           width="100%"
                           height="600px"
                           allowFullScreen
                           allow="fullscreen; picture-in-picture"
                           webkitAllowFullScreen={true}
                           mozAllowFullScreen={true}
                           // style={{
                           //   borderRadius: "15px",
                           //   filter:
                           //     "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
                           // }}
                           style={{
                             margin: "auto",
                             backgroundColor: "black", 
                             borderRadius: "15px",
                             boxShadow: "0 0 10px 0 #fff",
                             filter:
                               "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
                             // width: "100%", // Adjust the width as needed
                             // height: "100%", // Adjust the height as needed
                           }}
                         />
                ) : (
                  <p>Loading video...</p>
                )}
              </div>
              {/* <div className={styles.container}>
                  <div className={styles.iframeContainer}>
                    <iframe
                      className={styles.iframe}
                      src={src}
                      allowFullScreen
                      scrolling='no'
                      title='Video Player'
                    ></iframe>
                  </div>
                </div> */}

              <div className="flex flex-col items-center justify-center relative z-10 mt-4 space-y-4 ">
                <button
                  onClick={handlePreviousEpisode}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  style={{
                    textShadow: "1px 1px 0px #000",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Previous Episode
                </button>
              </div>
              <div className="flex flex-col items-center mt-4 gap-2">
                <div className="flex flex-wrap justify-center mb-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text hover:text-blue-800 text-bg font-semibold mt-2">
                  {currentVideoSources.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => handlePlayerSelect(index)}
                      className={`mx-2 my-1 px-4 py-2 rounded ${
                        currentPlayerIndex === index
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-black"
                      } hover:bg-green-500 hover:text-white transition duration-300 ease-in-out`}
                      style={{
                        border: "none",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "10px 20px",
                        margin: "5px",
                        textShadow: "1px 1px 0px #000",
                      }}
                    >
                      Player {index + 1}
                    </button>
                  ))}
                </div>
                {/* </div> */}
                {/* Previous Episode Button - Display only if it's a TV show */}

                <div className="flex flex-col items-center justify-center">
                  {/* Render the button for Season 2 if linkurl exists */}
                  {movie.linkurl && (
                    <Link href={movie.linkurl}>
                      <div
                        className={`px-4 py-2 border rounded mx-2 my-1 ${
                          movie.linkurl
                            ? "bg-red-500 text-white"
                            : "bg-gray-200"
                        } hover:bg-green-700 hover:text-white`}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          marginTop: "20px",
                          textShadow: "1px 1px 0px #000",
                          filter:
                            "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(15deg)",
                        }}
                      >
                        Click to Watch Next Season
                      </div>
                    </Link>
                  )}

                  {/* Render the button for Season 1 if linkurl2 exists */}
                  {movie.linkurl2 && (
                    <Link href={movie.linkurl2}>
                      <div
                        className={`px-4 py-2 border rounded mx-2 my-1 ${
                          movie.linkurl2
                            ? "bg-red-500 text-white"
                            : "bg-gray-200"
                        } hover:bg-green-700 hover:text-white`}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          marginTop: "20px",
                          textShadow: "1px 1px 0px #000",
                          filter:
                            "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(15deg)",
                        }}
                      >
                        Click to Watch Previous Season
                      </div>
                    </Link>
                  )}
                </div>
              </div>
              <div className={styles.container}>
                <h2
                  className="px-0 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl hover:text-blue-800 font-bold mt-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Click to Download {movie.name}
                </h2>

                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    marginTop: "50px",
                    marginBottom: "50px",
                  }}
                >
                  {!showTimer ? (
                    <button
                      onClick={handleStartTimer}
                      className="animate-pulse bg-gradient-to-r from-amber-500 to-pink-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-2xl"
                    >
                      Download Now
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={toggleAccordion}
                        className="animate-pulse bg-gradient-to-r from-pink-500 to-amber-500 font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300 text-2xl"
                        style={{
                          marginBottom: "20px",
                        }}
                      >
                        {accordionExpanded
                          ? "Click to Stop Download"
                          : "Download Now"}
                      </button>

                      {accordionExpanded && (
                        <>
                          {seconds > 0 ? (
                            <p
                              className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mb-4"
                              style={{ marginTop: "50px" }}
                            >
                              Your download link will be ready in {seconds}{" "}
                              seconds...
                            </p>
                          ) : (
                            <p
                              className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mb-4"
                              style={{ marginTop: "50px" }}
                            >
                              Your download links are ready.
                            </p>
                          )}

                          {seconds === 0 && (
                            <div>
                              {Object.keys(movie)
                                .filter((key) => key.startsWith("downloadlink"))
                                .map((key, index) => (
                                  <Link
                                    key={index}
                                    href={movie[key]}
                                    target="_blank"
                                  >
                                    <div
                                      className="bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-amber-600 hover:to-pink-600 transition duration-300"
                                      style={{
                                        margin: "auto",
                                        marginBottom: "50px",
                                        marginTop: "50px",
                                        borderRadius: "50px",
                                        boxShadow: "0 0 10px 0 #fff",
                                        filter:
                                          "contrast(1.1) saturate(1.2) brightness(1.3) hue-rotate(0deg)",
                                      }}
                                    >
                                      <span
                                        className="animate-pulse"
                                        style={{
                                          color:
                                            key === "downloadlink1"
                                              ? "#FF0000"
                                              : "#0efa06",
                                          fontSize: "24px",
                                          textShadow: "3px 5px 5px #000",
                                        }}
                                      >
                                        <i
                                          className={
                                            key === "downloadlink1"
                                              ? "fa fa-magnet"
                                              : "fa fa-download"
                                          }
                                          aria-hidden="true"
                                        ></i>{" "}
                                      </span>
                                      Download {index + 1}
                                    </div>
                                  </Link>
                                ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <h2
            className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-3xl font-bold mt-2"
            style={{
              marginTop: "15px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            MOST LATEST UPLOADED
          </h2>
          <div className="categorylatest-container">
            <div className="cardlatest-container">
              {randommovies.map((movies) => (
                <div key={movies.id} className="cardlatest">
                  <a href={movies.siteurl} id={movies.id}>
                    <div className="relative">
                      <img
                        src={movies.image}
                        alt={movies.title}
                        className="rounded-lg mx-auto"
                        width={1280}
                        height={720}
                        quality={90}
                        loading="lazy"
                        style={{
                          marginTop: "10px",
                          width: "1280px", // Ensures the image is displayed at this width
                          height: "350px", // Ensures the image is displayed at this height
                          boxShadow: "0 0 10px 0 #000",
                          filter:
                            "contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)",
                        }}
                      />
                    </div>
                  </a>
                  <h2
                    className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-xl font-semibold mt-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {movies.name}
                  </h2>
                  {/* <h3 className='bg-gradient-to-r from-pink-700 to-blue-700 bg-clip-text text-transparent text-bg font-semibold mt-2'>
                          {movies.text}
                        </h3> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .section-title {
          color: #000;
          font-weight: bold;
          font-size: 30px;
          text-shadow: 3px 5px 5px #000;
          margin-bottom: 20px;
        }

        .flex-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .category-container {
          flex-grow: 1; /* Take remaining space */
          margin-top: 40px;
          width: calc(50% - 10px); /* Adjust width to leave space between */
        }
        .categorylatest-container {
          flex-grow: 1; /* Take remaining space */
          margin-top: 40px;
          width: calc(100% - 0px); /* Adjust width to leave space between */
        }

        .card-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        .cardlatest-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .card {
          width: 100%; /* Card width will automatically adapt */
          max-width: 100%; /* Limit max width for larger screens */
          // border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
        }
        .cardlatest {
          width: 100%; /* Card width will automatically adapt */
          max-width: 100%; /* Limit max width for larger screens */
          // border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
        }

        .relative {
          position: relative;
        }

        .badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.4);
          color: #000;
          padding: 5px;
          border-radius: 5px;
          font-weight: bold;
        }

        .card img {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 8px;
        }

        .text-center {
          text-align: center;
        }

        // h1 {
        //   // color: #fff;
        //   font-weight: bold;
        //   // text-shadow: 3px 5px 5px #000;
        //   margin-bottom: 10px;
        //   font-size: 30px; /* Corrected property */
        //   line-height: 1; /* Optional: Adjust line height if needed */
        //   height: 30px; /* Set the desired height */
        // }

        .sidebar {
          width: calc(40% - 10px); /* Adjust width to leave space between */
          padding: 20px;
          // border: 1px solid #ccc;
          border-radius: 8px;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .flex-container {
            flex-direction: column; /* Stack items vertically on smaller screens */
          }

          .category-container,
          .sidebar {
            width: 100%; /* Make both full width on smaller screens */
          }

          .sidebar {
            margin-top: 20px;
          }
        }
        .telegram-link {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          background-clip: text;
          color: transparent;
          margin-top: 25px;
        }

        .telegram-icon {
          color: #0088cc;
          margin-left: 10px;
          font-size: 2rem;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (min-width: 768px) {
          .title {
            font-size: 2rem;
          }

          .highlight {
            font-size: 2rem;
          }

          .telegram-link {
            font-size: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .title {
            font-size: 2.5rem;
          }

          .highlight {
            font-size: 2.5rem;
          }

          .telegram-link {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "public", "tvshow.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const movies = JSON.parse(fileContents);

  const paths = movies.map((movie) => ({
    params: { id: movie.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking", // or "true" if you want to handle some paths at request time
  };
}

// export async function getStaticProps({ params }) {
//   const filePath = path.join(process.cwd(), "public", "adult.json");
//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const movies = JSON.parse(fileContents);

//   const movie = movies.find((movie) => movie.id === params.id);

//   if (!movie || !movie.ytsource) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       movie,
//       adTagUrl:
//         "https://raw.githubusercontent.com/veigasjeff/video-ads/main/vast.xml",
//     },
//   };
// }

// The component code will use the movie prop safely here.

// Use getStaticProps to fetch movie data at build time
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "public", "tvshow.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const movies = JSON.parse(fileContents);

  const movie = movies.find((movie) => movie.id === params.id);
  const adTagUrl =
    "https://raw.githubusercontent.com/veigasjeff/video-ads/main/vast.xml"; // VAST ad tag URL

  if (!movie) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      movie,
      adTagUrl, // Pass the ad tag URL
    },
  };
}

// Use getStaticPaths to generate static pages
// export async function getStaticPaths() {
//   const filePath = path.join(process.cwd(), "public", "tvshow.json");
//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const movies = JSON.parse(fileContents);

//   const paths = movies.map((movie) => ({
//     params: { id: movie.id },
//   }));

//   return { paths, fallback: true };
// }

// // Use getStaticProps to fetch movie data at build time
// export async function getStaticProps({ params }) {
//   const filePath = path.join(process.cwd(), "public", "tvshow.json");
//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const movies = JSON.parse(fileContents);

//   const movie = movies.find((movie) => movie.id === params.id);
//   const adTagUrl =
//     "https://raw.githubusercontent.com/veigasjeff/video-ads/main/vast.xml"; // VAST ad tag URL

//   if (!movie) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: {
//       movie,
//       adTagUrl, // Pass the ad tag URL
//     },
//   };
// }
