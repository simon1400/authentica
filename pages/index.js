import Page from '../layout/Page'

 const Home = () => {
  return (
    <Page title="Homepage" head="Nechte prostor vyprávět váš příběh.">
      <section className="video-bg">
        <video src="/assets/top-video.mp4" loop muted playsInline uk-video="autoplay: inview"></video>
      </section>
      <section className="sec-center">
        <div className="uk-container">
          <div className="big-sec">
            <div>
              <p>Dopřejte vašim zákazníkům unikátní vizuální zážitek, spolehněte se na práci profesionálů a starosti s realizací nechte na nás.</p>
            </div>
            <button className="button">O NÁS <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></button>
          </div>
        </div>
      </section>
      <section className="sec-center">
        <img src="/assets/sec-1.jpg" alt="" />
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-2-3">
              <img className="uk-svg sec-logo-partner" src="/assets/authentica-logo.svg" uk-svg="" alt="logo"/>
              <p>Pomáháme společnostem předat jejich vizuální sdělení, která nezůstanou bez povšimnutí. Spolupracujeme s řadou světových i domácích značek, které s naší pomocí vyčnívají z davu.</p>
              <a href="/" className="button bare"><span>více o authentica</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
          </div>
        </div>
        </div>
      </section>
      <section className="sec-center">
        <img src="/assets/sec-2.jpg" alt="" />
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-2-3">
              <img className="uk-svg sec-logo-partner" src="/assets/fulfullment-logo.svg" uk-svg="" alt="logo"/>
              <p>Řekněte sbohem starostem s logistikou a svěřte své podnikání do rukou profesionálního Fulfillment centra. Nadstandardní služby, okamžitý přehled o stavu objednávek i osobní account manager jen pro vás.</p>
              <a href="/" className="button bare"><span>více o Fulfillment</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
          </div>
        </div>
        </div>
      </section>
      <section className="sec-center">
        <img src="/assets/sec-3.jpg" alt="" />
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-2-3">
              <img className="uk-svg sec-logo-partner" src="/assets/grd-servis-logo.svg" uk-svg="" alt="logo"/>
              <p>Pod našima rukama se vize našich klientů stávají realitou. Naší doménou je papír a výrobky z něj, od osvědčených dodavatelů z celého světa.</p>
              <a href="/" className="button bare"><span>více o GRD servis</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
            </div>
          </div>
        </div>
      </section>
      <section className="sec-center">
        <img src="/assets/sec-4.jpg" alt="" />
        <div className="uk-overlay-primary uk-position-cover sec-info">
          <div className="uk-container">
            <div className="uk-width-2-3">
              <img className="uk-svg sec-logo-partner" src="/assets/craftwork-logo.svg" uk-svg="" alt="logo"/>
              <p>Dáváme šanci lidem se zdravotním hendikepem se plnohodnotně zapojit na trhu práce. Pro naše klienty vyrábíme a skládáme obaly, šijeme, kompletujeme a poskytujeme firmám náhradní plnění.</p>
              <a href="/" className="button bare"><span>více o Craftwork</span> <img className="uk-svg" src="/assets/arrow-right.svg" uk-svg="" alt="Right"/></a>
          </div>
        </div>
        </div>
      </section>
      <section className="sec-center">
        <div className="uk-width-expand">
          <div className="uk-container">
            <h2>Naše úspěchy v číslech.</h2>
          </div>
          <div className="numbers">
            <div className="uk-grid uk-child-width-1-5" uk-grid="">
              <div className="numer-item">
                <span>18</span>
                <p>let odborné práce</p>
              </div>
              <div className="numer-item">
                <span>15tis</span>
                <p>uspěšných projektů ročně</p>
              </div>
              <div className="numer-item">
                <span>250</span>
                <p>spokojených zaměstnců</p>
              </div>
              <div className="numer-item">
                <span>3</span>
                <p>pobočky v evropě</p>
              </div>
              <div className="numer-item">
                <span>74</span>
                <p>prestižních ocenění</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="partners partners-video">
        <div className="partners-logo-wrap">
          <div className="partners-video">
            <video src="/assets/partners.mp4" loop muted playsInline uk-video="autoplay: inview"></video>
          </div>
          <div className="partners-wrap">
            <div className="uk-container">
              <h2>Naši spokojení klienti, kteří nám pravidelně svěřují svou důvěru.</h2>
              <div className="partners-items">
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/1.svg" uk-svg="" alt="logo-partners"/>
                </div>
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/2.svg" uk-svg="" alt="logo-partners"/>
                </div>
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/3.svg" uk-svg="" alt="logo-partners"/>
                </div>
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/4.svg" uk-svg="" alt="logo-partners"/>
                </div>
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/5.svg" uk-svg="" alt="logo-partners"/>
                </div>
                <div className="partners-item">
                  <img className="uk-svg" src="/assets/partners-logo/6.svg" uk-svg="" alt="logo-partners"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default Home
