import Head from 'next/head';

const Layout = ({ children }: { children: any }) => {
  return (
    <div>
      <Head>
        <title>Detour</title>
        <meta name="description" content="Redirect management for .toml files" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
