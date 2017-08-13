import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { trimString } from '../utils';

import Artists from '../components/Artists';

const Tag = (props) => {
  const data = props.artists ? props.artists.data : props.url.query;
  const tagName = props.tagName ? props.tagName : props.url.tagName;
  console.log(props);
  return (
    <div>
      <Head>
        <title>{tagName}'s Best Hip/Hop/Rap Songs and Albums</title>
        <meta name="description" content={`${tagName}'s Best Hip/Hop/Rap Songs and Albums`} />
        <meta name="twitter:card" value={`${tagName}'s Best Hip/Hop/Rap Songs and Albums`} />
        <meta property="og:title" content="FindRap" />
        <meta property="og:url" content={`https://findrap.xyz/tag/${tagName}`} />
        <meta property="og:image" content={`https://findrap.xyz/static/artists/${trimString(data[0].artist)}.jpg`} />
        <meta property="og:description" content={`${tagName}'s Best Hip/Hop/Rap Songs and Albums`} />
      </Head>
      <Artists
        artists={data}
      />
    </div>
  );
}

Tag.getInitialProps = async ({ req, res, query }) => {
  if (!req) {
    const data = await axios.get(
      `/api/tag/${query.name}?random=true`,
      {
        responseType: 'json'
      }
    )
    return { artists: data.data, tagName: query.name };
  }
  return {query, tagName: req.params.name};
};

export default Tag;