import React, {Fragment} from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import {Provider} from 'react-redux';
import {store,persistor} from '../store/store.js';
import { createWrapper } from 'next-redux-wrapper';
import { PersistGate } from 'redux-persist/integration/react'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Fragment>
          <Head>
            <title>Auctionator</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </Fragment>
      </PersistGate>
    </Provider>
  )
}
// export default MyApp
const makeStore = () => store;
const wrapper = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
