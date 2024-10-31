import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import SocialSharing from "../../components/SocialSharing";
import Script from "next/script";
// Sample JSON import (this will now be fetched in getStaticProps)
import movies from "../../public/movies.json";


const moviesSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://moviefree.vercel.app/movies/",
      url: "https://moviefree.vercel.app/movies/",
      name: "Movies Section - Moviesfree™",
      isPartOf: { "@id": "https://moviefree.vercel.app/#website" },
      primaryImageOfPage: {
        "@id": "https://moviefree.vercel.app/movies/#primaryimage",
      },
      image: { "@id": "https://moviefree.vercel.app/movies/#primaryimage" },
      thumbnailUrl: "https://moviefree.vercel.app/og_image.jpg",
      breadcrumb: {
        "@id": "https://moviefree.vercel.app/movies/#breadcrumb",
      },
      inLanguage: "en-US",
    },
    {
      "@type": "ImageObject",
      inLanguage: "en-US",
      "@id": "https://moviefree.vercel.app/movies/#primaryimage",
      url: "https://moviefree.vercel.app/og_image.jpg",
      contentUrl: "https://moviefree.vercel.app/og_image.jpg",
      width: 1280,
      height: 720,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://moviefree.vercel.app/movies/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://moviefree.vercel.app/",
        },
        { "@type": "ListItem", position: 2, name: "Movies" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://moviefree.vercel.app/#website",
      url: "https://moviefree.vercel.app/",
      name: "Moviesfree™",
      description: "",
      publisher: { "@id": "https://moviefree.vercel.app/#organization" },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://moviefree.vercel.app/?s={search_term_string}",
          },
          "query-input": {
            "@type": "PropertyValueSpecification",
            valueRequired: true,
            valueName: "search_term_string",
          },
        },
      ],
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": "https://moviefree.vercel.app/#organization",
      name: "Moviesfree™",
      url: "https://moviefree.vercel.app/",
      logo: {
        "@type": "ImageObject",
        inLanguage: "en-US",
        "@id": "https://moviefree.vercel.app/#/schema/logo/image/",
        url: "https://moviefree.vercel.app/logo.png",
        contentUrl: "https://moviefree.vercel.app/logo.png",
        width: 280,
        height: 100,
        caption: "Moviesfree™",
      },
      image: { "@id": "https://moviefree.vercel.app/#/schema/logo/image/" },
    },
  ],
});

const HomePage = ({ categorizedItems }) => {
  const [currentCategory, setCurrentCategory] = useState("movie"); // Current tab
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 24; // 24 items per page

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Get paginated items based on the current page
  const getPaginatedItems = () => {
    const categoryItems = categorizedItems[currentCategory] || []; // Ensure categoryItems is always an array
    const startIndex = (currentPage - 1) * itemsPerPage;
    return categoryItems.slice(startIndex, startIndex + itemsPerPage);
  };

  // Render the items in the grid
  const renderItems = () => {
    const currentItems = getPaginatedItems();

    if (!currentItems.length) {
      return <p>No items available.</p>;
    }
    return currentItems.map((item, index) => (
      <div key={index} className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 ">
        <Link
          href={`/${
            currentCategory === "movie"
              ? "movies"
              : currentCategory === "tvshow"
              ? "tvshow"
              : "adult"
          }/${item.id}`}
        >
          <Image
            src={item.image}
            alt={item.title}
            width={400}
            height={300}
            quality={90}
            title={item.title}
            priority
            className="border-2 border-blue-500 object-cover w-full h-48"
            style={{
              width: "100%",
              height: "auto",
              boxShadow: "0 0 10px 0 #0000FF",
              filter:
                "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
            }}
          />
        </Link>
      </div>
    ));
  };

  const totalPages = Math.ceil(
    categorizedItems[currentCategory]?.length / itemsPerPage
  );

  return (
    <>
      <Head>
        <title>Moviesfree™ - Movies Page.</title>
        <meta
          name="description"
          content="Watch and download movies, TV shows, and adult content online for free. Join the Moviesfree™ community now!"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://moviefree.vercel.app/movies" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          href="https://moviefree.vercel.app/movies"
          hreflang="en-us"
        />
        <meta
          property="og:image"
          content="https://moviefree.vercel.app/og_image.jpg"
        />
          <meta property="og:url" content="https://moviefree.vercel.app/movies" />
          <meta
            name='keywords'
            content='moviefree, movie free 2024, free movie, free tv shows, watch movie online, free movies online, free movie streaming, movie free streaming, download free'
          />
        <meta
          name='description'
          content='Stream HD movies and TV series for free on Moviesfree. Explore, stream, and download full-length movies and shows in HD quality without registration.'
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Moviesfree™ - Explore. Discover. Online."
        />
        <meta
          name="twitter:description"
          content="Stream HD movies and TV series for free on Moviesfree™. Online. Stream. Download. full-length movies and shows in HD quality without registration."
        />
        <meta
          name="twitter:image"
          content="https://moviefree.vercel.app/og_image.jpg"
        />
        <meta name="twitter:label1" content="Est. reading time" />
        <meta name="twitter:data1" content="1 minute" />
        <meta
          name="google-site-verification"
          content="4gdbnCGat0T4Ow3Y_RYzPM4vwtsXvhUel5Q-2yULK6k"
        />
              
      </Head>
      <SocialSharing />
      <Script src="../../../propler/ads.js" defer />
      <Script src="../../../propler/ads2.js" defer />
      <div
        className="container mx-auto mt-3 text-center"
        style={{ marginTop: "50px", textShadow: "1px 1px 0px #000" }}
      >
        <div className="container">
          <div className="content">
            <h1 className="title">Moviesfree™ - Online. Stream. Download.</h1>

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
          </div>
        </div>

        {/* Category Tabs */}
        <ul className="flex justify-around border-b border-gray-300 mb-4 font-bold text-2xl">
          {/* {["movie", "tvshow", "adult"].map((category) => ( */}
            {["movie", ].map((category) => (
            <li key={category} className="flex-1">
              <button
                className={`py-2 ${
                  currentCategory === category
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600"
                } w-full font-bold`}
                onClick={() => setCurrentCategory(category)}
                style={{ marginTop: "50px" }}
              >
                {category.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: moviesSchema }}
        />
     
        {/* Movie Grid */}
        <div className="flex flex-wrap">{renderItems()}</div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 mx-1 border rounded disabled:opacity-100 bg-green-500 text-white hover:bg-green-800"
              style={{ textShadow: "1px 1px 0px #000" }}
            >
              Prev
            </button>

            {/* Font is bold */}
            <span className="px-4">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 mx-1 border rounded disabled:opacity-100 bg-blue-500 text-white hover:bg-blue-800"
              style={{ textShadow: "1px 1px 0px #000" }}
            >
              Next
            </button>
          </div>
        )}
        <style jsx>{`
          .title {
            font-size: 1.25rem;
            font-weight: 900;
            margin-bottom: 1rem;
            text-transform: uppercase;
            text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
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
              font-size: 1rem;
            }
          }

          @media (min-width: 1024px) {
            .title {
              font-size: 1.5rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

// SSG: Get static props at build time
export async function getStaticProps() {
  // Categorize items from the JSON
  // const categorizedItems = { movie: [], tvshow: [], adult: [] };
  const categorizedItems = { movie: [], };
  movies.forEach((item) => {
    if (item.badge && item.badge.includes("[ Movie ]")) {
      categorizedItems.movie.push({ id: item.id, image: item.image });
    } else if (item.badge && item.badge.includes("[ TV Show ]")) {
      categorizedItems.tvshow.push({ id: item.id, image: item.image });
    } else if (item.badge && item.badge.includes("[ Adult ]")) {
      categorizedItems.adult.push({ id: item.id, image: item.image });
    }
  });

  return {
    props: {
      categorizedItems, // Pass the categorized items as props to the component
    },
  };
}

export default HomePage;
