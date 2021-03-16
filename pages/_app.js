import React, {Fragment} from 'react'
import Head from 'next/head'
import '../styles/globals.css'
function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <title>Auctionator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  )
}
export default MyApp