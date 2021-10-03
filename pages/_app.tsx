import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import '../styles/globals.scss'

function RedirectApp({ Component, pageProps }: AppProps) {
  return <Layout><Component {...pageProps} /></Layout>
}
export default RedirectApp;
