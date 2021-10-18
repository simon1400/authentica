require("babel-register")({
  presets: ["es2015", "react"]
});

const sanityClient = require("../lib/sanity").default;
const axios = require('axios')
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const query = `{
  'articles': *[_type == "article"]{
    "slug": content.cs.slug
  },
  'position': *[_type == "jobOff"]{
    "slug": content.cs.slug
  },
}`;

async function getData() {
  const res = await sanityClient.fetch(query)
  return {
    articles: res.articles,
    position: res.position,
  }
}

async function generateSitemap() {
  try{
    const result = await getData()

    let paramsArticles = [];
    let paramsPosition = [];

    for(var i = 0; i < result.position.length; i++) {
      paramsPosition.push({ position: result.position[i].slug.current });
    }
    for(var i = 0; i < result.articles.length; i++) {
      paramsArticles.push({ article: result.articles[i].slug.current });
    }

    const paramsConfig = {
      "/kariera/:position": paramsPosition,
      "/:article": paramsArticles
    };

    var path = './public/sitemap.xml'

    console.log(`Recreate sitemap -->`, new Date());

    return (
      new Sitemap(router)
        .applyParams(paramsConfig)
        .build("https://authenticagroup.cz")
        .save(path)
    );
  }catch(e){
    console.log(e);
  }
}

generateSitemap();
