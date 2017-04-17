import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import compponents
import Menu from './Menu';
import Nav from './Nav';
import Media from './Media';
import ArtistLists from './ArtistLists';
import ArtistTags from './ArtistTags';


// import libraries and scripts
import axios from 'axios';
import { moveElements, toggleMenu, trimString } from '../custom';


// create Artist component
class Artist extends React.Component {
    constructor() {
        super();

        this.state = {
            artists: [], // store artists
            loading: true,
            clickable: true,
            index: 0,
            media: 'img', // img or video
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
        this.updateMedia = this.updateMedia.bind(this);
        this.goToTag = this.goToTag.bind(this);
    }


    componentWillMount() {
        // get URL parameters
        const page = this.props.match.params.page;
        const name = this.props.match.params.name;


        // get data from API
        axios.get(`/api/${page}/${name}?similar=true&random=true`, { responseType: 'json' })
            .then(res => {
                this.setState({
                    artists: res.data.data,
                    img: res.data.data[0].artist,
                    loading: false
                });


                // update page title
                if (page === 'artist') {
                    document.title = this.state.artists[this.state.index].artist + ' | Dope Albums & Songs';
                } else if (page === 'tag') {
                    document.title = name + ' | Dope Hip-Hop Albums & Songs';
                }
                
            })
            .catch(err => {
                this.props.history.push('/404');
            });
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
            item = this.state.artists[this.state.index].songs[e.target.getAttribute('data-index')];
            media = 'video';
        } else if (e.target.getAttribute('data-type') === 'albums') {
            item = this.state.artists[this.state.index].albums[e.target.getAttribute('data-index')];
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

        // update page
        const tag = e.target.innerHTML;
        this.props.history.push(e.target.getAttribute('href'));

        this.setState({
            clickable: false
        });
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
                img: this.state.artists[this.state.index + 1].artist
            });
        } else if (type === 'prev') {
            this.setState({
                index: this.state.index - 1,
                img: this.state.artists[this.state.index - 1].artist
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
        if (this.state.loading === true) return null;

        return (
            <ReactCSSTransitionGroup className="wrapper"
                component="section"
                transitionName="artist-wrapper"
                transitionAppear={true}
                transitionAppearTimeout={1500}
                transitionEnter={false}
                transitionLeave={false}>

                <Menu history={this.props.history} />

                <Nav changeArtist={this.changeArtist}
                    index={this.state.index}
                    artists={this.state.artists} />

                <Media stores={this.state.stores}
                    artist={this.state.artists[this.state.index].artist}
                    media={this.state.media}
                    img={this.state.img}
                    youtube={this.state.youtube} />

                <ReactCSSTransitionGroup className="artist"
                    component="section"
                    transitionName="artist"
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}>

                    <div key={trimString(this.state.artists[this.state.index].artist)} className="artist-info">
                        <h2>
                            {this.state.artists[this.state.index].artist}
                        </h2>

                        <div className="lists">
                            <ArtistLists type="songs"
                                artists={this.state.artists}
                                index={this.state.index}
                                updateMedia={this.updateMedia} />


                            <ArtistLists type="albums"
                                artists={this.state.artists}
                                index={this.state.index}
                                updateMedia={this.updateMedia} />
                        </div>

                        <ArtistTags artists={this.state.artists}
                            index={this.state.index}
                            goToTag={this.goToTag} />
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


        // listen for URL changes and update the page
        this.props.history.listen(location => {
            const path = location.pathname;

            axios.get(`/api${path}?random=true`, { responseType: 'json' })
                .then(res => {
                    this.setState({
                        artists: res.data.data,
                        index: 0,
                        clickable: true,
                        media: 'img',
                        img: res.data.data[0].artist,
                        youtube: '',
                        stores: {
                            spotify: '',
                            itunes: '',
                            googleplay: '',
                            amazon: ''
                        }
                    });
                });
        });
    }
}

export default Artist;