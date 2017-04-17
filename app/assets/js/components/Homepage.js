// loading react
import React from 'react';

// import components
import Intro from './Intro';
import Find from './Find';

// get axios library for requests 
import axios from 'axios';

// import custom vanilla js to create moving animations and toggle menu
import { moveElements, toggleMenu } from '../custom';

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            tags: []
        };
    }
    
    componentWillMount() {
        // get list of all tags from API
        axios.get('/api/tag/all', {responseType: 'json'})
        .then(res => {
            this.setState({
               tags: res.data.data
           });
        });
    }
    
    render() {
        return (
            <section className="wrapper">
                <Intro />
                <Find history={this.props.history} tags={this.state.tags} />
            </section>
        )
    }
    
    componentDidMount() {
        moveElements();
        toggleMenu();
    }
}

export default Homepage;