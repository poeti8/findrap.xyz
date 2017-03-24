// loading react
import React from 'react';

// get axios library for requests 
import axios from 'axios';

// loading components
import Intro from './Intro';
import Find from './Find';

// custom vanilla js to create moving animations and toggle menu
import custom from '../custom';

class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {
            tags: []
        };
    }
    
    componentWillMount() {
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
        custom.moveElements();
        custom.toggleMenu();
    }
}

export default Homepage;