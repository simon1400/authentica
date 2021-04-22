import { setupNextSanity } from "next-sanity-extra"

// Standard sanity config
// Don't forget token, to get a preview client and authenticated client
const config = {
  projectId: 'djpgdr1y',
  dataset: 'production',
  apiVersion: '2021-04-22', // use a UTC date string
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
