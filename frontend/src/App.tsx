// App.js
import * as React from "react";
import { Switch } from 'react-router-dom';
import "./css/App.css";
import { getPath } from './router-paths';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AnonRoute from './components/AnonRoute';
import { withRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Video from './components/Video'
import goToRoomInput from './components/StartCall'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <AnonRoute path={getPath('signup')} exact component={Signup} />
          <AnonRoute path={getPath('login')} exact component={Login} />
          <PrivateRoute path={getPath('home')} exact component={Home} />
          <PrivateRoute path={getPath('profile')} exact component={Profile} />
          <PrivateRoute path={getPath('settings')} exact component={Settings} />
          <PrivateRoute path="/" exact component={goToRoomInput}/>
          <PrivateRoute path="/:roomId" exact component={Video}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App as React.ComponentType<any>)

