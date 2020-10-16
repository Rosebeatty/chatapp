import * as React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps, withRouter } from 'react-router-dom';

export type RouteComponent = React.FC<RouteComponentProps<{}>> | React.ComponentClass<TRouteProps> | React.ComponentClass<any>

export interface TRouteProps extends RouteProps {
  isLoggedin: boolean;
  isLoading: boolean
}

const AnonRoute: React.FC<TRouteProps> = ({ component, isLoggedin, isLoading, ...rest }) => {
  const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
    if (!Component) {
      return null
    }
    if (isLoading) {
      return <h1>Loading</h1>
    }
    if (!isLoggedin) {
      return <Component {...props} />
    }
    return <Redirect to="/" />
    }
  return <Route {...rest} render={renderFn(component)} />
}

export default withRouter(AnonRoute as React.ComponentType<any>);