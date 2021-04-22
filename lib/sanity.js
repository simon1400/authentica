import sanityClient from "@sanity/client";

const config = {
  projectId: 'djpgdr1y',
  dataset: 'production',
  apiVersion: '2021-04-22', // use a UTC date string
  useCdn: false,
  // token: process.env.SANITY_API_TOKEN
};


export default sanityClient(config);
