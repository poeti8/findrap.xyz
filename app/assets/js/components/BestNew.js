import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import compponents
import Menu from './Menu';
import Nav from './Nav';
import Media from './Media';
import BestNewIntro from './BestNewIntro';
import BestNewList from './BestNewList';


// import libraries and scripts
import axios from 'axios';
import { moveElements, toggleMenu, trimString } from '../custom';


// create BestNew component
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
        document.title = 'Best New Hip-Hop Albums';

        // get data from API
        axios.get(`/api/best-new`, {responseType: 'json'})
        .then(res => {
            this.setState({
                artists: res.data.data,
                img: res.data.data[0].album.name,
                loading: false,
                stores: {
                    spotify: res.data.data[0].album.spotify || '',
                    itunes: res.data.data[0].album.itunes || '',
                    googleplay: res.data.data[0].album.googleplay || '',
                    amazon: res.data.data[0].album.amazon || ''
                }
            });
        });
        
        // get all artists from API
        axios.get('/api/artist/all', {responseType: 'json'})
        .then(res => {
            this.setState({
               artistNames: res.data.data
           });
        });
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
            index = this.state.index + 1
        } else if (type === 'prev') {
            index = this.state.index - 1
        }
        
        this.setState({
            clickable: false,
            index: index,
            img: this.state.artists[index].album.name,
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
        }, 1000);
    }
    
    render() {
        if (this.state.loading === true) return null;
        
        // detect if should display intro component or best new albums component
        const isIntro = this.state.intro;
        let media, nav, content;
        if (isIntro) {
            nav: '';
            media: '';
            content = <BestNewIntro hideIntro={this.hideIntro} />  
        } else {
            media = <Media stores={this.state.stores} 
                           artist={this.state.artists[this.state.index].artist}
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
        // if page is not loading then load custom move elements and menu functions
        if (this.state.loading === true) {
            let interval = setInterval(() => {
                if (this.state.loading === false) {
                    toggleMenu();  
                    clearInterval(interval);
                }
            }, 500);  
        } else {
            toggleMenu();
        }  
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