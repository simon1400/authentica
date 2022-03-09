import Page from "../../layout/Page"
import {useEffect} from 'react'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import Head from 'next/head'
import Link from 'next/link'
import {withRouter} from 'next/router'

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

const serializers = {
  marks: {
    link: ({mark, children}) => <Link href={mark.href}><a>{children}</a></Link>
  }
}

export async function getServerSideProps({params, locale}) {

  const queryStd = `*[_type == 'settings'].content.${locale}.std`;

  const std = await sanityClient.fetch(queryStd)

  const queryControl = `*[_type == 'blogItem' && content.cs.slug.current == $url || content.en.slug.current == $url || content.de.slug.current == $url]{
    _id
  }[0]`

  const dataControl = await sanityClient.fetch(queryControl, {url: params.article})
  if(!dataControl?._id){
    return{
      notFound: true
    }
  }

  const query = `*[_type == 'blogItem' && content.${locale}.slug.current == $url] {
    _id,
    "content": content.${locale}
  }[0]`;

  const data = await sanityClient.fetch(query, {url: params.article})

  if (!data?._id) {
    return {
      redirect: {
        destination: locale === 'cs' ? '/' : '/' + locale,
        permanent: false,
      },
    }
  }

  const globalSettings = await sanityClient.fetch(`*[_type == 'settings'].content.${locale}`)

  return {
    props: {
      content: data?.content,
      globalSettings: globalSettings[0],
      std: std[0]
    }
  }
}

const ArticleBlog = ({content, globalSettings, router, std}) => {

  useEffect(() => {

    const scrollTop = () => {
      document.body.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

    router.events.on('routeChangeComplete', scrollTop);

    return () => {
      router.events.off('routeChangeStart', scrollTop)
    }
  }, [])

  return (
    <Page
      title={content.meta?.title}
      description={content.meta?.description}
      image={urlFor(content.meta?.image).width(1200).height(630).auto('format').url()}
      ogTitle={content.meta?.ogTitle}
      ogDescription={content.meta?.ogDescription}
      head={content.title}
      gtmData={globalSettings?.gtm}
      endTitleData={globalSettings?.endTitle}
      heightAuto={true}
      lightMode={true}
      topImg={content.image}
    >
      <Head>
        {std?.title && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: `{
          "@context" : "http://schema.org",
          "@type" : "LocalBusiness",
          "name" : "${std.title}",
          "image" : "${urlFor(std.image).url()}",
          "telephone" : "${std.phone}",
          "email" : "${std.email}",
          "address" : {
            "@type" : "PostalAddress",
            "streetAddress" : "${std.street}",
            "addressLocality" : "${std.city}",
            "addressRegion" : "${std.region}",
            "addressCountry" : "${std.country}",
            "postalCode" : "${std.zip}"
          },
          "url" : "${std.url}"
        }`}} />}
        <link rel="alternate" hrefLang="de" href={`https://authenticagroup.cz/de${router.asPath.split('?')[0]}`} />
        <link rel="alternate" href={`https://authenticagroup.cz${router.asPath.split('?')[0]}`} hrefLang="x-default" />
      </Head>
      <section className="sec-center sec-blog-min" >
        <div className="uk-container">
          <div className="big-sec">
            <div uk-scrollspy="cls: uk-animation-fade; delay: 300">
              <BlockContent blocks={content.content} serializers={serializers} />
            </div>
          </div>
        </div>
      </section>
      {content.chapters.map((item, index) => <section key={index} className={`sec-chapter sec-center position-sec${item.dark ? " dark-chapter" : ""}`}>
        <div className="uk-container">
          <div className="chapter-content-wrap">
            <h4 uk-scrollspy="cls: uk-animation-fade; delay: 400">{item.title}</h4>
            <div className="small-text" uk-scrollspy="cls: uk-animation-fade; delay: 600">
              <BlockContent blocks={item.content} serializers={serializers} />
            </div>
          </div>
        </div>
        {!!item.images?.length && <div className="galery-blog">
          <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
            <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${item.images.length < 3 ? item.images.length : '3'}@s`} uk-grid="">
              {item.images.map((image, indexImage) => <div key={indexImage}>
                <div className={`article-info ${item.images.length > 1 ? 'square-img' : ''}`}>
                  <img
                    className="uk-img"
                    uk-img=""
                    src={urlFor(image).width(540).height(540).auto('format').url()}
                    alt={item.title} />
                </div>
              </div>)}
            </div>
          </div>
        </div>}
      </section>)}

      <section className="sec-chapter sec-center position-sec">
        <div className="uk-container">
          <div className="public-article">
            <div>
              {content?.publicInfo && <p>{content.publicInfo}</p>}
            </div>
            <div>
              <a href="/blog">Další články <img src="/assets/arrow-right.svg" uk-svg="" /></a>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default withRouter(ArticleBlog)