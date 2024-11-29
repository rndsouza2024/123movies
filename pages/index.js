import React, { useState, useEffect } from "react";
import path from "path";
import fs from "fs/promises";
import Link from "next/link";
import Head from "next/head";
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

const NewsSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: "MoviesFree™ - Online. Stream. Download.",
  url: "https://moviefree.vercel.app",
  sameAs: [
    "https://www.facebook.com/news24channel",
    "https://twitter.com/WorldNews24",
    "https://www.youtube.com/@News24thinkfirst",
    "https://www.instagram.com/WorldNews24official/",
  ],
  logo: {
    "@type": "ImageObject",
    url: "https://moviefree.vercel.app/logo.png",
    width: "150",
    height: "60",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "World News 24 Broadcast India Limited,FC-23",
    addressLocality: "Sector 16A, Film City Mumbai",
    addressRegion: "Mumbai, India",
    postalCode: "400099",
    addressCountry: "IN",
  },
});

const rankMathSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://moviefree.vercel.app/author/watchnewsonline/",
      name: "Dr Trailer",
      url: "https://moviefree.vercel.app/author/watchnewsonline/",
      image: {
        "@type": "ImageObject",
        "@id": "https://gravatar.com/drtrailer2022",
        url: "https://gravatar.com/drtrailer2022",
        caption: "Dr Trailer",
        inLanguage: "en-US",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://moviefree.vercel.app/#organization",
      name: "MoviesFree™ - Online. Stream. Download.",
      url: "https://moviefree.vercel.app/",
    },
    {
      "@type": "WebSite",
      "@id": "https://moviefree.vercel.app/#website",
      url: "https://moviefree.vercel.app/",
      name: "MoviesFree™ - Online. Stream. Download.",
      publisher: {
        "@type": "Organization",
        "@id": "https://moviefree.vercel.app/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://moviefree.vercel.app/?s={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://moviefree.vercel.app/#webpage",
      url: "https://moviefree.vercel.app/",
      name: "News",
      datePublished: "2024-01-13T13:00:00+00:00",
      dateModified: "2024-01-13T13:13:00+00:00",
      about: {
        "@type": "Person",
        "@id": "https://moviefree.vercel.app/author/uwatchfreeonline/",
        name: "Dr Trailer",
        url: "https://moviefree.vercel.app/author/uwatchfreeonline/",
        image: {
          "@type": "ImageObject",
          "@id": "https://gravatar.com/drtrailer2022",
          url: "https://gravatar.com/drtrailer2022",
          caption: "Dr Trailer",
          inLanguage: "en-US",
        },
      },
      isPartOf: {
        "@id": "https://moviefree.vercel.app/#website",
      },
      inLanguage: "en-US",
      mainEntity: [
        {
          "@type": "Article",
          "@id": "https://moviefree.vercel.app/",
          url: "https://moviefree.vercel.app/",
          headline: "News",
          datePublished: "2024-01-13T13:00:00+00:00",
          dateModified: "2024-01-13T13:13:00+00:00",
          author: {
            "@type": "Person",
            "@id": "https://moviefree.vercel.app/author/watchnewsonline/",
            name: "Dr Trailer",
            url: "https://moviefree.vercel.app/author/watchnewsonline/",
            image: {
              "@type": "ImageObject",
              "@id": "https://gravatar.com/drtrailer2022",
              url: "https://gravatar.com/drtrailer2022",
              caption: "Dr Trailer",
              inLanguage: "en-US",
            },
          },
          publisher: {
            "@type": "Organization",
            "@id": "https://moviefree.vercel.app/#organization",
            name: "MoviesFree™ - Online. Stream. Download.",
            url: "https://moviefree.vercel.app/",
          },
        },
      ],
      sameAs: [
        "https://www.facebook.com/news24channel",
        "https://twitter.com/WorldNews24",
        "https://www.youtube.com/@News24thinkfirst",
        "https://www.instagram.com/WorldNews24official/",
      ],
    },
  ],
});

const soap2daySchema = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://moviefree.vercel.app/",
      url: "https://moviefree.vercel.app/",
      name: "MoviesFree™ - Online. Stream. Download.",
      isPartOf: { "@id": "https://moviefree.vercel.app/#website" },
      about: { "@id": "https://moviefree.vercel.app/#organization" },
      primaryImageOfPage: { "@id": "https://moviefree.vercel.app/#primaryimage" },
      image: { "@id": "https://moviefree.vercel.app/#primaryimage" },
      thumbnailUrl: "https://moviefree.vercel.app/og_image.jpg",
      datePublished: "2023-07-02T18:30:00+00:00",
      dateModified: "2024-09-24T05:11:20+00:00",
      breadcrumb: { "@id": "https://moviefree.vercel.app/#breadcrumb" },
      inLanguage: "en-US",
      potentialAction: [
        { "@type": "ReadAction", target: ["https://moviefree.vercel.app/"] },
      ],
    },
    {
      "@type": "ImageObject",
      inLanguage: "en-US",
      "@id": "https://moviefree.vercel.app/#primaryimage",
      url: "https://moviefree.vercel.app/og_image.jpg",
      contentUrl: "https://moviefree.vercel.app/og_image.jpg",
      width: 1280,
      height: 720,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://moviefree.vercel.app/#breadcrumb",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home" }],
    },
    {
      "@type": "WebSite",
      "@id": "https://moviefree.vercel.app/#website",
      url: "https://moviefree.vercel.app/",
      name: "MoviesFree™ - Online. Stream. Download.",
      description: "",
      publisher: { "@id": "https://moviefree.vercel.app/#organization" },
      potentialAction: [
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://moviefree.vercel.app/?s={search_term_string}",
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
      name: "MoviesFree™ - Online. Stream. Download.",
      url: "https://moviefree.vercel.app/",
      logo: {
        "@type": "ImageObject",
        inLanguage: "en-US",
        "@id": "https://moviefree.vercel.app/#/schema/logo/image/",
        url: "https://moviefree.vercel.app/logo.png",
        contentUrl: "https://moviefree.vercel.app/logo.png",
        width: 280,
        height: 100,
        caption: "MoviesFree™ - Online. Stream. Download.",
      },
      image: { "@id": "https://moviefree.vercel.app/#/schema/logo/image/" },
    },
  ],
});

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
    dangerouslySetInnerHTML={{ __html: NewsSchema }}
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: rankMathSchema }}
  />
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: soap2daySchema }}
  />
  </Head>
  <SocialSharing />
    <div style={styles.container}>
      <header style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Movies Free™  </h1>
        <p style={styles.heroDescription}>
        Online. Stream. Download. Your source for the latest updates across various categories.
        </p>
     
      </header>

      <div className="categories">
  {Object.keys(allData).map((category) => (
    <section key={category} className="category-section bg-gray-100 p-4 rounded-lg shadow-md"  style={{ marginBottom: "20px",}}> 
      <h2 className="category-title text-4xl font-semibold text-blue-500 mb-5"
        style={{ textShadow: "3px 5px 5px #000", marginBottom:'20px'}}>
        <Link href={`/${category}`}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>
      </h2>
      <div className="category-content flex flex-col gap-8">
        {allData[category].map((item, index) => (
          <div key={index} className="card bg-white p-4 rounded-lg shadow-md">
            <Link href={`/${category}/${generateSlug(item.title)}`}>
              <div className="card-content flex flex-col md:flex-row gap-4">
                <img
                  src={item.image1 || item.image}
                  alt={item.title}
                  className="card-image w-full md:w-32 h-auto md:h-20 object-cover rounded-lg mb-4 md:mb-0"
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
      <Link href={`/${category}`}>
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
  hero: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // minHeight: "100vh", // Full viewport height for the hero section
    backgroundImage: "url(https://moviefree.vercel.app/og_image.jpg)", // Background image
    backgroundSize: "cover", // Make the image cover the entire area
    backgroundPosition: "center", // Center the image
    backgroundRepeat: "no-repeat", // Prevent image repetition
    color: "#fff", // White text for readability
    textAlign: "center", // Center align text
    padding: "20px", // Add padding for spacing
    boxSizing: "border-box", // Include padding in element's total width/height
  },

  // Optional: Responsive tweaks for smaller screens
  "@media (max-width: 768px)": {
    hero: {
      padding: "15px", // Adjust padding for smaller screens
      backgroundPosition: "top", // Focus on the top part of the image
    },
  },
   
  heroTitle: {
    fontSize: "3.5rem", // Increase font size for better visibility
    fontWeight: "800", // Make the font bold
    marginBottom: "15px",
    color: "#0000FF", // Vibrant yellow for attention
    textShadow: "2px 2px 5px rgba(0, 0, 0, 0.7)", // Add a subtle shadow for contrast
    letterSpacing: "1.5px", // Slight spacing for readability
  },
  heroDescription: {
    fontSize: "1.75rem", // Slightly larger font size
    maxWidth: "800px",
    margin: "0 auto",
    color: "#000", // Light grey for subtlety
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)", // Subtle shadow for depth
    fontWeight: "600", // Semi-bold for emphasis
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
