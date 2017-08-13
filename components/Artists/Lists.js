import React from 'react';

const List = (props) => (
  <div className={`dope-${props.type}`}>
    <h4>
      Dope {props.type}
    </h4>
    <ul>
      {props.artists[props.index][props.type].map((item, index) => {
        const as = item.as ? <span>(as {item.as})</span> : '';
        const w = item.w ? <span>(w/ {item.w})</span> : '';

        return (
          <li key={`${props.type}-${index}`}>
            <a href="#" data-type={props.type} data-index={index} onClick={props.updateMedia}>
              {item.name}<span>({item.year})</span>{as}{w}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);

export default List;