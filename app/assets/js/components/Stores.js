import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Stores = (props) => {
    let spotify = props.stores.spotify === '' ? '' :
        <li key="spotify"><a href={`//open.spotify.com/${props.media === 'video' ? 'track' : 'album'}/${props.stores.spotify}`} target="_blank"><img src="/assets/img/spotify.svg" alt="spotify" /> Spotify</a></li>;
    let itunes = props.stores.itunes === '' ? '' : 
        <li key="itunes"><a href={`//itunes.apple.com/album/${props.stores.itunes}`} target="_blank"><img src="/assets/img/itunes.svg" alt="itunes" /> iTunes</a></li>;
    let googleplay = props.stores.googleplay === '' ? '' : 
        <li key="googleplay"><a href={`//play.google.com/store/music/album?id=${props.stores.googleplay}`} target="_blank"><img src="/assets/img/googleplay.svg" alt="googleplay" /> Google Play</a></li>;
    let amazon = props.stores.amazon === '' ? '' : 
        <li key="amazon"><a href={`//www.amazon.co.uk/dp/${props.stores.amazon}/`} target="_blank"><img src="/assets/img/amazon.svg" alt="amazon" /> Amazon</a></li>;
        
    return (
        <ReactCSSTransitionGroup className="stores" 
                                 component="ul" 
                                 transitionName="stores"
                                 transitionEnterTimeout={500}
                                 transitionLeaveTimeout={500}>
            {spotify}
            {itunes}
            {googleplay}
            {amazon}
        </ReactCSSTransitionGroup>
    )
}

export default Stores;

