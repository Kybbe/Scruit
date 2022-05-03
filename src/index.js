import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todosReducer from './store/todosReducer';
import './index.css';
import App from './App';

const persistedState = localStorage.getItem('Scruit')
                       ? JSON.parse(localStorage.getItem('Scruit'))
                       : { todos: {} }

const store = createStore(
  todosReducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(()=>{
  localStorage.setItem('Scruit', JSON.stringify(store.getState()))
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={ store }>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);