import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import components
import Menu from '../Menu';
import Nav from '../Nav';
import Media from '../Media';

import { moveElements, toggleMenu, trimString } from '../../utils';

class Top10 extends React.Component {
  constructor() {
    super();
    this.state = {
      top10: [],
      artists: [],
      loading: true,
      clickable: true,
      index: 0,
      media: 'img',
      img: '',
      youtube: '',
      stores: {
        spotify: '',
        itunes: '',
        googleplay: '',
        amazon: ''
      }
    }

    this.changeArtist = this.changeArtist.bind(this);
  }

  componentWillMount() {
    const name = this.props.match.params.name;


    // get list of top 10 items
    axios.get(`/api/top-10/${name}`, { responseType: 'json' })
      .then(res => {
        this.setState({
          top10: res.data.data[0].top10,
          media: res.data.data[0].type,
          img: res.data.data[0].top10[0].name,
          youtube: res.data.data[0].top10[0].youtube || '',
          loading: false,
          stores: {
            spotify: res.data.data[0].top10[0].spotify || '',
            itunes: res.data.data[0].top10[0].itunes || '',
            googleplay: res.data.data[0].top10[0].googleplay || '',
            amazon: res.data.data[0].top10[0].amazon || ''
          }
        });

        document.title = 'Top 10 ' + res.data.data[0].title;
      })
      .catch(err => {
        this.props.history.push('/404');
      });


    // get list of all artists
    axios.get(`/api/artist/all`, { responseType: 'json' })
      .then(res => {
        this.setState({
          artists: res.data.data,
        });
      });
  }


  // change artist when nav is used
  changeArtist(e) {
    e.preventDefault();
    if (this.state.clickable === false) return;

    let index;

    // detect if change is next or previous item
    const type = e.target.getAttribute('data-type');
    if (type === 'next') {
      index = this.state.index + 1
    } else if (type === 'prev') {
      index = this.state.index - 1
    }

    this.setState({
      clickable: false,
      index: index,
      img: this.state.top10[index].name
    });

    const clickable = setTimeout(() => {
      this.setState({
        clickable: true
      });
    }, 1000);
  }


  render() {
    if (this.state.loading === true) return null;

    const artist = this.state.top10[this.state.index].artist;
    let subtitle;

    if (artist && this.state.artists.includes(artist)) {
      subtitle = <a href={`/artist/${trimString(artist)}`}>"{artist}"</a>
    } else if (artist) {
      subtitle = `"${artist}"`
    } else {
      subtitle = '';
    }

    return (
      <ReactCSSTransitionGroup
        className="wrapper"
        component="section"
        transitionName="top10"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}>

        <Menu history={this.props.history} />

        <Nav changeArtist={this.changeArtist}
          index={this.state.index}
          artists={this.state.top10} />

        <Media stores={this.state.stores}
          media={this.state.media}
          img={this.state.img}
          youtube={this.state.youtube} />

        <ReactCSSTransitionGroup className="top10-item"
          component="section"
          transitionName="top10-item"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}>

          <div key={trimString(this.state.img)}>
            <h4>{this.state.top10[this.state.index].number}.</h4>
            <h1 className="item-title">
              {this.state.top10[this.state.index].name}
            </h1>

            <h2 className="item-subtitle">
              {subtitle}
            </h2>
          </div>
        </ReactCSSTransitionGroup>

      </ReactCSSTransitionGroup>
    )
  }


  componentDidMount() {
    // if page is not loading then load custom move elements and menu functions
    if (this.state.loading === true) {
      let interval = setInterval(() => {
        if (this.state.loading === false) {
          moveElements();
          toggleMenu();
          clearInterval(interval);
        }
      }, 500);
    } else {
      moveElements();
      toggleMenu();
    }
  }
}

export default Top10;