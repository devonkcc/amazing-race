import React from 'react';
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CheckIn from "./components/CheckIn";
import Start from "./components/Start";
import Registration from "./components/Registration";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/start" component={Start} />
        <Route path="/register" component={Registration} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/checkin/:id" component={CheckIn} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
