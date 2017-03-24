import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Menu from './Menu';
import Nav from './Nav';
import Media from './Media';
import BestNewIntro from './BestNewIntro';
import BestNewList from './BestNewList';

import axios from 'axios';
import custom from '../custom';

class BestNew extends React.Component {
    constructor() {
        super();
        this.state = {
            artists: [],
            artistNames: [],
            loading: true,
            clickable: true,
            script: false,
            intro: true,
            index: 0,
            media: 'img',
            img: '',
            stores: {
                spotify: '',
                itunes: '',
                googleplay: '',
                amazon: ''
            }
        }
        
        this.hideIntro = this.hideIntro.bind(this);
        this.changeArtist = this.changeArtist.bind(this);
    }
    
    componentWillMount() {
        axios.get(`/api/best-new`, {responseType: 'json'})
        .then(res => {
            this.setState({
                artists: res.data.data,
                img: res.data.data[0].artist,
                loading: false,
                stores: {
                    spotify: res.data.data[0].album.spotify || '',
                    itunes: res.data.data[0].album.itunes || '',
                    googleplay: res.data.data[0].album.googleplay || '',
                    amazon: res.data.data[0].album.amazon || ''
                }
            });
        });
        
        axios.get('/api/artist/all', {responseType: 'json'})
        .then(res => {
            this.setState({
               artistNames: res.data.data
           });
        });
    }
    
    hideIntro(e) {
        e.preventDefault();
        
        this.setState({
           intro: false 
        });
        
        custom.moveElements();
        custom.toggleMenu();
    }
    
    changeArtist(e) {
        e.preventDefault();
        if (this.state.clickable === false) return;
        
        let index;
        
        const type = e.target.getAttribute('data-type');
        if (type === 'next') {
            index = this.state.index + 1
        } else if (type === 'prev') {
            index = this.state.index - 1
        }
        
        this.setState({
            clickable: false,
            index: index,
            img: this.state.artists[index].artist,
            media: 'img',
            stores: {
                spotify: this.state.artists[index].album.spotify || '',
                itunes: this.state.artists[index].album.itunes || '',
                googleplay: this.state.artists[index].album.googleplay || '',
                amazon: this.state.artists[index].album.amazon || ''
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
        
        const isIntro = this.state.intro;
        let media, nav, content;
        if (isIntro) {
            nav: '';
            media: '';
            content = <BestNewIntro hideIntro={this.hideIntro} />  
        } else {
            media = <Media stores={this.state.stores} 
                           media={this.state.media} 
                           img={this.state.img}
                           youtube={this.state.youtube} />
                
            nav = <Nav changeArtist={this.changeArtist} 
                       index={this.state.index} 
                       artists={this.state.artists} />
                
            content = <BestNewList artistNames={this.state.artistNames}
                                   artists={this.state.artists}
                                   index={this.state.index}/>           
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
            
                <Menu history={this.props.history} />           
                {nav}
                {media}
                {content}
                
            </ReactCSSTransitionGroup>
        )
    }
    
    componentDidMount() {
        if (this.state.loading === true) {
            let interval = setInterval(() => {
                if (this.state.loading === false) {
                    custom.toggleMenu();  
                    clearInterval(interval);
                }
            }, 500);  
        } else {
            custom.toggleMenu();
        }  
    }
    
    componentDidUpdate() {
        if (!this.state.script && !this.state.intro) {
            custom.moveElements();
            custom.toggleMenu();

            this.setState({
                script: true
            }); 
        }
    }
}

export default BestNew;