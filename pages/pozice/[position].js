import Page from '../../layout/Page'

import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

export async function getServerSideProps({params, locale}) {

  const query = `*[_type == 'jobOff' && content.${locale}.slug.current == $url] {
    "content": content.${locale}
  }[0]`;

  const data = await sanityClient.fetch(query, {url: params.position})

  return {
    props: {
      content: data.content
    }
  }
}

const FullPosition = ({content}) => {

  return(
    <Page
      title={content.meta?.title}
      description={content.meta?.description}
      image={urlFor(content.meta?.image).url()}
      ogTitle={content.meta?.ogTitle}
      ogDescription={content.meta?.ogDescription}
      head={content.title}
      heightAuto={true}
    >
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
