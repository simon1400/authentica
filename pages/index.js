import {useState} from 'react'
import Page from '../layout/Page'
import CountUp from 'react-countup';

import handleViewport from 'react-in-viewport';

import { sanityStaticProps, useSanityQuery, PortableText, imageUrlBuilder } from "../lib/sanityNext";

const urlFor = source => imageUrlBuilder.image(source)

const query = (local) => {
  return `*[_type == 'homepage'] {
    "content": content.${local},
    "videoFiles": content.cs.media.videoFile.asset->url
  }[0]`
};

export const getServerSideProps = async (context) => ({
  props: await sanityStaticProps({context, query: query(context.locale)})
})

const Home = (props) => {

  var { data, loading, error } = useSanityQuery(query, props);
  const [startCount, setStartCount] = useState(false)
  const content = data.content

  return (
    <Page title="Homepage" head={content.title} heightAuto={!data.videoFiles && !content.media.iamge}>
      {!!data.videoFiles && <section className="video-bg">
        <video src={data.videoFiles} loop muted playsInline uk-video="autoplay: inview"></video>
      </section>}

      {!!content.media.iamge && !data.videoFiles && <section className="sec-center">
          <img src={urlFor(content.media.iamge).url()} alt="" />
        </section>}

      <section className="sec-center sec-min">
        <div className="uk-container">
          <div className="big-sec">
            <div>
              <PortableText blocks={content.content} />
            </div>
            <button className="button">{content.button.name} <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></button>
          </div>
        </div>
      </section>

      {content.firmArr.map((item, index) => <section key={index} className="sec-center">
        {!!item.background && <img src={urlFor(item.background).url()} alt="" />}
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-1-1 uk-width-2-3@s">
              <img className="uk-svg sec-logo-partner" src={urlFor(item.logo)} uk-svg="" alt="logo"/>
              <PortableText blocks={item.content} />
              <a href="/" className="button bare"><span>{item.button.name}</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
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
            <video src="/assets/partners.mp4" loop muted preload playsInline uk-video="autoplay: inview"></video>
          </div>
          <div className="partners-wrap">
            <div className="uk-container">
              <h2>{content.partners.title}</h2>
              <div className="partners-items">
                {content.partners.logo.map((item, index) => <div key={index} className="partners-item">
                  <img className="uk-svg" src={urlFor(item).url()} uk-svg="" alt="logo-partners"/>
                </div>)}
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
    <div className="uk-grid uk-child-width-1-1 uk-child-width-auto@s uk-flex-nowrap" uk-parallax="x: 50vw, -50vw; media: @s" uk-grid="" ref={forwardedRef}>
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
