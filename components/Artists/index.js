import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Router from 'next/router';

// import compponents
import Menu from '../Menu';
import Nav from '../Nav';
import Media from '../Media';
import List from './Lists';
import Tags from './Tags';

import { moveElements, toggleMenu, trimString } from '../../utils/index';


// create Artist component
class Artist extends React.Component {
  constructor() {
    super();

    this.state = {
      clickable: true,
      index: 0,
      media: 'img', // img or video
      img: null,
      youtube: '',
      stores: {
        spotify: '',
        itunes: '',
        googleplay: '',
        amazon: ''
      }
    };

    this.changeArtist = this.changeArtist.bind(this);
    this.updateMedia = this.updateMedia.bind(this);
    this.goToTag = this.goToTag.bind(this);
  }

  // update the image or video
  updateMedia(e) {
    e.preventDefault();
    if (this.state.clickable === false) return;


    // select all albums and songs list
    const links = document.querySelectorAll('a');
    Array.prototype.forEach.call(links, item => {
      item.classList.remove('active');
    });

    e.target.classList.add('active');


    // detect if the new media is image or video
    let item;
    let media;
    let img;
    if (e.target.getAttribute('data-type') === 'songs') {
      item = this.props.artists[this.state.index].songs[e.target.getAttribute('data-index')];
      media = 'video';
    } else if (e.target.getAttribute('data-type') === 'albums') {
      item = this.props.artists[this.state.index].albums[e.target.getAttribute('data-index')];
      media = 'img';
      img = item.name;
    }


    // update state
    this.setState({
      clickable: false,
      media: media,
      img: img,
      youtube: item.youtube || '',
      stores: {
        spotify: item.spotify || '',
        itunes: item.itunes || '',
        googleplay: item.googleplay || '',
        amazon: item.amazon || ''
      }
    });


    const clickable = setTimeout(() => {
      this.setState({
        clickable: true
      });
    }, 400);
  }


  // update page when clicked on tag
  goToTag(e) {
    e.preventDefault();

    const url = e.target.getAttribute('href');
    Router.push(`/tag?name=${url.replace('/tag/', '')}`, url);
  }

  // change artist when nav is used
  changeArtist(e) {
    e.preventDefault();
    if (this.state.clickable === false) return;

    // detect if change is next or previous artist
    const type = e.target.getAttribute('data-type');
    if (type === 'next') {
      this.setState({
        index: this.state.index + 1,
        img: this.props.artists[this.state.index + 1].artist
      });
    } else if (type === 'prev') {
      this.setState({
        index: this.state.index - 1,
        img: this.props.artists[this.state.index - 1].artist
      });
    }

    this.setState({
      clickable: false,
      media: 'img',
      youtube: '',
      stores: {
        spotify: '',
        itunes: '',
        googleplay: '',
        amazon: ''
      }
    });

    const clickable = setTimeout(() => {
      this.setState({
        clickable: true
      });
    }, 1000);
  }

  render() {
    const img = this.state.img ? this.state.img : this.props.artists[0].artist;
    return (
      <ReactCSSTransitionGroup
        className="wrapper"
        component="section"
        transitionName="artist-wrapper"
        transitionAppear={true}
        transitionAppearTimeout={1500}
        transitionEnter={false}
        transitionLeave={false}
      >

        <Menu />

        <Nav
          changeArtist={this.changeArtist}
          index={this.state.index}
          artists={this.props.artists}
        />

        <Media
          stores={this.state.stores}
          artist={this.props.artists[this.state.index].artist}
          media={this.state.media}
          img={img}
          youtube={this.state.youtube}
        />

        <ReactCSSTransitionGroup
          className="artist"
          component="section"
          transitionName="artist"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}
        >

          <div key={trimString(this.props.artists[this.state.index].artist)} className="artist-info">
            <h2>
              {this.props.artists[this.state.index].artist}
            </h2>

            <div className="lists">
              <List
                type="songs"
                artists={this.props.artists}
                index={this.state.index}
                updateMedia={this.updateMedia}
              />
              <List
                type="albums"
                artists={this.props.artists}
                index={this.state.index}
                updateMedia={this.updateMedia}
              />
            </div>

            <Tags
              artists={this.props.artists}
              index={this.state.index}
              goToTag={this.goToTag}
            />
          </div>
        </ReactCSSTransitionGroup>
      </ReactCSSTransitionGroup>
    );
  }


  componentDidMount() {
    moveElements();
    toggleMenu();
  }
}

export default Artist;