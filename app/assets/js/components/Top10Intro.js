import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Menu from './Menu';
import Nav from './Nav';

import axios from 'axios';
import custom from '../custom';

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
        axios.get(`/api/top-10/all`, {responseType: 'json'})
        .then(res => {
            this.setState({
                top10s: res.data.data,
                img: res.data.data[0],
                loading: false
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
            img: this.state.top10s[index]
        });
        
        const clickable = setTimeout(() => {
            this.setState({
                clickable: true
            });
            custom.moveElements();
            custom.toggleMenu();
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
                    
                   <a href={`/top-10/top/${this.state.img.toLowerCase().replace(/ /g, '-')}`} key={this.state.img.toLowerCase().replace(/ /g, '-')} className="mouse-move">
                        <div className="top10-media">
                            <img src={`/assests/img/artists/${this.state.img.toLowerCase().replace(/ /g, '-')}.jpg`} alt={this.state.img} /> 
                        </div>
                        <div className="top10-title">
                            <h1>
                                TOP 10 <br/><span>{this.state.top10s[this.state.index]}</span>
                           </h1> 
                        </div>
                    </a>
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

export default Top10Intro;