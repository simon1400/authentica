import {useEffect} from 'react'
import Page from '../../layout/Page'
import Link from 'next/link'
import Head from 'next/head'
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

  const queryJob = `*[_type == 'job'] {
    "content": content.${locale}
  }[0]`;
  const queryJobOff = `*[_type == 'jobOff'] {
    "content": content.${locale}
  }`;

  const job = await sanityClient.fetch(queryJob)
  const jobOff = await sanityClient.fetch(queryJobOff)

  // if (!job.content?.title) {
  //   return {
  //     redirect: {
  //       destination: locale === 'cs' ? '/' : '/' + locale,
  //       permanent: false,
  //     },
  //   }
  // }

  const globalSettings = await sanityClient.fetch(`*[_type == 'settings'].content.${locale}`)

  return {
    props: {
      globalSettings: globalSettings[0],
      job: job.content,
      jobOff: jobOff,
      std: std[0]
    }
  }
}

const Position = ({job, jobOff, std, router, globalSettings}) => {

  console.log(jobOff);

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
      title={job.meta?.title}
      description={job.meta?.description}
      image={urlFor(job.meta?.image).width(1200).height(630).auto('format').url()}
      ogTitle={job.meta?.ogTitle}
      ogDescription={job.meta?.ogDescription}
      head={job.title}
      gtmData={globalSettings?.gtm}
      endTitleData={globalSettings?.endTitle}
      heightAuto={true}
      lightMode={true}
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
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec" uk-scrollspy="cls: uk-animation-fade; delay: 600">
            <BlockContent blocks={job.content} serializers={serializers} />
          </div>
        </div>
      </section>

      {!!job.images?.length && <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
        <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-${job.images.length < 3 ? job.images.length : '3'}@s`} uk-grid="">
          {job.images.map((image, indexImage) => <div key={indexImage}>
            <div className={`article-info ${job.images.length > 1 ? 'square-img' : ''}`}>
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

      {!!jobOff.length && !!jobOff[0]?.content && jobOff.map((item, index) => <section key={index} className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              {!!job?.subtitle?.length && !index && <div className="uk-margin-large-bottom uk-margin-large-top" uk-scrollspy="cls: uk-animation-fade; delay: 300"><h2>{job?.subtitle}</h2></div>}
              {!!item.content?.title && <div uk-scrollspy="cls: uk-animation-fade; delay: 300"><h3>{item.content?.title}</h3></div>}
              {!!item.content?.content && <div uk-scrollspy="cls: uk-animation-fade; delay: 500"><BlockContent blocks={item.content?.content} serializers={serializers} /></div>}
              {!!item.content?.slug?.current?.length && <Link href={`/kariera/${item.content.slug.current}`}>
                <a className="button bare" uk-scrollspy="cls: uk-animation-fade; delay: 700">
                  <span>více informací</span>
                  <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
                </a>
              </Link>}
            </div>
          </div>
        </div>
      </section>)}

    </Page>
  )
}

export default withRouter(Position)
