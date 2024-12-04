
import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs/promises";
import Link from "next/link";
import Head from "next/head";
import Image from 'next/image';
import SocialSharing from "../components/SocialSharing";

import mainStyles from "@styles/styles.module.css";
// Helper function to create a slug from a title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
}


export async function getStaticProps() {
  const categories = [
    "movies",
    "tvshow",
    "hindiDubbed",
    "adult",
 
  ];
  const allData = {};

  try {
    for (const category of categories) {
      const filePath = path.join(process.cwd(), "public", `${category}.json`);
      const jsonData = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(jsonData);

      allData[category] = Array.isArray(parsedData) ? parsedData.slice(0, 5) : [];
    }
  } catch (error) {
    console.error(`Error loading data for category ${category}:`, error);
  }

  return {
    props: {
      allData,
    },
  };
}

const uwatchfreeSchema = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MoviesFree™ - Online. Stream. Download. ',
    url: 'https://moviefree.vercel.app/',
    image: ['https://moviefree.vercel.app/favicon.ico'],
    logo: {
      '@type': 'ImageObject',
      url: 'https://moviefree.vercel.app/logo.png',
      width: 280,
      height: 80
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://moviefree.vercel.app/',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://moviefree.vercel.app/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
])

const rankMathSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://gravatar.com/drtrailer2022',
      name: 'Dr Trailer',
      url: 'https://gravatar.com/drtrailer2022',
      image: {
        '@type': 'ImageObject',
        '@id': 'https://gravatar.com/drtrailer2022',
        url: 'https://gravatar.com/drtrailer2022',
        caption: 'Dr Trailer',
        inLanguage: 'en-US'
      }
    },
    {
      '@type': 'Organization',
      '@id': 'https://moviefree.vercel.app/#organization',
      name: 'MoviesFree™ - Online. Stream. Download. ',
      url: 'https://moviefree.vercel.app'
    },
    {
      '@type': 'WebSite',
      '@id': 'https://moviefree.vercel.app/#website',
      url: 'https://moviefree.vercel.app',
      name: 'MoviesFree™ - Online. Stream. Download. ',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://moviefree.vercel.app/#organization'
      },
   
    },
    {
      '@type': 'WebPage',
      '@id': 'https://moviefree.vercel.app/#webpage',
      url: 'https://moviefree.vercel.app/',
      name: 'Movie',
      datePublished: '2024-01-13T13:00:00+00:00',
      dateModified: '2024-01-13T13:13:00+00:00',
      about: {
        '@type': 'Person',
        '@id': 'https://gravatar.com/drtrailer2022',
        name: 'Dr Trailer',
        url: 'https://gravatar.com/drtrailer2022',
        image: {
          '@type': 'ImageObject',
          '@id': 'https://gravatar.com/drtrailer2022',
          url: 'https://gravatar.com/drtrailer2022',
          caption: 'Dr Trailer',
          inLanguage: 'en-US'
        }
      },
      isPartOf: {
        '@id': 'https://moviefree.vercel.app/#website'
      },
      inLanguage: 'en-US',
      mainEntity: [
        {
          '@type': 'Article',
          '@id': 'https://moviefree.vercel.app/',
          url: 'https://moviefree.vercel.app/',
          headline: 'MoviesFree™ - Online. Stream. Download. ',
          datePublished: '2024-01-13T13:00:00+00:00',
          dateModified: '2024-01-13T13:13:00+00:00',
          author: {
            '@type': 'Person',
            '@id': 'https://gravatar.com/drtrailer2022',
            name: 'Dr Trailer',
            url: 'https://gravatar.com/drtrailer2022',
            image: {
              '@type': 'ImageObject',
              '@id': 'https://gravatar.com/drtrailer2022',
              url: 'https://gravatar.com/drtrailer2022',
              caption: 'Dr Trailer',
              inLanguage: 'en-US'
            }
          },
          publisher: {
            '@type': 'Organization',
            '@id': 'https://moviefree.vercel.app/#organization',
            name: 'MoviesFree™ - Online. Stream. Download. ',
            url: 'https://moviefree.vercel.app'
          }
        },
        {
          '@type': 'Article',
          '@id': 'https://moviefree.vercel.app/',
          url: 'https://moviefree.vercel.app/',
          headline: 'MoviesFree™ - Online. Stream. Download. ',
          datePublished: '2024-01-13T13:00:00+00:00',
          dateModified: '2024-01-13T13:13:00+00:00',
          author: {
            '@type': 'Person',
            '@id': 'https://gravatar.com/drtrailer2022',
            name: 'Dr Trailer',
            url: 'https://gravatar.com/drtrailer2022',
            image: {
              '@type': 'ImageObject',
              '@id': 'https://gravatar.com/drtrailer2022',
              url: 'https://gravatar.com/drtrailer2022',
              caption: 'Dr Trailer',
              inLanguage: 'en-US'
            }
          },
          publisher: {
            '@type': 'Organization',
            '@id': 'https://moviefree.vercel.app/#organization',
            name: 'MoviesFree™ - Online. Stream. Download. ',
            url: 'https://moviefree.vercel.app'
          }
        },
        {
          '@type': 'Article',
          '@id': 'https://moviefree.vercel.app/',
          url: 'https://moviefree.vercel.app/',
          headline: 'MoviesFree™ - Online. Stream. Download. ',
          datePublished: '2024-01-13T13:00:00+00:00',
          dateModified: '2024-01-13T13:13:00+00:00',
          author: {
            '@type': 'Person',
            '@id': 'https://gravatar.com/drtrailer2022',
            name: 'Dr Trailer',
            url: 'https://gravatar.com/drtrailer2022',
            image: {
              '@type': 'ImageObject',
              '@id': 'https://gravatar.com/drtrailer2022',
              url: 'https://gravatar.com/drtrailer2022',
              caption: 'Dr Trailer',
              inLanguage: 'en-US'
            }
          }
        }
      ]
    }
  ]
})

export default function HomePage({ allData }) {
 

  
  return (
    <>
    <Head>
    <title> MoviesFree™ - Online. Stream. Download.</title>

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
    <meta name="keywords" content="moviefree, movies, watch movie online, free movies, free movies online, free movie streaming, moviefree movies free streaming, download free" />
    <meta
      property="og:description"
      content="Stream HD movies and TV series for free on MoviesFree™. Explore, stream, and download full-length movies and shows in HD quality without registration."
    />
    <meta
      name="description"
      content="Stream HD movies and TV series for free on MoviesFree™. Explore, stream, and download full-length movies and shows in HD quality without registration."
    />
    <link rel="canonical" href="https://moviefree.vercel.app/" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta
      property="og:title"
      content=" MoviesFree™ - Online. Stream. Download. "
    />
    <meta property="og:url" content="https://moviefree.vercel.app" />
    <meta
      property="og:site_name"
      content=" MoviesFree™ - Online. Stream. Download. "
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
      content=" MoviesFree™ - Online. Stream. Download. "
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
      content=" MoviesFree™ - Online. Stream. Download."
    />
    <meta
      name="twitter:description"
      content="Stream HD movies and TV series for free on MoviesFree™. Explore, stream, and download full-length movies and shows in HD quality without registration."
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
    dangerouslySetInnerHTML={{ __html: uwatchfreeSchema }}
  />  
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: rankMathSchema }}
  />
  </Head>
  <SocialSharing />
    <div style={styles.container}>
    <header style={styles.hero}>
  <div style={styles.heroImageContainer}>
  <div style={styles.heroImageContainer}>
    <Image
        src="/og_image.jpg"
        alt="Hero Background"
        // layout="fill"
        objectFit="cover"
        priority // Prioritize loading this image
        width={1200} // Adjust the width according to your needs
        height={750} // Adjust the height according to your needs
        quality={90}
        style={{
          // height: "200px",
          // width: "100%",
          // objectFit: "cover",
         
          filter:
          "contrast(1.2) saturate(1.3) brightness(1.1) hue-rotate(0deg)",
        }}
        // className="w-full sm:w-32 sm:h-20 rounded-md mb-4 sm:mb-0"
      />
    </div>
  </div>
  <div style={styles.heroTextContainer}>
    <h1 style={styles.heroTitle}>Welcome to Movies Free™</h1>
    <p style={styles.heroDescription}>
      Online. Stream. Download. Your source for the latest updates across various categories.
    </p>
  </div>
</header>
      <div
          className="shadow-lg flex items-center justify-center"
          role="navigation"
        >
          <ul
            id="menu-header-menu"
            className="menu flex flex-wrap justify-center"
          >
           
            <button className="border border-blue-500 p-2 m-1 hover:bg-blue-700">
              <li id="menu-item-35" className="menu-home active">
                <a
                  href="../movies/"
                  className="text-blue-500 font-bold text-xl hover:no-underline"
                >
                  Movies<span className="p"></span>
                </a>
              </li>
            </button>
            <button className="border border-blue-500 p-2 m-1 hover:bg-blue-700">
              <li id="menu-item-248" className="menu-operating-systems">
                <a
                  href="../tvshow/"
                  className="text-blue-500 font-bold text-xl hover:no-underline"
                >
                  Tv Show<span className="p"></span>
                </a>
              </li>
            </button>          
            <button className="border border-blue-500 p-2 m-1 hover:bg-blue-700">
              <li id="menu-item-11605" className="menu-3dcad">
                <a
                  href="../adult/"
                  className="text-blue-500 font-bold text-xl hover:no-underline"
                >
                  Adult<span className="p"></span>
                </a>
              </li>
            </button>
            <button className="border border-blue-500 p-2 m-1 hover:bg-blue-700">
              <li id="menu-item-248" className="menu-operating-systems">
                <a
                  href="../hindiDubbed/"
                  className="text-blue-500 font-bold text-xl hover:no-underline"
                >
                  Hindi Dubed<span className="p"></span>
                </a>
              </li>
            </button>
          </ul>
        </div>
      <div className="categories ">
  {Object.keys(allData).map((category) => (
    <section key={category} className="category-section bg-gray-100 p-4 rounded-lg shadow-md "  style={{ marginBottom: "20px",}}> 
      <h2 className="category-title text-4xl font-semibold text-blue-500 mb-5"
        style={{ textShadow: "3px 5px 5px #000", marginBottom:'20px'}}>
        <Link href={`/${category}`} className="no-underline hover:no-underline">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </h2>
      <div className="category-content flex flex-col gap-8">
        {allData[category].map((item, index) => (
          <div key={index} className="card bg-white p-4 rounded-lg shadow-md">
            <Link href={`/${category}/${generateSlug(item.title)}`} className="no-underline hover:no-underline">
              <div className="card-content flex flex-col md:flex-row gap-4">
                <Image
                  src={item.image1 || item.image}
                  alt={item.title}
                  width={800} // Adjust the width according to your needs
                  height={450} // Adjust the height according to your needs
                  quality={90}
                  className="card-image w-full md:w-32 h-auto md:h-20 object-cover rounded-lg mb-4 md:mb-0"
                  style={{
                    // width: "250px", // Ensures the image is displayed at this width
                    // height: "150px", // Ensures the image is displayed at this height
                    // objectFit: "cover", // Ensures the image covers the dimensions
                    // margin: "auto",
                    // marginTop: '50px',
                    // marginBottom: '20px',
                    boxShadow: "0 0 10px 0 #000", // Shadow effect
                    filter:
                      "contrast(1.1) saturate(1.1) brightness(1.0) hue-rotate(0deg)", // Image filter effects
                  }}
                />
                <div className="card-text">
                  <h3 className="card-title text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="card-description text-gray-600 text-base">{item.synopsis}</p>
                </div>
              </div>
            </Link>
            <small className="item-footer text-lg font-bold text-gray-500 mt-2 ">
            Upload Date: {item.year} | Language: {item.language}
            </small>
          </div>
        ))}
      </div>
      <Link href={`/${category}`} className="no-underline hover:no-underline">
            <div className="animate-pulse view-all text-red-500 text-2xl font-semibold mt-5">View All  {category.charAt(0).toUpperCase() + category.slice(1)} Articles →</div>
      </Link>
    </section>
  ))}
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
    color: "#333",
  },
  // hero: {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   // minHeight: "100vh", // Full viewport height for the hero section
  //   backgroundImage: "url(https://moviefree.vercel.app/og_image.jpg)", // Background image
  //   backgroundSize: "cover", // Make the image cover the entire area
  //   backgroundPosition: "center", // Center the image
  //   backgroundRepeat: "no-repeat", // Prevent image repetition
  //   color: "#fff", // White text for readability
  //   textAlign: "center", // Center align text
  //   padding: "20px", // Add padding for spacing
  //   boxSizing: "border-box", // Include padding in element's total width/height
  // },

  // Optional: Responsive tweaks for smaller screens
  "@media (max-width: 768px)": {
    hero: {
      padding: "15px", // Adjust padding for smaller screens
      backgroundPosition: "top", // Focus on the top part of the image
    },
  },
   
  hero: {
    position: "relative",
    width: "100%",
    height: "250px", // Reduced height for the hero section
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  heroTextContainer: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#fff",
    padding: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    borderRadius: "10px",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginTop: "10px",
    marginBottom: "5px",
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)",
  },
  heroDescription: {
    fontSize: "1rem",
    fontWeight: "400",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
  },
  categories: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
  },
  categorySection: {
    backgroundColor: "var(--section-bg-color)", // Dynamic section background
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)", // Subtle shadow
  },
  categoryTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#007bff", // Blue color for category title
    
  },
  categoryContent: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  card: {
    backgroundColor: "var(--card-bg-color)", // Dynamic card background
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for cards
    overflow: "hidden",
  },
  cardContent: {
    display: "flex",
    gap: "20px",
  },
  cardImage: {
    width: "120px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  cardText: {
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: "0 0 10px",
  },
  cardDescription: {
    fontSize: "1rem",
    color: "#666", // Grey color for descriptions
  },
  itemFooter: {
    fontSize: "0.9rem",
    color: "#777", // Slightly lighter grey for footer text
    marginTop: "10px",
  },
  viewAll: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#007bff", // Blue color for "view all" link
    textDecoration: "none",
    marginTop: "20px",
  },
};
