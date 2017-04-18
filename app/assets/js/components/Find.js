import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


// import libraries and scripts
import { trimString } from '../custom';
import axios from 'axios';


// create Find component
class Find extends React.Component {
    constructor() {
        super();
        
        this.state = {
            artists: [], // list of all artist names
            value: '', // the value user typed
            suggestion: [] // list of suggestions
        }
    }
    

    componentWillMount() {
        // get all artists list from API
        axios.get('/api/artist/all', {responseType: 'json'})
        .then(res => {
            this.setState({
               artists: res.data.data
            });
        })
    }
    

    // go to artist when form is submitted
    goToArtist(e) {
        e.preventDefault();
        let artists = this.state.artists;
        let value = this.state.value;
        
        // if value was found in the artists list go to the artist's page
        artists.forEach(name => {
            if (name.toLowerCase() === value.toLowerCase()) {
                value = trimString(value)
                this.props.history.push(`/artist/${value}`);
                return;
           }
        });
        
        this.refs.noArtistMsg.classList.add('active');
    }


    // update page when clicked on tag
    goToTag(e) {
        e.preventDefault();
        this.props.history.push(e.target.getAttribute('href'));
    }


    // update value state when user types
    updateValue(e) {
        if (this.state.value.length > 1) {
            this.refs.suggestionsWrapper.classList.add('active'); 
        }
        
        // find suggestion based on value entered by user
        const suggest = this.state.artists.filter(item => {
            return item.toLowerCase().includes(e.target.value.toLowerCase()) && e.target.value.length > 0;
        });
        
        this.setState({
            value: e.target.value,
            suggestion: suggest
        });
        
        this.refs.noArtistMsg.classList.remove('active');
    }
    

    // fill the input with suggestion
    fillInput(e) {
        this.setState({
            value: e.target.innerHTML
        });
        this.refs.search.focus();
        this.refs.suggestionsWrapper.classList.remove('active');
    }
    

    // show all tags
    renderTags(tag) {
        return <li key={tag}><a onClick={this.goToTag.bind(this)} href={`/tag/${tag}`}>{tag}</a></li>
    }
    

    // detect either should select suggetion or go to entered value when users hits enter 
    enterKey(e) {
        if (e.charCode === 13 && 
            this.state.suggestion[0].toLowerCase() !== 
            this.state.value.toLowerCase()) {
            
            e.preventDefault();
            const suggest = this.state.suggestion[0];
            this.refs.suggestionsWrapper.classList.remove('active');
            this.setState({
                value: suggest,
            });
        }
    }
    

    render() {
        
        let suggests;
        
        if (this.state.suggestion[0] && this.state.suggestion[1]) {
            suggests = <ul><li onClick={this.fillInput.bind(this)}>{this.state.suggestion[0]}</li>
                           <li onClick={this.fillInput.bind(this)}>{this.state.suggestion[1]}</li></ul>
        } else if (this.state.suggestion[0]) {
            suggests = <ul><li onClick={this.fillInput.bind(this)}>{this.state.suggestion[0]}</li></ul>
        }
        
       return (
           <ReactCSSTransitionGroup 
                    className="find" 
                    component="section"
                    transitionName="find"
                    transitionAppear={true}
                    transitionAppearTimeout={1600}
                    transitionEnter={false}
                    transitionLeave={false}>
                <form onSubmit={this.goToArtist.bind(this)} >
                    <input ref="search" type="search" name="search" id="search"                     
                        value={this.state.value}
                        onChange={this.updateValue.bind(this)}
                        onKeyPress={this.enterKey.bind(this)}
                        placeholder="Find..." autoComplete="off" />
                    <button type="submit"><img src="assets/img/search.svg" alt="search" /></button>
                    <div className="input-divider"></div>
                    <p>enter a dope artist's name or:</p>
                    <div ref="suggestionsWrapper" className="suggestions">{suggests}</div>
                    <div ref="noArtistMsg" className="no-artist"><p>No such an artist. Either the artist is not dope enough or our database is incomplete. <a href="https://github.com/poeti8/findrap.xyz"><strong>Help us make it complete</strong></a></p></div>
                </form>

                <ul className="tags white-tags">
                    <li><a onClick={this.goToTag.bind(this)} href="/artist/random">Random</a></li>
                    <li><a onClick={this.goToTag.bind(this)} href="/best-new">Best new</a></li>
                    {/*<li><a onClick={this.goToTag.bind(this)} href="/top-10">Top 10</a></li>*/}
                </ul>
                <ul className="tags">
                    <li><a onClick={this.goToTag.bind(this)} href="/tag/1980s">1980's</a></li>
                    <li><a onClick={this.goToTag.bind(this)} href="/tag/1990s">1990's</a></li>
                    <li><a onClick={this.goToTag.bind(this)} href="/tag/2000s">2000's</a></li>
                    <li><a onClick={this.goToTag.bind(this)} href="/tag/2010s">2010's</a></li>
                </ul>
                <ul className="tags">
                    {this.props.tags.map(this.renderTags.bind(this))}
                </ul>
                
                <div className="blue-overlay-right"></div>
            </ReactCSSTransitionGroup>
       ) 
    }
}

export default Find;

