"use strict"

// loading styles
import '../css/style.scss';

// loading react
import React from 'react';
import ReactDom from 'react-dom';

// import react router
import {Router, Route, Switch} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

// import components
import Homepage from './components/Homepage';
import BestNew from './components/BestNew';
// import Top10Intro from './components/Top10Intro';
// import Top10 from './components/Top10';
import Artist from './components/Artist';
import NotFound from './components/NotFound';

const routes = (
    <Router history={createBrowserHistory()}>
        <Switch>
            <Route exact path="/" component={Homepage} />
            <Route exact path="/best-new" component={BestNew} />
            {/*<Route exact path="/top-10" component={Top10Intro} />
            <Route exact path="/top-10/top/:name" component={Top10} />*/}
            <Route exact path="/:page/:name" component={Artist} />
            <Route component={NotFound} />
        </Switch>
    </Router>
)

ReactDom.render(routes, document.getElementById('app'));

