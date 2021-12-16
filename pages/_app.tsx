import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import 'tailwindcss/tailwind.css';
import '../styles/globals.scss';
import { AuthProvider } from '../hooks/useAuth';
import PleaseSignIn from '../components/PleaseSignIn';
import NavBar from '../components/NavBar';

function RedirectApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <NavBar />
        <PleaseSignIn>
          <Component {...pageProps} />
        </PleaseSignIn>
      </Layout>
    </AuthProvider>
  );
}
export default RedirectApp;
