import sanityClient from "@sanity/client";

const config = {
  projectId: 'po72mtks',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === "production",
  // token: process.env.SANITY_API_TOKEN
};


export default sanityClient(config);
