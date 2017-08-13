import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const Intro = () =>
  <ReactCSSTransitionGroup
    className="intro-title"
    component="section"
    transitionName="intro"
    transitionAppear={true}
    transitionAppearTimeout={1500}
    transitionEnter={false}
    transitionLeave={false}>
    <img className="mouse-move" src="/static/music.svg" alt="hip-hop" />
    <h1>
      Discover Dope <br />
      Hip-Hop Music
        </h1>
    <p>
      We have listened to every rap song and chose the best for you.
        </p>

    <div className="social">
      <ul>
        <li>
          <a href="https://github.com/poeti8/findrap.xyz" target="_blank">
            <img src="/static/github.svg" alt="github" />
            GitHub
                    </a>
        </li>
      </ul>
    </div>
  </ReactCSSTransitionGroup>

export default Intro;

