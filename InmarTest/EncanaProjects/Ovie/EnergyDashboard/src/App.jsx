import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ReactiveBase } from '@appbaseio/reactivesearch'
import Home from './Home.jsx'
import Detail from './Detail.jsx'

import config from './js/config.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shepherd.js/dist/css/shepherd.css';
import "react-tabs/style/react-tabs.css";
import './App.css'

class App extends React.Component {

    render() {
        
        return (
            <ReactiveBase
                credentials="elastic:elastic"
                url={config.paths.ES_HOST}
                app={config.paths.ES_INDEX}>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/detail/:id" component={Detail} />
                    </Switch>
                </Router>
            </ReactiveBase>
        );
    }
}

export default App;
