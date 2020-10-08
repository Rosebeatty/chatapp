import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// IMPORT REDUX
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import chatReducer from './redux/reducers/chatReducer';

// CREATE STORE IMPORTING THE REDUCER
const store = createStore(chatReducer);

// PROVIDE STORE TO THE APP
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
