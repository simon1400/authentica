import Page from '../../layout/Page'

import { sanityStaticProps, useSanityQuery, PortableText, imageUrlBuilder } from "../../lib/sanity";

const urlFor = source => imageUrlBuilder.image(source)

const query = (local, url) => {
  return `*[_type == 'article'] {
    "content": content.${local}
  }[0]`
};

export const getServerSideProps = async (context) => ({
  props: await sanityStaticProps({context, query: query(context.locale, context.math)})
})

const Article = () => {
  return(
    <Page title="Article" head="Váš příběh, naše know how, účinná strategie." logoHead="/assets/authentica-logo.svg">
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
      <section className="sec-auto article-sec">
        <div className="uk-container">
          <h2>Poznejte naši práci</h2>
        </div>
        <div className="uk-container uk-container-large">
          <div className="uk-grid uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="">
            <div className="article-info">
              <img src="/assets/sec-1.jpg" alt="Article info" />
            </div>
            <div className="article-info">
              <img src="/assets/sec-2.jpg" alt="Article info" />
            </div>
          </div>
        </div>
        <div className="uk-container">
          <p>Jsme Authentica, česká společnost s centrálou v Brně. Náš tým tvoří kolegové s bohatými pracovními zkušenostmi z různých oborů, kteří dokáží najít inovativní řešení pro každý projekt. Naším posláním je nabídnout klientům jen ten nejvyšší standard, protože společně utváříme obraz a hlas značky, který vyčnívá z davu. Pracujeme s vědomím, že při naší práci záleží na každém detailu a výsledkem musí být jedinečný produkt, stejně jedinečný, jako jsou vize našich klientů.</p>
        </div>
      </section>
      <section className="sec-auto article-sec">
        <div className="uk-container">
          <h2>Poznejte naši práci</h2>
        </div>
        <div className="uk-container uk-container-large">
          <div className="uk-grid uk-child-width-1-1" uk-grid="">
            <div className="article-info">
              <img src="/assets/sec-1.jpg" alt="Article info" />
            </div>
          </div>
        </div>
        <div className="uk-container">
          <p>Jsme Authentica, česká společnost s centrálou v Brně. Náš tým tvoří kolegové s bohatými pracovními zkušenostmi z různých oborů, kteří dokáží najít inovativní řešení pro každý projekt. Naším posláním je nabídnout klientům jen ten nejvyšší standard, protože společně utváříme obraz a hlas značky, který vyčnívá z davu. Pracujeme s vědomím, že při naší práci záleží na každém detailu a výsledkem musí být jedinečný produkt, stejně jedinečný, jako jsou vize našich klientů.</p>
        </div>
      </section>
      <section className="partners without-video">
        <div className="uk-container">
          <h2>Naši vážení klienti</h2>
        </div>
        <div className="partners-wrap">
          <div className="uk-container">
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
      </section>
    </Page>
  )
}

export default Article
