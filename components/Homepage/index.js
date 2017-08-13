// loading react
import React from 'react';

// import components
import Intro from './Intro';
import Find from './Find';

// import custom vanilla js to create moving animations and toggle menu
import { moveElements, toggleMenu } from '../../utils';

class Homepage extends React.Component {
  render() {
    return (
      <section className="wrapper">
        <Intro />
        <Find
          tags={this.props.tags}
          artists={this.props.artists}
        />
      </section>
    )
  }
  componentDidMount() {
    moveElements();
    toggleMenu();
  }
}

export default Homepage;