require("babel-register")({
  presets: ["es2015", "react"]
});

const sanityClient = require("../lib/sanity").default;
const axios = require('axios')
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;

const query = `{
  'articles': *[_type == "article"]{
    "slugCS": content.cs.slug.current,
    "slugDE": content.de.slug.current
  },
  'position': *[_type == "jobOff"]{
    "slugCS": content.cs.slug.current,
    "slugDE": content.de.slug.current
  },
  'blog': *[_type == "blogItem"]{
    "slugCS": content.cs.slug.current,
    "slugDE": content.de.slug.current
  },
}`;

async function getData() {
  const res = await sanityClient.fetch(query)
  return {
    articles: res.articles,
    position: res.position,
    blog: res.blog,
  }
}

async function generateSitemap() {
  try{
    const result = await getData()

    let paramsArticlesCS = [], paramsPositionCS = [], paramsBlogCS = [];
    let paramsArticlesDE = [], paramsPositionDE = [], paramsBlogDE = [];

    for(var i = 0; i < result.position.length; i++) {
      if(result.position[i].slugCS) paramsPositionCS.push({ position: result.position[i].slugCS });
      if(result.position[i].slugDE) paramsPositionDE.push({ position: result.position[i].slugDE });
    }
    for(var i = 0; i < result.articles.length; i++) {
      if(result.articles[i].slugCS) paramsArticlesCS.push({ article: result.articles[i].slugCS });
      if(result.articles[i].slugDE) paramsArticlesDE.push({ article: result.articles[i].slugDE });
    }
    for(var i = 0; i < result.blog.length; i++) {
      if(result.blog[i].slugCS) paramsBlogCS.push({ article: result.blog[i].slugCS });
      if(result.blog[i].slugDE) paramsBlogDE.push({ article: result.blog[i].slugDE });
    }

    const paramsConfigCS = {
      "/kariera/:position": paramsPositionCS,
      "/:article": paramsArticlesCS,
      "/blog/:article": paramsBlogCS
    };
    
    const paramsConfigDE = {
      "/kariera/:position": paramsPositionDE,
      "/:article": paramsArticlesDE,
      "/blog/:article": paramsBlogDE
    };

    var pathCS = './public/sitemap.xml'
    var pathDE = './public/sitemap-de.xml'

    console.log(`Recreate sitemap -->`, new Date());

    new Sitemap(router)
        .applyParams(paramsConfigCS)
        .build("https://authenticagroup.cz")
        .save(pathCS)

    new Sitemap(router)
      .applyParams(paramsConfigDE)
      .build("https://authenticagroup.cz/de")
      .save(pathDE)

    return true;
  }catch(e){
    console.log(e);
  }
}

generateSitemap();
