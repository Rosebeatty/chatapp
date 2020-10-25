//	lib/AuthProvider.js

import * as React from 'react';
import authService from './auth-service'; // IMPORT functions for axios requests to API

export const MyContext = React.createContext<ContextProps | null>(null);

interface ContextProps {
    login: (user:any) => void,
    signup: (user:any) => void,
    user: any,
    logout: (user:any) => void,
    isLoggedin: boolean,
    isLoading: boolean,
}

// HOC to create Consumer
const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends React.Component<P & ContextProps> {
    render() {
      return (
        <MyContext.Consumer>
          {(props: any) => {
            return (
              <WrappedComponent
                login={props.login}
                signup={props.signup}
                user={props.user}
                logout={props.logout}
                isLoggedin={props.isLoggedin}
                isLoading={props.isLoading}
                {...this.props as P}
              />
            );
          }}
        </MyContext.Consumer>
      );
    }
  };
};

// Provider
class AuthProvider extends React.Component {

  state = { isLoggedin: false, user: null, isLoading: true };

  componentDidMount() {
    authService
      .me()
      .then(user =>
        this.setState({ isLoggedin: true, user: user, isLoading: false }),
      )
      .catch(err =>
        this.setState({ isLoggedin: false, user: null, isLoading: false }),
      );
  }

  signup = (user: any) => {
    const {  username, password} = user;

    authService
      .signup({username, password})
      .then(user => this.setState({ isLoggedin: true, user }))
      .then(e => console.log(this.state))
      .catch(err => console.log(err));
  };

  login = user => {
    const { username, password } = user;

    authService
      .login({ username, password })
      .then(user => this.setState({ isLoggedin: true, user }))
      .catch(err => console.log(err));
  };

  logout = () => {
    authService
      .logout()
      .then(() => this.setState({ isLoggedin: false, user: null }))
      .catch(err => console.log(err));
  };

  render() {
    const { isLoading, isLoggedin, user } = this.state;
    const { login, logout, signup } = this;

    return (
      <MyContext.Provider value={{ isLoading, isLoggedin, user, login, logout, signup }}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export { withAuth };

export default AuthProvider;
