import '../app/globals.css'
import { AppProps } from 'next/app';
import { SelectedIssuerProvider } from '@/contexts/SelectedIssuerContext';
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SelectedIssuerProvider>
        <Component {...pageProps} />
      </SelectedIssuerProvider>
    </SessionProvider>
  );
}

export default MyApp;