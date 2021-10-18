import { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from "framer-motion"
import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../../lib/sanity.js";
const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

import Header from '../Header'
import Footer from '../Footer'

const Page = ({
  endTitleData,
  gtmData,
  children,
  id,
  className,
  title,
  description,
  image,
  twitter,
  contentType,
  published,
  category,
  updated,
  noCrawl,
  head,
  logoHead,
  tags,
  heightAuto,
  ogTitle = '',
  ogDescription = '',
  lightMode = false,
  topImg = false
}) => {

  const router = useRouter()
  const [global, setGlobal] = useState({
    site_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://authenticagroup.cz',
    facebook_app_id: '',
    defaultTitle: endTitleData || 'AUTHENTICA',
    defaultDescription: 'Authentica',
    defaultImage: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : 'https://authenticagroup.cz'}`,
    defaultTwitter: '@cereallarceny',
    defaultSep: ' '
  })

  const theTitle = title ? (title + global.defaultSep + global.defaultTitle).substring(0, 60) : global.defaultTitle;
  const theDescription = description ? description.substring(0, 155) : global.defaultDescription;
  const theImage = image ? image : global.defaultImage;

  const locale = router.locale === 'cs' ? '' : '/'+router.locale

  return (
    <div className="root-component">
      <Head>

        {/*<!-- Google Tag Manager -->*/}
        {!!gtmData && <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmData}');`}} />}
        {/*<!-- End Google Tag Manager -->*/}

        <meta charSet="utf-8" />

        {/* FAVICON */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" href="/favicon/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        {/*<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />*/}
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#000" />

        {/* FONTY */}
        <link rel="stylesheet preload prefetch" href="https://use.typekit.net/vpe5tmu.css" as="style" type="text/css" crossOrigin="anonymous" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{theTitle}</title>
        <link rel="canonical" href={global.site_url+locale+router.asPath.split('?')[0]} />
        <meta itemProp="name" content={theTitle} />
        <meta itemProp="description" content={theDescription} />
        <meta itemProp="image" content={theImage} />
        <meta name="description" content={theDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="AUTHENTICA GROUP" />
        <meta name="twitter:title" content={ogTitle || theTitle} />
        <meta name="twitter:description" content={ogDescription || theDescription} />
        {/*<meta name="twitter:creator" content={twitter || global.defaultTwitter} />*/}
        <meta name="twitter:image:src" content={theImage} />
        <meta property="og:title" content={ogTitle || theTitle} />
        <meta property="og:type" content={contentType || 'website'} />
        <meta property="og:url" content={global.site_url+router.asPath.split('?')[0]} />
        <meta property="og:image" content={theImage} />
        <meta property="og:description" content={ogDescription || theDescription} />
        <meta property="og:site_name" content="AUTHENTICA GROUP" />
        <meta property="fb:app_id" content={global.facebook_app_id} />

        {published && <meta name="article:published_time" content={published} />}
        {category && <meta name="article:section" content={category} />}
        {updated && <meta name="article:modified_time" content={updated} />}
        {noCrawl && <meta name="robots" content="noindex, nofollow" />}
        {tags && <meta name="article:tag" content={tags} />}
      </Head>

      {/*<!-- Google Tag Manager (noscript) -->*/}
      <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmData || 'GTM-KH5BW7W'}`}
      height="0" width="0" style={{display:'none', visibility:'hidden'}}></iframe></noscript>
      {/*<!-- End Google Tag Manager (noscript) -->*/}

      <motion.div
        initial={{x: 0}}
        animate={{
          x: "100%",
          transition: {
            ease: 'linear',
            duration: .5
          }
        }}
        className="animate-block-black"
      ></motion.div>

      <motion.div
        initial={{x: '-100%'}}
        exit={{
          x: 0,
          transition: {
            duration: .4,
            delay: .3
          }
        }}
        className="animate-block-black"
      ></motion.div>

      <motion.div
        initial={{x: '-100%'}}
        exit={{
          x: 0,
          transition: {
            duration: .5
          }
        }}
        className="animate-block-white"
      ></motion.div>

      <Header
        head={head}
        lightMode={lightMode}
        logoHead={logoHead}
        heightAuto={heightAuto}
        topImg={topImg}
      />
      <main id={id} className={`${className}${lightMode ? ' light-mode' : ''}`}>{children}</main>
      <Footer lightMode={lightMode} />

    </div>
  );
}


export default Page
