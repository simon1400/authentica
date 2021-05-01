import '../styles/main.scss'
import UIkit from 'uikit';
import { AnimatePresence } from "framer-motion"

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence exitBeforeEnter={true}>
      <Component {...pageProps} key={`${router.locale}/${router.asPath}`} />
    </AnimatePresence>
  )
}

export default MyApp
