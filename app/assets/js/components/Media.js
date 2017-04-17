import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Stores from './Stores';

import { trimString } from '../custom';

const Media = (props) => {
    
    const mediaType = props.media;
    const imgName = props.img;
    const type = props.img === props.artist ? 'artists' : 'albums';
    let media; 

    // detect if media tyoe is image or video and show them
    if (mediaType === 'img') {
        media = <div key={trimString(imgName)}><img src={`/assets/img/${type}/${trimString(imgName)}.jpg`} alt={imgName} /></div>;
    } else if (mediaType === 'video') {
        media = <div key={props.youtube} className="youtube-player"> <iframe key={props.youtube} width="560" height="315" src={`https://www.youtube.com/embed/${props.youtube}`} frameBorder="0" allowFullScreen></iframe></div>
    }

    return (
        <section className="media-wrap">
            <ReactCSSTransitionGroup className="media mouse-move"
                                     component="div"
                                     transitionName="media"
                                     transitionEnterTimeout={500}
                                     transitionLeaveTimeout={500}>
                {media}
            </ReactCSSTransitionGroup> 
            <Stores stores={props.stores} media={props.media} />
        </section>
    )
};

export default Media;