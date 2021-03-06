import {useEffect} from 'react'
import Page from '../../layout/Page'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import Head from 'next/head'
import Link from 'next/link'
import {withRouter} from 'next/router'
import Button from '../../components/Button'

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
    "button": content.${locale}.button,
    "slugDE": content.de.slug.current,
    "slugEN": content.en.slug.current,
    "slugCS": content.cs.slug.current
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

  let linkButton = '', linkButtonType = 'inter'
  if(data?.button?.cta?.linkInter){
    linkButton = await sanityClient.fetch(`*[_type in ['article', 'jobOff', 'category'] && _id in ["${data.button.cta.linkInter._ref}"]]{
      "slug": content.${locale}.slug.current,
      "type": _type
    }[0]`)
  }else if(data?.button?.cta?.linkExter){
    linkButtonType = 'exter'
    linkButton = data?.button?.cta?.linkExter
  }else if(data?.button?.cta?.linkMail){
    linkButtonType = 'mail'
    linkButton = data?.button.cta.linkMail
  }

  const globalSettings = await sanityClient.fetch(`*[_type == 'settings'].content.${locale}`)

  return {
    props: {
      content: data?.content,
      globalSettings: globalSettings[0],
      button: {
        linkButton: linkButton,
        linkButtonType: linkButtonType
      },
      std: std[0],
      slugs: {
        cs: data.slugCS,
        en: data.slugEN,
        de: data.slugDE
      },
    }
  }
}

const Article = ({content, button, std, slugs, router, globalSettings}) => {

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

  return(
    <Page
      title={content.meta?.title}
      description={content.meta?.description}
      image={urlFor(content.meta?.image).width(1200).height(630).auto('format').url()}
      ogTitle={content.meta?.ogTitle}
      ogDescription={content.meta?.ogDescription}
      head={content.title}
      gtmData={globalSettings?.gtm}
      endTitleData={globalSettings?.endTitle}
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
        {slugs.de && <link rel="alternate" hrefLang="de" href={`https://authenticagroup.cz/de/${slugs.de}`} />}
        {slugs.en && <link rel="alternate" hrefLang="en" href={`https://authenticagroup.cz/en/${slugs.en}`} />}
        {slugs.cs && <link rel="alternate" hrefLang="cs" href={`https://authenticagroup.cz/${slugs.cs}`} />}
      </Head>
      {/*<section className="video-bg">
        <video src="/assets/top-video.mp4" loop muted preload="" playsInline uk-video="autoplay: inview"></video>
      </section>*/}
      {!!content.media?.iamge && <section className="sec-center">
        <img
          className="uk-img uk-animation-reverse uk-transform-origin-top-right"
          uk-scrollspy="cls: uk-animation-kenburns; repeat: true"
          uk-img=""
          data-src={urlFor(content.media.iamge).auto('format').url()}
          data-srcset={`${urlFor(content.media.iamge).width(400).auto('format').url()} 400w,
                    ${urlFor(content.media.iamge).width(640).auto('format').url()} 640w,
                    ${urlFor(content.media.iamge).width(900).auto('format').url()} 900w,
                    ${urlFor(content.media.iamge).width(1000).auto('format').url()} 1000w,
                    ${urlFor(content.media.iamge).width(1600).auto('format').url()} 1600w,
                    ${urlFor(content.media.iamge).width(2500).auto('format').url()} 2000w`}
          alt={content.title} />
      </section>}
      <section className={`sec-center sec-min${!content.media?.iamge ? ' uk-padding-remove-top' : ''}`} >
        <div className="uk-container">
          <div className="big-sec">
            <div uk-scrollspy="cls: uk-animation-fade; delay: 300">
              <BlockContent blocks={content.content} serializers={serializers} />
            </div>
            {(!!button.linkButton && !!content.button?.name) && <Button
                                                                type={button.linkButtonType}
                                                                name={content.button?.name}
                                                                link={button.linkButton} />}
          </div>
        </div>
      </section>



      {!!content.chapters?.length && content.chapters.map((item, index) => <section key={index} className={`sec-auto article-sec
        ${!item.images?.length && !item.title ? 'uk-padding-remove-top ' : ''}`}>
        {!!item.title && <div className="uk-container">
          {!!item.title?.length && <h2 uk-scrollspy="cls: uk-animation-fade; delay: 300">{item.title}</h2>}
        </div>}
        {!!item.images?.length && <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
          <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${item.images.length < 3 ? item.images.length : '3'}@s`} uk-grid="">
            {item.images.map((image, indexImage) => <div key={indexImage}>
              <div className={`article-info ${item.images.length > 1 ? 'square-img' : ''}`}>
                <img
                  className="uk-img"
                  uk-img=""
                  data-src={urlFor(image).auto('format').url()}
                  data-srcset={`${urlFor(image).width(400).auto('format').url()} 400w,
                            ${urlFor(image).width(640).auto('format').url()} 640w,
                            ${urlFor(image).width(900).auto('format').url()} 900w,
                            ${urlFor(image).width(1000).auto('format').url()} 1000w,
                            ${urlFor(image).width(1600).auto('format').url()} 1600w,
                            ${urlFor(image).width(2000).auto('format').url()} 2000w`}
                  alt="Article info" />
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
              {content.partners?.logo.map((item, index) => {
                if(index < 6){
                  return(
                    <div key={index} className="partners-item inside">
                      <img className="uk-svg" src={urlFor(item).auto('format').url()} uk-svg="" alt="logo-partners"/>
                    </div>
                  )
                }
                return ''
              })}
            </div>
          </div>
        </div>
      </section>}
    </Page>
  )
}

export default withRouter(Article)
