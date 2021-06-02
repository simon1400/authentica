import {useState, useEffect} from 'react'
import Page from '../layout/Page'
import CountUp from 'react-countup';
import Head from 'next/head'
import Link from 'next/link'
import handleViewport from 'react-in-viewport';
import sanityClient from "../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import shuffle from '../helpers/shuffle'
import Button from '../components/Button'
import {withRouter} from 'next/router'

import useWindowSize from '../helpers/windowSize'

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

  const query = `*[_type == 'homepage'][0].content.${locale} {
    title,
    meta,
    media,
    button,
    firmArr,
    secSuccess,
    partners,
    content
  }`

  const data = await sanityClient.fetch(query)

  let linkButton = '', linkButtonType = 'inter'
  if(data?.button.cta.linkInter){
    linkButton = await sanityClient.fetch(`*[_type in ['article', 'jobOff'] && _id in ["${data.button.cta.linkInter._ref}"]]{
      "slug": content.${locale}.slug.current,
      "type": _type
    }[0]`)
  }else if(data?.button.cta.linkExter){
    linkButtonType = 'exter'
    linkButton = data?.button.cta.linkExter
  }else if(data?.button.cta.linkMail){
    linkButtonType = 'mail'
    linkButton = data?.button.cta.linkMail
  }

  data.linkButton = linkButton
  data.linkButtonType = linkButtonType

  const linksArr = []
  if(data?.firmArr && data?.firmArr?.length){
    for(var i = 0; i < data?.firmArr.length; i++){
      if(data.firmArr.[i]?.button?.cta?.linkInter){
        linksArr.push(data.firmArr[i].button.cta.linkInter._ref)
      }else if(data.firmArr.[i]?.button?.cta?.linkExter){
        linksArr.push(data.firmArr?.[i]?.button?.cta?.linkExter)
      }else if(data.firmArr.[i]?.button?.cta?.linkMail){
        linksArr.push(data.firmArr?.[i]?.button?.cta?.linkMail)
      }
    }
  }

  const links = await sanityClient.fetch(`*[_type in ['article', 'jobOff'] && _id in [${linksArr.map(item => `"${item}"`)}]]{
    _id,
    _type,
    "slug": content.${locale}.slug.current
  }`)

  if(data?.firmArr && data?.firmArr?.length){
    for(var i = 0; i < data.firmArr.length; i++){
      if(data.firmArr[i].button.cta.linkInter){
        data.firmArr[i].button.typeLink = 'inter'
        for(var a = 0; a < links.length; a++){
          if(data.firmArr[i]?.button?.cta.linkInter?._ref == links[a]._id){
            data.firmArr[i].button.link = `${links[a]._type === 'article' ? '' : '/pozice'}/${links[a].slug}`
          }
        }
      }else if(data.firmArr?.[i]?.button?.cta?.linkExter){
        data.firmArr[i].button.typeLink = 'exter'
        data.firmArr[i].button.link = data.firmArr?.[i]?.button?.cta?.linkExter
      }else if(data.firmArr?.[i]?.button?.cta?.linkMail){
        data.firmArr[i].button.typeLink = 'mail'
        data.firmArr[i].button.link = data.firmArr?.[i]?.button?.cta?.linkMail
      }
    }
  }

  let logoPartners = data.partners.logo.map(item => urlFor(item).auto('format').url())

  logoPartners = shuffle(logoPartners)

  const globalSettings = await sanityClient.fetch(`*[_type == 'settings'].content.${locale}`)

  return {
    props: {
      data,
      std: std[0],
      logoPartners,
      globalSettings: globalSettings[0]
    }
  }
}

const Home = ({data, std, logoPartners, router, globalSettings}) => {

  const [startCount, setStartCount] = useState(false)
  const [stateLogoPartners, setStateLogoPartners] = useState(logoPartners)
  const [iterator, setIterator] = useState(0)

  const size = useWindowSize()

  const content = data

  if(!data?.title){
    return ''
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

  const changeImg = () => {
    setStateLogoPartners(shuffle(logoPartners))
    setTimeout(() => setIterator(Math.random()), 4000)
  }

  useEffect(() => {
    let timer1 = setTimeout(() => changeImg(), 4000);
    return () => clearTimeout(timer1);
  }, [iterator])

  return (
    <Page
      title={content?.meta?.title}
      description={data?.meta?.description}
      image={urlFor(data?.meta?.image).width(1200).height(630).url()}
      ogTitle={data?.meta?.ogTitle}
      ogDescription={data?.meta?.ogDescription}
      head={content?.title}
      gtmData={globalSettings?.gtm}
      endTitleData={globalSettings?.endTitle}
      heightAuto={!data?.videoFile && !content?.media?.iamge}
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
        <link rel="alternate" hreflang="cs" href={`https://a-group.cz${router.asPath}`} />
      </Head>

      <section className="video-bg">
        <video src={size?.width > 640 ? "/assets/agroup-hq.mp4" : "/assets/agroup-lq.mp4"} loop muted preload="true" playsInline uk-video="autoplay: inview"></video>
      </section>
      {/*{!!data.videoFile && <section className="video-bg">
        <video src={data.videoFile} loop muted playsInline uk-video="autoplay: inview"></video>
      </section>}*/}

      {/*{!!content.media?.iamge && !data.videoFile && <section className="sec-center">
        <img src={urlFor(content.media.iamge).url()} alt="" />
      </section>}*/}

      <section className="sec-center sec-min">
        <div className="uk-container">
          <div className="big-sec">
            <div uk-scrollspy="cls: uk-animation-fade; delay: 300">
              <BlockContent blocks={content.content} serializers={serializers} />
            </div>
            {!!content.button?.name?.length && <Button type={content.linkButtonType} name={content.button.name} link={content.linkButton} />}
          </div>
        </div>
      </section>


      {content.firmArr.map((item, index) => <section key={index} className="firm-sec sec-center">
        {!!item.background && <img src={urlFor(item.background).width(2500).auto('format').url()} alt="" />}
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-1-1 uk-width-2-3@s">
              <div uk-scrollspy="cls: uk-animation-fade; delay: 300">
                <img className="uk-svg sec-logo-partner" src={urlFor(item.logo).width(500).auto('format').url()} uk-svg="" alt="logo"/>
              </div>
              <div uk-scrollspy="cls: uk-animation-fade; delay: 500">
                <BlockContent blocks={item.content} />
              </div>
              {(!!item.button?.link && !!item.button?.name) && <Button
                                                                  type={item.button.typeLink}
                                                                  name={item.button.name}
                                                                  link={item.button.link}
                                                                  delay={700} bare arr />}
            </div>
          </div>
        </div>
      </section>)}

      <section className="sec-center">
        <div className="uk-width-expand">
          <div className="uk-container">
            <h2>{content.secSuccess?.title}</h2>
          </div>
          <div className="numbers">
            <Block startCount={startCount} setStartCount={setStartCount} data={content.secSuccess?.chapters} />
          </div>
        </div>
      </section>

      <section className="partners partners-video">
        <div className="partners-logo-wrap">
          <div className="partners-video">
            <video src={size?.width > 640 ? "/assets/smoke-hq.mp4" : "/assets/smoke-lq.mp4"} loop muted preload="true" playsInline uk-video="autoplay: inview"></video>
          </div>
          <div className="partners-wrap" >
            <div className="uk-container">
              <h2>{content.partners?.title}</h2>
              {/*uk-scrollspy="cls: uk-animation-fade; target: .partners-item; delay: 500"*/}
              <div className="partners-items">


                {[0, 1, 2, 3, 4, 5].map(item =>
                  <div key={item} className="partners-item" style={{
                      backgroundImage: `url(${stateLogoPartners[item]})`
                    }}>
                  </div>)}


                {/*{!!content.partners && content.partners.logo.slice(0, 6).map((item, index) =>
                  <div key={index} className="partners-item">
                    <img className="uk-svg" src={urlFor(item).url()} uk-svg="" alt="logo-partners"/>
                  </div>)}*/}

              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

const Block = handleViewport(({ inViewport, forwardedRef, startCount, setStartCount, data }) => {

  if(inViewport){
    setStartCount(true)
  }

  return(
    <div className="uk-grid uk-child-width-1-1 uk-child-width-auto@s" uk-parallax="x: 40vw, -100vw; media: @s" uk-grid="" ref={forwardedRef}>
      {data?.length && data.map((item, index) => <div key={index} className="numer-item">
        {startCount && <CountUp
          start={0}
          end={parseInt(item.number)}
          duration={4}
          useEasing={true}
          useGrouping={true}
          redraw={true}
        />}
        <p>{item.title}</p>
      </div>)}
    </div>
  )
})

export default withRouter(Home)
