import Link from 'next/link'
import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import sanityClient from "../../lib/sanity";
import imageUrlBuilder from "@sanity/image-url";
import { Scrollbars } from 'react-custom-scrollbars'

const imageBuilder = imageUrlBuilder(sanityClient);
const urlFor = source => imageBuilder.image(source)

const navQuery = (local) => {
  return `*[_type == 'nav'].content.${local} {
    topNav,
    secNav
  }`
};

const Header = ({
  head,
  logoHead = false,
  heightAuto = false,
  lightMode,
  topImg
}) => {

  const router = useRouter()
  const [menu, setMenu] = useState(false)

  const [topNav, setTopNav] = useState([])
  const [secNav, setSecNav] = useState([])

  useEffect(() => {
    getMenu()
  }, [])

  useEffect(() => {
    getMenu()
  }, [router.locale])

  useEffect(() => {
    if(menu){
      document.body.style.overflowY = 'hidden'
    }else{
      document.body.style.overflowY = 'scroll'
    }
  }, [menu])

  const getMenu = async () => {
    var data = await sanityClient.fetch(navQuery(router.locale))

    data = data[0]

    const linksArr = []
    if(data?.topNav && data?.topNav.length){
      for(var i = 0; i < data?.topNav.length; i++){
        if(data.topNav[i].link){
          linksArr.push(data.topNav[i].link._ref)
        }else{
          linksArr.push('-')
        }
      }
      for(var i = 0; i < data?.secNav.length; i++){
        if(data.secNav[i].link){
          linksArr.push(data.secNav[i].link._ref)
        }else{
          linksArr.push('-')
        }
      }
    }

    const queryLinks = `*[_type in ['article', 'jobOff', 'category'] && _id in [${linksArr.map(item => `"${item}"`)}]]{
      _id,
      _type,
      "slug": content.${router.locale}.slug.current
    }`

    const links = await sanityClient.fetch(queryLinks)

    if(data?.topNav && data?.topNav.length){
      for(var i = 0; i < data.topNav.length; i++){
        for(var a = 0; a < links.length; a++){
          if(data.topNav[i].link?._ref == links[a]._id){
            data.topNav[i].link = `${links[a]._type === 'jobOff' ? '/kariera' : ''}/${links[a].slug}`
          }
        }
      }
      for(var i = 0; i < data.secNav.length; i++){
        for(var a = 0; a < links.length; a++){
          if(data.secNav[i].link?._ref == links[a]._id){
            data.secNav[i].link = `${links[a]._type === 'jobOff' ? '/kariera' : ''}/${links[a].slug}`
          }
        }
      }
    }

    setTopNav(data?.topNav)
    setSecNav(data?.secNav)
  }

  const toggleMenu = () => {
    setMenu(!menu)
  }

  return (
    <header className={`${heightAuto ? 'height-auto' : ''}${lightMode ? ' light-mode' : ''}${!!topImg ? ' rm-max-h' : ''}`}>
      <div className={`header-fix${menu ? ' active' : ''}`}>
        <div className="uk-container uk-container-large">
          <div className={`header-top${menu ? ' active' : ''}`}>
            <Link href="/"><a className="logo-wrap"><img className="uk-svg" src="/assets/authentica-group-logo.svg" alt="Authentica group" uk-svg=""/></a></Link>
            <div className="control-header">
              <div className="lang-wrap uk-visible@s">
                <ul>
                  <li className={`${router.locale === 'cs' ? "active-lang" : ''}`}><Link href={router.asPath} locale="cs"><a>cs</a></Link></li>
                  {/*<li className={`${router.locale === 'en' ? "active-lang" : ''}`}><Link href={router.asPath} locale="en"><a>en</a></Link></li>*/}
                  <li className={`${router.locale === 'de' ? "active-lang" : ''}`}><Link href={router.asPath} locale="de"><a>de</a></Link></li>
                </ul>
              </div>
              <div className="control-menu" onClick={() => toggleMenu()}>
                <span className="uk-visible@s">Menu</span>
                <button name="menu" className={`hamburger hamburger--collapse${menu ? ' is-active' : ''}`}>
                  <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`header-content${!!topImg ? ' top-img-content' : ''}`}>
        {!topImg && <div className="uk-container">
          {!!logoHead && <img className="uk-img" uk-scrollspy="cls: uk-animation-fade; delay: 300;" src={urlFor(logoHead).url()} uk-img="" alt="Logo article"/>}
          <h1 uk-scrollspy="cls: uk-animation-fade; delay: 500;">{head}</h1>
        </div>}
        {!!topImg && <div className="uk-container uk-container-large">
          <div className="pos-img-wrap">
            <img src={urlFor(topImg).url()} width="100%" uk-img="" alt="" />
            <div className="uk-container">
              <div className="pos-img-head">
                <h1>{head}</h1>
              </div>
            </div>
          </div>
        </div>}

      </div>

        <div className={`menu${menu ? ' active' : ''}`}>
          <Scrollbars autoHide>
            <div className="uk-container uk-height-1-1">
              <nav>

                <div>
                  <div className="lang-wrap uk-hidden@s">
                    <ul>
                      <li className={`${router.locale === 'cs' ? "active-lang" : ''}`}><Link href={router.asPath} locale="cs"><a>cs</a></Link></li>
                      {/*<li className={`${router.locale === 'en' ? "active-lang" : ''}`}><Link href={router.asPath} locale="en"><a>en</a></Link></li>*/}
                      <li className={`${router.locale === 'de' ? "active-lang" : ''}`}><Link href={router.asPath} locale="de"><a>de</a></Link></li>
                    </ul>
                  </div>
                  <ul className="topNav">
                    {!!topNav?.length && topNav.map((item, index) => (
                      <li key={index}>
                        <Link href={item.link}>
                          <a onClick={() => toggleMenu()}>{item.title}</a>
                        </Link>
                      </li>)
                    )}
                  </ul>
                  <ul className="secNav">
                    {!!secNav?.length && secNav.map((item, index) => (
                      <li key={index}>
                        <Link href={item.link}>
                          <a onClick={() => toggleMenu()}>{item.title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </div>
          </Scrollbars>
        </div>

    </header>
  )
}

export default Header
