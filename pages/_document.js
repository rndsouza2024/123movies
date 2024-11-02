// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default function MyDocument() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic meta tags for SEO */}
               
        {/* External stylesheets can be included here */}

        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
          integrity='sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=='
          crossOrigin='anonymous'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&display=swap'
        />
         {/* <script 
            type='text/javascript' 
            src='https://platform-api.sharethis.com/js/sharethis.js#property=6225c5f29354570012a24408&product=sticky-share-buttons' 
            async='async'>
          </script> */}
          {/* <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=YOUR_PUB_ID"></script> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
