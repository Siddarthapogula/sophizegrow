import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import '@xyflow/react/dist/style.css';
import Header from '../components/Header';
import { AuthContextProvider } from '../components/context';
import { Toaster } from '@grow/shared';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Sophize Grow</title>
      </Head>
      <main className="app">
        <AuthContextProvider>
          <Header />
          <div className="pt-[5rem]">
          <Component {...pageProps} />
          <Toaster/>
          </div>
        </AuthContextProvider>
      </main>
    </>
  );
}

export default CustomApp;
