import React from 'react';

const Nav = (props) => {
    
    let rightNav = props.index + 1 >= props.artists.length ? '' :
        <a onClick={props.changeArtist} data-type="next" className="nav-next" href="#"><img data-type="next" src="/assets/img/arrow-right.svg" alt="next" /></a>;
    let leftNav = props.index <= 0 ? '' :
        <a onClick={props.changeArtist} data-type="prev" className="nav-prev" href="#"><img data-type="prev" src="/assets/img/arrow-right.svg" alt="previous" /></a>;
            
    return (
        <div>
            {rightNav}
            {leftNav}
        </div>
    )
}

export default Nav;