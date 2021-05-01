import Page from '../../layout/Page'
import Head from 'next/head'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

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

  if (!data?._id) {
    return {
      redirect: {
        destination: locale === 'cs' ? '/' : '/' + locale,
        permanent: false,
      },
    }
  }

  return {
    props: {
      content: data.content,
      std: std[0]
    }
  }
}

const FullPosition = ({content, std}) => {

  return(
    <Page
      title={content.meta?.title}
      description={content.meta?.description}
      image={urlFor(content.meta?.image).width(1200).height(630).url()}
      ogTitle={content.meta?.ogTitle}
      ogDescription={content.meta?.ogDescription}
      head={content.title}
      heightAuto={true}
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
      </Head>
      {content.content && <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec">
            <BlockContent blocks={content.content} />
          </div>
        </div>
      </section>}
      {content.description && <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <BlockContent blocks={content.description} />
          </div>
        </div>
      </section>}
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              <p>
                {!!content.phone?.length && <a href={`tel:${content.phone.split(' ').join('')}`}>{content.phone}</a> && <br />}
                {!!content.email?.length && <a href={`mailto:${content.email}`}>{content.email}</a>}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default FullPosition