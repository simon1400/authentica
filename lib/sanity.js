import { setupNextSanity } from "next-sanity-extra"

// Standard sanity config
// Don't forget token, to get a preview client and authenticated client
const config = {
  projectId: 'po72mtks',
  dataset: 'production',
  useCdn: process.env.NODE_ENV === "production",
  // token: process.env.SANITY_API_TOKEN
};

export const {
  sanityClient,
  imageUrlBuilder,
  PortableText,
  sanityStaticProps,
  useSanityQuery
 } = setupNextSanity(config);
