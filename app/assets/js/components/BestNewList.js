import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { trimString } from '../custom'

const BestNewList = (props) => (
        <ReactCSSTransitionGroup className="top10-item"
                                 component="section" 
                                 transitionName="top10-item"
                                 transitionEnterTimeout={1000}
                                 transitionLeaveTimeout={1000}>
            <div key={trimString(props.artists[props.index].album.name)} >
                <h1 className="item-title">
                    {props.artists[props.index].album.name}
                </h1>
                <h2 className="item-subtitle">
                    <a href={`/artist/${trimString(props.artists[props.index].artist)}`} target="_blank">"{props.artists[props.index].artist}"</a>
                </h2>
            </div>
        </ReactCSSTransitionGroup>
    );

export default BestNewList;