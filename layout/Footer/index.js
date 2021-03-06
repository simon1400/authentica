import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)
import BlockContent from "@sanity/block-content-to-react";

const serializers = {
  marks: {
    link: ({mark, children}) => <Link href={mark.href}><a>{children}</a></Link>
  }
}

const query = (local) => {
  return `*[_type == 'footer'].content.${local}{
    title,
    addreses,
    logos,
    button
  }`
};


const Footer = ({lightMode}) => {

  const router = useRouter()
  const [footer, setFooter] = useState({})

  useEffect(async () => {
    const footer = await sanityClient.fetch(query(router.locale))
    setFooter(footer[0])
  }, [])
  useEffect(async () => {
    const footer = await sanityClient.fetch(query(router.locale))
    setFooter(footer[0])
  }, [router.locale])

  if(!footer?.title){
    return ''
  }

  return (
    <footer className={lightMode ? 'light-mode' : ''}>
      <div className="uk-container">
        {!lightMode && <div className="big-sec">
          <div>
            <h2>{footer.title}</h2>
          </div>
          <a href={`mailto:${footer.button.exterLink}`} className="button">{footer.button.name} <img className="uk-svg" src="/assets/envelope.svg" uk-svg="" alt="Message"/></a>
        </div>}
        {!lightMode && <div className="footer-items-wrap" style={{gridTemplateColumns: `repeat(${footer.addreses.length < 4 ? footer.addreses.length : '4'}, 1fr)`}}>
          {footer.addreses.map((item, index) => <div key={index}>
            <div className="footer-item">
              <h3>{item.title}</h3>
              <BlockContent blocks={item.content} serializers={serializers} />
            </div>
          </div>)}
        </div>}
        <div className="footer-logo">
          {footer.logos.map((item, index) => <a href={item.button?.exterLink} key={index}><img src={urlFor(item.image).url()} uk-svg="" /></a>)}
        </div>
      </div>
    </footer>
  )
}

export default Footer
