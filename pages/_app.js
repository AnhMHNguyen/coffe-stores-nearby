import { StoreProvider } from '../store/store-context'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}

export default MyApp
