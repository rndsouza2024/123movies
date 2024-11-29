import '@styles/globals.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { PageTransition } from "../components/PageTransition";
import DisableInteractions from '../components/DisableInteractions';
import ThemeSwitch from '../components/ThemeSwitch';
import GoogleAnalytics from "@bradgarropy/next-google-analytics";

import { useEffect } from 'react';
import Script from 'next/script';


function Application({ Component, pageProps }) {
 
  useEffect(() => {
    // Dynamically load the Ko-fi widget script
    const kofiScript = document.createElement('script');
    kofiScript.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    kofiScript.async = true;

    kofiScript.onload = () => {
      console.log("Ko-fi widget loaded.");
      if (typeof kofiWidgetOverlay !== 'undefined') {
        kofiWidgetOverlay.draw('payat', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          'floating-chat.donateButton.background-color': '#00b9fe',
          'floating-chat.donateButton.text-color': '#fff'
        });
      }
    };

    document.body.appendChild(kofiScript);

    return () => {
      document.body.removeChild(kofiScript);
    };
  }, []);


  return (
    <>
      
      <div className="center">
        {/* Google Analytics */}
        <GoogleAnalytics measurementId="G-RKFSE3C017" />
        
        <PageTransition>
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main>
          <DisableInteractions />  
          <ThemeSwitch />
            <Component {...pageProps} />
           
          </main>

          {/* Footer */}
          <Footer />
        </PageTransition>
      </div>
    </>
  );
}

export default Application;
