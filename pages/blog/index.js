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

  const queryBlog = `*[_type == 'blogSort'] {
    "content": content.${locale}
  }[0]`;

  const queryBlogArticles = `*[_type == 'blogItem'] | order(orderRank) {
    "content": content.${locale}
  }`;

  const blog = await sanityClient.fetch(queryBlog)
  const blogArticles = await sanityClient.fetch(queryBlogArticles)

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
      blog: blog.content,
      blogArticles: blogArticles,
      std: std[0]
    }
  }
}

const Blog = ({blogArticles, blog, std, router, globalSettings}) => {

  return <Page
    title={blog.meta?.title}
    description={blog.meta?.description}
    image={urlFor(blog.meta?.image).width(1200).height(630).auto('format').url()}
    ogTitle={blog.meta?.ogTitle}
    ogDescription={blog.meta?.ogDescription}
    head={blog.title}
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
      <link rel="alternate" hrefLang="de" href={`https://authenticagroup.cz/de/blog`} />
      <link rel="alternate" hrefLang="cs" href={`https://authenticagroup.cz/blog`}  />
    </Head>
    {!!blogArticles?.length && <section className="sec-center benefit-sec blog-sort position-sec uk-padding-remove-top">
      <div className="uk-container uk-container-large" uk-scrollspy="cls: uk-animation-fade; target: .article-info; delay: 500">
        <div className={`uk-grid uk-child-width-1-1 uk-child-width-1-3@s`} uk-grid="">
          {blogArticles.map((item, index) => <div key={index}>
            <a href={`/blog/${item.content.slug.current}`} className="article-info">
              <div className="img-wrap-art">
                <img
                  className="uk-img"
                  uk-img=""
                  src={urlFor(item.content.image).width(400).auto('format').url()}
                  alt={item.content.title} />
              </div>
              <div className="benefit-head">
                <h4>{item.content.title} <img src="/assets/arrow-right.svg" uk-svg="" /></h4>
              </div>
            </a>
          </div>)}
        </div>
      </div>
    </section>}

  </Page>
}

export default withRouter(Blog)