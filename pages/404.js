import {useState, useEffect} from 'react'
import Page from '../layout/Page'
import sanityClient from "../lib/sanity";
import BlockContent from "@sanity/block-content-to-react";
import { useRouter } from 'next/router'

import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

const query = (locale) => `*[_type == 'settings'] {
  "title": content.${locale}.notFound.title,
  "content": content.${locale}.notFound.text,
  "meta": content.${locale}.notFound.meta
}[0]`;

const NotFound = () => {

  const router = useRouter()
  const [data, setData] = useState()

  useEffect(() => {
    sanityClient.fetch(query(router.locale)).then(res => {
      setData(res)
    })
  }, [])

  if(!data?.title){
    return ''
  }

  return(
    <Page
      title={data.meta?.title}
      description={data.meta?.description}
      image={urlFor(data.meta?.image).width(1200).height(630).url()}
      ogTitle={data.meta?.ogTitle}
      ogDescription={data.meta?.ogDescription}
      head={data.title}
      heightAuto={true}
    >
      <section className="sec-center position-sec not-found">
        <div className="uk-container">
          <div className="big-sec">
            <p>{data.content}</p>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default NotFound
