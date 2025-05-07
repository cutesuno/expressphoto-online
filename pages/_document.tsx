import Head from 'next/head';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Home() {
  return (
    <>
      <Head>
        <title>ExpressPhoto Online</title>
        <meta name="description" content="Онлайн-друк фотографій, фото на документи, ксерокопії та інше." />
        
        {/* Open Graph */}
        <meta property="og:title" content="ExpressPhoto Online" />
        <meta property="og:description" content="Онлайн-друк фотографій, фото на документи, ксерокопії та інше." />
        <meta property="og:image" content="URL_до_картинки" />
        <meta property="og:url" content="https://www.expressphoto.online" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ExpressPhoto Online" />
        <meta name="twitter:description" content="Онлайн-друк фотографій, фото на документи, ксерокопії та інше." />
        <meta name="twitter:image" content="URL_до_картинки" />
        
        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.expressphoto.online" />
      </Head>
      {/* Ваш контент сторінки */}
    </>
  );
}

export default function Document() {
  return (
    <Html lang="uk">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Онлайн-друк, фото на документи, ксерокопії та більше — ExpressPhoto Online" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}