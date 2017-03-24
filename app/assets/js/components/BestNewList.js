import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const BestNewList = (props) => (
        <ReactCSSTransitionGroup className="top10-item"
                                 component="section" 
                                 transitionName="top10-item"
                                 transitionEnterTimeout={1000}
                                 transitionLeaveTimeout={1000}>
            <div key={props.artists[props.index].album.name.toLowerCase().replace(/ /g, '-')} >
                <h1 className="item-title">
                    {props.artists[props.index].album.name}
                </h1>
                <h2 className="item-subtitle">
                    <a href={`/artist/${props.artists[props.index].artist.replace(/ /g, '-')}`} target="_blank">"{props.artists[props.index].artist}"</a>
                </h2>
            </div>
        </ReactCSSTransitionGroup>
    );

export default BestNewList;