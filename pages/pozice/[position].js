import Page from '../../layout/Page'

const FullPosition = () => {
  return(
    <Page title="Full position" head={"Skladník"} heightAuto={true}>
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec">
            <div>
              {/*<PortableText blocks={content.content} />*/}
              <p>Jsme Authentica, česká společnost s centrálou v Brně. Náš tým tvoří kolegové s bohatými pracovními zkušenostmi z různých oborů, kteří dokáží najít inovativní.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              {/*<PortableText blocks={content.content} />*/}
              <p>
                <ul>
                  <li>odiofj isdjf jsdfs</li>
                  <li>dsjf psdifj psdjfpij d</li>
                  <li>sdopfk podskf podskf sdf</li>
                  <li>f sdoifj dspf psdf kopk</li>
                </ul>
              </p>
          </div>
          </div>
        </div>
      </section>
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              <p>
                <a href="/">+420 548 217 991</a><br />
                <a href="/">authentica@authentica.cz</a>
              </p>
          </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default FullPosition
