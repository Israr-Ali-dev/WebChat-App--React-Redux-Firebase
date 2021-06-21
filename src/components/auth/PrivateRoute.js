import React from 'react';
import { Route, Redirect } from 'react-router-dom';
// import { isLogin } from '../utils';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = useSelector(
    (state) => state.customerSupportReducer.currentUser
  );
  const clientUser = useSelector((state) => state.clientReducer.clientUser);

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route
      {...rest}
      render={(props) =>
        currentUser || clientUser ? (
          <Component {...props} />
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default PrivateRoute;
