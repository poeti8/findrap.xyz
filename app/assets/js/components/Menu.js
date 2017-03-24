import React from 'react';

class Menu extends React.Component {
    constructor() {
        super();
    }
    
    goToPage(e) {
        e.preventDefault();
        this.props.history.push(e.target.getAttribute('href'));
    }
    
    render() {
        return (
            <div>
                <nav id="menu-content">
                    <ul>
                        <li><a onClick={this.goToPage.bind(this)} href="/">discover</a></li>
                        <li><a onClick={this.goToPage.bind(this)} href="/best-new">best new</a></li>
                        <li><a onClick={this.goToPage.bind(this)} href="/top-10">top 10s</a></li>
                        <li><a onClick={this.goToPage.bind(this)} href="#">github</a></li>
                    </ul>
                </nav>

                <div id="menu">
                    <a href="#" className="open"><img src="/assets/img/nav.svg" alt="open menu" /></a>
                    <a href="#" className="close"><img src="/assets/img/nav-close.svg" alt="close menu" /></a>
                </div>
            </div>
        )
    }
}

export default Menu;