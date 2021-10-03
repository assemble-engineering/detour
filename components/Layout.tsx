import Head from 'next/head'
import Image from 'next/image'
// @ts-ignore
import styles from '../styles/Home.module.scss'

const Layout = ({children}: {children: any}) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Redirects</title>
        <meta name="description" content="Redirect Management for Netlify" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export default Layout;
