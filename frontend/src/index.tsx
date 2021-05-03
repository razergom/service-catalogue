import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from './models/browser-history'
import { App } from './App'
import { ToastContainer } from 'react-toastify'
import { Router } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import './styles/styles.scss'

const Index = () => (
    <Router history={browserHistory}>
        <App />
        <ToastContainer
            position="top-right"
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl
            draggable
            pauseOnHover
            autoClose={3000}
            pauseOnFocusLoss={false}
        />
    </Router>
)

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
