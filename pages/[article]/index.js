import {useState, useEffect} from 'react'
import Page from '../../layout/Page'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import Head from 'next/head'
import Link from 'next/link'
import shuffle from '../../helpers/shuffle'
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

  const queryControl = `*[_type == 'article' && content.cs.slug.current == $url || content.en.slug.current == $url || content.de.slug.current == $url]{
    _id
  }[0]`

  const dataControl = await sanityClient.fetch(queryControl, {url: params.article})
  if(!dataControl?._id){
    return{
      notFound: true
    }
  }

  const query = `*[_type == 'article' && content.${locale}.slug.current == $url] {
    _id,
    "content": content.${locale},
    "button": {
      "name": content.${locale}.button.name,
      "link": *[_type in ['article', 'jobOff', 'category'] && _id in [^.content.${locale}.button.link._ref]]{
        "slug": content.${locale}.slug.current,
        "type": _type
      }[0]
    }
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
  let logoPartners = []

  if(data?.content?.partners?.logo?.length){
    logoPartners = data?.content.partners?.logo.map(item => urlFor(item).auto('format').url())
    logoPartners = shuffle(logoPartners)
  }

  return {
    props: {
      content: data?.content,
      button: data?.button,
      std: std[0],
      logoPartners,
    }
  }
}

const Article = ({content, button, dataControl, std, logoPartners, router}) => {

  const [stateLogoPartners, setStateLogoPartners] = useState(logoPartners)
  const [iterator, setIterator] = useState(0)

  const changeImg = () => {
    setStateLogoPartners(shuffle(logoPartners))
    setTimeout(() => setIterator(Math.random()), 4000)
  }

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

  useEffect(() => {
    let timer1 = setTimeout(() => changeImg(), 4000);
    return () => clearTimeout(timer1);
  }, [iterator])

  return(
    <Page
      title={content.meta?.title}
      description={content.meta?.description}
      image={urlFor(content.meta?.image).width(1200).height(630).auto('format').url()}
      ogTitle={content.meta?.ogTitle}
      ogDescription={content.meta?.ogDescription}
      head={content.title}
      logoHead={content.logo}
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
        {/*<link rel="alternate" hreflang="cs" href={`${host}${router.asPath}`} />
        <link rel="alternate" hreflang="en" href={`${host}${router.asPath}`} />
        <link rel="alternate" hreflang="de" href={`${host}${router.asPath}`} />*/}
      </Head>
      {/*<section className="video-bg">
        <video src="/assets/top-video.mp4" loop muted preload="" playsInline uk-video="autoplay: inview"></video>
      </section>*/}
      {!!content.media?.iamge && <section className="sec-center">
        <img className="uk-animation-reverse uk-transform-origin-top-right" uk-scrollspy="cls: uk-animation-kenburns; repeat: true" src={urlFor(content.media.iamge).width(2500).auto('format').url()} alt="" />
      </section>}
      <section className="sec-center sec-min">
        <div className="uk-container">
          <div className="big-sec">
            <div uk-scrollspy="cls: uk-animation-fade; delay: 300">
              <BlockContent blocks={content.content} serializers={serializers} />
            </div>
            {(!!button?.name?.length && !!button?.link?.slug?.length) && <div uk-scrollspy="cls: uk-animation-fade; delay: 500">
              <Link href={`${button?.link.type === 'jobOff' ? '/kariera' : ''}/${button?.link.slug}`}>
                <a className="button">
                  {button?.name}
                  <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
                </a>
              </Link>
            </div>}
          </div>
        </div>
      </section>

      {!!content.chapters?.length && content.chapters.map((item, index) => <section key={index} className={`sec-auto article-sec ${!item.images?.length && !item.title ? 'uk-padding-remove-top' : ''}`}>
        {!!item.title && <div className="uk-container">
          {!!item.title?.length && <h2 uk-scrollspy="cls: uk-animation-fade; delay: 300">{item.title}</h2>}
        </div>}
        {!!item.images?.length && <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
          <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${item.images.length < 3 ? item.images.length : '3'}@s`} uk-grid="">
            {item.images.map((image, indexImage) => <div key={indexImage}>
              <div className={`article-info ${item.images.length > 1 ? 'square-img' : ''}`}>
                <img src={urlFor(image).width(2000).auto('format').url()} alt="Article info" />
              </div>
            </div>)}
          </div>
        </div>}
        {!!item.content && <div uk-scrollspy="cls: uk-animation-fade; delay: 300" className={`uk-container ${!!item.images?.length ? 'mr-top' : ''}`}>
          <BlockContent blocks={item.content} serializers={serializers} />
        </div>}
      </section>)}

      {content.partners?.logo.length && <section className="partners without-video" uk-scrollspy="cls: uk-animation-fade; target: .partners-item; delay: 500">
        <div className="uk-container">
          <h2>{content.partners?.title}</h2>
        </div>
        <div className="partners-wrap">
          <div className="uk-container">
            <div className="partners-items">
              {[0, 1, 2, 3, 4, 5].map(item =>
                <div key={item} className="partners-item" style={{
                    backgroundImage: `url(${stateLogoPartners[item]})`
                  }}>
                </div>)}
              {/*{content.partners?.logo.map((item, index) => {
                if(index < 6){
                  return(
                    <div key={index} className="partners-item">
                      <img className="uk-svg" src={urlFor(item).auto('format').url()} uk-svg="" alt="logo-partners"/>
                    </div>
                  )
                }
                return ''
              })}*/}
            </div>
          </div>
        </div>
      </section>}
    </Page>
  )
}

export default withRouter(Article)
