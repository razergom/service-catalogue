import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history'
import { App } from './App'
import { BrowserRouter, Router } from 'react-router-dom'
import './styles/styles.scss'

const Index = () => (
    <Router history={createBrowserHistory()}>
        <App />
    </Router>
)

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
