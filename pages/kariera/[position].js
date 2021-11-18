import {useEffect} from 'react'
import Page from '../../layout/Page'
import Head from 'next/head'
import Link from 'next/link'
import {withRouter} from 'next/router'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

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

  const queryControl = `*[_type == 'jobOff' && content.cs.slug.current == $url || content.en.slug.current == $url || content.de.slug.current == $url]{
    _id
  }[0]`

  const dataControl = await sanityClient.fetch(queryControl, {url: params.position})
  if(!dataControl?._id){
    return{
      notFound: true
    }
  }

  const query = `*[_type == 'jobOff' && content.${locale}.slug.current == $url] {
    _id,
    "content": content.${locale}
  }[0]`;

  const data = await sanityClient.fetch(query, {url: params.position})

  let benefits = [], peoples = []

  if(data.content.benefits?.length){
    for(var i = 0; i < data.content.benefits.length; i++){
      benefits[i] = await sanityClient.fetch(`*[_type == 'benefits' && _id in [${data.content.benefits[i].benefits.map(benefit => `"${benefit._ref}"`).toString()}]]{
         "title": content.${locale}.title,
         "image": content.${locale}.image
       }`)
    }
  }
  if(data.content.peoples?.length){
    peoples = await sanityClient.fetch(`*[_type == 'people' && _id in [${data.content.peoples.map(item => `"${item._ref}"`).toString()}]]{
       "name": content.${locale}.name,
       "image": content.${locale}.image,
       "function": content.${locale}.function,
       "text": content.${locale}.text
     }`)
  }

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
      globalSettings: globalSettings[0],
      content: data.content,
      std: std[0],
      benefits,
      peoples
    }
  }
}

const FullPosition = ({content, std, router, globalSettings, benefits, peoples}) => {

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
      heightAuto={true}
      lightMode={true}
      topImg={content?.image}
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
      {content.content && <section className={`sec-center position-sec${!!peoples[0] ? " uk-padding-remove-bottom" : ''}`}>
        <div className="uk-container">
          <div className="big-sec" uk-scrollspy="cls: uk-animation-fade; delay: 600">
            <BlockContent blocks={content.content} serializers={serializers} />
          </div>
        </div>
        {!!peoples?.[0] && <div className="uk-container uk-container-large">
          <div className="block-user-wrap">
            <div className="block-user left" uk-scrollspy="cls: uk-animation-slide-left-medium; delay: 2000">
              <div className="img-wrap-user">
                <img src={urlFor(peoples[0].image).width(50).height(50).auto('format').url()} uk-img=""/>
              </div>
              <p>{peoples[0].text}</p>
              <span><b>{peoples[0].name}</b> / {peoples[0].function}</span>
            </div>
          </div>
        </div>}
      </section>}
      {content.description && <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text" uk-scrollspy="cls: uk-animation-fade; delay: 600">
            <BlockContent blocks={content.description} serializers={serializers} />
          </div>
        </div>
        {!!peoples?.[1] && <div className="uk-container uk-container-large">
          <div className="block-user-wrap">
            <div className="block-user right" uk-scrollspy="cls: uk-animation-slide-right-medium; delay: 2000">
              <div className="img-wrap-user">
                <img src={urlFor(peoples[1].image).width(50).height(50).auto('format').url()} uk-img=""/>
              </div>
              <p>{peoples[1].text}</p>
              <span><b>{peoples[1].name}</b> / {peoples[1].function}</span>
            </div>
          </div>
        </div>}
        <div className="uk-container pos-sec-inside">
          <div className="big-sec small-text" uk-scrollspy="cls: uk-animation-fade; delay: 600">
            <div>
              {!!content.email?.length && <a href={`mailto:${content.email}`} className="button">{content.email} <img className="uk-svg" src="/assets/envelope.svg" uk-svg="" alt="Message"/></a>}
            </div>
          </div>
        </div>
      </section>}

      {!!benefits?.length && benefits.map((item, index) => <section key={index} className="sec-center benefit-sec position-sec uk-padding-remove-top">
        <div className="uk-container uk-margin-large-bottom">
          <h2>Co od nás za svou práci dostaneš?</h2>
        </div>
         <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
          <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${item.length < 3 ? item.length : '3'}@s`} uk-grid="">
            {item.map((benefit, indexBenefit) => <div key={indexBenefit}>
              <div className={`article-info ${item.length > 1 ? 'square-img' : ''}`}>
                <img
                  className="uk-img"
                  uk-img=""
                  src={urlFor(benefit.image).width(540).height(540).auto('format').url()}
                  alt={benefit.title} />
                <div className="benefit-head">
                  <h4>{benefit.title}</h4>
                </div>
              </div>
            </div>)}
          </div>
        </div>
      </section>)}

      {!!benefits?.length && <section className="sec-center position-sec pos-sec-inside uk-padding-remove-top">
        <div className="uk-container">
          <div className="big-sec small-text bottom-button" uk-scrollspy="cls: uk-animation-fade; delay: 600">
            <div>
              {!!content.email?.length && <a href={`mailto:${content.email}`} className="button">{content.email} <img className="uk-svg" src="/assets/envelope.svg" uk-svg="" alt="Message"/></a>}
            </div>
          </div>
        </div>
      </section>}

    </Page>
  )
}

export default withRouter(FullPosition)
