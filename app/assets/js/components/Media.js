import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Stores from './Stores';

const Media = (props) => {
    
    let mediaType = props.media;
    let imgName = props.img;
    let media; 
    
    if (mediaType === 'img') {
        media = <div key={imgName.toLowerCase().replace(/ /g, '-')}><img src={`/assets/img/artists/${imgName.toLowerCase().replace(/ /g, '-')}.jpg`} alt={imgName} /></div>;
    } else if (mediaType === 'video') {
        media = <div key={props.youtube}> <iframe key={props.youtube} width="560" height="315" src={`https://www.youtube.com/embed/${props.youtube}`} frameBorder="0" allowFullScreen></iframe></div>
    }

    return (
        <section className="media-wrap">
            <ReactCSSTransitionGroup className="media mouse-move"
                                     component="div"
                                     transitionName="media"
                                     transitionEnterTimeout={1700}
                                     transitionLeaveTimeout={1000}>
                {media}
            </ReactCSSTransitionGroup> 
            <Stores stores={props.stores} media={props.media} />
        </section>
    )
};

export default Media;