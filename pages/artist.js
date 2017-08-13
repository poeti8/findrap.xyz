import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { trimString } from '../utils';

import Artists from '../components/Artists';

const Artist = (props) => {
  const data = props.data ? props.data : props.url.query;
  return (
    <div>
      <Head>
        <title>{data[0].artist}'s Best Songs and Albums</title>
        <meta name="description" content={`${data[0].artist}'s Best Songs and Albums`} />
        <meta name="twitter:card" value={`${data[0].artist}'s Best Songs and Albums`} />
        <meta property="og:title" content="FindRap" />
        <meta property="og:url" content={`https://findrap.xyz/artist/${trimString(data[0].artist)}`} />
        <meta property="og:image" content={`https://findrap.xyz/static/artists/${trimString(data[0].artist)}.jpg`} />
        <meta property="og:description" content={`${data[0].artist}'s Best Songs and Albums`} />
      </Head>
      <Artists
        artists={data}
      />
    </div>
  );
};

Artist.getInitialProps = async ({ req, query }) => {
  if (!req) {
    const data = await axios.get(
      `/api/artist/${query.name}?similar=true`,
      {
        responseType: 'json'
      }
    )
    return data.data;
  }
  return query;
};

export default Artist;