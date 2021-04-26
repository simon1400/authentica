import Page from '../../layout/Page'

import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

export async function getServerSideProps({params, locale}) {

  const queryJob = `*[_type == 'job'] {
    "content": content.${locale}
  }[0]`;
  const queryJobOff = `*[_type == 'jobOff'] {
    "content": content.${locale}
  }`;

  const job = await sanityClient.fetch(queryJob)
  const jobOff = await sanityClient.fetch(queryJobOff)

  if (!job.content?.title) {
    return {
      redirect: {
        destination: locale === 'cs' ? '/' : '/' + locale,
        permanent: false,
      },
    }
  }

  return {
    props: {
      job: job.content,
      jobOff: jobOff
    }
  }
}

const Position = ({job, jobOff}) => {

  return(
    <Page
      title={job.meta?.title}
      description={job.meta?.description}
      image={urlFor(job.meta?.image).width(1200).height(630).url()}
      ogTitle={job.meta?.ogTitle}
      ogDescription={job.meta?.ogDescription}
      head={job.title}
      heightAuto={true}
    >
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec">
            <BlockContent blocks={job.content} />
          </div>
        </div>
      </section>

      {jobOff.map((item, index) => <section key={index} className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              {!!item.content?.title && <h2>{item.content.title}</h2>}
              <BlockContent blocks={item.content.content} />
              {!!item.content?.slug?.current?.length && <a href={`/pozice/${item.content.slug.current}`} className="button bare">
                <span>více informací</span>
                <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
              </a>}
          </div>
          </div>
        </div>
      </section>)}

    </Page>
  )
}

export default Position
