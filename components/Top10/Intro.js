import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import compponents
import Menu from '../Menu';
import Nav from '../Nav';

import { moveElements, toggleMenu, trimString } from '../../utils';


class Top10Intro extends React.Component {
  constructor() {
    super();
    this.state = {
      top10s: [],
      loading: true,
      clickable: true,
      index: 0,
      img: ''
    }

    this.changeArtist = this.changeArtist.bind(this);
  }

  componentWillMount() {
    document.title = 'Top 10 Hip-Hop Albums & Songs';

    // get list of all top 10s from the API
    axios.get(`/api/top-10/all`, { responseType: 'json' })
      .then(res => {
        this.setState({
          top10s: res.data.data,
          img: res.data.data[0],
          loading: false
        });
      });
  }


  // change top 10 when nav is used
  changeArtist(e) {
    e.preventDefault();
    if (this.state.clickable === false) return;

    let index;


    // detect if change is next or previous top 10
    const type = e.target.getAttribute('data-type');
    if (type === 'next') {
      index = this.state.index + 1
    } else if (type === 'prev') {
      index = this.state.index - 1
    }

    this.setState({
      clickable: false,
      index: index,
      img: this.state.top10s[index]
    });

    const clickable = setTimeout(() => {
      this.setState({
        clickable: true
      });
      moveElements();
      toggleMenu();
    }, 1100);
  }


  render() {
    if (this.state.loading === true) return null;

    return (
      <ReactCSSTransitionGroup
        className="wrapper"
        component="section"
        transitionName="top10-intro"
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}>

        <Menu history={this.props.history} />

        <Nav changeArtist={this.changeArtist}
          index={this.state.index}
          artists={this.state.top10s} />

        <ReactCSSTransitionGroup
          className="top10-wrap"
          component="section"
          transitionName="top10s"
          transitionEnterTimeout={1100}
          transitionLeaveTimeout={500}>

          <a href={`/top-10/top/${trimString(this.state.img)}`} key={trimString(this.state.img)} className="mouse-move">
            <div className="top10-media">
              <img src={`/static/top-10/${trimString(this.state.img)}.jpg`} alt={this.state.img} />
            </div>
            <div className="top10-title">
              <h1>
                TOP 10 <br /><span>{this.state.top10s[this.state.index]}</span>
              </h1>
            </div>
          </a>
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

export default Top10Intro;