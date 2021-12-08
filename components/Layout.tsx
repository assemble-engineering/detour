import Head from 'next/head';
import styles from '../styles/Home.module.scss';

const Layout = ({ children }: { children: any }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Detour</title>
        <meta
          name='description'
          content='Redirect management for .toml files'
        />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
