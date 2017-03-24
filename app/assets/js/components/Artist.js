import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Menu from './Menu';
import Nav from './Nav';
import Media from './Media';
import ArtistLists from './ArtistLists';
import ArtistTags from './ArtistTags';

import axios from 'axios';
import custom from '../custom';

class Artist extends React.Component {
    constructor() {
        super();
        this.state = {
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
        this.updateMedia = this.updateMedia.bind(this);
        this.goToTag = this.goToTag.bind(this);
    }
    
    componentWillMount() {
        const page = this.props.match.params.page;
        const name = this.props.match.params.name;
        
        axios.get(`/api/${page}/${name}?similar=true&random=true`, {responseType: 'json'})
        .then(res => {
            this.setState({
               artists: res.data.data,
               img: res.data.data[0].artist,
               loading: false
            });
        })
        .catch(err => {
            this.props.history.push('/404');
        });
    }
    
    updateMedia(e) {
        e.preventDefault();
        if (this.state.clickable === false) return;
        
        const links = document.querySelectorAll('a');
        Array.prototype.forEach.call(links, item => {
            item.classList.remove('active');
        });
        
        e.target.classList.add('active');
        
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
        }, 1700);
    }
    
    goToTag(e) {
        e.preventDefault();
        const tag = e.target.innerHTML;
        this.props.history.push(e.target.getAttribute('href'));
        
        this.setState({
            clickable: false
        });
    }
    
    changeArtist(e) {
        e.preventDefault();
        if (this.state.clickable === false) return;

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
        }, 1700);
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
                   media={this.state.media} 
                   img={this.state.img}
                   youtube={this.state.youtube} />

            <ReactCSSTransitionGroup className="artist"
                                     component="section" 
                                     transitionName="artist"
                                     transitionEnterTimeout={1000}
                                     transitionLeaveTimeout={1000}>
                                     
                <div key={this.state.artists[this.state.index].artist.toLowerCase().replace(/ /g, '-')} className="artist-info">
                    <h2>
                        {this.state.artists[this.state.index].artist}
                    </h2>
                    
                    <div className="lists">
                        <ArtistLists type="songs"
                                     artists={this.state.artists}
                                     index={this.state.index}
                                     updateMedia={this.updateMedia}/>
                                    
                        
                        <ArtistLists type="albums"
                                     artists={this.state.artists}
                                     index={this.state.index}
                                     updateMedia={this.updateMedia}/>              
                    </div>
                    
                    <ArtistTags artists={this.state.artists}
                                index={this.state.index}
                                goToTag={this.goToTag}/>
                </div>
            </ReactCSSTransitionGroup>
        </ReactCSSTransitionGroup>
        )
    }
    
    componentDidMount() {
        if (this.state.loading === true) {
            let interval = setInterval(() => {
                if (this.state.loading === false) {
                    custom.moveElements();
                    custom.toggleMenu();  
                    clearInterval(interval);
                }
            }, 500);  
        } else {
            custom.moveElements();
            custom.toggleMenu();
        }
        
        this.props.history.listen(location => {
            const path = location.pathname;
            
            axios.get(`/api${path}?random=true`, {responseType: 'json'})
            .then(res => {
                console.log(res);
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