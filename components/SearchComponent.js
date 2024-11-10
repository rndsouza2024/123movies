import { useState, useEffect } from 'react';
import styles from '@styles/SearchComponent.module.css';

import movies from "../public/movies.json"; // Replace with correct path
import tvShows from "../public/tvshow.json"; // Replace with correct path
import adultMovies from "../public/adult.json"; // Replace with correct path

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const itemsPerPage = 30;
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Regular movies excluding adult content
  const regularMovies = movies.filter(
    (movie) => !movie.badge || !movie.badge.includes("[ Adult ]")
  );

  // Handle image click to show popup content
  const handleImageClick = (item) => {
    setPopupContent(item);
  };

  // Close the popup
  const closePopup = () => {
    setPopupContent(null);
  };

  // Check if the content is a TV show
  const isTVShow = popupContent && popupContent.type === "TV";
  const { videomovieitem, videomovies, image1, dailymovies, badge } = popupContent || {};

  // Generate video sources for TV shows and Movies
  const videoSources = videomovies
    ? videomovies.map((item) => {
        const isItemMovies = item.includes("/");
        const [id, itemSeason, itemEpisode] = isItemMovies
          ? item.split("/")
          : [item, null, null];
        return {
          name: isItemMovies ? `Episode ${itemEpisode}` : "Movie",
          urls: [
            `https://short.ink/${videomovieitem[currentEpisodeIndex]}?thumbnail=${image1}`,
            `https://geo.dailymotion.com/player/xjrxe.html?video=${dailymovies}&mute=true&Autoquality=1080p`,
            isItemMovies
              ? `https://vidsrc.me/embed/tv?imdb=${id}&season=${itemSeason}&episode=${itemEpisode}`
              : `https://vidsrc.me/embed/movie?imdb=${id}`,
            `https://embed.su/embed/${isItemMovies ? "tv" : "movie"}/${id}/${itemSeason || ""}/${itemEpisode || ""}`,
            `https://vidsrc.cc/v2/embed/${isItemMovies ? "tv" : "movie"}/${id}/${itemSeason || ""}/${itemEpisode || ""}`
          ],
        };
      })
    : [];

  const currentVideoSources =
    videoSources && videoSources[currentEpisodeIndex]
      ? videoSources[currentEpisodeIndex].urls
      : [];
  const src = currentVideoSources[currentPlayerIndex] || "";

  // Handle player select
  const handlePlayerSelect = (index) => {
    setCurrentPlayerIndex(index);
  };

  // Handle previous episode
  const handlePreviousEpisode = () => {
    setCurrentEpisodeIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  // Handle next episode
  const handleNextEpisode = () => {
    setCurrentEpisodeIndex((prevIndex) => prevIndex + 1);
  };

  // Fetch data from 'moviesfull.json' and filter results based on search query
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const homeRes = await fetch('/moviesfull.json');
        if (!homeRes.ok) {
          throw new Error('Network response was not ok.');
        }
        const homeData = await homeRes.json();
        setResults(homeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter results based on the search query
  const filteredResults = results.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.searchContainer} style={{ marginTop: '55px' }}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      {loading && <p>Loading results...</p>}
      {searchQuery && filteredResults.length > 0 && (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredResults.map(item => (
            <div key={item.id} onClick={() => handleImageClick(item)}>
              <img src={item.image1} alt={item.title} />
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      )}
      
      {popupContent && (
        <div
          className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 9998 }} // Ensure overlay is in front of other elements
        >
          <div
            className="popup-content bg-white rounded-lg p-4 w-full sm:w-3/4 lg:w-2/3 max-w-full relative flex flex-col"
            style={{
              zIndex: 9999,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-3xl font-bold text-black"
              style={{ zIndex: 10000 }}
            >
              &#10005;
            </button>
            <h2 className="text-gray-800 mb-4 text-center flex-grow bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mt-2">
              {popupContent.title}
            </h2>
            <iframe
              src={src}
              width="100%"
              height="auto"
              frameBorder="0"
              allowFullScreen
              className="max-w-full aspect-video mb-4"
              style={{
                aspectRatio: "16 / 9",
                boxShadow: "0 0 10px 0 #000",
                filter: "contrast(1.2) saturate(1.3) brightness(1.1)",
                borderRadius: "1%",
              }}
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {currentVideoSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => handlePlayerSelect(index)}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    currentPlayerIndex === index
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-black"
                  } hover:bg-green-500 hover:text-white transition duration-300`}
                >
                  Player {index + 1}
                </button>
              ))}
            </div>
            {isTVShow && (
              <div className="flex justify-between w-full mt-4 px-4 mb-4">
                <button
                  onClick={handlePreviousEpisode}
                  disabled={currentEpisodeIndex === 0}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <h2 className="text-center flex-grow bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mt-2">
                  Episode Controls
                </h2>
                <button
                  onClick={handleNextEpisode}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
