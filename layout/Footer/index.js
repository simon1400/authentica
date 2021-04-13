const Footer = () => {
  return (
    <footer>
      <div className="uk-container">
        <div className="big-sec">
          <div>
            <h2>Chcete se o našich službách dozvědět víc? Ozvěte se nám!</h2>
          </div>
          <a className="button">info@authentica.cz <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Message"/></a>
        </div>
        <div className="footer-items-wrap" style={{gridTemplateColumns: 'repeat(2, 1fr)'}}>
          <div>
            <div className="footer-item">
              <h3>Česko</h3>
              <p><a href="/">+420 548 217 991</a> <br/>
                  <a href="/">authentica@authentica.cz</a></p>

              <p>Authentica group, s.r.o.</p>
              <p>Lazaretní 7<br/>
                  Brno<br/>
                  CZ-615 00</p>
            </div>
          </div>
          <div>
            <div className="footer-item">
              <h3>Německo</h3>
              <p><a href="/">+49 160 96636575</a> <br/>
                  <a href="/">authentica@authentica.cz</a></p>

              <p>Authentica group, s.r.o.</p>
              <p>Felsenstraße 36<br/>
                  Roßtal<br/>
                  D-90574</p>
            </div>
          </div>
    
        </div>
        <div className="footer-logo">
          <div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
