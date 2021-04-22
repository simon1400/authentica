import Link from 'next/link'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

const navQuery = (local) => {
  return `*[_type == 'nav'].content.${local} {
    "titleTopNav": topNav[].title,
    "linksTopNav": *[_type in ["article", "jobOff", "category"] && _id in ^.topNav[].link._ref].content.${local}.slug.current,
    "typesTopNav": *[_type in ["article", "jobOff", "category"] && _id in ^.topNav[].link._ref]._type,
    "titleSecNav": secNav[].title,
    "linksSecNav": *[_type in ["article", "jobOff", "category"] && _id in ^.secNav[].link._ref].content.${local}.slug.current,
    "typesSecNav": *[_type in ["article", "jobOff", "category"] && _id in ^.secNav[].link._ref]._type
  }`
};

const Header = ({
  head,
  logoHead = false,
  heightAuto = false
}) => {

  const router = useRouter()
  const [menu, setMenu] = useState(false)

  const [topNav, setTopNav] = useState([])
  const [secNav, setSecNav] = useState([])

  useEffect(async () => {
    const nav = await sanityClient.fetch(navQuery(router.locale))
    const topNavData = nav[0].titleTopNav.map((item, index) => {
      return {
        title: item,
        link: `${nav[0].typesTopNav[index] === 'jobOff' ? '/pozice' : ''}/${nav[0].linksTopNav[index]}`,
      }
    })
    const secNavData = nav[0].titleSecNav.map((item, index) => {
      return {
        title: item,
        link: `${nav[0].typesSecNav[index] === 'jobOff' ? '/pozice' : ''}/${nav[0].linksSecNav[index]}`
      }
    })
    setTopNav(topNavData)
    setSecNav(secNavData)
  }, [])

  const toggleMenu = () => {
    setMenu(!menu)
  }

  return (
    <header className={heightAuto ? 'height-auto' : ''}>
      <div className={`header-fix${menu ? ' active' : ''}`}>
        <div className="uk-container uk-container-large">
          <div className={`header-top${menu ? ' active' : ''}`}>
            <Link href="/">
              <a className="logo-wrap"><img className="uk-svg" src="/assets/authentica-group-logo.svg" alt="Authentica" uk-svg=""/></a>
            </Link>
            <div className="control-header">
              <div className="lang-wrap uk-visible@s">
                <ul>
                  <li className="active-lang"><a href="/">cz</a></li>
                  <li><a href="/">en</a></li>
                  <li><a href="/">de</a></li>
                </ul>
              </div>
              <div className="control-menu" onClick={() => toggleMenu()}>
                <span className="uk-visible@s">Menu</span>
                <button className={`hamburger hamburger--collapse${menu ? ' is-active' : ''}`}>
                  <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-content">
        <div className="uk-container">
          {!!logoHead && <img className="uk-svg" src={urlFor(logoHead).url()} uk-svg="" alt="Logo article"/>}
          <h1>{head}</h1>
        </div>
      </div>
      <div className={`menu${menu ? ' active' : ''}`}>
        <div className="uk-container uk-height-1-1">
          <nav>
            <div>
              <ul className="topNav">
                {topNav.map((item, index) => <li key={index}><a href={item.link}>{item.title}</a></li>)}
              </ul>
              <ul className="secNav">
                {secNav.map((item, index) => <li key={index}><a href={item.link}>{item.title}</a></li>)}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
