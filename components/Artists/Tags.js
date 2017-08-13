import React from 'react';

const Tags = (props) => (
  <ul className="artist-tags">
    <li>tags:</li>
    {props.artists[props.index].tags.map(item => {
      return (
        <li key={item}><a onClick={props.goToTag} href={`/tag/${item}`}>{item}</a></li>
      );
    })}
  </ul>
);

export default Tags;