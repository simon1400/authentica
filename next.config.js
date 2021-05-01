const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)



  const env = {
    APP_API: (() => {
      if (isDev) return 'http://localhost:9001'
      if (isProd) return 'https://api.authentica.cz'
      return 'RESTURL_SPEAKERS:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })()
  }

  // next.config.js object
  return {
    env,
    i18n: {
      locales: ['cs', 'en', 'de'],
      defaultLocale: 'cs'
    },
    async redirects() {
      return [
        {
          source: '/en/kariera',
          destination: '/en/career',
          permanent: false,
          locale: false
        },
        {
          source: '/de/kariera',
          destination: '/de/arbeitsmoglichkeiten',
          permanent: false,
          locale: false
        },
        {
          source: '/arbeitsmoglichkeiten',
          destination: '/kariera',
          permanent: false,
          locale: false
        },
        {
          source: '/career',
          destination: '/kariera',
          permanent: false,
          locale: false
        },
      ]
    },
    exportPathMap: async (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) => ({
      '/career': { page: '/kariera' },
      '/arbeitsmoglichkeiten': { page: '/kariera' },
    }),
  }
}
