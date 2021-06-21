import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import noFound from './components/screens/customerSupport/noFound';
import firebase from 'firebase';
import { withRouter } from 'react-router';
import { useSelector, useDispatch, connect } from 'react-redux';
import { setUser } from './actions/customerSupport/actionCreators';
import { setClientUser } from './actions/client/actionCreators';
import Loaders from './components/screens/customerSupport/Loaders';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/screens/customerSupport/Dashboard';
import Popup from './components/screens/client/Popup';
import _ from 'lodash';

function Routes(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.isLaoding);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref('users')
          .orderByChild('id')
          .equalTo(user.uid)
          .on('value', function (snapshot) {
            let logUser = _.values(snapshot.val());
            if (logUser[0].role === 0) {
              dispatch(setClientUser(user));
              console.log('client');
              // props.history.push('/client');
            } else {
              console.log('cuatomer');
              dispatch(setUser(user));
              props.history.push('/');
            }
            // if (logUser[0]) {
            //   // console.log(logUser[0].role);
            //   console.log(logUser[0]);
            //   if (logUser[0]['role'] === 1) {
            //     dispatch(setUser(user));
            //     props.history.push('/');
            //   }
            //   if (logUser[0]['user'] === 0) {
            //     dispatch(setClientUser(user));
            //     props.history.push('/client');
            //   }
            // }
            // if (user.role === 1) {
            //   dispatch(setUser(user));
            //   props.history.push('/');
            // }
            // if (user.role === 0) {
            //   dispatch(setClientUser(user));
            //   props.history.push('/client');
            // } else {
            //   // dispatch(clearUser());
            //   // props.history.push('/login');
            // }
          });
      }
    });
  }, []);

  return loading ? (
    <Loaders />
  ) : (
    <div>
      <Switch>
        {/* <Route path='/' exact component={App} /> */}
        <Route path='/client' exact component={Popup} />
        <PrivateRoute path='/' exact component={Dashboard} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <Route component={noFound} />
      </Switch>
    </div>
  );
}

export default connect()(withRouter(Routes));
