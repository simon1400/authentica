import {useState} from 'react'
import Page from '../layout/Page'
import CountUp from 'react-countup';

import handleViewport from 'react-in-viewport';

import sanityClient from "../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

export async function getStaticProps({params, locale}) {

  const query = `*[_type == 'homepage'][0].content.${locale} {
    title,
    meta,
    media,
    button,
    "linkButton": *[_type in ['article', 'jobOff'] && _id in [^.button.link._ref]]{
      "slug": content.${locale}.slug.current,
      "type": _type
    }[0],
    firmArr,
    secSuccess,
    partners,
    content
  }`

  const data = await sanityClient.fetch(query)

  const linksArr = []
  if(data?.firmArr && data?.firmArr.length){
    for(var i = 0; i < data?.firmArr.length; i++){
      if(data.firmArr[i].button.link){
        linksArr.push(data.firmArr[i].button.link._ref)
      }else{
        linksArr.push('-')
      }
    }
  }


  const queryLinks = `*[_type in ['article', 'jobOff'] && _id in [${linksArr.map(item => `"${item}"`)}]]{
    _id,
    _type,
    "slug": content.${locale}.slug.current
  }`

  const links = await sanityClient.fetch(queryLinks)

  if(data?.firmArr && data?.firmArr.length){
    for(var i = 0; i < data.firmArr.length; i++){
      for(var a = 0; a < links.length; a++){
        if(data.firmArr[i].button.link?._ref == links[a]._id){
          data.firmArr[i].button.link = `${links[a]._type === 'article' ? '' : '/pozice'}/${links[a].slug}`
        }
      }
    }
  }

  return {
    props: {
      data
    }
  }
}

const Home = ({data, linksArr, links}) => {

  const [startCount, setStartCount] = useState(false)

  const content = data

  if(!data?.title){
    return ''
  }

  return (
    <Page
      title={content?.meta?.title}
      description={data?.meta?.description}
      image={urlFor(data?.meta?.image).url()}
      ogTitle={data?.meta?.ogTitle}
      ogDescription={data?.meta?.ogDescription}
      head={content?.title}
      heightAuto={!data?.videoFile && !content?.media?.iamge}
    >
      <section className="video-bg">
        <video src="/assets/top-video.mp4" loop muted preload="true" playsInline uk-video="autoplay: inview"></video>
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
            <div>
              <BlockContent blocks={content.content} />
            </div>
            {(!!content.button?.name?.length && !!content.linkButton?.slug.length) && <a href={`${content.linkButton.type === 'jobOff' ? '/pozice' : ''}/${content.linkButton.slug}`} className="button">{content.button?.name} <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>}
          </div>
        </div>
      </section>

      {content.firmArr.map((item, index) => <section key={index} className="sec-center">
        {!!item.background && <img src={urlFor(item.background).url()} alt="" />}
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-1-1 uk-width-2-3@s">
              <div uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 300">
                <img className="uk-svg sec-logo-partner" src={urlFor(item.logo)} uk-svg="" alt="logo"/>
              </div>
              <div uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 500">
                <BlockContent blocks={item.content} />
              </div>
              {(!!item.button.link && !!item.button.name) && <div uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 700"><a href={item.button.link} className="button bare" ><span>{item.button.name}</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a></div>}
            </div>
          </div>
        </div>
      </section>)}

      <section className="sec-center">
        <div className="uk-width-expand">
          <div className="uk-container">
            <h2>{content.secSuccess.title}</h2>
          </div>
          <div className="numbers">
            <Block startCount={startCount} setStartCount={setStartCount} data={content.secSuccess.chapters} />
          </div>
        </div>
      </section>

      <section className="partners partners-video">
        <div className="partners-logo-wrap">
          <div className="partners-video">
            <video src="/assets/partners.mp4" loop muted preload="true" playsInline uk-video="autoplay: inview"></video>
          </div>
          <div className="partners-wrap" uk-scrollspy="cls: uk-animation-fade; target: .partners-item; delay: 500; repeat: true">
            <div className="uk-container">
              <h2>{content.partners.title}</h2>
              <div className="partners-items">
                {content.partners.logo.map((item, index) => {
                  if(index < 6){
                    return(
                      <div key={index} className="partners-item">
                        <img className="uk-svg" src={urlFor(item).url()} uk-svg="" alt="logo-partners"/>
                      </div>
                    )
                  }
                  return ''
                })}
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
      {data.map((item, index) => <div key={index} className="numer-item">
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

export default Home
