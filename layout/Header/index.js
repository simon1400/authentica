import Link from 'next/link'
import {useState} from 'react'

const Header = ({
  head,
  logoHead = false
}) => {

  const [menu, setMenu] = useState(false)

  const toggleMenu = () => {
    setMenu(!menu)
  }

  return (
    <header>
      <div className={`header-fix${menu ? ' active' : ''}`}>
        <div className="uk-container uk-container-large">
          <div className={`header-top${menu ? ' active' : ''}`}>
            <Link href="/">
              <a className="logo-wrap"><img className="uk-svg" src="/assets/authentica-group-logo.svg" alt="Authentica" uk-svg=""/></a>
            </Link>
            <div className="control-header">
              <div className="lang-wrap uk-visible@s">
                <ul>
                  <li><a href="/">cz</a></li>
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
          {!!logoHead && <img className="uk-svg" src={logoHead} uk-svg="" alt="Logo article"/>}
          <h1>{head}</h1>
        </div>
      </div>
      <div className={`menu${menu ? ' active' : ''}`}>
        <div className="uk-container uk-height-1-1">
          <nav>
            <ul>
              <li><a href="/">O nás</a></li>
              <li><a href="/">Authentica</a></li>
              <li><a href="/">Fulfillment</a></li>
              <li><a href="/">GRD servis</a></li>
              <li><a href="/">Craftwork</a></li>
              <li><a href="/">Kontakty</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
