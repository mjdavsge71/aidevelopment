import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Auth from './components/Auth';

function HomePage() {
  return (
    <div>
      <Header />
      <div>
        <button>Sign In</button>
        <button>Register New Account</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/auth" component={Auth} />
      </Switch>
    </Router>
  );
}

export default App;
