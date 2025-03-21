import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import '@xyflow/react/dist/style.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sophize Grow</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
