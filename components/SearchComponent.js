import { useState, useEffect } from 'react';
import styles from '@styles/SearchComponent.module.css';
import movies from "../public/movies.json"; // Replace with correct path

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

  // Generate video sources for Movies
  const videoSources = popupContent?.videomovies
    ? popupContent.videomovies.map((item) => {
        const isItemMovies = item.includes("/"); // Check if it's a movie
        const [id, itemSeason, itemEpisode] = isItemMovies
          ? item.split("/")
          : [item, null, null];
        return {
          name: isItemMovies ? `Episode ${itemEpisode}` : "Movie",
          urls: [
            `https://short.ink/${popupContent.videomovieitem[currentEpisodeIndex]}?thumbnail=${popupContent.image1}`,
            `https://geo.dailymotion.com/player/xjrxe.html?video=${popupContent.dailymovies}&mute=true&Autoquality=1080p`,
            isItemMovies
              ? `https://vidsrc.me/embed/tv?imdb=${id}&season=${itemSeason}&episode=${itemEpisode}`
              : `https://vidsrc.me/embed/movie?imdb=${id}`,
            `https://embed.su/embed/${isItemMovies ? "tv" : "movie"}/${id}/${itemSeason || ""}/${itemEpisode || ""}`,
            `https://vidsrc.cc/v2/embed/${isItemMovies ? "tv" : "movie"}/${id}/${itemSeason || ""}/${itemEpisode || ""}`,
            
            isItemMovies
              ? `https://ffmovies.lol/series/?imdb=${id}`
              : `https://ffmovies.lol/movies/?imdb=${id}`,
            isItemMovies
              ? `https://autoembed.co/tv/imdb/${id}-${itemSeason}-${itemEpisode}`
              : `https://autoembed.co/movie/imdb/${id}`,
            isItemMovies
              ? `https://multiembed.mov/directstream.php?video_id=${id}&s=${itemSeason}&e=${itemEpisode}`
              : `https://multiembed.mov/directstream.php?video_id=${id}`,
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

  // Filter movies based on the search query
  const filteredResults = regularMovies.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.searchContainer} style={{ marginTop: '55px' }}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search for movies..."
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{ zIndex: 9998 }} // Ensure overlay is in front of other elements
        >
          <div
            className="bg-white rounded-lg p-6 w-full sm:w-3/4 lg:w-2/3 max-w-full relative flex flex-col"
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

            {/* Title */}
            <h2 className="text-gray-800 mb-4 text-center flex-grow bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold mt-2">
              {popupContent.title}
            </h2>

            {/* Video iframe */}
            <div className="aspect-w-16 aspect-h-9 w-full mb-4">
              <iframe
                src={src}
                width="100%"
                height="250"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg shadow-md"
                style={{
                  filter: "contrast(1.2) saturate(1.3) brightness(1.1)",
                }}
              />
            </div>

            {/* Player Select Buttons */}
            <div className="flex flex-col items-center mt-4 gap-4">
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {currentVideoSources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => handlePlayerSelect(index)}
                    className={`px-4 py-2 rounded-md font-semibold transition ${
                      currentPlayerIndex === index
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-black"
                    } hover:bg-green-500 hover:text-white`}
                  >
                    Player {index + 1}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 1200px) {
          .movie-list {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 900px) {
          .movie-list {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .movie-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 400px) {
          .movie-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchComponent;
