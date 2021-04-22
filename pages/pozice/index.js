import Page from '../../layout/Page'

const Position = () => {
  return(
    <Page title="Pozice" head={"Volné pracovní pozice"} heightAuto={true}>
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
              <h2>Skladník</h2>
              {/*<PortableText blocks={content.content} />*/}
              <p>Jsme Authentica, česká společnost s centrálou v Brně. Náš tým tvoří kolegové s bohatými pracovními zkušenostmi z různých oborů, kteří dokáží najít inovativní.</p>
              <button className="button bare">
                více informací
                {/*{content.button.name}*/}
                <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
              </button>
          </div>
          </div>
        </div>
      </section>
      <section className="sec-center position-sec">
        <div className="uk-container">
          <div className="big-sec small-text">
            <div>
              <h2>Skladník</h2>
              {/*<PortableText blocks={content.content} />*/}
              <p>Jsme Authentica, česká společnost s centrálou v Brně. Náš tým tvoří kolegové s bohatými pracovními zkušenostmi z různých oborů, kteří dokáží najít inovativní.</p>
              <button className="button bare">
                více informací
                {/*{content.button.name}*/}
                <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/>
              </button>
          </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default Position
