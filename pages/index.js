import React from 'react';
import Head from 'next/head';
import axios from 'axios';

import Homepage from '../components/Homepage';

const Index = (props) => {
  const data = props.data ? props.data : props.url.query;
  return (
    <div>
      <meta name="description" content="Find the best Hip-Hop/Rap songs and albums of the history." />
      <meta name="twitter:card" value="Discover the Best Hip-Hop Songs and Albums" />
      <meta property="og:title" content="FindRap" />
      <meta property="og:url" content="https://findrap.xyz/" />
      <meta property="og:image" content="https://findrap.xyz/static/og.jpg" />
      <meta property="og:description" content="Discover the Best Hip-Hop Songs and Albums." />
      <Homepage
        tags={data.tags}
        artists={data.artists}
      />
    </div>
  );
};

Index.getInitialProps = async ({ req, query }) => {
  if (!req) {
    const tags = await axios.get('/api/tag/all', { responseType: 'json' });
    const artists = await axios.get('/api/artist/all', { responseType: 'json' });
    return { data: { tags: tags.data.data, artists: artists.data.data } };
  }
  return query;
}

export default Index;