import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import customerSupportReducer from './reducers/customerSupportReducer';
import clientReducer from './reducers/clientReducer';

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer = combineReducers({
  customerSupportReducer,
  clientReducer,
});

const store = createStore(rootReducer, devToolsEnhancer());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// ReactDOM.render(<App />, document.getElementById('root'));
