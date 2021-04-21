import {useState} from 'react'
import Page from '../layout/Page'
import CountUp from 'react-countup';

import handleViewport from 'react-in-viewport';

import { sanityStaticProps, useSanityQuery, PortableText, imageUrlBuilder } from "../lib/sanity";

const urlFor = source => imageUrlBuilder.image(source)

const query = (local) => {
  return `*[_type == 'homepage'] {
    "content": content.${local}
  }[0]`
};

export const getServerSideProps = async (context) => ({
  props: await sanityStaticProps({context, query: query(context.locale)})
})

const Home = (props) => {

  var { data, loading, error } = useSanityQuery(query, props);
  const [startCount, setStartCount] = useState(false)
  data = data.content

  return (
    <Page title="Homepage" head={data.title}>
      {!!data.media.video && <section className="video-bg">
          <iframe width="100%" src={`https://www.youtube.com/embed/${data.media.video}?controls=0&showinfo=0&autohide=1&modestbranding=1&autoplay=1&mute=1&loop=1`} frameBorder="0" allow='autoplay; encrypted-media' allowFullScreen></iframe>
          {/*<video src="https://youtu.be/Znm9UlsFm5k" loop muted playsInline uk-video="autoplay: inview"></video>*/}
        </section>}

      {!!data.media.image && <section className="sec-center">
          <img src={urlFor(data.media.image).url()} alt="" />
          <div className="uk-overlay-primary uk-position-cover sec-info">
            {/*<div className="uk-container">
              <div className="uk-width-2-3">
                <img className="uk-svg sec-logo-partner" src={urlFor(item.logo)} uk-svg="" alt="logo"/>
                <PortableText blocks={item.content} />
                <a href="/" className="button bare"><span>{item.button.name}</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
              </div>
            </div>*/}
          </div>
        </section>}

      <section className="sec-center">
        <div className="uk-container">
          <div className="big-sec">
            <div>
              <PortableText blocks={data.content} />
            </div>
            <button className="button">{data.button.name} <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></button>
          </div>
        </div>
      </section>

      {data.firmArr.map((item, index) => <section key={index} className="sec-center">
        <img src={urlFor(item.background).url()} alt="" />
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-2-3">
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
            <h2>{data.secSuccess.title}</h2>
          </div>
          <div className="numbers">
            <Block startCount={startCount} setStartCount={setStartCount} data={data.secSuccess.chapters} />
          </div>
        </div>
      </section>

      <section className="partners partners-video">
        <div className="partners-logo-wrap">
          <div className="partners-video">
            <video src="/assets/partners.mp4" loop muted playsInline uk-video="autoplay: inview"></video>
          </div>
          <div className="partners-wrap">
            <div className="uk-container">
              <h2>{data.partners.title}</h2>
              <div className="partners-items">
                {data.partners.logo.map((item, index) => <div key={index} className="partners-item">
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
    <div className="uk-grid uk-child-width-auto" uk-parallax="x: 50vw, -50vw" uk-grid="" ref={forwardedRef}>
      {data.map((item, index) => <div key={index} className="numer-item">
        {startCount && <CountUp
          start={0}
          end={parseInt(item.number)}
          duration={2}
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
