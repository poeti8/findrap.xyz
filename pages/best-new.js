import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { trimString } from '../utils';

import BestNew from '../components/BestNew';

const Index = (props) => {
  const data = props.data ? props.data : props.url.query;
  return (
    <div>
      <Head>
        <title>FindRap. Best new Hip-Hop Songs and Albums</title>
        <meta name="description" content="Best new Hip-Hop Songs and Albums." />
        <meta name="twitter:card" value="FindRap. Best new Hip-Hop Songs and Albums." />
        <meta property="og:title" content="FindRap" />
        <meta property="og:url" content="https://findrap.xyz/best-new" />
        <meta property="og:image" content="https://findrap.xyz/static/og.jpg" />
        <meta property="og:description" content="Best new Hip-Hop Songs and Albums." />
      </Head>
      <BestNew
        artists={data.artists}
        artistNames={data.artistNames}
      />
    </div>
  );
};

Index.getInitialProps = async ({ req, query }) => {
  if (!req) {
    const artistNames = await axios.get('/api/artist/all', { responseType: 'json' });
    const artists = await axios.get('/api/best-new', { responseType: 'json' });
    return { data: { artists: artists.data.data, artistNames: artistNames.data.data } };
  }
  return query;
}

export default Index;