import Link from 'next/link'

const Header = ({
  head,
  logoHead
}) => {
  return (
    <header>
      <div className="uk-container uk-container-large">
        <div className="header-top">
          <Link href="/">
            <a className="logo-wrap"><img className="uk-svg" src="/assets/authentica-group-logo.svg" alt="Authentica" uk-svg=""/></a>
          </Link>
          <div className="control-header">
            <div className="lang-wrap">
              <ul>
                <li><a href="/">cz</a></li>
                <li><a href="/">en</a></li>
                <li><a href="/">de</a></li>
              </ul>
            </div>
            <div className="control-menu">
              <span>Menu</span>
              <button className="hamburger hamburger--collapse">
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="header-content">
        <div className="uk-container">
          <img className="uk-svg" src={logoHead} uk-svg="" alt="Logo article"/>
          <h1>{head}</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
