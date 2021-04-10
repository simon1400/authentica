import { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'

// import sanityClient from "../lib/sanity.js";
// import { DataStateContext } from '../context/dataStateContext'
// import query from '../queries/page'

import Header from '../Header'
import Footer from '../Footer'

const Page = ({
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
  tags
}) => {

  const router = useRouter()
  const [global, setGlobal] = useState({
    site_url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://authentica.cz',
    facebook_app_id: '',
    defaultTitle: 'AUTHENTICA',
    defaultDescription: 'Authentica',
    defaultImage: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://authentica.cz'}`,
    defaultTwitter: '@cereallarceny',
    defaultSep: ' '
  })

  // const { dataContextState } = useContext(DataStateContext)

  // useEffect(() => {
  //   sanityClient.fetch(query).then(res => {
  //     setGlobal({
  //       ...global,
  //       defaultTitle: res[1].endTitle || 'HUROM'
  //     })
  //   })
  // }, [])

  const theTitle = title ? (title + global.defaultSep + global.defaultTitle).substring(0, 60) : global.defaultTitle;
  const theDescription = description ? description.substring(0, 155) : global.defaultDescription;
  const theImage = image ? image : global.defaultImage;


  return (
    <div>
      <Head>
        <meta charSet="utf-8" />

        {/* FAVICON */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#80bd01" />

        {/* FONTY */}
        {/*<link rel="stylesheet preload prefetch" href="/fonts.css" as="style" type="text/css" crossOrigin="anonymous" />*/}
        <link rel="stylesheet preload prefetch" href="https://use.typekit.net/vpe5tmu.css" as="style" type="text/css" crossOrigin="anonymous" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{theTitle}</title>
        <link rel="canonical" href={global.site_url+router.asPath} />
        <meta itemProp="name" content={theTitle} />
        <meta itemProp="description" content={theDescription} />
        <meta itemProp="image" content={theImage} />
        <meta name="description" content={theDescription} />
        {/*<meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={global.defaultTwitter} />
        <meta name="twitter:title" content={theTitle} />
        <meta name="twitter:description" content={theDescription} />
        <meta name="twitter:creator" content={twitter || global.defaultTwitter} />
        <meta name="twitter:image:src" content={theImage} />*/}
        <meta property="og:title" content={theTitle} />
        <meta property="og:type" content={contentType || 'website'} />
        <meta property="og:url" content={global.site_url+router.asPath} />
        <meta property="og:image" content={theImage} />
        <meta property="og:description" content={theDescription} />
        <meta property="og:site_name" content="HUROM" />
        <meta property="fb:app_id" content={global.facebook_app_id} />

        {published && <meta name="article:published_time" content={published} />}
        {category && <meta name="article:section" content={category} />}
        {updated && <meta name="article:modified_time" content={updated} />}
        {noCrawl && <meta name="robots" content="noindex, nofollow" />}
        {tags && <meta name="article:tag" content={tags} />}
      </Head>

      <Header  head={head} logoHead={logoHead} />
      <main id={id} className={className}>{children}</main>
      <Footer />

    </div>
  );
}


export default Page
