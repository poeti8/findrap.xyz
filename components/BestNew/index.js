import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import compponents
import Menu from '../Menu';
import Nav from '../Nav';
import Media from '../Media';
import BestNewIntro from './Intro';
import BestNewList from './List';

import { moveElements, toggleMenu, trimString } from '../../utils';


// create BestNew component
class BestNew extends React.Component {
  constructor() {
    super();
    this.state = {
      clickable: true,
      script: false,
      intro: true,
      index: 0,
      media: 'img',
      img: null,
      stores: null
    };

    this.hideIntro = this.hideIntro.bind(this);
    this.changeArtist = this.changeArtist.bind(this);
  }


  // hide intro page when clicked
  hideIntro(e) {
    e.preventDefault();

    this.setState({
      intro: false
    });

    moveElements();
    toggleMenu();
  }


  // change artist when nav is used
  changeArtist(e) {
    e.preventDefault();
    if (this.state.clickable === false) return;

    let index;

    // detect if change is next or previous artist
    const type = e.target.getAttribute('data-type');
    if (type === 'next') {
      index = this.state.index + 1;
    } else if (type === 'prev') {
      index = this.state.index - 1;
    }

    this.setState({
      clickable: false,
      index: index,
      img: this.props.artists[index].album.name,
      media: 'img',
      stores: {
        spotify: this.props.artists[index].album.spotify || '',
        itunes: this.props.artists[index].album.itunes || '',
        googleplay: this.props.artists[index].album.googleplay || '',
        amazon: this.props.artists[index].album.amazon || ''
      }
    });

    const clickable = setTimeout(() => {
      this.setState({
        clickable: true
      });
    }, 1000);
  }

  render() {
    const img = this.state.img ? this.state.img : trimString(this.props.artists[0].album.name);
    const stores = this.state.stores ? this.state.stores : {
      spotify: this.props.artists[0].album.spotify || '',
      itunes: this.props.artists[0].album.itunes || '',
      googleplay: this.props.artists[0].album.googleplay || '',
      amazon: this.props.artists[0].album.amazon || ''
    };

    // detect if should display intro component or best new albums component
    const isIntro = this.state.intro;
    let media, nav, content;
    if (isIntro) {
      nav: '';
      media: '';
      content = <BestNewIntro hideIntro={this.hideIntro} />;
    } else {
      media = <Media stores={stores}
        artist={this.props.artists[this.state.index].artist}
        media={this.state.media}
        img={img}
        youtube={this.state.youtube} />;

      nav = <Nav changeArtist={this.changeArtist}
        index={this.state.index}
        artists={this.props.artists} />;

      content = <BestNewList artistNames={this.props.artistNames}
        artists={this.props.artists}
        index={this.state.index} />;
    }

    return (
      <ReactCSSTransitionGroup
        className="wrapper"
        component="section"
        transitionName="bestnew-wrapper"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={true}
        transitionLeave={false}
        transitionEnterTimeout={1000}>

        <Menu />
        {nav}
        {media}
        {content}

      </ReactCSSTransitionGroup>
    );
  }

  componentDidMount() {
    toggleMenu();
  }

  componentDidUpdate() {
    // invoke custom functions if it's not intro page
    if (!this.state.script && !this.state.intro) {
      moveElements();
      toggleMenu();

      this.setState({
        script: true
      });
    }
  }
}

export default BestNew;