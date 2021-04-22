import Page from '../../layout/Page'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

export async function getServerSideProps({params, locale}) {

  const query = `*[_type == 'article' && content.${locale}.slug.current == $url] {
    "content": content.${locale}
  }[0]`;

  const data = await sanityClient.fetch(query, {url: params.article})

  return {
    props: {
      content: data.content
    }
  }
}

const Article = ({content}) => {

  return(
    <Page
      title={content.meta.title}
      description={content.meta.description}
      image={urlFor(content.meta.image).url()}
      ogTitle={content.meta.ogTitle}
      ogDescription={content.meta.ogDescription}
      head={content.title}
      logoHead={content.logo}
    >
      <section className="video-bg">
        <video src="/assets/top-video.mp4" loop muted preload="" playsInline uk-video="autoplay: inview"></video>
      </section>
      <section className="sec-center sec-min">
        <div className="uk-container">
          <div className="big-sec">
            <BlockContent blocks={content.content} />
            <button className="button">{content.button.name} <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></button>
          </div>
        </div>
      </section>

      {content.chapters.map((item, index) => <section key={index} className="sec-auto article-sec">
        {!!item.title && <div className="uk-container">
          <h2>{item.title}</h2>
        </div>}
        {!!item.images?.length && <div className="uk-container uk-container-large">
          <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${item.images.length < 4 ? item.images.length : '4'}@s`} uk-grid="">
            {item.images.map((image, indexImage) => <div key={indexImage} className="article-info">
              <img src={urlFor(image).url()} alt="Article info" />
            </div>)}
          </div>
        </div>}
        {!!item.content && <div className={`uk-container ${!!item.images?.length ? 'mr-top' : ''}`}>
          <BlockContent blocks={item.content} />
        </div>}
      </section>)}

      <section className="partners without-video">
        <div className="uk-container">
          <h2>{content.partners.title}</h2>
        </div>
        <div className="partners-wrap">
          <div className="uk-container">
            <div className="partners-items">
              {content.partners.logo.map((item, index) => <div key={index} className="partners-item">
                <img className="uk-svg" src={urlFor(item).url()} uk-svg="" alt="logo-partners"/>
              </div>)}
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default Article
