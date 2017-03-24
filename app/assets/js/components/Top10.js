import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Menu from './Menu';
import Nav from './Nav';
import Media from './Media';

import axios from 'axios';
import custom from '../custom';

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
        
        axios.get(`/api/top-10/${name}`, {responseType: 'json'})
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
        })
        .catch(err => {
            this.props.history.push('/404');
        });
        
        axios.get(`/api/artist/all`, {responseType: 'json'})
        .then(res => {
            this.setState({
                artists: res.data.data,
            });
        });
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
            img: this.state.top10[index].name
        });
        
        const clickable = setTimeout(() => {
            this.setState({
                clickable: true
            });
        }, 1700);
    }
    
    render() {
        if (this.state.loading === true) return null;
        
        const artist = this.state.top10[this.state.index].artist;
        let subtitle;
        
        if (artist && this.state.artists.includes(artist)) {
            subtitle = <a href={`/artist/${artist.toLowerCase().replace(/ /g, '-')}`}>"{artist}"</a>
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
                          
                    <div key={this.state.img.toLowerCase().replace(/ /g, '-')}>
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
    }
}

export default Top10;