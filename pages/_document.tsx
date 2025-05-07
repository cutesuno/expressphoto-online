import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="N6zS289Eaqxxv5_n_dN6EUYYlihhJwmc7OcgQcptswc" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Meta */}
        <meta name="theme-color" content="#000000" />

        {/* Основні теги SEO */}
        <meta charSet="UTF-8" />
        <meta name="description" content="Онлайн-друк, фото на документи, ксерокопії та більше – ExpressPhoto Online" />
        <meta name="keywords" content="друк, фото на документи, ксерокопія, Łódź, express photo, онлайн друк" />
        <meta name="author" content="ExpressPhoto Online" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="ExpressPhoto Online" />
        <meta property="og:description" content="Онлайн-друк, фото на документи, ксерокопії та більше – Łódź" />
        <meta property="og:url" content="https://www.expressphoto.online" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.expressphoto.online/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ExpressPhoto Online" />

      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}