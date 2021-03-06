import * as React from 'react';
import { withAuth } from '../lib/AuthProvider';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { TRouteProps, RouteComponent } from './AnonRoute'

const PrivateRoute: React.FC<TRouteProps> = ({ component, isLoggedin, isLoading, ...rest }) => {
  const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
    if (!Component) {
      return null
    }
    if (isLoading) {
      return <h1>Loading</h1>
    }
    if (isLoggedin) {
      return <Component {...props} />
    }
    return <Redirect to="/login" />
    }
  return <Route {...rest} render={renderFn(component)} />
}

export default withAuth(PrivateRoute as React.ComponentType<any>);